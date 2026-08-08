/**
 * Canonical Supabase `profiles` table shape and role enum.
 *
 * Roles map 1:1 to the `role` column on `public.profiles` (see
 * docs/supabase-auth-setup.md for the SQL that creates this table + RLS).
 */

export const USER_ROLES = [
  "owner",
  "admin",
  "planner",
  "sales",
  "finance",
  "crew",
  "client",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type Profile = {
  id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  /** Optional; used for outbound e-mail signatures. */
  phone?: string | null;
};

export function isValidRole(role: string | null | undefined): role is UserRole {
  return (USER_ROLES as readonly string[]).includes(role ?? "");
}
