import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DraftInput = z.object({
  caseTitle: z.string().min(1).max(200),
  practiceArea: z.string().max(120).nullable(),
  court: z.string().max(160).nullable(),
  status: z.string().max(40),
  keyPoints: z.string().min(3).max(1200),
  language: z.enum(["en", "am", "zh"]).default("en"),
});

const LANGUAGE_LABEL = {
  en: "English",
  am: "Amharic",
  zh: "Simplified Chinese",
} as const;

export const draftCaseNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => DraftInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const prompt = [
      `Case: ${data.caseTitle}`,
      `Practice area: ${data.practiceArea ?? "General"}`,
      `Court: ${data.court ?? "Not yet confirmed"}`,
      `Current status: ${data.status}`,
      `Notes from the lawyer: ${data.keyPoints}`,
      "",
      `Write the client-facing progress update in ${LANGUAGE_LABEL[data.language]}.`,
    ].join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a legal assistant at an Ethiopian law firm drafting case progress updates for clients. " +
              "Write 2-4 short paragraphs, plain and reassuring, no legal jargon, no invented facts, " +
              "no dates or outcomes that were not provided, and no promises about results. " +
              "Return only the update text, with no headings or markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      let message = body;
      try {
        message = JSON.parse(body)?.error?.message ?? body;
      } catch {
        // keep raw body
      }
      if (res.status === 429) throw new Error("The AI assistant is busy. Please try again shortly.");
      if (res.status === 402 || res.status === 403) throw new Error(message);
      throw new Error(message || "Could not draft the note.");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("The AI assistant returned an empty draft. Please try again.");
    return { note: text };
  });
