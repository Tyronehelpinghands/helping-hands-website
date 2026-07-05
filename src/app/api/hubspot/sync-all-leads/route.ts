import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { formatHubSpotError, isHubSpotConfigured, syncAllToHubSpot } from "@/lib/hubspot";
import { mockLeads } from "@/data/leadsMockData";

export const dynamic = "force-dynamic";

export async function POST() {
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
    const payload = mockLeads
      .filter(
        (lead) =>
          lead.status !== "verloren" &&
          lead.status !== "omgezet_naar_deal" &&
          lead.hubspotSyncStatus !== "gesynchroniseerd" &&
          lead.email,
      )
      .map((lead) => ({
        id: lead.id,
        email: lead.email,
        contact: lead.contact,
        bedrijf: lead.bedrijf,
        waarde: lead.waarde,
        status: lead.status,
      }));

    const result = await syncAllToHubSpot(payload);

    return NextResponse.json({
      ok: true,
      message: "Leads bulk synchronisatie voltooid",
      ...result,
    });
  } catch (error) {
    console.error("[HubSpot] sync-all-leads mislukt:", error);
    return NextResponse.json(
      {
        ok: false,
        error: formatHubSpotError(error),
      },
      { status: 502 },
    );
  }
}
