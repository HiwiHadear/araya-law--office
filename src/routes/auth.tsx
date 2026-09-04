import { createFileRoute, useNavigate } from "@tanstack/react-router";
import arayaLogo from "@/assets/araya-logo.png.asset.json";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Client Portal Sign In — Araya Law Firm";
const DESC =
  "Secure sign in to the Araya Law Firm client portal: track your case, view hearings, and access documents confidentially.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});
const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().max(40).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal", replace: true });
    });
  }, [navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/portal", replace: true });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: parsed.data.fullName, phone: parsed.data.phone ?? null },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/portal", replace: true });
      return;
    }
    setNotice("Check your email to confirm your account, then sign in.");
    toast.success("Account created — please confirm your email address.");
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    setLoading(false);
    navigate({ to: "/portal", replace: true });
  }

  return (
    <div className="bg-muted/40 py-16">
      <div className="mx-auto max-w-md px-5">
        <div className="border border-border bg-background p-8 shadow-elegant">
          <div className="flex items-center gap-3">
            <img
              src={arayaLogo.url}
              alt="Araya Law Firm seal"
              className="h-11 w-11 shrink-0 object-contain"
            />
            <div>
              <p className="eyebrow text-gold">Secure Portal</p>
              <h1 className="font-serif text-2xl leading-tight">Araya Law Firm</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Access your case file, hearing dates, and documents in a confidential environment.
          </p>

          {notice && (
            <p className="mt-4 border border-gold/40 bg-gold/10 p-3 text-sm text-foreground">
              {notice}
            </p>
          )}

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="si-password">Password</Label>
                  <Input
                    id="si-password"
                    name="password"
                    type="password"
                    required
                    maxLength={128}
                  />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="fullName" required maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="su-phone">Phone (optional)</Label>
                  <Input id="su-phone" name="phone" maxLength={40} />
                </div>
                <div>
                  <Label htmlFor="su-password">Password</Label>
                  <Input
                    id="su-password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={128}
                  />
                </div>
                <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <p className="mt-6 text-xs text-muted-foreground">
            All communications and documents in this portal are covered by professional
            confidentiality obligations.
          </p>
        </div>
      </div>
    </div>
  );
}