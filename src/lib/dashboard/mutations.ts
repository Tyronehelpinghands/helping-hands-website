"use server";

import { revalidatePath } from "next/cache";
import {
  inviteClientToPortal,
  inviteResultMessage,
} from "@/lib/auth/inviteClient";
import { requireRole } from "@/lib/auth/requireRole";
import type { UserRole } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import {
  calculateInvoiceTotals,
  calculateWorkedHours,
} from "@/lib/dashboard/calculations";
import { getRateSettings } from "@/lib/dashboard/queries";
import { OUTDATED_MONEYBIRD_DRAFT_MSG } from "@/lib/dashboard/moneybirdConstants";
import {
  createMoneybirdCreditInvoice,
  deleteMoneybirdSalesInvoice,
  formatMoneybirdError,
  isMoneybirdConfigured,
} from "@/lib/server/moneybird";
import {
  confirmInvoiceDraftInMoneybird,
  isMissingMoneybirdColumnError,
  MONEYBIRD_COLUMNS_SQL_HINT,
  pushInvoiceDraftToMoneybird,
} from "@/lib/dashboard/moneybirdSync";
import {
  calculateCrewHourlyCost,
  getWwTariffForEmploymentType,
  isZzpEmploymentType,
  usesBrutoFactor,
} from "@/lib/dashboard/fooksRates";
import { syncMvpShiftToShiftbase } from "@/lib/dashboard/shiftbaseSync";
import { shouldAutoSyncShiftbase } from "@/lib/shiftbase";
import type {
  ActionResult,
  ClientStatus,
  CrewMemberStatus,
  EmploymentType,
  FooksWwTariff,
  InvoiceDraftStatus,
  LeadStatus,
  MoneybirdSyncStatus,
  ProjectStatus,
  ProjectType,
  ShiftStatus,
  TaskPriority,
  TaskStatus,
  TimeEntryStatus,
  InternalMessageStatus,
} from "@/lib/dashboard/types";

/** Hint when Fooks columns / vast employment_type are missing in Supabase. */
const FOOKS_COLUMNS_SQL_HINT =
  "Voer supabase/crew-fooks-columns.sql uit in Supabase (SQL Editor).";

function isMissingFooksColumnError(message: string): boolean {
  return (
    (/gross_hourly_wage|fooks_ww_tariff/i.test(message) ||
      (/employment_type/i.test(message) && /vast/i.test(message))) &&
    (/column/i.test(message) ||
      /schema cache/i.test(message) ||
      /check constraint/i.test(message) ||
      /violates check/i.test(message) ||
      /does not exist/i.test(message))
  );
}

function resolveCrewCostFields(formData: FormData): {
  employment_type: EmploymentType;
  hourly_cost: number | null;
  gross_hourly_wage: number | null;
  fooks_ww_tariff: FooksWwTariff | null;
} {
  const employment_type =
    (strOrNull(formData.get("employment_type")) as EmploymentType) || "vast";
  const manualOverride = formData.get("manual_hourly_cost") === "on";
  const clientHourly = numOrNull(formData.get("hourly_cost"));
  const bruto = numOrNull(formData.get("gross_hourly_wage"));
  const derivedTariff = getWwTariffForEmploymentType(employment_type);

  if (isZzpEmploymentType(employment_type)) {
    const zzpCost = calculateCrewHourlyCost({ employmentType: employment_type });
    return {
      employment_type,
      hourly_cost: manualOverride && clientHourly != null ? clientHourly : zzpCost,
      gross_hourly_wage: null,
      fooks_ww_tariff: null,
    };
  }

  if (usesBrutoFactor(employment_type)) {
    if (!manualOverride && bruto != null) {
      return {
        employment_type,
        hourly_cost: calculateCrewHourlyCost({
          employmentType: employment_type,
          bruto,
        }),
        gross_hourly_wage: bruto,
        fooks_ww_tariff: derivedTariff,
      };
    }
    return {
      employment_type,
      hourly_cost: clientHourly,
      gross_hourly_wage: bruto,
      fooks_ww_tariff: derivedTariff,
    };
  }

  // other — manual hourly_cost
  return {
    employment_type,
    hourly_cost: clientHourly,
    gross_hourly_wage: null,
    fooks_ww_tariff: null,
  };
}

const ALL_INTERNAL: UserRole[] = [
  "owner",
  "admin",
  "planner",
  "sales",
  "finance",
];

const SALES_ROLES: UserRole[] = ["owner", "admin", "sales"];
const PLANNER_ROLES: UserRole[] = ["owner", "admin", "planner"];
const PROJECT_ROLES: UserRole[] = ["owner", "admin", "planner", "sales"];
const HOURS_ROLES: UserRole[] = ["owner", "admin", "planner", "finance"];
const FINANCE_ROLES: UserRole[] = ["owner", "admin", "finance"];
const SETTINGS_ROLES: UserRole[] = ["owner", "admin"];

function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

function revalidateDashboard(paths: string[] = []) {
  revalidatePath("/dashboard/intern");
  for (const p of paths) revalidatePath(p);
}

function numOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function strOrNull(value: FormDataEntryValue | null): string | null {
  if (value === null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function parseSkills(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ——— Clients ———

function wantsPortalInvite(formData: FormData): boolean {
  const raw = formData.get("invite_portal");
  if (raw === null) return false;
  const value = String(raw).toLowerCase();
  return value === "on" || value === "true" || value === "1";
}

export async function createClientAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; message: string }>> {
  await requireRole(SALES_ROLES);
  const company_name = strOrNull(formData.get("company_name"));
  if (!company_name) return fail("Bedrijfsnaam is verplicht.");

  const contact_name = strOrNull(formData.get("contact_name"));
  const email = strOrNull(formData.get("email"));
  const sendInvite = wantsPortalInvite(formData);

  const supabase = await createClient();
  const insertPayload: Record<string, unknown> = {
    company_name,
    contact_name,
    email,
    phone: strOrNull(formData.get("phone")),
    address: strOrNull(formData.get("address")),
    city: strOrNull(formData.get("city")),
    notes: strOrNull(formData.get("notes")),
    status: (strOrNull(formData.get("status")) as ClientStatus) || "active",
  };
  const moneybirdContactId = strOrNull(formData.get("moneybird_contact_id"));
  if (moneybirdContactId) {
    insertPayload.moneybird_contact_id = moneybirdContactId;
  }

  let { data, error } = await supabase
    .from("clients")
    .insert(insertPayload)
    .select("id")
    .single();

  if (
    error &&
    insertPayload.moneybird_contact_id &&
    isMissingMoneybirdColumnError(error.message)
  ) {
    delete insertPayload.moneybird_contact_id;
    const retry = await supabase
      .from("clients")
      .insert(insertPayload)
      .select("id")
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error || !data) return fail(error?.message ?? "Aanmaken mislukt.");

  let message = "Opdrachtgever aangemaakt.";
  if (sendInvite) {
    const invite = await inviteClientToPortal({
      clientId: data.id,
      email: email ?? "",
      companyName: company_name,
      contactName: contact_name,
    });
    message = inviteResultMessage(invite, email);
  } else if (!email) {
    message = "Opdrachtgever aangemaakt (geen e-mail — geen uitnodiging).";
  } else {
    message = "Opdrachtgever aangemaakt (geen uitnodiging).";
  }

  revalidateDashboard(["/dashboard/intern/sales", "/dashboard/intern/projecten"]);
  return ok({ id: data.id, message });
}

export async function updateClientAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; message: string }>> {
  await requireRole(SALES_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Client-id ontbreekt.");

  const company_name = strOrNull(formData.get("company_name"));
  const contact_name = strOrNull(formData.get("contact_name"));
  const email = strOrNull(formData.get("email"));
  const sendInvite = wantsPortalInvite(formData);

  const supabase = await createClient();
  const updatePayload: Record<string, unknown> = {
    company_name,
    contact_name,
    email,
    phone: strOrNull(formData.get("phone")),
    address: strOrNull(formData.get("address")),
    city: strOrNull(formData.get("city")),
    notes: strOrNull(formData.get("notes")),
    status: strOrNull(formData.get("status")) as ClientStatus,
  };
  if (formData.has("moneybird_contact_id")) {
    updatePayload.moneybird_contact_id = strOrNull(
      formData.get("moneybird_contact_id"),
    );
  }

  const { error } = await supabase
    .from("clients")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    if (isMissingMoneybirdColumnError(error.message)) {
      delete updatePayload.moneybird_contact_id;
      const retry = await supabase
        .from("clients")
        .update(updatePayload)
        .eq("id", id);
      if (retry.error) return fail(retry.error.message);
    } else {
      return fail(error.message);
    }
  }

  let message = "Opdrachtgever bijgewerkt.";
  if (sendInvite) {
    if (!company_name) {
      message =
        "Opdrachtgever bijgewerkt (uitnodiging overgeslagen: bedrijfsnaam ontbreekt).";
    } else {
      const invite = await inviteClientToPortal({
        clientId: id,
        email: email ?? "",
        companyName: company_name,
        contactName: contact_name,
      });
      if (invite.ok && invite.invited) {
        message = invite.existingUser
          ? `Opdrachtgever bijgewerkt. Nieuwe inlog-mail verstuurd naar ${invite.email}.`
          : `Opdrachtgever bijgewerkt. Uitnodiging verstuurd naar ${invite.email}.`;
      } else if (invite.ok) {
        message = `Opdrachtgever bijgewerkt (${inviteResultMessage(invite, email)}).`;
      } else {
        message = `Opdrachtgever bijgewerkt, maar uitnodiging mislukt: ${invite.error}`;
      }
    }
  }

  revalidateDashboard(["/dashboard/intern/sales", "/dashboard/intern/projecten"]);
  return ok({ id, message });
}

export async function inviteClientPortalAction(
  clientId: string,
): Promise<ActionResult<{ id: string; message: string }>> {
  await requireRole(SALES_ROLES);
  if (!clientId.trim()) return fail("Client-id ontbreekt.");

  const supabase = await createClient();
  const { data: client, error } = await supabase
    .from("clients")
    .select("id, company_name, contact_name, email")
    .eq("id", clientId)
    .maybeSingle();

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("profile_id") && msg.includes("does not exist")) {
      return fail(
        "Draai SQL voor clients.profile_id (supabase/clients-profile-id.sql in Supabase SQL Editor).",
      );
    }
    return fail(error.message);
  }
  if (!client) return fail("Opdrachtgever niet gevonden.");
  if (!client.email) {
    return fail("Geen e-mailadres — vul eerst een e-mail in bij de opdrachtgever.");
  }

  const invite = await inviteClientToPortal({
    clientId: client.id,
    email: client.email,
    companyName: client.company_name,
    contactName: client.contact_name,
  });

  if (!invite.ok) return fail(invite.error);
  if (!invite.invited) {
    return fail(
      invite.reason === "missing_config"
        ? "Uitnodiging niet mogelijk: serverconfiguratie incompleet (SUPABASE_SERVICE_ROLE_KEY / RESEND_API_KEY)."
        : "Uitnodiging overgeslagen.",
    );
  }

  revalidateDashboard(["/dashboard/intern/sales"]);
  return ok({
    id: client.id,
    message: invite.existingUser
      ? `Nieuwe inlog-mail verstuurd naar ${invite.email}.`
      : `Uitnodiging verstuurd naar ${invite.email}.`,
  });
}

// ——— Leads ———

export async function createLeadAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(SALES_ROLES);
  const company_name = strOrNull(formData.get("company_name"));
  if (!company_name) return fail("Bedrijfsnaam is verplicht.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      company_name,
      contact_name: strOrNull(formData.get("contact_name")),
      email: strOrNull(formData.get("email")),
      phone: strOrNull(formData.get("phone")),
      source: strOrNull(formData.get("source")),
      status: (strOrNull(formData.get("status")) as LeadStatus) || "new",
      value_estimate: numOrNull(formData.get("value_estimate")),
      next_follow_up: strOrNull(formData.get("next_follow_up")),
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/leads", "/dashboard/intern/sales"]);
  return ok({ id: data.id });
}

export async function updateLeadAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(SALES_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Lead-id ontbreekt.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      company_name: strOrNull(formData.get("company_name")),
      contact_name: strOrNull(formData.get("contact_name")),
      email: strOrNull(formData.get("email")),
      phone: strOrNull(formData.get("phone")),
      source: strOrNull(formData.get("source")),
      status: strOrNull(formData.get("status")) as LeadStatus,
      value_estimate: numOrNull(formData.get("value_estimate")),
      next_follow_up: strOrNull(formData.get("next_follow_up")),
      notes: strOrNull(formData.get("notes")),
    })
    .eq("id", id);

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/leads", "/dashboard/intern/sales"]);
  return ok({ id });
}

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(SALES_ROLES);
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/leads", "/dashboard/intern/sales"]);
  return ok({ id });
}

// ——— Projects ———

export async function createProjectAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PROJECT_ROLES);
  const project_name = strOrNull(formData.get("project_name"));
  if (!project_name) return fail("Projectnaam is verplicht.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      project_name,
      client_id: strOrNull(formData.get("client_id")),
      location: strOrNull(formData.get("location")),
      address: strOrNull(formData.get("address")),
      start_date: strOrNull(formData.get("start_date")),
      end_date: strOrNull(formData.get("end_date")),
      status: (strOrNull(formData.get("status")) as ProjectStatus) || "draft",
      project_type: strOrNull(formData.get("project_type")) as ProjectType | null,
      contact_on_site: strOrNull(formData.get("contact_on_site")),
      briefing: strOrNull(formData.get("briefing")),
      clothing: strOrNull(formData.get("clothing")),
      ppe: strOrNull(formData.get("ppe")),
      certificates_required: strOrNull(formData.get("certificates_required")),
      travel_agreements: strOrNull(formData.get("travel_agreements")),
      default_hourly_rate: numOrNull(formData.get("default_hourly_rate")),
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/projecten", "/dashboard/intern/planning"]);
  return ok({ id: data.id });
}

export async function updateProjectAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PROJECT_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Project-id ontbreekt.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      project_name: strOrNull(formData.get("project_name")),
      client_id: strOrNull(formData.get("client_id")),
      location: strOrNull(formData.get("location")),
      address: strOrNull(formData.get("address")),
      start_date: strOrNull(formData.get("start_date")),
      end_date: strOrNull(formData.get("end_date")),
      status: strOrNull(formData.get("status")) as ProjectStatus,
      project_type: strOrNull(formData.get("project_type")) as ProjectType | null,
      contact_on_site: strOrNull(formData.get("contact_on_site")),
      briefing: strOrNull(formData.get("briefing")),
      clothing: strOrNull(formData.get("clothing")),
      ppe: strOrNull(formData.get("ppe")),
      certificates_required: strOrNull(formData.get("certificates_required")),
      travel_agreements: strOrNull(formData.get("travel_agreements")),
      default_hourly_rate: numOrNull(formData.get("default_hourly_rate")),
      notes: strOrNull(formData.get("notes")),
    })
    .eq("id", id);

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/projecten", "/dashboard/intern/planning"]);
  return ok({ id });
}

