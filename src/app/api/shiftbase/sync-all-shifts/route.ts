import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  syncShiftToShiftbase,
} from "@/lib/shiftbase";
import type { PlanningShift } from "@/data/planningMockData";

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
    const body = (await request.json()) as { shifts?: PlanningShift[] };
    const shifts = body.shifts ?? [];

    let synced = 0;
    let failed = 0;

    for (const shift of shifts) {
      try {
        await syncShiftToShiftbase(shift);
        synced++;
      } catch (err) {
        console.error("[Shiftbase] Bulk sync shift mislukt:", shift.id, err);
        failed++;
      }
    }

    return NextResponse.json({
      ok: failed === 0,
      synced,
      failed,
      message:
        failed > 0
          ? `${synced} shifts gesynchroniseerd, ${failed} mislukt.`
          : `${synced} shifts gesynchroniseerd.`,
    });
  } catch (error) {
    console.error("[Shiftbase] Sync all shifts mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
