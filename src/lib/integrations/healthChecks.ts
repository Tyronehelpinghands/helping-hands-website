/**
 * Server-only health checks per API-integratie.
 * Nooit tokens/secrets in responses.
 */

import { getDashboardStats } from "@/lib/dashboard/queries";
import { probeGmailConnection } from "@/lib/integrations/gmail";
import { probeOpenClawConnection } from "@/lib/integrations/openclaw";
import { probeWhatsAppConnection } from "@/lib/integrations/whatsapp";
import {
  formatMoneybirdError,
  isMoneybirdConfigured,
  moneybirdFetch,
  resolveMoneybirdInvoiceDefaults,
} from "@/lib/server/moneybird";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  isShiftbaseExplicitlyDisabled,
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
  "openclaw",
] as const;

export type IntegrationProvider = (typeof INTEGRATION_PROVIDERS)[number];

export type IntegrationHealthResult = {
  provider: IntegrationProvider;
  ok: boolean;
  /** Actief | Voorbereid | Ontbreekt | Fout | Optioneel — beschikbaar | Optioneel — uitgeschakeld */
  status:
    | "Actief"
    | "Voorbereid"
    | "Ontbreekt"
    | "Fout"
    | "Optioneel — beschikbaar"
    | "Optioneel — uitgeschakeld";
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
  // Dual mode: Supabase is primary; Shiftbase sync is optional but available when key is set.
  if (isShiftbaseExplicitlyDisabled()) {
    return {
      ok: true,
      status: "Optioneel — uitgeschakeld",
      message:
        "Shiftbase sync staat uit (SHIFTBASE_ENABLED=false). Helping Hands plant in Supabase.",
    };
  }

  if (!isShiftbaseConfigured()) {
    return {
      ok: true,
      status: "Optioneel — beschikbaar",
      message:
        "Helping Hands plant in Supabase; sync naar Shiftbase kan aan — zet SHIFTBASE_API_KEY (of TOKEN) in Vercel.",
    };
  }

  try {
    const result = await testShiftbaseConnection();
    if (result.ok) {
      return {
        ok: true,
        status: "Actief",
        message:
          result.message ??
          "Shiftbase API bereikbaar. Helping Hands plant in Supabase; sync naar Shiftbase kan aan.",
      };
    }
    return {
      ok: true,
      status: "Optioneel — beschikbaar",
      message:
        result.message ??
        "API key aanwezig maar test mislukt — Supabase-planning blijft werken.",
    };
  } catch (error) {
    return {
      ok: true,
      status: "Optioneel — beschikbaar",
      message: `${formatShiftbaseError(error)} — Supabase-planning blijft werken.`,
    };
  }
}

async function checkMoneybird(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  if (!isMoneybirdConfigured()) {
    return {
      ok: false,
      status: "Ontbreekt",
      message:
        "MONEYBIRD_ACCESS_TOKEN (of MONEYBIRD_API_TOKEN) / MONEYBIRD_ADMINISTRATION_ID ontbreekt. Zie docs/moneybird-integration.md.",
    };
  }

  try {
    await moneybirdFetch<unknown>("/contacts.json?per_page=1");
  } catch (error) {
    return {
      ok: false,
      status: "Fout",
      message: formatMoneybirdError(error),
    };
  }

  try {
    const defaults = await resolveMoneybirdInvoiceDefaults();
    if (defaults) {
      return {
        ok: true,
        status: "Actief",
        message:
          defaults.source === "env"
            ? "Klaar voor facturen (tax/ledger via env)."
            : "Klaar voor facturen (tax/ledger automatisch uit Moneybird).",
      };
    }
    return {
      ok: true,
      status: "Voorbereid",
      message:
        "Token OK (contacts). Nog geen BTW-tarief/omzetrekening gevonden — zet optioneel MONEYBIRD_DEFAULT_TAX_RATE_ID / MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID. Zie docs/moneybird-integration.md.",
    };
  } catch (error) {
    return {
      ok: true,
      status: "Voorbereid",
      message: `Token OK (contacts). Tax/ledger niet opgehaald: ${formatMoneybirdError(error)}. Zie docs/moneybird-integration.md.`,
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

async function checkOpenClaw(): Promise<Omit<IntegrationHealthResult, "provider" | "checkedAt">> {
  const result = await probeOpenClawConnection();
  return {
    ok: result.ok,
    status: result.status,
    message: result.message,
  };
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
    case "openclaw":
      partial = await checkOpenClaw();
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
