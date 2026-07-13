import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_ROLE_COOKIE, isDemoUserRole } from "@/lib/authRedirects";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const pathname = request.nextUrl.pathname;

  // TODO: Supabase Auth koppelen — verwijder demo cookie bypass
  // TODO: Role-based redirects server-side afdwingen per rol
  const demoRole = request.cookies.get(DEMO_ROLE_COOKIE)?.value;
  const isDemoInternal =
    isDemoUserRole(demoRole) && demoRole === "internal" && pathname.startsWith("/dashboard/intern");

  if (!url || !key) {
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

  const isProtected = pathname.startsWith("/dashboard");

  if (isProtected && !user && isDemoInternal) {
    return supabaseResponse;
  }

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
