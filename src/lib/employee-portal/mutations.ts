"use server";

import { revalidatePath } from "next/cache";
import { employeeRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { resolveCrewMemberForUser } from "@/lib/employee-portal/data";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/dashboard/types";
import {
  canCrewEditOwnTimeEntry,
  computeEntryHours,
  normalizeKilometers,
  normalizeTravelTimeHours,
} from "@/lib/time-entries/shared";

function fail(error: string): ActionResult<never> {
  return { ok: false, error };
}

function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

function revalidateEmployeePortal() {
  revalidatePath("/portaal/medewerkers");
  revalidatePath("/portaal/medewerkers/planning");
  revalidatePath("/portaal/medewerkers/beschikbaarheid");
  revalidatePath("/portaal/medewerkers/uren");
  revalidatePath("/portaal/medewerkers/berichten");
  revalidatePath("/portaal/medewerkers/documenten");
  revalidatePath("/portaal/medewerkers/profiel");
  revalidatePath("/dashboard/intern/urenregistratie");
  revalidatePath("/dashboard/intern/facturatie");
  revalidatePath("/portaal/opdrachtgevers/uren");
}

async function requireLinkedCrew() {
  const profile = await requireRole(employeeRoles, {
    redirectTo: "/portaal/medewerkers",
  });
  const { crew, error } = await resolveCrewMemberForUser(
    profile.id,
    profile.email,
  );
  if (error) return { profile, crew: null as null, error };
  if (!crew) {
    return {
      profile,
      crew: null as null,
      error: "Geen medewerkerprofiel gekoppeld.",
    };
  }
  return { profile, crew, error: null as string | null };
}

function availabilityDbStatus(
  value: "Beschikbaar" | "Niet beschikbaar" | "Misschien",
): string {
  switch (value) {
    case "Niet beschikbaar":
      return "unavailable";
    case "Misschien":
      return "maybe";
    default:
      return "available";
  }
}

export async function saveCrewAvailabilityAction(input: {
  date: string;
  availability: "Beschikbaar" | "Niet beschikbaar" | "Misschien";
  startTime?: string;
  endTime?: string;
  notes?: string;
}): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return fail("Ongeldige datum.");
  }

  const supabase = await createClient();
  const status = availabilityDbStatus(input.availability);
  const start =
    input.availability === "Niet beschikbaar" ? null : input.startTime || null;
  const end =
    input.availability === "Niet beschikbaar" ? null : input.endTime || null;

  const { data, error } = await supabase
    .from("crew_availability")
    .upsert(
      {
        crew_member_id: ctx.crew.id,
        availability_date: input.date,
        status,
        start_time: start,
        end_time: end,
        notes: input.notes?.trim() || null,
      },
      { onConflict: "crew_member_id,availability_date" },
    )
    .select("id")
    .maybeSingle();

  if (error) {
    if (
      error.code === "42P01" ||
      error.message?.includes("Could not find the table")
    ) {
      return fail(
        "Beschikbaarheidstabel ontbreekt. Voer de SQL uit docs/employee-portal-supabase.md uit in Supabase.",
      );
    }
    return fail(error.message);
  }

  revalidateEmployeePortal();
  return ok({ id: data?.id ?? "" });
}

export type OwnTimeEntryInput = {
  projectId: string;
  shiftId?: string;
  workDate: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  kilometers?: number;
  travelTimeHours?: number;
  notes?: string;
};

