import { createFileRoute } from "@tanstack/react-router";

import { ContactSection } from "@/components/site/ContactSection";
import { FaqSection } from "@/components/site/FaqSection";
import { PageHero } from "@/components/site/PageHero";

const TITLE = "Contact Araya Law Office — Addis Ababa Legal Consultation";
const DESC =
  "Contact Araya Law Office in Addis Ababa by phone, email, or WhatsApp, or send an inquiry. Office hours, address, and map included.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Speak with our legal team"
        lead="We respond to inquiries within one business day. For urgent matters, please call the office directly."
      />
      <ContactSection />
      <FaqSection />
    </>
  );
}