/**
 * Shiftbase sync helpers for internal planning — server-side only.
 * Never throw sync failures out of create/assign flows; persist status on the shift row.
 */

import type { PlanningShift } from "@/data/planningMockData";
import type {
  CrewMember,
  CrewMemberStatus,
  Project,
  Shift,
  ShiftbaseSyncStatus,
} from "@/lib/dashboard/types";
import {
  fetchShiftbaseEmployeesWithMeta,
  formatShiftbaseError,
  isShiftbaseConfigured,
  sanitizeShiftbaseUiMessage,
  ShiftbaseApiError,
  SHIFTBASE_SYNC_NOTES,
  syncShiftToShiftbase,
  type ShiftbaseEmployee,
} from "@/lib/shiftbase";
import { createClient } from "@/lib/supabase/server";

export type MvpShiftbaseSyncResult = {
  status: ShiftbaseSyncStatus;
  shiftbaseShiftId?: string;
  error?: string;
  message?: string;
};

export type EmployeeSyncResult = {
  ok: boolean;
  imported: number;
  updated: number;
  skipped: number;
  errors: string[];
  message: string;
  statusCode?: number | null;
  endpointUsed?: string;
};

type ProjectWithClient = Project & {
  clients?: { company_name?: string | null } | null;
};

type CrewMatchRow = Pick<
  CrewMember,
  | "id"
  | "full_name"
  | "email"
  | "phone"
  | "city"
  | "role_type"
  | "skills"
  | "hourly_cost"
  | "status"
  | "notes"
  | "shiftbase_user_id"
>;

/** Normalize Supabase `time` / `HH:mm` into `HH:mm:ss`. */
function normalizeTime(time: string | null | undefined, fallback: string): string {
  const raw = (time?.trim() || fallback).slice(0, 8);
  return raw.length === 5 ? `${raw}:00` : raw;
}

/** Combine date + time into local ISO-ish `YYYY-MM-DDTHH:mm:ss` for Shiftbase. */
function combineDateAndTime(
  date: string,
  time: string | null | undefined,
  fallbackTime: string,
): string {
  return `${date}T${normalizeTime(time, fallbackTime)}`;
}

export function buildPlanningShiftFromMvp(
  shift: Shift,
  project: ProjectWithClient | null | undefined,
): PlanningShift {
  const projectName = project?.project_name?.trim() || "Project";
  const roleName = shift.role_name?.trim() || "Shift";
  const clientName =
    project?.clients?.company_name?.trim() ||
    projectName;

  return {
    id: shift.id,
    projectId: shift.project_id ?? undefined,
    title: `${projectName} — ${roleName}`,
    clientName,
    locationName: project?.location?.trim() || "",
    locationAddress: project?.address?.trim() || "",
    startTime: combineDateAndTime(shift.shift_date, shift.start_time, "09:00"),
    endTime: combineDateAndTime(shift.shift_date, shift.end_time, "17:00"),
    breakMinutes: 0,
    roleName,
    crewNeeded: shift.required_people || 1,
    crewPlanned: shift.assigned_people || 0,
    travelFeePerKm: 0.25,
    description: shift.notes ?? undefined,
    internalNotes: shift.notes ?? undefined,
    contactName: project?.contact_on_site ?? undefined,
    crewBriefing: project?.briefing ?? undefined,
    clothingRequirements: project?.clothing ?? undefined,
    status: "open",
    shiftbaseShiftId: shift.shiftbase_shift_id ?? undefined,
    shiftbaseSyncStatus:
      (shift.shiftbase_sync_status as PlanningShift["shiftbaseSyncStatus"]) ||
      "niet_gesynct",
    shiftbaseLastSyncedAt: shift.shiftbase_last_synced_at ?? undefined,
    planner: "intern",
  };
}

async function updateShiftSyncFields(
  shiftId: string,
  fields: {
    shiftbase_shift_id?: string | null;
    shiftbase_sync_status: ShiftbaseSyncStatus;
    shiftbase_last_synced_at?: string | null;
    shiftbase_sync_error?: string | null;
  },
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("shifts").update(fields).eq("id", shiftId);
  } catch {
    // Persist best-effort; never bubble sync bookkeeping failures.
  }
}

/**
 * Load shift + project and push/update to Shiftbase.
 * Returns status payload; never throws for sync/API failures.
 */
