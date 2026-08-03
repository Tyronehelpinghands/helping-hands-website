import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatMoneybirdError,
  getMissingMoneybirdEnvVars,
  getMissingMoneybirdInvoiceEnvVars,
  isMoneybirdConfigured,
  isMoneybirdInvoiceReady,
  moneybirdFetch,
} from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  const missing = getMissingMoneybirdEnvVars();
  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      configured: false,
      invoiceReady: false,
      message: `Moneybird niet gekoppeld. Zet in Vercel: ${missing.join(", ")} en redeploy.`,
      missing,
      setupSteps: [
        "Moneybird → Instellingen → Externe toepassingen → Personal Access Token (scopes: sales_invoices, contacts)",
        "Administration ID uit de Moneybird-URL of API",
        "Vercel → Project → Settings → Environment Variables (Production + Preview)",
        "Redeploy na het zetten van de variabelen",
      ],
    });
  }

  const invoiceMissing = getMissingMoneybirdInvoiceEnvVars().filter(
    (v) => v.includes("TAX") || v.includes("LEDGER"),
  );

  try {
    await moneybirdFetch<unknown>("/contacts.json?per_page=1");
    return NextResponse.json({
      ok: true,
      configured: true,
      invoiceReady: isMoneybirdInvoiceReady(),
      message: isMoneybirdInvoiceReady()
        ? "Moneybird API bereikbaar — conceptfacturen kunnen worden aangemaakt."
        : `Moneybird API bereikbaar, maar factuurregels missen: ${invoiceMissing.join(", ")}.`,
      missing: invoiceMissing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: isMoneybirdConfigured(),
        invoiceReady: false,
        message: formatMoneybirdError(error),
        missing: invoiceMissing,
      },
      { status: 502 },
    );
  }
}
