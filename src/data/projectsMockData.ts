export type ProjectStatus =
  | "aanvraag"
  | "planning"
  | "bevestigd"
  | "actief"
  | "urencontrole"
  | "gefactureerd"
  | "afgerond"
  | "geannuleerd";

export type ProjectType =
  | "festival"
  | "concert"
  | "horeca"
  | "beurs"
  | "sportevenement"
  | "corporate_event"
  | "stagehands"
  | "productie"
  | "logistiek"
  | "overig";

export type CrewStatus =
  | "nog_nodig"
  | "deels_ingepland"
  | "volledig_ingepland"
  | "overbezet";

export type ProjectRole = {
  id: string;
  roleName: string;
  quantityNeeded: number;
  quantityPlanned: number;
  hourlyRate?: number;
};

export type ProjectActivity = {
  id: string;
  action: string;
  message?: string;
  timestamp: string;
  user?: string;
};

export type Project = {
  id: string;
  naam: string;
  opdrachtgever: string;
  contact: string;
  email: string;
  telefoon: string;
  locatie: string;
  startDatum: string;
  eindDatum?: string;
  startTijd: string;
  eindTijd: string;
  type: ProjectType;
  status: ProjectStatus;
  planner: string;
  crewNodig: number;
  crewIngepland: number;
  crewStatus: CrewStatus;
  uurtarief?: number;
  reiskostenPerKm?: number;
  verwachteOmzet: number;
  notities?: string;
  crewBriefing?: string;
  functiesNodig?: string;
  urenStatus?: "open" | "ingediend" | "goedgekeurd";
  facturatieStatus?: "niet_gestart" | "voorbereid" | "verzonden" | "betaald";
  roles?: ProjectRole[];
  activityLog?: ProjectActivity[];
  createdAt?: string;
};

export type ProjectKpi = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: "active" | "planning" | "crew" | "week" | "completed";
};

export type ProjectStatusSummary = {
  status: ProjectStatus;
  count: number;
  value: number;
  percentage: number;
};

export type ProjectWeekItem = {
  id: string;
  projectId: string;
  datum: string;
  dag: string;
  project: string;
  locatie: string;
  crewStatus: CrewStatus;
  crewNodig: number;
  startTijd: string;
  planner: string;
};

export const PROJECT_STATUSES: ProjectStatus[] = [
  "aanvraag",
  "planning",
  "bevestigd",
  "actief",
  "urencontrole",
  "gefactureerd",
  "afgerond",
  "geannuleerd",
];

export const PROJECT_TYPES: ProjectType[] = [
  "festival",
  "concert",
  "horeca",
  "beurs",
  "sportevenement",
  "corporate_event",
  "stagehands",
  "productie",
  "logistiek",
  "overig",
];

export const CREW_STATUSES: CrewStatus[] = [
  "nog_nodig",
  "deels_ingepland",
  "volledig_ingepland",
  "overbezet",
];

export const PROJECT_PLANNERS = ["Jaeden", "Mesbah", "Tyrone"];

