import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ROLE_LABELS, useCurrentUser, useSignOut } from "@/lib/auth";

const LINKS = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, staffOnly: false },
  { to: "/cases", label: "Cases", icon: Briefcase, staffOnly: false },
  { to: "/calendar", label: "Court Calendar", icon: CalendarDays, staffOnly: false },
  { to: "/documents", label: "Documents", icon: FileText, staffOnly: false },
  { to: "/admin", label: "Administration", icon: Users, staffOnly: true },
  { to: "/security", label: "Security & 2FA", icon: ShieldCheck, staffOnly: false },
] as const;

export function PortalShell({ children }: { children: ReactNode }) {
  const { data: me } = useCurrentUser();
  const signOut = useSignOut();

  return (
    <div className="bg-muted/40">
      <div className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={arayaLogo.url}
              alt="Araya Law Office seal"
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div>
              <p className="eyebrow text-gold/80">Secure Client & Practice Portal</p>
              <h1 className="font-serif text-2xl leading-tight">
                {me?.profile?.full_name ?? me?.user.email ?? "Welcome"}
              </h1>
              <p className="mt-1 text-xs text-navy-foreground/70">
                {me?.roles.length
                  ? me.roles.map((r) => ROLE_LABELS[r]).join(" · ")
                  : "No role assigned yet"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10"
            onClick={() => {
              signOut.mutate(undefined, {
                onSuccess: () => {
                  window.location.replace("/auth");
                },
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl gap-8 px-5 py-8 lg:flex lg:px-8">
        <nav className="mb-6 flex shrink-0 gap-2 overflow-x-auto lg:mb-0 lg:w-56 lg:flex-col">
          {LINKS.filter((l) => !l.staffOnly || me?.isStaff).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 whitespace-nowrap rounded-sm border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              activeProps={{ className: "border-border bg-background text-foreground" }}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1 pb-10">{children}</div>
      </div>
    </div>
  );
}