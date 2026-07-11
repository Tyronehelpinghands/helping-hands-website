import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { isMoneybirdConfigured } from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isMoneybirdConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "Moneybird configuratie ontbreekt. Controleer Vercel Environment Variables.",
    });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    message: "Moneybird API-koppeling is server-side voorbereid.",
  });
}