// ——— Crew ———

export async function createCrewMemberAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PLANNER_ROLES);
  const full_name = strOrNull(formData.get("full_name"));
  if (!full_name) return fail("Naam is verplicht.");

  const cost = resolveCrewCostFields(formData);
  const supabase = await createClient();
  const insertPayload: Record<string, unknown> = {
    full_name,
    email: strOrNull(formData.get("email")),
    phone: strOrNull(formData.get("phone")),
    city: strOrNull(formData.get("city")),
    employment_type: cost.employment_type,
    role_type: strOrNull(formData.get("role_type")),
    skills: parseSkills(formData.get("skills")),
    certificates: parseSkills(formData.get("certificates")),
    has_drivers_license: formData.get("has_drivers_license") === "on",
    has_car: formData.get("has_car") === "on",
    hourly_cost: cost.hourly_cost,
    gross_hourly_wage: cost.gross_hourly_wage,
    fooks_ww_tariff: cost.fooks_ww_tariff,
    status: (strOrNull(formData.get("status")) as CrewMemberStatus) || "active",
    notes: strOrNull(formData.get("notes")),
  };

  let { data, error } = await supabase
    .from("crew_members")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error && isMissingFooksColumnError(error.message)) {
    delete insertPayload.gross_hourly_wage;
    delete insertPayload.fooks_ww_tariff;
    if (cost.employment_type === "vast") {
      insertPayload.employment_type = "payroll";
    }
    const retry = await supabase
      .from("crew_members")
      .insert(insertPayload)
      .select("id")
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    if (isMissingFooksColumnError(error.message)) {
      return fail(`${error.message} — ${FOOKS_COLUMNS_SQL_HINT}`);
    }
    return fail(error.message);
  }
  revalidateDashboard(["/dashboard/intern/crew", "/dashboard/intern/planning"]);
  return ok({ id: data!.id });
}

export async function updateCrewMemberAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PLANNER_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Crew-id ontbreekt.");

  const cost = resolveCrewCostFields(formData);
  const supabase = await createClient();
  const updatePayload: Record<string, unknown> = {
    full_name: strOrNull(formData.get("full_name")),
    email: strOrNull(formData.get("email")),
    phone: strOrNull(formData.get("phone")),
    city: strOrNull(formData.get("city")),
    employment_type: cost.employment_type,
    role_type: strOrNull(formData.get("role_type")),
    skills: parseSkills(formData.get("skills")),
    certificates: parseSkills(formData.get("certificates")),
    has_drivers_license: formData.get("has_drivers_license") === "on",
    has_car: formData.get("has_car") === "on",
    hourly_cost: cost.hourly_cost,
    gross_hourly_wage: cost.gross_hourly_wage,
    fooks_ww_tariff: cost.fooks_ww_tariff,
    status: strOrNull(formData.get("status")) as CrewMemberStatus,
    notes: strOrNull(formData.get("notes")),
  };

  let { error } = await supabase
    .from("crew_members")
    .update(updatePayload)
    .eq("id", id);

  if (error && isMissingFooksColumnError(error.message)) {
    delete updatePayload.gross_hourly_wage;
    delete updatePayload.fooks_ww_tariff;
    if (cost.employment_type === "vast") {
      updatePayload.employment_type = "payroll";
    }
    const retry = await supabase
      .from("crew_members")
      .update(updatePayload)
      .eq("id", id);
    error = retry.error;
  }

  if (error) {
    if (isMissingFooksColumnError(error.message)) {
      return fail(`${error.message} — ${FOOKS_COLUMNS_SQL_HINT}`);
    }
    return fail(error.message);
  }
  revalidateDashboard(["/dashboard/intern/crew", "/dashboard/intern/planning"]);
  return ok({ id });
}

// ——— Shifts ———

export async function createShiftAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; message?: string }>> {
  await requireRole(PLANNER_ROLES);
  const project_id = strOrNull(formData.get("project_id"));
  const shift_date = strOrNull(formData.get("shift_date"));
  if (!project_id) return fail("Project is verplicht.");
  if (!shift_date) return fail("Datum is verplicht.");

  const crew_member_id = strOrNull(formData.get("crew_member_id"));
  const required_people = numOrNull(formData.get("required_people")) ?? 1;
  const assigned_people = crew_member_id ? Math.max(1, required_people > 0 ? 1 : 0) : 0;
  const status: ShiftStatus = crew_member_id ? "assigned" : "open";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shifts")
    .insert({
      project_id,
      crew_member_id,
      shift_date,
      start_time: strOrNull(formData.get("start_time")),
      end_time: strOrNull(formData.get("end_time")),
      role_name: strOrNull(formData.get("role_name")),
      required_people,
      assigned_people,
      status: (strOrNull(formData.get("status")) as ShiftStatus) || status,
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);

  if (crew_member_id) {
    await upsertShiftAssignment(supabase, data.id, crew_member_id);
    await notifyCrewAssignment(supabase, crew_member_id, data.id, shift_date);
  }

  let message = "Shift aangemaakt.";
  if (shouldAutoSyncShiftbase()) {
    const sync = await syncMvpShiftToShiftbase(data.id);
    if (sync.status === "gesynct") {
      message = "Shift aangemaakt en gesynchroniseerd met Shiftbase.";
    } else if (sync.status === "fout") {
      message = `Shift aangemaakt in Supabase. Shiftbase sync mislukt: ${sync.error ?? sync.message}`;
    }
  }

  revalidateDashboard(["/dashboard/intern/planning", "/dashboard/intern/projecten"]);
  return ok({ id: data.id, message });
}

export async function assignCrewToShiftAction(
  shiftId: string,
  crewMemberId: string | null,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PLANNER_ROLES);
  const supabase = await createClient();

  const { data: existing, error: loadError } = await supabase
    .from("shifts")
    .select("id, shift_date")
    .eq("id", shiftId)
    .maybeSingle();

  if (loadError) return fail(loadError.message);
  if (!existing) return fail("Shift niet gevonden.");

  const { error } = await supabase
    .from("shifts")
    .update({
      crew_member_id: crewMemberId,
      assigned_people: crewMemberId ? 1 : 0,
      status: crewMemberId ? "assigned" : "open",
    })
    .eq("id", shiftId);

  if (error) return fail(error.message);

  if (crewMemberId) {
    await upsertShiftAssignment(supabase, shiftId, crewMemberId);
    await notifyCrewAssignment(
      supabase,
      crewMemberId,
      shiftId,
      existing.shift_date,
    );
  }

  revalidateDashboard(["/dashboard/intern/planning"]);
  return ok({ id: shiftId });
}

async function upsertShiftAssignment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  shiftId: string,
  crewMemberId: string,
) {
  await supabase.from("shift_assignments").upsert(
    {
      shift_id: shiftId,
      crew_member_id: crewMemberId,
      status: "pending",
      responded_at: null,
    },
    { onConflict: "shift_id,crew_member_id" },
  );
}

