import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { getGmailConfigStatusAsync } from "@/lib/integrations/gmail";

export const dynamic = "force-dynamic";

/** GET /api/integrations/gmail/status — geen secrets in response. */
export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const status = await getGmailConfigStatusAsync();

  if (!status.configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      message:
        "Gmail API niet geconfigureerd. mailto en gedeelde mailboxen werken wel.",
      missing: status.missing,
      sender: status.sender,
      mailboxes: status.mailboxes,
      canConnect: status.canConnect,
    });
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    message: "Gmail API OAuth geconfigureerd (server-side).",
    sender: status.sender,
    mailboxes: status.mailboxes,
    canConnect: status.canConnect,
  });
}
