import {
  CORE_VALUES,
  FAQS,
  FIRM,
  LAWYERS,
  PRACTICE_AREAS,
  WHY_US,
  type Lawyer,
  type PracticeArea,
} from "@/lib/firm-data";
import { useLang } from "@/lib/i18n";

/** Chinese (Simplified) translations of the firm's content. Keyed by slug/title. */
const ZH_PRACTICE: Record<string, { title: string; description: string }> = {
  "civil-litigation": {
    title: "民事诉讼",
    description: "在各级法院代理民事纠纷、债权索赔、合同争议及相关诉讼程序。",
  },
  "corporate-commercial": {
    title: "公司与商事法",
    description: "为公司、企业、合伙组织提供合同与商业交易方面的法律支持。",
  },
  "contract-law": {
    title: "合同法",
    description: "协议与合同的起草、审查、谈判及条款解释。",
  },
  "property-real-estate": {
    title: "房地产与不动产法",
    description: "就房产交易、所有权、租赁及相关纠纷提供法律协助。",
  },
  "family-law": {
    title: "家事法",
    description: "以专业、审慎的方式处理家庭法律事务与身份关系问题。",
  },
  "employment-labor": {
    title: "劳动与雇佣法",
    description: "就劳动关系、职场纠纷及劳工事务提供咨询与代理。",
  },
  "criminal-defense": {
    title: "刑事辩护",
    description: "在刑事诉讼的各个阶段提供法律代理与辩护。",
  },
  "administrative-regulatory": {
    title: "行政与监管法",
    description: "在涉及政府机关与监管事务方面提供代理与咨询服务。",
  },
  "immigration-nationality": {
    title: "移民与国籍",
    description: "就移民、居留、国籍及相关事务提供法律协助。",
  },
  "dispute-resolution": {
    title: "替代性纠纷解决",
    description: "提供谈判、调解、仲裁等多元化纠纷解决服务。",
  },
};

const ZH_TERMS: Record<string, string> = {
  "Corporate Law": "公司法",
  "Civil Litigation": "民事诉讼",
  "Contract Law": "合同法",
  "Family Law": "家事法",
  "Employment & Labor": "劳动与雇佣",
  "Property Law": "房地产法",
  "Criminal Defense": "刑事辩护",
  "Administrative Law": "行政法",
  Immigration: "移民事务",
  Amharic: "阿姆哈拉语",
  English: "英语",
  Tigrinya: "提格利尼亚语",
  "Afaan Oromo": "奥罗莫语",
  "Ethiopian Federal Advocates Association": "埃塞俄比亚联邦律师协会",
  "Ethiopian Arbitration Institute": "埃塞俄比亚仲裁院",
  "Ethiopian Women Lawyers Association": "埃塞俄比亚女律师协会",
};

const ZH_LAWYERS: Record<string, Partial<Lawyer>> = {
  "araya-kebede": {
    name: "阿拉亚·凯贝德",
    role: "执行合伙人",
    qualifications: "法学学士、法学硕士（商法），联邦法院执业律师",
    bio: "阿拉亚在商事诉讼与公司法律顾问领域执业二十余年后创立本所，长期代理国内及国际客户出庭埃塞俄比亚联邦法院。",
    education: ["亚的斯亚贝巴大学 商法法学硕士", "亚的斯亚贝巴大学法学院 法学学士"],
    experience: [
      "20 年以上诉讼与公司法律顾问执业经验",
      "复杂商事纠纷与仲裁案件首席代理律师",
      "为企业提供设立、治理与合规方面的顾问服务",
    ],
  },
  "selamawit-bekele": {
    name: "塞拉玛维特·贝克莱",
    role: "高级律师",
    qualifications: "法学学士、法学硕士（人权法），注册调解员",
    bio: "塞拉玛维特为个人与雇主处理敏感的家事、劳动与房地产事务，执业风格以审慎和细致的谈判见长。",
    education: ["比勒陀利亚大学 人权法法学硕士", "巴赫达尔大学 法学学士"],
    experience: ["12 年为雇主与员工处理劳动争议的经验", "在家事与房产事务中拥有丰富的调解实践"],
  },
  "yonas-tadesse": {
    name: "约纳斯·塔德塞",
    role: "助理律师",
    qualifications: "法学学士、法律实务与程序文凭",
    bio: "约纳斯代理刑事诉讼与监管事务，并办理移民、居留及国籍申请。",
    education: ["梅克雷大学法学院 法学学士"],
    experience: ["一审及上诉阶段刑事案件辩护律师", "在行政机关面前提供监管事务代理"],
  },
};

