import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { probeOpenClawConnection } from "@/lib/integrations/openclaw";

export const dynamic = "force-dynamic";

/** GET /api/integrations/openclaw/status — geen tokens in response. */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const result = await probeOpenClawConnection();
  return NextResponse.json({
    ok: result.ok,
    configured: result.configured,
    reachable: result.reachable,
    status: result.status,
    message: result.message,
    gatewayHost: result.gatewayHost,
    missing: "missing" in result ? result.missing : undefined,
  });
}
