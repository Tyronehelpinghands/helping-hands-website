import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  calculateKilometersBetween,
  isGoogleMapsConfigured,
} from "@/lib/server/googleMaps";

export const dynamic = "force-dynamic";

/** HEAD /api/kilometers — beschikbaarheidscheck voor urenregistratie UI. */
export async function HEAD() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isGoogleMapsConfigured()) {
    return new NextResponse(null, { status: 503 });
  }

  return new NextResponse(null, { status: 200 });
}

/** POST /api/kilometers — bereken afstand tussen twee adressen (server-side). */
export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isGoogleMapsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "GOOGLE_MAPS_API_KEY is niet geconfigureerd op de server.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      fromAddress?: string;
      toAddress?: string;
      originAddress?: string;
      destinationAddress?: string;
      homeCity?: string;
      projectAddress?: string;
    };

    const from =
      body.fromAddress?.trim() ??
      body.originAddress?.trim() ??
      (body.homeCity ? `${body.homeCity}, Nederland` : "");
    const to =
      body.toAddress?.trim() ??
      body.destinationAddress?.trim() ??
      body.projectAddress?.trim() ??
      "";

    const result = await calculateKilometersBetween(from, to);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.message ?? "Berekening mislukt." },
        { status: 422 },
      );
    }

    return NextResponse.json({
      ok: true,
      kilometers: result.kilometers,
      oneWayKm: result.oneWayKm,
      returnKm: result.returnKm,
      message: result.message,
    });
  } catch (error) {
    console.error("[Google Maps] Kilometerberekening mislukt:", error);
    return NextResponse.json(
      { ok: false, error: "Kilometerberekening mislukt." },
      { status: 500 },
    );
  }
}
