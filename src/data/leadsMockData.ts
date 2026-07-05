export type LeadStatus =
  | "nieuw"
  | "te_kwalificeren"
  | "benaderd"
  | "gesprek_gepland"
  | "offerte_nodig"
  | "omgezet_naar_deal"
  | "verloren";

export type LeadPriority = "laag" | "normaal" | "hoog" | "spoed";

export type LeadSource =
  | "website"
  | "hubspot"
  | "linkedin"
  | "mail"
  | "whatsapp"
  | "netwerk"
  | "bestaande_klant"
  | "handmatig";

export type LeadActivity = {
  id: string;
  type: "notitie" | "contact" | "status" | "sync" | "deal";
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
};

export type Lead = {
  id: string;
  bedrijf: string;
  contact: string;
  email: string;
  telefoon: string;
  website?: string;
  bron: LeadSource;
  status: LeadStatus;
  prioriteit: LeadPriority;
  waarde: number;
  eigenaar: string;
  laatsteContact: string;
  laatsteContactAt?: string;
  volgendeActie: string;
  volgendeActieDatum?: string;
  notities?: string;
  hubspotContactId?: string;
  hubspotCompanyId?: string;
  hubspotSyncStatus?: "niet_gesynchroniseerd" | "gesynchroniseerd" | "fout";
  createdAt?: string;
  activityLog?: LeadActivity[];
};

export type LeadFollowUp = {
  id: string;
  taak: string;
  lead: string;
  leadId: string;
  eigenaar: string;
  deadline: string;
  prioriteit: LeadPriority;
  status: "Vandaag" | "Morgen" | "Deze week" | "Te laat" | "Gepland";
};

export type LeadKpi = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: "new" | "qualify" | "followup" | "priority" | "conversion";
};

export type LeadStatusSummary = {
  status: LeadStatus;
  count: number;
  value: number;
  percentage: number;
};

export const LEAD_STATUSES: LeadStatus[] = [
  "nieuw",
  "te_kwalificeren",
  "benaderd",
  "gesprek_gepland",
  "offerte_nodig",
  "omgezet_naar_deal",
  "verloren",
];

export const LEAD_PRIORITIES: LeadPriority[] = [
  "laag",
  "normaal",
  "hoog",
  "spoed",
];

export const LEAD_SOURCES: LeadSource[] = [
  "website",
  "hubspot",
  "linkedin",
  "mail",
  "whatsapp",
  "netwerk",
  "bestaande_klant",
  "handmatig",
];

export const LEAD_OWNERS = ["Jaeden", "Mesbah", "Tyrone"];

