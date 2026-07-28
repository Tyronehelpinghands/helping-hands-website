import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { getWhatsAppConfigStatus } from "@/lib/integrations/whatsapp";

export const dynamic = "force-dynamic";

/** GET /api/integrations/whatsapp/status — geen tokens in response. */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const status = getWhatsAppConfigStatus();

  if (!status.configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "WhatsApp Cloud API niet geconfigureerd. wa.me werkt wel via siteConfig.",
      missing: status.missing,
      planningWaMeUrl: status.planningWaMeUrl,
      phoneDisplay: status.phoneDisplay,
    });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    message: "WhatsApp Cloud API env-vars aanwezig (server-side).",
    planningWaMeUrl: status.planningWaMeUrl,
    phoneDisplay: status.phoneDisplay,
  });
}
