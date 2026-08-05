/**
 * Medewerkersportaal — live data from Supabase (crew_members, shifts, time_entries, …).
 * Resolves auth user → crew_member via profile_id, then email fallback.
 */

import { cache } from "react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { Profile } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import {
  endOfWeek,
  startOfWeek,
  toDateString,
} from "@/lib/dashboard/calculations";
import type {
  CrewMember,
  InternalMessage,
  Shift,
  TimeEntry,
} from "@/lib/dashboard/types";
import type {
  EmployeeAvailability,
  EmployeeDocument,
  EmployeeHoursEntry,
  EmployeeMessage,
  EmployeePortalStats,
  EmployeeProfile,
  EmployeeShift,
} from "@/lib/employeePortal";
import {
  getEmployeePortalStats,
  getNextShift,
  getPendingActions,
  getUpcomingShifts,
} from "@/lib/employeePortal";

type ShiftWithProject = Shift & {
  projects?: {
    id: string;
    project_name: string;
    location: string | null;
    address: string | null;
    briefing: string | null;
    clothing: string | null;
    contact_on_site: string | null;
    travel_agreements: string | null;
    clients?: { id: string; company_name: string } | null;
  } | null;
};

type TimeEntryWithProject = TimeEntry & {
  projects?: { id: string; project_name: string } | null;
};

export type EmployeePortalBundle = {
  authProfile: Profile;
  crew: CrewMember | null;
  hasCrewProfile: boolean;
  employeeProfile: EmployeeProfile | null;
  shifts: EmployeeShift[];
  hours: EmployeeHoursEntry[];
  messages: EmployeeMessage[];
  documents: EmployeeDocument[];
  availability: EmployeeAvailability[];
  stats: EmployeePortalStats;
  nextShift: EmployeeShift | null;
  upcomingShifts: EmployeeShift[];
  pendingActions: { label: string; href: string; type: string }[];
  displayName: string;
  errorMessage: string | null;
};

function isMissingTableError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false;
  const msg = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("Could not find the table")
  );
}

function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  return value.slice(0, 5);
}

function mapShiftStatus(status: Shift["status"]): EmployeeShift["status"] {
  switch (status) {
    case "assigned":
      return "Aangevraagd";
    case "confirmed":
      return "Bevestigd";
    case "completed":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
    case "open":
    default:
      return "Aangevraagd";
  }
}

