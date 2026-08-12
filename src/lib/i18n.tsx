import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Lang = "en" | "am" | "zh";

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
    "portal": "Client Portal",
    "attorneys": "Attorneys & Legal Advisors",
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
    "portal": "የደንበኛ ፖርታል",
    "attorneys": "የሕግ ጠበቆች እና አማካሪዎች",
  },
  zh: {
    "nav.home": "首页",
    "nav.about": "关于我们",
    "nav.practice": "业务领域",
    "nav.team": "律师团队",
    "nav.insights": "法律资讯",
    "nav.contact": "联系我们",
    "cta.book": "预约咨询",
    "cta.bookLong": "预约法律咨询",
    "cta.practice": "我们的业务领域",
    "hero.firm": "阿拉亚律师事务所",
    "hero.tagline": "公正 · 诚信 · 成果",
    "hero.lead":
      "为个人、企业和组织提供专业法律代理与值得信赖的法律咨询服务。",
    "hero.trust": "保密性 · 专业性 · 以客户为中心",
    "footer.tagline": "您可以信赖的专业法律服务。",
    "menu": "菜单",
    "portal": "客户门户",
    "attorneys": "律师与法律顾问",
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
