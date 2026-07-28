/**
 * Gmail / Google Workspace helpers — server-only.
 * Niet importeren in client components.
 *
 * Direct bruikbaar: mailto-links + mailbox-lijst uit siteConfig.
 * Gmail API send: alleen wanneer OAuth env-vars gezet zijn.
 */

import { siteConfig } from "@/lib/siteConfig";

export type SharedMailbox = {
  id: string;
  email: string;
  purpose: string;
};

export type GmailConfigStatus = {
  configured: boolean;
  missing: string[];
  sender?: string;
  mailboxes: SharedMailbox[];
  /** Client ID + secret aanwezig → OAuth-flow kan starten. */
  canConnect: boolean;
};

export type GmailSendInput = {
  to: string;
  subject: string;
  body: string;
  from?: string;
};

export type GmailSendResult =
  | {
      ok: true;
      configured: true;
      messageId?: string;
      message: string;
    }
  | {
      ok: false;
      configured: boolean;
      error: string;
      missing?: string[];
    };

/** CSRF state cookie voor OAuth connect → callback. */
export const GMAIL_OAUTH_STATE_COOKIE = "gmail_oauth_state";
/** Eenmalige refresh token (httpOnly) na callback — alleen voor interne flash-UI. */
export const GMAIL_OAUTH_PENDING_RT_COOKIE = "gmail_oauth_pending_rt";

export const GMAIL_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
] as const;

const DEFAULT_SITE_URL = "https://www.helpinghandsagency.nl";

function trimEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function getGoogleClientId(): string | undefined {
  return trimEnv("GOOGLE_CLIENT_ID");
}

export function getGoogleClientSecret(): string | undefined {
  return trimEnv("GOOGLE_CLIENT_SECRET");
}

/**
 * Refresh token: bij voorkeur `GOOGLE_REFRESH_TOKEN` (Vercel/env).
 * Optioneel fallback: `company_settings` key `gmail_oauth` (zie resolveGoogleRefreshToken).
 */
export function getGoogleRefreshToken(): string | undefined {
  return trimEnv("GOOGLE_REFRESH_TOKEN");
}

export type GmailOAuthStoredValue = {
  refresh_token?: string;
  updated_at?: string;
};

/** Env eerst, daarna company_settings.gmail_oauth.refresh_token. */
export async function resolveGoogleRefreshToken(): Promise<string | undefined> {
  const fromEnv = getGoogleRefreshToken();
  if (fromEnv) return fromEnv;

  try {
    const { isSupabaseConfigured } = await import("@/lib/supabase/env");
    if (!isSupabaseConfigured()) return undefined;
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("company_settings")
      .select("value")
      .eq("key", "gmail_oauth")
      .maybeSingle();

    if (error || !data?.value) return undefined;
    const value = data.value as GmailOAuthStoredValue;
    const token = value.refresh_token?.trim();
    return token || undefined;
  } catch {
    return undefined;
  }
}