export async function syncMvpShiftToShiftbase(
  shiftId: string,
): Promise<MvpShiftbaseSyncResult> {
  try {
    if (!isShiftbaseConfigured()) {
      await updateShiftSyncFields(shiftId, {
        shiftbase_sync_status: "overgeslagen",
        shiftbase_sync_error: null,
      });
      return {
        status: "overgeslagen",
        message:
          "Shiftbase niet geconfigureerd — alleen in Supabase opgeslagen",
      };
    }

    const supabase = await createClient();
    const { data: shift, error: shiftError } = await supabase
      .from("shifts")
      .select("*")
      .eq("id", shiftId)
      .single();

    if (shiftError || !shift) {
      const error = shiftError?.message || "Shift niet gevonden.";
      await updateShiftSyncFields(shiftId, {
        shiftbase_sync_status: "fout",
        shiftbase_sync_error: error,
      });
      return { status: "fout", error, message: error };
    }

    let project: ProjectWithClient | null = null;
    if (shift.project_id) {
      const { data: projectRow } = await supabase
        .from("projects")
        .select("*, clients(company_name)")
        .eq("id", shift.project_id)
        .maybeSingle();
      project = (projectRow as ProjectWithClient | null) ?? null;
    }

    const planningShift = buildPlanningShiftFromMvp(
      shift as Shift,
      project,
    );

    try {
      const result = await syncShiftToShiftbase(planningShift);
      const syncedAt = new Date().toISOString();
      await updateShiftSyncFields(shiftId, {
        shiftbase_shift_id: result.shiftbaseShiftId,
        shiftbase_sync_status: "gesynct",
        shiftbase_last_synced_at: syncedAt,
        shiftbase_sync_error: null,
      });
      return {
        status: "gesynct",
        shiftbaseShiftId: result.shiftbaseShiftId,
        message: "Gesynchroniseerd met Shiftbase",
      };
    } catch (err) {
      const error = formatShiftbaseError(err);
      await updateShiftSyncFields(shiftId, {
        shiftbase_sync_status: "fout",
        shiftbase_sync_error: error,
      });
      return { status: "fout", error, message: error };
    }
  } catch (err) {
    const error = formatShiftbaseError(err);
    await updateShiftSyncFields(shiftId, {
      shiftbase_sync_status: "fout",
      shiftbase_sync_error: error,
    });
    return { status: "fout", error, message: error };
  }
}

function normalizeEmail(email: string | null | undefined): string | null {
  const value = email?.trim().toLowerCase();
  return value || null;
}

function buildCrewPayloadFromShiftbase(
  employee: ShiftbaseEmployee,
  existing?: CrewMatchRow | null,
): Record<string, unknown> {
  const city = employee.city ?? employee.address?.city ?? existing?.city ?? null;
  const status: CrewMemberStatus =
    employee.status ?? existing?.status ?? "active";

  const payload: Record<string, unknown> = {
    full_name: employee.fullName.trim() || existing?.full_name || "Onbekend",
    email: employee.email?.trim() || existing?.email || null,
    phone: employee.phone?.trim() || existing?.phone || null,
    city,
    status,
    notes: SHIFTBASE_SYNC_NOTES,
    shiftbase_user_id: employee.id || existing?.shiftbase_user_id || null,
  };

  if (employee.roleType?.trim()) {
    payload.role_type = employee.roleType.trim();
  } else if (!existing) {
    payload.role_type = null;
  }

  // Only fill cost/skills when Shiftbase provides them; never wipe local values.
  if (
    employee.hourlyCost != null &&
    Number.isFinite(employee.hourlyCost) &&
    (!existing || existing.hourly_cost == null)
  ) {
    payload.hourly_cost = employee.hourlyCost;
  }

  if (employee.skills?.length && (!existing || !(existing.skills || []).length)) {
    payload.skills = employee.skills;
  }

  if (!existing) {
    payload.employment_type = "payroll";
    payload.certificates = [];
    payload.has_drivers_license = false;
    payload.has_car = false;
    if (!employee.skills?.length) payload.skills = [];
  }

  return payload;
}

/**
 * Import/update Shiftbase users into `crew_members`.
 * Upsert op e-mail; zonder e-mail → overgeslagen. Nooit lokale-only crew verwijderen.
 */
