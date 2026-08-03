import { NextResponse } from "next/server";
import { isInternRole } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { UserRole } from "@/lib/supabase/types";

const PLANNER_API_ROLES: UserRole[] = ["owner", "admin", "planner"];
const FINANCE_API_ROLES: UserRole[] = ["owner", "admin", "finance"];

/** Alleen echte Supabase-sessies met intern-rol mogen integratie-API’s gebruiken. */
export async function requireInternApiAccess() {
  const { user, profile } = await getCurrentUser();

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

/** Planner/admin/owner — voor muterende sync-acties (crew, shifts). */
export async function requirePlannerApiAccess() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth;

  if (!PLANNER_API_ROLES.includes(auth.profile.role)) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          error: "Alleen planner, admin of owner mag medewerkers synchroniseren.",
        },
        { status: 403 },
      ),
    };
  }

  return { profile: auth.profile };
}

/** Finance/admin/owner — voor Moneybird factuur-mutaties. */
export async function requireFinanceApiAccess() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth;

  if (!FINANCE_API_ROLES.includes(auth.profile.role)) {
    return {
      error: NextResponse.json(
        {
          ok: false,
          error:
            "Alleen finance, admin of owner mag Moneybird-facturen aanmaken of versturen.",
        },
        { status: 403 },
      ),
    };
  }

  return { profile: auth.profile };
}
