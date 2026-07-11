import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  assertMoneybirdConfigured,
  formatMoneybirdError,
  isMoneybirdConfigured,
  moneybirdFetch,
  sanitizeMoneybirdInvoice,
} from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

type InvoiceLineInput = {
  description?: string;
  amount?: number;
  price?: number;
  taxRateId?: string;
  ledgerAccountId?: string;
};

type CreateInvoiceBody = {
  contactId?: string;
  reference?: string;
  invoiceDate?: string;
  dueDate?: string;
  lines?: InvoiceLineInput[];
};

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isMoneybirdConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Moneybird configuratie ontbreekt. Controleer Vercel Environment Variables.",
      },
      { status: 503 },
    );
  }

  try {
    const raw = await moneybirdFetch<Record<string, unknown>[]>(
      "/sales_invoices.json",
    );
    const invoices = (Array.isArray(raw) ? raw : []).map((inv) =>
      sanitizeMoneybirdInvoice(inv),
    );
    return NextResponse.json({ ok: true, invoices });
  } catch (error) {
    console.error("[Moneybird] Facturen ophalen mislukt");
    return NextResponse.json(
      { ok: false, error: formatMoneybirdError(error) },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isMoneybirdConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Moneybird configuratie ontbreekt. Controleer Vercel Environment Variables.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as CreateInvoiceBody;
    const config = assertMoneybirdConfigured();

    if (!body.contactId?.trim()) {
      return NextResponse.json(
        { ok: false, error: "contactId is verplicht." },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.lines) || body.lines.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Minimaal één factuurregel is verplicht." },
        { status: 400 },
      );
    }

    for (const line of body.lines) {
      if (!line.description?.trim()) {
        return NextResponse.json(
          { ok: false, error: "Omschrijving is verplicht per regel." },
          { status: 400 },
        );
      }
      if (!line.amount || line.amount <= 0) {
        return NextResponse.json(
          { ok: false, error: "Aantal moet groter dan 0 zijn." },
          { status: 400 },
        );
      }
      if (line.price === undefined || line.price < 0) {
        return NextResponse.json(
          { ok: false, error: "Prijs moet 0 of hoger zijn." },
          { status: 400 },
        );
      }
    }

    // tax_rate_id en ledger_account_id komen uit Moneybird instellingen (env vars).
    const taxRateId = config.defaultTaxRateId;
    const ledgerAccountId = config.defaultLedgerAccountId;

    if (!taxRateId || !ledgerAccountId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "MONEYBIRD_DEFAULT_TAX_RATE_ID en MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID zijn verplicht voor factuurregels.",
        },
        { status: 503 },
      );
    }

    const payload = {
      sales_invoice: {
        contact_id: body.contactId.trim(),
        reference: body.reference?.trim() || "Helping Hands factuur",
        invoice_date: body.invoiceDate || new Date().toISOString().slice(0, 10),
        due_date:
          body.dueDate ||
          new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        currency: "EUR",
        details_attributes: body.lines.map((line) => ({
          description: line.description!.trim(),
          price: line.price!.toFixed(2),
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

    const invoice = sanitizeMoneybirdInvoice(raw);
    return NextResponse.json({
      ok: true,
      invoice: {
        id: invoice.id,
        invoice_id: invoice.invoice_id,
        state: invoice.state,
        reference: invoice.reference,
        total_price_excl_tax: invoice.total_price_excl_tax,
        total_price_incl_tax: invoice.total_price_incl_tax,
      },
    });
  } catch (error) {
    console.error("[Moneybird] Conceptfactuur aanmaken mislukt");
    return NextResponse.json(
      { ok: false, error: formatMoneybirdError(error) },
      { status: 502 },
    );
  }
}
