import { redirect } from "next/navigation";
import {
  canAccessDashboardPath,
  getDashboardPathForRole,
  isValidRole,
  type Profile,
  type UserRole,
} from "@/lib/auth";
import {
  DEMO_ROLE_COOKIE,
  isDemoUserRole,
  type DemoUserRole,
} from "@/lib/authRedirects";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const DEMO_INTERNAL_PROFILE: Profile = {
  id: "demo-internal",
  email: "demo@helpinghands.nl",
  role: "admin",
  full_name: "Demo Admin",
};

export async function getDemoRoleFromCookies(): Promise<DemoUserRole | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  return isDemoUserRole(value) ? value : null;
}

export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
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
  const demoRole = await getDemoRoleFromCookies();
  if (
    demoRole === "internal" &&
    allowedRoles.some((role) => role === "admin" || role === "planner")
  ) {
  // TODO: Vervang demo-profiel door echte Supabase Auth + rolcontrole
    return DEMO_INTERNAL_PROFILE;
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

export async function requireDashboardPath(pathname: string) {
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
