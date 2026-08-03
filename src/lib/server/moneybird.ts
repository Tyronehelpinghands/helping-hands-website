// Server-only Moneybird helper. Niet importeren in client components.

const DEFAULT_BASE_URL = "https://moneybird.com/api/v2";
const DEFAULTS_CACHE_TTL_MS = 15 * 60 * 1000;

export type MoneybirdConfig = {
  accessToken: string;
  administrationId: string;
  baseUrl: string;
  defaultTaxRateId?: string;
  defaultLedgerAccountId?: string;
};

export type MoneybirdInvoiceDefaults = {
  taxRateId: string;
  ledgerAccountId: string;
  /** env = expliciete overrides; auto = opgehaald uit Moneybird API */
  source: "env" | "auto";
};

type MoneybirdTaxRate = {
  id?: string | number;
  name?: string | null;
  percentage?: string | number | null;
  tax_rate_type?: string | null;
  active?: boolean | null;
};

type MoneybirdLedgerAccount = {
  id?: string | number;
  name?: string | null;
  account_type?: string | null;
  active?: boolean | null;
  allowed_document_types?: string[] | null;
};

type CachedInvoiceDefaults = MoneybirdInvoiceDefaults & {
  administrationId: string;
  fetchedAt: number;
};

let invoiceDefaultsCache: CachedInvoiceDefaults | null = null;

export type SafeMoneybirdContact = {
  id: string;
  company_name: string;
  firstname: string;
  lastname: string;
  email: string;
  city: string;
  customer_id: string;
};

export type SafeMoneybirdInvoice = {
  id: string;
  invoice_id: string;
  contact: string;
  reference: string;
  invoice_date: string;
  due_date: string;
  state: string;
  total_price_excl_tax: string;
  total_price_incl_tax: string;
  sent_at: string | null;
  paid_at: string | null;
};

export type MoneybirdInvoiceLineInput = {
  description: string;
  amount: number;
  price: number;
  taxRateId?: string;
  ledgerAccountId?: string;
};

export type CreateMoneybirdSalesInvoiceInput = {
  contactId: string;
  reference?: string;
  invoiceDate?: string;
  dueDate?: string;
  currency?: string;
  lines: MoneybirdInvoiceLineInput[];
};

