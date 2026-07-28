import { NextResponse } from "next/server";
import {
  getWhatsAppConfigStatus,
  verifyWhatsAppWebhookChallenge,
} from "@/lib/integrations/whatsapp";

export const dynamic = "force-dynamic";

/**
 * Meta webhook verification (public — no session auth).
 * GET ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = verifyWhatsAppWebhookChallenge({
    mode: searchParams.get("hub.mode"),
    token: searchParams.get("hub.verify_token"),
    challenge: searchParams.get("hub.challenge"),
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 403 });
  }

  return new NextResponse(result.challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

/**
 * Incoming WhatsApp events stub — acknowledges receipt.
 * Full message routing can be added later (store in Supabase, notify planners).
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // Do not log full payload (may contain phone numbers / message bodies).
    const objectType =
      typeof payload === "object" &&
      payload !== null &&
      "object" in payload &&
      typeof (payload as { object?: unknown }).object === "string"
        ? (payload as { object: string }).object
        : "unknown";

    if (objectType !== "whatsapp_business_account") {
      return NextResponse.json(
        { ok: false, error: "Onbekend webhook-object" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      received: true,
      configured: getWhatsAppConfigStatus().configured,
      message: "Webhook ontvangen (stub — nog geen inbox-verwerking).",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige webhook-body" },
      { status: 400 },
    );
  }
}
