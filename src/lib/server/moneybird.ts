// Server-only Moneybird helper. Niet importeren in client components.

const DEFAULT_BASE_URL = "https://moneybird.com/api/v2";

export type MoneybirdConfig = {
  accessToken: string;
  administrationId: string;
  baseUrl: string;
  defaultTaxRateId?: string;
  defaultLedgerAccountId?: string;
};

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

export function getMissingMoneybirdInvoiceEnvVars(): string[] {
  const missing = getMissingMoneybirdEnvVars();
  if (!envTrim("MONEYBIRD_DEFAULT_TAX_RATE_ID")) {
    missing.push("MONEYBIRD_DEFAULT_TAX_RATE_ID");
  }
  if (!envTrim("MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID")) {
    missing.push("MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID");
  }
  return missing;
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

/** True when create-invoice env (tax + ledger) is complete. */
export function isMoneybirdInvoiceReady(): boolean {
  return getMissingMoneybirdInvoiceEnvVars().length === 0;
}

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
  const config = assertMoneybirdConfigured();
  const taxRateId = config.defaultTaxRateId;
  const ledgerAccountId = config.defaultLedgerAccountId;

  if (!taxRateId || !ledgerAccountId) {
    throw new Error(
      "MONEYBIRD_DEFAULT_TAX_RATE_ID en MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID zijn verplicht voor factuurregels.",
    );
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
        tax_rate_id: line.taxRateId || taxRateId,
        ledger_account_id: line.ledgerAccountId || ledgerAccountId,
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
