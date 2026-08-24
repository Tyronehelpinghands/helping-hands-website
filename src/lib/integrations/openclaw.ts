/**
 * OpenClaw Gateway-client — server-only.
 * Tokens blijven in env; nooit naar de browser sturen.
 */

const DEFAULT_GATEWAY_URL = "http://127.0.0.1:18789";
const PROBE_TIMEOUT_MS = 3500;
const AGENT_TIMEOUT_MS = 20_000;
const MAX_MESSAGE_CHARS = 4000;

export type OpenClawConfigStatus = {
  configured: boolean;
  missing: string[];
  gatewayHost: string;
  contactForward: boolean;
};

export type OpenClawProbeResult =
  | {
      ok: true;
      configured: true;
      reachable: true;
      status: "Actief";
      message: string;
      gatewayHost: string;
    }
  | {
      ok: false;
      configured: boolean;
      reachable: boolean;
      status: "Ontbreekt" | "Fout" | "Voorbereid";
      message: string;
      gatewayHost: string;
      missing?: string[];
    };

export type OpenClawAgentResult =
  | { ok: true; runId: string; message: string }
  | { ok: false; configured: boolean; error: string; status?: number };

function trimEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getOpenClawGatewayUrl(): string {
  return stripTrailingSlash(
    trimEnv("OPENCLAW_GATEWAY_URL") ?? DEFAULT_GATEWAY_URL,
  );
}

export function getOpenClawHooksToken(): string | undefined {
  return trimEnv("OPENCLAW_HOOKS_TOKEN");
}

export function isOpenClawContactForwardEnabled(): boolean {
  const raw = trimEnv("OPENCLAW_CONTACT_FORWARD");
  if (!raw) return true;
  return raw !== "false" && raw !== "0";
}

export function getOpenClawGatewayHost(url = getOpenClawGatewayUrl()): string {
  try {
    return new URL(url).host;
  } catch {
    return "ongeldige-url";
  }
}

export function getOpenClawConfigStatus(): OpenClawConfigStatus {
  const token = getOpenClawHooksToken();
  const missing: string[] = [];
  if (!token) missing.push("OPENCLAW_HOOKS_TOKEN");
  return {
    configured: Boolean(token),
    missing,
    gatewayHost: getOpenClawGatewayHost(),
    contactForward: isOpenClawContactForwardEnabled(),
  };
}

function hooksHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function probeOpenClawConnection(): Promise<OpenClawProbeResult> {
  const status = getOpenClawConfigStatus();
  const gatewayHost = status.gatewayHost;

  if (!status.configured) {
    return {
      ok: false,
      configured: false,
      reachable: false,
      status: "Ontbreekt",
      message:
        "OPENCLAW_HOOKS_TOKEN ontbreekt. Zet die in .env.local (lokaal) of Vercel (productie).",
      gatewayHost,
      missing: status.missing,
    };
  }

  const token = getOpenClawHooksToken();
  if (!token) {
    return {
      ok: false,
      configured: false,
      reachable: false,
      status: "Ontbreekt",
      message: "OPENCLAW_HOOKS_TOKEN ontbreekt.",
      gatewayHost,
      missing: status.missing,
    };
  }

  const url = `${getOpenClawGatewayUrl()}/hooks/wake`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: hooksHeaders(token),
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        configured: true,
        reachable: true,
        status: "Fout",
        message:
          "Gateway bereikbaar, maar de hooks-token wordt geweigerd. Controleer OPENCLAW_HOOKS_TOKEN vs openclaw.json hooks.token.",
        gatewayHost,
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        configured: true,
        reachable: true,
        status: "Voorbereid",
        message:
          "Gateway draait, maar hooks staan uit. Zet hooks.enabled=true in OpenClaw en herstart de Gateway.",
        gatewayHost,
      };
    }

    // GET /hooks/wake is 405 when hooks are live (POST-only).
    if (res.status === 405 || res.ok) {
      return {
        ok: true,
        configured: true,
        reachable: true,
        status: "Actief",
        message: `OpenClaw Gateway + hooks actief op ${gatewayHost}.`,
        gatewayHost,
      };
    }

    return {
      ok: false,
      configured: true,
      reachable: true,
      status: "Fout",
      message: `Onverwacht Gateway-antwoord (${res.status}).`,
      gatewayHost,
    };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? "timeout"
        : "niet bereikbaar";
    return {
      ok: false,
      configured: true,
      reachable: false,
      status: "Fout",
      message: `OpenClaw Gateway op ${gatewayHost} is ${reason}. Start lokaal: node openclaw.mjs gateway run. Productie heeft een bereikbare OPENCLAW_GATEWAY_URL nodig (niet localhost vanaf Vercel).`,
      gatewayHost,
    };
  }
}

export async function sendOpenClawAgentMessage(input: {
  message: string;
  name: string;
}): Promise<OpenClawAgentResult> {
  const token = getOpenClawHooksToken();
  if (!token) {
    return {
      ok: false,
      configured: false,
      error: "OPENCLAW_HOOKS_TOKEN ontbreekt.",
    };
  }

  const message = input.message.trim().slice(0, MAX_MESSAGE_CHARS);
  if (!message) {
    return { ok: false, configured: true, error: "Bericht is leeg." };
  }

  const name = input.name.trim().slice(0, 80) || "Helping Hands";

  try {
    const res = await fetch(`${getOpenClawGatewayUrl()}/hooks/agent`, {
      method: "POST",
      headers: hooksHeaders(token),
      cache: "no-store",
      signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
      body: JSON.stringify({
        message,
        name,
        agentId: trimEnv("OPENCLAW_AGENT_ID") || "main",
      }),
    });

    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; runId?: string; error?: string }
      | null;

    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        status: res.status,
        error:
          data?.error ||
          (res.status === 401
            ? "Hooks-token geweigerd."
            : `Gateway-fout (${res.status}).`),
      };
    }

    if (!data?.runId) {
      return {
        ok: false,
        configured: true,
        error: "Gateway gaf geen runId terug.",
      };
    }

    return {
      ok: true,
      runId: data.runId,
      message: "OpenClaw heeft de opdracht ontvangen.",
    };
  } catch (error) {
    const timeout = error instanceof Error && error.name === "TimeoutError";
    return {
      ok: false,
      configured: true,
      error: timeout
        ? "OpenClaw reageerde niet op tijd."
        : "OpenClaw Gateway is niet bereikbaar.",
    };
  }
}

export async function notifyOpenClawFromWebsite(input: {
  title: string;
  body: string;
}): Promise<OpenClawAgentResult | { ok: false; skipped: true; reason: string }> {
  const status = getOpenClawConfigStatus();
  if (!status.configured) {
    return { ok: false, skipped: true, reason: "niet geconfigureerd" };
  }
  if (!status.contactForward) {
    return { ok: false, skipped: true, reason: "contact-forward uit" };
  }

  return sendOpenClawAgentMessage({
    name: "Website",
    message: [
      "Nieuwe inbound vanaf de Helping Hands-website.",
      `Onderwerp: ${input.title}`,
      "",
      input.body.slice(0, MAX_MESSAGE_CHARS),
      "",
      "Regels: vat samen voor Tyrone. Geen definitieve acties (geen mail, WhatsApp of CRM-mutatie) zonder zijn toestemming.",
    ].join("\n"),
  });
}
