/**
 * Auth barrel export — role helpers + Supabase profile types in één import.
 *
 * Rollen leven in `public.profiles.role` (Supabase). Zie docs/supabase-auth-setup.md
 * voor het schema, RLS-beleid en hoe je de eerste owner instelt.
 */

export type { Profile, UserRole } from "@/lib/supabase/types";
export { USER_ROLES, isValidRole } from "@/lib/supabase/types";

export {
  internalRoles,
  employeeRoles,
  clientRoles,
  isInternRole,
  isEmployeePortalRole,
  isClientPortalRole,
  getRoleLabel,
  getDashboardPathForRole,
  canAccessDashboardPath,
  canAccessPortal,
  resolveLoginDestination,
} from "@/lib/auth/roles";

// getCurrentUser / requireRole: importeer vanuit @/lib/auth/getCurrentUser
// en @/lib/auth/requireRole — niet hier, anders lekken next/headers naar client bundles.

export const PROFILE_INCOMPLETE_MESSAGE =
  "Je account is nog niet volledig ingesteld. Neem contact op met Helping Hands.";
