/**
 * Opdrachtgeversportaal — demo-data en helpers.
 *
 * TODO: Supabase Auth koppelen
 * TODO: Alleen ingelogde opdrachtgever mag eigen data zien
 * TODO: Row Level Security per opdrachtgever
 * TODO: HubSpot company/contact koppelen
 * TODO: Moneybird contact/facturen koppelen
 * TODO: Projecten koppelen aan Supabase
 * TODO: Documenten veilig opslaan
 * TODO: Audit log voor wijzigingen
 *
 * Toekomstige koppelingen:
 * - Supabase client_profiles, client_requests, client_projects, client_briefings, client_documents
 * - HubSpot leads/opdrachtgevers
 * - Moneybird facturen en betaalstatus
 * - Shiftbase planning samenvatting
 * - Google Maps locatievalidatie
 * - Gmail/WhatsApp berichten
 * - Document storage
 */

import { formatCurrency } from "@/lib/dashboardHelpers";

export type ClientProfile = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  customerType: "Evenementenbureau" | "Horeca" | "Productie" | "Restaurant" | "Locatie" | "Overig";
  status: "Actief" | "Onboarding" | "Inactief";
  billingEmail?: string;
  projectPreferences?: string;
  notes?: string;
  moneybirdContactId?: string;
  hubspotCompanyId?: string;
};

export type ClientRequest = {
  id: string;
  title: string;
  requestedDate: string;
  eventDate: string;
  locationName: string;
  locationAddress?: string;
  rolesNeeded: string[];
  numberOfPeople: number;
  startTime: string;
  endTime: string;
  deploymentType?: string;
  clothing?: string;
  onSiteContact?: string;
  onSitePhone?: string;
  urgent?: boolean;
  notes?: string;
  status: "Concept" | "Ingediend" | "In behandeling" | "Bevestigd" | "Afgewezen" | "Geannuleerd";
  createdAt: string;
};

export type ClientProject = {
  id: string;
  projectName: string;
  locationName: string;
  locationAddress?: string;
  startDate: string;
  endDate?: string;
  status: "Aanvraag" | "Gepland" | "Bevestigd" | "In uitvoering" | "Afgerond" | "Geannuleerd";
  crewCount: number;
  roles: string[];
  briefingStatus: "Ontbreekt" | "Ingediend" | "Goedgekeurd" | "Aanvulling nodig";
  hoursStatus: "Nog niet beschikbaar" | "Te controleren" | "Goedgekeurd door planning" | "Gefactureerd";
  invoiceStatus: "Geen factuur" | "Concept" | "Verzonden" | "Openstaand" | "Betaald";
  contactPerson?: string;
};

export type ClientPlanningItem = {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  roles: { role: string; requested: number; planned: number }[];
  status: "Open" | "Gedeeltelijk gepland" | "Volledig gepland" | "Bevestigd";
};

export type ClientBriefing = {
  id: string;
  projectId: string;
  projectName: string;
  contactPerson: string;
  contactPhone?: string;
  locationAddress: string;
  meetingPoint: string;
  clothing: string;
  parkingInfo?: string;
  loadingInfo?: string;
  safetyInfo?: string;
  certificatesRequired?: string;
  breakAgreements?: string;
  notes?: string;
  status: "Ontbreekt" | "Concept" | "Ingediend" | "Goedgekeurd" | "Aanvulling nodig";
  updatedAt: string;
};

export type ClientHoursSummary = {
  id: string;
  projectName: string;
  date: string;
  totalHours: number;
  billableHours: number;
  travelCost: number;
  status: "Nog te controleren" | "Goedgekeurd door planning" | "Gefactureerd";
  notes?: string;
};

export type ClientInvoice = {
  id: string;
  invoiceNumber: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;
  amountExVat: number;
  vatAmount: number;
  amountInclVat: number;
  status: "Concept" | "Verzonden" | "Openstaand" | "Te laat" | "Betaald";
  moneybirdInvoiceId?: string;
};

export type ClientDocument = {
  id: string;
  title: string;
  type: "Offerte" | "Opdrachtbevestiging" | "Briefing" | "Factuur" | "Overeenkomst" | "Overig";
  projectName?: string;
  status: "Beschikbaar" | "Nog te uploaden" | "In controle" | "Goedgekeurd";
  createdAt: string;
};

