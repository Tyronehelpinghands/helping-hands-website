import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { sendGmailMessage } from "@/lib/integrations/gmail";

export const dynamic = "force-dynamic";

type SendBody = {
  to?: string;
  subject?: string;
  body?: string;
  from?: string;
};

/** POST /api/integrations/gmail/send — alleen interne rollen. */
export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  let payload: SendBody;
  try {
    payload = (await request.json()) as SendBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige JSON-body" },
      { status: 400 },
    );
  }

  const result = await sendGmailMessage({
    to: payload.to ?? "",
    subject: payload.subject ?? "",
    body: payload.body ?? "",
    from: payload.from,
  });

  if (!result.ok) {
    return NextResponse.json(result, {
      status: result.configured ? 502 : 503,
    });
  }

  return NextResponse.json(result);
}