const ZH_FAQS: { q: string; a: string }[] = [
  {
    q: "如何预约法律咨询？",
    a: "您可以通过我们的在线预约表单提交申请、直接致电事务所，或通过 WhatsApp 发送信息。每一次预约我们都会以电话或邮件确认。",
  },
  {
    q: "法律咨询的费用是多少？",
    a: "首次咨询按固定专业服务费收取，并在预约确认前告知您。持续办理的案件将在评估工作范围后报价。",
  },
  {
    q: "咨询时需要携带哪些材料？",
    a: "请携带与您事务相关的合同、往来函件、法院文件、票据或身份证明。如不确定，请把所有材料带来，我们会为您判断哪些是关键材料。",
  },
  {
    q: "你们提供线上咨询吗？",
    a: "提供。我们为埃塞俄比亚境内及海外客户提供到所、电话、视频及书面线上咨询服务。",
  },
  {
    q: "如何保障客户信息的保密性？",
    a: "所有沟通均受职业保密义务保护。文件安全存储，仅限办理您事务的专业人员访问。",
  },
  {
    q: "可以代理亚的斯亚贝巴以外的客户吗？",
    a: "可以。我们在埃塞俄比亚各地区法院代理客户，并在需要时与当地律师协作。",
  },
  {
    q: "一个法律案件通常需要多长时间？",
    a: "时间取决于审理机关、案件复杂程度以及对方的配合情况。我们会在开始时给出务实的预估，并随进展持续向您通报。",
  },
];

const ZH_WHY_US: Record<string, { title: string; text: string }> = {
  "01": { title: "经验丰富的法律专业人士", text: "具备扎实法律功底与丰富庭审实务经验的执业律师。" },
  "02": { title: "量身定制的法律策略", text: "每一个案件都依据其具体情况制定专属方案。" },
  "03": { title: "保密与审慎", text: "我们严格保护客户的敏感信息，坚守职业保密义务。" },
  "04": { title: "清晰的沟通", text: "以通俗易懂的方式向客户说明法律问题、风险与可选方案。" },
  "05": { title: "以结果为导向", text: "我们注重务实、契合商业实际且法律稳健的解决方案。" },
  "06": { title: "职业伦理", text: "诚信与职业责任贯穿我们工作的每一个环节。" },
};

const ZH_CORE_VALUES: Record<string, { title: string; text: string }> = {
  Integrity: { title: "诚信", text: "在每一项委托中坚持最高的职业道德标准。" },
  Confidentiality: { title: "保密", text: "客户信息与沟通内容均受到严格保密处理。" },
  Excellence: { title: "卓越", text: "我们追求高质量的法律分析与严谨的代理工作。" },
  "Client Focus": { title: "客户至上", text: "围绕每位客户的具体需求制定法律策略。" },
  Accountability: { title: "责任担当", text: "我们对自己的建议、行动与职业承诺负责。" },
};

const ZH_FIRM = {
  name: "阿拉亚律师事务所",
  tagline: "公正 · 诚信 · 成果",
  address: "埃塞俄比亚 亚的斯亚贝巴 博莱·梅根纳大道，Imperial 附近，Sami 大厦 5 层",
  hours: "周一至周五 8:30 – 17:30 · 周六需预约",
};

const zhTerm = (s: string) => ZH_TERMS[s] ?? s;

export function usePracticeAreas(): PracticeArea[] {
  const { lang } = useLang();
  if (lang !== "zh") return PRACTICE_AREAS;
  return PRACTICE_AREAS.map((a) => ({ ...a, ...(ZH_PRACTICE[a.slug] ?? {}) }));
}

export function useLawyers(): Lawyer[] {
  const { lang } = useLang();
  if (lang !== "zh") return LAWYERS;
  return LAWYERS.map((l) => ({
    ...l,
    ...(ZH_LAWYERS[l.slug] ?? {}),
    practice: l.practice.map(zhTerm),
    memberships: l.memberships.map(zhTerm),
    languages: l.languages.map(zhTerm),
  }));
}

export function useFaqs() {
  const { lang } = useLang();
  return lang === "zh" ? ZH_FAQS : FAQS;
}

export function useWhyUs() {
  const { lang } = useLang();
  if (lang !== "zh") return WHY_US;
  return WHY_US.map((w) => ({ ...w, ...(ZH_WHY_US[w.n] ?? {}) }));
}

