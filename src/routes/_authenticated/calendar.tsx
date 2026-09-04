import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { fetchCases, fetchHearings, formatDateTime } from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/calendar")({
  head: () => ({ meta: [{ title: "Court Calendar — Araya Law Firm" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const hearings = useQuery({ queryKey: ["hearings"], queryFn: () => fetchHearings() });
  const cases = useQuery({ queryKey: ["cases"], queryFn: fetchCases });

  const caseLabel = (id: string | null) => {
    const found = cases.data?.find((c) => c.id === id);
    return found ? `${found.case_number} · ${found.title}` : "Unlinked matter";
  };

  const now = new Date();
  const list = hearings.data ?? [];
  const upcoming = list.filter((h) => new Date(h.scheduled_at) >= now);
  const past = list.filter((h) => new Date(h.scheduled_at) < now).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Court Calendar</h2>
        <p className="text-sm text-muted-foreground">
          Hearing dates, courts, and locations for your matters.
        </p>
      </div>

      <Section title="Upcoming">
        {upcoming.length ? (
          <ul className="divide-y divide-border">
            {upcoming.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-medium">{h.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {caseLabel(h.case_id)} · {h.court ?? "Court TBC"}
                    {h.location ? ` · ${h.location}` : ""}
                  </p>
                  {h.notes && <p className="mt-1 text-xs text-muted-foreground">{h.notes}</p>}
                </div>
                <Badge variant="secondary">{formatDateTime(h.scheduled_at)}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted-foreground">No upcoming hearings.</p>
        )}
      </Section>

      <Section title="Past">
        {past.length ? (
          <ul className="divide-y divide-border">
            {past.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-medium text-muted-foreground">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{caseLabel(h.case_id)}</p>
                </div>
                <Badge variant="outline">{formatDateTime(h.scheduled_at)}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted-foreground">No past hearings recorded.</p>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-background">
      <h3 className="border-b border-border px-5 py-3 font-serif text-lg">{title}</h3>
      {children}
    </section>
  );
}