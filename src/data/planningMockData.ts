export type ShiftStatus =
  | "open"
  | "deels_ingepland"
  | "volledig_ingepland"
  | "bevestigd"
  | "urencontrole"
  | "afgerond"
  | "geannuleerd";

export type ShiftbaseSyncStatus = "niet_gesynct" | "gesynct" | "fout" | "bezig";

export type HoursStatus = "open" | "gecontroleerd" | "goedgekeurd" | "afgekeurd";

export type TravelCalcStatus =
  | "niet_berekend"
  | "berekend"
  | "adres_ontbreekt"
  | "locatieadres_ontbreekt";

export type PlanningView = "dag" | "week" | "project" | "crew" | "open";

export type PlanningShift = {
  id: string;
  projectId?: string;
  title: string;
  clientName: string;
  locationName: string;
  locationAddress: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  roleName: string;
  crewNeeded: number;
  crewPlanned: number;
  customerHourlyRate?: number;
  crewHourlyRate?: number;
  travelFeePerKm: number;
  description?: string;
  internalNotes?: string;
  crewBriefing?: string;
  clothingRequirements?: string;
  contactName?: string;
  contactPhone?: string;
  status: ShiftStatus;
  shiftbaseShiftId?: string;
  shiftbaseSyncStatus: ShiftbaseSyncStatus;
  shiftbaseLastSyncedAt?: string;
  hoursStatus?: string;
  travelStatus?: string;
  planner: string;
  shiftbaseLocation?: string;
  shiftbaseTeam?: string;
  shiftbaseDepartment?: string;
};

export type PlanningCrewMember = {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  email: string;
  availability: "beschikbaar" | "deels" | "niet_beschikbaar";
  homeCity: string;
  shiftbaseEmployeeId?: string;
  shiftbaseStatus?: "actief" | "inactief" | "onbekend";
  expectedKm?: number;
  status?: string;
};

export type PlanningAssignment = {
  id: string;
  shiftId: string;
  crewMemberId: string;
  crewName: string;
  roleName: string;
  status: "gepland" | "bevestigd" | "afgerond" | "geannuleerd";
  homeCity?: string;
  travelKmOneWay?: number;
  travelKmReturn?: number;
  travelFeePerKm: number;
  travelFeeTotal?: number;
  travelCalculationStatus: TravelCalcStatus;
  shiftbaseEmployeeId?: string;
};

export type PlanningHours = {
  id: string;
  shiftId: string;
  assignmentId: string;
  crewMemberId: string;
  crewName: string;
  shiftTitle: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  breakMinutes: number;
  plannedHours: number;
  workedHours: number;
  overtimeHours: number;
  status: HoursStatus;
  source: string;
  notes?: string;
};

export type PlanningKpi = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: "shifts" | "crew" | "open" | "hours" | "travel";
};

export const SHIFT_STATUSES: ShiftStatus[] = [
  "open",
  "deels_ingepland",
  "volledig_ingepland",
  "bevestigd",
  "urencontrole",
  "afgerond",
  "geannuleerd",
];

export const WEEK_DAYS = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
] as const;

export const PLANNING_PLANNERS = ["Jaeden", "Mesbah", "Tyrone"];

function shiftDate(dayOffset: number, hourStart: number, hourEnd: number): {
  start: string;
  end: string;
  date: string;
} {
  const base = new Date("2026-07-06T00:00:00");
  base.setDate(base.getDate() + dayOffset);
  const date = base.toISOString().slice(0, 10);
  const start = new Date(base);
  start.setHours(hourStart, 0, 0, 0);
  const end = new Date(base);
  end.setHours(hourEnd, 0, 0, 0);
  return { start: start.toISOString(), end: end.toISOString(), date };
}

