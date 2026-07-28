import { NextResponse } from "next/server";
import {
  canAccessDashboardPath,
  getDashboardPathForRole,
  isValidRole,
} from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Wachtwoord-reset mag altijd naar /update-password.
      if (next === "/update-password") {
        return NextResponse.redirect(`${origin}/update-password`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role && isValidRole(profile.role)) {
          const destination =
            isSafeInternalPath(next) && canAccessDashboardPath(profile.role, next)
              ? next
              : getDashboardPathForRole(profile.role);
          return NextResponse.redirect(`${origin}${destination}`);
        }
      }

      return NextResponse.redirect(`${origin}/login?error=profile`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
