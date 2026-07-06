import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  syncHoursFromShiftbase,
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
    const body = (await request.json().catch(() => ({}))) as {
      start_date?: string;
      end_date?: string;
    };

    const result = await syncHoursFromShiftbase({
      startDate: body.start_date,
      endDate: body.end_date,
    });

    return NextResponse.json({
      ok: true,
      count: result.count,
      message: `${result.count} urenregistraties opgehaald uit Shiftbase.`,
    });
  } catch (error) {
    console.error("[Shiftbase] Sync hours mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
