import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Briefcase, CalendarDays, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/lib/auth";
import {
  STATUS_LABELS,
  fetchAppointments,
  fetchCases,
  fetchDocuments,
  fetchHearings,
  formatDate,
  formatDateTime,
} from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "Portal Overview — Araya Law Office" }] }),
  component: PortalOverview,
});

function PortalOverview() {
  const { data: me } = useCurrentUser();
  const cases = useQuery({ queryKey: ["cases"], queryFn: fetchCases });
  const hearings = useQuery({ queryKey: ["hearings"], queryFn: () => fetchHearings() });
  const documents = useQuery({ queryKey: ["documents"], queryFn: () => fetchDocuments() });
  const appointments = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    enabled: Boolean(me?.isStaff),
  });

  const upcoming = (hearings.data ?? []).filter((h) => new Date(h.scheduled_at) >= new Date());

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Briefcase} label="Cases" value={cases.data?.length ?? 0} />
        <Stat icon={CalendarDays} label="Upcoming hearings" value={upcoming.length} />
        <Stat icon={FileText} label="Documents" value={documents.data?.length ?? 0} />
      </div>

      <Panel title="Your cases" action={{ to: "/cases", label: "View all" }}>
        {cases.isLoading ? (
          <Empty>Loading…</Empty>
        ) : cases.data?.length ? (
          <ul className="divide-y divide-border">
            {cases.data.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link
                    to="/cases/$caseId"
                    params={{ caseId: c.id }}
                    className="font-medium text-foreground hover:text-royal"
                  >
                    {c.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {c.case_number} · {c.practice_area ?? "General"} · opened {formatDate(c.opened_at)}
                  </p>
                </div>
                <Badge variant="secondary">{STATUS_LABELS[c.status]}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>
            No cases are linked to your account yet. Our team will connect your matter once it is
            opened.
          </Empty>
        )}
      </Panel>

      <Panel title="Next hearings" action={{ to: "/calendar", label: "Open calendar" }}>
        {upcoming.length ? (
          <ul className="divide-y divide-border">
            {upcoming.slice(0, 5).map((h) => (
              <li key={h.id} className="py-3">
                <p className="font-medium">{h.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(h.scheduled_at)} · {h.court ?? "Court to be confirmed"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No hearings scheduled.</Empty>
        )}
      </Panel>

      {me?.isStaff && (
        <Panel title="Recent consultation requests">
          {appointments.data?.length ? (
            <ul className="divide-y divide-border">
              {appointments.data.slice(0, 6).map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-medium">{a.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.consultation_type ?? "Consultation"} · {formatDate(a.preferred_date)} ·{" "}
                      {a.email}
                    </p>
                  </div>
                  <Badge variant="outline">{a.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No consultation requests yet.</Empty>
          )}
        </Panel>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: number;
}) {
  return (
    <div className="border border-border bg-background p-5">
      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
      <p className="mt-3 font-serif text-3xl leading-none">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl">{title}</h2>
        {action && (
          <Link
            to={action.to as "/cases"}
            className="text-xs uppercase tracking-widest text-royal hover:text-gold"
          >
            {action.label}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}