function mapHoursStatus(
  entry: TimeEntry,
): EmployeeHoursEntry["status"] {
  if (entry.correction_reason) return "Correctie aangevraagd";
  switch (entry.status) {
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

function mapEmploymentType(
  type: CrewMember["employment_type"],
): EmployeeProfile["employmentType"] {
  switch (type) {
    case "zzp":
    case "freelance":
      return "ZZP";
    case "payroll":
      return "Payroll";
    case "vast":
      return "Loondienst";
    default:
      return "Onbekend";
  }
}

function mapCrewStatus(
  status: CrewMember["status"],
): EmployeeProfile["status"] {
  switch (status) {
    case "active":
      return "Actief";
    case "onboarding":
      return "Onboarding";
    case "inactive":
      return "Inactief";
    default:
      return "Actief";
  }
}

function mapMessageType(type: string | null): EmployeeMessage["type"] {
  const t = (type ?? "").toLowerCase();
  if (t.includes("briefing") || t.includes("whatsapp")) return "Briefing";
  if (t.includes("uren") || t.includes("hour")) return "Uren";
  if (t.includes("document")) return "Documenten";
  if (t.includes("crew") || t.includes("reminder") || t.includes("planning"))
    return "Planning";
  return "Algemeen";
}

function mapAvailabilityStatus(
  status: string,
): EmployeeAvailability["availability"] {
  switch (status) {
    case "available":
    case "beschikbaar":
      return "Beschikbaar";
    case "unavailable":
    case "niet_beschikbaar":
      return "Niet beschikbaar";
    case "maybe":
    case "misschien":
      return "Misschien";
    default:
      return "Beschikbaar";
  }
}

export function mapCrewToEmployeeProfile(crew: CrewMember): EmployeeProfile {
  return {
    id: crew.id,
    displayName: crew.full_name,
    email: crew.email ?? "",
    phone: crew.phone ?? "",
    city: crew.city ?? "",
    employmentType: mapEmploymentType(crew.employment_type),
    status: mapCrewStatus(crew.status),
    roles: crew.role_type ? [crew.role_type] : [],
    skills: crew.skills ?? [],
    certificates: crew.certificates ?? [],
    hasDriversLicense: crew.has_drivers_license,
    hasCar: crew.has_car,
    ibanStatus: "Niet ingevuld",
    documentStatus:
      (crew.certificates?.length ?? 0) > 0 ? "Compleet" : "Mist gegevens",
    planningNotes: crew.notes ?? undefined,
  };
}

export function mapShiftToEmployeeShift(shift: ShiftWithProject): EmployeeShift {
  const project = shift.projects;
  return {
    id: shift.id,
    projectName: project?.project_name ?? "Project",
    clientName: project?.clients?.company_name ?? undefined,
    date: shift.shift_date,
    startTime: formatTime(shift.start_time),
    endTime: formatTime(shift.end_time),
    locationName: project?.location ?? "Locatie volgt",
    locationAddress: project?.address ?? project?.location ?? "",
    role: shift.role_name ?? "Crew",
    status: mapShiftStatus(shift.status),
    briefing: project?.briefing ?? shift.notes ?? undefined,
    clothing: project?.clothing ?? undefined,
    contactPerson: project?.contact_on_site ?? undefined,
    travelInfo: project?.travel_agreements ?? undefined,
    shiftbaseShiftId: shift.shiftbase_shift_id ?? undefined,
  };
}

export function mapTimeEntryToEmployeeHours(
  entry: TimeEntryWithProject,
): EmployeeHoursEntry {
  const hours =
    entry.hours ??
    0;
  return {
    id: entry.id,
    shiftId: entry.shift_id ?? undefined,
    projectName: entry.projects?.project_name ?? "Project",
    date: entry.work_date,
    startTime: formatTime(entry.start_time),
    endTime: formatTime(entry.end_time),
    breakMinutes: entry.break_minutes ?? 0,
    workedHours: Number(hours) || 0,
    status: mapHoursStatus(entry),
    notes: entry.internal_notes ?? undefined,
    correctionRequest: entry.correction_reason
      ? {
          reason: "Correctieverzoek",
          explanation: entry.correction_reason,
          requestedAt: entry.updated_at,
          status: "In behandeling",
        }
      : undefined,
  };
}

function mapInternalMessageToEmployee(
  msg: InternalMessage,
): EmployeeMessage {
  return {
    id: msg.id,
    title: msg.subject?.trim() || "Bericht van planning",
    body: msg.body?.trim() || "",
    type: mapMessageType(msg.message_type),
    status: msg.status === "sent" || msg.status === "ready" ? "Nieuw" : "Gelezen",
    createdAt: msg.created_at,
  };
}

function documentsFromCrew(crew: CrewMember): EmployeeDocument[] {
  return (crew.certificates ?? []).map((title, index) => ({
    id: `cert-${crew.id}-${index}`,
    title,
    type: "Certificaat" as const,
    status: "Goedgekeurd" as const,
  }));
}

/**
 * Resolve crew_members row for the logged-in user.
 * 1) profile_id = auth user id
 * 2) email match (case-insensitive) against profiles.email / auth email
 */
export async function resolveCrewMemberForUser(
  userId: string,
  email: string | null | undefined,
): Promise<{ crew: CrewMember | null; error: string | null }> {
  const supabase = await createClient();

  const byProfile = await supabase
    .from("crew_members")
    .select("*")
    .eq("profile_id", userId)
    .maybeSingle();

  if (byProfile.error && !isMissingTableError(byProfile.error)) {
    return { crew: null, error: byProfile.error.message };
  }
  if (byProfile.data) {
    return {
      crew: normalizeCrew(byProfile.data as CrewMember),
      error: null,
    };
  }

  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return { crew: null, error: null };
  }

  const byEmail = await supabase
    .from("crew_members")
    .select("*")
    .ilike("email", normalizedEmail)
    .limit(5);

  if (byEmail.error && !isMissingTableError(byEmail.error)) {
    return { crew: null, error: byEmail.error.message };
  }

  const rows = (byEmail.data ?? []) as CrewMember[];
  const exact =
    rows.find((r) => r.email?.trim().toLowerCase() === normalizedEmail) ??
    rows[0] ??
    null;

  return { crew: exact ? normalizeCrew(exact) : null, error: null };
}

function normalizeCrew(row: CrewMember): CrewMember {
  return {
    ...row,
    skills: row.skills ?? [],
    certificates: row.certificates ?? [],
  };
}

async function fetchCrewShifts(crewId: string): Promise<EmployeeShift[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shifts")
    .select(
      "*, projects(id, project_name, location, address, briefing, clothing, contact_on_site, travel_agreements, clients(id, company_name))",
    )
    .eq("crew_member_id", crewId)
    .neq("status", "cancelled")
    .order("shift_date", { ascending: true });

  if (error) {
    if (isMissingTableError(error)) return [];
    console.error("[employee-portal] shifts:", error.message);
    return [];
  }

  return ((data ?? []) as ShiftWithProject[]).map(mapShiftToEmployeeShift);
}

async function fetchCrewHours(crewId: string): Promise<EmployeeHoursEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_entries")
    .select("*, projects(id, project_name)")
    .eq("crew_member_id", crewId)
    .order("work_date", { ascending: false });

  if (error) {
    if (isMissingTableError(error)) return [];
    console.error("[employee-portal] time_entries:", error.message);
    return [];
  }

  return ((data ?? []) as TimeEntryWithProject[]).map(
    mapTimeEntryToEmployeeHours,
  );
}

