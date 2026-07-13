import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  DEMO_ROLE_COOKIE,
  getProtectedPortal,
  isDemoUserRole,
} from "@/lib/authRedirects";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const pathname = request.nextUrl.pathname;
  const protectedPortal = getProtectedPortal(pathname);

  // TODO: Supabase Auth koppelen — vervang demo cookie door echte rolcontrole
  // TODO: Role-based redirects server-side afdwingen per rol
  const demoRole = request.cookies.get(DEMO_ROLE_COOKIE)?.value;
  const hasMatchingDemoRole =
    protectedPortal &&
    isDemoUserRole(demoRole) &&
    demoRole === protectedPortal.demoRole;

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
    const isInternDashboard = protectedPortal.demoRole === "internal";
    const hasSupabaseAccess = Boolean(user) && isInternDashboard;

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
