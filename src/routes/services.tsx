import { createFileRoute } from "@tanstack/react-router";

import { CaseSubmissionForm } from "@/components/site/CaseSubmissionForm";
import { PageHero } from "@/components/site/PageHero";
import { PracticeAreasGrid } from "@/components/site/PracticeAreasGrid";
import { useCopy } from "@/lib/firm-content";

const TITLE = "Services & Case Submission — Araya Law Firm, Addis Ababa";
const DESC =
  "Explore our legal services across ten practice areas and submit your case online. Serving Addis Ababa in English, Amharic, and Chinese.";

export const Route = createFileRoute("/services")({
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
  component: ServicesPage,
});

function ServicesPage() {
  const c = useCopy();
  return (
    <>
      <PageHero
        eyebrow={c("services.eyebrow")}
        title={c("services.title")}
        lead={c("services.lead")}
      />
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <PracticeAreasGrid />
        </div>
      </section>
      <CaseSubmissionForm />
    </>
  );
}
