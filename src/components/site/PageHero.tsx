export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <section className="bg-gradient-navy py-20 text-navy-foreground sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        <span className="gold-rule mt-7" />
        {lead && (
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-navy-foreground/70">{lead}</p>
        )}
      </div>
    </section>
  );
}