export function useCoreValues() {
  const { lang } = useLang();
  if (lang !== "zh") return CORE_VALUES;
  return CORE_VALUES.map((v) => ({ ...v, ...(ZH_CORE_VALUES[v.title] ?? {}) }));
}

export function useFirm() {
  const { lang } = useLang();
  return lang === "zh" ? { ...FIRM, ...ZH_FIRM } : FIRM;
}

/** Section copy that lives in page components. */
export const COPY = {
  en: {
    "practice.eyebrow": "Practice Areas",
    "faq.eyebrow": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq.lead": "Straightforward answers to the questions clients ask us most often.",
    "why.eyebrow": "Why Choose Araya Law Firm",
    "why.title": "Why clients trust us",
    "why.lead":
      "A disciplined, confidential and clearly communicated approach to every mandate we accept.",
    "team.requestAdvice": "Request advice",
    "team.practice": "Areas of practice",
    "team.education": "Education",
    "team.experience": "Experience",
    "team.memberships": "Professional memberships",
    "team.languages": "Languages",
    "team.qualifications": "Qualifications",
    "team.viewProfile": "View Profile",
    "team.contact": "Contact Lawyer",
    "about.mission": "Mission",
    "about.missionText":
      "To provide reliable, ethical, and effective legal services while protecting our clients' rights and interests.",
    "about.vision": "Vision",
    "about.visionText":
      "To become a trusted and respected legal services provider recognized for professionalism, integrity, and successful client representation.",
    "about.values": "Core Values",
    "about.valuesTitle": "What guides our work",
    "contact.telephone": "Telephone",
    "contact.email": "Email",
    "contact.office": "Office",
    "contact.hours": "Working hours",
    "contact.whatsapp": "Chat on WhatsApp",
  },
  am: {
    "practice.eyebrow": "የሙያ ዘርፎች",
    "faq.eyebrow": "ተደጋጋሚ ጥያቄዎች",
    "faq.title": "ተደጋጋሚ ጥያቄዎች",
    "faq.lead": "ደንበኞች በተደጋጋሚ ለሚጠይቁት ጥያቄዎች ቀጥተኛ መልሶች።",
    "why.eyebrow": "ለምን አራያ የሕግ ድርጅት",
    "why.title": "ደንበኞች ለምን ያምኑናል",
    "why.lead": "ለሁሉም ሥራችን ሥርዓታዊ፣ ምስጢራዊና በግልጽ የሚነገር አቀራረብ።",
    "team.requestAdvice": "አማካሪነት ይጠይቁ",
    "team.practice": "የሙያ ዘርፎች",
    "team.education": "ትምህርት",
    "team.experience": "ልምድ",
    "team.memberships": "ሙያዊ አባልነቶች",
    "team.languages": "ቋንቋዎች",
    "team.qualifications": "ብቃቶች",
    "team.viewProfile": "መገለጫ ይመልከቱ",
    "team.contact": "ጠበቃውን ያግኙ",
    "about.mission": "ተልእኮ",
    "about.missionText":
      "የደንበኞቻችንን መብትና ጥቅም በመጠበቅ አስተማማኝ፣ ሥነ ምግባራዊና ውጤታማ የሕግ አገልግሎት መስጠት።",
    "about.vision": "ራእይ",
    "about.visionText":
      "በሙያዊነት፣ በታማኝነትና በተሳካ የደንበኛ ውክልና የሚታወቅ አስተማማኝና የተከበረ የሕግ አገልግሎት ሰጪ መሆን።",
    "about.values": "እምነቶቻችን",
    "about.valuesTitle": "ሥራችንን የሚመሩ እምነቶች",
    "contact.telephone": "ስልክ",
    "contact.email": "ኢሜይል",
    "contact.office": "ቢሮ",
    "contact.hours": "የሥራ ሰዓት",
    "contact.whatsapp": "በWhatsApp ያውሩን",
  },
  zh: {
    "practice.eyebrow": "业务领域",
    "faq.eyebrow": "常见问题",
    "faq.title": "常见问题解答",
    "faq.lead": "针对客户最常提出的问题给出直接、清晰的解答。",
    "why.eyebrow": "为何选择阿拉亚律师事务所",
    "why.title": "客户信赖我们的原因",
    "why.lead": "对每一项受托事务，我们都以严谨、保密并清晰沟通的方式推进。",
    "team.requestAdvice": "咨询律师",
    "team.practice": "执业领域",
    "team.education": "教育背景",
    "team.experience": "执业经历",
    "team.memberships": "专业组织成员",
    "team.languages": "语言能力",
    "team.qualifications": "专业资历",
    "team.viewProfile": "查看简介",
    "team.contact": "联系律师",
    "about.mission": "使命",
    "about.missionText": "在维护客户权利与利益的同时，提供可靠、合乎道德且有效的法律服务。",
    "about.vision": "愿景",
    "about.visionText": "成为以专业、诚信和成功代理著称、受人信赖与尊重的法律服务提供者。",
    "about.values": "核心价值",
    "about.valuesTitle": "指引我们工作的准则",
    "contact.telephone": "电话",
    "contact.email": "电子邮箱",
    "contact.office": "办公地址",
    "contact.hours": "办公时间",
    "contact.whatsapp": "通过 WhatsApp 咨询",
  },
} as const;

