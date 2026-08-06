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
  /** Factuur-e-mail (kan afwijken van `email`). */
  send_invoices_to_email: string;
  city: string;
  /** Moneybird klantnummer (extern); niet hetzelfde als contact `id`. */
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

export type CreateMoneybirdContactInput = {
  companyName?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address1?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  customerId?: string;
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

export class MoneybirdApiError extends Error {
  readonly status: number;
  readonly bodySnippet: string;

  constructor(status: number, detail: string, bodySnippet = "") {
    const hint = dutchMoneybirdStatusHint(status);
    const parts = [
      `Moneybird API-fout (${status})`,
      detail.trim(),
      hint,
    ].filter(Boolean);
    super(parts.join(" — "));
    this.name = "MoneybirdApiError";
    this.status = status;
    this.bodySnippet = bodySnippet;
  }
}

function dutchMoneybirdStatusHint(status: number): string {
  if (status === 401 || status === 403) {
    return "Controleer MONEYBIRD_ACCESS_TOKEN en scopes (sales_invoices + contacts).";
  }
  if (status === 404) {
    return "Niet gevonden. Controleer MONEYBIRD_ADMINISTRATION_ID of of het contact/factuur bestaat.";
  }
  if (status === 422) {
    return "Ongeldige gegevens (customer_id/contact_id, tax_rate_id, ledger_account_id of factuurregels).";
  }
  return "";
}

/** Vertaalt bekende Moneybird-veldfouten naar bruikbare NL-tekst. */
function mapMoneybirdFieldError(field: string, message: string): string {
  const fieldKey = field.trim().toLowerCase();
  const msg = message.trim().toLowerCase();
  const blank =
    msg.includes("blank") ||
    msg.includes("can't be blank") ||
    msg.includes("can't be empty") ||
    msg.includes("is verplicht");

  if (
    (fieldKey === "customer_id" || fieldKey === "contact_id") &&
    blank
  ) {
    return "Klant ontbreekt (customer_id/contact_id). Koppel of maak eerst een Moneybird-contact (of controleer of contact_id in de factuurpayload staat).";
  }
  if (fieldKey === "tax_rate_id" && blank) {
    return "BTW-tarief ontbreekt (tax_rate_id).";
  }
  if (fieldKey === "ledger_account_id" && blank) {
    return "Omzetrekening ontbreekt (ledger_account_id).";
  }
  return `${field}: ${message}`.trim();
}

/** Flatten Moneybird error payloads without throwing (strings, arrays, nested objects). */
function flattenMoneybirdErrorValue(value: unknown, depth = 0): string[] {
  if (value == null || depth > 4) return [];
  if (typeof value === "string") {
    const t = value.trim();
    return t && t !== "true" && t !== "false" ? [t] : [];
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v) => flattenMoneybirdErrorValue(v, depth + 1));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, vals]) => {
        const nested = flattenMoneybirdErrorValue(vals, depth + 1);
        if (nested.length === 0) return [];
        return nested.map((n) => `${key}: ${n}`);
      },
    );
  }
  return [];
}

