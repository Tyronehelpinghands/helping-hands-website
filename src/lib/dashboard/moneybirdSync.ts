import { createClient } from "@/lib/supabase/server";
import {
  createMoneybirdContact,
  createMoneybirdSalesInvoice,
  formatMoneybirdError,
  getMissingMoneybirdEnvVars,
  getMoneybirdContact,
  isMoneybirdConfigured,
  isMoneybirdNotFoundError,
  logMoneybirdSafe,
  MONEYBIRD_DEFAULTS_RESOLVE_ERROR,
  resolveMoneybirdInvoiceDefaults,
  searchMoneybirdContacts,
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

export type SyncClientContactResult =
  | {
      ok: true;
      contactId: string;
      created: boolean;
      matchedBy: "stored" | "email" | "company_name" | "created";
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

type ClientForMoneybird = {
  id: string;
  company_name: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  moneybird_contact_id?: string | null;
};

function normalizeEmail(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function normalizeCompany(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function splitContactName(contactName: string | null | undefined): {
  firstname: string;
  lastname: string;
} {
  const parts = (contactName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstname: "", lastname: "" };
  if (parts.length === 1) return { firstname: parts[0], lastname: "" };
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(" "),
  };
}

async function loadClientForMoneybird(
  clientId: string,
): Promise<
  | { ok: true; client: ClientForMoneybird; persistContactColumn: boolean }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  let persistContactColumn = true;

  const full = await supabase
    .from("clients")
    .select(
      "id, company_name, contact_name, email, phone, address, city, moneybird_contact_id",
    )
    .eq("id", clientId)
    .maybeSingle();

  if (full.error && isMissingMoneybirdColumnError(full.error.message)) {
    persistContactColumn = false;
    const basic = await supabase
      .from("clients")
      .select("id, company_name, contact_name, email, phone, address, city")
      .eq("id", clientId)
      .maybeSingle();
    if (basic.error || !basic.data) {
      return { ok: false, error: MONEYBIRD_COLUMNS_SQL_HINT };
    }
    return {
      ok: true,
      client: basic.data as ClientForMoneybird,
      persistContactColumn,
    };
  }

  if (full.error) {
    return { ok: false, error: full.error.message };
  }
  if (!full.data) {
    return { ok: false, error: "Opdrachtgever niet gevonden." };
  }

  return {
    ok: true,
    client: full.data as ClientForMoneybird,
    persistContactColumn,
  };
}

async function persistClientMoneybirdContactId(
  clientId: string,
  contactId: string | null,
  persistContactColumn: boolean,
): Promise<void> {
  if (!persistContactColumn) return;
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({ moneybird_contact_id: contactId })
    .eq("id", clientId);
  if (error && !isMissingMoneybirdColumnError(error.message)) {
    console.warn(
      "[Moneybird] Kon moneybird_contact_id niet opslaan:",
      error.message,
    );
  }
}

async function assertMoneybirdContactExists(
  contactId: string,
): Promise<{ ok: true } | { ok: false; notFound: boolean; error: string }> {
  try {
    const contact = await getMoneybirdContact(contactId);
    if (!contact.id) {
      return {
        ok: false,
        notFound: true,
        error: "Moneybird-contact niet gevonden.",
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      notFound: isMoneybirdNotFoundError(error),
      error: formatMoneybirdError(error),
    };
  }
}

/**
 * Lost Moneybird contact-id op voor een opdrachtgever:
 * 1) bestaande clients.moneybird_contact_id
 * 2) zoek op e-mail
 * 3) zoek op bedrijfsnaam
 * 4) maak contact aan (vereist e-mail)
 * Slaat het gevonden/aangemaakte id terug op clients.
 */
export async function resolveOrCreateMoneybirdContactForClient(options: {
  clientId: string;
  /** Optionele override (bijv. handmatig); wordt opgeslagen op de klant. */
  contactIdOverride?: string | null;
}): Promise<SyncClientContactResult> {
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

  const override = options.contactIdOverride?.trim();
  if (override) {
    const loaded = await loadClientForMoneybird(options.clientId);
    if (!loaded.ok) return loaded;
    const exists = await assertMoneybirdContactExists(override);
    if (!exists.ok) {
      return {
        ok: false,
        error: exists.notFound
          ? `Moneybird-contact ${override} bestaat niet in deze administratie. Kies een geldig contact of laat auto-koppeling het oplossen.`
          : exists.error,
      };
    }
    await persistClientMoneybirdContactId(
      options.clientId,
      override,
      loaded.persistContactColumn,
    );
    return {
      ok: true,
      contactId: override,
      created: false,
      matchedBy: "stored",
      message: `Moneybird-contact gekoppeld (${override}).`,
    };
  }

  const loaded = await loadClientForMoneybird(options.clientId);
  if (!loaded.ok) return loaded;

  const { client, persistContactColumn } = loaded;
  const stored = client.moneybird_contact_id?.trim();
  if (stored) {
    const exists = await assertMoneybirdContactExists(stored);
    if (exists.ok) {
      return {
        ok: true,
        contactId: stored,
        created: false,
        matchedBy: "stored",
        message: `Bestaande Moneybird-koppeling gebruikt (${stored}).`,
      };
    }
    // Stale/verwijderd contact-id mag factuur-sync niet blokkeren: wis en zoek opnieuw.
    if (exists.notFound) {
      logMoneybirdSafe("Stale moneybird_contact_id gewist", {
        clientId: client.id,
        contactId: stored,
      });
      await persistClientMoneybirdContactId(
        client.id,
        null,
        persistContactColumn,
      );
    } else {
      return { ok: false, error: exists.error };
    }
  }

  const email = normalizeEmail(client.email);
  const company = (client.company_name ?? "").trim();
  const companyNorm = normalizeCompany(company);

  try {
    if (email) {
      const byEmail = await searchMoneybirdContacts(email);
      const exactEmail = byEmail.find(
        (c) => normalizeEmail(c.email) === email,
      );
      if (exactEmail?.id) {
        await persistClientMoneybirdContactId(
          client.id,
          exactEmail.id,
          persistContactColumn,
        );
        return {
          ok: true,
          contactId: exactEmail.id,
          created: false,
          matchedBy: "email",
          message: `Moneybird-contact gevonden op e-mail en gekoppeld (${exactEmail.id}).`,
        };
      }
    }

    if (companyNorm) {
      const byCompany = await searchMoneybirdContacts(company);
      const exactCompany = byCompany.find(
        (c) => normalizeCompany(c.company_name) === companyNorm,
      );
      if (exactCompany?.id) {
        await persistClientMoneybirdContactId(
          client.id,
          exactCompany.id,
          persistContactColumn,
        );
        return {
          ok: true,
          contactId: exactCompany.id,
          created: false,
          matchedBy: "company_name",
          message: `Moneybird-contact gevonden op bedrijfsnaam en gekoppeld (${exactCompany.id}).`,
        };
      }
    }

    if (!email) {
      return {
        ok: false,
        error:
          "Geen Moneybird-contact gevonden en e-mail ontbreekt bij de opdrachtgever. Vul een e-mailadres in bij Sales → Opdrachtgevers, daarna opnieuw synchroniseren.",
      };
    }

    const { firstname, lastname } = splitContactName(client.contact_name);
    const created = await createMoneybirdContact({
      companyName: company || undefined,
      firstname: firstname || undefined,
      lastname: lastname || undefined,
      email,
      phone: client.phone ?? undefined,
      address1: client.address ?? undefined,
      city: client.city ?? undefined,
      country: "NL",
    });

    if (!created.id) {
      return {
        ok: false,
        error: "Moneybird-contact aangemaakt, maar er kwam geen id terug.",
      };
    }

    await persistClientMoneybirdContactId(
      client.id,
      created.id,
      persistContactColumn,
    );

    return {
      ok: true,
      contactId: created.id,
      created: true,
      matchedBy: "created",
      message: `Nieuw Moneybird-contact aangemaakt en gekoppeld (${created.id}).`,
    };
  } catch (error) {
    return { ok: false, error: formatMoneybirdError(error) };
  }
}

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
 * Contact-id: optionele override, anders auto-resolve/create via opdrachtgever.
 */
export async function pushInvoiceDraftToMoneybird(options: {
  draftId: string;
  /** Optioneel; leeg = automatisch zoeken/aanmaken vanuit opdrachtgever. */
  contactId?: string | null;
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

  if (!draft.client_id) {
    return {
      ok: false,
      error:
        "Factuurconcept heeft geen opdrachtgever. Koppel eerst een klant aan het project.",
    };
  }

  const contactResolved = await resolveOrCreateMoneybirdContactForClient({
    clientId: draft.client_id,
    contactIdOverride: options.contactId,
  });
  if (!contactResolved.ok) return contactResolved;

  const contactId = contactResolved.contactId;

  const lines = Array.isArray(draft.invoice_draft_lines)
    ? draft.invoice_draft_lines
    : [];
  if (lines.length === 0) {
    return { ok: false, error: "Factuurconcept heeft geen regels." };
  }

  const linePayload: Array<{
    description: string;
    amount: number;
    price: number;
  }> = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const description = String(line.description ?? "").trim();
    if (!description) {
      return {
        ok: false,
        error: `Factuurregel ${i + 1} heeft geen omschrijving.`,
      };
    }
    const amountRaw = Number(line.quantity);
    const amount =
      Number.isFinite(amountRaw) && amountRaw !== 0 ? amountRaw : NaN;
    const price = Number(line.unit_price);
    if (!Number.isFinite(amount)) {
      return {
        ok: false,
        error: `Factuurregel ${i + 1} heeft een ongeldig aantal.`,
      };
    }
    if (!Number.isFinite(price)) {
      return {
        ok: false,
        error: `Factuurregel ${i + 1} heeft een ongeldige prijs.`,
      };
    }
    linePayload.push({ description, amount, price });
  }

  const reference = draft.invoice_number?.trim() || "Helping Hands factuur";

  try {
    const existingId = draft.moneybird_invoice_id?.trim();
    let updatedExisting = Boolean(existingId);
    let invoice;

    if (existingId) {
      try {
        invoice = await updateMoneybirdSalesInvoice(existingId, {
          contactId,
          reference,
          lines: linePayload,
        });
      } catch (error) {
        if (!isMoneybirdNotFoundError(error)) throw error;
        // Verouderd moneybird_invoice_id: maak een nieuw concept i.p.v. te falen.
        logMoneybirdSafe("Bestaand Moneybird-concept ontbreekt, opnieuw aanmaken", {
          draftId: draft.id,
          moneybirdInvoiceId: existingId,
        });
        updatedExisting = false;
        invoice = await createMoneybirdSalesInvoice({
          contactId,
          reference,
          lines: linePayload,
        });
      }
    } else {
      invoice = await createMoneybirdSalesInvoice({
        contactId,
        reference,
        lines: linePayload,
      });
    }

    if (!invoice.id) {
      const partial = contactResolved.created
        ? "Moneybird-contact is wel aangemaakt/gekoppeld, maar "
        : "";
      return {
        ok: false,
        error: `${partial}er kwam geen factuur-id terug van Moneybird.`,
      };
    }

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
            message: updatedExisting
              ? `Concept bijgewerkt in Moneybird (${invoice.invoice_id || invoice.id}). ${contactResolved.message} Voer SQL-migratie uit om sync-status lokaal te bewaren.`
              : `Concept aangemaakt in Moneybird (${invoice.invoice_id || invoice.id}). ${contactResolved.message} Voer SQL-migratie uit om sync-status lokaal te bewaren.`,
          };
        }
        return {
          ok: false,
          error: `Factuur staat in Moneybird (${invoice.id}), maar lokale status opslaan mislukt: ${updateError.message}`,
        };
      }
    } else {
      await supabase
        .from("invoice_drafts")
        .update({ status: "ready" })
        .eq("id", draft.id);
    }

    return {
      ok: true,
      moneybirdInvoiceId: invoice.id,
      moneybirdState: invoice.state,
      sent: false,
      message: updatedExisting
        ? `Conceptfactuur bijgewerkt in Moneybird (${invoice.invoice_id || invoice.id}). ${contactResolved.message} Nog niet verzonden.`
        : `Conceptfactuur aangemaakt in Moneybird (${invoice.invoice_id || invoice.id}). ${contactResolved.message} Nog niet verzonden — gebruik “Bevestig factuur” om te verzenden.`,
    };
  } catch (error) {
    const apiMessage = formatMoneybirdError(error);
    const message =
      contactResolved.created || contactResolved.matchedBy !== "stored"
        ? `Contact ok (${contactResolved.matchedBy}), maar factuur aanmaken mislukt: ${apiMessage}`
        : apiMessage;
    logMoneybirdSafe("pushInvoiceDraftToMoneybird mislukt", {
      draftId: draft.id,
      contactId,
      matchedBy: contactResolved.matchedBy,
      createdContact: contactResolved.created,
      error: apiMessage.slice(0, 240),
    });
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
