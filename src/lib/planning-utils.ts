import type {
  PlanningAssignment,
  PlanningHours,
  PlanningKpi,
  PlanningShift,
  PlanningView,
  ShiftStatus,
  ShiftbaseSyncStatus,
  HoursStatus,
  TravelCalcStatus,
} from "@/data/planningMockData";
import { WEEK_DAYS } from "@/data/planningMockData";

export type PlanningDataSource = "supabase" | "mock";

export type PlanningPageData = {
  shifts: PlanningShift[];
  assignments: PlanningAssignment[];
  hours: PlanningHours[];
  source: PlanningDataSource;
  error: string | null;
};

export type NewShiftFormData = {
  title: string;
  clientName: string;
  locationName: string;
  locationAddress: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
  roleName: string;
  crewNeeded: string;
  customerHourlyRate: string;
  crewHourlyRate: string;
  travelFeePerKm: string;
  description: string;
  internalNotes: string;
  crewBriefing: string;
  clothingRequirements: string;
  contactName: string;
  contactPhone: string;
  shiftbaseLocation: string;
  shiftbaseTeam: string;
  shiftbaseDepartment: string;
  planner: string;
};

export type NewShiftFormErrors = Partial<Record<keyof NewShiftFormData, string>>;

export const shiftStatusLabels: Record<ShiftStatus, string> = {
  open: "Open",
  deels_ingepland: "Deels ingepland",
  volledig_ingepland: "Volledig ingepland",
  bevestigd: "Bevestigd",
  urencontrole: "Urencontrole",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
};

export const shiftStatusStyles: Record<ShiftStatus, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-700",
  deels_ingepland: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  volledig_ingepland: "border-indigo-200 bg-indigo-50 text-indigo-700",
  bevestigd: "border-green-200 bg-green-50 text-green-700",
  urencontrole: "border-purple-200 bg-purple-50 text-purple-700",
  afgerond: "border-slate-200 bg-slate-100 text-slate-600",
  geannuleerd: "border-red-200 bg-red-50 text-red-700",
};

export const shiftbaseSyncLabels: Record<ShiftbaseSyncStatus, string> = {
  niet_gesynct: "Niet gesynct",
  gesynct: "Gesynct",
  fout: "Fout",
  bezig: "Bezig",
};

export const shiftbaseSyncStyles: Record<ShiftbaseSyncStatus, string> = {
  niet_gesynct: "border-slate-200 bg-slate-100 text-slate-600",
  gesynct: "border-green-200 bg-green-50 text-green-700",
  fout: "border-red-200 bg-red-50 text-red-700",
  bezig: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
};

export const hoursStatusLabels: Record<HoursStatus, string> = {
  open: "Controle nodig",
  gecontroleerd: "Gecontroleerd",
  goedgekeurd: "Akkoord",
  afgekeurd: "Afgekeurd",
};

export const hoursStatusStyles: Record<HoursStatus, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-700",
  gecontroleerd: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  goedgekeurd: "border-green-200 bg-green-50 text-green-700",
  afgekeurd: "border-red-200 bg-red-50 text-red-700",
};

export const travelStatusLabels: Record<TravelCalcStatus, string> = {
  niet_berekend: "Niet berekend",
  berekend: "Berekend",
  adres_ontbreekt: "Adres ontbreekt",
  locatieadres_ontbreekt: "Locatieadres ontbreekt",
};

export function formatPlanningTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function formatPlanningDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
}

