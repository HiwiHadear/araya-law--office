import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FIRM, PRACTICE_AREAS } from "@/lib/firm-data";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(10, "Please tell us how we can help").max(1000),
});

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    toast.success("Inquiry sent", { description: "Our team will respond within one business day." });
    setForm({ name: "", phone: "", email: "", service: "", message: "" });
  };

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Contact Araya Law Office"
          lead="Visit our Addis Ababa office, call us during working hours, or send an inquiry and we will respond promptly."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="eyebrow text-navy/60">Telephone</p>
                  <a href={`tel:${FIRM.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-navy">
                    {FIRM.phone}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="eyebrow text-navy/60">Email</p>
                  <a href={`mailto:${FIRM.email}`} className="mt-1 block truncate text-sm text-navy">
                    {FIRM.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="eyebrow text-navy/60">Office</p>
                  <p className="mt-1 text-sm text-navy">{FIRM.address}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="eyebrow text-navy/60">Working hours</p>
                  <p className="mt-1 text-sm text-navy">{FIRM.hours}</p>
                </div>
              </div>
            </div>

            <Button asChild variant="outlineNavy" size="lg">
              <a
                href={`https://wa.me/${FIRM.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle /> Chat on WhatsApp
              </a>
            </Button>

            <div className="overflow-hidden border border-border shadow-card">
              <iframe
                title="Araya Law Office location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=38.76%2C8.98%2C38.81%2C9.02&layer=mapnik"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="bg-background p-7 shadow-card sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="n-name">Name</Label>
                <Input id="n-name" value={form.name} onChange={(e) => set("name")(e.target.value)} maxLength={100} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="n-phone">Phone</Label>
                <Input id="n-phone" value={form.phone} onChange={(e) => set("phone")(e.target.value)} maxLength={30} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="n-email">Email</Label>
                <Input id="n-email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} maxLength={255} />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label>Service</Label>
                <Select value={form.service} onValueChange={set("service")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRACTICE_AREAS.map((p) => (
                      <SelectItem key={p.slug} value={p.title}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="n-message">Message</Label>
                <Textarea
                  id="n-message"
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => set("message")(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="navy" size="xl" className="mt-7 w-full sm:w-auto">
              Send Inquiry
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Submitting information through this form does not automatically establish an
              attorney-client relationship.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}