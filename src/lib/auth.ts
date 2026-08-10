import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "super_admin"
  | "managing_partner"
  | "lawyer"
  | "paralegal"
  | "secretary"
  | "client";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  managing_partner: "Managing Partner",
  lawyer: "Lawyer",
  paralegal: "Paralegal / Legal Assistant",
  secretary: "Secretary / Receptionist",
  client: "Client",
};

export const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];
const STAFF_ROLES: AppRole[] = [
  "super_admin",
  "managing_partner",
  "lawyer",
  "paralegal",
  "secretary",
];
const MANAGER_ROLES: AppRole[] = ["super_admin", "managing_partner"];

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;

      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);

      const roles = (rolesRes.data ?? []).map((r) => r.role as AppRole);
      return {
        user,
        profile: profileRes.data,
        roles,
        isStaff: roles.some((r) => STAFF_ROLES.includes(r)),
        isManager: roles.some((r) => MANAGER_ROLES.includes(r)),
      };
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
    },
  });
}