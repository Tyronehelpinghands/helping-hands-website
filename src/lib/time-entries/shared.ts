/**
 * Shared hours + kilometers helpers for intern / medewerkers / opdrachtgevers.
 * Single source of truth: public.time_entries (kilometers column, no parallel table).
 */

import { calculateTravelCosts, calculateWorkedHours } from "@/lib/dashboard/calculations";
import type { TimeEntryStatus } from "@/lib/dashboard/types";
import { DEFAULT_TRAVEL_RATE_PER_KM } from "@/lib/rates";

export type PortalHoursStatusNl =
  | "Concept"
  | "Ingediend"
  | "Goedgekeurd"
  | "Afgekeurd"
  | "Gefactureerd"
  | "Correctie aangevraagd";

export type ClientHoursStatusNl =
  | "Nog te controleren"
  | "Goedgekeurd door planning"
  | "Gefactureerd";

/** Statuses a crew member may create or fully edit (uren + km). */
export const CREW_EDITABLE_STATUSES: TimeEntryStatus[] = [
  "draft",
  "submitted",
  "rejected",
];

/** Statuses visible to opdrachtgevers (no drafts/rejected). */
export const CLIENT_VISIBLE_STATUSES: TimeEntryStatus[] = [
  "submitted",
  "approved",
  "invoiced",
];

export function mapTimeEntryStatusToEmployeeNl(
  status: TimeEntryStatus,
  hasCorrectionReason?: boolean | null,
): PortalHoursStatusNl {
  if (hasCorrectionReason) return "Correctie aangevraagd";
  switch (status) {
    case "draft":
      return "Concept";
    case "submitted":
      return "Ingediend";
    case "approved":
      return "Goedgekeurd";
    case "rejected":
      return "Afgekeurd";
    case "invoiced":
      return "Gefactureerd";
    default:
      return "Ingediend";
  }
}

export function mapTimeEntryStatusToClientNl(
  status: TimeEntryStatus,
): ClientHoursStatusNl {
  switch (status) {
    case "invoiced":
      return "Gefactureerd";
    case "approved":
      return "Goedgekeurd door planning";
    case "submitted":
    default:
      return "Nog te controleren";
  }
}

export function canCrewEditOwnTimeEntry(status: TimeEntryStatus): boolean {
  return CREW_EDITABLE_STATUSES.includes(status);
}

export function canCrewSubmitCorrection(status: TimeEntryStatus): boolean {
  return status !== "invoiced";
}

export function normalizeKilometers(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

export function normalizeTravelTimeHours(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

export function computeEntryHours(input: {
  hours?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  breakMinutes?: number | null;
}): number {
  if (input.hours != null && Number.isFinite(Number(input.hours))) {
    return Math.round(Number(input.hours) * 100) / 100;
  }
  return calculateWorkedHours(
    input.startTime,
    input.endTime,
    input.breakMinutes ?? 0,
  );
}

export function computeKmTravelCost(
  kilometers: number,
  kmRate: number = DEFAULT_TRAVEL_RATE_PER_KM,
): number {
  return calculateTravelCosts(normalizeKilometers(kilometers), kmRate);
}

export function formatKilometersNl(kilometers: number): string {
  const n = normalizeKilometers(kilometers);
  if (n === 0) return "—";
  return `${n.toLocaleString("nl-NL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} km`;
}
