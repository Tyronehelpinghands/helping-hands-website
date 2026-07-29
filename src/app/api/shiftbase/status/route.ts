import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { probeShiftbaseUsersStatus } from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

/**
 * GET /api/shiftbase/status — veilige statuscheck (geen token in response).
 * Test GET /users; retourneert connected, statusCode, endpointUsed, message.
 */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const result = await probeShiftbaseUsersStatus();

  return NextResponse.json({
    connected: result.connected,
    statusCode: result.statusCode,
    endpointUsed: result.endpointUsed,
    message: result.message,
    ok: result.connected,
  });
}
