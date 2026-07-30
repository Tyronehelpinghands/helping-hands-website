import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { pushTimeEntriesToShiftbase } from "@/lib/dashboard/shiftbaseSync";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

/**
 * POST /api/shiftbase/push-hours
 * Best-effort push of submitted/approved time_entries → Shiftbase Timesheets.
 * Body: { entryIds?: string[], start_date?: string, end_date?: string }
 */
export async function POST(request: Request) {
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
    const body = (await request.json().catch(() => ({}))) as {
      entryIds?: string[];
      start_date?: string;
      end_date?: string;
    };

    const result = await pushTimeEntriesToShiftbase({
      entryIds: body.entryIds,
      startDate: body.start_date,
      endDate: body.end_date,
    });

    return NextResponse.json({
      ok: result.ok,
      pushed: result.pushed,
      skipped: result.skipped,
      errors: result.errors,
      message: result.message,
    });
  } catch (error) {
    console.error("[Shiftbase] Push hours mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
