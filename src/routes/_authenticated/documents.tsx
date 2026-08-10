import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { downloadDocument, fetchCases, fetchDocuments, formatDateTime } from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({ meta: [{ title: "Document Center — Araya Law Office" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const documents = useQuery({ queryKey: ["documents"], queryFn: () => fetchDocuments() });
  const cases = useQuery({ queryKey: ["cases"], queryFn: fetchCases });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Document Center</h2>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Files are stored privately and shared through
          short-lived secure links.
        </p>
      </div>

      <div className="border border-border bg-background">
        {documents.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading documents…</p>
        ) : documents.data?.length ? (
          <ul className="divide-y divide-border">
            {documents.data.map((d) => {
              const match = cases.data?.find((c) => c.id === d.case_id);
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {match ? (
                        <Link
                          to="/cases/$caseId"
                          params={{ caseId: match.id }}
                          className="hover:text-royal"
                        >
                          {match.case_number} · {match.title}
                        </Link>
                      ) : (
                        "Unlinked matter"
                      )}{" "}
                      · {formatDateTime(d.created_at)}
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
              );
            })}
          </ul>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">
            No documents have been shared with you yet.
          </p>
        )}
      </div>
    </div>
  );
}