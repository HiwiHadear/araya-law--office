import { Link, createFileRoute } from "@tanstack/react-router";

import aboutDetail from "@/assets/about-detail.jpg";
import heroOffice from "@/assets/hero-office.jpg";
import { ConsultationSection } from "@/components/site/ConsultationSection";
import { ContactSection } from "@/components/site/ContactSection";
import { FaqSection } from "@/components/site/FaqSection";
import { Icon } from "@/components/site/Icon";
import { InsightsGrid } from "@/components/site/InsightsGrid";
import { PracticeAreasGrid } from "@/components/site/PracticeAreasGrid";
import { SectionHeading } from "@/components/site/SectionHeading";
import { TeamGrid } from "@/components/site/TeamGrid";
import { WhyUsSection } from "@/components/site/WhyUsSection";
import { Button } from "@/components/ui/button";
import { CORE_VALUES } from "@/lib/firm-data";
import { useLang } from "@/lib/i18n";

const TITLE = "Araya Law Office — Attorneys & Legal Advisors in Addis Ababa";
const DESC =
  "Professional legal representation and trusted advisory services for individuals, businesses, and organizations in Ethiopia. Book a confidential consultation.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const { t } = useLang();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy">
        <img
          src={heroOffice}
          alt="Boardroom of Araya Law Office at dusk"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 sm:py-36 lg:px-8">
          <div className="animate-rise max-w-3xl">
            <p className="eyebrow text-gold">{t("hero.firm")}</p>
            <h1 className="mt-6 text-4xl leading-[1.05] text-navy-foreground sm:text-6xl">
              {t("hero.tagline")}
            </h1>
            <span className="gold-rule mt-8" />
            <p className="mt-8 max-w-xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              {t("hero.lead")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="gold" size="xl">
                <Link to="/book">{t("cta.bookLong")}</Link>
              </Button>
              <Button asChild variant="outlineGold" size="xl">
                <Link to="/practice-areas">{t("cta.practice")}</Link>
              </Button>
            </div>
            <p className="mt-12 text-xs tracking-[0.18em] text-navy-foreground/55 uppercase">
              {t("hero.trust")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="About the Firm"
              title="Professional. Ethical. Client-focused."
              lead="Araya Law Office is a full-service legal practice based in Addis Ababa, advising individuals, private companies, and institutions across litigation, corporate, and regulatory matters. Our work is built on rigorous legal analysis, strict confidentiality, and clear communication at every stage."
            />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow text-gold">Mission</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To provide reliable, ethical, and effective legal services while protecting our
                  clients' rights and interests.
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-gold">Vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To become a trusted and respected legal services provider recognized for
                  professionalism, integrity, and successful client representation.
                </p>
              </div>
            </div>
            <Button asChild variant="outlineNavy" size="lg" className="mt-10">
              <Link to="/about">More About Us</Link>
            </Button>
          </div>
          <img
            src={aboutDetail}
            alt="Brass scales of justice beside leather-bound law books"
            loading="lazy"
            width={1200}
            height={1408}
            className="aspect-4/5 w-full object-cover shadow-elegant"
          />
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Core Values"
            title="The standards behind every mandate"
            align="center"
          />
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

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Practice Areas"
            title="Legal services across ten core disciplines"
            lead="Focused expertise, coordinated across teams when a matter demands more than one discipline."
          />
          <div className="mt-14">
            <PracticeAreasGrid limit={6} />
          </div>
          <Button asChild variant="outlineNavy" size="lg" className="mt-10">
            <Link to="/practice-areas">All Practice Areas</Link>
          </Button>
        </div>
      </section>

      <WhyUsSection />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Our Legal Team"
            title="Experienced counsel, personally accountable"
            lead="Each matter is led by a named attorney who remains your point of contact from instruction to resolution."
          />
          <div className="mt-14">
            <TeamGrid />
          </div>
        </div>
      </section>

      <ConsultationSection />

      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Legal Insights"
            title="Latest articles from our knowledge center"
            lead="Practical guidance on Ethiopian law, written for clients rather than lawyers."
          />
          <div className="mt-14">
            <InsightsGrid limit={3} />
          </div>
          <Button asChild variant="outlineNavy" size="lg" className="mt-10">
            <Link to="/insights">Read All Insights</Link>
          </Button>
        </div>
      </section>

      <FaqSection />
      <ContactSection />
    </>
  );
}
