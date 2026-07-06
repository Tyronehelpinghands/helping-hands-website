import {
  mockPlanningAssignments,
  mockPlanningHours,
  mockPlanningShifts,
  type PlanningAssignment,
  type PlanningHours,
  type PlanningShift,
} from "@/data/planningMockData";
import { computeShiftStatus, type PlanningPageData } from "@/lib/planning-utils";
import { createClient } from "@/lib/supabase/server";

type ShiftRow = {
  id: string;
  project_id: string | null;
  title: string;
  client_name: string | null;
  location_name: string | null;
  location_address: string | null;
  start_time: string;
  end_time: string;
  break_minutes: number;
  role_name: string | null;
  crew_needed: number;
  crew_planned: number;
  customer_hourly_rate: number | null;
  crew_hourly_rate: number | null;
  travel_fee_per_km: number | null;
  description: string | null;
  internal_notes: string | null;
  crew_briefing: string | null;
  clothing_requirements: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  status: string;
  shiftbase_shift_id: string | null;
  shiftbase_sync_status: string;
  shiftbase_last_synced_at: string | null;
  created_at: string;
  profiles?: { full_name: string | null } | null;
};

function mapShiftRow(row: ShiftRow): PlanningShift {
  const crewNeeded = Number(row.crew_needed) || 0;
  const crewPlanned = Number(row.crew_planned) || 0;

  return {
    id: row.id,
    projectId: row.project_id ?? undefined,
    title: row.title,
    clientName: row.client_name ?? "",
    locationName: row.location_name ?? "",
    locationAddress: row.location_address ?? "",
    startTime: row.start_time,
    endTime: row.end_time,
    breakMinutes: Number(row.break_minutes) || 0,
    roleName: row.role_name ?? "",
    crewNeeded,
    crewPlanned,
    customerHourlyRate: row.customer_hourly_rate
      ? Number(row.customer_hourly_rate)
      : undefined,
    crewHourlyRate: row.crew_hourly_rate ? Number(row.crew_hourly_rate) : undefined,
    travelFeePerKm: Number(row.travel_fee_per_km) || 0.25,
    description: row.description ?? undefined,
    internalNotes: row.internal_notes ?? undefined,
    crewBriefing: row.crew_briefing ?? undefined,
    clothingRequirements: row.clothing_requirements ?? undefined,
    contactName: row.contact_name ?? undefined,
    contactPhone: row.contact_phone ?? undefined,
    status: (row.status as PlanningShift["status"]) || computeShiftStatus(crewNeeded, crewPlanned),
    shiftbaseShiftId: row.shiftbase_shift_id ?? undefined,
    shiftbaseSyncStatus: (row.shiftbase_sync_status as PlanningShift["shiftbaseSyncStatus"]) ?? "niet_gesynct",
    shiftbaseLastSyncedAt: row.shiftbase_last_synced_at ?? undefined,
    planner: row.profiles?.full_name ?? "—",
  };
}

export async function getPlanningPageData(): Promise<PlanningPageData> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("planning_shifts")
      .select(`*, profiles:created_by ( full_name )`)
      .order("start_time", { ascending: true });

    if (error) {
      if (
        error.code === "42P01" ||
        error.message.includes("does not exist") ||
        error.message.includes("relation")
      ) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[Planning] planning_shifts tabel niet gevonden — mock data. Voer supabase/planning-module.sql uit.",
          );
        }
        return {
          shifts: mockPlanningShifts,
          assignments: mockPlanningAssignments,
          hours: mockPlanningHours,
          source: "mock",
          error: null,
        };
      }

      if (process.env.NODE_ENV === "development") {
        console.warn("[Planning] Supabase fout — mock fallback:", error.message);
      }
      return {
        shifts: mockPlanningShifts,
        assignments: mockPlanningAssignments,
        hours: mockPlanningHours,
        source: "mock",
        error: null,
      };
    }

    if (!data || data.length === 0) {
      return {
        shifts: mockPlanningShifts,
        assignments: mockPlanningAssignments,
        hours: mockPlanningHours,
        source: "mock",
        error: null,
      };
    }

    return {
      shifts: (data as ShiftRow[]).map(mapShiftRow),
      assignments: mockPlanningAssignments,
      hours: mockPlanningHours,
      source: "supabase",
      error: null,
    };
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Planning] Supabase niet beschikbaar — mock data.");
    }
    return {
      shifts: mockPlanningShifts,
      assignments: mockPlanningAssignments,
      hours: mockPlanningHours,
      source: "mock",
      error: null,
    };
  }
}