async function notifyCrewAssignment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  crewMemberId: string,
  shiftId: string,
  shiftDate: string,
) {
  const { data: crew } = await supabase
    .from("crew_members")
    .select("profile_id, full_name")
    .eq("id", crewMemberId)
    .maybeSingle();

  if (!crew?.profile_id) return;

  await supabase.from("app_notifications").insert({
    user_id: crew.profile_id,
    title: "Nieuwe shift toegewezen",
    body: `Je bent ingepland op ${shiftDate}. Bevestig of wijs af in je planning.`,
    category: "planning",
    link: "/portaal/medewerkers/planning",
    meta: { shift_id: shiftId, crew_member_id: crewMemberId },
  });
}

export async function updateShiftStatusAction(
  shiftId: string,
  status: ShiftStatus,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PLANNER_ROLES);
  const supabase = await createClient();
  const { error } = await supabase
    .from("shifts")
    .update({ status })
    .eq("id", shiftId);
  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/planning"]);
  return ok({ id: shiftId });
}

// ——— Time entries ———

export async function createTimeEntryAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(HOURS_ROLES);
  const project_id = strOrNull(formData.get("project_id"));
  const crew_member_id = strOrNull(formData.get("crew_member_id"));
  const work_date = strOrNull(formData.get("work_date"));
  if (!project_id) return fail("Project is verplicht.");
  if (!crew_member_id) return fail("Crewlid is verplicht.");
  if (!work_date) return fail("Datum is verplicht.");

  const start_time = strOrNull(formData.get("start_time"));
  const end_time = strOrNull(formData.get("end_time"));
  const break_minutes = numOrNull(formData.get("break_minutes")) ?? 0;
  const hours =
    numOrNull(formData.get("hours")) ??
    calculateWorkedHours(start_time, end_time, break_minutes);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_entries")
    .insert({
      project_id,
      shift_id: strOrNull(formData.get("shift_id")),
      crew_member_id,
      work_date,
      start_time,
      end_time,
      break_minutes,
      hours,
      kilometers: numOrNull(formData.get("kilometers")) ?? 0,
      travel_time_hours: numOrNull(formData.get("travel_time_hours")) ?? 0,
      status:
        (strOrNull(formData.get("status")) as TimeEntryStatus) || "submitted",
      internal_notes: strOrNull(formData.get("internal_notes")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);
  revalidateDashboard([
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/facturatie",
  ]);
  return ok({ id: data.id });
}

/**
 * Herberekent open factuurconcepten (draft/ready, niet verzonden) voor een project
 * op basis van goedgekeurde + gekoppelde (invoiced) uren. Nooit auto-send naar Moneybird.
 */
async function refreshOpenInvoiceDraftsForProject(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
): Promise<{ refreshedDrafts: number; markedDirty: number; error?: string }> {
  type DraftRow = {
    id: string;
    status: string;
    moneybird_invoice_id?: string | null;
    moneybird_sync_status?: string | null;
  };

  let drafts: DraftRow[] | null = null;
  let persistMoneybirdColumns = true;

  const withMoneybird = await supabase
    .from("invoice_drafts")
    .select("id, status, moneybird_invoice_id, moneybird_sync_status")
    .eq("project_id", projectId)
    .in("status", ["draft", "ready"]);

  if (withMoneybird.error) {
    if (isMissingMoneybirdColumnError(withMoneybird.error.message)) {
      persistMoneybirdColumns = false;
      const fallback = await supabase
        .from("invoice_drafts")
        .select("id, status")
        .eq("project_id", projectId)
        .in("status", ["draft", "ready"]);
      if (fallback.error) {
        return {
          refreshedDrafts: 0,
          markedDirty: 0,
          error: `${MONEYBIRD_COLUMNS_SQL_HINT} (${fallback.error.message})`,
        };
      }
      drafts = fallback.data;
    } else {
      return {
        refreshedDrafts: 0,
        markedDirty: 0,
        error: withMoneybird.error.message,
      };
    }
  } else {
    drafts = withMoneybird.data;
  }

  const openDrafts = (drafts ?? []).filter(
    (d) => d.moneybird_sync_status !== "verzonden",
  );
  if (openDrafts.length === 0) {
    return { refreshedDrafts: 0, markedDirty: 0 };
  }

  const rates = await getRateSettings();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, project_name, default_hourly_rate")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return {
      refreshedDrafts: 0,
      markedDirty: 0,
      error: projectError?.message ?? "Project niet gevonden voor factuurvernieuwing.",
    };
  }

  const { data: entries, error: entriesError } = await supabase
    .from("time_entries")
    .select("*")
    .eq("project_id", projectId)
    .in("status", ["approved", "invoiced"]);

  if (entriesError) {
    return {
      refreshedDrafts: 0,
      markedDirty: 0,
      error: entriesError.message,
    };
  }

  if (!entries || entries.length === 0) {
    // Geen factureerbare uren meer: open concepten annuleren (niet Moneybird-verzonden).
    const cancelIds = openDrafts.map((d) => d.id);
    const { error: cancelError } = await supabase
      .from("invoice_drafts")
      .update({ status: "cancelled" satisfies InvoiceDraftStatus })
      .in("id", cancelIds);
    if (cancelError) {
      return { refreshedDrafts: 0, markedDirty: 0, error: cancelError.message };
    }
    return { refreshedDrafts: cancelIds.length, markedDirty: 0 };
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

  let refreshedDrafts = 0;
  let markedDirty = 0;

  for (const draft of openDrafts) {
    const { error: deleteLinesError } = await supabase
      .from("invoice_draft_lines")
      .delete()
      .eq("invoice_draft_id", draft.id);
    if (deleteLinesError) {
      return {
        refreshedDrafts,
        markedDirty,
        error: deleteLinesError.message,
      };
    }

    const lines = [
      {
        invoice_draft_id: draft.id,
        description: `Arbeidsuren — ${project.project_name}`,
        quantity: totalHours,
        unit_price: hourlyRate,
        vat_rate: rates.vat_percent,
        line_total: totals.laborAmount,
      },
    ];

    if (totals.travelCosts > 0) {
      lines.push({
        invoice_draft_id: draft.id,
        description: `Kilometervergoeding (${totalKm} km × €${rates.km_rate})`,
        quantity: totalKm,
        unit_price: rates.km_rate,
        vat_rate: rates.vat_percent,
        line_total: totals.travelCosts,
      });
    }

    if (totals.travelTimeAmount > 0) {
      lines.push({
        invoice_draft_id: draft.id,
        description: `Reistijd (${totalTravelTime} u)`,
        quantity: totalTravelTime,
        unit_price: hourlyRate,
        vat_rate: rates.vat_percent,
        line_total: totals.travelTimeAmount,
      });
    }

    const { error: linesError } = await supabase
      .from("invoice_draft_lines")
      .insert(lines);
    if (linesError) {
      return { refreshedDrafts, markedDirty, error: linesError.message };
    }

    const hasMoneybirdDraft = Boolean(draft.moneybird_invoice_id?.trim());
    const draftUpdate: Record<string, unknown> = {
      total_hours: totalHours,
      hourly_rate: hourlyRate,
      travel_costs: totals.travelCosts,
      subtotal: totals.subtotal,
      vat_amount: totals.vatAmount,
      total_amount: totals.totalAmount,
      status: "draft" satisfies InvoiceDraftStatus,
    };

    if (persistMoneybirdColumns && hasMoneybirdDraft) {
      draftUpdate.moneybird_sync_status =
        "niet_gesynct" satisfies MoneybirdSyncStatus;
      draftUpdate.moneybird_sync_error = OUTDATED_MONEYBIRD_DRAFT_MSG;
      markedDirty += 1;
    }

    const { error: draftError } = await supabase
      .from("invoice_drafts")
      .update(draftUpdate)
      .eq("id", draft.id);
    if (draftError) {
      if (
        persistMoneybirdColumns &&
        isMissingMoneybirdColumnError(draftError.message)
      ) {
        const { error: fallbackError } = await supabase
          .from("invoice_drafts")
          .update({
            total_hours: totalHours,
            hourly_rate: hourlyRate,
            travel_costs: totals.travelCosts,
            subtotal: totals.subtotal,
            vat_amount: totals.vatAmount,
            total_amount: totals.totalAmount,
            status: "draft" satisfies InvoiceDraftStatus,
          })
          .eq("id", draft.id);
        if (fallbackError) {
          return {
            refreshedDrafts,
            markedDirty,
            error: fallbackError.message,
          };
        }
      } else {
        return { refreshedDrafts, markedDirty, error: draftError.message };
      }
    }

    refreshedDrafts += 1;
  }

  const entryIds = entries.map((e) => e.id);
  const { error: markError } = await supabase
    .from("time_entries")
    .update({ status: "invoiced" satisfies TimeEntryStatus })
    .in("id", entryIds);
  if (markError) {
    return { refreshedDrafts, markedDirty, error: markError.message };
  }

  return { refreshedDrafts, markedDirty };
}

