/**
 * WhatsApp helpers — server-only.
 * Niet importeren in client components (tokens blijven op de server).
 *
 * Direct bruikbaar: wa.me deep links via siteConfig / buildWaMeUrl.
 * Cloud API: alleen wanneer WHATSAPP_ACCESS_TOKEN + WHATSAPP_PHONE_NUMBER_ID gezet zijn.
 */

import { siteConfig } from "@/lib/siteConfig";

const GRAPH_API_VERSION = "v21.0";

export type WhatsAppConfigStatus = {
  configured: boolean;
  missing: string[];
  planningWaMeUrl: string;
  phoneDisplay: string;
};

export type WhatsAppSendInput = {
  to: string;
  body: string;
};

export type WhatsAppSendResult =
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

export const WHATSAPP_MESSAGE_TEMPLATES = [
  {
    id: "crew-briefing",
    label: "Crew briefing",
    body: "Hoi! Hier is je briefing voor het aankomende project via Helping Hands. Locatie, starttijd en dresscode volgen in dit bericht. Bevestig even of je erbij bent.",
  },
  {
    id: "availability",
    label: "Beschikbaarheid vragen",
    body: "Hoi! Kun jij deze week nog beschikbaar? Laat even weten welke dagen/tijden passen, dan plannen we je in.",
  },
  {
    id: "client-update",
    label: "Klant planning-update",
    body: "Hoi! Korte update over de planning: crew is (deels) bevestigd. Laat het weten als er nog wijzigingen zijn aan tijden of aantallen.",
  },
  {
    id: "urgent-replacement",
    label: "Spoedvervanging",
    body: "SPOED: we zoeken op korte termijn een vervanger. Kun jij bijspringen? Reageer zo snel mogelijk met ja/nee en eventuele beschikbaarheid.",
  },
] as const;

function trimEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function getWhatsAppAccessToken(): string | undefined {
  return trimEnv("WHATSAPP_ACCESS_TOKEN");
}

export function getWhatsAppPhoneNumberId(): string | undefined {
  return trimEnv("WHATSAPP_PHONE_NUMBER_ID");
}

export function getWhatsAppVerifyToken(): string | undefined {
  return trimEnv("WHATSAPP_VERIFY_TOKEN");
}

export function getWhatsAppBusinessAccountId(): string | undefined {
  return trimEnv("WHATSAPP_BUSINESS_ACCOUNT_ID");
}

/** Cloud API is configured when token + phone number id are present. */
export function isWhatsAppCloudApiConfigured(): boolean {
  return Boolean(getWhatsAppAccessToken() && getWhatsAppPhoneNumberId());
}

export function getWhatsAppMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!getWhatsAppAccessToken()) missing.push("WHATSAPP_ACCESS_TOKEN");
  if (!getWhatsAppPhoneNumberId()) missing.push("WHATSAPP_PHONE_NUMBER_ID");
  return missing;
}

/** Normalize NL/E.164-ish input to digits only for wa.me / Cloud API. */
export function normalizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) {
    return `31${digits.slice(1)}`;
  }
  return digits;
}

export function buildWaMeUrl(phone?: string, text?: string): string {
  const target = normalizeWhatsAppPhone(
    phone?.trim() || siteConfig.phoneTel || siteConfig.phone,
  );
  const base = `https://wa.me/${target}`;
  if (!text?.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}

export function getPlanningWaMeUrl(text?: string): string {
  return buildWaMeUrl(siteConfig.phoneTel, text);
}

export function getWhatsAppConfigStatus(): WhatsAppConfigStatus {
  const missing = getWhatsAppMissingEnvVars();
  return {
    configured: missing.length === 0,
    missing,
    planningWaMeUrl: getPlanningWaMeUrl(),
    phoneDisplay: siteConfig.phoneDisplay,
  };
}

/**
 * Live check tegen Graph API (phone number). Geen tokens in return.
 */
export async function probeWhatsAppConnection(): Promise<{
  ok: boolean;
  configured: boolean;
  message: string;
  missing?: string[];
}> {
  const missing = getWhatsAppMissingEnvVars();
  if (missing.length > 0) {
    return {
      ok: false,
      configured: false,
      message: `WhatsApp Cloud API incompleet. Ontbreekt: ${missing.join(", ")}. wa.me werkt wel.`,
      missing,
    };
  }

  const token = getWhatsAppAccessToken()!;
  const phoneNumberId = getWhatsAppPhoneNumberId()!;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}?fields=display_phone_number,verified_name`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        message: `WhatsApp Graph API fout (${res.status}). Controleer token en phone number id.`,
      };
    }

    const data = (await res.json()) as {
      display_phone_number?: string;
      verified_name?: string;
    };
    const label = [data.verified_name, data.display_phone_number]
      .filter(Boolean)
      .join(" · ");

    return {
      ok: true,
      configured: true,
      message: label
        ? `WhatsApp Cloud API werkt (${label}).`
        : "WhatsApp Cloud API werkt.",
    };
  } catch {
    return {
      ok: false,
      configured: true,
      message: "WhatsApp Graph API-netwerkfout tijdens healthcheck.",
    };
  }
}

export async function sendWhatsAppMessage(
  input: WhatsAppSendInput,
): Promise<WhatsAppSendResult> {
  const missing = getWhatsAppMissingEnvVars();
  if (missing.length > 0) {
    return {
      ok: false,
      configured: false,
      error:
        "WhatsApp Cloud API is niet geconfigureerd. Gebruik wa.me of zet de env-vars in Vercel.",
      missing,
    };
  }

  const token = getWhatsAppAccessToken()!;
  const phoneNumberId = getWhatsAppPhoneNumberId()!;
  const to = normalizeWhatsAppPhone(input.to);
  const body = input.body.trim();

  if (!to || !body) {
    return {
      ok: false,
      configured: true,
      error: "Ontvanger en berichttekst zijn verplicht.",
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { preview_url: false, body },
        }),
      },
    );

    const data = (await res.json()) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        error:
          data.error?.message ??
          `WhatsApp API fout (${res.status}). Controleer token en phone number id.`,
      };
    }

    return {
      ok: true,
      configured: true,
      messageId: data.messages?.[0]?.id,
      message: "Bericht verzonden via WhatsApp Cloud API.",
    };
  } catch {
    return {
      ok: false,
      configured: true,
      error: "WhatsApp API-aanroep mislukt (netwerk of server).",
    };
  }
}

/** Verify Meta webhook subscription challenge. */
export function verifyWhatsAppWebhookChallenge(params: {
  mode?: string | null;
  token?: string | null;
  challenge?: string | null;
}): { ok: true; challenge: string } | { ok: false; error: string } {
  const verifyToken = getWhatsAppVerifyToken();
  if (!verifyToken) {
    return {
      ok: false,
      error: "WHATSAPP_VERIFY_TOKEN is niet geconfigureerd.",
    };
  }

  if (params.mode !== "subscribe" || !params.token || !params.challenge) {
    return { ok: false, error: "Ongeldige webhook-verificatieparameters." };
  }

  if (params.token !== verifyToken) {
    return { ok: false, error: "Verify token komt niet overeen." };
  }

  return { ok: true, challenge: params.challenge };
}
