import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCopy, useLawyers } from "@/lib/firm-content";

export function TeamGrid() {
  const lawyers = useLawyers();
  const c = useCopy();

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {lawyers.map((l) => (
        <article key={l.slug} className="group flex flex-col bg-background shadow-card">
          <div className="overflow-hidden bg-navy">
            <img
              src={l.photo}
              alt={`${l.name}, ${l.role} at Araya Law Office`}
              loading="lazy"
              width={800}
              height={1008}
              className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col p-7">
            <h3 className="text-xl text-navy">{l.name}</h3>
            <p className="eyebrow mt-2 text-gold">{l.role}</p>
            <p className="mt-5 text-xs font-semibold tracking-wide text-navy/60 uppercase">
              {c("team.practice")}
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {l.practice.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="mt-5 text-xs font-semibold tracking-wide text-navy/60 uppercase">
              {c("team.qualifications")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{l.qualifications}</p>
            <div className="mt-7 flex flex-wrap gap-3 pt-1">
              <Button asChild variant="navy" size="sm">
                <Link to="/team/$slug" params={{ slug: l.slug }}>
                  {c("team.viewProfile")}
                </Link>
              </Button>
              <Button asChild variant="outlineNavy" size="sm">
                <Link to="/contact">{c("team.contact")}</Link>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
