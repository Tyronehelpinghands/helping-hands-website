import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { formatHubSpotError, isHubSpotConfigured, syncAllToHubSpot } from "@/lib/hubspot";
import { salesLeads } from "@/data/salesMockData";

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
    const payload = salesLeads
      .filter((lead) => lead.status !== "verloren" && lead.waarde > 0)
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
      message: "Bulk synchronisatie voltooid",
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: formatHubSpotError(error),
      },
      { status: 502 },
    );
  }
}