function parseMoneybirdErrorBody(rawText: string): string {
  const snippet = rawText.replace(/\s+/g, " ").trim().slice(0, 280);
  if (!snippet) return "";

  try {
    const body = JSON.parse(rawText) as Record<string, unknown>;
    const parts: string[] = [];

    if (typeof body.error === "string" && body.error.trim()) {
      parts.push(body.error.trim());
    } else if (body.error != null && typeof body.error === "object") {
      for (const [field, vals] of Object.entries(
        body.error as Record<string, unknown>,
      )) {
        const nested = flattenMoneybirdErrorValue(vals);
        if (nested.length === 0) {
          parts.push(mapMoneybirdFieldError(field, "ongeldig"));
          continue;
        }
        for (const n of nested) {
          // flatten kan "key: msg" teruggeven; strip nested keys voor mapping.
          const msg = n.includes(": ") ? n.slice(n.indexOf(": ") + 2) : n;
          parts.push(mapMoneybirdFieldError(field, msg));
        }
      }
    }
    if (typeof body.message === "string" && body.message.trim()) {
      parts.push(body.message.trim());
    }
    if (body.errors != null) {
      parts.push(...flattenMoneybirdErrorValue(body.errors));
    }
    if (body.details != null && typeof body.details === "object") {
      for (const [field, vals] of Object.entries(
        body.details as Record<string, unknown>,
      )) {
        const nested = flattenMoneybirdErrorValue(vals);
        for (const n of nested) {
          const msg = n.includes(": ") ? n.slice(n.indexOf(": ") + 2) : n;
          if (msg === "blank" || msg === "error") {
            parts.push(mapMoneybirdFieldError(field, "can't be blank"));
          }
        }
      }
    }
    if (body.symbolic != null) {
      parts.push(...flattenMoneybirdErrorValue(body.symbolic));
    }

    const detail = [...new Set(parts.filter(Boolean))].join("; ");
    if (detail) return detail.slice(0, 400);
  } catch {
    // non-JSON body
  }

  return snippet;
}

