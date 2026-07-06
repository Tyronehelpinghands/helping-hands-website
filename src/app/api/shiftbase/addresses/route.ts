import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  getEmployeeHomeAddressFromShiftbase,
  isShiftbaseConfigured,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SHIFTBASE_API_TOKEN is niet geconfigureerd op de server" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { employeeIds?: string[] };
    const ids = body.employeeIds ?? [];

    const addresses = [];
    for (const id of ids) {
      try {
        const address = await getEmployeeHomeAddressFromShiftbase(id);
        addresses.push({
          employeeId: id,
          city: address?.city ?? null,
          postalCode: address?.postalCode ?? null,
          country: address?.country ?? null,
        });
      } catch (err) {
        console.error("[Shiftbase] Adres ophalen mislukt:", id, err);
        addresses.push({ employeeId: id, city: null, error: true });
      }
    }

    return NextResponse.json({
      ok: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("[Shiftbase] Addresses ophalen mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
