import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { getGmailConfigStatus } from "@/lib/integrations/gmail";

export const dynamic = "force-dynamic";

/** GET /api/integrations/gmail/status — geen secrets in response. */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const status = getGmailConfigStatus();

  if (!status.configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "Gmail API niet geconfigureerd. mailto en gedeelde mailboxen werken wel.",
      missing: status.missing,
      sender: status.sender,
      mailboxes: status.mailboxes,
    });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    message: "Gmail API OAuth env-vars aanwezig (server-side).",
    sender: status.sender,
    mailboxes: status.mailboxes,
  });
}
