import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import { sendOpenClawAgentMessage } from "@/lib/integrations/openclaw";

export const dynamic = "force-dynamic";

type AskBody = {
  message?: string;
};

/** POST /api/integrations/openclaw/ask — alleen interne rollen. */
export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  let payload: AskBody;
  try {
    payload = (await request.json()) as AskBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige JSON-body." },
      { status: 400 },
    );
  }

  const message = typeof payload.message === "string" ? payload.message : "";
  const result = await sendOpenClawAgentMessage({
    name: "Intern dashboard",
    message: [
      `Operator: ${auth.profile.full_name || auth.profile.email} (${auth.profile.role})`,
      "Bron: intern dashboard Helping Hands.",
      "",
      message,
      "",
      "Regels: je mag voorstellen doen. Geen definitieve externe acties zonder toestemming van Tyrone.",
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(result, {
      status: result.configured ? 502 : 503,
    });
  }

  return NextResponse.json(result);
}
