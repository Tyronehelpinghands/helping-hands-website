import { NextResponse } from "next/server";
import {
  requireFinanceApiAccess,
  requireInternApiAccess,
} from "@/lib/api-auth";
import {
  createMoneybirdSalesInvoice,
  formatMoneybirdError,
  isMoneybirdConfigured,
  logMoneybirdSafe,
  moneybirdFetch,
  sanitizeMoneybirdInvoice,
  sendMoneybirdSalesInvoice,
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
  /** Optioneel: verstuur na aanmaken (default: alleen concept). */
  send?: boolean;
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
    const message = formatMoneybirdError(error);
    logMoneybirdSafe("Facturen ophalen mislukt", { error: message.slice(0, 240) });
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const auth = await requireFinanceApiAccess();
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

    let invoice = await createMoneybirdSalesInvoice({
      contactId: body.contactId,
      reference: body.reference,
      invoiceDate: body.invoiceDate,
      dueDate: body.dueDate,
      lines: body.lines.map((line) => ({
        description: line.description!.trim(),
        amount: line.amount!,
        price: line.price!,
        taxRateId: line.taxRateId,
        ledgerAccountId: line.ledgerAccountId,
      })),
    });

    let sent = false;
    if (body.send) {
      invoice = await sendMoneybirdSalesInvoice(invoice.id);
      sent = true;
    }

    return NextResponse.json({
      ok: true,
      sent,
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
    const message = formatMoneybirdError(error);
    logMoneybirdSafe("Conceptfactuur aanmaken mislukt", {
      error: message.slice(0, 240),
    });
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