export function formatMoneybirdError(error: unknown): string {
  if (error instanceof MoneybirdApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Moneybird API-fout";
}

export function isMoneybirdNotFoundError(error: unknown): boolean {
  if (error instanceof MoneybirdApiError) return error.status === 404;
  const msg = formatMoneybirdError(error);
  return /\b404\b|not found|niet gevonden|bestaat niet/i.test(msg);
}

/** Log veilig (geen tokens/secrets). */
export function logMoneybirdSafe(
  label: string,
  extra?: Record<string, unknown>,
  level: "error" | "info" | "warn" = "error",
): void {
  const safe = extra
    ? Object.fromEntries(
        Object.entries(extra).filter(
          ([key]) => !/token|authorization|secret|password/i.test(key),
        ),
      )
    : undefined;
  const fn =
    level === "info"
      ? console.info
      : level === "warn"
        ? console.warn
        : console.error;
  fn(`[Moneybird] ${label}`, safe ?? "");
}

export function clearMoneybirdInvoiceDefaultsCache(): void {
  invoiceDefaultsCache = null;
}

/** Prijs als string met 2 decimalen (Moneybird: ^-?\\d+\\.\\d{1,2}$). */
export function formatMoneybirdPrice(price: number): string {
  if (!Number.isFinite(price)) {
    throw new Error("Ongeldige prijs op factuurregel.");
  }
  return Number(price).toFixed(2);
}

/** Aantal/hoeveelheid als schone decimale string. */
export function formatMoneybirdAmount(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error("Ongeldig aantal op factuurregel.");
  }
  const rounded = Math.round(amount * 10000) / 10000;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

export async function moneybirdFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = assertMoneybirdConfigured();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${config.baseUrl}/${config.administrationId}${normalizedPath}`;
  const method = (options.method || "GET").toUpperCase();

  const res = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const rawText = await res.text().catch(() => "");
    const detail = parseMoneybirdErrorBody(rawText);
    logMoneybirdSafe(`${method} ${normalizedPath} mislukt`, {
      status: res.status,
      detail: detail.slice(0, 200),
      administrationId: config.administrationId,
    });
    throw new MoneybirdApiError(res.status, detail, rawText.slice(0, 280));
  }

  if (res.status === 204) return {} as T;

  const rawText = await res.text();
  if (!rawText.trim()) return {} as T;

  try {
    return JSON.parse(rawText) as T;
  } catch {
    logMoneybirdSafe(`${method} ${normalizedPath}: ongeldige JSON-response`, {
      status: res.status,
      snippet: rawText.slice(0, 120),
    });
    throw new MoneybirdApiError(
      res.status,
      "Ongeldige JSON-response van Moneybird",
      rawText.slice(0, 280),
    );
  }
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
 * 1) optionele env-overrides (tenzij ignoreEnv)
 * 2) anders Moneybird API (in-memory cache, TTL 15 min)
 */
export async function resolveMoneybirdInvoiceDefaults(options?: {
  ignoreEnv?: boolean;
}): Promise<MoneybirdInvoiceDefaults | null> {
  const config = getMoneybirdConfig();
  if (!config) return null;

  const ignoreEnv = Boolean(options?.ignoreEnv);
  const envTax = ignoreEnv ? undefined : config.defaultTaxRateId;
  const envLedger = ignoreEnv ? undefined : config.defaultLedgerAccountId;
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
    !ignoreEnv &&
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
    send_invoices_to_email: String(raw.send_invoices_to_email ?? ""),
    city: String(raw.city ?? ""),
    customer_id: String(raw.customer_id ?? ""),
  };
}

/** Zoekt contacten via Moneybird `query` (naam, e-mail, enz.). */
export async function searchMoneybirdContacts(
  query: string,
): Promise<SafeMoneybirdContact[]> {
  const q = query.trim();
  if (!q) return [];

  const path = `/contacts.json?query=${encodeURIComponent(q)}&per_page=50`;
  const raw = await moneybirdFetch<Record<string, unknown>[]>(path);
  return (Array.isArray(raw) ? raw : []).map((c) => sanitizeMoneybirdContact(c));
}

/** Haalt één contact op; gooit MoneybirdApiError (404) als het niet bestaat. */
export async function getMoneybirdContact(
  contactId: string,
): Promise<SafeMoneybirdContact> {
  const id = contactId.trim();
  if (!id) {
    throw new Error("contactId is verplicht.");
  }
  const raw = await moneybirdFetch<Record<string, unknown>>(
    `/contacts/${encodeURIComponent(id)}.json`,
  );
  const contact = sanitizeMoneybirdContact(raw);
  if (!contact.id) {
    throw new MoneybirdApiError(404, "Moneybird-contact zonder id");
  }
  return contact;
}

/**
 * Zoekt contact via Moneybird klantnummer (`customer_id` op het contact),
 * niet via het interne contact-id. 404 → null.
 */
export async function findMoneybirdContactByCustomerId(
  customerId: string,
): Promise<SafeMoneybirdContact | null> {
  const id = customerId.trim();
  if (!id) return null;
  try {
    const raw = await moneybirdFetch<Record<string, unknown>>(
      `/contacts/customer_id/${encodeURIComponent(id)}.json`,
    );
    const contact = sanitizeMoneybirdContact(raw);
    return contact.id ? contact : null;
  } catch (error) {
    if (isMoneybirdNotFoundError(error)) return null;
    throw error;
  }
}

function buildSalesInvoiceDetailsAttributes(
  lines: MoneybirdInvoiceLineInput[],
  defaults: MoneybirdInvoiceDefaults,
): Array<Record<string, string>> {
  return lines.map((line, index) => {
    const description = String(line.description ?? "").trim();
    if (!description) {
      throw new Error(`Factuurregel ${index + 1} heeft geen omschrijving.`);
    }
    return {
      description,
      price: formatMoneybirdPrice(Number(line.price)),
      amount: formatMoneybirdAmount(Number(line.amount)),
      tax_rate_id: String(line.taxRateId || defaults.taxRateId),
      ledger_account_id: String(
        line.ledgerAccountId || defaults.ledgerAccountId,
      ),
    };
  });
}

/** Bouwt een contact-payload; lege strings worden weggelaten (Moneybird auto-vult customer_id). */
function buildMoneybirdContactPayload(
  input: CreateMoneybirdContactInput,
): Record<string, string> {
  const companyName = input.companyName?.trim() ?? "";
  const firstname = input.firstname?.trim() ?? "";
  const lastname = input.lastname?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const customerId = input.customerId?.trim() ?? "";

  if (!companyName && !firstname && !lastname) {
    throw new Error(
      "Moneybird-contact vereist een bedrijfsnaam of voor-/achternaam.",
    );
  }
  if (!email) {
    throw new Error(
      "E-mailadres ontbreekt bij de opdrachtgever. Vul een e-mail in om een Moneybird-contact aan te maken.",
    );
  }

  const contact: Record<string, string> = {
    email,
    country: input.country?.trim() || "NL",
  };
  if (companyName) contact.company_name = companyName;
  if (firstname) contact.firstname = firstname;
  if (lastname) contact.lastname = lastname;
  const phone = input.phone?.trim() ?? "";
  if (phone) contact.phone = phone;
  const address1 = input.address1?.trim() ?? "";
  if (address1) contact.address1 = address1;
  const zipcode = input.zipcode?.trim() ?? "";
  if (zipcode) contact.zipcode = zipcode;
  const city = input.city?.trim() ?? "";
  if (city) contact.city = city;
  // Alleen zetten als we een echte waarde hebben — `""` triggert 422 "can't be blank".
  if (customerId) contact.customer_id = customerId;

  return contact;
}

/** Maakt een contact/relatie in Moneybird. */
export async function createMoneybirdContact(
  input: CreateMoneybirdContactInput,
): Promise<SafeMoneybirdContact> {
  assertMoneybirdConfigured();

  const contact = buildMoneybirdContactPayload(input);
  const payload = { contact };

  logMoneybirdSafe(
    "POST /contacts.json",
    {
      keys: Object.keys(contact),
      hasCompany: Boolean(contact.company_name),
      hasEmail: Boolean(contact.email),
      hasCustomerId: Boolean(contact.customer_id),
    },
    "info",
  );

  try {
    const raw = await moneybirdFetch<Record<string, unknown>>("/contacts.json", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const created = sanitizeMoneybirdContact(raw);
    if (!created.id) {
      throw new Error(
        "Moneybird-contact aangemaakt, maar er kwam geen id terug.",
      );
    }
    return created;
  } catch (error) {
    const apiMessage = formatMoneybirdError(error);
    logMoneybirdSafe("POST /contacts.json mislukt", {
      keys: Object.keys(contact),
      error: apiMessage.slice(0, 240),
    });
    throw error;
  }
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

/** Moneybird intern contact-id voor sales invoices (`contact_id`). */
function resolveSalesInvoiceContactId(contactId: string): string {
  const id = contactId.trim();
  if (!id) {
    throw new Error(
      "Moneybird contact_id ontbreekt. Los eerst een geldig contact op voordat je een factuur aanmaakt.",
    );
  }
  return id;
}

function isBlankCustomerOrContactError(error: unknown): boolean {
  if (!(error instanceof MoneybirdApiError) || error.status !== 422) {
    return false;
  }
  const hay = `${error.message} ${error.bodySnippet}`.toLowerCase();
  return (
    /customer_id|contact_id/.test(hay) &&
    /blank|ontbreekt|verplicht|can't be empty/.test(hay)
  );
}

type SalesInvoiceBody = {
  sales_invoice: Record<string, unknown>;
};

/** Officiële API: contact_id. Sommige administraties eisen ook customer_id (= zelfde contact-id). */
function buildSalesInvoiceBodies(
  contactId: string,
  base: Omit<Record<string, unknown>, "contact_id" | "customer_id">,
): SalesInvoiceBody[] {
  return [
    {
      sales_invoice: {
        contact_id: contactId,
        customer_id: contactId,
        ...base,
      },
    },
    {
      sales_invoice: {
        contact_id: contactId,
        ...base,
      },
    },
    {
      sales_invoice: {
        customer_id: contactId,
        ...base,
      },
    },
  ];
}

function logSalesInvoicePayloadKeys(
  label: string,
  body: SalesInvoiceBody,
  extra?: Record<string, unknown>,
): void {
  const inv = body.sales_invoice;
  logMoneybirdSafe(
    label,
    {
      salesInvoiceKeys: Object.keys(inv),
      hasContactId: inv.contact_id != null && String(inv.contact_id).trim() !== "",
      hasCustomerId:
        inv.customer_id != null && String(inv.customer_id).trim() !== "",
      contactIdLen: String(inv.contact_id ?? "").trim().length,
      customerIdLen: String(inv.customer_id ?? "").trim().length,
      ...extra,
    },
    "info",
  );
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

  const contactId = resolveSalesInvoiceContactId(input.contactId);
  if (!input.lines.length) {
    throw new Error("Minimaal één factuurregel is verplicht.");
  }

  const details_attributes = buildSalesInvoiceDetailsAttributes(
    input.lines,
    defaults,
  );

  const baseFields = {
    reference: input.reference?.trim() || "Helping Hands factuur",
    invoice_date:
      input.invoiceDate || new Date().toISOString().slice(0, 10),
    due_date:
      input.dueDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    currency: input.currency || "EUR",
    prices_are_incl_tax: false,
    details_attributes,
  };

  const bodies = buildSalesInvoiceBodies(contactId, baseFields);
  const primary = bodies[0]!;

  logSalesInvoicePayloadKeys("POST /sales_invoices.json", primary, {
    lineCount: details_attributes.length,
    taxRateId: defaults.taxRateId,
    ledgerAccountId: defaults.ledgerAccountId,
    defaultsSource: defaults.source,
  });

  const postInvoice = async (body: SalesInvoiceBody) =>
    moneybirdFetch<Record<string, unknown>>("/sales_invoices.json", {
      method: "POST",
      body: JSON.stringify(body),
    });

  let raw: Record<string, unknown> | undefined;
  let lastError: unknown;

  for (let i = 0; i < bodies.length; i += 1) {
    const body = bodies[i]!;
    try {
      raw = await postInvoice(body);
      if (i > 0) {
        logMoneybirdSafe(
          "POST /sales_invoices.json geslaagd na payload-variant",
          { variant: i, salesInvoiceKeys: Object.keys(body.sales_invoice) },
          "warn",
        );
      }
      break;
    } catch (error) {
      lastError = error;
      if (isBlankCustomerOrContactError(error) && i < bodies.length - 1) {
        logSalesInvoicePayloadKeys(
          "POST /sales_invoices.json 422 klant-veld — probeer andere payload",
          body,
          { variant: i, nextVariant: i + 1 },
        );
        continue;
      }

      // Ongeldige env TAX/LEDGER IDs: één retry met auto-resolve uit de API.
      if (
        defaults.source === "env" &&
        error instanceof MoneybirdApiError &&
        (error.status === 422 || error.status === 404) &&
        !isBlankCustomerOrContactError(error)
      ) {
        clearMoneybirdInvoiceDefaultsCache();
        const autoDefaults = await resolveMoneybirdInvoiceDefaults({
          ignoreEnv: true,
        });
        if (!autoDefaults) throw error;
        logMoneybirdSafe(
          "POST /sales_invoices.json retry met auto tax/ledger",
          {
            taxRateId: autoDefaults.taxRateId,
            ledgerAccountId: autoDefaults.ledgerAccountId,
          },
          "warn",
        );
        const retryBody: SalesInvoiceBody = {
          sales_invoice: {
            ...body.sales_invoice,
            details_attributes: buildSalesInvoiceDetailsAttributes(
              input.lines,
              autoDefaults,
            ),
          },
        };
        raw = await postInvoice(retryBody);
        break;
      }

      if (error instanceof MoneybirdApiError && error.status === 422) {
        logSalesInvoicePayloadKeys(
          "POST /sales_invoices.json 422",
          body,
          { detail: error.message.slice(0, 200) },
        );
      }
      throw error;
    }
  }

  if (!raw) {
    throw lastError instanceof Error
      ? lastError
      : new Error("Moneybird factuur aanmaken mislukt.");
  }

  const invoice = sanitizeMoneybirdInvoice(raw);
  if (!invoice.id) {
    logMoneybirdSafe("POST /sales_invoices.json: geen id in response", {
      keys: Object.keys(raw ?? {}),
    });
    throw new Error(
      "Moneybird gaf geen factuur-id terug. Controleer administratie en API-rechten (sales_invoices).",
    );
  }
  return invoice;
}

/**
 * Werkt een bestaand Moneybird-concept bij (vervangt factuurregels).
 * Verzendt niet — alleen voor draft/open concepten.
 */
export async function updateMoneybirdSalesInvoice(
  moneybirdInvoiceId: string,
  input: CreateMoneybirdSalesInvoiceInput,
): Promise<SafeMoneybirdInvoice> {
  assertMoneybirdConfigured();
  const id = moneybirdInvoiceId.trim();
  if (!id) {
    throw new Error("moneybirdInvoiceId is verplicht.");
  }

  const defaults = await resolveMoneybirdInvoiceDefaults();
  if (!defaults) {
    throw new Error(MONEYBIRD_DEFAULTS_RESOLVE_ERROR);
  }

  const contactId = resolveSalesInvoiceContactId(input.contactId);
  if (!input.lines.length) {
    throw new Error("Minimaal één factuurregel is verplicht.");
  }

  const existing = await moneybirdFetch<Record<string, unknown>>(
    `/sales_invoices/${encodeURIComponent(id)}.json`,
  );
  const state = String(existing.state ?? "");
  if (state && state !== "draft" && state !== "new") {
    throw new Error(
      `Moneybird-factuur staat op “${state}” en kan niet meer als concept worden bijgewerkt.`,
    );
  }

  const existingDetails = Array.isArray(existing.details)
    ? (existing.details as Array<Record<string, unknown>>)
    : [];

  const details_attributes: Array<Record<string, string | boolean>> = [
    ...existingDetails
      .filter((detail) => detail.id != null)
      .map((detail) => ({
        id: String(detail.id),
        _destroy: true,
      })),
    ...buildSalesInvoiceDetailsAttributes(input.lines, defaults),
  ];

  const payload = {
    sales_invoice: {
      contact_id: contactId,
      customer_id: contactId,
      reference: input.reference?.trim() || "Helping Hands factuur",
      invoice_date:
        input.invoiceDate ||
        String(existing.invoice_date ?? new Date().toISOString().slice(0, 10)),
      due_date:
        input.dueDate ||
        String(
          existing.due_date ??
            new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        ),
      currency: input.currency || String(existing.currency ?? "EUR"),
      prices_are_incl_tax: false,
      details_attributes,
    },
  };

  logSalesInvoicePayloadKeys("PATCH /sales_invoices/{id}.json", payload, {
    moneybirdInvoiceId: id,
  });

  const raw = await moneybirdFetch<Record<string, unknown>>(
    `/sales_invoices/${encodeURIComponent(id)}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  const invoice = sanitizeMoneybirdInvoice(raw);
  if (!invoice.id) {
    throw new Error(
      "Moneybird gaf geen factuur-id terug bij bijwerken van het concept.",
    );
  }
  return invoice;
}