const defaultRoles: ProjectRole[] = [
  { id: "r1", roleName: "Stagehand", quantityNeeded: 8, quantityPlanned: 5, hourlyRate: 22 },
  { id: "r2", roleName: "Runner", quantityNeeded: 4, quantityPlanned: 4, hourlyRate: 20 },
  { id: "r3", roleName: "Teamcaptain", quantityNeeded: 1, quantityPlanned: 0, hourlyRate: 28 },
];

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    naam: "Beach Festival",
    opdrachtgever: "Eventbedrijf Noord",
    contact: "Mark de Vries",
    email: "mark@eventbedrijfnoord.nl",
    telefoon: "06-12345678",
    locatie: "Scheveningen",
    startDatum: "2026-07-12",
    eindDatum: "2026-07-12",
    startTijd: "08:00",
    eindTijd: "23:00",
    type: "festival",
    status: "bevestigd",
    planner: "Jaeden",
    crewNodig: 12,
    crewIngepland: 9,
    crewStatus: "deels_ingepland",
    uurtarief: 24,
    verwachteOmzet: 8400,
    crewBriefing: "Zwarte kleding, stevige schoenen. Report bij crew ingang.",
    roles: defaultRoles,
    urenStatus: "open",
    facturatieStatus: "niet_gestart",
    createdAt: "2026-06-01T10:00:00Z",
    activityLog: [
      { id: "a1", action: "Project aangemaakt", timestamp: "2026-06-01T10:00:00Z", user: "Jaeden" },
    ],
  },
  {
    id: "proj-002",
    naam: "Corporate Event Noord",
    opdrachtgever: "Van Ham Group",
    contact: "Naomi Peters",
    email: "naomi@vanhamgroup.nl",
    telefoon: "06-45678901",
    locatie: "Amsterdam",
    startDatum: "2026-07-11",
    startTijd: "14:00",
    eindTijd: "22:00",
    type: "corporate_event",
    status: "planning",
    planner: "Mesbah",
    crewNodig: 6,
    crewIngepland: 3,
    crewStatus: "deels_ingepland",
    uurtarief: 26,
    verwachteOmzet: 3900,
    createdAt: "2026-06-15T08:00:00Z",
  },
  {
    id: "proj-003",
    naam: "Concert Load-out",
    opdrachtgever: "Stadion Events",
    contact: "Rick van Dijk",
    email: "rick@stadionevents.nl",
    telefoon: "06-56789012",
    locatie: "Rotterdam Ahoy",
    startDatum: "2026-07-13",
    startTijd: "06:00",
    eindTijd: "14:00",
    type: "concert",
    status: "actief",
    planner: "Tyrone",
    crewNodig: 10,
    crewIngepland: 10,
    crewStatus: "volledig_ingepland",
    uurtarief: 25,
    verwachteOmzet: 5000,
    crewBriefing: "Load-out na concert. Handschoenen verplicht.",
    urenStatus: "ingediend",
    facturatieStatus: "niet_gestart",
    createdAt: "2026-05-20T12:00:00Z",
  },
  {
    id: "proj-004",
    naam: "Horeca Support Diner",
    opdrachtgever: "Restaurant De Haven",
    contact: "Emma de Boer",
    email: "emma@dehaven.nl",
    telefoon: "06-78901234",
    locatie: "Utrecht",
    startDatum: "2026-07-10",
    startTijd: "16:00",
    eindTijd: "23:30",
    type: "horeca",
    status: "bevestigd",
    planner: "Jaeden",
    crewNodig: 4,
    crewIngepland: 4,
    crewStatus: "volledig_ingepland",
    uurtarief: 22,
    verwachteOmzet: 1760,
    createdAt: "2026-06-28T09:00:00Z",
  },
  {
    id: "proj-005",
    naam: "Sportevent Crew",
    opdrachtgever: "Sport Events BV",
    contact: "Peter Kuipers",
    email: "peter@sportevents.nl",
    telefoon: "06-89012345",
    locatie: "Hilversum",
    startDatum: "2026-07-12",
    startTijd: "07:00",
    eindTijd: "18:00",
    type: "sportevenement",
    status: "planning",
    planner: "Mesbah",
    crewNodig: 8,
    crewIngepland: 2,
    crewStatus: "nog_nodig",
    uurtarief: 23,
    verwachteOmzet: 4400,
    createdAt: "2026-07-01T14:00:00Z",
  },
  {
    id: "proj-006",
    naam: "Beurs Opbouw",
    opdrachtgever: "Beurs van Berlage",
    contact: "Tom Jansen",
    email: "tom@beursvanberlage.nl",
    telefoon: "06-34567890",
    locatie: "Amsterdam",
    startDatum: "2026-07-08",
    startTijd: "06:00",
    eindTijd: "16:00",
    type: "beurs",
    status: "actief",
    planner: "Tyrone",
    crewNodig: 15,
    crewIngepland: 12,
    crewStatus: "deels_ingepland",
    uurtarief: 24,
    verwachteOmzet: 7200,
    urenStatus: "open",
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "proj-007",
    naam: "Festival Zomerlicht",
    opdrachtgever: "Festival Zomerlicht",
    contact: "Daan Mulder",
    email: "daan@zomerlicht.nl",
    telefoon: "06-01234567",
    locatie: "Biddinghuizen",
    startDatum: "2026-07-18",
    eindDatum: "2026-07-20",
    startTijd: "08:00",
    eindTijd: "02:00",
    type: "festival",
    status: "aanvraag",
    planner: "Jaeden",
    crewNodig: 25,
    crewIngepland: 0,
    crewStatus: "nog_nodig",
    verwachteOmzet: 18500,
    createdAt: "2026-07-03T11:00:00Z",
  },
  {
    id: "proj-008",
    naam: "Productie Assist",
    opdrachtgever: "Catering Groep BV",
    contact: "Lisa Vermeer",
    email: "lisa@cateringgroep.nl",
    telefoon: "06-67890123",
    locatie: "Den Haag",
    startDatum: "2026-06-28",
    startTijd: "09:00",
    eindTijd: "17:00",
    type: "productie",
    status: "afgerond",
    planner: "Mesbah",
    crewNodig: 5,
    crewIngepland: 5,
    crewStatus: "volledig_ingepland",
    uurtarief: 23,
    verwachteOmzet: 2300,
    urenStatus: "goedgekeurd",
    facturatieStatus: "betaald",
    createdAt: "2026-06-01T08:00:00Z",
  },
  {
    id: "proj-009",
    naam: "Stagehands Arena",
    opdrachtgever: "Concert Promotions",
    contact: "Sofia Bakker",
    email: "sofia@concertpromo.nl",
    telefoon: "06-23456789",
    locatie: "Groningen",
    startDatum: "2026-06-20",
    startTijd: "10:00",
    eindTijd: "20:00",
    type: "stagehands",
    status: "gefactureerd",
    planner: "Tyrone",
    crewNodig: 8,
    crewIngepland: 8,
    crewStatus: "volledig_ingepland",
    verwachteOmzet: 4800,
    urenStatus: "goedgekeurd",
    facturatieStatus: "verzonden",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "proj-010",
    naam: "Logistiek Hub",
    opdrachtgever: "Horeca Partners",
    contact: "Anna Smit",
    email: "anna@horecapartners.nl",
    telefoon: "06-90123456",
    locatie: "Eindhoven",
    startDatum: "2026-06-10",
    startTijd: "07:00",
    eindTijd: "15:00",
    type: "logistiek",
    status: "geannuleerd",
    planner: "Jaeden",
    crewNodig: 3,
    crewIngepland: 0,
    crewStatus: "nog_nodig",
    verwachteOmzet: 0,
    createdAt: "2026-05-25T09:00:00Z",
  },
];

