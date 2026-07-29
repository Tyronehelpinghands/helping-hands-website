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
 * POST — importeer/update Shiftbase-gebruikers (/users) naar `crew_members`.
 * Alleen owner / admin / planner.
 */
export async function POST() {
  const auth = await requirePlannerApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isShiftbaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: [
          "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd op de server",
        ],
        error:
          "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd op de server",
        statusCode: null,
        endpointUsed: "/users",
        message:
          "Shiftbase API-key ontbreekt. Actie: Controleer Public API token, App Center Plus en endpoint.",
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

    const httpStatus = result.ok
      ? 200
      : result.statusCode === 401 || result.statusCode === 403
        ? 502
        : result.statusCode === 404
          ? 502
          : result.imported === 0 &&
              result.updated === 0 &&
              result.errors.length > 0
            ? 502
            : 200;

    return NextResponse.json(
      {
        ok: result.ok,
        imported: result.imported,
        updated: result.updated,
        skipped: result.skipped,
        errors: result.errors,
        statusCode: result.statusCode ?? null,
        endpointUsed: result.endpointUsed ?? "/users",
        message: sanitizeShiftbaseUiMessage(result.message),
        ...(result.ok
          ? {}
          : {
              error: sanitizeShiftbaseUiMessage(
                result.errors[0] ?? result.message,
              ),
            }),
      },
      { status: httpStatus },
    );
  } catch (error) {
    console.error("[Shiftbase] Medewerkers-sync mislukt:", error);
    return NextResponse.json(
      {
        ok: false,
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: [
          sanitizeShiftbaseUiMessage(
            error instanceof Error ? error.message : "Sync mislukt",
          ),
        ],
        error: sanitizeShiftbaseUiMessage(
          error instanceof Error ? error.message : "Sync mislukt",
        ),
        statusCode: null,
        endpointUsed: "/users",
      },
      { status: 502 },
    );
  }
}
