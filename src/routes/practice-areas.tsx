import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/PageHero";
import { PracticeAreasGrid } from "@/components/site/PracticeAreasGrid";
import { WhyUsSection } from "@/components/site/WhyUsSection";

const TITLE = "Practice Areas — Araya Law Firm, Addis Ababa";
const DESC =
  "Civil litigation, corporate and commercial law, contracts, property, family, employment, criminal defense, regulatory, immigration, and dispute resolution.";

export const Route = createFileRoute("/practice-areas")({
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
  component: PracticeAreasPage,
});

function PracticeAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Practice Areas"
        title="Legal services across ten core disciplines"
        lead="Whether your matter is a single contract review or multi-year litigation, it is handled by attorneys who practise in that field every day."
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <PracticeAreasGrid />
        </div>
      </section>
      <WhyUsSection />
    </>
  );
}