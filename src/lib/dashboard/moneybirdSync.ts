import { createClient } from "@/lib/supabase/server";
import {
  createMoneybirdSalesInvoice,
  formatMoneybirdError,
  getMissingMoneybirdEnvVars,
  isMoneybirdConfigured,
  MONEYBIRD_DEFAULTS_RESOLVE_ERROR,
  resolveMoneybirdInvoiceDefaults,
  sendMoneybirdSalesInvoice,
} from "@/lib/server/moneybird";
import type {
  InvoiceDraftLine,
  MoneybirdSyncStatus,
} from "@/lib/dashboard/types";

export type PushInvoiceDraftResult =
  | {
      ok: true;
      moneybirdInvoiceId: string;
      moneybirdState: string;
      sent: boolean;
      message: string;
    }
  | { ok: false; error: string };

function isMissingColumnError(message: string): boolean {
  return (
    /moneybird_/i.test(message) &&
    (/column/i.test(message) ||
      /schema cache/i.test(message) ||
      /does not exist/i.test(message))
  );
}

type LoadedDraft = {
  id: string;
  invoice_number: string | null;
  client_id: string | null;
  moneybird_invoice_id?: string | null;
  invoice_draft_lines?: InvoiceDraftLine[] | null;
};

/**
 * Push een Supabase invoice_draft naar Moneybird als concept (optioneel verzenden).
 * Schrijft moneybird_* kolommen terug indien aanwezig.
 */
export async function pushInvoiceDraftToMoneybird(options: {
  draftId: string;
  contactId: string;
  send?: boolean;
}): Promise<PushInvoiceDraftResult> {
  if (!isMoneybirdConfigured()) {
    const missing = getMissingMoneybirdEnvVars();
    return {
      ok: false,
      error:
        missing.length > 0
          ? `Moneybird niet gekoppeld. Zet in Vercel: ${missing.join(", ")} en redeploy.`
          : "Moneybird configuratie ontbreekt.",
    };
  }

  const defaults = await resolveMoneybirdInvoiceDefaults();
  if (!defaults) {
    return {
      ok: false,
      error: MONEYBIRD_DEFAULTS_RESOLVE_ERROR,
    };
  }

  const contactId = options.contactId.trim();
  if (!contactId) {
    return {
      ok: false,
      error:
        "Moneybird contact-id ontbreekt. Vul moneybird_contact_id bij de klant in of geef een contact-id op.",
    };
  }

  const supabase = await createClient();

  let draft: LoadedDraft | null = null;
  let persistMoneybirdColumns = true;

  const full = await supabase
    .from("invoice_drafts")
    .select(
      "id, invoice_number, client_id, moneybird_invoice_id, invoice_draft_lines(*)",
    )
    .eq("id", options.draftId)
    .maybeSingle();

  if (full.error && isMissingColumnError(full.error.message)) {
    persistMoneybirdColumns = false;
    const basic = await supabase
      .from("invoice_drafts")
      .select("id, invoice_number, client_id, invoice_draft_lines(*)")
      .eq("id", options.draftId)
      .maybeSingle();
    if (basic.error || !basic.data) {
      return {
        ok: false,
        error:
          "Moneybird-kolommen ontbreken. Voer de SQL-migratie uit (docs/moneybird-integration.md).",
      };
    }
    draft = basic.data as LoadedDraft;
  } else if (full.error) {
    return { ok: false, error: full.error.message };
  } else {
    draft = full.data as LoadedDraft | null;
  }

  if (!draft) {
    return { ok: false, error: "Factuurconcept niet gevonden." };
  }

  const existingId = draft.moneybird_invoice_id?.trim();
  if (existingId) {
    return {
      ok: false,
      error: `Dit concept staat al in Moneybird (id ${existingId}).`,
    };
  }

  const lines = Array.isArray(draft.invoice_draft_lines)
    ? draft.invoice_draft_lines
    : [];
  if (lines.length === 0) {
    return { ok: false, error: "Factuurconcept heeft geen regels." };
  }

  const reference = draft.invoice_number?.trim() || "Helping Hands factuur";

  try {
    let invoice = await createMoneybirdSalesInvoice({
      contactId,
      reference,
      lines: lines.map((line) => ({
        description: line.description,
        amount: Number(line.quantity) || 1,
        price: Number(line.unit_price) || 0,
      })),
    });

    let sent = false;
    if (options.send) {
      invoice = await sendMoneybirdSalesInvoice(invoice.id);
      sent = true;
    }

    const syncStatus: MoneybirdSyncStatus = sent ? "verzonden" : "concept";

    if (persistMoneybirdColumns) {
      const { error: updateError } = await supabase
        .from("invoice_drafts")
        .update({
          moneybird_invoice_id: invoice.id,
          moneybird_sync_status: syncStatus,
          moneybird_synced_at: new Date().toISOString(),
          moneybird_sync_error: null,
          status: sent ? "sent" : "ready",
        })
        .eq("id", draft.id);

      if (updateError) {
        if (isMissingColumnError(updateError.message)) {
          await supabase
            .from("invoice_drafts")
            .update({ status: sent ? "sent" : "ready" })
            .eq("id", draft.id);

          return {
            ok: true,
            moneybirdInvoiceId: invoice.id,
            moneybirdState: invoice.state,
            sent,
            message: sent
              ? `Verzonden in Moneybird (${invoice.invoice_id || invoice.id}). Voer SQL-migratie uit om sync-status lokaal te bewaren.`
              : `Concept aangemaakt in Moneybird (${invoice.invoice_id || invoice.id}). Voer SQL-migratie uit om sync-status lokaal te bewaren.`,
          };
        }
        return {
          ok: false,
          error: `Moneybird OK (${invoice.id}), maar Supabase-update mislukt: ${updateError.message}`,
        };
      }
    } else {
      await supabase
        .from("invoice_drafts")
        .update({ status: sent ? "sent" : "ready" })
        .eq("id", draft.id);
    }

    if (draft.client_id) {
      const { error: clientError } = await supabase
        .from("clients")
        .update({ moneybird_contact_id: contactId })
        .eq("id", draft.client_id);
      if (clientError && !isMissingColumnError(clientError.message)) {
        // Niet-blokkerend: factuur is al aangemaakt
        console.warn(
          "[Moneybird] Kon moneybird_contact_id niet opslaan:",
          clientError.message,
        );
      }
    }

    return {
      ok: true,
      moneybirdInvoiceId: invoice.id,
      moneybirdState: invoice.state,
      sent,
      message: sent
        ? `Factuur verzonden in Moneybird (${invoice.invoice_id || invoice.id}).`
        : `Conceptfactuur aangemaakt in Moneybird (${invoice.invoice_id || invoice.id}). Niet automatisch verzonden.`,
    };
  } catch (error) {
    const message = formatMoneybirdError(error);
    if (persistMoneybirdColumns) {
      await supabase
        .from("invoice_drafts")
        .update({
          moneybird_sync_status: "fout" satisfies MoneybirdSyncStatus,
          moneybird_sync_error: message,
        })
        .eq("id", draft.id);
    }
    return { ok: false, error: message };
  }
}
