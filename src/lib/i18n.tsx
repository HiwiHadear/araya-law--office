import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Lang = "en" | "am";

const DICT = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.practice": "Practice Areas",
    "nav.team": "Our Team",
    "nav.insights": "Insights",
    "nav.contact": "Contact",
    "cta.book": "Book Consultation",
    "cta.bookLong": "Book a Consultation",
    "cta.practice": "Our Practice Areas",
    "hero.firm": "Araya Law Office",
    "hero.tagline": "Justice. Integrity. Results.",
    "hero.lead":
      "Professional legal representation and trusted legal advisory services tailored to individuals, businesses, and organizations.",
    "hero.trust": "Confidentiality • Professionalism • Client-Focused Representation",
    "footer.tagline": "Professional legal services you can trust.",
    "menu": "Menu",
  },
  am: {
    "nav.home": "መግቢያ",
    "nav.about": "ስለ እኛ",
    "nav.practice": "የሙያ ዘርፎች",
    "nav.team": "ቡድናችን",
    "nav.insights": "ጽሑፎች",
    "nav.contact": "አግኙን",
    "cta.book": "ቀጠሮ ይያዙ",
    "cta.bookLong": "ለምክክር ቀጠሮ ይያዙ",
    "cta.practice": "የሙያ ዘርፎቻችን",
    "hero.firm": "አራያ የሕግ ጽሕፈት ቤት",
    "hero.tagline": "ፍትሕ። ታማኝነት። ውጤት።",
    "hero.lead":
      "ለግለሰቦች፣ ለንግድ ድርጅቶችና ለተቋማት የተዘጋጀ ሙያዊ የሕግ ውክልናና አስተማማኝ የሕግ አማካሪ አገልግሎት።",
    "hero.trust": "ምስጢራዊነት • ሙያዊነት • በደንበኛ ላይ ያተኮረ ውክልና",
    "footer.tagline": "ሊታመን የሚችል ሙያዊ የሕግ አገልግሎት።",
    "menu": "ማውጫ",
  },
} as const;

type Key = keyof (typeof DICT)["en"];

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>(
  { lang: "en", setLang: () => {}, t: (k) => DICT.en[k] },
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = useCallback((k: Key) => DICT[lang][k] ?? DICT.en[k], [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}