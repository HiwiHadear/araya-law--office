import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { LAWYERS } from "@/lib/firm-data";

export const Route = createFileRoute("/team/$slug")({
  loader: ({ params }) => {
    const lawyer = LAWYERS.find((l) => l.slug === params.slug);
    if (!lawyer) throw notFound();
    return { lawyer };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Profile unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.lawyer.name} — ${loaderData.lawyer.role} | Araya Law Office`;
    const desc = loaderData.lawyer.bio;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LawyerProfile,
});

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="eyebrow text-gold">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LawyerProfile() {
  const { lawyer } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow={lawyer.role} title={lawyer.name} lead={lawyer.bio} />
      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <img
              src={lawyer.photo}
              alt={`${lawyer.name}, ${lawyer.role}`}
              loading="lazy"
              width={800}
              height={1008}
              className="aspect-4/5 w-full object-cover shadow-elegant"
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <Link to="/book">Book Consultation</Link>
              </Button>
              <Button asChild variant="outlineNavy">
                <Link to="/contact">Contact Lawyer</Link>
              </Button>
            </div>
          </div>
          <div className="space-y-10">
            <Block title="Areas of specialization" items={lawyer.practice} />
            <Block title="Education" items={lawyer.education} />
            <Block title="Experience" items={lawyer.experience} />
            <Block title="Professional memberships" items={lawyer.memberships} />
            <Block title="Languages" items={lawyer.languages} />
            <div>
              <h2 className="eyebrow text-gold">Qualifications</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {lawyer.qualifications}
              </p>
            </div>
            <Button asChild variant="link" className="px-0">
              <Link to="/team">← Back to all attorneys</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}