export const CLIENT_DEPLOYMENT_TYPES = [
  "Event",
  "Horeca",
  "Restaurant",
  "Keuken",
  "Stagebouw",
  "Productie",
  "Logistiek",
  "Hospitality",
] as const;

export const CLIENT_ROLE_OPTIONS = [
  "Eventmedewerker",
  "Floor support",
  "Stagehand",
  "Load-in / Load-out",
  "Sitecrew",
  "Productie assistent",
  "Runner",
  "Logistiek medewerker",
  "Teamcaptain",
  "Bedieningsmedewerker",
  "Barback",
  "Bartender",
  "Afwasser",
  "Keukenhulp",
  "Zelfstandig werkend kok",
  "Chef de partie",
  "Sous-chef",
  "Chef-kok",
  "Host / Gastheer / Gastvrouw",
  "Shiftleader / Floor manager horeca",
] as const;

export const DEMO_CLIENT_PROFILE: ClientProfile = {
  id: "demo-client-001",
  companyName: "Demo Opdrachtgever BV",
  contactName: "Demo Contactpersoon",
  email: "demo.opdrachtgever@voorbeeld.nl",
  phone: "06-0000-0000",
  city: "Amsterdam",
  address: "Voorbeeldstraat 1, Amsterdam",
  customerType: "Evenementenbureau",
  status: "Actief",
  billingEmail: "facturatie@voorbeeld.nl",
  projectPreferences: "Voorkeur voor ervaren event crew en duidelijke briefing vooraf.",
  moneybirdContactId: "mb-demo-001",
  hubspotCompanyId: "hs-demo-001",
};

export const DEMO_CLIENT_REQUESTS: ClientRequest[] = [
  {
    id: "req-001",
    title: "RAI Amsterdam — Congres catering support",
    requestedDate: "2026-07-01",
    eventDate: "2026-07-18",
    locationName: "Amsterdam RAI",
    locationAddress: "Europaplein 24, 1078 GZ Amsterdam",
    rolesNeeded: ["Bedieningsmedewerker", "Keukenhulp", "Runner"],
    numberOfPeople: 12,
    startTime: "07:00",
    endTime: "15:30",
    deploymentType: "Horeca",
    status: "Bevestigd",
    createdAt: "2026-07-01T10:00:00",
  },
  {
    id: "req-002",
    title: "GelreDome Arnhem — Event crew",
    requestedDate: "2026-07-08",
    eventDate: "2026-07-22",
    locationName: "GelreDome Arnhem",
    locationAddress: "Arnhemseweg 350, 6814 DP Arnhem",
    rolesNeeded: ["Eventmedewerker", "Sitecrew", "Teamcaptain"],
    numberOfPeople: 18,
    startTime: "14:00",
    endTime: "23:00",
    deploymentType: "Event",
    status: "In behandeling",
    createdAt: "2026-07-08T14:30:00",
  },
  {
    id: "req-003",
    title: "Festivalterrein — Load-out productie",
    requestedDate: "2026-07-10",
    eventDate: "2026-08-09",
    locationName: "Festivalterrein",
    locationAddress: "Evenemententerrein 5, 3528 BD Utrecht",
    rolesNeeded: ["Load-in / Load-out", "Logistiek medewerker"],
    numberOfPeople: 8,
    startTime: "06:00",
    endTime: "14:00",
    deploymentType: "Productie",
    urgent: true,
    status: "Ingediend",
    createdAt: "2026-07-10T09:15:00",
  },
];

