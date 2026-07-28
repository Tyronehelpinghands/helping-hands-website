import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  buildGmailConsentUrl,
  canStartGmailOAuth,
  GMAIL_OAUTH_STATE_COOKIE,
} from "@/lib/integrations/gmail";

export const dynamic = "force-dynamic";

const INTEGRATIES_PATH = "/dashboard/intern/integraties";

function redirectToIntegraties(
  request: Request,
  params: Record<string, string>,
) {
  const url = new URL(INTEGRATIES_PATH, request.url);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url);
}

/**
 * GET /api/gmail/connect — start Google OAuth (alleen interne rollen).
 * Redirect naar Google consent; CSRF state in httpOnly cookie.
 */
export async function GET(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", INTEGRATIES_PATH);
    return NextResponse.redirect(login);
  }

  if (!canStartGmailOAuth()) {
    return redirectToIntegraties(request, {
      gmail: "error",
      message:
        "GOOGLE_CLIENT_ID en GOOGLE_CLIENT_SECRET moeten eerst in Vercel staan.",
    });
  }

  const state = randomBytes(32).toString("hex");
  const consentUrl = buildGmailConsentUrl(state);
  if (!consentUrl) {
    return redirectToIntegraties(request, {
      gmail: "error",
      message: "OAuth consent-URL kon niet worden opgebouwd.",
    });
  }

  const response = NextResponse.redirect(consentUrl);
  response.cookies.set(GMAIL_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