/** Sla refresh token op in company_settings (server-only). Geen logging. */
export async function saveGmailOAuthRefreshToken(
  refreshToken: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = refreshToken.trim();
  if (!token) return { ok: false, error: "Lege refresh token." };

  try {
    const { isSupabaseConfigured } = await import("@/lib/supabase/env");
    if (!isSupabaseConfigured()) {
      return { ok: false, error: "Supabase niet geconfigureerd." };
    }
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const value: GmailOAuthStoredValue = {
      refresh_token: token,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("company_settings").upsert(
      { key: "gmail_oauth", value },
      { onConflict: "key" },
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch {
    return { ok: false, error: "Opslaan in company_settings mislukt." };
  }
}

export function getGmailSender(): string | undefined {
  return trimEnv("GMAIL_SENDER") ?? siteConfig.planningEmail;
}

/** Redirect URI die exact in Google Cloud Console moet staan. */
export function getGmailRedirectUri(): string {
  const explicit = trimEnv("GMAIL_REDIRECT_URI");
  if (explicit) return explicit;

  const site = (trimEnv("NEXT_PUBLIC_SITE_URL") ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
  return `${site}/api/gmail/callback`;
}

export function canStartGmailOAuth(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

export function getGmailMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!getGoogleClientId()) missing.push("GOOGLE_CLIENT_ID");
  if (!getGoogleClientSecret()) missing.push("GOOGLE_CLIENT_SECRET");
  if (!getGoogleRefreshToken()) missing.push("GOOGLE_REFRESH_TOKEN");
  return missing;
}

/** Ontbrekende config, rekening houdend met company_settings fallback. */
export async function getGmailMissingConfigAsync(): Promise<string[]> {
  const missing: string[] = [];
  if (!getGoogleClientId()) missing.push("GOOGLE_CLIENT_ID");
  if (!getGoogleClientSecret()) missing.push("GOOGLE_CLIENT_SECRET");
  if (!(await resolveGoogleRefreshToken())) {
    missing.push("GOOGLE_REFRESH_TOKEN");
  }
  return missing;
}

export function isGmailConfigured(): boolean {
  return (
    Boolean(getGoogleClientId()) &&
    Boolean(getGoogleClientSecret()) &&
    Boolean(getGoogleRefreshToken()) &&
    Boolean(getGmailSender())
  );
}

export async function isGmailConfiguredAsync(): Promise<boolean> {
  return (
    Boolean(getGoogleClientId()) &&
    Boolean(getGoogleClientSecret()) &&
    Boolean(await resolveGoogleRefreshToken()) &&
    Boolean(getGmailSender())
  );
}

export function buildGmailConsentUrl(state: string): string | null {
  const clientId = getGoogleClientId();
  if (!clientId) return null;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGmailRedirectUri(),
    response_type: "code",
    scope: GMAIL_OAUTH_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export type GmailTokenExchangeResult =
  | {
      ok: true;
      accessToken: string;
      refreshToken?: string;
      expiresIn?: number;
    }
  | { ok: false; error: string };

/** Wissel auth-code om voor tokens. Logt nooit tokens. */
export async function exchangeGmailAuthCode(
  code: string,
): Promise<GmailTokenExchangeResult> {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();

  if (!clientId || !clientSecret) {
    return { ok: false, error: "GOOGLE_CLIENT_ID of GOOGLE_CLIENT_SECRET ontbreekt." };
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getGmailRedirectUri(),
        grant_type: "authorization_code",
      }),
    });

    const data = (await res.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      error?: string;
      error_description?: string;
    };

    if (!res.ok || !data.access_token) {
      return {
        ok: false,
        error:
          data.error_description ??
          data.error ??
          `Token-uitwisseling mislukt (${res.status}).`,
      };
    }

    return {
      ok: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  } catch {
    return { ok: false, error: "Token-uitwisseling netwerkfout." };
  }
}

export function getSharedMailboxes(): SharedMailbox[] {
  return [
    {
      id: "planning",
      email: siteConfig.planningEmail,
      purpose: "Personeels- / crewaanvragen van opdrachtgevers",
    },
    {
      id: "planner",
      email: siteConfig.plannerEmail,
      purpose: "Planning & inzet (planner)",
    },
    {
      id: "applications",
      email: siteConfig.applicationsEmail,
      purpose: "Crewaanmeldingen & sollicitaties",
    },
    {
      id: "info",
      email: siteConfig.email,
      purpose: "Algemene vragen",
    },
    {
      id: "owner",
      email: siteConfig.ownerEmail,
      purpose: "Direct contact / operationeel",
    },
  ];
}

export function getGmailConfigStatus(): GmailConfigStatus {
  const missing = getGmailMissingEnvVars();
  return {
    configured: isGmailConfigured(),
    missing,
    sender: getGmailSender(),
    mailboxes: getSharedMailboxes(),
    canConnect: canStartGmailOAuth(),
  };
}

export async function getGmailConfigStatusAsync(): Promise<GmailConfigStatus> {
  const missing = await getGmailMissingConfigAsync();
  return {
    configured: await isGmailConfiguredAsync(),
    missing,
    sender: getGmailSender(),
    mailboxes: getSharedMailboxes(),
    canConnect: canStartGmailOAuth(),
  };
}

export function buildMailtoUrl(input: {
  to: string;
  subject?: string;
  body?: string;
}): string {
  const params = new URLSearchParams();
  if (input.subject?.trim()) params.set("subject", input.subject.trim());
  if (input.body?.trim()) params.set("body", input.body.trim());
  const qs = params.toString();
  return `mailto:${input.to}${qs ? `?${qs}` : ""}`;
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function buildRawEmail(input: {
  from: string;
  to: string;
  subject: string;
  body: string;
}): string {
  const lines = [
    `From: ${input.from}`,
    `To: ${input.to}`,
    `Subject: ${input.subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    input.body,
  ];
  return toBase64Url(lines.join("\r\n"));
}

export async function refreshGoogleAccessToken(): Promise<
  { ok: true; accessToken: string } | { ok: false; error: string }
> {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const refreshToken = await resolveGoogleRefreshToken();

  if (!clientId || !clientSecret || !refreshToken) {
    return { ok: false, error: "Gmail OAuth env-vars ontbreken." };
  }

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!res.ok || !data.access_token) {
      return {
        ok: false,
        error:
          data.error_description ??
          data.error ??
          `OAuth token refresh mislukt (${res.status}).`,
      };
    }

    return { ok: true, accessToken: data.access_token };
  } catch {
    return { ok: false, error: "OAuth token refresh netwerkfout." };
  }
}

/**
 * Live check: refresh token → Gmail profile. Geen secrets in return.
 */
export async function probeGmailConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  message: string;
  missing?: string[];
}> {
  const missing = await getGmailMissingConfigAsync();
  if (missing.length > 0) {
    return {
      ok: false,
      configured: false,
      message: `Gmail OAuth incompleet. Ontbreekt: ${missing.join(", ")}.`,
      missing,
    };
  }

  const tokenResult = await refreshGoogleAccessToken();
  if (!tokenResult.ok) {
    return {
      ok: false,
      configured: true,
      message: tokenResult.error,
    };
  }

  try {
    const res = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: { Authorization: `Bearer ${tokenResult.accessToken}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        message: `Gmail API bereikbaar maar profile-check faalde (${res.status}). Controleer scopes en refresh token.`,
      };
    }

    const data = (await res.json()) as { emailAddress?: string };
    const email = data.emailAddress?.trim();
    return {
      ok: true,
      configured: true,
      message: email
        ? `Gmail API werkt (account: ${email}).`
        : "Gmail API werkt (token + profile OK).",
    };
  } catch {
    return {
      ok: false,
      configured: true,
      message: "Gmail API-netwerkfout tijdens healthcheck.",
    };
  }
}

