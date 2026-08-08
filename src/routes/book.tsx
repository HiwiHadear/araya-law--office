import { createFileRoute } from "@tanstack/react-router";

import { ConsultationSection } from "@/components/site/ConsultationSection";
import { FaqSection } from "@/components/site/FaqSection";
import { PageHero } from "@/components/site/PageHero";

const TITLE = "Book a Consultation — Araya Law Office";
const DESC =
  "Book an office, telephone, video, or online legal consultation with an attorney at Araya Law Office. Select your service, lawyer, date, and time.";

export const Route = createFileRoute("/book")({
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
  component: BookPage,
});

function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Book a consultation"
        lead="Choose a legal service, an attorney, and a time. We confirm every appointment by phone or email before it is finalised."
      />
      <ConsultationSection />
      <FaqSection />
    </>
  );
}