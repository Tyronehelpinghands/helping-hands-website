import { createClient } from "@/lib/supabase/server";
import {
  createMoneybirdSalesInvoice,
  formatMoneybirdError,
  getMissingMoneybirdEnvVars,
  isMoneybirdConfigured,
  MONEYBIRD_DEFAULTS_RESOLVE_ERROR,
  resolveMoneybirdInvoiceDefaults,
  sendMoneybirdSalesInvoice,
  updateMoneybirdSalesInvoice,
} from "@/lib/server/moneybird";
import { OUTDATED_MONEYBIRD_DRAFT_MSG } from "@/lib/dashboard/moneybirdConstants";
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

/** True when PostgREST/Postgres reports a missing moneybird_* column. */
export function isMissingMoneybirdColumnError(message: string): boolean {
  return (
    /moneybird_/i.test(message) &&
    (/column/i.test(message) ||
      /schema cache/i.test(message) ||
      /does not exist/i.test(message))
  );
}

export const MONEYBIRD_COLUMNS_SQL_HINT =
  "Draai SQL voor moneybird kolommen (supabase/moneybird-columns.sql in Supabase SQL Editor).";

export { OUTDATED_MONEYBIRD_DRAFT_MSG };

type LoadedDraft = {
  id: string;
  invoice_number: string | null;
  client_id: string | null;
  status?: string | null;
  moneybird_invoice_id?: string | null;
  moneybird_sync_status?: string | null;
  moneybird_sync_error?: string | null;
  invoice_draft_lines?: InvoiceDraftLine[] | null;
};

async function loadInvoiceDraft(
  draftId: string,
): Promise<
  | { ok: true; draft: LoadedDraft; persistMoneybirdColumns: boolean }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  let persistMoneybirdColumns = true;

  const full = await supabase
    .from("invoice_drafts")
    .select(
      "id, invoice_number, client_id, status, moneybird_invoice_id, moneybird_sync_status, moneybird_sync_error, invoice_draft_lines(*)",
    )
    .eq("id", draftId)
    .maybeSingle();

  if (full.error && isMissingMoneybirdColumnError(full.error.message)) {
    persistMoneybirdColumns = false;
    const basic = await supabase
      .from("invoice_drafts")
      .select("id, invoice_number, client_id, status, invoice_draft_lines(*)")
      .eq("id", draftId)
      .maybeSingle();
    if (basic.error || !basic.data) {
      return { ok: false, error: MONEYBIRD_COLUMNS_SQL_HINT };
    }
    return {
      ok: true,
      draft: basic.data as LoadedDraft,
      persistMoneybirdColumns,
    };
  }

  if (full.error) {
    return { ok: false, error: full.error.message };
  }
  if (!full.data) {
    return { ok: false, error: "Factuurconcept niet gevonden." };
  }

  return {
    ok: true,
    draft: full.data as LoadedDraft,
    persistMoneybirdColumns,
  };
}

/**
 * Push een Supabase invoice_draft naar Moneybird als concept (nooit verzenden).
 * Bij bestaand moneybird_invoice_id (nog niet verzonden): concept bijwerken.
 */
