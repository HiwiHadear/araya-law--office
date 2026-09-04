import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { PRACTICE_AREAS } from "@/lib/firm-data";
import { CASE_STATUSES, STATUS_LABELS, fetchCases, fetchProfiles, formatDate } from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/cases/")({
  head: () => ({ meta: [{ title: "Case Management — Araya Law Firm" }] }),
  component: CasesPage,
});

const caseSchema = z.object({
  case_number: z.string().trim().min(2).max(60),
  title: z.string().trim().min(3).max(160),
  practice_area: z.string().trim().max(80).optional(),
  court: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  status: z.enum(CASE_STATUSES),
  client_id: z.string().uuid().optional(),
});

function CasesPage() {
  const { data: me } = useCurrentUser();
  const queryClient = useQueryClient();
  const cases = useQuery({ queryKey: ["cases"], queryFn: fetchCases });
  const profiles = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    enabled: Boolean(me?.isStaff),
  });
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<(typeof CASE_STATUSES)[number]>("intake");
  const [clientId, setClientId] = useState<string>("");
  const [area, setArea] = useState<string>("");

  const createCase = useMutation({
    mutationFn: async (payload: z.infer<typeof caseSchema>) => {
      const { error } = await supabase.from("cases").insert({
        case_number: payload.case_number,
        title: payload.title,
        status: payload.status,
        practice_area: payload.practice_area ?? null,
        court: payload.court ?? null,
        description: payload.description ?? null,
        client_id: payload.client_id ?? null,
        lead_lawyer_id: me?.user.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Case created");
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = caseSchema.safeParse({
      case_number: form.get("case_number"),
      title: form.get("title"),
      practice_area: area || undefined,
      court: (form.get("court") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      status,
      client_id: clientId || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the case details");
      return;
    }
    createCase.mutate(parsed.data);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Cases</h2>
          <p className="text-sm text-muted-foreground">
            {me?.isStaff
              ? "All matters you are authorised to view."
              : "Matters linked to your account."}
          </p>
        </div>
        {me?.isStaff && (
          <Button variant="gold" onClick={() => setOpen((v) => !v)}>
            {open ? "Close" : "New case"}
          </Button>
        )}
      </div>

      {open && me?.isStaff && (
        <form onSubmit={submit} className="grid gap-4 border border-border bg-background p-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="case_number">Case number</Label>
            <Input id="case_number" name="case_number" required maxLength={60} />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required maxLength={160} />
          </div>
          <div>
            <Label>Practice area</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {PRACTICE_AREAS.map((p) => (
                  <SelectItem key={p.slug} value={p.title}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="court">Court</Label>
            <Input id="court" name="court" maxLength={120} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Link a client" />
              </SelectTrigger>
              <SelectContent>
                {(profiles.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name ?? p.email ?? p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Summary</Label>
            <Textarea id="description" name="description" maxLength={2000} rows={3} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="gold" disabled={createCase.isPending}>
              Create case
            </Button>
          </div>
        </form>
      )}

      <div className="border border-border bg-background">
        {cases.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading cases…</p>
        ) : cases.data?.length ? (
          <ul className="divide-y divide-border">
            {cases.data.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: c.id }}
                    className="font-medium hover:text-royal"
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.case_number} · {c.practice_area ?? "General"} · {c.court ?? "Court TBC"} ·
                    opened {formatDate(c.opened_at)}
                  </p>
                </div>
                <Badge variant="secondary">{STATUS_LABELS[c.status]}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">No cases to display yet.</p>
        )}
      </div>
    </div>
  );
}