export const DEMO_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: "proj-001",
    projectName: "RAI Amsterdam — Congres catering support",
    locationName: "Amsterdam RAI",
    locationAddress: "Europaplein 24, 1078 GZ Amsterdam",
    startDate: "2026-07-18",
    endDate: "2026-07-18",
    status: "Bevestigd",
    crewCount: 12,
    roles: ["Bedieningsmedewerker", "Keukenhulp", "Runner"],
    briefingStatus: "Goedgekeurd",
    hoursStatus: "Nog niet beschikbaar",
    invoiceStatus: "Geen factuur",
    contactPerson: "Demo Contactpersoon",
  },
  {
    id: "proj-002",
    projectName: "GelreDome Arnhem — Event crew",
    locationName: "GelreDome Arnhem",
    locationAddress: "Arnhemseweg 350, 6814 DP Arnhem",
    startDate: "2026-07-22",
    status: "Gepland",
    crewCount: 18,
    roles: ["Eventmedewerker", "Sitecrew", "Teamcaptain"],
    briefingStatus: "Aanvulling nodig",
    hoursStatus: "Nog niet beschikbaar",
    invoiceStatus: "Geen factuur",
    contactPerson: "Demo Contactpersoon",
  },
  {
    id: "proj-003",
    projectName: "Johan Cruijff ArenA — Hospitality",
    locationName: "Johan Cruijff ArenA",
    locationAddress: "ArenA Boulevard 1, 1101 AX Amsterdam",
    startDate: "2026-07-25",
    status: "In uitvoering",
    crewCount: 10,
    roles: ["Host / Gastheer / Gastvrouw", "Floor support"],
    briefingStatus: "Ingediend",
    hoursStatus: "Te controleren",
    invoiceStatus: "Openstaand",
    contactPerson: "Demo Contactpersoon",
  },
  {
    id: "proj-004",
    projectName: "Beursopbouw — RAI hal 10",
    locationName: "Amsterdam RAI",
    startDate: "2026-06-20",
    endDate: "2026-06-28",
    status: "Afgerond",
    crewCount: 6,
    roles: ["Stagehand", "Load-in / Load-out"],
    briefingStatus: "Goedgekeurd",
    hoursStatus: "Gefactureerd",
    invoiceStatus: "Betaald",
    contactPerson: "Demo Contactpersoon",
  },
];

export const DEMO_CLIENT_PLANNING: ClientPlanningItem[] = [
  {
    id: "plan-001",
    projectId: "proj-001",
    projectName: "RAI Amsterdam — Congres catering support",
    date: "2026-07-18",
    startTime: "07:00",
    endTime: "15:30",
    locationName: "Amsterdam RAI",
    roles: [
      { role: "Bedieningsmedewerker", requested: 6, planned: 6 },
      { role: "Keukenhulp", requested: 4, planned: 4 },
      { role: "Runner", requested: 2, planned: 2 },
    ],
    status: "Volledig gepland",
  },
  {
    id: "plan-002",
    projectId: "proj-002",
    projectName: "GelreDome Arnhem — Event crew",
    date: "2026-07-22",
    startTime: "14:00",
    endTime: "23:00",
    locationName: "GelreDome Arnhem",
    roles: [
      { role: "Eventmedewerker", requested: 12, planned: 8 },
      { role: "Sitecrew", requested: 4, planned: 2 },
      { role: "Teamcaptain", requested: 2, planned: 1 },
    ],
    status: "Gedeeltelijk gepland",
  },
  {
    id: "plan-003",
    projectId: "proj-003",
    projectName: "Johan Cruijff ArenA — Hospitality",
    date: "2026-07-25",
    startTime: "16:30",
    endTime: "22:45",
    locationName: "Johan Cruijff ArenA",
    roles: [
      { role: "Host / Gastheer / Gastvrouw", requested: 6, planned: 6 },
      { role: "Floor support", requested: 4, planned: 4 },
    ],
    status: "Bevestigd",
  },
];