export function useCopy() {
  const { lang } = useLang();
  return (k: keyof (typeof COPY)["en"]) => COPY[lang][k] ?? COPY.en[k];
}

type Para = { label?: string; text: string };

const ABOUT_BODY: Record<"en" | "am" | "zh", Para[]> = {
  en: [
    {
      text: "Araya Law Firm was established in Addis Ababa to serve clients who need dependable legal counsel delivered with clarity and discretion. What began as a litigation-focused practice has grown into a full-service office covering civil, corporate, regulatory, and personal legal matters.",
    },
    {
      label: "Legal philosophy.",
      text: "We believe good legal work begins with listening. Before recommending a course of action we establish the commercial or personal outcome the client actually needs, then design the shortest legally sound route to it — whether that is negotiation, mediation, or litigation.",
    },
    {
      label: "Areas of expertise.",
      text: "Civil litigation, corporate and commercial law, contracts, property and real estate, family law, employment and labor, criminal defense, administrative and regulatory practice, immigration and nationality, and alternative dispute resolution.",
    },
    {
      label: "Commitment to clients.",
      text: "Every client receives a named attorney, realistic timelines, transparent fees, and updates in plain language. Sensitive matters are handled by a limited team on a need-to-know basis.",
    },
    {
      label: "Professional standards.",
      text: "Our attorneys are licensed to appear before the Federal Courts of Ethiopia and practise in accordance with the professional and ethical obligations of the Ethiopian bar, including strict confidentiality and conflict-of-interest screening.",
    },
    {
      label: "Experience and qualifications.",
      text: "The team combines LL.B and LL.M qualifications, certified mediation training, and decades of combined courtroom and advisory experience across domestic and cross-border matters.",
    },
  ],
  get am() {
    return ABOUT_BODY.en;
  },
  zh: [
    {
      text: "阿拉亚律师事务所设立于亚的斯亚贝巴，服务于需要清晰、审慎且可靠法律意见的客户。本所由最初以诉讼为主的执业逐步发展为覆盖民事、公司、监管及个人法律事务的综合性事务所。",
    },
    {
      label: "法律理念。",
      text: "我们相信优质的法律工作始于倾听。在提出方案之前，我们先明确客户真正需要的商业或个人结果，再设计通往该结果的最短且法律稳健的路径——无论是谈判、调解还是诉讼。",
    },
    {
      label: "专长领域。",
      text: "民事诉讼、公司与商事法、合同、房地产与不动产、家事法、劳动与雇佣、刑事辩护、行政与监管实务、移民与国籍，以及替代性纠纷解决。",
    },
    {
      label: "对客户的承诺。",
      text: "每位客户都会有一位专属负责律师、务实的时间安排、透明的收费，以及以通俗语言呈现的进展通报。敏感事务由小范围团队在必要知悉原则下处理。",
    },
    {
      label: "职业标准。",
      text: "本所律师具备在埃塞俄比亚联邦法院出庭的执业资格，并依照埃塞俄比亚律师界的职业与伦理义务执业，包括严格保密与利益冲突审查。",
    },
    {
      label: "经验与资历。",
      text: "团队成员拥有法学学士与法学硕士学历、注册调解培训资质，以及在国内与跨境事务中累积数十年的庭审与顾问经验。",
    },
  ],
};

export function useAboutBody(): Para[] {
  const { lang } = useLang();
  return ABOUT_BODY[lang] ?? ABOUT_BODY.en;
}
