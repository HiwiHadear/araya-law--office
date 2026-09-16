import { supabase } from "@/integrations/supabase/client";

export type CaseRow = {
  id: string;
  case_number: string;
  title: string;
  description: string | null;
  practice_area: string | null;
  status: "intake" | "active" | "on_hold" | "closed";
  court: string | null;
  client_id: string | null;
  lead_lawyer_id: string | null;
  opened_at: string;
  updated_at: string;
};

export const CASE_STATUSES = ["intake", "active", "on_hold", "closed"] as const;
export const STATUS_LABELS: Record<CaseRow["status"], string> = {
  intake: "Intake",
  active: "Active",
  on_hold: "On hold",
  closed: "Closed",
};

export async function fetchCases() {
  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .order("opened_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CaseRow[];
}

export async function fetchCase(id: string) {
  const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as CaseRow | null;
}

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchHearings(caseId?: string) {
  let query = supabase.from("hearings").select("*").order("scheduled_at", { ascending: true });
  if (caseId) query = query.eq("case_id", caseId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchDocuments(caseId?: string) {
  let query = supabase.from("documents").select("*").order("created_at", { ascending: false });
  if (caseId) query = query.eq("case_id", caseId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchCaseUpdates(caseId: string) {
  const { data, error } = await supabase
    .from("case_updates")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function downloadDocument(storagePath: string) {
  const { data, error } = await supabase.storage
    .from("case-documents")
    .createSignedUrl(storagePath, 60);
  if (error) throw error;
  return data.signedUrl;
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}