export const mockLeads: Lead[] = [
  {
    id: "lead-001",
    bedrijf: "Crewstars",
    contact: "Mark de Vries",
    email: "mark@crewstars.nl",
    telefoon: "06-12345678",
    website: "https://crewstars.nl",
    bron: "website",
    status: "te_kwalificeren",
    prioriteit: "hoog",
    waarde: 8500,
    eigenaar: "Jaeden",
    laatsteContact: "Gisteren",
    laatsteContactAt: "2026-07-03T14:00:00Z",
    volgendeActie: "Crewstars nabellen",
    volgendeActieDatum: "2026-07-05",
    notities: "Interesse in festival crew voor Q3.",
    hubspotSyncStatus: "niet_gesynchroniseerd",
    createdAt: "2026-06-28T09:00:00Z",
    activityLog: [
      {
        id: "act-001",
        type: "contact",
        title: "Eerste contact via website",
        timestamp: "2026-06-28T09:00:00Z",
        user: "Jaeden",
      },
    ],
  },
  {
    id: "lead-002",
    bedrijf: "Witte Brigade",
    contact: "Sofia Bakker",
    email: "sofia@wittebrigade.nl",
    telefoon: "06-23456789",
    bron: "linkedin",
    status: "offerte_nodig",
    prioriteit: "spoed",
    waarde: 12400,
    eigenaar: "Mesbah",
    laatsteContact: "Vandaag",
    volgendeActie: "Witte Brigade offerte opvolgen",
    volgendeActieDatum: "2026-07-05",
    notities: "Offerte verstuurd, wacht op reactie.",
    hubspotContactId: "hs-1001",
    hubspotSyncStatus: "gesynchroniseerd",
    createdAt: "2026-06-15T11:00:00Z",
    activityLog: [
      {
        id: "act-002",
        type: "status",
        title: "Status gewijzigd naar Offerte nodig",
        timestamp: "2026-07-04T10:00:00Z",
        user: "Mesbah",
      },
    ],
  },
  {
    id: "lead-003",
    bedrijf: "Beurs van Berlage",
    contact: "Tom Jansen",
    email: "tom@beursvanberlage.nl",
    telefoon: "06-34567890",
    bron: "netwerk",
    status: "gesprek_gepland",
    prioriteit: "hoog",
    waarde: 18500,
    eigenaar: "Tyrone",
    laatsteContact: "2 dagen geleden",
    volgendeActie: "Beurs van Berlage voorstel sturen",
    volgendeActieDatum: "2026-07-06",
    createdAt: "2026-06-20T08:30:00Z",
  },
  {
    id: "lead-004",
    bedrijf: "Van Ham Group",
    contact: "Naomi Peters",
    email: "naomi@vanhamgroup.nl",
    telefoon: "06-45678901",
    bron: "mail",
    status: "benaderd",
    prioriteit: "normaal",
    waarde: 6200,
    eigenaar: "Jaeden",
    laatsteContact: "3 dagen geleden",
    volgendeActie: "Van Ham Group contactmoment plannen",
    volgendeActieDatum: "2026-07-07",
    createdAt: "2026-07-01T13:00:00Z",
  },
  {
    id: "lead-005",
    bedrijf: "Milkshake Festival",
    contact: "Rick van Dijk",
    email: "rick@milkshakefestival.nl",
    telefoon: "06-56789012",
    bron: "bestaande_klant",
    status: "te_kwalificeren",
    prioriteit: "hoog",
    waarde: 22000,
    eigenaar: "Mesbah",
    laatsteContact: "Vandaag",
    volgendeActie: "Milkshake Festival beschikbaarheid checken",
    volgendeActieDatum: "2026-07-05",
    notities: "Terugkerende klant, grote productie.",
    createdAt: "2026-07-02T16:00:00Z",
  },
  {
    id: "lead-006",
    bedrijf: "Eventbedrijf Noord",
    contact: "Lisa Vermeer",
    email: "lisa@eventbedrijfnoord.nl",
    telefoon: "06-67890123",
    bron: "hubspot",
    status: "offerte_nodig",
    prioriteit: "normaal",
    waarde: 4800,
    eigenaar: "Jaeden",
    laatsteContact: "Gisteren",
    volgendeActie: "Offerte opvolgen",
    volgendeActieDatum: "2026-07-06",
    hubspotContactId: "hs-1002",
    hubspotSyncStatus: "gesynchroniseerd",
    createdAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "lead-007",
    bedrijf: "Restaurant De Haven",
    contact: "Emma de Boer",
    email: "emma@dehaven.nl",
    telefoon: "06-78901234",
    bron: "whatsapp",
    status: "nieuw",
    prioriteit: "normaal",
    waarde: 3200,
    eigenaar: "Mesbah",
    laatsteContact: "Vandaag",
    volgendeActie: "Introductiegesprek plannen",
    volgendeActieDatum: "2026-07-08",
    createdAt: "2026-07-04T09:00:00Z",
  },
  {
    id: "lead-008",
    bedrijf: "Stadion Events",
    contact: "Peter Kuipers",
    email: "peter@stadionevents.nl",
    telefoon: "06-89012345",
    bron: "website",
    status: "omgezet_naar_deal",
    prioriteit: "hoog",
    waarde: 8900,
    eigenaar: "Tyrone",
    laatsteContact: "1 week geleden",
    volgendeActie: "Deal opvolgen in pipeline",
    volgendeActieDatum: "2026-07-10",
    createdAt: "2026-05-15T12:00:00Z",
  },
  {
    id: "lead-009",
    bedrijf: "Horeca Partners",
    contact: "Anna Smit",
    email: "anna@horecapartners.nl",
    telefoon: "06-90123456",
    bron: "handmatig",
    status: "verloren",
    prioriteit: "laag",
    waarde: 0,
    eigenaar: "Jaeden",
    laatsteContact: "2 weken geleden",
    volgendeActie: "—",
    notities: "Budget niet beschikbaar dit kwartaal.",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "lead-010",
    bedrijf: "Festival Zomerlicht",
    contact: "Daan Mulder",
    email: "daan@zomerlicht.nl",
    telefoon: "06-01234567",
    bron: "linkedin",
    status: "nieuw",
    prioriteit: "spoed",
    waarde: 15000,
    eigenaar: "Tyrone",
    laatsteContact: "Vandaag",
    volgendeActie: "Capaciteit checken",
    volgendeActieDatum: "2026-07-05",
    createdAt: "2026-07-05T07:30:00Z",
  },
];

export const mockLeadFollowUps: LeadFollowUp[] = [
  {
    id: "fu-001",
    taak: "Crewstars nabellen",
    lead: "Crewstars",
    leadId: "lead-001",
    eigenaar: "Jaeden",
    deadline: "Vandaag",
    prioriteit: "hoog",
    status: "Vandaag",
  },
  {
    id: "fu-002",
    taak: "Witte Brigade offerte opvolgen",
    lead: "Witte Brigade",
    leadId: "lead-002",
    eigenaar: "Mesbah",
    deadline: "Vandaag",
    prioriteit: "spoed",
    status: "Vandaag",
  },
  {
    id: "fu-003",
    taak: "Beurs van Berlage voorstel sturen",
    lead: "Beurs van Berlage",
    leadId: "lead-003",
    eigenaar: "Tyrone",
    deadline: "Morgen",
    prioriteit: "hoog",
    status: "Morgen",
  },
  {
    id: "fu-004",
    taak: "Van Ham Group contactmoment plannen",
    lead: "Van Ham Group",
    leadId: "lead-004",
    eigenaar: "Jaeden",
    deadline: "Deze week",
    prioriteit: "normaal",
    status: "Deze week",
  },
  {
    id: "fu-005",
    taak: "Milkshake Festival beschikbaarheid checken",
    lead: "Milkshake Festival",
    leadId: "lead-005",
    eigenaar: "Mesbah",
    deadline: "Vandaag",
    prioriteit: "hoog",
    status: "Vandaag",
  },
];

export const mockLeadKpis: LeadKpi[] = [
  {
    id: "new-month",
    title: "Nieuwe leads deze maand",
    value: "18",
    detail: "5 vandaag toegevoegd",
    icon: "new",
  },
  {
    id: "qualify",
    title: "Te kwalificeren",
    value: "7",
    detail: "Actie vereist",
    icon: "qualify",
  },
  {
    id: "followup-today",
    title: "Follow-ups vandaag",
    value: "6",
    detail: "2 met spoed",
    icon: "followup",
  },
  {
    id: "high-priority",
    title: "Leads met hoge prioriteit",
    value: "4",
    detail: "Hoog + spoed",
    icon: "priority",
  },
  {
    id: "conversion",
    title: "Conversie naar deal",
    value: "22%",
    detail: "Laatste 30 dagen",
    icon: "conversion",
  },
];
