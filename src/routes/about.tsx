import { createFileRoute } from "@tanstack/react-router";

import aboutDetail from "@/assets/about-detail.jpg";
import { Icon } from "@/components/site/Icon";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { WhyUsSection } from "@/components/site/WhyUsSection";
import { CORE_VALUES } from "@/lib/firm-data";

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
              <p>
                Araya Law Office was established in Addis Ababa to serve clients who need
                dependable legal counsel delivered with clarity and discretion. What began as a
                litigation-focused practice has grown into a full-service office covering civil,
                corporate, regulatory, and personal legal matters.
              </p>
              <p>
                <strong className="text-navy">Legal philosophy.</strong> We believe good legal work
                begins with listening. Before recommending a course of action we establish the
                commercial or personal outcome the client actually needs, then design the shortest
                legally sound route to it — whether that is negotiation, mediation, or litigation.
              </p>
              <p>
                <strong className="text-navy">Areas of expertise.</strong> Civil litigation,
                corporate and commercial law, contracts, property and real estate, family law,
                employment and labor, criminal defense, administrative and regulatory practice,
                immigration and nationality, and alternative dispute resolution.
              </p>
              <p>
                <strong className="text-navy">Commitment to clients.</strong> Every client receives
                a named attorney, realistic timelines, transparent fees, and updates in plain
                language. Sensitive matters are handled by a limited team on a need-to-know basis.
              </p>
              <p>
                <strong className="text-navy">Professional standards.</strong> Our attorneys are
                licensed to appear before the Federal Courts of Ethiopia and practise in accordance
                with the professional and ethical obligations of the Ethiopian bar, including strict
                confidentiality and conflict-of-interest screening.
              </p>
              <p>
                <strong className="text-navy">Experience and qualifications.</strong> The team
                combines LL.B and LL.M qualifications, certified mediation training, and decades of
                combined courtroom and advisory experience across domestic and cross-border matters.
              </p>
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
              <h3 className="eyebrow text-gold">Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To provide reliable, ethical, and effective legal services while protecting our
                clients' rights and interests.
              </p>
              <h3 className="eyebrow mt-8 text-gold">Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                To become a trusted and respected legal services provider recognized for
                professionalism, integrity, and successful client representation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Core Values" title="What guides our work" align="center" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_VALUES.map((v) => (
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