import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  isGoogleMapsConfigured,
  testGoogleMapsConnection,
} from "@/lib/server/googleMaps";

export const dynamic = "force-dynamic";

/** GET /api/kilometers/status — veilige statuscheck (geen API-key in response). */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isGoogleMapsConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "GOOGLE_MAPS_API_KEY ontbreekt. Voeg toe in Vercel Environment Variables.",
    });
  }

  try {
    const result = await testGoogleMapsConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Google Maps] Statuscheck mislukt:", error);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        message: "Google Maps statuscontrole mislukt.",
      },
      { status: 502 },
    );
  }
}