export const mockPlanningCrew: PlanningCrewMember[] = [
  {
    id: "crew-001",
    fullName: "Mesbah Kashit",
    role: "Stagehand",
    phone: "06-11111111",
    email: "mesbah@helpinghands.nl",
    availability: "beschikbaar",
    homeCity: "Amsterdam",
    shiftbaseEmployeeId: "sb-101",
    shiftbaseStatus: "actief",
    expectedKm: 18,
  },
  {
    id: "crew-002",
    fullName: "Norman Velu",
    role: "Runner",
    phone: "06-22222222",
    email: "norman@helpinghands.nl",
    availability: "beschikbaar",
    homeCity: "Rotterdam",
    shiftbaseEmployeeId: "sb-102",
    shiftbaseStatus: "actief",
    expectedKm: 32,
  },
  {
    id: "crew-003",
    fullName: "Desley Boom",
    role: "Stagehand",
    phone: "06-33333333",
    email: "desley@helpinghands.nl",
    availability: "deels",
    homeCity: "Utrecht",
    shiftbaseEmployeeId: "sb-103",
    shiftbaseStatus: "actief",
    expectedKm: 24,
  },
  {
    id: "crew-004",
    fullName: "Naomi",
    role: "Teamcaptain",
    phone: "06-44444444",
    email: "naomi@helpinghands.nl",
    availability: "beschikbaar",
    homeCity: "Den Haag",
    shiftbaseEmployeeId: "sb-104",
    shiftbaseStatus: "actief",
    expectedKm: 12,
  },
  {
    id: "crew-005",
    fullName: "Fabrice",
    role: "Logistiek",
    phone: "06-55555555",
    email: "fabrice@helpinghands.nl",
    availability: "beschikbaar",
    homeCity: "Hilversum",
    shiftbaseEmployeeId: "sb-105",
    shiftbaseStatus: "actief",
    expectedKm: 28,
  },
  {
    id: "crew-006",
    fullName: "Dennis",
    role: "Horeca support",
    phone: "06-66666666",
    email: "dennis@helpinghands.nl",
    availability: "niet_beschikbaar",
    homeCity: "Leiden",
    shiftbaseEmployeeId: "sb-106",
    shiftbaseStatus: "actief",
    expectedKm: 35,
  },
];

const s1 = shiftDate(0, 8, 23);
const s2 = shiftDate(1, 14, 22);
const s3 = shiftDate(2, 6, 14);
const s4 = shiftDate(3, 16, 23);
const s5 = shiftDate(4, 7, 18);
const s6 = shiftDate(5, 8, 23);
const s7 = shiftDate(6, 6, 14);
const s8 = shiftDate(1, 8, 16);