export const mockProjectsThisWeek: ProjectWeekItem[] = [
  {
    id: "pw-1",
    projectId: "proj-001",
    datum: "2026-07-12",
    dag: "Zaterdag",
    project: "Beach Festival",
    locatie: "Scheveningen",
    crewStatus: "deels_ingepland",
    crewNodig: 12,
    startTijd: "08:00",
    planner: "Jaeden",
  },
  {
    id: "pw-2",
    projectId: "proj-002",
    datum: "2026-07-11",
    dag: "Vrijdag",
    project: "Corporate Event Noord",
    locatie: "Amsterdam",
    crewStatus: "deels_ingepland",
    crewNodig: 6,
    startTijd: "14:00",
    planner: "Mesbah",
  },
  {
    id: "pw-3",
    projectId: "proj-003",
    datum: "2026-07-13",
    dag: "Zondag",
    project: "Concert Load-out",
    locatie: "Rotterdam Ahoy",
    crewStatus: "volledig_ingepland",
    crewNodig: 10,
    startTijd: "06:00",
    planner: "Tyrone",
  },
  {
    id: "pw-4",
    projectId: "proj-004",
    datum: "2026-07-10",
    dag: "Donderdag",
    project: "Horeca Support Diner",
    locatie: "Utrecht",
    crewStatus: "volledig_ingepland",
    crewNodig: 4,
    startTijd: "16:00",
    planner: "Jaeden",
  },
  {
    id: "pw-5",
    projectId: "proj-005",
    datum: "2026-07-12",
    dag: "Zaterdag",
    project: "Sportevent Crew",
    locatie: "Hilversum",
    crewStatus: "nog_nodig",
    crewNodig: 8,
    startTijd: "07:00",
    planner: "Mesbah",
  },
];

export const mockProjectKpis: ProjectKpi[] = [
  { id: "active", title: "Actieve projecten", value: "6", detail: "In uitvoering", icon: "active" },
  { id: "planning", title: "Projecten in planning", value: "4", detail: "Nog te bevestigen", icon: "planning" },
  { id: "crew", title: "Crew nodig", value: "18", detail: "Open posities", icon: "crew" },
  { id: "week", title: "Projecten deze week", value: "5", detail: "Gepland", icon: "week" },
  { id: "completed", title: "Afgerond deze maand", value: "9", detail: "Inclusief gefactureerd", icon: "completed" },
];