export async function syncShiftbaseEmployeesToDashboard(): Promise<EmployeeSyncResult> {
  if (!isShiftbaseConfigured()) {
    return {
      ok: false,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: ["SHIFTBASE_API_KEY of SHIFTBASE_API_TOKEN is niet geconfigureerd."],
      message: "Shiftbase is niet geconfigureerd op de server.",
      statusCode: null,
      endpointUsed: "/users",
    };
  }

  let employees: ShiftbaseEmployee[];
  let endpointUsed = "/users";
  try {
    const result = await fetchShiftbaseEmployeesWithMeta();
    employees = result.employees;
    endpointUsed = result.endpointUsed;
  } catch (err) {
    const error = sanitizeShiftbaseUiMessage(formatShiftbaseError(err));
    const statusCode =
      err instanceof ShiftbaseApiError ? err.status : null;
    const path =
      err instanceof ShiftbaseApiError ? err.path : endpointUsed;
    return {
      ok: false,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [error],
      message: error,
      statusCode,
      endpointUsed: path,
    };
  }

  const supabase = await createClient();
  const { data: existingRows, error: loadError } = await supabase
    .from("crew_members")
    .select(
      "id, full_name, email, phone, city, role_type, skills, hourly_cost, status, notes, shiftbase_user_id",
    );

  if (loadError) {
    const missingColumn =
      /shiftbase_user_id/i.test(loadError.message) ||
      loadError.code === "42703";
    const message = missingColumn
      ? "Kolom shiftbase_user_id ontbreekt. Voer de SQL-migratie uit docs/internal-dashboard-database.md uit in Supabase."
      : sanitizeShiftbaseUiMessage(loadError.message);
    return {
      ok: false,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [message],
      message,
      endpointUsed,
    };
  }

  const existing = (existingRows ?? []) as CrewMatchRow[];
  const byShiftbaseId = new Map<string, CrewMatchRow>();
  const byEmail = new Map<string, CrewMatchRow>();

  for (const row of existing) {
    if (row.shiftbase_user_id) {
      byShiftbaseId.set(String(row.shiftbase_user_id), row);
    }
    const email = normalizeEmail(row.email);
    if (email && !byEmail.has(email)) {
      byEmail.set(email, row);
    }
  }

  let imported = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const employee of employees) {
    const emailKey = normalizeEmail(employee.email);
    // Upsert op e-mail; zonder e-mail overslaan.
    if (!emailKey) {
      skipped += 1;
      continue;
    }

    const name = employee.fullName?.trim() || emailKey;

    const match =
      (employee.id ? byShiftbaseId.get(employee.id) : undefined) ??
      byEmail.get(emailKey);

    const payload = buildCrewPayloadFromShiftbase(employee, match);

    try {
      if (match) {
        const { error } = await supabase
          .from("crew_members")
          .update(payload)
          .eq("id", match.id);
        if (error) {
          errors.push(
            `${name}: ${sanitizeShiftbaseUiMessage(error.message)}`,
          );
          continue;
        }
        updated += 1;
        const refreshed = { ...match, ...payload } as CrewMatchRow;
        if (employee.id) byShiftbaseId.set(employee.id, refreshed);
        byEmail.set(emailKey, refreshed);
      } else {
        const { data: inserted, error } = await supabase
          .from("crew_members")
          .insert(payload)
          .select(
            "id, full_name, email, phone, city, role_type, skills, hourly_cost, status, notes, shiftbase_user_id",
          )
          .single();
        if (error) {
          errors.push(
            `${name}: ${sanitizeShiftbaseUiMessage(error.message)}`,
          );
          continue;
        }
        imported += 1;
        if (inserted) {
          const row = inserted as CrewMatchRow;
          if (row.shiftbase_user_id) {
            byShiftbaseId.set(String(row.shiftbase_user_id), row);
          }
          const insertedEmail = normalizeEmail(row.email);
          if (insertedEmail) byEmail.set(insertedEmail, row);
        }
      }
    } catch (err) {
      errors.push(
        `${name}: ${sanitizeShiftbaseUiMessage(
          err instanceof Error ? err.message : "Onbekende fout",
        )}`,
      );
    }
  }

  const ok = errors.length === 0;
  const parts = [
    `${imported} geïmporteerd`,
    `${updated} bijgewerkt`,
    `${skipped} overgeslagen`,
  ];
  if (errors.length) parts.push(`${errors.length} fout(en)`);

  return {
    ok,
    imported,
    updated,
    skipped,
    errors: errors.slice(0, 10),
    message: `Medewerkers gesynchroniseerd via ${endpointUsed}: ${parts.join(", ")}.`,
    endpointUsed,
    statusCode: 200,
  };
}
