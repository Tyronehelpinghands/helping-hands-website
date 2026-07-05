import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { isHubSpotConfigured, testHubSpotConnection } from "@/lib/hubspot";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) {
    return auth.error;
  }

  if (!isHubSpotConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "HUBSPOT_ACCESS_TOKEN is niet geconfigureerd op de server",
      },
      { status: 503 },
    );
  }

  try {
    const result = await testHubSpotConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "HubSpot connectie mislukt",
      },
      { status: 502 },
    );
  }
}
