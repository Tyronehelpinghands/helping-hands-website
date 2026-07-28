import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessDashboardPath } from "@/lib/auth/roles";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { isValidRole } from "@/lib/supabase/types";

const PROTECTED_PREFIXES = [
  "/dashboard/intern",
  "/dashboard/medewerker",
  "/dashboard/opdrachtgever",
  "/portaal/medewerkers",
  "/portaal/opdrachtgevers",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function loginRedirectUrl(request: NextRequest, pathname: string, error?: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  const params = new URLSearchParams();
  if (error) {
    params.set("error", error);
  } else {
    params.set("redirectTo", pathname);
  }
  loginUrl.search = params.toString();
  return loginUrl;
}

/**
 * Refresh de Supabase-sessie op elk request en bewaakt de beschermde
 * dashboard-/portaalroutes server-side (voordat React ze rendert).
 *
 * Officieel @supabase/ssr-patroon: nooit code tussen createServerClient en
 * auth.getUser() plaatsen, en altijd een NextResponse teruggeven die de
 * (mogelijk ververste) cookies bevat.
 */
export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  const pathname = request.nextUrl.pathname;

  if (!url || !key) {
    if (isProtectedPath(pathname)) {
      return NextResponse.redirect(loginRedirectUrl(request, pathname));
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

  // Belangrijk: direct na createServerClient de sessie ophalen/verversen.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isProtectedPath(pathname)) {
    return supabaseResponse;
  }

  if (!user) {
    return NextResponse.redirect(loginRedirectUrl(request, pathname));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role;

  if (!role || !isValidRole(role) || !canAccessDashboardPath(role, pathname)) {
    return NextResponse.redirect(loginRedirectUrl(request, pathname, "unauthorized"));
  }

  return supabaseResponse;
}
