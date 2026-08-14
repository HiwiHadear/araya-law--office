import lawyer1 from "@/assets/lawyer-1.jpg";
import lawyer2 from "@/assets/lawyer-2.jpg";
import lawyer3 from "@/assets/lawyer-3.jpg";

export const FIRM = {
  name: "Araya Law Office",
  tagline: "Justice. Integrity. Results.",
  phone: "+251 923 771 883",
  whatsapp: "+251 923 771 883",
  email: "info@arayalawoffice.com",
  address:
    "Bole Megenagna Road, near Imperial, Sami Building, 5th Floor, Addis Ababa, Ethiopia",
  hours: "Monday – Friday, 8:30 AM – 5:30 PM · Saturday by appointment",
  socials: {
    linkedin: "https://www.linkedin.com/in/araya-kebede-araya",
    facebook: "https://www.facebook.com/ArayaLawOffice",
    x: "https://x.com/ArayaLawOffice",
    instagram: "https://www.instagram.com/arayalawoffice",
    youtube: "https://www.youtube.com/@ArayaLawOffice",
    telegram: "https://t.me/ArayaLawOffice",
  },
};

export type PracticeArea = {
  slug: string;
  title: string;
  icon: string;
  description: string;
};

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    slug: "civil-litigation",
    title: "Civil Litigation",
    icon: "Scale",
    description:
      "Representation in civil disputes, claims, contractual matters, and related proceedings before all levels of court.",
  },
  {
    slug: "corporate-commercial",
    title: "Corporate & Commercial Law",
    icon: "Building2",
    description:
      "Legal support for companies, businesses, partnerships, contracts, and commercial transactions.",
  },
  {
    slug: "contract-law",
    title: "Contract Law",
    icon: "FileSignature",
    description: "Drafting, reviewing, negotiating, and interpreting agreements and contracts.",
  },
  {
    slug: "property-real-estate",
    title: "Property & Real Estate Law",
    icon: "Home",
    description:
      "Legal assistance relating to property transactions, ownership, leases, and disputes.",
  },
  {
    slug: "family-law",
    title: "Family Law",
    icon: "Users",
    description:
      "Professional, discreet assistance concerning family-related legal matters and personal status.",
  },
  {
    slug: "employment-labor",
    title: "Employment & Labor Law",
    icon: "Briefcase",
    description:
      "Advice and representation concerning employment relationships, workplace disputes, and labor matters.",
  },
  {
    slug: "criminal-defense",
    title: "Criminal Defense",
    icon: "Swords",
    description: "Legal representation and defense at every stage of criminal proceedings.",
  },
  {
    slug: "administrative-regulatory",
    title: "Administrative & Regulatory Law",
    icon: "Landmark",
    description:
      "Representation and advisory services concerning government authorities and regulatory matters.",
  },
  {
    slug: "immigration-nationality",
    title: "Immigration & Nationality",
    icon: "Globe2",
    description:
      "Legal assistance concerning immigration, residence, nationality, and related matters.",
  },
  {
    slug: "dispute-resolution",
    title: "Alternative Dispute Resolution",
    icon: "Handshake",
    description: "Negotiation, mediation, arbitration, and other dispute-resolution services.",
  },
];

export const CORE_VALUES = [
  {
    title: "Integrity",
    icon: "ShieldCheck",
    text: "We maintain the highest standards of professional ethics in every engagement.",
  },
  {
    title: "Confidentiality",
    icon: "Lock",
    text: "Client information and communications are handled with strict confidentiality.",
  },
  {
    title: "Excellence",
    icon: "Award",
    text: "We pursue high-quality legal analysis and rigorous representation.",
  },
  {
    title: "Client Focus",
    icon: "Target",
    text: "We develop legal strategies around each client's specific needs.",
  },
  {
    title: "Accountability",
    icon: "ClipboardCheck",
    text: "We take responsibility for our advice, actions, and professional commitments.",
  },
];

export const WHY_US = [
  {
    n: "01",
    title: "Experienced Legal Professionals",
    text: "Qualified professionals with strong legal knowledge and practical courtroom experience.",
  },
  {
    n: "02",
    title: "Personalized Legal Strategy",
    text: "Every case receives an approach built around its specific circumstances.",
  },
  {
    n: "03",
    title: "Confidential & Discreet",
    text: "We protect sensitive client information and maintain professional confidentiality.",
  },
  {
    n: "04",
    title: "Clear Communication",
    text: "Clients receive understandable explanations of legal issues, risks, and options.",
  },
  {
    n: "05",
    title: "Results-Oriented Approach",
    text: "We focus on practical, commercially aware, and legally sound solutions.",
  },
  {
    n: "06",
    title: "Professional Ethics",
    text: "Integrity and professional responsibility guide every step of our work.",
  },
];

export type Lawyer = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  practice: string[];
  qualifications: string;
  bio: string;
  education: string[];
  experience: string[];
  memberships: string[];
  languages: string[];
};