export async function updateTimeEntryAction(
  formData: FormData,
): Promise<
  ActionResult<{
    id: string;
    draftRefreshed?: number;
    markedDirty?: number;
  }>
> {
  const profile = await requireRole(HOURS_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Urenregel-id ontbreekt.");

  const project_id = strOrNull(formData.get("project_id"));
  const crew_member_id = strOrNull(formData.get("crew_member_id"));
  const work_date = strOrNull(formData.get("work_date"));
  if (!project_id) return fail("Project is verplicht.");
  if (!crew_member_id) return fail("Crewlid is verplicht.");
  if (!work_date) return fail("Datum is verplicht.");

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("time_entries")
    .select("id, status, project_id")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return fail(existingError?.message ?? "Urenregel niet gevonden.");
  }

  const isInvoiced = existing.status === "invoiced";
  const wasApproved = existing.status === "approved";
  const canOverrideInvoiced = FINANCE_ROLES.includes(profile.role);
  if (isInvoiced && !canOverrideInvoiced) {
    return fail(
      "Deze registratie is gefactureerd. Alleen owner/admin/finance kan aanpassen (ontkoppelt van factuurconcept).",
    );
  }

  const start_time = strOrNull(formData.get("start_time"));
  const end_time = strOrNull(formData.get("end_time"));
  const break_minutes = numOrNull(formData.get("break_minutes")) ?? 0;
  const hours =
    numOrNull(formData.get("hours")) ??
    calculateWorkedHours(start_time, end_time, break_minutes);

  const updatePayload: Record<string, unknown> = {
    project_id,
    crew_member_id,
    work_date,
    start_time,
    end_time,
    break_minutes,
    hours,
    kilometers: numOrNull(formData.get("kilometers")) ?? 0,
    travel_time_hours: numOrNull(formData.get("travel_time_hours")) ?? 0,
    internal_notes: strOrNull(formData.get("internal_notes")),
  };

  if (isInvoiced) {
    // Terug naar goedgekeurd; open concepten worden hierna herberekend (geen auto-send).
    updatePayload.status = "approved" satisfies TimeEntryStatus;
  }

  const { error } = await supabase
    .from("time_entries")
    .update(updatePayload)
    .eq("id", id);

  if (error) return fail(error.message);

  let draftRefreshed = 0;
  let markedDirty = 0;
  const shouldRefreshDrafts = isInvoiced || wasApproved;
  if (shouldRefreshDrafts) {
    // Vernieuw voor nieuw project én oud project bij verplaatsing.
    const projectIds = Array.from(
      new Set(
        [project_id, existing.project_id].filter(
          (value): value is string => Boolean(value),
        ),
      ),
    );
    for (const pid of projectIds) {
      const refresh = await refreshOpenInvoiceDraftsForProject(supabase, pid);
      if (refresh.error) return fail(refresh.error);
      draftRefreshed += refresh.refreshedDrafts;
      markedDirty += refresh.markedDirty;
    }
  }

  revalidateDashboard([
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/facturatie",
    "/dashboard/intern/financien",
  ]);
  return ok({ id, draftRefreshed, markedDirty });
}

export async function approveTimeEntryAction(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(HOURS_ROLES);
  const supabase = await createClient();
  const { error } = await supabase
    .from("time_entries")
    .update({ status: "approved", correction_reason: null })
    .eq("id", id);
  if (error) return fail(error.message);
  revalidateDashboard([
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/facturatie",
  ]);
  return ok({ id });
}

