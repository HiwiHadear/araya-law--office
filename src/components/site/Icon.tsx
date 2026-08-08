import {
  Award,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileSignature,
  Globe2,
  Handshake,
  Home,
  Landmark,
  Lock,
  Scale,
  ShieldCheck,
  Swords,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Award,
  Briefcase,
  Building2,
  ClipboardCheck,
  FileSignature,
  Globe2,
  Handshake,
  Home,
  Landmark,
  Lock,
  Scale,
  ShieldCheck,
  Swords,
  Target,
  Users,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Scale;
  return <Cmp className={className} aria-hidden="true" />;
}