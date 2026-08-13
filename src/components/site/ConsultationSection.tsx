import { format } from "date-fns";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLawyers, usePracticeAreas } from "@/lib/firm-content";
import { CONSULTATION_TYPES, LANGUAGES } from "@/lib/firm-data";
import { cn } from "@/lib/utils";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30"];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  service: z.string().min(1, "Please select a legal service"),
  lawyer: z.string().min(1, "Please select a lawyer"),
  date: z.string().min(1, "Please select a preferred date"),
  time: z.string().min(1, "Please select a preferred time"),
  method: z.string().min(1, "Please select a consultation method"),
  language: z.string().min(1, "Please select a preferred language"),
  matter: z.string().trim().min(10, "Please briefly describe your matter").max(1000),
});

export function ConsultationSection() {
  const practiceAreas = usePracticeAreas();
  const lawyers = useLawyers();
  const [date, setDate] = useState<Date | undefined>();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    lawyer: "",
    time: "",
    method: "",
    language: "",
    matter: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({
      ...form,
      date: date ? format(date, "yyyy-MM-dd") : "",
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    toast.success("Consultation request received", {
      description: `We will confirm your ${form.method.toLowerCase()} on ${date ? format(date, "d MMMM yyyy") : ""} at ${form.time}.`,
    });
    setForm({
      name: "",
      phone: "",
      email: "",
      service: "",
      lawyer: "",
      time: "",
      method: "",
      language: "",
      matter: "",
    });
    setDate(undefined);
  };

  return (
    <section id="book" className="bg-gradient-navy py-24 text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            eyebrow="Consultation"
            title="Need legal assistance?"
            lead="Speak with our legal team about your matter and understand your available legal options. Select a service, a lawyer, and a time that suits you."
            tone="dark"
          />
          <ul className="mt-10 space-y-4 text-sm text-navy-foreground/75">
            {CONSULTATION_TYPES.map((c) => (
              <li key={c} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 bg-gold" />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3 border border-navy-foreground/15 p-5 text-xs leading-relaxed text-navy-foreground/70">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p>
              Submitting information through this form does not automatically establish an
              attorney-client relationship. Please avoid sending highly sensitive details until an
              engagement is confirmed.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-background p-7 text-foreground shadow-elegant sm:p-9">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="c-name">Full name</Label>
              <Input id="c-name" value={form.name} onChange={(e) => set("name")(e.target.value)} maxLength={100} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-phone">Phone number</Label>
              <Input id="c-phone" value={form.phone} onChange={(e) => set("phone")(e.target.value)} maxLength={30} />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} maxLength={255} />
            </div>
            <div className="grid gap-2">
              <Label>Legal service</Label>
              <Select value={form.service} onValueChange={set("service")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {practiceAreas.map((p) => (
                    <SelectItem key={p.slug} value={p.title}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Lawyer</Label>
              <Select value={form.lawyer} onValueChange={set("lawyer")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a lawyer" />
                </SelectTrigger>
                <SelectContent>
                  {lawyers.map((l) => (
                    <SelectItem key={l.slug} value={l.name}>
                      {l.name} — {l.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Preferred date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("pointer-events-auto p-3")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Preferred time</Label>
              <Select value={form.time} onValueChange={set("time")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Consultation method</Label>
              <Select value={form.method} onValueChange={set("method")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  {CONSULTATION_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Preferred language</Label>
              <Select value={form.language} onValueChange={set("language")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="c-matter">Brief description of matter</Label>
              <Textarea
                id="c-matter"
                rows={4}
                maxLength={1000}
                value={form.matter}
                onChange={(e) => set("matter")(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" variant="gold" size="xl" className="mt-7 w-full sm:w-auto">
            Book a Consultation
          </Button>
        </form>
      </div>
    </section>
  );
}