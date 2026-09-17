import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Download, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { PRACTICE_AREAS } from "@/lib/firm-data";
import {
  CASE_STATUSES,
  STATUS_LABELS,
  downloadDocument,
  fetchCase,
  fetchCaseUpdates,
  fetchDocuments,
  fetchHearings,
  formatDate,
  formatDateTime,
  type CaseRow,
} from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/cases/$caseId")({
  head: () => ({ meta: [{ title: "Case File — Araya Law Firm" }] }),
  component: CaseDetail,
});

function CaseDetail() {
  const { caseId } = Route.useParams();
  const { data: me } = useCurrentUser();
  const queryClient = useQueryClient();
  const [visibleToClient, setVisibleToClient] = useState(true);
  const [uploading, setUploading] = useState(false);

  const caseQuery = useQuery({ queryKey: ["case", caseId], queryFn: () => fetchCase(caseId) });
  const updates = useQuery({
    queryKey: ["case-updates", caseId],
    queryFn: () => fetchCaseUpdates(caseId),
  });
  const hearings = useQuery({
    queryKey: ["hearings", caseId],
    queryFn: () => fetchHearings(caseId),
  });
  const documents = useQuery({
    queryKey: ["documents", caseId],
    queryFn: () => fetchDocuments(caseId),
  });

  const addUpdate = useMutation({
    mutationFn: async (note: string) => {
      const { error } = await supabase.from("case_updates").insert({
        case_id: caseId,
        note,
        visible_to_client: visibleToClient,
        author_id: me?.user.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Update added");
      void queryClient.invalidateQueries({ queryKey: ["case-updates", caseId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateCase = useMutation({
    mutationFn: async (payload: {
      title: string;
      practice_area: string | null;
      court: string | null;
      description: string | null;
      status: CaseRow["status"];
    }) => {
      const { error } = await supabase.from("cases").update(payload).eq("id", caseId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Case updated");
      void queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      void queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addHearing = useMutation({
    mutationFn: async (payload: { title: string; scheduled_at: string; court: string }) => {
      const { error } = await supabase.from("hearings").insert({
        case_id: caseId,
        title: payload.title,
        scheduled_at: new Date(payload.scheduled_at).toISOString(),
        court: payload.court || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hearing scheduled");
      void queryClient.invalidateQueries({ queryKey: ["hearings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleUpload(file: File) {
    setUploading(true);
    const path = `${caseId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
    const upload = await supabase.storage.from("case-documents").upload(path, file);
    if (upload.error) {
      setUploading(false);
      toast.error(upload.error.message);
      return;
    }
    const { error } = await supabase.from("documents").insert({
      case_id: caseId,
      name: file.name,
      storage_path: path,
      mime_type: file.type || null,
      size_bytes: file.size,
      visible_to_client: visibleToClient,
      uploaded_by: me?.user.id ?? null,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Document uploaded");
    void queryClient.invalidateQueries({ queryKey: ["documents"] });
  }

  const c = caseQuery.data;

  if (caseQuery.isLoading) return <p className="text-sm text-muted-foreground">Loading case…</p>;
  if (!c)
    return (
      <div>
        <p className="text-sm text-muted-foreground">
          This case is not available for your account.
        </p>
        <Link to="/cases" className="mt-4 inline-block text-sm text-royal hover:text-gold">
          Back to cases
        </Link>
      </div>
    );

  return (
    <div className="space-y-6">
      <Link
        to="/cases"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> All cases
      </Link>

      <header className="border border-border bg-background p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-gold">{c.case_number}</p>
            <h2 className="font-serif text-2xl">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.practice_area ?? "General"} · {c.court ?? "Court to be confirmed"} · opened{" "}
              {formatDate(c.opened_at)}
            </p>
          </div>
          <Badge variant="secondary">{STATUS_LABELS[c.status]}</Badge>
        </div>
        {c.description && <p className="mt-4 text-sm leading-relaxed">{c.description}</p>}
      </header>

      {me?.isStaff && (
        <section key={c.id + c.updated_at} className="border border-border bg-background p-6">
          <h3 className="font-serif text-lg">Manage case</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Edit the case details or change its status — set it to Closed when the matter is
            concluded.
          </p>
          <form
            className="mt-4 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const title = (form.get("title") as string)?.trim();
              if (!title) {
                toast.error("Title is required");
                return;
              }
              updateCase.mutate({
                title,
                practice_area: (form.get("practice_area") as string) || null,
                court: (form.get("court") as string)?.trim() || null,
                description: (form.get("description") as string)?.trim() || null,
                status: form.get("status") as CaseRow["status"],
              });
            }}
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={c.title} required maxLength={160} />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue={c.status}>
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
              <Label>Practice area</Label>
              <Select name="practice_area" defaultValue={c.practice_area ?? ""}>
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
              <Input id="court" name="court" defaultValue={c.court ?? ""} maxLength={120} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={c.description ?? ""}
                maxLength={2000}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="gold" disabled={updateCase.isPending}>
                Save changes
              </Button>
            </div>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <h4 className="flex items-center gap-2 font-serif text-base">
              <Sparkles className="h-4 w-4 text-gold" /> AI case note generator
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Jot down what happened in a few words. The assistant drafts a clear progress update
              for the client — review it before saving.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="ai_points">What happened</Label>
                <Textarea
                  id="ai_points"
                  rows={3}
                  maxLength={1200}
                  placeholder="e.g. filed statement of defence, next hearing set, waiting for client documents"
                  value={aiPoints}
                  onChange={(e) => setAiPoints(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={aiLanguage} onValueChange={(v) => setAiLanguage(v as AiLanguage)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">አማርኛ</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  disabled={draftNote.isPending}
                  onClick={() => {
                    const points = aiPoints.trim();
                    if (points.length < 3) {
                      toast.error("Add a few words about what happened first");
                      return;
                    }
                    draftNote.mutate({
                      caseTitle: c.title,
                      practiceArea: c.practice_area,
                      court: c.court,
                      status: STATUS_LABELS[c.status],
                      keyPoints: points,
                      language: aiLanguage,
                    });
                  }}
                >
                  {draftNote.isPending ? "Drafting…" : "Draft update"}
                </Button>
              </div>

              {aiDraft && (
                <div className="space-y-3">
                  <Label htmlFor="ai_draft">Draft update (editable)</Label>
                  <Textarea
                    id="ai_draft"
                    rows={7}
                    maxLength={2000}
                    value={aiDraft}
                    onChange={(e) => setAiDraft(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="gold"
                      disabled={addUpdate.isPending}
                      onClick={() => {
                        const note = aiDraft.trim();
                        if (!note) {
                          toast.error("The draft is empty");
                          return;
                        }
                        addUpdate.mutate(note, {
                          onSuccess: () => {
                            setAiDraft("");
                            setAiPoints("");
                          },
                        });
                      }}
                    >
                      Save as case update
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setAiDraft("")}>
                      Discard
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Saved with the “visible to the client” setting in Staff controls below.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {me?.isStaff && (
        <section className="border border-border bg-background p-6">
          <h3 className="font-serif text-lg">Staff controls</h3>
          <div className="mt-4 flex items-center gap-3">
            <Switch
              id="visible"
              checked={visibleToClient}
              onCheckedChange={setVisibleToClient}
            />
            <Label htmlFor="visible" className="text-sm font-normal">
              New notes and uploads are visible to the client
            </Label>
          </div>

          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const note = (new FormData(e.currentTarget).get("note") as string)?.trim();
              if (!note || note.length > 2000) {
                toast.error("Enter a note of up to 2000 characters");
                return;
              }
              addUpdate.mutate(note);
              e.currentTarget.reset();
            }}
          >
            <Label htmlFor="note">Add case update</Label>
            <Textarea id="note" name="note" rows={3} maxLength={2000} />
            <Button type="submit" variant="gold" disabled={addUpdate.isPending}>
              Save update
            </Button>
          </form>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const title = (form.get("h_title") as string)?.trim();
              const scheduled_at = form.get("h_when") as string;
              if (!title || !scheduled_at) {
                toast.error("Hearing title and date/time are required");
                return;
              }
              addHearing.mutate({ title, scheduled_at, court: form.get("h_court") as string });
              e.currentTarget.reset();
            }}
          >
            <div>
              <Label htmlFor="h_title">Hearing</Label>
              <Input id="h_title" name="h_title" maxLength={160} />
            </div>
            <div>
              <Label htmlFor="h_when">Date & time</Label>
              <Input id="h_when" name="h_when" type="datetime-local" />
            </div>
            <div>
              <Label htmlFor="h_court">Court</Label>
              <Input id="h_court" name="h_court" maxLength={120} />
            </div>
            <div className="sm:col-span-3">
              <Button type="submit" variant="outline" disabled={addHearing.isPending}>
                Schedule hearing
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Label htmlFor="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload document
            </Label>
            <Input
              id="file"
              type="file"
              className="mt-2"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
          </div>
        </section>
      )}

      <section className="border border-border bg-background p-6">
        <h3 className="font-serif text-lg">Case progress</h3>
        {updates.data?.length ? (
          <ul className="mt-4 space-y-4">
            {updates.data.map((u) => (
              <li key={u.id} className="border-l-2 border-gold/60 pl-4">
                <p className="text-sm leading-relaxed">{u.note}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(u.created_at)}
                  {!u.visible_to_client && " · internal only"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No updates recorded yet.</p>
        )}
      </section>

      <section className="border border-border bg-background p-6">
        <h3 className="font-serif text-lg">Hearings</h3>
        {hearings.data?.length ? (
          <ul className="mt-4 divide-y divide-border">
            {hearings.data.map((h) => (
              <li key={h.id} className="py-3">
                <p className="font-medium">{h.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(h.scheduled_at)} · {h.court ?? "Court TBC"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No hearings scheduled.</p>
        )}
      </section>

      <section className="border border-border bg-background p-6">
        <h3 className="font-serif text-lg">Documents</h3>
        {documents.data?.length ? (
          <ul className="mt-4 divide-y divide-border">
            {documents.data.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(d.created_at)}
                    {!d.visible_to_client && " · internal only"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const url = await downloadDocument(d.storage_path);
                      window.open(url, "_blank", "noopener");
                    } catch {
                      toast.error("Could not open this document");
                    }
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Open
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No documents yet.</p>
        )}
      </section>
    </div>
  );
}