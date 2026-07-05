import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  isHubSpotConfigured,
  syncLeadToHubSpot,
  type HubSpotLeadInput,
} from "@/lib/hubspot";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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
    const body = (await request.json()) as Partial<HubSpotLeadInput>;

    if (!body.email || !body.contact || !body.bedrijf) {
      return NextResponse.json(
        {
          ok: false,
          error: "email, contact en bedrijf zijn verplicht",
        },
        { status: 400 },
      );
    }

    const lead: HubSpotLeadInput = {
      id: body.id ?? `lead-${Date.now()}`,
      email: body.email,
      contact: body.contact,
      bedrijf: body.bedrijf,
      waarde: body.waarde,
      status: body.status,
    };

    const result = await syncLeadToHubSpot(lead);

    return NextResponse.json({
      ok: true,
      message: "Lead gesynchroniseerd naar HubSpot",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Lead synchronisatie mislukt",
      },
      { status: 502 },
    );
  }
}
