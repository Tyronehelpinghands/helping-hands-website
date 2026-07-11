// TODO: later koppelen aan Supabase hours database
// TODO: Shiftbase uren import
// TODO: Google Maps kilometerberekening via /api/kilometers
// TODO: Moneybird facturatie
// TODO: Fooks/payroll export
// TODO: Goedkeuringsflow per planner/admin
// TODO: Crew zelf uren laten controleren
// TODO: Opdrachtgever uren laten accorderen
// TODO: later koppelen aan echte auth/rollen zodat alleen interne admins/planners uren kunnen bekijken

export type HoursStatus =
  | "Concept"
  | "Ingediend"
  | "Goedgekeurd"
  | "Afgekeurd"
  | "Gefactureerd";

export type HoursSource = "Handmatig" | "Shiftbase" | "Import" | "Correctie";

export type HoursEmploymentType = "ZZP" | "Loondienst" | "Payroll" | "Onbekend";

export type HoursEntry = {
  id: string;
  date: string;
  weekNumber: number;
  projectName: string;
  clientName: string;
  locationName: string;
  locationAddress?: string;
  crewMemberName: string;
  crewMemberId?: string;
  role: string;
  employmentType: HoursEmploymentType;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  workedHours: number;
  billableHours: number;
  clientHourlyRate: number;
  crewHourlyRate?: number;
  kilometers: number;
  travelRatePerKm: number;
  travelCost: number;
  revenueAmount: number;
  crewCostAmount: number;
  marginAmount: number;
  status: HoursStatus;
  source: HoursSource;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  shiftbaseShiftId?: string;
  moneybirdInvoiceId?: string;
};

export type HoursFilters = {
  search: string;
  week: string;
  status: string;
  employmentType: string;
  source: string;
};

export const defaultHoursFilters: HoursFilters = {
  search: "",
  week: "all",
  status: "all",
  employmentType: "all",
  source: "all",
};

export const HOURS_STATUSES: HoursStatus[] = [
  "Concept",
  "Ingediend",
  "Goedgekeurd",
  "Afgekeurd",
  "Gefactureerd",
];

export const HOURS_SOURCES: HoursSource[] = [
  "Handmatig",
  "Shiftbase",
  "Import",
  "Correctie",
];

export const HOURS_EMPLOYMENT_TYPES: HoursEmploymentType[] = [
  "ZZP",
  "Loondienst",
  "Payroll",
  "Onbekend",
];

export const DEFAULT_TRAVEL_RATE_PER_KM = 0.25;

export const DEFAULT_ROLE_RATES: Record<string, number> = {
  Eventmedewerker: 31.5,
  "Horeca support": 31.5,
  Stagehand: 35,
  "Productie assistent": 34.5,
  "Logistiek medewerker": 35,
  Teamcaptain: 42.5,
  "Zelfstandig werkend kok": 40,
  "Hulp kok / keukenhulp": 32.5,
  Bartender: 34.5,
  Barback: 30.5,
  "Runner / bediening support": 29.5,
};

export const DEMO_CREW_NAMES = [
  "Demo Crew 1",
  "Demo Crew 2",
  "Demo Crew 3",
  "Demo Crew 4",
] as const;

export const DEMO_CLIENTS = ["Demo Klant 1", "Demo Klant 2", "Demo Klant 3"] as const;

export type HoursFormData = {
  projectName: string;
  clientName: string;
  locationName: string;
  locationAddress: string;
  crewMemberName: string;
  role: string;
  employmentType: HoursEmploymentType;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
  billableHours: string;
  clientHourlyRate: string;
  crewHourlyRate: string;
  travelRatePerKm: string;
  kilometers: string;
  returnTrip: boolean;
  status: HoursStatus;
  notes: string;
};

export type HoursStats = {
  totalHoursThisWeek: number;
  approvedHours: number;
  openHours: number;
  totalTravelCost: number;
  toInvoiceAmount: number;
};

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

export function calcWorkedHours(
  startTime: string,
  endTime: string,
  breakMinutes: number,
): number {
  let start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);
  if (end <= start) end += 24 * 60;
  const totalMinutes = end - start - breakMinutes;
  return round2(Math.max(0, totalMinutes) / 60);
}

