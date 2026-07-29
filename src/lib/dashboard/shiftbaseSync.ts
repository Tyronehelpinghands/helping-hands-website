/**
 * Shiftbase sync helpers for internal planning — server-side only.
 * Never throw sync failures out of create/assign flows; persist status on the shift row.
 */

import type { PlanningShift } from "@/data/planningMockData";
import type {
  Project,
  Shift,
  ShiftbaseSyncStatus,
} from "@/lib/dashboard/types";
import {
  formatShiftbaseError,
  isShiftbaseConfigured,
  syncShiftToShiftbase,
} from "@/lib/shiftbase";
import { createClient } from "@/lib/supabase/server";

export type MvpShiftbaseSyncResult = {
  status: ShiftbaseSyncStatus;
  shiftbaseShiftId?: string;
  error?: string;
  message?: string;
};

type ProjectWithClient = Project & {
  clients?: { company_name?: string | null } | null;
};

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