export async function sendGmailMessage(
  input: GmailSendInput,
): Promise<GmailSendResult> {
  const missing = await getGmailMissingConfigAsync();
  if (missing.length > 0 || !(await isGmailConfiguredAsync())) {
    return {
      ok: false,
      configured: false,
      error:
        "Gmail API is niet geconfigureerd. Gebruik mailto of zet de Google OAuth env-vars in Vercel.",
      missing,
    };
  }

  const to = input.to.trim();
  const subject = input.subject.trim();
  const body = input.body.trim();
  const from = (input.from ?? getGmailSender())!.trim();

  if (!to || !subject || !body) {
    return {
      ok: false,
      configured: true,
      error: "Ontvanger, onderwerp en berichttekst zijn verplicht.",
    };
  }

  const tokenResult = await refreshGoogleAccessToken();
  if (!tokenResult.ok) {
    return {
      ok: false,
      configured: true,
      error: tokenResult.error,
    };
  }

  try {
    const raw = buildRawEmail({ from, to, subject, body });
    const res = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      },
    );

    const data = (await res.json()) as {
      id?: string;
      error?: { message?: string };
    };

    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        error:
          data.error?.message ??
          `Gmail API fout (${res.status}). Controleer scopes (gmail.send) en refresh token.`,
      };
    }

    return {
      ok: true,
      configured: true,
      messageId: data.id,
      message: "E-mail verzonden via Gmail API.",
    };
  } catch {
    return {
      ok: false,
      configured: true,
      error: "Gmail API-aanroep mislukt (netwerk of server).",
    };
  }
}