async function fetchCrewMessages(
  email: string | null | undefined,
): Promise<EmployeeMessage[]> {
  if (!email?.trim()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("internal_messages")
    .select("*")
    .ilike("recipient_email", email.trim())
    .in("status", ["sent", "ready"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (isMissingTableError(error)) return [];
    console.error("[employee-portal] messages:", error.message);
    return [];
  }

  return ((data ?? []) as InternalMessage[]).map(mapInternalMessageToEmployee);
}

async function fetchCrewAvailability(
  crewId: string,
): Promise<EmployeeAvailability[]> {
  const supabase = await createClient();
  const from = toDateString(startOfWeek());
  const { data, error } = await supabase
    .from("crew_availability")
    .select("*")
    .eq("crew_member_id", crewId)
    .gte("availability_date", from)
    .order("availability_date", { ascending: true });

  if (error) {
    if (isMissingTableError(error)) return [];
    console.error("[employee-portal] availability:", error.message);
    return [];
  }

  return (data ?? []).map(
    (row: {
      id: string;
      availability_date: string;
      status: string;
      start_time: string | null;
      end_time: string | null;
      notes: string | null;
    }) => ({
      id: row.id,
      date: row.availability_date,
      availability: mapAvailabilityStatus(row.status),
      startTime: row.start_time ? formatTime(row.start_time) : undefined,
      endTime: row.end_time ? formatTime(row.end_time) : undefined,
      notes: row.notes ?? undefined,
    }),
  );
}

function emptyBundle(
  authProfile: Profile,
  errorMessage: string | null = null,
): EmployeePortalBundle {
  const displayName =
    authProfile.full_name?.trim() ||
    authProfile.email?.split("@")[0] ||
    "medewerker";
  const shifts: EmployeeShift[] = [];
  const hours: EmployeeHoursEntry[] = [];
  const messages: EmployeeMessage[] = [];
  const documents: EmployeeDocument[] = [];

  return {
    authProfile,
    crew: null,
    hasCrewProfile: false,
    employeeProfile: null,
    shifts,
    hours,
    messages,
    documents,
    availability: [],
    stats: getEmployeePortalStats(shifts, hours, messages, documents),
    nextShift: null,
    upcomingShifts: [],
    pendingActions: [],
    displayName,
    errorMessage,
  };
}

/** Load all medewerkersportaal data for the current session (cached per request). */
export const getEmployeePortalBundle = cache(
  async (): Promise<EmployeePortalBundle | null> => {
    const { user, profile } = await getCurrentUser();
    if (!user || !profile) return null;

    const email = profile.email ?? user.email ?? null;
    const { crew, error } = await resolveCrewMemberForUser(user.id, email);

    if (!crew) {
      return emptyBundle(profile, error);
    }

    const [shifts, hours, messages, availability] = await Promise.all([
      fetchCrewShifts(crew.id),
      fetchCrewHours(crew.id),
      fetchCrewMessages(crew.email ?? email),
      fetchCrewAvailability(crew.id),
    ]);

    const documents = documentsFromCrew(crew);
    const employeeProfile = mapCrewToEmployeeProfile(crew);
    if (!employeeProfile.email && email) {
      employeeProfile.email = email;
    }

    const displayName =
      crew.full_name?.trim() ||
      profile.full_name?.trim() ||
      email?.split("@")[0] ||
      "medewerker";

    return {
      authProfile: profile,
      crew,
      hasCrewProfile: true,
      employeeProfile,
      shifts,
      hours,
      messages,
      documents,
      availability,
      stats: getEmployeePortalStats(shifts, hours, messages, documents),
      nextShift: getNextShift(shifts),
      upcomingShifts: getUpcomingShifts(shifts),
      pendingActions: getPendingActions(messages, documents, hours),
      displayName,
      errorMessage: error,
    };
  },
);

/** Hours this week helper for tests / summaries. */
export function hoursInCurrentWeek(hours: EmployeeHoursEntry[]): number {
  const from = startOfWeek();
  const to = endOfWeek();
  return hours
    .filter((h) => {
      const d = new Date(`${h.date}T12:00:00`);
      return d >= from && d <= to;
    })
    .reduce((sum, h) => sum + h.workedHours, 0);
}
