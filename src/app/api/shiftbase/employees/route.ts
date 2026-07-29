import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  getShiftbaseEmployees,
  isShiftbaseConfigured,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

/** GET — lijst Shiftbase-gebruikers via /users (niet /employees). */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd op de server",
      },
      { status: 503 },
    );
  }

  try {
    const { employees, endpointUsed } = await getShiftbaseEmployees();
    return NextResponse.json({
      ok: true,
      count: employees.length,
      endpointUsed,
      employees: employees.map((e) => ({
        id: e.id,
        fullName: e.fullName,
        email: e.email,
        phone: e.phone,
        city: e.city ?? e.address?.city,
        roleType: e.roleType,
        status: e.status,
      })),
    });
  } catch (error) {
    console.error("[Shiftbase] Users ophalen mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