export function getISOWeekNumber(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00`);
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - dayDiff + 3);
  const week =
    1 + Math.round((target.getTime() - firstThursday.getTime()) / 604800000);
  return week;
}

export function getCurrentISOWeek(): number {
  return getISOWeekNumber(new Date().toISOString().slice(0, 10));
}

export function getDefaultRateForRole(role: string): number {
  return DEFAULT_ROLE_RATES[role] ?? 31.5;
}

export function calcTravelCost(kilometers: number, ratePerKm: number): number {
  return round2(kilometers * ratePerKm);
}

export type HoursCalcInput = {
  workedHours: number;
  billableHours: number;
  clientHourlyRate: number;
  crewHourlyRate?: number;
  kilometers: number;
  travelRatePerKm: number;
};

export function calcFinancials(input: HoursCalcInput): {
  travelCost: number;
  revenueAmount: number;
  crewCostAmount: number;
  marginAmount: number;
} {
  const travelCost = calcTravelCost(input.kilometers, input.travelRatePerKm);
  const revenueAmount = round2(
    input.billableHours * input.clientHourlyRate + travelCost,
  );
  const crewRate = input.crewHourlyRate ?? 0;
  const crewCostAmount = round2(input.workedHours * crewRate + travelCost);
  const marginAmount = round2(revenueAmount - crewCostAmount);
  return { travelCost, revenueAmount, crewCostAmount, marginAmount };
}

export function buildHoursEntry(
  partial: Omit<
    HoursEntry,
    | "workedHours"
    | "billableHours"
    | "travelCost"
    | "revenueAmount"
    | "crewCostAmount"
    | "marginAmount"
    | "weekNumber"
  > & {
    workedHours?: number;
    billableHours?: number;
    weekNumber?: number;
  },
): HoursEntry {
  const workedHours =
    partial.workedHours ??
    calcWorkedHours(partial.startTime, partial.endTime, partial.breakMinutes);
  const billableHours = partial.billableHours ?? workedHours;
  const financials = calcFinancials({
    workedHours,
    billableHours,
    clientHourlyRate: partial.clientHourlyRate,
    crewHourlyRate: partial.crewHourlyRate,
    kilometers: partial.kilometers,
    travelRatePerKm: partial.travelRatePerKm,
  });

  return {
    ...partial,
    weekNumber: partial.weekNumber ?? getISOWeekNumber(partial.date),
    workedHours,
    billableHours,
    ...financials,
  };
}

function crewRateFromClient(clientRate: number): number {
  return round2(clientRate * 0.72);
}

function demoEntry(
  id: string,
  date: string,
  projectName: string,
  clientName: string,
  locationName: string,
  crewIndex: number,
  role: string,
  employmentType: HoursEmploymentType,
  startTime: string,
  endTime: string,
  breakMinutes: number,
  kilometers: number,
  status: HoursStatus,
  source: HoursSource,
  extras?: Partial<HoursEntry>,
): HoursEntry {
  const clientRate = getDefaultRateForRole(role);
  const crewRate = crewRateFromClient(clientRate);
  const billableOverride = extras?.billableHours;

  return buildHoursEntry({
    id,
    date,
    projectName,
    clientName,
    locationName,
    locationAddress: extras?.locationAddress,
    crewMemberName: DEMO_CREW_NAMES[crewIndex % DEMO_CREW_NAMES.length],
    crewMemberId: `crew-demo-${(crewIndex % 4) + 1}`,
    role,
    employmentType,
    startTime,
    endTime,
    breakMinutes,
    ...(billableOverride !== undefined ? { billableHours: billableOverride } : {}),
    clientHourlyRate: clientRate,
    crewHourlyRate: crewRate,
    kilometers,
    travelRatePerKm: DEFAULT_TRAVEL_RATE_PER_KM,
    status,
    source,
    notes: extras?.notes,
    approvedBy: extras?.approvedBy,
    approvedAt: extras?.approvedAt,
    shiftbaseShiftId: extras?.shiftbaseShiftId,
    moneybirdInvoiceId: extras?.moneybirdInvoiceId,
  });
}

export const demoHoursEntries: HoursEntry[] = [
  demoEntry(
    "hours-001",
    "2026-06-30",
    "Amsterdam RAI",
    "Demo Klant 1",
    "Hal 12",
    0,
    "Eventmedewerker",
    "ZZP",
    "08:00",
    "17:00",
    45,
    42,
    "Goedgekeurd",
    "Shiftbase",
    {
      locationAddress: "Europaplein 24, Amsterdam",
      shiftbaseShiftId: "SB-48291",
      approvedBy: "Demo Planner",
      approvedAt: "2026-07-01T09:15:00",
    },
  ),
  demoEntry(
    "hours-002",
    "2026-07-01",
    "GelreDome Arnhem",
    "Demo Klant 2",
    "Backstage",
    1,
    "Stagehand",
    "Loondienst",
    "10:00",
    "22:00",
    60,
    68,
    "Ingediend",
    "Shiftbase",
    {
      shiftbaseShiftId: "SB-48302",
      locationAddress: "Arnhem",
    },
  ),
  demoEntry(
    "hours-003",
    "2026-07-02",
    "Johan Cruijff ArenA",
    "Demo Klant 1",
    "Veldperimeter",
    2,
    "Logistiek medewerker",
    "Payroll",
    "07:30",
    "16:00",
    30,
    55,
    "Goedgekeurd",
    "Handmatig",
    { approvedBy: "Demo Planner", approvedAt: "2026-07-03T08:00:00" },
  ),
  demoEntry(
    "hours-004",
    "2026-07-03",
    "Festivalterrein",
    "Demo Klant 3",
    "Hoofdpodium",
    3,
    "Teamcaptain",
    "ZZP",
    "09:00",
    "23:00",
    90,
    0,
    "Concept",
    "Handmatig",
    { notes: "Wacht op bevestiging crewtarief." },
  ),
  demoEntry(
    "hours-005",
    "2026-06-23",
    "Horeca event Scheveningen",
    "Demo Klant 2",
    "Beach club",
    0,
    "Bartender",
    "ZZP",
    "14:00",
    "23:30",
    45,
    28,
    "Gefactureerd",
    "Import",
    {
      moneybirdInvoiceId: "MB-2026-0142",
      approvedBy: "Demo Admin",
      approvedAt: "2026-06-24T10:00:00",
    },
  ),
  demoEntry(
    "hours-006",
    "2026-06-24",
    "Restaurant ondersteuning",
    "Demo Klant 1",
    "Keuken",
    1,
    "Hulp kok / keukenhulp",
    "Loondienst",
    "11:00",
    "20:00",
    60,
    18,
    "Goedgekeurd",
    "Handmatig",
    { approvedBy: "Demo Planner" },
  ),
  demoEntry(
    "hours-007",
    "2026-06-25",
    "Load-out productie",
    "Demo Klant 3",
    "Laadperron",
    2,
    "Stagehand",
    "ZZP",
    "06:00",
    "14:00",
    30,
    72,
    "Afgekeurd",
    "Correctie",
    { notes: "Pauze niet correct ingevuld in Shiftbase." },
  ),
  demoEntry(
    "hours-008",
    "2026-07-04",
    "Beursopbouw",
    "Demo Klant 2",
    "Standbouw zone B",
    3,
    "Productie assistent",
    "Payroll",
    "07:00",
    "15:30",
    45,
    38,
    "Ingediend",
    "Shiftbase",
    { shiftbaseShiftId: "SB-48411" },
  ),
  demoEntry(
    "hours-009",
    "2026-07-05",
    "Stadionproductie",
    "Demo Klant 1",
    "Mixed zone",
    0,
    "Eventmedewerker",
    "Onbekend",
    "08:30",
    "18:00",
    45,
    48,
    "Goedgekeurd",
    "Shiftbase",
    {
      shiftbaseShiftId: "SB-48422",
      approvedBy: "Demo Planner",
    },
  ),
  demoEntry(
    "hours-010",
    "2026-07-06",
    "Backstage support",
    "Demo Klant 3",
    "Artiestenverblijf",
    1,
    "Runner / bediening support",
    "ZZP",
    "12:00",
    "21:00",
    30,
    22,
    "Ingediend",
    "Handmatig",
  ),
  demoEntry(
    "hours-011",
    "2026-06-16",
    "Amsterdam RAI",
    "Demo Klant 2",
    "Registratiebalie",
    2,
    "Horeca support",
    "Loondienst",
    "09:00",
    "17:00",
    45,
    35,
    "Gefactureerd",
    "Import",
    { moneybirdInvoiceId: "MB-2026-0098" },
  ),
  demoEntry(
    "hours-012",
    "2026-06-17",
    "Festivalterrein",
    "Demo Klant 3",
    "Bar area",
    3,
    "Barback",
    "ZZP",
    "15:00",
    "02:00",
    60,
    45,
    "Goedgekeurd",
    "Handmatig",
    {
      approvedBy: "Demo Admin",
      billableHours: 10,
    },
  ),
];

export function filterHoursEntries(
  entries: HoursEntry[],
  filters: HoursFilters,
): HoursEntry[] {
  const currentWeek = getCurrentISOWeek();
  const search = filters.search.trim().toLowerCase();

  return entries.filter((entry) => {
    if (search) {
      const haystack = [
        entry.projectName,
        entry.clientName,
        entry.locationName,
        entry.crewMemberName,
        entry.role,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.week !== "all") {
      if (filters.week === "this_week" && entry.weekNumber !== currentWeek) {
        return false;
      }
      if (filters.week === "last_week" && entry.weekNumber !== currentWeek - 1) {
        return false;
      }
      const weekMatch = filters.week.match(/^week_(\d+)$/);
      if (weekMatch && entry.weekNumber !== Number(weekMatch[1])) {
        return false;
      }
    }

    if (filters.status !== "all" && entry.status !== filters.status) {
      return false;
    }
    if (
      filters.employmentType !== "all" &&
      entry.employmentType !== filters.employmentType
    ) {
      return false;
    }
    if (filters.source !== "all" && entry.source !== filters.source) {
      return false;
    }

    return true;
  });
}

export function computeHoursStats(entries: HoursEntry[]): HoursStats {
  const currentWeek = getCurrentISOWeek();

  return entries.reduce<HoursStats>(
    (acc, entry) => {
      if (entry.weekNumber === currentWeek) {
        acc.totalHoursThisWeek = round2(
          acc.totalHoursThisWeek + entry.workedHours,
        );
      }
      if (entry.status === "Goedgekeurd") {
        acc.approvedHours = round2(acc.approvedHours + entry.workedHours);
        acc.toInvoiceAmount = round2(
          acc.toInvoiceAmount + entry.revenueAmount,
        );
      }
      if (
        entry.status === "Concept" ||
        entry.status === "Ingediend" ||
        entry.status === "Afgekeurd"
      ) {
        acc.openHours = round2(acc.openHours + entry.workedHours);
      }
      acc.totalTravelCost = round2(acc.totalTravelCost + entry.travelCost);
      return acc;
    },
    {
      totalHoursThisWeek: 0,
      approvedHours: 0,
      openHours: 0,
      totalTravelCost: 0,
      toInvoiceAmount: 0,
    },
  );
}

export function hoursEntryToFormData(entry: HoursEntry): HoursFormData {
  return {
    projectName: entry.projectName,
    clientName: entry.clientName,
    locationName: entry.locationName,
    locationAddress: entry.locationAddress ?? "",
    crewMemberName: entry.crewMemberName,
    role: entry.role,
    employmentType: entry.employmentType,
    date: entry.date,
    startTime: entry.startTime,
    endTime: entry.endTime,
    breakMinutes: String(entry.breakMinutes),
    billableHours: String(entry.billableHours),
    clientHourlyRate: String(entry.clientHourlyRate),
    crewHourlyRate: String(entry.crewHourlyRate ?? ""),
    travelRatePerKm: String(entry.travelRatePerKm),
    kilometers: String(entry.kilometers),
    returnTrip: false,
    status: entry.status,
    notes: entry.notes ?? "",
  };
}

export function createHoursFromForm(
  form: HoursFormData,
  existingId?: string,
): HoursEntry {
  const km = form.returnTrip
    ? Number(form.kilometers) * 2
    : Number(form.kilometers);
  const worked = calcWorkedHours(
    form.startTime,
    form.endTime,
    Number(form.breakMinutes) || 0,
  );
  const billable = Number(form.billableHours) || worked;

  return buildHoursEntry({
    id: existingId ?? `hours-${Date.now()}`,
    date: form.date,
    projectName: form.projectName.trim(),
    clientName: form.clientName.trim(),
    locationName: form.locationName.trim(),
    locationAddress: form.locationAddress.trim() || undefined,
    crewMemberName: form.crewMemberName.trim(),
    role: form.role.trim(),
    employmentType: form.employmentType,
    startTime: form.startTime,
    endTime: form.endTime,
    breakMinutes: Number(form.breakMinutes) || 0,
    workedHours: worked,
    billableHours: billable,
    clientHourlyRate: Number(form.clientHourlyRate) || 0,
    crewHourlyRate: Number(form.crewHourlyRate) || undefined,
    kilometers: km,
    travelRatePerKm: Number(form.travelRatePerKm) || DEFAULT_TRAVEL_RATE_PER_KM,
    status: form.status,
    source: "Handmatig",
    notes: form.notes.trim() || undefined,
  });
}

export function exportHoursToCsv(entries: HoursEntry[]): string {
  const headers = [
    "Datum",
    "Week",
    "Project",
    "Klant",
    "Locatie",
    "Crew",
    "Functie",
    "Start",
    "Eind",
    "Pauze",
    "Uren",
    "Facturabele uren",
    "Km",
    "Reiskosten",
    "Klanttarief",
    "Omzet",
    "Status",
  ];

  const rows = entries.map((e) => [
    e.date,
    String(e.weekNumber),
    e.projectName,
    e.clientName,
    e.locationName,
    e.crewMemberName,
    e.role,
    e.startTime,
    e.endTime,
    String(e.breakMinutes),
    String(e.workedHours),
    String(e.billableHours),
    String(e.kilometers),
    String(e.travelCost),
    String(e.clientHourlyRate),
    String(e.revenueAmount),
    e.status,
  ]);

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
