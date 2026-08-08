import { SectionHeading } from "@/components/site/SectionHeading";
import { WHY_US } from "@/lib/firm-data";

export function WhyUsSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Araya Law Office"
          title="Why clients trust us"
          lead="A disciplined, confidential and clearly communicated approach to every mandate we accept."
        />
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item) => (
            <div key={item.n} className="border-t border-navy/15 pt-6">
              <span className="font-serif text-3xl text-gold">{item.n}</span>
              <h3 className="mt-3 text-lg text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}