import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { calculateTravelKilometers } from "@/lib/shiftbase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const body = (await request.json()) as {
      homeCity?: string;
      projectAddress?: string;
      feePerKm?: number;
    };

    const result = calculateTravelKilometers(
      body.homeCity ? { city: body.homeCity } : null,
      body.projectAddress ?? null,
      body.feePerKm ?? 0.25,
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[Shiftbase] KM berekening mislukt:", error);
    return NextResponse.json(
      { ok: false, error: "Kilometerberekening mislukt." },
      { status: 500 },
    );
  }
}
