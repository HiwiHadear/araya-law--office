import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Icon } from "@/components/site/Icon";
import { useCopy, usePracticeAreas } from "@/lib/firm-content";

export function PracticeAreasGrid({ limit }: { limit?: number }) {
  const all = usePracticeAreas();
  const c = useCopy();
  const areas = limit ? all.slice(0, limit) : all;

  return (
    <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {areas.map((area) => (
        <Link
          key={area.slug}
          to="/book"
          className="group flex flex-col bg-background p-8 transition-colors hover:bg-surface"
        >
          <span className="grid h-12 w-12 place-items-center border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
            <Icon name={area.icon} className="h-5 w-5" />
          </span>
          <h3 className="mt-6 text-xl text-navy">{area.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{area.description}</p>
          <span className="eyebrow mt-6 inline-flex items-center gap-1 text-royal opacity-0 transition-opacity group-hover:opacity-100">
            {c("team.requestAdvice")} <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
