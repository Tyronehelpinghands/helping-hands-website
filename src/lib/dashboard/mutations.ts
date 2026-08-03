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
import { pushInvoiceDraftToMoneybird } from "@/lib/dashboard/moneybirdSync";
import { syncMvpShiftToShiftbase } from "@/lib/dashboard/shiftbaseSync";
import { shouldAutoSyncShiftbase } from "@/lib/shiftbase";
import type {
  ActionResult,
  ClientStatus,
  CrewMemberStatus,
  EmploymentType,
  InvoiceDraftStatus,
  LeadStatus,
  ProjectStatus,
  ProjectType,
  ShiftStatus,
  TaskPriority,
  TaskStatus,
  TimeEntryStatus,
  InternalMessageStatus,
} from "@/lib/dashboard/types";

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
    /moneybird_contact_id/i.test(error.message) &&
    (/column/i.test(error.message) || /schema cache/i.test(error.message))
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
    if (
      /moneybird_contact_id/i.test(error.message) &&
      (/column/i.test(error.message) || /schema cache/i.test(error.message))
    ) {
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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crew_members")
    .insert({
      full_name,
      email: strOrNull(formData.get("email")),
      phone: strOrNull(formData.get("phone")),
      city: strOrNull(formData.get("city")),
      employment_type:
        (strOrNull(formData.get("employment_type")) as EmploymentType) ||
        "payroll",
      role_type: strOrNull(formData.get("role_type")),
      skills: parseSkills(formData.get("skills")),
      certificates: parseSkills(formData.get("certificates")),
      has_drivers_license: formData.get("has_drivers_license") === "on",
      has_car: formData.get("has_car") === "on",
      hourly_cost: numOrNull(formData.get("hourly_cost")),
      status: (strOrNull(formData.get("status")) as CrewMemberStatus) || "active",
      notes: strOrNull(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) return fail(error.message);
  revalidateDashboard(["/dashboard/intern/crew", "/dashboard/intern/planning"]);
  return ok({ id: data.id });
}

export async function updateCrewMemberAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(PLANNER_ROLES);
  const id = strOrNull(formData.get("id"));
  if (!id) return fail("Crew-id ontbreekt.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("crew_members")
    .update({
      full_name: strOrNull(formData.get("full_name")),
      email: strOrNull(formData.get("email")),
      phone: strOrNull(formData.get("phone")),
      city: strOrNull(formData.get("city")),
      employment_type: strOrNull(
        formData.get("employment_type"),
      ) as EmploymentType,
      role_type: strOrNull(formData.get("role_type")),
      skills: parseSkills(formData.get("skills")),
      certificates: parseSkills(formData.get("certificates")),
      has_drivers_license: formData.get("has_drivers_license") === "on",
      has_car: formData.get("has_car") === "on",
      hourly_cost: numOrNull(formData.get("hourly_cost")),
      status: strOrNull(formData.get("status")) as CrewMemberStatus,
      notes: strOrNull(formData.get("notes")),
    })
    .eq("id", id);

  if (error) return fail(error.message);
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

export async function createInvoiceDraftFromApprovedHoursAction(
  formData: FormData,
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
    .eq("status", "approved");

  if (entriesError) return fail(entriesError.message);
  if (!entries || entries.length === 0) {
    return fail("Geen goedgekeurde uren voor dit project.");
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
  if (linesError) return fail(linesError.message);

  const entryIds = entries.map((e) => e.id);
  const { error: markError } = await supabase
    .from("time_entries")
    .update({ status: "invoiced" })
    .in("id", entryIds);
  if (markError) return fail(markError.message);

  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/urenregistratie",
    "/dashboard/intern/financien",
  ]);
  return ok({ id: draft.id });
}

export async function updateInvoiceDraftStatusAction(
  id: string,
  status: InvoiceDraftStatus,
): Promise<ActionResult<{ id: string }>> {
  await requireRole(FINANCE_ROLES);
  const supabase = await createClient();
  const { error } = await supabase
    .from("invoice_drafts")
    .update({ status })
    .eq("id", id);
  if (error) return fail(error.message);
  revalidateDashboard([
    "/dashboard/intern/facturatie",
    "/dashboard/intern/financien",
  ]);
  return ok({ id });
}

/**
 * Maakt een Moneybird-concept (of optioneel verzendt) vanuit een Supabase-concept.
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

  const result = await pushInvoiceDraftToMoneybird({
    draftId: draftId.trim(),
    contactId,
    send,
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
