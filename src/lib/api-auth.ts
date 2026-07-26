import { NextResponse } from "next/server";
import { isInternRole } from "@/lib/auth";
import {
  getDemoInternalProfile,
  getDemoRoleFromCookies,
  getSessionProfile,
} from "@/lib/auth-server";
import { isDemoApiAccessAllowed } from "@/lib/demoAccess";

export async function requireInternApiAccess() {
  const demoRole = await getDemoRoleFromCookies();
  if (demoRole === "internal" && isDemoApiAccessAllowed()) {
    return { profile: getDemoInternalProfile() };
  }

  const { user, profile } = await getSessionProfile();

  if (!user) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          error:
            demoRole === "internal" && !isDemoApiAccessAllowed()
              ? "Demo-API-toegang is uitgeschakeld. Zet ALLOW_DEMO_API_ACCESS=true of log in met een intern account."
              : "Niet ingelogd",
        },
        { status: 401 },
      ),
    };
  }

  if (!profile) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          error:
            "Je account is nog niet volledig ingesteld. Neem contact op met Helping Hands.",
        },
        { status: 403 },
      ),
    };
  }

  if (!isInternRole(profile.role)) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Geen toegang tot deze API" },
        { status: 403 },
      ),
    };
  }

  return { profile };
}
