import { calculateInvoiceTotals } from "@/lib/dashboard/calculations";
import {
  buildInvoiceDraftLinesFromEntries,
  type BuiltInvoiceDraftLine,
} from "@/lib/dashboard/invoiceLineBuilder";
import { getRateSettings } from "@/lib/dashboard/queries";
import type { ProjectType } from "@/lib/dashboard/types";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type RegenerateDraftLinesResult =
  | { ok: true; regenerated: true; lines: BuiltInvoiceDraftLine[] }
  | { ok: true; regenerated: false; reason: string }
  | { ok: false; error: string };

/**
 * Herbouwt `invoice_draft_lines` voor één concept uit goedgekeurde/gefactureerde
 * uren van het project — met weeknummer + Nederlandse datum in de omschrijving.
 *
 * Gebruikt vóór Moneybird-sync zodat oude concepten (zonder week/datum) ook
 * bijgewerkt worden bij “Vernieuw Moneybird”, niet alleen bij nieuw aanmaken.
 */
export async function regenerateInvoiceDraftLinesFromHours(
  supabase: SupabaseServerClient,
  draftId: string,
): Promise<RegenerateDraftLinesResult> {
  const id = draftId.trim();
  if (!id) return { ok: false, error: "Factuurconcept-id ontbreekt." };

  const { data: draft, error: draftError } = await supabase
    .from("invoice_drafts")
    .select("id, project_id, status, moneybird_sync_status")
    .eq("id", id)
    .maybeSingle();

  if (draftError) return { ok: false, error: draftError.message };
  if (!draft) return { ok: false, error: "Factuurconcept niet gevonden." };

  if (
    draft.moneybird_sync_status === "verzonden" ||
    draft.status === "sent" ||
    draft.status === "paid" ||
    draft.status === "cancelled" ||
    draft.status === "gecrediteerd"
  ) {
    return {
      ok: true,
      regenerated: false,
      reason: "Concept is vergrendeld en wordt niet herberekend.",
    };
  }

  const projectId = draft.project_id?.trim();
  if (!projectId) {
    return {
      ok: true,
      regenerated: false,
      reason: "Geen project gekoppeld; bestaande omschrijvingen blijven staan.",
    };
  }

  const rates = await getRateSettings();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, default_hourly_rate, project_type")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return {
      ok: false,
      error:
        projectError?.message ??
        "Project niet gevonden voor herberekening van factuurregels.",
    };
  }

  const { data: entries, error: entriesError } = await supabase
    .from("time_entries")
    .select("work_date, hours, kilometers, travel_time_hours")
    .eq("project_id", projectId)
    .in("status", ["approved", "invoiced"]);

  if (entriesError) return { ok: false, error: entriesError.message };

  if (!entries || entries.length === 0) {
    return {
      ok: true,
      regenerated: false,
      reason: "Geen factureerbare uren; bestaande regels blijven staan.",
    };
  }

  const hourlyRate =
    Number(project.default_hourly_rate) || rates.site_crew || 31.5;
  const totalHours = entries.reduce((s, e) => s + Number(e.hours || 0), 0);
  const totalKm = entries.reduce((s, e) => s + Number(e.kilometers || 0), 0);
  const totalTravelTime = entries.reduce(
    (s, e) => s + Number(e.travel_time_hours || 0),
    0,
  );

  const totals = calculateInvoiceTotals({
    hours: totalHours,
    hourlyRate,
    kilometers: totalKm,
    kmRate: rates.km_rate,
    travelTimeHours: totalTravelTime,
    travelTimeRate: hourlyRate,
    vatPercent: rates.vat_percent,
  });

  const lines = buildInvoiceDraftLinesFromEntries({
    invoiceDraftId: draft.id,
    entries,
    projectType: project.project_type as ProjectType | null,
    hourlyRate,
    kmRate: rates.km_rate,
    vatPercent: rates.vat_percent,
  });

  if (lines.length === 0) {
    return {
      ok: true,
      regenerated: false,
      reason: "Geen factuurregels uit uren; bestaande regels blijven staan.",
    };
  }

  const { error: deleteLinesError } = await supabase
    .from("invoice_draft_lines")
    .delete()
    .eq("invoice_draft_id", draft.id);
  if (deleteLinesError) return { ok: false, error: deleteLinesError.message };

  const { error: linesError } = await supabase
    .from("invoice_draft_lines")
    .insert(lines);
  if (linesError) return { ok: false, error: linesError.message };

  const { error: updateError } = await supabase
    .from("invoice_drafts")
    .update({
      total_hours: totalHours,
      hourly_rate: hourlyRate,
      travel_costs: totals.travelCosts,
      subtotal: totals.subtotal,
      vat_amount: totals.vatAmount,
      total_amount: totals.totalAmount,
    })
    .eq("id", draft.id);
  if (updateError) return { ok: false, error: updateError.message };

  return { ok: true, regenerated: true, lines };
}