export const mockPlanningShifts: PlanningShift[] = [
  {
    id: "shift-001",
    title: "Beach Festival",
    clientName: "Eventbedrijf Noord",
    locationName: "Scheveningen",
    locationAddress: "Strandweg 1, 2586 Den Haag",
    startTime: s6.start,
    endTime: s6.end,
    breakMinutes: 30,
    roleName: "Stagehand",
    crewNeeded: 8,
    crewPlanned: 5,
    customerHourlyRate: 24,
    crewHourlyRate: 18,
    travelFeePerKm: 0.25,
    crewBriefing: "Zwarte kleding, stevige schoenen.",
    clothingRequirements: "All black, closed shoes",
    contactName: "Mark de Vries",
    contactPhone: "06-12345678",
    status: "deels_ingepland",
    shiftbaseSyncStatus: "gesynct",
    shiftbaseShiftId: "sb-shift-001",
    shiftbaseLastSyncedAt: "2026-07-05T10:00:00Z",
    hoursStatus: "open",
    travelStatus: "berekend",
    planner: "Jaeden",
  },
  {
    id: "shift-002",
    title: "Corporate Event Noord",
    clientName: "Van Ham Group",
    locationName: "Amsterdam",
    locationAddress: "Damrak 1, 1012 LG Amsterdam",
    startTime: s2.start,
    endTime: s2.end,
    breakMinutes: 15,
    roleName: "Runner",
    crewNeeded: 4,
    crewPlanned: 2,
    customerHourlyRate: 26,
    crewHourlyRate: 19,
    travelFeePerKm: 0.25,
    status: "deels_ingepland",
    shiftbaseSyncStatus: "niet_gesynct",
    planner: "Mesbah",
  },
  {
    id: "shift-003",
    title: "Concert Load-out",
    clientName: "Stadion Events",
    locationName: "Rotterdam Ahoy",
    locationAddress: "Ahoyweg 10, 3084 BA Rotterdam",
    startTime: s7.start,
    endTime: s7.end,
    breakMinutes: 20,
    roleName: "Stagehand",
    crewNeeded: 10,
    crewPlanned: 10,
    customerHourlyRate: 25,
    crewHourlyRate: 18,
    travelFeePerKm: 0.25,
    crewBriefing: "Load-out na concert. Handschoenen verplicht.",
    status: "bevestigd",
    shiftbaseSyncStatus: "gesynct",
    shiftbaseShiftId: "sb-shift-003",
    hoursStatus: "gecontroleerd",
    planner: "Tyrone",
  },
  {
    id: "shift-004",
    title: "Horeca Support Diner",
    clientName: "Restaurant De Haven",
    locationName: "Utrecht",
    locationAddress: "Oudegracht 100, 3511 AE Utrecht",
    startTime: s4.start,
    endTime: s4.end,
    breakMinutes: 30,
    roleName: "Horeca support",
    crewNeeded: 4,
    crewPlanned: 4,
    customerHourlyRate: 22,
    crewHourlyRate: 17,
    travelFeePerKm: 0.25,
    status: "volledig_ingepland",
    shiftbaseSyncStatus: "gesynct",
    shiftbaseShiftId: "sb-shift-004",
    planner: "Jaeden",
  },
  {
    id: "shift-005",
    title: "Sportevent Crew",
    clientName: "Sport Events BV",
    locationName: "Hilversum",
    locationAddress: "Media Park 1, 1217 Hilversum",
    startTime: s6.start,
    endTime: s6.end,
    breakMinutes: 30,
    roleName: "Logistiek",
    crewNeeded: 6,
    crewPlanned: 2,
    customerHourlyRate: 23,
    crewHourlyRate: 18,
    travelFeePerKm: 0.25,
    status: "open",
    shiftbaseSyncStatus: "niet_gesynct",
    planner: "Mesbah",
  },
  {
    id: "shift-006",
    title: "Beach Festival — Opbouw",
    clientName: "Eventbedrijf Noord",
    locationName: "Scheveningen",
    locationAddress: "Strandweg 1, 2586 Den Haag",
    startTime: s1.start,
    endTime: s1.end,
    breakMinutes: 30,
    roleName: "Stagehand",
    crewNeeded: 6,
    crewPlanned: 6,
    customerHourlyRate: 24,
    crewHourlyRate: 18,
    travelFeePerKm: 0.25,
    status: "bevestigd",
    shiftbaseSyncStatus: "gesynct",
    shiftbaseShiftId: "sb-shift-006",
    planner: "Jaeden",
  },
  {
    id: "shift-007",
    title: "Corporate Event — Breakdown",
    clientName: "Van Ham Group",
    locationName: "Amsterdam",
    locationAddress: "Damrak 1, 1012 LG Amsterdam",
    startTime: s8.start,
    endTime: s8.end,
    breakMinutes: 15,
    roleName: "Runner",
    crewNeeded: 3,
    crewPlanned: 0,
    customerHourlyRate: 26,
    crewHourlyRate: 19,
    travelFeePerKm: 0.25,
    status: "open",
    shiftbaseSyncStatus: "niet_gesynct",
    planner: "Mesbah",
  },
  {
    id: "shift-008",
    title: "Concert Load-in",
    clientName: "Stadion Events",
    locationName: "Rotterdam Ahoy",
    locationAddress: "Ahoyweg 10, 3084 BA Rotterdam",
    startTime: s3.start,
    endTime: s3.end,
    breakMinutes: 20,
    roleName: "Stagehand",
    crewNeeded: 8,
    crewPlanned: 7,
    customerHourlyRate: 25,
    crewHourlyRate: 18,
    travelFeePerKm: 0.25,
    status: "deels_ingepland",
    shiftbaseSyncStatus: "fout",
    planner: "Tyrone",
  },
];