export async function submitOwnTimeEntryAction(
  input: OwnTimeEntryInput,
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  if (!input.projectId) return fail("Project is verplicht.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.workDate)) {
    return fail("Ongeldige datum.");
  }
  if (!input.startTime || !input.endTime) {
    return fail("Start- en eindtijd zijn verplicht.");
  }

  const supabase = await createClient();

  // Must be assigned to a shift on this project (or the selected shift)
  let shiftQuery = supabase
    .from("shifts")
    .select("id, project_id, shift_date")
    .eq("crew_member_id", ctx.crew.id)
    .eq("project_id", input.projectId)
    .neq("status", "cancelled");

  if (input.shiftId) {
    shiftQuery = shiftQuery.eq("id", input.shiftId);
  }

  const { data: shifts, error: shiftError } = await shiftQuery.limit(5);
  if (shiftError) return fail(shiftError.message);
  if (!shifts?.length) {
    return fail("Je kunt alleen uren indienen voor shifts die aan jou zijn toegewezen.");
  }

  const shiftId = input.shiftId || shifts[0].id;
  const breakMinutes = Math.max(0, Number(input.breakMinutes) || 0);
  const hours = computeEntryHours({
    startTime: input.startTime,
    endTime: input.endTime,
    breakMinutes,
  });
  const kilometers = normalizeKilometers(input.kilometers);
  const travel_time_hours = normalizeTravelTimeHours(input.travelTimeHours);

  const { data, error } = await supabase
    .from("time_entries")
    .insert({
      project_id: input.projectId,
      shift_id: shiftId,
      crew_member_id: ctx.crew.id,
      work_date: input.workDate,
      start_time: input.startTime,
      end_time: input.endTime,
      break_minutes: breakMinutes,
      hours,
      kilometers,
      travel_time_hours,
      status: "submitted",
      internal_notes: input.notes?.trim() || null,
      correction_reason: null,
    })
    .select("id")
    .single();

  if (error) {
    if (
      error.code === "42501" ||
      error.message?.toLowerCase().includes("row-level security")
    ) {
      return fail(
        "Geen rechten om uren in te dienen. Voer supabase/hours-km-ecosystem.sql uit in Supabase.",
      );
    }
    return fail(error.message);
  }

  revalidateEmployeePortal();
  return ok({ id: data.id });
}

export async function updateOwnTimeEntryAction(
  entryId: string,
  input: Omit<OwnTimeEntryInput, "projectId" | "shiftId" | "workDate"> & {
    workDate?: string;
  },
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("time_entries")
    .select("id, crew_member_id, status, project_id, shift_id, work_date")
    .eq("id", entryId)
    .maybeSingle();

  if (readError) return fail(readError.message);
  if (!existing || existing.crew_member_id !== ctx.crew.id) {
    return fail("Urenregel niet gevonden.");
  }
  if (!canCrewEditOwnTimeEntry(existing.status)) {
    return fail(
      "Goedgekeurde of gefactureerde uren kun je niet zelf wijzigen. Gebruik ‘Wijziging doorgeven’.",
    );
  }
  if (!input.startTime || !input.endTime) {
    return fail("Start- en eindtijd zijn verplicht.");
  }

  const breakMinutes = Math.max(0, Number(input.breakMinutes) || 0);
  const hours = computeEntryHours({
    startTime: input.startTime,
    endTime: input.endTime,
    breakMinutes,
  });

  const { error } = await supabase
    .from("time_entries")
    .update({
      work_date: input.workDate || existing.work_date,
      start_time: input.startTime,
      end_time: input.endTime,
      break_minutes: breakMinutes,
      hours,
      kilometers: normalizeKilometers(input.kilometers),
      travel_time_hours: normalizeTravelTimeHours(input.travelTimeHours),
      status: "submitted",
      correction_reason: null,
      internal_notes: input.notes?.trim() || null,
    })
    .eq("id", entryId)
    .eq("crew_member_id", ctx.crew.id);

  if (error) return fail(error.message);

  revalidateEmployeePortal();
  return ok({ id: entryId });
}