export const DEMO_CLIENT_BRIEFINGS: ClientBriefing[] = [
  {
    id: "brief-001",
    projectId: "proj-001",
    projectName: "RAI Amsterdam — Congres catering support",
    contactPerson: "Demo Contactpersoon",
    contactPhone: "06-0000-0000",
    locationAddress: "Europaplein 24, 1078 GZ Amsterdam",
    meetingPoint: "Ingang C, hostess balie",
    clothing: "All black, nette schoenen",
    parkingInfo: "P3 leveranciersparkeren",
    loadingInfo: "Laadkade hal 10",
    safetyInfo: "Veiligheidsschoenen verplicht in laadzone",
    status: "Goedgekeurd",
    updatedAt: "2026-07-12T10:00:00",
  },
  {
    id: "brief-002",
    projectId: "proj-002",
    projectName: "GelreDome Arnhem — Event crew",
    contactPerson: "Demo Contactpersoon",
    locationAddress: "Arnhemseweg 350, 6814 DP Arnhem",
    meetingPoint: "Leveranciersingang west",
    clothing: "Helping Hands polo, zwarte broek",
    status: "Aanvulling nodig",
    updatedAt: "2026-07-11T15:00:00",
  },
  {
    id: "brief-003",
    projectId: "proj-003",
    projectName: "Johan Cruijff ArenA — Hospitality",
    contactPerson: "Demo Contactpersoon",
    locationAddress: "ArenA Boulevard 1, 1101 AX Amsterdam",
    meetingPoint: "Medewerkersingang Zuid",
    clothing: "Business casual",
    status: "Ingediend",
    updatedAt: "2026-07-13T09:00:00",
  },
];

export const DEMO_CLIENT_HOURS: ClientHoursSummary[] = [
  {
    id: "hrs-c-001",
    projectName: "Beursopbouw — RAI hal 10",
    date: "2026-06-28",
    totalHours: 48,
    billableHours: 48,
    travelCost: 120,
    status: "Gefactureerd",
  },
  {
    id: "hrs-c-002",
    projectName: "Johan Cruijff ArenA — Hospitality",
    date: "2026-07-25",
    totalHours: 62,
    billableHours: 60,
    travelCost: 85,
    status: "Nog te controleren",
    notes: "Uren worden gecontroleerd door Helping Hands.",
  },
  {
    id: "hrs-c-003",
    projectName: "Horeca event Scheveningen",
    date: "2026-08-02",
    totalHours: 0,
    billableHours: 0,
    travelCost: 0,
    status: "Goedgekeurd door planning",
  },
];

export const DEMO_CLIENT_INVOICES: ClientInvoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "DEMO-2026-0142",
    projectName: "Beursopbouw — RAI hal 10",
    invoiceDate: "2026-07-02",
    dueDate: "2026-07-16",
    amountExVat: 4800,
    vatAmount: 1008,
    amountInclVat: 5808,
    status: "Betaald",
    moneybirdInvoiceId: "mb-inv-demo-001",
  },
  {
    id: "inv-002",
    invoiceNumber: "DEMO-2026-0158",
    projectName: "Johan Cruijff ArenA — Hospitality",
    invoiceDate: "2026-07-10",
    dueDate: "2026-07-24",
    amountExVat: 6200,
    vatAmount: 1302,
    amountInclVat: 7502,
    status: "Openstaand",
    moneybirdInvoiceId: "mb-inv-demo-002",
  },
  {
    id: "inv-003",
    invoiceNumber: "DEMO-2026-0165",
    projectName: "RAI Amsterdam — Congres catering support",
    invoiceDate: "2026-07-14",
    dueDate: "2026-07-28",
    amountExVat: 0,
    vatAmount: 0,
    amountInclVat: 0,
    status: "Concept",
  },
];

export const DEMO_CLIENT_DOCUMENTS: ClientDocument[] = [
  {
    id: "doc-c-001",
    title: "Offerte RAI congres catering",
    type: "Offerte",
    projectName: "RAI Amsterdam — Congres catering support",
    status: "Goedgekeurd",
    createdAt: "2026-07-02",
  },
  {
    id: "doc-c-002",
    title: "Opdrachtbevestiging GelreDome",
    type: "Opdrachtbevestiging",
    projectName: "GelreDome Arnhem — Event crew",
    status: "Beschikbaar",
    createdAt: "2026-07-09",
  },
  {
    id: "doc-c-003",
    title: "Briefing ArenA hospitality",
    type: "Briefing",
    projectName: "Johan Cruijff ArenA — Hospitality",
    status: "In controle",
    createdAt: "2026-07-13",
  },
  {
    id: "doc-c-004",
    title: "Factuur beursopbouw",
    type: "Factuur",
    projectName: "Beursopbouw — RAI hal 10",
    status: "Beschikbaar",
    createdAt: "2026-07-02",
  },
];

