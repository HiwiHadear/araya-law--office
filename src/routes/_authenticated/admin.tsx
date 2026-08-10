import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ALL_ROLES, ROLE_LABELS, type AppRole, useCurrentUser } from "@/lib/auth";
import { fetchAppointments, fetchProfiles, formatDate } from "@/lib/portal-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administration — Araya Law Office" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { data: me } = useCurrentUser();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Record<string, AppRole>>({});

  const profiles = useQuery({ queryKey: ["profiles"], queryFn: fetchProfiles });
  const roles = useQuery({
    queryKey: ["all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("id, user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });
  const appointments = useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });

  const grant = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role granted");
      void queryClient.invalidateQueries({ queryKey: ["all-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role removed");
      void queryClient.invalidateQueries({ queryKey: ["all-roles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!me?.isStaff) {
    return (
      <p className="text-sm text-muted-foreground">
        This area is restricted to firm staff.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Administration</h2>
        <p className="text-sm text-muted-foreground">
          Users, role-based access, and consultation requests.
        </p>
      </div>

      <section className="border border-border bg-background">
        <h3 className="border-b border-border px-5 py-3 font-serif text-lg">Users & roles</h3>
        <ul className="divide-y divide-border">
          {(profiles.data ?? []).map((p) => {
            const userRoles = (roles.data ?? []).filter((r) => r.user_id === p.id);
            return (
              <li key={p.id} className="space-y-3 p-5">
                <div>
                  <p className="font-medium">{p.full_name ?? "Unnamed user"}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.email} {p.phone ? `· ${p.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {userRoles.map((r) => (
                    <Badge key={r.id} variant="secondary" className="gap-2">
                      {ROLE_LABELS[r.role as AppRole]}
                      {me.isManager && (
                        <button
                          type="button"
                          className="cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => revoke.mutate(r.id)}
                          aria-label="Remove role"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                  {!userRoles.length && (
                    <span className="text-xs text-muted-foreground">No roles</span>
                  )}
                </div>
                {me.isManager && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={selected[p.id] ?? ""}
                      onValueChange={(v) => setSelected((s) => ({ ...s, [p.id]: v as AppRole }))}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Assign a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selected[p.id] || grant.isPending}
                      onClick={() => {
                        const role = selected[p.id];
                        if (role) grant.mutate({ userId: p.id, role });
                      }}
                    >
                      Grant
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border border-border bg-background">
        <h3 className="border-b border-border px-5 py-3 font-serif text-lg">
          Consultation requests
        </h3>
        {appointments.data?.length ? (
          <ul className="divide-y divide-border">
            {appointments.data.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-medium">{a.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.email} {a.phone ? `· ${a.phone}` : ""} · {a.consultation_type ?? "—"} ·{" "}
                    {formatDate(a.preferred_date)} {a.preferred_time ?? ""}
                  </p>
                  {a.message && <p className="mt-1 text-xs text-muted-foreground">{a.message}</p>}
                </div>
                <Badge variant="outline">{a.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-muted-foreground">No consultation requests yet.</p>
        )}
      </section>
    </div>
  );
}