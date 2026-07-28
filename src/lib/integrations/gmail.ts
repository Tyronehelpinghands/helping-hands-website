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

export function getGoogleRefreshToken(): string | undefined {
  return trimEnv("GOOGLE_REFRESH_TOKEN");
}

export function getGmailSender(): string | undefined {
  return trimEnv("GMAIL_SENDER") ?? siteConfig.planningEmail;
}

export function getGmailMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!getGoogleClientId()) missing.push("GOOGLE_CLIENT_ID");
  if (!getGoogleClientSecret()) missing.push("GOOGLE_CLIENT_SECRET");
  if (!getGoogleRefreshToken()) missing.push("GOOGLE_REFRESH_TOKEN");
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

async function refreshGoogleAccessToken(): Promise<
  { ok: true; accessToken: string } | { ok: false; error: string }
> {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const refreshToken = getGoogleRefreshToken();

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

export async function sendGmailMessage(
  input: GmailSendInput,
): Promise<GmailSendResult> {
  const missing = getGmailMissingEnvVars();
  if (missing.length > 0 || !isGmailConfigured()) {
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
