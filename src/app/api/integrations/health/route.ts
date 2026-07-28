import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  isIntegrationProvider,
  runAllIntegrationHealthChecks,
  runIntegrationHealthCheck,
} from "@/lib/integrations/healthChecks";

export const dynamic = "force-dynamic";

/**
 * GET /api/integrations/health?provider=shiftbase
 * GET /api/integrations/health?provider=all
 *
 * Live healthchecks per integratie. Geen secrets in response.
 */
export async function GET(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const provider = (searchParams.get("provider") ?? "all").trim().toLowerCase();

  if (provider === "all") {
    const results = await runAllIntegrationHealthChecks();
    return NextResponse.json({
      ok: results.every((r) => r.ok),
      results,
    });
  }

  if (!isIntegrationProvider(provider)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Onbekende provider. Gebruik: all of een van de bekende ids.`,
      },
      { status: 400 },
    );
  }

  const result = await runIntegrationHealthCheck(provider);
  return NextResponse.json({
    ok: result.ok,
    result,
  });
}
