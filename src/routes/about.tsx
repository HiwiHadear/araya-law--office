import { createFileRoute } from "@tanstack/react-router";

import aboutDetail from "@/assets/about-detail.jpg";
import { Icon } from "@/components/site/Icon";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhyUsSection } from "@/components/site/WhyUsSection";
import { useAboutBody, useCopy, useCoreValues } from "@/lib/firm-content";

const TITLE = "About Araya Law Office — History, Mission & Core Values";
const DESC =
  "Learn about Araya Law Office: our establishment, legal philosophy, areas of expertise, professional standards, and commitment to clients in Ethiopia.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function AboutPage() {
  const body = useAboutBody();
  const coreValues = useCoreValues();
  const c = useCopy();

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A practice built on judgment, discretion, and results"
        lead="Araya Law Office advises individuals, businesses, and institutions across Ethiopia with the rigour of an international firm and the accessibility of a trusted local adviser."
      />

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <SectionHeading eyebrow="Who We Are" title="Who we are" />
            <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
              {body.map((p) => (
                <p key={p.text}>
                  {p.label ? <strong className="text-navy">{p.label} </strong> : null}
                  {p.text}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <img
              src={aboutDetail}
              alt="Brass scales of justice beside leather-bound law books"
              loading="lazy"
              width={1200}
              height={1408}
              className="aspect-3/4 w-full object-cover shadow-elegant"
            />
            <div className="bg-surface p-8">
              <h3 className="eyebrow text-gold">{c("about.mission")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c("about.missionText")}
              </p>
              <h3 className="eyebrow mt-8 text-gold">{c("about.vision")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c("about.visionText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow={c("about.values")} title={c("about.valuesTitle")} align="center" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {coreValues.map((v) => (
              <div key={v.title} className="bg-background p-7 shadow-card">
                <Icon name={v.icon} className="h-6 w-6 text-gold" />
                <h3 className="mt-5 text-lg text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyUsSection />
    </>
  );
}