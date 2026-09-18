import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import arayaLogo from "@/assets/araya-logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { FIRM } from "@/lib/firm-data";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/practice-areas", key: "nav.practice" },
  { to: "/services", key: "nav.services" },
  { to: "/team", key: "nav.team" },
  { to: "/insights", key: "nav.insights" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-navy text-navy-foreground transition-shadow",
        scrolled && "shadow-elegant",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={arayaLogo.url}
            alt="Araya Law Firm seal"
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-serif text-lg leading-tight tracking-wide">
              {t("hero.firm")}
            </span>
            <span className="eyebrow block text-gold/80">{t("attorneys")}</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="text-sm text-navy-foreground/80 transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-1 text-xs md:flex">
            <button
              onClick={() => setLang("en")}
              className={cn(
                "cursor-pointer px-1 transition-colors",
                lang === "en" ? "text-gold" : "text-navy-foreground/60 hover:text-navy-foreground",
              )}
            >
              EN
            </button>
            <span className="text-navy-foreground/30">|</span>
            <button
              onClick={() => setLang("am")}
              className={cn(
                "cursor-pointer px-1 transition-colors",
                lang === "am" ? "text-gold" : "text-navy-foreground/60 hover:text-navy-foreground",
              )}
            >
              አማ
            </button>
            <span className="text-navy-foreground/30">|</span>
            <button
              onClick={() => setLang("zh")}
              className={cn(
                "cursor-pointer px-1 transition-colors",
                lang === "zh" ? "text-gold" : "text-navy-foreground/60 hover:text-navy-foreground",
              )}
            >
              中文
            </button>
          </div>

          <Link
            to="/portal"
            className="hidden text-sm text-navy-foreground/80 transition-colors hover:text-gold md:inline"
          >
            {t("portal")}
          </Link>

          <a
            href={`tel:${FIRM.phone.replace(/\s/g, "")}`}
            aria-label={`Call ${FIRM.phone}`}
            className="grid h-9 w-9 place-items-center border border-navy-foreground/20 text-navy-foreground/80 transition-colors hover:border-gold hover:text-gold"
          >
            <Phone className="h-4 w-4" />
          </a>

          <Button asChild variant="gold" className="hidden md:inline-flex">
            <Link to="/book">{t("cta.book")}</Link>
          </Button>

          <button
            aria-label={t("menu")}
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer p-1 text-navy-foreground xl:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div aria-hidden className="pattern-header" />

      {open && (
        <div className="border-t border-navy-foreground/10 bg-navy xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="border-b border-navy-foreground/10 py-3 text-sm text-navy-foreground/80"
                activeProps={{ className: "text-gold" }}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setLang("en")}
                  className={cn(
                    "cursor-pointer px-1",
                    lang === "en" ? "text-gold" : "text-navy-foreground/60",
                  )}
                >
                  EN
                </button>
                <span className="text-navy-foreground/30">|</span>
                <button
                  onClick={() => setLang("am")}
                  className={cn(
                    "cursor-pointer px-1",
                    lang === "am" ? "text-gold" : "text-navy-foreground/60",
                  )}
                >
                  አማ
                </button>
                <span className="text-navy-foreground/30">|</span>
                <button
                  onClick={() => setLang("zh")}
                  className={cn(
                    "cursor-pointer px-1",
                    lang === "zh" ? "text-gold" : "text-navy-foreground/60",
                  )}
                >
                  中文
                </button>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${FIRM.phone.replace(/\s/g, "")}`}
                  aria-label={`Call ${FIRM.phone}`}
                  className="grid h-9 w-9 place-items-center border border-navy-foreground/20 text-navy-foreground/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <Button asChild variant="gold">
                  <Link to="/book" onClick={() => setOpen(false)}>
                    {t("cta.book")}
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}