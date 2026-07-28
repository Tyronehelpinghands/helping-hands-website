import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isInternRole } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  exchangeGmailAuthCode,
  getGoogleRefreshToken,
  GMAIL_OAUTH_PENDING_RT_COOKIE,
  GMAIL_OAUTH_STATE_COOKIE,
  saveGmailOAuthRefreshToken,
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

function clearOauthCookies(response: NextResponse) {
  response.cookies.set(GMAIL_OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * GET /api/gmail/callback — Google OAuth redirect URI.
 * Live: https://www.helpinghandsagency.nl/api/gmail/callback
 *
 * Tokens worden nooit gelogd en nooit in de publieke URL gezet.
 * Prefer: opslaan in company_settings (gmail_oauth).
 * Fallback: korte httpOnly cookie → eenmalige flash op Integraties voor Vercel env.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oauthError = searchParams.get("error");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (oauthError) {
    const message =
      searchParams.get("error_description") ?? oauthError ?? "OAuth geannuleerd";
    return redirectToIntegraties(request, {
      gmail: "error",
      message: message.slice(0, 200),
    });
  }

  if (!code || !state) {
    return redirectToIntegraties(request, {
      gmail: "error",
      message: "Ongeldige OAuth-callback (code of state ontbreekt).",
    });
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(GMAIL_OAUTH_STATE_COOKIE)?.value;

  if (!expectedState || expectedState !== state) {
    const response = redirectToIntegraties(request, {
      gmail: "error",
      message: "Ongeldige OAuth-state (CSRF). Start opnieuw via Gmail koppelen.",
    });
    clearOauthCookies(response);
    return response;
  }

  const { user, profile } = await getCurrentUser();
  if (!user || !profile || !isInternRole(profile.role)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", INTEGRATIES_PATH);
    login.searchParams.set("error", "gmail_oauth");
    const response = NextResponse.redirect(login);
    clearOauthCookies(response);
    return response;
  }

  const tokenResult = await exchangeGmailAuthCode(code);

  if (!tokenResult.ok) {
    const response = redirectToIntegraties(request, {
      gmail: "error",
      message: tokenResult.error.slice(0, 200),
    });
    clearOauthCookies(response);
    return response;
  }

  const envAlreadySet = Boolean(getGoogleRefreshToken());
  const refreshToken = tokenResult.refreshToken;

  if (refreshToken) {
    const saved = await saveGmailOAuthRefreshToken(refreshToken);
    if (saved.ok) {
      const response = redirectToIntegraties(request, { gmail: "connected" });
      clearOauthCookies(response);
      return response;
    }

    // Fallback: eenmalig tonen achter intern-auth → plak in Vercel.
    const response = redirectToIntegraties(request, {
      gmail: "connected",
      needs_env: "1",
    });
    clearOauthCookies(response);
    response.cookies.set(GMAIL_OAUTH_PENDING_RT_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    });
    return response;
  }

  if (envAlreadySet) {
    const response = redirectToIntegraties(request, { gmail: "connected" });
    clearOauthCookies(response);
    return response;
  }

  const response = redirectToIntegraties(request, {
    gmail: "error",
    message:
      "Geen refresh_token ontvangen. Herhaal met prompt=consent of controleer Google Cloud.",
  });
  clearOauthCookies(response);
  return response;
}
