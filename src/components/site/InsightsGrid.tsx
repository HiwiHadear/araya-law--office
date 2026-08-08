import { Clock, User } from "lucide-react";

import { ARTICLES } from "@/lib/firm-data";

export function InsightsGrid({ limit }: { limit?: number }) {
  const items = limit ? ARTICLES.slice(0, limit) : ARTICLES;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <article key={a.slug} className="group flex flex-col border border-border bg-background">
          <div className="flex h-40 items-end bg-gradient-navy p-6">
            <span className="eyebrow bg-gold px-2.5 py-1 text-gold-foreground">{a.category}</span>
          </div>
          <div className="flex flex-1 flex-col p-7">
            <p className="eyebrow text-muted-foreground">{a.date}</p>
            <h3 className="mt-3 text-xl leading-snug text-navy transition-colors group-hover:text-royal">
              {a.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gold" /> {a.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gold" /> {a.readTime}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}