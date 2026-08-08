/**
 * Medewerkersportaal — types and pure helpers.
 * Live data: `@/lib/employee-portal/data` (Supabase).
 */

export type EmployeeProfile = {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  employmentType: "ZZP" | "Loondienst" | "Payroll" | "Onbekend";
  status: "Actief" | "Onboarding" | "Inactief";
  roles: string[];
  skills: string[];
  certificates: string[];
  hasDriversLicense: boolean;
  hasCar: boolean;
  ibanStatus: "Niet ingevuld" | "Ingediend" | "Goedgekeurd";
  documentStatus: "Compleet" | "Mist gegevens" | "In controle";
  planningNotes?: string;
};

export type EmployeeShift = {
  id: string;
  projectName: string;
  clientName?: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  locationAddress: string;
  role: string;
  status: "Aangevraagd" | "Bevestigd" | "In uitvoering" | "Afgerond" | "Geannuleerd";
  briefing?: string;
  clothing?: string;
  contactPerson?: string;
  meetingPoint?: string;
  travelInfo?: string;
  shiftbaseShiftId?: string;
};

export type EmployeeAvailability = {
  id: string;
  date: string;
  availability: "Beschikbaar" | "Niet beschikbaar" | "Misschien";
  startTime?: string;
  endTime?: string;
  notes?: string;
};

export type EmployeeHoursCorrectionRequest = {
  reason: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  requestedBreakMinutes?: number;
  requestedKilometers?: number;
  explanation: string;
  requestedAt: string;
  status: "Ingediend" | "In behandeling" | "Afgehandeld";
};

export type EmployeeHoursEntry = {
  id: string;
  shiftId?: string;
  projectId?: string;
  projectName: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  workedHours: number;
  kilometers: number;
  travelTimeHours: number;
  /** Raw DB status for edit rules (shared ecosystem). */
  dbStatus?: "draft" | "submitted" | "approved" | "rejected" | "invoiced";
  status:
    | "Concept"
    | "Ingediend"
    | "Goedgekeurd"
    | "Afgekeurd"
    | "Gefactureerd"
    | "Correctie aangevraagd";
  notes?: string;
  correctionRequest?: EmployeeHoursCorrectionRequest;
};

/** Shift option for submitting own uren + km. */
export type EmployeeHoursShiftOption = {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  startTime: string;
  endTime: string;
  hasTimeEntry: boolean;
};

/**
 * Medewerker mag geen uren goedkeuren (dat is intern).
 * Alleen correctie indienen bij openstaande/beoordeelde uren — niet bij gefactureerd of al lopende correctie.
 */
export function canEmployeeSubmitHoursCorrection(entry: EmployeeHoursEntry): boolean {
  if (entry.status === "Correctie aangevraagd") return false;
  if (entry.status === "Gefactureerd") return false;
  return (
    entry.status === "Concept" ||
    entry.status === "Ingediend" ||
    entry.status === "Goedgekeurd" ||
    entry.status === "Afgekeurd"
  );
}

/** Direct edit of uren/km — only concept / ingediend / afgekeurd (not approved/invoiced). */
export function canEmployeeEditOwnHours(entry: EmployeeHoursEntry): boolean {
  if (entry.dbStatus) {
    return (
      entry.dbStatus === "draft" ||
      entry.dbStatus === "submitted" ||
      entry.dbStatus === "rejected"
    );
  }
  return (
    entry.status === "Concept" ||
    entry.status === "Ingediend" ||
    entry.status === "Afgekeurd"
  );
}

export type EmployeeMessage = {
  id: string;
  title: string;
  body: string;
  type: "Planning" | "Briefing" | "Uren" | "Documenten" | "Algemeen";
  status: "Nieuw" | "Gelezen" | "Actie nodig";
  createdAt: string;
  relatedShiftId?: string;
};

export type EmployeeDocument = {
  id: string;
  title: string;
  type: "Contract" | "ID" | "Certificaat" | "IBAN" | "Briefing" | "Overig";
  status: "Niet ingeleverd" | "Ingeleverd" | "Goedgekeurd" | "Afgekeurd" | "Verloopt binnenkort";
  uploadedAt?: string;
  expiresAt?: string;
};

