/**
 * Server-only health checks per API-integratie.
 * Nooit tokens/secrets in responses.
 */

import { getDashboardStats } from "@/lib/dashboard/queries";
import { probeGmailConnection } from "@/lib/integrations/gmail";
import { probeWhatsAppConnection } from "@/lib/integrations/whatsapp";
import {
  formatMoneybirdError,
  isMoneybirdConfigured,
  moneybirdFetch,
} from "@/lib/server/moneybird";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  testShiftbaseConnection,
} from "@/lib/shiftbase";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const INTEGRATION_PROVIDERS = [
  "supabase_auth",
  "supabase_db",
  "resend",
  "contact",
  "shiftbase",
  "moneybird",
  "whatsapp",
  "gmail",
] as const;

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type IntegrationHealthResult = {
  provider: IntegrationProvider;
  ok: boolean;
  /** Actief | Voorbereid | Ontbreekt | Fout */
  status: "Actief" | "Voorbereid" | "Ontbreekt" | "Fout";
  message: string;
  checkedAt: string;
};

export function isIntegrationProvider(
  value: string,
): value is IntegrationProvider {
  return (INTEGRATION_PROVIDERS as readonly string[]).includes(value);
}

async function checkSupabaseAuth(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: "Ontbreekt",
      message: "NEXT_PUBLIC_SUPABASE_URL of ANON_KEY ontbreekt.",
    };
  }
  return {
    ok: true,
    status: "Actief",
    message: "Supabase URL + anon key aanwezig (Auth via SSR).",
  };
}

async function checkSupabaseDb(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      status: "Ontbreekt",
      message: "Supabase env ontbreekt — database niet bereikbaar.",
    };
  }
  try {
    const stats = await getDashboardStats();
    if (stats.tablesReady) {
      return {
        ok: true,
        status: "Actief",
        message: "MVP-tabellen bereikbaar.",
      };
    }
    return {
      ok: false,
      status: "Voorbereid",
      message:
        "Auth OK, maar dashboard-tabellen ontbreken. Draai docs/internal-dashboard-database.md.",
    };
  } catch {
    return {
      ok: false,
      status: "Fout",
      message: "Databasequery mislukt (RLS of ontbrekende tabellen).",
    };
  }
}

async function checkResend(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    return {
      ok: false,
      status: "Ontbreekt",
      message: "RESEND_API_KEY ontbreekt in Vercel.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        status: "Fout",
        message: `Resend API-key ongeldig (${res.status}).`,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: "Fout",
        message: `Resend API fout (${res.status}).`,
      };
    }

    return {
      ok: true,
      status: "Actief",
      message: "Resend API bereikbaar (domains OK).",
    };
  } catch {
    return {
      ok: false,
      status: "Fout",
      message: "Resend netwerkfout tijdens healthcheck.",
    };
  }
}

async function checkContact(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  const hasKey = Boolean(process.env.RESEND_API_KEY?.trim());
  return {
    ok: true,
    status: hasKey ? "Actief" : "Voorbereid",
    message: hasKey
      ? "Route /api/contact aanwezig; Resend key gezet."
      : "Route /api/contact aanwezig; Resend key ontbreekt (formulieren falen tot key staat).",
  };
}

async function checkShiftbase(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  if (!isShiftbaseConfigured()) {
    return {
      ok: false,
      status: "Ontbreekt",
      message:
        "SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN ontbreekt in Vercel.",
    };
  }

  try {
    const result = await testShiftbaseConnection();
    if (result.ok) {
      return {
        ok: true,
        status: "Actief",
        message: result.message ?? "Shiftbase API bereikbaar.",
      };
    }
    return {
      ok: false,
      status: "Fout",
      message: result.message ?? "Shiftbase test mislukt.",
    };
  } catch (error) {
    return {
      ok: false,
      status: "Fout",
      message: formatShiftbaseError(error),
    };
  }
}

async function checkMoneybird(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  if (!isMoneybirdConfigured()) {
    return {
      ok: false,
      status: "Ontbreekt",
      message:
        "MONEYBIRD_ACCESS_TOKEN of MONEYBIRD_ADMINISTRATION_ID ontbreekt.",
    };
  }

  try {
    await moneybirdFetch<unknown>("/contacts.json?per_page=1");
    return {
      ok: true,
      status: "Actief",
      message: "Moneybird API bereikbaar (contacts).",
    };
  } catch (error) {
    return {
      ok: false,
      status: "Fout",
      message: formatMoneybirdError(error),
    };
  }
}

async function checkWhatsApp(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  const result = await probeWhatsAppConnection();
  if (result.ok) {
    return { ok: true, status: "Actief", message: result.message };
  }
  if (!result.configured) {
    return { ok: false, status: "Ontbreekt", message: result.message };
  }
  return { ok: false, status: "Fout", message: result.message };
}

async function checkGmail(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  const result = await probeGmailConnection();
  if (result.ok) {
    return { ok: true, status: "Actief", message: result.message };
  }
  if (!result.configured) {
    return { ok: false, status: "Ontbreekt", message: result.message };
  }
  return { ok: false, status: "Fout", message: result.message };
}

export async function runIntegrationHealthCheck(
  provider: IntegrationProvider,
): Promise<IntegrationHealthResult> {
  const checkedAt = new Date().toISOString();
  let partial: Omit<IntegrationHealthResult, "provider" | "checkedAt">;

  switch (provider) {
    case "supabase_auth":
      partial = await checkSupabaseAuth();
      break;
    case "supabase_db":
      partial = await checkSupabaseDb();
      break;
    case "resend":
      partial = await checkResend();
      break;
    case "contact":
      partial = await checkContact();
      break;
    case "shiftbase":
      partial = await checkShiftbase();
      break;
    case "moneybird":
      partial = await checkMoneybird();
      break;
    case "whatsapp":
      partial = await checkWhatsApp();
      break;
    case "gmail":
      partial = await checkGmail();
      break;
    default:
      partial = {
        ok: false,
        status: "Fout",
        message: "Onbekende provider.",
      };
  }

  return { provider, checkedAt, ...partial };
}

export async function runAllIntegrationHealthChecks(): Promise<
  IntegrationHealthResult[]
> {
  const results: IntegrationHealthResult[] = [];
  for (const provider of INTEGRATION_PROVIDERS) {
    results.push(await runIntegrationHealthCheck(provider));
  }
  return results;
}
