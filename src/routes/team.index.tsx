import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { TeamGrid } from "@/components/site/TeamGrid";

const TITLE = "Our Legal Team — Attorneys at Araya Law Office";
const DESC =
  "Meet the attorneys of Araya Law Office: qualifications, areas of practice, languages, and professional memberships of our Addis Ababa legal team.";

export const Route = createFileRoute("/team/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="Experienced counsel, personally accountable"
        lead="Each matter is led by a named attorney who remains your point of contact from instruction to resolution."
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <TeamGrid />
        </div>
      </section>
    </>
  );
}