export async function pushInvoiceDraftToMoneybird(options: {
  draftId: string;
  contactId: string;
  /** @deprecated Verzenden gebeurt via confirmInvoiceDraftInMoneybird. */
  send?: boolean;
}): Promise<PushInvoiceDraftResult> {
  if (options.send) {
    return {
      ok: false,
      error:
        "Verzenden kan niet via sync. Gebruik “Bevestig factuur” na het aanmaken van een Moneybird-concept.",
    };
  }

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

  const loaded = await loadInvoiceDraft(options.draftId);
  if (!loaded.ok) return loaded;

  const { draft, persistMoneybirdColumns } = loaded;
  const supabase = await createClient();

  if (draft.moneybird_sync_status === "verzonden" || draft.status === "sent") {
    return {
      ok: false,
      error: "Deze factuur is al verzonden en kan niet opnieuw als concept worden gesynct.",
    };
  }

  const lines = Array.isArray(draft.invoice_draft_lines)
    ? draft.invoice_draft_lines
    : [];
  if (lines.length === 0) {
    return { ok: false, error: "Factuurconcept heeft geen regels." };
  }

  const reference = draft.invoice_number?.trim() || "Helping Hands factuur";
  const linePayload = lines.map((line) => ({
    description: line.description,
    amount: Number(line.quantity) || 1,
    price: Number(line.unit_price) || 0,
  }));

  try {
    const existingId = draft.moneybird_invoice_id?.trim();
    const invoice = existingId
      ? await updateMoneybirdSalesInvoice(existingId, {
          contactId,
          reference,
          lines: linePayload,
        })
      : await createMoneybirdSalesInvoice({
          contactId,
          reference,
          lines: linePayload,
        });

    const syncStatus: MoneybirdSyncStatus = "concept";

    if (persistMoneybirdColumns) {
      const { error: updateError } = await supabase
        .from("invoice_drafts")
        .update({
          moneybird_invoice_id: invoice.id,
          moneybird_sync_status: syncStatus,
          moneybird_synced_at: new Date().toISOString(),
          moneybird_sync_error: null,
          status: "ready",
        })
        .eq("id", draft.id);

      if (updateError) {
        if (isMissingMoneybirdColumnError(updateError.message)) {
          await supabase
            .from("invoice_drafts")
            .update({ status: "ready" })
            .eq("id", draft.id);

          return {
            ok: true,
            moneybirdInvoiceId: invoice.id,
            moneybirdState: invoice.state,
            sent: false,
            message: existingId
              ? `Concept bijgewerkt in Moneybird (${invoice.invoice_id || invoice.id}). Voer SQL-migratie uit om sync-status lokaal te bewaren.`
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
        .update({ status: "ready" })
        .eq("id", draft.id);
    }

    if (draft.client_id) {
      const { error: clientError } = await supabase
        .from("clients")
        .update({ moneybird_contact_id: contactId })
        .eq("id", draft.client_id);
      if (clientError && !isMissingMoneybirdColumnError(clientError.message)) {
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
      sent: false,
      message: existingId
        ? `Conceptfactuur bijgewerkt in Moneybird (${invoice.invoice_id || invoice.id}). Nog niet verzonden.`
        : `Conceptfactuur aangemaakt in Moneybird (${invoice.invoice_id || invoice.id}). Nog niet verzonden — gebruik “Bevestig factuur” om te verzenden.`,
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

/**
 * Bevestigt/verzendt een bestaand Moneybird-concept. Nooit impliciet vanuit sync.
 */
export async function confirmInvoiceDraftInMoneybird(options: {
  draftId: string;
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

  const loaded = await loadInvoiceDraft(options.draftId);
  if (!loaded.ok) return loaded;

  const { draft, persistMoneybirdColumns } = loaded;
  const supabase = await createClient();

  const moneybirdId = draft.moneybird_invoice_id?.trim();
  if (!moneybirdId) {
    return {
      ok: false,
      error:
        "Eerst “Naar Moneybird als concept” gebruiken voordat je de factuur bevestigt.",
    };
  }

  if (draft.moneybird_sync_status === "verzonden" || draft.status === "sent") {
    return {
      ok: false,
      error: "Deze factuur is al bevestigd/verzonden.",
    };
  }

  if (
    draft.moneybird_sync_status === "niet_gesynct" ||
    draft.moneybird_sync_error === OUTDATED_MONEYBIRD_DRAFT_MSG
  ) {
    return {
      ok: false,
      error:
        "Concept is verouderd t.o.v. de uren. Vernieuw eerst naar Moneybird als concept.",
    };
  }

  try {
    const invoice = await sendMoneybirdSalesInvoice(moneybirdId);

    if (persistMoneybirdColumns) {
      const { error: updateError } = await supabase
        .from("invoice_drafts")
        .update({
          moneybird_sync_status: "verzonden" satisfies MoneybirdSyncStatus,
          moneybird_synced_at: new Date().toISOString(),
          moneybird_sync_error: null,
          status: "sent",
        })
        .eq("id", draft.id);

      if (updateError) {
        if (isMissingMoneybirdColumnError(updateError.message)) {
          await supabase
            .from("invoice_drafts")
            .update({ status: "sent" })
            .eq("id", draft.id);
          return {
            ok: true,
            moneybirdInvoiceId: invoice.id,
            moneybirdState: invoice.state,
            sent: true,
            message: `Factuur bevestigd/verzonden in Moneybird (${invoice.invoice_id || invoice.id}). Voer SQL-migratie uit om sync-status lokaal te bewaren.`,
          };
        }
        return {
          ok: false,
          error: `Moneybird verzonden (${invoice.id}), maar Supabase-update mislukt: ${updateError.message}`,
        };
      }
    } else {
      await supabase
        .from("invoice_drafts")
        .update({ status: "sent" })
        .eq("id", draft.id);
    }

    return {
      ok: true,
      moneybirdInvoiceId: invoice.id,
      moneybirdState: invoice.state,
      sent: true,
      message: `Factuur bevestigd en verzonden in Moneybird (${invoice.invoice_id || invoice.id}).`,
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
