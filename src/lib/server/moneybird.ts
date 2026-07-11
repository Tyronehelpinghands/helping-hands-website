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

export function getMoneybirdConfig(): MoneybirdConfig | null {
  const accessToken = process.env.MONEYBIRD_ACCESS_TOKEN?.trim();
  const administrationId = process.env.MONEYBIRD_ADMINISTRATION_ID?.trim();
  if (!accessToken || !administrationId) return null;

  const baseUrl = (
    process.env.MONEYBIRD_BASE_URL?.trim() || DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  return {
    accessToken,
    administrationId,
    baseUrl,
    defaultTaxRateId: process.env.MONEYBIRD_DEFAULT_TAX_RATE_ID?.trim(),
    defaultLedgerAccountId:
      process.env.MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID?.trim(),
  };
}

export function isMoneybirdConfigured(): boolean {
  return getMoneybirdConfig() !== null;
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
        errors?: string[];
      };
      if (body.error) message = body.error;
      else if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors.join(", ");
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