function envTrim(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Token: MONEYBIRD_ACCESS_TOKEN (primair) of alias MONEYBIRD_API_TOKEN. */
export function getMoneybirdAccessToken(): string | undefined {
  return envTrim("MONEYBIRD_ACCESS_TOKEN") || envTrim("MONEYBIRD_API_TOKEN");
}

export function getMissingMoneybirdEnvVars(): string[] {
  const missing: string[] = [];
  if (!getMoneybirdAccessToken()) {
    missing.push("MONEYBIRD_ACCESS_TOKEN (of MONEYBIRD_API_TOKEN)");
  }
  if (!envTrim("MONEYBIRD_ADMINISTRATION_ID")) {
    missing.push("MONEYBIRD_ADMINISTRATION_ID");
  }
  return missing;
}

/**
 * Verplichte env voor facturen = zelfde als API (token + administration).
 * TAX/LEDGER zijn optionele overrides; anders auto-resolve via API.
 */
export function getMissingMoneybirdInvoiceEnvVars(): string[] {
  return getMissingMoneybirdEnvVars();
}

export function getMoneybirdConfig(): MoneybirdConfig | null {
  const accessToken = getMoneybirdAccessToken();
  const administrationId = envTrim("MONEYBIRD_ADMINISTRATION_ID");
  if (!accessToken || !administrationId) return null;

  const baseUrl = (
    envTrim("MONEYBIRD_BASE_URL") || DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  return {
    accessToken,
    administrationId,
    baseUrl,
    defaultTaxRateId: envTrim("MONEYBIRD_DEFAULT_TAX_RATE_ID"),
    defaultLedgerAccountId: envTrim("MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID"),
  };
}

export function isMoneybirdConfigured(): boolean {
  return getMoneybirdConfig() !== null;
}

/**
 * Sync hint: env overrides aanwezig, of recente auto-cache in dit proces.
 * Voor UI/health: gebruik `ensureMoneybirdInvoiceReady()`.
 */
export function isMoneybirdInvoiceReady(): boolean {
  if (!isMoneybirdConfigured()) return false;
  const config = getMoneybirdConfig();
  if (config?.defaultTaxRateId && config.defaultLedgerAccountId) return true;
  if (
    invoiceDefaultsCache &&
    invoiceDefaultsCache.administrationId === config?.administrationId &&
    Date.now() - invoiceDefaultsCache.fetchedAt < DEFAULTS_CACHE_TTL_MS
  ) {
    return true;
  }
  return false;
}

/** Probeert tax/ledger te resolven (env of API) en retourneert of facturen klaar zijn. */
export async function ensureMoneybirdInvoiceReady(): Promise<boolean> {
  try {
    const defaults = await resolveMoneybirdInvoiceDefaults();
    return defaults !== null;
  } catch {
    return false;
  }
}

export const MONEYBIRD_DEFAULTS_RESOLVE_ERROR =
  "Token werkt, maar er is geen standaard BTW-tarief of omzetrekening gevonden in Moneybird. " +
  "Zet optioneel MONEYBIRD_DEFAULT_TAX_RATE_ID en MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID in Vercel, " +
  "of controleer actieve sales BTW-tarieven en omzetrekeningen. Zie docs/moneybird-integration.md.";

export function assertMoneybirdConfigured(): MoneybirdConfig {
  const config = getMoneybirdConfig();
  if (!config) {
    throw new Error(
      "Moneybird configuratie ontbreekt. Controleer Vercel Environment Variables.",
    );
  }
  return config;
}

export function formatMoneybirdError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Moneybird API-fout";
}

export async function moneybirdFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = assertMoneybirdConfigured();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${config.baseUrl}/${config.administrationId}${normalizedPath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Moneybird API-fout (${res.status})`;
    try {
      const body = (await res.json()) as {
        error?: string;
        errors?: string[] | Record<string, string[]>;
      };
      if (body.error) message = body.error;
      else if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors.join(", ");
      } else if (body.errors && typeof body.errors === "object") {
        message = Object.entries(body.errors)
          .map(([key, vals]) => `${key}: ${vals.join(", ")}`)
          .join("; ");
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

function parsePercentage(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return Number.NaN;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : Number.NaN;
}

function pickDefaultTaxRateId(rates: MoneybirdTaxRate[]): string | undefined {
  const sales = rates.filter(
    (r) =>
      r.id &&
      r.active !== false &&
      (r.tax_rate_type === "sales_invoice" || !r.tax_rate_type),
  );
  if (sales.length === 0) return undefined;

  const scored = sales.map((r) => {
    const pct = parsePercentage(r.percentage);
    const name = String(r.name ?? "").toLowerCase();
    let score = 0;
    if (Math.abs(pct - 21) < 0.05) score += 100;
    else if (pct === 21) score += 100;
    if (name.includes("21")) score += 40;
    if (name.includes("btw") || name.includes("btw hoog") || name.includes("hoog"))
      score += 10;
    if (r.tax_rate_type === "sales_invoice") score += 20;
    if (r.active === true) score += 5;
    return { id: String(r.id), score, pct };
  });

  scored.sort((a, b) => b.score - a.score || Math.abs(a.pct - 21) - Math.abs(b.pct - 21));
  return scored[0]?.id;
}

function pickDefaultLedgerAccountId(
  accounts: MoneybirdLedgerAccount[],
): string | undefined {
  const candidates = accounts.filter((a) => a.id && a.active !== false);
  if (candidates.length === 0) return undefined;

  const scored = candidates.map((a) => {
    const name = String(a.name ?? "").toLowerCase();
    const type = String(a.account_type ?? "").toLowerCase();
    const allowed = Array.isArray(a.allowed_document_types)
      ? a.allowed_document_types
      : [];
    let score = 0;
    if (type === "revenue") score += 100;
    if (allowed.includes("sales_invoice")) score += 40;
    if (
      name.includes("omzet") ||
      name.includes("revenue") ||
      name.includes("verkoop") ||
      name.includes("sales")
    ) {
      score += 30;
    }
    if (name.includes("dienst") || name.includes("service")) score += 10;
    if (a.active === true) score += 5;
    // Vermijd typische niet-omzet rekeningen
    if (
      type === "expenses" ||
      type === "direct_costs" ||
      type === "current_assets" ||
      type === "current_liabilities"
    ) {
      score -= 80;
    }
    return { id: String(a.id), score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 40) return undefined;
  return best.id;
}

/**
 * Bepaalt tax_rate_id + ledger_account_id:
 * 1) optionele env-overrides
 * 2) anders Moneybird API (in-memory cache, TTL 15 min)
 */
export async function resolveMoneybirdInvoiceDefaults(): Promise<MoneybirdInvoiceDefaults | null> {
  const config = getMoneybirdConfig();
  if (!config) return null;

  const envTax = config.defaultTaxRateId;
  const envLedger = config.defaultLedgerAccountId;
  if (envTax && envLedger) {
    const resolved: MoneybirdInvoiceDefaults = {
      taxRateId: envTax,
      ledgerAccountId: envLedger,
      source: "env",
    };
    invoiceDefaultsCache = {
      ...resolved,
      administrationId: config.administrationId,
      fetchedAt: Date.now(),
    };
    return resolved;
  }

  if (
    invoiceDefaultsCache &&
    invoiceDefaultsCache.administrationId === config.administrationId &&
    Date.now() - invoiceDefaultsCache.fetchedAt < DEFAULTS_CACHE_TTL_MS &&
    (!envTax || invoiceDefaultsCache.taxRateId === envTax) &&
    (!envLedger || invoiceDefaultsCache.ledgerAccountId === envLedger)
  ) {
    return {
      taxRateId: envTax || invoiceDefaultsCache.taxRateId,
      ledgerAccountId: envLedger || invoiceDefaultsCache.ledgerAccountId,
      source: envTax && envLedger ? "env" : invoiceDefaultsCache.source,
    };
  }

  let taxRateId = envTax;
  let ledgerAccountId = envLedger;

  if (!taxRateId) {
    let rates: MoneybirdTaxRate[] = [];
    try {
      rates = await moneybirdFetch<MoneybirdTaxRate[]>(
        "/tax_rates.json?filter=tax_rate_type:sales_invoice",
      );
    } catch {
      rates = await moneybirdFetch<MoneybirdTaxRate[]>("/tax_rates.json");
    }
    taxRateId = pickDefaultTaxRateId(Array.isArray(rates) ? rates : []);
  }

  if (!ledgerAccountId) {
    const accounts = await moneybirdFetch<MoneybirdLedgerAccount[]>(
      "/ledger_accounts.json",
    );
    ledgerAccountId = pickDefaultLedgerAccountId(
      Array.isArray(accounts) ? accounts : [],
    );
  }

  if (!taxRateId || !ledgerAccountId) return null;

  const resolved: MoneybirdInvoiceDefaults = {
    taxRateId,
    ledgerAccountId,
    source: envTax && envLedger ? "env" : "auto",
  };
  invoiceDefaultsCache = {
    ...resolved,
    administrationId: config.administrationId,
    fetchedAt: Date.now(),
  };
  return resolved;
}

export function sanitizeMoneybirdContact(
  raw: Record<string, unknown>,
): SafeMoneybirdContact {
  return {
    id: String(raw.id ?? ""),
    company_name: String(raw.company_name ?? ""),
    firstname: String(raw.firstname ?? ""),
    lastname: String(raw.lastname ?? ""),
    email: String(raw.email ?? ""),
    city: String(raw.city ?? ""),
    customer_id: String(raw.customer_id ?? ""),
  };
}

export function sanitizeMoneybirdInvoice(
  raw: Record<string, unknown>,
): SafeMoneybirdInvoice {
  const contact = raw.contact as Record<string, unknown> | undefined;
  const contactName =
    contact?.company_name ??
    [contact?.firstname, contact?.lastname].filter(Boolean).join(" ") ??
    "";

  return {
    id: String(raw.id ?? ""),
    invoice_id: String(raw.invoice_id ?? ""),
    contact: String(contactName),
    reference: String(raw.reference ?? ""),
    invoice_date: String(raw.invoice_date ?? ""),
    due_date: String(raw.due_date ?? ""),
    state: String(raw.state ?? ""),
    total_price_excl_tax: String(raw.total_price_excl_tax ?? "0"),
    total_price_incl_tax: String(raw.total_price_incl_tax ?? "0"),
    sent_at: raw.sent_at ? String(raw.sent_at) : null,
    paid_at: raw.paid_at ? String(raw.paid_at) : null,
  };
}

/** Maakt een conceptfactuur (draft) in Moneybird. Verzendt niet. */
export async function createMoneybirdSalesInvoice(
  input: CreateMoneybirdSalesInvoiceInput,
): Promise<SafeMoneybirdInvoice> {
  assertMoneybirdConfigured();
  const defaults = await resolveMoneybirdInvoiceDefaults();
  if (!defaults) {
    throw new Error(MONEYBIRD_DEFAULTS_RESOLVE_ERROR);
  }

  if (!input.contactId.trim()) {
    throw new Error("contactId is verplicht.");
  }
  if (!input.lines.length) {
    throw new Error("Minimaal één factuurregel is verplicht.");
  }

  const payload = {
    sales_invoice: {
      contact_id: input.contactId.trim(),
      reference: input.reference?.trim() || "Helping Hands factuur",
      invoice_date:
        input.invoiceDate || new Date().toISOString().slice(0, 10),
      due_date:
        input.dueDate ||
        new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      currency: input.currency || "EUR",
      details_attributes: input.lines.map((line) => ({
        description: line.description.trim(),
        price: Number(line.price).toFixed(2),
        amount: String(line.amount),
        tax_rate_id: line.taxRateId || defaults.taxRateId,
        ledger_account_id: line.ledgerAccountId || defaults.ledgerAccountId,
      })),
    },
  };

  const raw = await moneybirdFetch<Record<string, unknown>>(
    "/sales_invoices.json",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return sanitizeMoneybirdInvoice(raw);
}

/**
 * Verstuurt een bestaande Moneybird-factuur (draft → open).
 * Zonder body gebruikt Moneybird de defaults van het contact/workflow.
 */
export async function sendMoneybirdSalesInvoice(
  moneybirdInvoiceId: string,
  options?: {
    deliveryMethod?: "Email" | "Manual" | "Peppol" | "Simplerinvoicing" | "Post";
    emailAddress?: string;
    emailMessage?: string;
  },
): Promise<SafeMoneybirdInvoice> {
  if (!moneybirdInvoiceId.trim()) {
    throw new Error("moneybirdInvoiceId is verplicht.");
  }

  const sending: Record<string, string | boolean> = {};
  if (options?.deliveryMethod) sending.delivery_method = options.deliveryMethod;
  if (options?.emailAddress) sending.email_address = options.emailAddress;
  if (options?.emailMessage) sending.email_message = options.emailMessage;

  const raw = await moneybirdFetch<Record<string, unknown>>(
    `/sales_invoices/${encodeURIComponent(moneybirdInvoiceId.trim())}/send_invoice.json`,
    {
      method: "PATCH",
      body: JSON.stringify(
        Object.keys(sending).length > 0
          ? { sales_invoice_sending: sending }
          : { sales_invoice_sending: {} },
      ),
    },
  );

  return sanitizeMoneybirdInvoice(raw);
}