export const mockPlanningAssignments: PlanningAssignment[] = [
  {
    id: "asgn-001",
    shiftId: "shift-001",
    crewMemberId: "crew-001",
    crewName: "Mesbah Kashit",
    roleName: "Stagehand",
    status: "bevestigd",
    homeCity: "Amsterdam",
    travelKmOneWay: 18,
    travelKmReturn: 36,
    travelFeePerKm: 0.25,
    travelFeeTotal: 9,
    travelCalculationStatus: "berekend",
    shiftbaseEmployeeId: "sb-101",
  },
  {
    id: "asgn-002",
    shiftId: "shift-001",
    crewMemberId: "crew-003",
    crewName: "Desley Boom",
    roleName: "Stagehand",
    status: "gepland",
    homeCity: "Utrecht",
    travelKmOneWay: 24,
    travelKmReturn: 48,
    travelFeePerKm: 0.25,
    travelFeeTotal: 12,
    travelCalculationStatus: "berekend",
    shiftbaseEmployeeId: "sb-103",
  },
  {
    id: "asgn-003",
    shiftId: "shift-003",
    crewMemberId: "crew-002",
    crewName: "Norman Velu",
    roleName: "Runner",
    status: "bevestigd",
    homeCity: "Rotterdam",
    travelKmOneWay: 8,
    travelKmReturn: 16,
    travelFeePerKm: 0.25,
    travelFeeTotal: 4,
    travelCalculationStatus: "berekend",
    shiftbaseEmployeeId: "sb-102",
  },
  {
    id: "asgn-004",
    shiftId: "shift-003",
    crewMemberId: "crew-001",
    crewName: "Mesbah Kashit",
    roleName: "Stagehand",
    status: "bevestigd",
    homeCity: "Amsterdam",
    travelKmOneWay: 32,
    travelKmReturn: 64,
    travelFeePerKm: 0.25,
    travelFeeTotal: 16,
    travelCalculationStatus: "berekend",
    shiftbaseEmployeeId: "sb-101",
  },
];

export const mockPlanningHours: PlanningHours[] = [
  {
    id: "hrs-001",
    shiftId: "shift-003",
    assignmentId: "asgn-003",
    crewMemberId: "crew-002",
    crewName: "Norman Velu",
    shiftTitle: "Concert Load-out",
    plannedStartTime: s7.start,
    plannedEndTime: s7.end,
    actualStartTime: s7.start,
    actualEndTime: s7.end,
    breakMinutes: 20,
    plannedHours: 8,
    workedHours: 8,
    overtimeHours: 0,
    status: "goedgekeurd",
    source: "shiftbase",
  },
  {
    id: "hrs-002",
    shiftId: "shift-003",
    assignmentId: "asgn-004",
    crewMemberId: "crew-001",
    crewName: "Mesbah Kashit",
    shiftTitle: "Concert Load-out",
    plannedStartTime: s7.start,
    plannedEndTime: s7.end,
    actualStartTime: s7.start,
    actualEndTime: s7.end,
    breakMinutes: 20,
    plannedHours: 8,
    workedHours: 7.75,
    overtimeHours: 0,
    status: "open",
    source: "shiftbase",
    notes: "15 min later gestart",
  },
  {
    id: "hrs-003",
    shiftId: "shift-001",
    assignmentId: "asgn-001",
    crewMemberId: "crew-003",
    crewName: "Desley Boom",
    shiftTitle: "Beach Festival",
    plannedStartTime: s6.start,
    plannedEndTime: s6.end,
    breakMinutes: 30,
    plannedHours: 8,
    workedHours: 8.5,
    overtimeHours: 0.5,
    status: "gecontroleerd",
    source: "shiftbase",
    notes: "Overuren door late breakdown",
  },
];

export const mockPlanningKpis: PlanningKpi[] = [
  { id: "shifts", title: "Shifts deze week", value: "24", detail: "Gepland", icon: "shifts" },
  { id: "crew", title: "Crew ingepland", value: "38", detail: "Posities bezet", icon: "crew" },
  { id: "open", title: "Openstaande diensten", value: "7", detail: "Nog in te vullen", icon: "open" },
  { id: "hours", title: "Uren deze week", value: "286", detail: "Gepland + gewerkt", icon: "hours" },
  {
    id: "travel",
    title: "Kilometervergoeding",
    value: "€412,50",
    detail: "Deze week",
    icon: "travel",
  },
];
