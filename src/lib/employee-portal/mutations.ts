"use server";

import { revalidatePath } from "next/cache";
import { employeeRoles } from "@/lib/auth/roles";
import { requireRole } from "@/lib/auth/requireRole";
import { resolveCrewMemberForUser } from "@/lib/employee-portal/data";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/dashboard/types";

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

export async function submitHoursCorrectionAction(input: {
  entryId: string;
  reason: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  requestedBreakMinutes?: string;
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
    status: "pending",
  });

  revalidateEmployeePortal();
  revalidatePath("/dashboard/intern/uren");
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
