import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  getShiftbaseApiBaseUrl,
  getShiftbaseApiToken,
  isShiftbaseConfigured,
  resolveShiftbaseUrl,
  SHIFTBASE_ENDPOINTS,
} from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

/**
 * Diagnose-endpoint: toont of de server de Shiftbase env vars ziet.
 * Geeft nooit tokenwaarden terug — alleen boolean + lengte.
 */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) {
    return auth.error;
  }

  const token = getShiftbaseApiToken();
  const configured = isShiftbaseConfigured();

  return NextResponse.json({
    ok: true,
    configured,
    runtime: {
      nodeEnv: process.env.NODE_ENV ?? null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
    },
    shiftbase: {
      hasToken: Boolean(token),
      tokenLength: token?.length ?? 0,
      baseUrl: getShiftbaseApiBaseUrl(),
      baseUrlFromEnv: Boolean(process.env.SHIFTBASE_API_BASE_URL?.trim()),
      rawKeyPresent: Boolean(process.env.SHIFTBASE_API_TOKEN),
      endpoints: {
        test: SHIFTBASE_ENDPOINTS.test,
        employees: SHIFTBASE_ENDPOINTS.employees,
        shifts: SHIFTBASE_ENDPOINTS.shifts,
        timesheets: SHIFTBASE_ENDPOINTS.timesheets,
      },
      resolvedTestUrl: resolveShiftbaseUrl(SHIFTBASE_ENDPOINTS.test),
    },
    hint: configured
      ? "Token is zichtbaar in deze server-runtime. Gebruik /api/shiftbase/test voor de API-check."
      : "SHIFTBASE_API_TOKEN ontbreekt in deze runtime. Zet de variabele in Vercel → Production, redeploy, en test opnieuw.",
  });
}