export type ClientPortalStats = {
  openRequests: number;
  activeProjects: number;
  briefingsNeeded: number;
  openInvoices: number;
  upcomingDeployments: number;
  hoursPending: number;
};

export type ClientIntegrationItem = {
  id: string;
  name: string;
  checkUrl?: string;
};

export const CLIENT_INTEGRATIONS: ClientIntegrationItem[] = [
  { id: "hubspot", name: "HubSpot" },
  { id: "moneybird", name: "Moneybird", checkUrl: "/api/moneybird/status" },
  { id: "shiftbase", name: "Shiftbase", checkUrl: "/api/shiftbase" },
  { id: "supabase", name: "Supabase" },
  { id: "gmail", name: "Gmail" },
  { id: "whatsapp", name: "WhatsApp" },
];

function parseDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

export function formatClientDate(date: string): string {
  return parseDate(date).toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getClientPortalStats(
  requests = DEMO_CLIENT_REQUESTS,
  projects = DEMO_CLIENT_PROJECTS,
  briefings = DEMO_CLIENT_BRIEFINGS,
  invoices = DEMO_CLIENT_INVOICES,
  planning = DEMO_CLIENT_PLANNING,
  hours = DEMO_CLIENT_HOURS,
): ClientPortalStats {
  return {
    openRequests: requests.filter(
      (r) => r.status === "Ingediend" || r.status === "In behandeling" || r.status === "Concept",
    ).length,
    activeProjects: projects.filter(
      (p) => p.status !== "Afgerond" && p.status !== "Geannuleerd",
    ).length,
    briefingsNeeded: briefings.filter(
      (b) => b.status === "Ontbreekt" || b.status === "Aanvulling nodig",
    ).length,
    openInvoices: invoices.filter(
      (i) => i.status === "Openstaand" || i.status === "Te laat" || i.status === "Verzonden",
    ).length,
    upcomingDeployments: planning.filter((p) => parseDate(p.date) >= new Date()).length,
    hoursPending: hours.filter((h) => h.status === "Nog te controleren").length,
  };
}

export function getNextClientProject(projects = DEMO_CLIENT_PROJECTS): ClientProject | null {
  const upcoming = projects
    .filter((p) => p.status !== "Afgerond" && p.status !== "Geannuleerd")
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime());
  return upcoming[0] ?? null;
}

export function getClientPendingActions(
  requests = DEMO_CLIENT_REQUESTS,
  projects = DEMO_CLIENT_PROJECTS,
  briefings = DEMO_CLIENT_BRIEFINGS,
  invoices = DEMO_CLIENT_INVOICES,
): { label: string; href: string; type: string }[] {
  const actions: { label: string; href: string; type: string }[] = [];

  for (const req of requests) {
    if (req.status === "Ingediend" || req.status === "In behandeling") {
      actions.push({ label: req.title, href: "/portaal/opdrachtgevers/aanvragen", type: "Aanvraag" });
    }
  }
  for (const brief of briefings) {
    if (brief.status === "Aanvulling nodig" || brief.status === "Ontbreekt") {
      actions.push({
        label: `Briefing: ${brief.projectName}`,
        href: "/portaal/opdrachtgevers/briefings",
        type: "Briefing",
      });
    }
  }
  for (const inv of invoices) {
    if (inv.status === "Openstaand" || inv.status === "Te laat") {
      actions.push({
        label: `Factuur ${inv.invoiceNumber}`,
        href: "/portaal/opdrachtgevers/facturen",
        type: "Factuur",
      });
    }
  }
  for (const proj of projects) {
    if (proj.briefingStatus === "Aanvulling nodig") {
      actions.push({
        label: `Briefing aanvullen: ${proj.projectName}`,
        href: "/portaal/opdrachtgevers/briefings",
        type: "Project",
      });
    }
  }

  return actions.slice(0, 6);
}

export function formatInvoiceAmounts(invoice: ClientInvoice) {
  return {
    exVat: formatCurrency(invoice.amountExVat),
    vat: formatCurrency(invoice.vatAmount),
    inclVat: formatCurrency(invoice.amountInclVat),
  };
}
