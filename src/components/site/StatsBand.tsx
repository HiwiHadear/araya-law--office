import { useEffect, useRef, useState } from "react";

import { useLang } from "@/lib/i18n";

type Stat = { value: number; suffix: string; labelKey: "stats.years" | "stats.cases" | "stats.areas" | "stats.langs" };

const STATS: Stat[] = [
  { value: 15, suffix: "+", labelKey: "stats.years" },
  { value: 500, suffix: "+", labelKey: "stats.cases" },
  { value: 10, suffix: "", labelKey: "stats.areas" },
  { value: 4, suffix: "", labelKey: "stats.langs" },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(target);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return (
    <span className="font-serif text-4xl text-gold sm:text-5xl">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Animated statistics band shown under the hero on the home page. */
export function StatsBand() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-gradient-navy py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 text-center lg:grid-cols-4 lg:px-8">
        {STATS.map((s) => (
          <div key={s.labelKey}>
            <CountUp target={s.value} suffix={s.suffix} active={active} />
            <p className="mt-3 text-xs tracking-[0.18em] text-navy-foreground/70 uppercase">
              {t(s.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
