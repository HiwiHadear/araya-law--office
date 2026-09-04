import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
    "hero.firm": "Araya Law Firm",
    "hero.tagline": "Justice. Integrity. Results.",
    "hero.lead":
      "Professional legal representation and trusted legal advisory services tailored to individuals, businesses, and organizations.",
    "hero.trust": "Confidentiality • Professionalism • Client-Focused Representation",
    "footer.tagline": "Professional legal services you can trust.",
    "menu": "Menu",
    "portal": "Client Portal",
    "attorneys": "Attorneys & Legal Advisors",
    "footer.navigation": "Navigation",
    "footer.legal": "Legal",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    "footer.disclaimer": "Disclaimer",
    "footer.confidentiality": "Confidentiality Policy",
    "footer.copyright": "© 2026 Araya Law Firm. All rights reserved.",
    "footer.notice": "Information on this website is general and does not constitute legal advice.",
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
    "footer.navigation": "ዳሰሳ",
    "footer.legal": "ሕጋዊ",
    "footer.contact": "አግኙን",
    "footer.privacy": "የግላዊነት ፖሊሲ",
    "footer.terms": "የአጠቃቀም ውሎች",
    "footer.disclaimer": "ውክልና",
    "footer.confidentiality": "የምስጢራዊነት ፖሊሲ",
    "footer.copyright": "© 2026 አራያ የሕግ ጽሕፈት ቤት። መብቱ በሕግ የተጠበቀ ነው።",
    "footer.notice": "በዚህ ድር ጣቢያ ላይ ያሉ መረጃዎች አጠቃላይ እና የሕግ አማካሪነት አይሆኑም።",
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
    "footer.navigation": "导航",
    "footer.legal": "法律条款",
    "footer.contact": "联系我们",
    "footer.privacy": "隐私政策",
    "footer.terms": "使用条款",
    "footer.disclaimer": "免责声明",
    "footer.confidentiality": "保密政策",
    "footer.copyright": "© 2026 阿拉亚律师事务所。保留所有权利。",
    "footer.notice": "本网站信息仅供参考，不构成法律建议。",
  },
} as const;

type Key = keyof (typeof DICT)["en"];

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>(
  { lang: "en", setLang: () => {}, t: (k) => DICT.en[k] },
);

const STORAGE_KEY = "araya-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "am" || saved === "zh") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const t = useCallback((k: Key) => DICT[lang][k] ?? DICT.en[k], [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
