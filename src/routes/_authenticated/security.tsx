import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/security")({
  head: () => ({ meta: [{ title: "Security & Two-Factor — Araya Law Office" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const [enrolling, setEnrolling] = useState<{ id: string; qr: string } | null>(null);
  const [code, setCode] = useState("");

  const factors = useQuery({
    queryKey: ["mfa-factors"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      return data.totp ?? [];
    },
  });

  async function startEnroll() {
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error || !data) {
      toast.error(error?.message ?? "Could not start enrolment");
      return;
    }
    setEnrolling({ id: data.id, qr: data.totp.qr_code });
  }

  async function verify() {
    if (!enrolling) return;
    const challenge = await supabase.auth.mfa.challenge({ factorId: enrolling.id });
    if (challenge.error) {
      toast.error(challenge.error.message);
      return;
    }
    const { error } = await supabase.auth.mfa.verify({
      factorId: enrolling.id,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Two-factor authentication enabled");
    setEnrolling(null);
    setCode("");
    void factors.refetch();
  }

  async function removeFactor(factorId: string) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Two-factor authentication removed");
    void factors.refetch();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Security & Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Add an authenticator app for an extra layer of protection on your portal account.
        </p>
      </div>

      <section className="border border-border bg-background p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
          <h3 className="font-serif text-lg">Authenticator app</h3>
        </div>

        {factors.data?.length ? (
          <ul className="mt-4 divide-y divide-border">
            {factors.data.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">{f.friendly_name ?? "Authenticator"}</p>
                  <p className="text-xs text-muted-foreground">Status: {f.status}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeFactor(f.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Two-factor authentication is not enabled on this account.
          </p>
        )}

        {enrolling ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm">Scan this code with your authenticator app:</p>
            <img
              src={enrolling.qr}
              alt="Two-factor authentication QR code"
              className="h-44 w-44 border border-border bg-white p-2"
            />
            <div className="max-w-xs">
              <Label htmlFor="code">6-digit code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="gold" onClick={verify} disabled={code.trim().length !== 6}>
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setEnrolling(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button className="mt-6" variant="gold" onClick={startEnroll}>
            Set up two-factor authentication
          </Button>
        )}
      </section>
    </div>
  );
}