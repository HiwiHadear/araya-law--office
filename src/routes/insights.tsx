import { createFileRoute } from "@tanstack/react-router";

import { InsightsGrid } from "@/components/site/InsightsGrid";
import { PageHero } from "@/components/site/PageHero";

const TITLE = "Legal Insights & Knowledge Center — Araya Law Office";
const DESC =
  "Articles on Ethiopian law: contracts, corporate compliance, employment rights, property transactions, dispute resolution, and your legal rights.";

export const Route = createFileRoute("/insights")({
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
  component: InsightsPage,
});

function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal Insights"
        title="Knowledge center"
        lead="Practical guidance on Ethiopian law, written for clients rather than lawyers."
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <InsightsGrid />
        </div>
      </section>
    </>
  );
}