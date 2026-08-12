import { Link } from "@tanstack/react-router";
import { Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

import arayaLogo from "@/assets/araya-logo.png.asset.json";
import { FIRM } from "@/lib/firm-data";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={arayaLogo.url}
                alt="Araya Law Office seal"
                className="h-11 w-11 shrink-0 object-contain"
              />
              <span className="font-serif text-lg">{t("hero.firm")}</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/70">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center border border-navy-foreground/20 text-navy-foreground/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="X"
                className="grid h-9 w-9 place-items-center border border-navy-foreground/20 text-navy-foreground/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-gold">{t("footer.navigation")}</h4>
            <ul className="mt-5 space-y-3 text-sm text-navy-foreground/70">
              <li>
                <Link to="/about" className="hover:text-gold">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/practice-areas" className="hover:text-gold">
                  {t("nav.practice")}
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-gold">
                  {t("nav.team")}
                </Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-gold">
                  {t("nav.insights")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold">{t("footer.legal")}</h4>
            <ul className="mt-5 space-y-3 text-sm text-navy-foreground/70">
              <li>{t("footer.privacy")}</li>
              <li>{t("footer.terms")}</li>
              <li>{t("footer.disclaimer")}</li>
              <li>{t("footer.confidentiality")}</li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold">{t("footer.contact")}</h4>
            <ul className="mt-5 space-y-4 text-sm text-navy-foreground/70">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${FIRM.phone.replace(/\s/g, "")}`}>{FIRM.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${FIRM.email}`}>{FIRM.email}</a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{FIRM.address}</span>
              </li>
              <li className="text-navy-foreground/50">{FIRM.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-navy-foreground/10 pt-6 text-xs text-navy-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.notice")}</p>
        </div>
      </div>
    </footer>
  );
}