/**
 * Verwijdert een Moneybird-factuur (alleen concept/draft; verzonden facturen
 * moeten via creditnota). Verzendt niets.
 */
export async function deleteMoneybirdSalesInvoice(
  moneybirdInvoiceId: string,
): Promise<void> {
  const id = moneybirdInvoiceId.trim();
  if (!id) {
    throw new Error("moneybirdInvoiceId is verplicht.");
  }

  await moneybirdFetch<Record<string, unknown>>(
    `/sales_invoices/${encodeURIComponent(id)}.json`,
    { method: "DELETE" },
  );
}

/**
 * Maakt een creditnota-concept in Moneybird op basis van een bestaande factuur.
 * Verzendt nooit — credit blijft draft tot handmatige bevestiging in Moneybird.
 */
export async function createMoneybirdCreditInvoice(
  moneybirdInvoiceId: string,
): Promise<SafeMoneybirdInvoice> {
  const id = moneybirdInvoiceId.trim();
  if (!id) {
    throw new Error("moneybirdInvoiceId is verplicht.");
  }

  const raw = await moneybirdFetch<Record<string, unknown>>(
    `/sales_invoices/${encodeURIComponent(id)}/duplicate_creditinvoice.json`,
    {
      method: "PATCH",
      body: JSON.stringify({}),
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
