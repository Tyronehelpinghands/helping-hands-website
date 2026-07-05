import { NextResponse } from "next/server";
import { isInternRole } from "@/lib/auth";
import { getSessionProfile } from "@/lib/auth-server";

export async function requireInternApiAccess() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Niet ingelogd" },
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
