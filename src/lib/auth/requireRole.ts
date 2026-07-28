import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { Profile, UserRole } from "@/lib/supabase/types";

/**
 * Server-side gate voor layouts/pages: redirect naar /login als er geen
 * geldige sessie is, of naar /login?error=unauthorized als de rol niet mag.
 * Roept `redirect()` aan (gooit) — code hierna in de caller draait niet door
 * bij een afwijzing.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  options?: { redirectTo?: string },
): Promise<Profile> {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    const params = new URLSearchParams();
    if (options?.redirectTo) params.set("redirectTo", options.redirectTo);
    const query = params.toString();
    redirect(`/login${query ? `?${query}` : ""}`);
  }

  if (!profile) {
    redirect("/login?error=profile");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/login?error=unauthorized");
  }

  return profile;
}
