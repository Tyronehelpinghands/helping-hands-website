import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatMoneybirdError,
  getMissingMoneybirdEnvVars,
  isMoneybirdConfigured,
  moneybirdFetch,
  resolveMoneybirdInvoiceDefaults,
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

  try {
    await moneybirdFetch<unknown>("/contacts.json?per_page=1");
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: isMoneybirdConfigured(),
        invoiceReady: false,
        message: formatMoneybirdError(error),
        missing: [],
      },
      { status: 502 },
    );
  }

  try {
    const defaults = await resolveMoneybirdInvoiceDefaults();
    if (defaults) {
      return NextResponse.json({
        ok: true,
        configured: true,
        invoiceReady: true,
        defaultsSource: defaults.source,
        message:
          defaults.source === "env"
            ? "Klaar voor facturen (tax/ledger via env)."
            : "Klaar voor facturen (tax/ledger automatisch uit Moneybird).",
        missing: [],
      });
    }
    return NextResponse.json({
      ok: true,
      configured: true,
      invoiceReady: false,
      message:
        "Token OK (contacts). Geen standaard BTW-tarief of omzetrekening gevonden. Optioneel: MONEYBIRD_DEFAULT_TAX_RATE_ID / MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID. Zie docs/moneybird-integration.md.",
      missing: [],
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      configured: true,
      invoiceReady: false,
      message: `Token OK (contacts). Tax/ledger niet opgehaald: ${formatMoneybirdError(error)}. Zie docs/moneybird-integration.md.`,
      missing: [],
    });
  }
}
