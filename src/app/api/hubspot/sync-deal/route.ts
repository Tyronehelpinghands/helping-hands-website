import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  isHubSpotConfigured,
  syncDealToHubSpot,
  type HubSpotDealInput,
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
    const body = (await request.json()) as Partial<HubSpotDealInput>;

    if (!body.title || body.amount === undefined) {
      return NextResponse.json(
        {
          ok: false,
          error: "title en amount zijn verplicht",
        },
        { status: 400 },
      );
    }

    const deal: HubSpotDealInput = {
      id: body.id ?? `deal-${Date.now()}`,
      title: body.title,
      amount: Number(body.amount),
      stage: body.stage,
      bedrijf: body.bedrijf,
    };

    const result = await syncDealToHubSpot(deal);

    return NextResponse.json({
      ok: true,
      message: "Deal gesynchroniseerd naar HubSpot",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Deal synchronisatie mislukt",
      },
      { status: 502 },
    );
  }
}