export type EmployeePortalStats = {
  upcomingShifts: number;
  hoursThisWeek: number;
  openActions: number;
  newMessages: number;
};

function parseShiftDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function isUpcomingShift(shift: EmployeeShift): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const shiftDate = parseShiftDate(shift.date);
  return (
    shiftDate >= today &&
    shift.status !== "Afgerond" &&
    shift.status !== "Geannuleerd"
  );
}

export function getUpcomingShifts(shifts: EmployeeShift[] = []): EmployeeShift[] {
  return shifts
    .filter(isUpcomingShift)
    .sort((a, b) => parseShiftDate(a.date).getTime() - parseShiftDate(b.date).getTime());
}

export function getNextShift(shifts: EmployeeShift[] = []): EmployeeShift | null {
  return getUpcomingShifts(shifts)[0] ?? null;
}

export function getEmployeePortalStats(
  shifts: EmployeeShift[] = [],
  hours: EmployeeHoursEntry[] = [],
  messages: EmployeeMessage[] = [],
  documents: EmployeeDocument[] = [],
): EmployeePortalStats {
  const upcoming = getUpcomingShifts(shifts);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const hoursThisWeek = hours
    .filter((entry) => {
      const d = parseShiftDate(entry.date);
      return d >= weekStart && d < weekEnd;
    })
    .reduce((sum, entry) => sum + entry.workedHours, 0);

  const openActions =
    messages.filter((m) => m.status === "Actie nodig" || m.status === "Nieuw").length +
    documents.filter((d) => d.status === "Niet ingeleverd" || d.status === "Verloopt binnenkort")
      .length +
    hours.filter(
      (h) =>
        h.status === "Ingediend" ||
        h.status === "Concept" ||
        h.status === "Afgekeurd" ||
        h.status === "Correctie aangevraagd",
    ).length;

  return {
    upcomingShifts: upcoming.length,
    hoursThisWeek: Math.round(hoursThisWeek * 100) / 100,
    openActions,
    newMessages: messages.filter((m) => m.status === "Nieuw").length,
  };
}

export function getPendingActions(
  messages: EmployeeMessage[] = [],
  documents: EmployeeDocument[] = [],
  hours: EmployeeHoursEntry[] = [],
): { label: string; href: string; type: string }[] {
  const actions: { label: string; href: string; type: string }[] = [];

  for (const msg of messages) {
    if (msg.status === "Actie nodig" || msg.status === "Nieuw") {
      actions.push({
        label: msg.title,
        href: "/portaal/medewerkers/berichten",
        type: msg.type,
      });
    }
  }
  for (const doc of documents) {
    if (doc.status === "Niet ingeleverd" || doc.status === "Verloopt binnenkort") {
      actions.push({
        label: `${doc.title} — ${doc.status}`,
        href: "/portaal/medewerkers/documenten",
        type: "Document",
      });
    }
  }
  for (const entry of hours) {
    if (
      entry.status === "Ingediend" ||
      entry.status === "Afgekeurd" ||
      entry.status === "Correctie aangevraagd"
    ) {
      actions.push({
        label: `Uren bekijken: ${entry.projectName}`,
        href: "/portaal/medewerkers/uren",
        type: "Uren",
      });
    }
  }

  return actions.slice(0, 6);
}

export function formatShiftDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatShiftTimeRange(start: string, end: string): string {
  return `${start} – ${end}`;
}

export function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export type EmployeeIntegrationItem = {
  id: string;
  name: string;
  checkUrl?: string;
};

export const EMPLOYEE_INTEGRATIONS: EmployeeIntegrationItem[] = [
  { id: "shiftbase", name: "Shiftbase", checkUrl: "/api/shiftbase" },
  { id: "whatsapp", name: "WhatsApp", checkUrl: "/api/whatsapp/status" },
  { id: "gmail", name: "Gmail" },
  { id: "supabase", name: "Supabase" },
];
