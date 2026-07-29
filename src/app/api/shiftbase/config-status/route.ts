import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  getShiftbaseApiBaseUrl,
  getShiftbaseApiToken,
  getShiftbaseBaseUrlCandidates,
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
      baseUrlCandidates: getShiftbaseBaseUrlCandidates(),
      baseUrlFromEnv: Boolean(process.env.SHIFTBASE_API_BASE_URL?.trim()),
      rawTokenPresent: Boolean(process.env.SHIFTBASE_API_TOKEN?.trim()),
      rawKeyPresent: Boolean(process.env.SHIFTBASE_API_KEY?.trim()),
      endpoints: {
        test: SHIFTBASE_ENDPOINTS.test,
        users: SHIFTBASE_ENDPOINTS.users,
        shifts: SHIFTBASE_ENDPOINTS.shifts,
        timesheets: SHIFTBASE_ENDPOINTS.timesheets,
      },
      resolvedTestUrl: resolveShiftbaseUrl(SHIFTBASE_ENDPOINTS.test),
    },
    hint: configured
      ? "Key/token is zichtbaar in deze runtime. Gebruik Test API of /api/shiftbase/status. Endpoint: /users (niet /employees). Auth: Authorization: API <token>."
      : "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN ontbreekt. Public API-token via App center → Public API.",
  });
}