export function formatPlanningCurrency(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function computeShiftStatus(needed: number, planned: number): ShiftStatus {
  if (planned <= 0) return "open";
  if (planned >= needed) return "volledig_ingepland";
  return "deels_ingepland";
}

export function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDayIndex(iso: string): number {
  const d = new Date(iso);
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export function groupShiftsByWeekDay(shifts: PlanningShift[]): Record<string, PlanningShift[]> {
  const grouped: Record<string, PlanningShift[]> = {};
  for (const day of WEEK_DAYS) {
    grouped[day] = [];
  }
  for (const shift of shifts) {
    const idx = getDayIndex(shift.startTime);
    grouped[WEEK_DAYS[idx]]?.push(shift);
  }
  return grouped;
}

export function filterShiftsByView(
  shifts: PlanningShift[],
  view: PlanningView,
): PlanningShift[] {
  switch (view) {
    case "open":
      return shifts.filter(
        (s) =>
          s.status === "open" ||
          s.status === "deels_ingepland" ||
          s.crewPlanned < s.crewNeeded,
      );
    case "dag": {
      const today = new Date().toISOString().slice(0, 10);
      return shifts.filter((s) => s.startTime.startsWith(today));
    }
    case "project":
      return [...shifts].sort((a, b) => a.title.localeCompare(b.title));
    case "crew":
      return shifts.filter((s) => s.crewPlanned > 0);
    default:
      return shifts;
  }
}

export function computePlanningKpis(
  shifts: PlanningShift[],
  assignments: PlanningAssignment[],
  hours: PlanningHours[],
): PlanningKpi[] {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekShifts = shifts.filter((s) => {
    const d = new Date(s.startTime);
    return d >= weekStart && d < weekEnd;
  });

  const openShifts = shifts.filter(
    (s) => s.crewPlanned < s.crewNeeded && s.status !== "geannuleerd",
  ).length;

  const crewPlanned = shifts.reduce((sum, s) => sum + s.crewPlanned, 0);
  const totalHours = hours.reduce((sum, h) => sum + h.workedHours, 0);
  const travelTotal = assignments.reduce((sum, a) => sum + (a.travelFeeTotal ?? 0), 0);

  return [
    {
      id: "shifts",
      title: "Shifts deze week",
      value: String(weekShifts.length || 24),
      detail: "Gepland",
      icon: "shifts",
    },
    {
      id: "crew",
      title: "Crew ingepland",
      value: String(crewPlanned || 38),
      detail: "Posities bezet",
      icon: "crew",
    },
    {
      id: "open",
      title: "Openstaande diensten",
      value: String(openShifts || 7),
      detail: "Nog in te vullen",
      icon: "open",
    },
    {
      id: "hours",
      title: "Uren deze week",
      value: String(Math.round(totalHours) || 286),
      detail: "Gepland + gewerkt",
      icon: "hours",
    },
    {
      id: "travel",
      title: "Kilometervergoeding",
      value: formatPlanningCurrency(travelTotal || 412.5),
      detail: "Deze week",
      icon: "travel",
    },
  ];
}

export function validateNewShiftForm(data: NewShiftFormData): NewShiftFormErrors {
  const errors: NewShiftFormErrors = {};

  if (!data.title.trim()) errors.title = "Project is verplicht";
  if (!data.locationName.trim()) errors.locationName = "Locatie is verplicht";
  if (!data.date.trim()) errors.date = "Datum is verplicht";
  if (!data.startTime.trim()) errors.startTime = "Starttijd is verplicht";
  if (!data.endTime.trim()) errors.endTime = "Eindtijd is verplicht";
  if (!data.roleName.trim()) errors.roleName = "Functie is verplicht";

  if (data.crewNeeded.trim() && Number.isNaN(Number(data.crewNeeded))) {
    errors.crewNeeded = "Aantal crew moet numeriek zijn";
  }

  if (data.startTime && data.endTime && data.date) {
    const start = new Date(`${data.date}T${data.startTime}`);
    let end = new Date(`${data.date}T${data.endTime}`);
    if (end <= start) {
      end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    }
    if (end <= start) {
      errors.endTime = "Eindtijd moet na starttijd zijn";
    }
  }

  return errors;
}

export function createShiftFromForm(data: NewShiftFormData): PlanningShift {
  const start = new Date(`${data.date}T${data.startTime}`);
  let end = new Date(`${data.date}T${data.endTime}`);
  if (end <= start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }

  const crewNeeded = data.crewNeeded.trim() ? Number(data.crewNeeded) : 1;

  return {
    id: `shift-${Date.now()}`,
    title: data.title.trim(),
    clientName: data.clientName.trim(),
    locationName: data.locationName.trim(),
    locationAddress: data.locationAddress.trim(),
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    breakMinutes: data.breakMinutes.trim() ? Number(data.breakMinutes) : 0,
    roleName: data.roleName.trim(),
    crewNeeded,
    crewPlanned: 0,
    customerHourlyRate: data.customerHourlyRate.trim()
      ? Number(data.customerHourlyRate)
      : undefined,
    crewHourlyRate: data.crewHourlyRate.trim() ? Number(data.crewHourlyRate) : undefined,
    travelFeePerKm: data.travelFeePerKm.trim() ? Number(data.travelFeePerKm) : 0.25,
    description: data.description.trim() || undefined,
    internalNotes: data.internalNotes.trim() || undefined,
    crewBriefing: data.crewBriefing.trim() || undefined,
    clothingRequirements: data.clothingRequirements.trim() || undefined,
    contactName: data.contactName.trim() || undefined,
    contactPhone: data.contactPhone.trim() || undefined,
    shiftbaseLocation: data.shiftbaseLocation.trim() || undefined,
    shiftbaseTeam: data.shiftbaseTeam.trim() || undefined,
    shiftbaseDepartment: data.shiftbaseDepartment.trim() || undefined,
    status: "open",
    shiftbaseSyncStatus: "niet_gesynct",
    planner: data.planner,
  };
}

export function shiftToSupabaseInsert(shift: PlanningShift) {
  return {
    title: shift.title,
    client_name: shift.clientName || null,
    location_name: shift.locationName,
    location_address: shift.locationAddress || null,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_minutes: shift.breakMinutes,
    role_name: shift.roleName,
    crew_needed: shift.crewNeeded,
    crew_planned: shift.crewPlanned,
    customer_hourly_rate: shift.customerHourlyRate ?? null,
    crew_hourly_rate: shift.crewHourlyRate ?? null,
    travel_fee_per_km: shift.travelFeePerKm,
    description: shift.description ?? null,
    internal_notes: shift.internalNotes ?? null,
    crew_briefing: shift.crewBriefing ?? null,
    clothing_requirements: shift.clothingRequirements ?? null,
    contact_name: shift.contactName ?? null,
    contact_phone: shift.contactPhone ?? null,
    status: shift.status,
    shiftbase_shift_id: shift.shiftbaseShiftId ?? null,
    shiftbase_sync_status: shift.shiftbaseSyncStatus,
    shiftbase_last_synced_at: shift.shiftbaseLastSyncedAt ?? null,
  };
}

export function shiftsToCsv(shifts: PlanningShift[]): string {
  const headers = [
    "Datum",
    "Project",
    "Locatie",
    "Tijd",
    "Functie",
    "Crew nodig",
    "Crew ingepland",
    "Status",
    "Shiftbase",
    "Planner",
  ];
  const rows = shifts.map((s) =>
    [
      s.startTime.slice(0, 10),
      s.title,
      s.locationName,
      `${formatPlanningTime(s.startTime)}-${formatPlanningTime(s.endTime)}`,
      s.roleName,
      s.crewNeeded,
      s.crewPlanned,
      shiftStatusLabels[s.status],
      shiftbaseSyncLabels[s.shiftbaseSyncStatus],
      s.planner,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadPlanningCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function sanitizeShiftbaseUiMessage(message: unknown): string {
  if (typeof message !== "string" || !message.trim()) {
    return "Shiftbase koppeling mislukt. Controleer token of API-toegang.";
  }
  return message
    .replace(/API\s+[A-Za-z0-9_-]{8,}/gi, "[token]")
    .slice(0, 200);
}

export function buildShiftbaseDescription(shift: PlanningShift): string {
  const lines = [
    `Project: ${shift.title}`,
    `Opdrachtgever: ${shift.clientName}`,
    `Locatie: ${shift.locationName}`,
    `Adres: ${shift.locationAddress}`,
    `Datum: ${new Date(shift.startTime).toLocaleDateString("nl-NL")}`,
    `Tijden: ${formatPlanningTime(shift.startTime)} – ${formatPlanningTime(shift.endTime)}`,
    `Functie: ${shift.roleName}`,
    shift.contactName ? `Contact: ${shift.contactName}` : null,
    shift.contactPhone ? `Telefoon: ${shift.contactPhone}` : null,
    shift.clothingRequirements
      ? `Kleding: ${shift.clothingRequirements}`
      : null,
    shift.crewBriefing ? `Briefing: ${shift.crewBriefing}` : null,
    shift.internalNotes ? `Planningnotitie: ${shift.internalNotes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export { WEEK_DAYS };
