import { NextResponse } from "next/server";
import { requirePlannerApiAccess } from "@/lib/api-auth";
import { syncShiftbaseEmployeesToDashboard } from "@/lib/dashboard/shiftbaseSync";
import {
  isShiftbaseConfigured,
  sanitizeShiftbaseUiMessage,
} from "@/lib/shiftbase";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * POST — importeer/update Shiftbase-medewerkers naar `crew_members`.
 * Alleen owner / admin / planner.
 */
export async function POST() {
  const auth = await requirePlannerApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SHIFTBASE_API_TOKEN of SHIFTBASE_API_KEY is niet geconfigureerd op de server",
      },
      { status: 503 },
    );
  }

  try {
    const result = await syncShiftbaseEmployeesToDashboard();

    if (result.imported > 0 || result.updated > 0) {
      revalidatePath("/dashboard/intern/crew");
      revalidatePath("/dashboard/intern/planning");
      revalidatePath("/dashboard/intern/integraties");
    }

    return NextResponse.json({
      ok: result.ok,
      imported: result.imported,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors,
      message: sanitizeShiftbaseUiMessage(result.message),
      ...(result.ok
        ? {}
        : {
            error: sanitizeShiftbaseUiMessage(
              result.errors[0] ?? result.message,
            ),
          }),
    });
  } catch (error) {
    console.error("[Shiftbase] Medewerkers-sync mislukt:", error);
    return NextResponse.json(
      {
        ok: false,
        error: sanitizeShiftbaseUiMessage(
          error instanceof Error ? error.message : "Sync mislukt",
        ),
      },
      { status: 502 },
    );
  }
}
