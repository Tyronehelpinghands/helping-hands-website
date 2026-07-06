import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  testShiftbaseConnection,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "SHIFTBASE_API_TOKEN is niet geconfigureerd op de server" },
      { status: 503 },
    );
  }

  try {
    const result = await testShiftbaseConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Shiftbase] Test mislukt:", error);
    return NextResponse.json(
      { ok: false, error: formatShiftbaseError(error) },
      { status: 502 },
    );
  }
}