export async function rejectTimeEntryAction(
  id: string,
  reason: string,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(HOURS_ROLES);
  if (!reason.trim()) return fail("Correctiereden is verplicht bij afkeuren.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("time_entries")
    .update({ status: "rejected", correction_reason: reason.trim() })
    .eq("id", id);
  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/urenregistratie"]);
  return ok({ id });
}

// ——— Invoices ———

async function createInvoiceDraftFromHoursForProject(
  formData: FormData,
  entryStatus: Extract<TimeEntryStatus, "approved" | "invoiced">,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(FINANCE_ROLES);
  const project_id = strOrNull(formData.get("project_id"));
  if (!project_id) return fail("Project is verplicht.");

  const supabase = await createClient();
  const rates = await getRateSettings();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, client_id, project_name, default_hourly_rate")
    .eq("id", project_id)
    .single();

  if (projectError || !project) {
    return fail(projectError?.message ?? "Project niet gevonden.");
  }

  const { data: entries, error: entriesError } = await supabase
    .from("time_entries")
    .select("*")
    .eq("project_id", project_id)
    .eq("status", entryStatus);

  if (entriesError) return fail(entriesError.message);
  if (!entries || entries.length === 0) {
    return fail(
      entryStatus === "approved"
        ? "Geen goedgekeurde uren voor dit project."
        : "Geen gefactureerde uren zonder concept voor dit project.",
    );
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

  const invoiceNumber = `HH-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

  const { data: draft, error: draftError } = await supabase
    .from("invoice_drafts")
    .insert({
      client_id: project.client_id,
      project_id,
      invoice_number: invoiceNumber,
      status: "draft" as InvoiceDraftStatus,
      total_hours: totalHours,
      hourly_rate: hourlyRate,
      travel_costs: totals.travelCosts,
      subtotal: totals.subtotal,
      vat_amount: totals.vatAmount,
      total_amount: totals.totalAmount,
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (draftError || !draft) {
    return fail(draftError?.message ?? "Factuurconcept aanmaken mislukt.");
  }

  const lines = [
    {
      invoice_draft_id: draft.id,
      description: `Arbeidsuren — ${project.project_name}`,
      quantity: totalHours,
      unit_price: hourlyRate,
      vat_rate: rates.vat_percent,
      line_total: totals.laborAmount,
    },
  ];

  if (totals.travelCosts > 0) {
    lines.push({
      invoice_draft_id: draft.id,
      description: `Kilometervergoeding (${totalKm} km × €${rates.km_rate})`,
      quantity: totalKm,
      unit_price: rates.km_rate,
      vat_rate: rates.vat_percent,
      line_total: totals.travelCosts,
    });
  }

  if (totals.travelTimeAmount > 0) {
    lines.push({
      invoice_draft_id: draft.id,
      description: `Reistijd (${totalTravelTime} u)`,
      quantity: totalTravelTime,
      unit_price: hourlyRate,
      vat_rate: rates.vat_percent,
      line_total: totals.travelTimeAmount,
    });
  }

  const { error: linesError } = await supabase
    .from("invoice_draft_lines")
    .insert(lines);
  if (linesError) {
    await supabase.from("invoice_drafts").delete().eq("id", draft.id);
    return fail(linesError.message);
  }

  // Alleen markeren als we van goedgekeurd komen; orphans zijn al invoiced.
  if (entryStatus === "approved") {
    const entryIds = entries.map((e) => e.id);
    const { error: markError } = await supabase
      .from("time_entries")
      .update({ status: "invoiced" })
      .in("id", entryIds);
    if (markError) {
      await supabase.from("invoice_drafts").delete().eq("id", draft.id);
      return fail(markError.message);
    }
  }

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
  ]);
  return ok({ id: draft.id });
}

export async function createInvoiceDraftFromApprovedHoursAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  return createInvoiceDraftFromHoursForProject(formData, "approved");
}

/** Herstel: maak concept van gefactureerde uren zonder actief concept. */
export async function createInvoiceDraftFromInvoicedHoursAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  return createInvoiceDraftFromHoursForProject(formData, "invoiced");
}

/**
 * Zet gefactureerde uren terug naar goedgekeurd (owner/admin/finance),
 * zodat Facturatie ze opnieuw kan oppakken.
 */
export async function resetInvoicedTimeEntriesToApprovedAction(
  entryIds: string[],
): Promise<ActionResult<{ count: number }>> {
  await requireRole(FINANCE_ROLES);
  const ids = entryIds.map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) return fail("Geen urenregels geselecteerd.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_entries")
    .update({ status: "approved" satisfies TimeEntryStatus })
    .in("id", ids)
    .eq("status", "invoiced")
    .select("id");

  if (error) return fail(error.message);
  const count = data?.length ?? 0;
  if (count === 0) {
    return fail("Geen gefactureerde uren gevonden om terug te zetten.");
  }

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
  ]);
  return ok({ count });
}

export async function updateInvoiceDraftStatusAction(
  id: string,
  status: InvoiceDraftStatus,
): Promise<ActionResult<{ id: string; resetEntries?: number }>> {
  await requireRole(FINANCE_ROLES);
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("invoice_drafts")
    .select("id, project_id, status")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return fail(existingError?.message ?? "Factuurconcept niet gevonden.");
  }

  const { error } = await supabase
    .from("invoice_drafts")
    .update({ status })
    .eq("id", id);
  if (error) return fail(error.message);

  let resetEntries = 0;
  // Annuleren zonder Moneybird-link: uren weer factureerbaar maken als er
  // geen ander actief concept meer is voor dit project.
  if (status === "cancelled" && existing.project_id) {
    const { data: siblings } = await supabase
      .from("invoice_drafts")
      .select("id")
      .eq("project_id", existing.project_id)
      .neq("id", id)
      .in("status", ["draft", "ready", "sent", "paid"]);

    if (!siblings || siblings.length === 0) {
      const { data: resetRows, error: resetError } = await supabase
        .from("time_entries")
        .update({ status: "approved" satisfies TimeEntryStatus })
        .eq("project_id", existing.project_id)
        .eq("status", "invoiced")
        .select("id");
      if (resetError) return fail(resetError.message);
      resetEntries = resetRows?.length ?? 0;
    }
  }

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
  ]);
  return ok({ id, resetEntries });
}

const GECREDITEERD_SQL_HINT =
  "Voer supabase/invoice-draft-status-gecrediteerd.sql uit in Supabase (SQL Editor) om status ‘gecrediteerd’ toe te voegen.";

function isMissingGecrediteerdStatusError(message: string): boolean {
  return (
    /gecrediteerd/i.test(message) ||
    (/check constraint|violates check/i.test(message) &&
      /invoice_drafts/i.test(message) &&
      /status/i.test(message))
  );
}

function isDeletableInvoiceDraft(draft: {
  status: string;
  moneybird_sync_status?: string | null;
}): boolean {
  if (
    draft.status === "sent" ||
    draft.status === "paid" ||
    draft.status === "cancelled" ||
    draft.status === "gecrediteerd"
  ) {
    return false;
  }
  if (draft.moneybird_sync_status === "verzonden") return false;
  return draft.status === "draft" || draft.status === "ready";
}

function isCreditableInvoiceDraft(draft: {
  status: string;
  moneybird_sync_status?: string | null;
}): boolean {
  if (draft.status === "cancelled" || draft.status === "gecrediteerd") {
    return false;
  }
  return (
    draft.status === "sent" ||
    draft.status === "paid" ||
    draft.moneybird_sync_status === "verzonden"
  );
}

/**
 * Verwijdert een lokaal factuurconcept (niet verzonden / niet Moneybird-verzonden).
 * Zet gekoppelde uren terug naar goedgekeurd zodat ze opnieuw gefactureerd kunnen worden.
 * Finance/owner/admin only. Verzendt nooit.
 */
export async function deleteInvoiceDraftAction(
  draftId: string,
): Promise<
  ActionResult<{ id: string; resetEntries: number; message: string }>
> {
  await requireRole(FINANCE_ROLES);
  const id = draftId.trim();
  if (!id) return fail("Factuurconcept-id ontbreekt.");

  const supabase = await createClient();

  let draft: {
    id: string;
    project_id: string | null;
    status: string;
    moneybird_invoice_id?: string | null;
    moneybird_sync_status?: string | null;
  } | null = null;
  let persistMoneybirdColumns = true;

  const withMoneybird = await supabase
    .from("invoice_drafts")
    .select("id, project_id, status, moneybird_invoice_id, moneybird_sync_status")
    .eq("id", id)
    .maybeSingle();

  if (withMoneybird.error) {
    if (isMissingMoneybirdColumnError(withMoneybird.error.message)) {
      persistMoneybirdColumns = false;
      const fallback = await supabase
        .from("invoice_drafts")
        .select("id, project_id, status")
        .eq("id", id)
        .maybeSingle();
      if (fallback.error || !fallback.data) {
        return fail(
          fallback.error?.message ?? "Factuurconcept niet gevonden.",
        );
      }
      draft = fallback.data;
    } else {
      return fail(withMoneybird.error.message);
    }
  } else {
    draft = withMoneybird.data;
  }

  if (!draft) return fail("Factuurconcept niet gevonden.");

  if (!isDeletableInvoiceDraft(draft)) {
    return fail(
      "Alleen niet-verzonden concepten kunnen worden verwijderd. Gebruik Crediteren voor verzonden facturen.",
    );
  }

  // Optioneel Moneybird-concept verwijderen (nooit verzonden facturen).
  const moneybirdId = draft.moneybird_invoice_id?.trim();
  if (
    persistMoneybirdColumns &&
    moneybirdId &&
    isMoneybirdConfigured() &&
    draft.moneybird_sync_status !== "verzonden"
  ) {
    try {
      await deleteMoneybirdSalesInvoice(moneybirdId);
    } catch (error) {
      // Lokaal toch doorzetten: concept mag verdwijnen; Moneybird-fout melden.
      const mbError = formatMoneybirdError(error);
      // Soft-fail alleen als Moneybird het concept niet meer heeft / al weg is.
      if (!/not found|404|bestaat niet/i.test(mbError)) {
        return fail(
          `Moneybird-concept kon niet worden verwijderd: ${mbError}. Concept blijft staan.`,
        );
      }
    }
  }

  const projectId = draft.project_id;

  const { error: deleteError } = await supabase
    .from("invoice_drafts")
    .delete()
    .eq("id", id);
  if (deleteError) return fail(deleteError.message);

  let resetEntries = 0;
  if (projectId) {
    const { data: siblings } = await supabase
      .from("invoice_drafts")
      .select("id")
      .eq("project_id", projectId)
      .in("status", ["draft", "ready", "sent", "paid"]);

    if (!siblings || siblings.length === 0) {
      const { data: resetRows, error: resetError } = await supabase
        .from("time_entries")
        .update({ status: "approved" satisfies TimeEntryStatus })
        .eq("project_id", projectId)
        .eq("status", "invoiced")
        .select("id");
      if (resetError) return fail(resetError.message);
      resetEntries = resetRows?.length ?? 0;
    }
  }

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
  ]);

  return ok({
    id,
    resetEntries,
    message:
      resetEntries > 0
        ? `Concept verwijderd. ${resetEntries} urenregel(s) weer goedgekeurd.`
        : "Concept verwijderd.",
  });
}

/**
 * Crediteert een verzonden/bevestigde factuur.
 * Prefer Moneybird duplicate_creditinvoice (alleen concept, nooit auto-send).
 * Markeert origineel als gecrediteerd; uren blijven gefactureerd (geen dubbele factuur).
 * Finance/owner/admin only.
 */
export async function creditInvoiceDraftAction(
  draftId: string,
): Promise<
  ActionResult<{
    id: string;
    creditDraftId?: string;
    moneybirdCreditId?: string;
    message: string;
  }>
> {
  await requireRole(FINANCE_ROLES);
  const id = draftId.trim();
  if (!id) return fail("Factuurconcept-id ontbreekt.");

  const supabase = await createClient();

  let draft: {
    id: string;
    client_id: string | null;
    project_id: string | null;
    invoice_number: string | null;
    status: string;
    total_hours: number;
    hourly_rate: number | null;
    travel_costs: number;
    subtotal: number;
    vat_amount: number;
    total_amount: number;
    notes: string | null;
    moneybird_invoice_id?: string | null;
    moneybird_sync_status?: string | null;
  } | null = null;
  let persistMoneybirdColumns = true;

  const withMoneybird = await supabase
    .from("invoice_drafts")
    .select(
      "id, client_id, project_id, invoice_number, status, total_hours, hourly_rate, travel_costs, subtotal, vat_amount, total_amount, notes, moneybird_invoice_id, moneybird_sync_status",
    )
    .eq("id", id)
    .maybeSingle();

  if (withMoneybird.error) {
    if (isMissingMoneybirdColumnError(withMoneybird.error.message)) {
      persistMoneybirdColumns = false;
      const fallback = await supabase
        .from("invoice_drafts")
        .select(
          "id, client_id, project_id, invoice_number, status, total_hours, hourly_rate, travel_costs, subtotal, vat_amount, total_amount, notes",
        )
        .eq("id", id)
        .maybeSingle();
      if (fallback.error || !fallback.data) {
        return fail(
          fallback.error?.message ?? "Factuurconcept niet gevonden.",
        );
      }
      draft = fallback.data;
    } else {
      return fail(withMoneybird.error.message);
    }
  } else {
    draft = withMoneybird.data;
  }

  if (!draft) return fail("Factuurconcept niet gevonden.");

  if (!isCreditableInvoiceDraft(draft)) {
    return fail(
      "Alleen verzonden of Moneybird-bevestigde facturen kunnen worden gecrediteerd. Gebruik Verwijderen voor concepten.",
    );
  }

  let moneybirdCreditId: string | undefined;
  let moneybirdNote: string | null = null;

  const moneybirdId = draft.moneybird_invoice_id?.trim();
  if (persistMoneybirdColumns && moneybirdId && isMoneybirdConfigured()) {
    try {
      const credit = await createMoneybirdCreditInvoice(moneybirdId);
      moneybirdCreditId = credit.id;
      moneybirdNote = `Moneybird-creditconcept aangemaakt (${credit.invoice_id || credit.id}). Nog niet verzonden — rond af in Moneybird indien nodig.`;
    } catch (error) {
      moneybirdNote = `Moneybird-credit mislukt (${formatMoneybirdError(error)}). Rond de creditnota af in Moneybird.`;
    }
  } else if (moneybirdId && !isMoneybirdConfigured()) {
    moneybirdNote =
      "Moneybird niet gekoppeld. Factuur lokaal als gecrediteerd gemarkeerd — maak de creditnota af in Moneybird.";
  } else if (!moneybirdId) {
    moneybirdNote =
      "Geen Moneybird-koppeling op deze factuur. Lokaal als gecrediteerd gemarkeerd.";
  }

  const { error: markError } = await supabase
    .from("invoice_drafts")
    .update({ status: "gecrediteerd" satisfies InvoiceDraftStatus })
    .eq("id", id);

  if (markError) {
    if (isMissingGecrediteerdStatusError(markError.message)) {
      return fail(GECREDITEERD_SQL_HINT);
    }
    return fail(markError.message);
  }

  // Lokaal credit-concept (negatieve bedragen) — uren blijven `invoiced` (geen dubbele factuur).
  const creditNumber = `CN-${draft.invoice_number || id.slice(0, 8)}`;
  const creditInsert: Record<string, unknown> = {
    client_id: draft.client_id,
    project_id: draft.project_id,
    invoice_number: creditNumber,
    status: "draft" satisfies InvoiceDraftStatus,
    total_hours: -Math.abs(Number(draft.total_hours || 0)),
    hourly_rate: draft.hourly_rate,
    travel_costs: -Math.abs(Number(draft.travel_costs || 0)),
    subtotal: -Math.abs(Number(draft.subtotal || 0)),
    vat_amount: -Math.abs(Number(draft.vat_amount || 0)),
    total_amount: -Math.abs(Number(draft.total_amount || 0)),
    notes: [
      `Creditnota voor ${draft.invoice_number || draft.id}`,
      moneybirdNote,
    ]
      .filter(Boolean)
      .join(" — "),
  };

  if (persistMoneybirdColumns && moneybirdCreditId) {
    creditInsert.moneybird_invoice_id = moneybirdCreditId;
    creditInsert.moneybird_sync_status = "concept" satisfies MoneybirdSyncStatus;
    creditInsert.moneybird_synced_at = new Date().toISOString();
    creditInsert.moneybird_sync_error = null;
  }

  const { data: creditDraft, error: creditError } = await supabase
    .from("invoice_drafts")
    .insert(creditInsert)
    .select("id")
    .single();

  if (creditError || !creditDraft) {
    // Origineel is al gecrediteerd; credit-rij mislukt — toch bruikbare melding.
    revalidateDashboard([
      "/dashboard/intern/facturatie",
      "/dashboard/intern/financien",
    ]);
    return ok({
      id,
      moneybirdCreditId,
      message: [
        "Factuur gemarkeerd als gecrediteerd.",
        moneybirdNote,
        creditError
          ? `Lokaal creditconcept aanmaken mislukt: ${creditError.message}`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  const { data: originalLines } = await supabase
    .from("invoice_draft_lines")
    .select("description, quantity, unit_price, vat_rate, line_total")
    .eq("invoice_draft_id", id);

  if (originalLines && originalLines.length > 0) {
    await supabase.from("invoice_draft_lines").insert(
      originalLines.map((line) => ({
        invoice_draft_id: creditDraft.id,
        description: `Credit: ${line.description}`,
        quantity:
          line.quantity != null ? -Math.abs(Number(line.quantity)) : null,
        unit_price: line.unit_price,
        vat_rate: line.vat_rate,
        line_total:
          line.line_total != null ? -Math.abs(Number(line.line_total)) : null,
      })),
    );
  } else {
    await supabase.from("invoice_draft_lines").insert({
      invoice_draft_id: creditDraft.id,
      description: `Creditnota voor ${draft.invoice_number || draft.id}`,
      quantity: 1,
      unit_price: -Math.abs(Number(draft.subtotal || 0)),
      vat_rate: 21,
      line_total: -Math.abs(Number(draft.subtotal || 0)),
    });
  }

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
    "/dashboard/intern/integraties",
  ]);

  return ok({
    id,
    creditDraftId: creditDraft.id,
    moneybirdCreditId,
    message: moneybirdCreditId
      ? `Creditnota aangemaakt (Moneybird-concept ${moneybirdCreditId.slice(0, 8)}…). Niet automatisch verzonden. Uren blijven gefactureerd.`
      : `${moneybirdNote ?? "Factuur gecrediteerd."} Uren blijven gefactureerd (geen dubbele factuur).`,
  });
}

/**
 * Maakt/werkt een Moneybird-concept bij vanuit een Supabase-concept.
 * Verzendt nooit — gebruik confirmInvoiceDraftInMoneybirdAction.
 * Vereist finance/owner/admin + Moneybird env.
 */
export async function pushInvoiceDraftToMoneybirdAction(
  draftId: string,
  contactId: string,
  send = false,
): Promise<
  ActionResult<{
    moneybirdInvoiceId: string;
    sent: boolean;
    message: string;
  }>
> {
  await requireRole(FINANCE_ROLES);
  if (!draftId.trim()) return fail("Factuurconcept-id ontbreekt.");
  if (send) {
    return fail(
      "Verzenden kan niet via sync. Gebruik “Bevestig factuur” na het Moneybird-concept.",
    );
  }

  const result = await pushInvoiceDraftToMoneybird({
    draftId: draftId.trim(),
    contactId,
    send: false,
  });

  if (!result.ok) return fail(result.error);

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/financien",
    "/dashboard/intern/integraties",
  ]);

  return ok({
    moneybirdInvoiceId: result.moneybirdInvoiceId,
    sent: result.sent,
    message: result.message,
  });
}

/**
 * Bevestigt/verzendt een factuur in Moneybird (expliciete stap, finance/owner/admin).
 */
export async function confirmInvoiceDraftInMoneybirdAction(
  draftId: string,
): Promise<
  ActionResult<{
    moneybirdInvoiceId: string;
    sent: boolean;
    message: string;
  }>
> {
  await requireRole(FINANCE_ROLES);
  if (!draftId.trim()) return fail("Factuurconcept-id ontbreekt.");

  const result = await confirmInvoiceDraftInMoneybird({
    draftId: draftId.trim(),
  });

  if (!result.ok) return fail(result.error);

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/financien",
    "/dashboard/intern/integraties",
  ]);

  return ok({
    moneybirdInvoiceId: result.moneybirdInvoiceId,
    sent: result.sent,
    message: result.message,
  });
}

// ——— Tasks ———

export async function createTaskAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(ALL_INTERNAL);
  const title = strOrNull(formData.get("title"));
  if (!title) return fail("Titel is verplicht.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description: strOrNull(formData.get("description")),
      linked_type: strOrNull(formData.get("linked_type")),
      linked_id: strOrNull(formData.get("linked_id")),
      priority: (strOrNull(formData.get("priority")) as TaskPriority) || "normal",
      status: (strOrNull(formData.get("status")) as TaskStatus) || "open",
      due_date: strOrNull(formData.get("due_date")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/risico-acties", "/dashboard/intern/risico"]);
  return ok({ id: data.id });
}

export async function updateTaskStatusAction(
  id: string,
  status: TaskStatus,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(ALL_INTERNAL);
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/risico-acties", "/dashboard/intern/risico"]);
  return ok({ id });
}

// ——— Messages ———

export async function saveInternalMessageDraftAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(ALL_INTERNAL);
  const id = strOrNull(formData.get("id"));
  const payload = {
    message_type: strOrNull(formData.get("message_type")) || "other",
    recipient_name: strOrNull(formData.get("recipient_name")),
    recipient_email: strOrNull(formData.get("recipient_email")),
    recipient_phone: strOrNull(formData.get("recipient_phone")),
    subject: strOrNull(formData.get("subject")),
    body: strOrNull(formData.get("body")),
    status:
      (strOrNull(formData.get("status")) as InternalMessageStatus) || "draft",
  };

  const supabase = await createClient();
  if (id) {
    const { error } = await supabase
      .from("internal_messages")
      .update(payload)
      .eq("id", id);
    if (error) return fail(error.message);
    revalidateDashboard(["/dashboard/intern/berichten"]);
    return ok({ id });
  }

  const { data, error } = await supabase
    .from("internal_messages")
    .insert(payload)
    .select("id")
    .single();
  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/berichten"]);
  return ok({ id: data.id });
}

// ——— Settings ———

export async function updateCompanySettingAction(
  key: string,
  value: Record<string, unknown>,
): Promise<ActionResult<{ key: string }>> {
  await requireRole(SETTINGS_ROLES);
  if (!key.trim()) return fail("Setting-key ontbreekt.");

  const supabase = await createClient();
  const { error } = await supabase.from("company_settings").upsert(
    {
      key: key.trim(),
      value,
    },
    { onConflict: "key" },
  );

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/instellingen"]);
  return ok({ key });
}

export async function saveRatesSettingsAction(
  formData: FormData,
): Promise<ActionResult<{ key: string }>> {
  return updateCompanySettingAction("rates", {
    km_rate: numOrNull(formData.get("km_rate")) ?? 0.25,
    vat_percent: numOrNull(formData.get("vat_percent")) ?? 21,
    site_crew: numOrNull(formData.get("site_crew")) ?? 31.5,
    horeca_allround: numOrNull(formData.get("horeca_allround")) ?? 31.5,
    keukenhulp: numOrNull(formData.get("keukenhulp")) ?? 32.5,
    zelfstandig_kok: numOrNull(formData.get("zelfstandig_kok")) ?? 40,
    teamcaptain: numOrNull(formData.get("teamcaptain")) ?? 42.5,
  });
}

export async function saveCompanyInfoAction(
  formData: FormData,
): Promise<ActionResult<{ key: string }>> {
  return updateCompanySettingAction("company", {
    company_name: strOrNull(formData.get("company_name")) || "Helping Hands Agency",
    address: strOrNull(formData.get("address")) || "",
    postal_code: strOrNull(formData.get("postal_code")) || "",
    city: strOrNull(formData.get("city")) || "",
    phone: strOrNull(formData.get("phone")) || "",
    website: strOrNull(formData.get("website")) || "",
  });
}

export async function saveEmailSettingsAction(
  formData: FormData,
): Promise<ActionResult<{ key: string }>> {
  return updateCompanySettingAction("emails", {
    planning:
      strOrNull(formData.get("planning")) || "planning@helpinghandsagency.nl",
    aanmeldingen:
      strOrNull(formData.get("aanmeldingen")) ||
      "aanmeldingen@helpinghandsagency.nl",
    info: strOrNull(formData.get("info")) || "info@helpinghandsagency.nl",
  });
}