export async function submitHoursCorrectionAction(input: {
  entryId: string;
  reason: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  requestedBreakMinutes?: string;
  requestedKilometers?: string;
  explanation: string;
}): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  const reason = input.reason.trim();
  const explanation = input.explanation.trim();
  if (!reason || !explanation) {
    return fail("Reden en toelichting zijn verplicht.");
  }

  const parts = [
    `Reden: ${reason}`,
    input.requestedStartTime
      ? `Gewenste start: ${input.requestedStartTime}`
      : null,
    input.requestedEndTime ? `Gewenste eind: ${input.requestedEndTime}` : null,
    input.requestedBreakMinutes
      ? `Gewenste pauze: ${input.requestedBreakMinutes} min`
      : null,
    input.requestedKilometers
      ? `Gewenste kilometers: ${input.requestedKilometers}`
      : null,
    `Toelichting: ${explanation}`,
  ].filter(Boolean);

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("time_entries")
    .select("id, crew_member_id, status")
    .eq("id", input.entryId)
    .maybeSingle();

  if (readError) return fail(readError.message);
  if (!existing || existing.crew_member_id !== ctx.crew.id) {
    return fail("Urenregel niet gevonden.");
  }
  if (existing.status === "invoiced") {
    return fail("Gefactureerde uren kunnen niet meer worden gewijzigd.");
  }

  const { error } = await supabase
    .from("time_entries")
    .update({ correction_reason: parts.join("\n") })
    .eq("id", input.entryId)
    .eq("crew_member_id", ctx.crew.id);

  if (error) return fail(error.message);

  // Also persist structured correction when app table exists
  await supabase.from("time_corrections").insert({
    time_entry_id: input.entryId,
    crew_member_id: ctx.crew.id,
    reason,
    explanation,
    requested_start_time: input.requestedStartTime || null,
    requested_end_time: input.requestedEndTime || null,
    requested_break_minutes: input.requestedBreakMinutes
      ? Number(input.requestedBreakMinutes)
      : null,
    requested_kilometers: input.requestedKilometers
      ? normalizeKilometers(input.requestedKilometers)
      : null,
    status: "pending",
  });

  revalidateEmployeePortal();
  return ok({ id: input.entryId });
}

export async function respondToShiftAction(
  shiftId: string,
  response: "accepted" | "declined",
): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  const supabase = await createClient();
  const { data: shift, error: loadError } = await supabase
    .from("shifts")
    .select("id, crew_member_id, status, shift_date")
    .eq("id", shiftId)
    .maybeSingle();

  if (loadError) return fail(loadError.message);
  if (!shift || shift.crew_member_id !== ctx.crew.id) {
    return fail("Shift niet gevonden of niet aan jou toegewezen.");
  }

  const now = new Date().toISOString();

  if (response === "accepted") {
    const { error } = await supabase
      .from("shifts")
      .update({ status: "confirmed" })
      .eq("id", shiftId)
      .eq("crew_member_id", ctx.crew.id);
    if (error) return fail(error.message);

    await supabase.from("shift_assignments").upsert(
      {
        shift_id: shiftId,
        crew_member_id: ctx.crew.id,
        status: "accepted",
        responded_at: now,
      },
      { onConflict: "shift_id,crew_member_id" },
    );
  } else {
    const { error } = await supabase
      .from("shifts")
      .update({
        status: "open",
        crew_member_id: null,
        assigned_people: 0,
      })
      .eq("id", shiftId)
      .eq("crew_member_id", ctx.crew.id);
    if (error) return fail(error.message);

    await supabase.from("shift_assignments").upsert(
      {
        shift_id: shiftId,
        crew_member_id: ctx.crew.id,
        status: "declined",
        responded_at: now,
      },
      { onConflict: "shift_id,crew_member_id" },
    );
  }

  revalidateEmployeePortal();
  revalidatePath("/dashboard/intern/planning");
  return ok({ id: shiftId });
}

export async function markNotificationReadAction(
  notificationId: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("Niet ingelogd.");

  const { error } = await supabase
    .from("app_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) return fail(error.message);
  revalidateEmployeePortal();
  revalidatePath("/portaal/opdrachtgevers");
  revalidatePath("/dashboard/intern");
  return ok({ id: notificationId });
}

export async function updateCrewProfileAction(input: {
  phone?: string;
  city?: string;
  notes?: string;
  hasDriversLicense?: boolean;
  hasCar?: boolean;
}): Promise<ActionResult<{ id: string }>> {
  const ctx = await requireLinkedCrew();
  if (ctx.error || !ctx.crew) return fail(ctx.error ?? "Geen medewerkerprofiel.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("crew_members")
    .update({
      phone: input.phone?.trim() || null,
      city: input.city?.trim() || null,
      notes: input.notes?.trim() || null,
      has_drivers_license: Boolean(input.hasDriversLicense),
      has_car: Boolean(input.hasCar),
    })
    .eq("id", ctx.crew.id);

  if (error) return fail(error.message);

  revalidateEmployeePortal();
  return ok({ id: ctx.crew.id });
}
