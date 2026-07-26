import { redirect } from "next/navigation";
import {
  canAccessDashboardPath,
  canAccessPortal,
  getDashboardPathForRole,
  isValidRole,
  type Profile,
  type UserRole,
} from "@/lib/auth";
import {
  DEMO_ROLE_COOKIE,
  demoRoleToPortalType,
  isDemoUserRole,
  type DemoUserRole,
} from "@/lib/authRedirects";
import { isDemoUiAccessAllowed } from "@/lib/demoAccess";
import type { PortalType } from "@/lib/portals";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const DEMO_INTERNAL_PROFILE: Profile = {
  id: "demo-internal",
  email: "demo@helpinghands.nl",
  role: "admin",
  full_name: "Demo Admin",
};

const DEMO_EMPLOYEE_PROFILE: Profile = {
  id: "demo-employee",
  email: "demo-crew@helpinghands.nl",
  role: "medewerker",
  full_name: "Demo Medewerker",
};

const DEMO_CLIENT_PROFILE: Profile = {
  id: "demo-client",
  email: "demo-client@helpinghands.nl",
  role: "opdrachtgever",
  full_name: "Demo Opdrachtgever",
};

export function getDemoInternalProfile(): Profile {
  return DEMO_INTERNAL_PROFILE;
}

export function getDemoProfileForRole(demoRole: DemoUserRole): Profile {
  switch (demoRole) {
    case "internal":
      return DEMO_INTERNAL_PROFILE;
    case "employee":
      return DEMO_EMPLOYEE_PROFILE;
    case "client":
      return DEMO_CLIENT_PROFILE;
  }
}

export async function getDemoRoleFromCookies(): Promise<DemoUserRole | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  return isDemoUserRole(value) ? value : null;
}

async function getAllowedDemoRole(): Promise<DemoUserRole | null> {
  if (!isDemoUiAccessAllowed()) return null;
  return getDemoRoleFromCookies();
}

export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  if (!isSupabaseConfigured()) {
    return { user: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !isValidRole(profile.role)) {
    return { user: { id: user.id, email: user.email }, profile: null };
  }

  return {
    user: { id: user.id, email: user.email },
    profile: profile as Profile,
  };
}

export async function requireDashboardAccess(allowedRoles: UserRole[]) {
  const demoRole = await getAllowedDemoRole();
  if (
    demoRole === "internal" &&
    allowedRoles.some((role) => role === "admin" || role === "planner")
  ) {
    return getDemoInternalProfile();
  }

  if (demoRole === "employee" && allowedRoles.includes("medewerker")) {
    return getDemoProfileForRole("employee");
  }

  if (demoRole === "client" && allowedRoles.includes("opdrachtgever")) {
    return getDemoProfileForRole("client");
  }

  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/login?error=profile");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect(getDashboardPathForRole(profile.role));
  }

  return profile;
}

/** Server gate voor /portaal/medewerkers en /portaal/opdrachtgevers. */
export async function requirePortalAccess(portal: PortalType) {
  const demoRole = await getAllowedDemoRole();
  if (demoRole && demoRoleToPortalType(demoRole) === portal) {
    return getDemoProfileForRole(demoRole);
  }

  // Intern demo mag portalen bekijken (impersonatie-light).
  if (demoRole === "internal") {
    return getDemoInternalProfile();
  }

  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect(`/login?type=${portal}`);
  }

  if (!profile) {
    redirect("/login?error=profile");
  }

  if (!canAccessPortal(profile.role, portal)) {
    redirect(getDashboardPathForRole(profile.role));
  }

  return profile;
}

export async function requireDashboardPath(pathname: string) {
  const demoRole = await getAllowedDemoRole();
  if (demoRole) {
    const demoProfile = getDemoProfileForRole(demoRole);
    if (canAccessDashboardPath(demoProfile.role, pathname)) {
      return demoProfile;
    }
  }

  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (!profile) {
    redirect("/login?error=profile");
  }

  if (!canAccessDashboardPath(profile.role, pathname)) {
    redirect(getDashboardPathForRole(profile.role));
  }

  return profile;
}
