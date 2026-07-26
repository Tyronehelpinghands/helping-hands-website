import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessDashboardPath,
  isValidRole,
  type UserRole,
} from "@/lib/auth";
import {
  DEMO_ROLE_COOKIE,
  getProtectedPortal,
  isDemoUserRole,
} from "@/lib/authRedirects";
import { isDemoUiAccessAllowed } from "@/lib/demoAccess";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function hasAllowedDemoAccess(
  request: NextRequest,
  expectedDemoRole: string,
): boolean {
  if (!isDemoUiAccessAllowed()) return false;
  const demoRole = request.cookies.get(DEMO_ROLE_COOKIE)?.value;
  return (
    isDemoUserRole(demoRole) &&
    (demoRole === expectedDemoRole || demoRole === "internal")
  );
}

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const pathname = request.nextUrl.pathname;
  const protectedPortal = getProtectedPortal(pathname);

  const hasMatchingDemoRole = Boolean(
    protectedPortal &&
      hasAllowedDemoAccess(request, protectedPortal.demoRole),
  );

  if (!url || !key) {
    if (protectedPortal && !hasMatchingDemoRole) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = new URLSearchParams({
        type: protectedPortal.loginType,
        next: pathname,
      }).toString();
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (protectedPortal) {
    let hasSupabaseAccess = false;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role && isValidRole(profile.role)) {
        hasSupabaseAccess = canAccessDashboardPath(
          profile.role as UserRole,
          pathname,
        );
      }
    }

    if (!hasMatchingDemoRole && !hasSupabaseAccess) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = new URLSearchParams({
        type: protectedPortal.loginType,
        next: pathname,
      }).toString();
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  return supabaseResponse;
}
