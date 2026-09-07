import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCopy, usePracticeAreas } from "@/lib/firm-content";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255),
  service: z.string().min(1),
  matter: z.string().trim().min(10).max(1500),
});

const EMPTY = { name: "", phone: "", email: "", service: "", matter: "" };

export function CaseSubmissionForm() {
  const c = useCopy();
  const practiceAreas = usePracticeAreas();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof EMPTY) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success(c("case.toastTitle"), { description: c("case.toastDesc") });
    setForm(EMPTY);
  };

  const err = (key: string) =>
    errors[key] ? <p className="text-xs text-destructive">{c("case.error")}</p> : null;

  return (
    <section className="bg-gradient-navy py-24 text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow={c("case.eyebrow")}
            title={c("case.title")}
            lead={c("case.lead")}
            tone="dark"
          />
          <div className="mt-10 flex gap-3 border border-navy-foreground/15 p-5 text-xs leading-relaxed text-navy-foreground/70">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p>{c("case.disclaimer")}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-background p-7 text-foreground shadow-elegant sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cs-name">{c("case.name")}</Label>
              <Input
                id="cs-name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                maxLength={100}
              />
              {err("name")}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cs-phone">{c("case.phone")}</Label>
              <Input
                id="cs-phone"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                maxLength={30}
              />
              {err("phone")}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="cs-email">{c("case.email")}</Label>
              <Input
                id="cs-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                maxLength={255}
              />
              {err("email")}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label>{c("case.service")}</Label>
              <Select value={form.service} onValueChange={set("service")}>
                <SelectTrigger>
                  <SelectValue placeholder={c("case.servicePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {practiceAreas.map((p) => (
                    <SelectItem key={p.slug} value={p.title}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {err("service")}
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="cs-matter">{c("case.matter")}</Label>
              <Textarea
                id="cs-matter"
                rows={5}
                value={form.matter}
                onChange={(e) => set("matter")(e.target.value)}
                maxLength={1500}
                placeholder={c("case.matterPlaceholder")}
              />
              {err("matter")}
            </div>
          </div>
          <Button type="submit" variant="gold" className="mt-7 w-full sm:w-auto">
            {c("case.submit")}
          </Button>
        </form>
      </div>
    </section>
  );
}
