import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { buildShiftbaseDescription } from "@/lib/planning-utils";
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
    const body = (await request.json()) as Partial<PlanningShift>;
    if (!body.title || !body.startTime || !body.endTime) {
      return NextResponse.json(
        { ok: false, error: "Shiftgegevens onvolledig" },
        { status: 400 },
      );
    }

    const shift = body as PlanningShift;
    const result = await syncShiftToShiftbase(shift);

    return NextResponse.json({
      ok: true,
      shiftbaseShiftId: result.shiftbaseShiftId,
      description: buildShiftbaseDescription(shift),
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Shiftbase] Sync shift mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
