import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

function getMissingMoneybirdVars(): string[] {
  const missing: string[] = [];
  if (!process.env.MONEYBIRD_ACCESS_TOKEN?.trim()) {
    missing.push("MONEYBIRD_ACCESS_TOKEN");
  }
  if (!process.env.MONEYBIRD_ADMINISTRATION_ID?.trim()) {
    missing.push("MONEYBIRD_ADMINISTRATION_ID");
  }
  return missing;
}

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const missing = getMissingMoneybirdVars();
  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message: `Moneybird configuratie ontbreekt: ${missing.join(", ")}`,
      missing,
    });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    message: "Moneybird API-koppeling is server-side voorbereid.",
  });
}