export const LAWYERS: Lawyer[] = [
  {
    slug: "araya-kebede",
    name: "Araya Kebede",
    role: "Managing Partner",
    photo: lawyer1,
    practice: ["Corporate Law", "Civil Litigation", "Contract Law"],
    qualifications: "LL.B, LL.M (Commercial Law), Licensed Federal Court Attorney",
    bio: "Araya founded the firm after two decades of practice in commercial litigation and corporate advisory, representing local and international clients before the Federal Courts of Ethiopia.",
    education: [
      "LL.M in Commercial Law, Addis Ababa University",
      "LL.B, Addis Ababa University School of Law",
    ],
    experience: [
      "20+ years of litigation and corporate advisory practice",
      "Lead counsel in complex commercial disputes and arbitration",
      "Adviser to companies on formation, governance, and compliance",
    ],
    memberships: ["Ethiopian Federal Advocates Association", "Ethiopian Arbitration Institute"],
    languages: ["Amharic", "English", "Tigrinya"],
  },
  {
    slug: "hanna-girma",
    name: "Hanna Girma",
    role: "Senior Attorney",
    photo: lawyer2,
    practice: ["Family Law", "Employment & Labor", "Property Law"],
    qualifications: "LL.B, LL.M (Human Rights), Certified Mediator",
    bio: "Hanna advises individuals and employers on sensitive family, employment, and property matters, with a practice grounded in discretion and careful negotiation.",
    education: ["LL.M in Human Rights Law, University of Pretoria", "LL.B, Bahir Dar University"],
    experience: [
      "12 years advising employers and employees on labor disputes",
      "Extensive mediation practice in family and property matters",
    ],
    memberships: ["Ethiopian Women Lawyers Association", "Ethiopian Federal Advocates Association"],
    languages: ["Amharic", "English"],
  },
  {
    slug: "dawit-mekonnen",
    name: "Dawit Mekonnen",
    role: "Associate Attorney",
    photo: lawyer3,
    practice: ["Criminal Defense", "Administrative Law", "Immigration"],
    qualifications: "LL.B, Diploma in Legal Practice & Procedure",
    bio: "Dawit represents clients in criminal proceedings and regulatory matters, and handles immigration, residence, and nationality applications.",
    education: ["LL.B, Mekelle University School of Law"],
    experience: [
      "Defense counsel in criminal proceedings at first instance and appeal",
      "Regulatory representation before administrative authorities",
    ],
    memberships: ["Ethiopian Federal Advocates Association"],
    languages: ["Amharic", "English", "Afaan Oromo"],
  },
];

export const ARTICLES = [
  {
    slug: "understanding-your-rights",
    title: "Understanding Your Rights Under Ethiopian Law",
    category: "Legal Rights",
    author: "Araya Kebede",
    date: "12 July 2026",
    readTime: "6 min read",
    excerpt:
      "A practical overview of the constitutional and civil protections available to individuals, and how to assert them.",
  },
  {
    slug: "before-signing-a-contract",
    title: "Key Considerations Before Signing a Contract",
    category: "Contract Law",
    author: "Hanna Girma",
    date: "28 June 2026",
    readTime: "5 min read",
    excerpt:
      "Five clauses that most often create disputes — and the questions to ask before you sign anything.",
  },
  {
    slug: "business-registration-compliance",
    title: "Business Registration and Corporate Compliance",
    category: "Corporate",
    author: "Araya Kebede",
    date: "09 June 2026",
    readTime: "7 min read",
    excerpt:
      "From licensing to annual filings: what companies operating in Ethiopia must keep in order.",
  },
  {
    slug: "employment-rights-obligations",
    title: "Employment Rights and Employer Obligations",
    category: "Employment",
    author: "Hanna Girma",
    date: "22 May 2026",
    readTime: "6 min read",
    excerpt:
      "Termination, notice periods, and severance — the rules employers and employees most often get wrong.",
  },
  {
    slug: "property-transactions",
    title: "Property Transactions: Important Legal Considerations",
    category: "Property",
    author: "Dawit Mekonnen",
    date: "04 May 2026",
    readTime: "5 min read",
    excerpt: "Title verification, lease terms, and the due diligence that prevents costly disputes.",
  },
  {
    slug: "adr-in-ethiopia",
    title: "Alternative Dispute Resolution in Ethiopia",
    category: "Dispute Resolution",
    author: "Araya Kebede",
    date: "17 April 2026",
    readTime: "8 min read",
    excerpt:
      "When mediation or arbitration serves a client better than litigation, and how the process works.",
  },
];

export const FAQS = [
  {
    q: "How can I schedule a consultation?",
    a: "You can book online through our consultation form, call the office directly, or send a message via WhatsApp. We confirm every appointment by phone or email.",
  },
  {
    q: "How much does a legal consultation cost?",
    a: "Initial consultations are charged at a fixed professional fee, communicated to you before the appointment is confirmed. Ongoing matters are quoted after an assessment of scope.",
  },
  {
    q: "What documents should I bring to my consultation?",
    a: "Bring any contracts, correspondence, court documents, receipts, or identification relevant to your matter. If you are unsure, bring everything you have — we will advise on what is relevant.",
  },
  {
    q: "Do you provide online consultations?",
    a: "Yes. We offer office, telephone, video, and written online consultations for clients inside and outside Ethiopia.",
  },
  {
    q: "How is client confidentiality protected?",
    a: "All communications are covered by professional confidentiality obligations. Documents are stored securely and access is limited to the professionals working on your matter.",
  },
  {
    q: "Can you represent clients outside Addis Ababa?",
    a: "Yes. We act for clients in regional courts across Ethiopia and coordinate with local counsel where required.",
  },
  {
    q: "How long does a legal case normally take?",
    a: "Timelines depend on the forum, complexity, and the conduct of the opposing party. We give a realistic estimate at the outset and update you as the matter progresses.",
  },
];

export const CONSULTATION_TYPES = [
  "Office Consultation",
  "Telephone Consultation",
  "Video Consultation",
  "Online Legal Consultation",
];

export const LANGUAGES = ["Amharic", "English", "Tigrinya", "Afaan Oromo", "Other"];