export type SalesKpi = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: "leads" | "offers" | "won" | "pipeline" | "followups";
};

export type PipelineStage = {
  id: string;
  label: string;
  count: number;
  value: number;
  fill: string;
};

export type SalesLead = {
  id: string;
  bedrijf: string;
  contact: string;
  email: string;
  status: "nieuw" | "contact" | "offerte" | "gewonnen" | "verloren";
  waarde: number;
  eigenaar: string;
  bron: string;
  laatsteContact: string;
  hubspotId?: string;
};

export type PipelineDeal = {
  id: string;
  title: string;
  bedrijf: string;
  waarde: number;
  stageId: string;
};

export type SalesFollowUp = {
  id: string;
  taak: string;
  lead: string;
  eigenaar: string;
  deadline: string;
  status: "Vandaag" | "Morgen" | "Deze week" | "Te laat";
  prioriteit: "hoog" | "normaal" | "laag";
};

export const salesKpiCards: SalesKpi[] = [
  {
    id: "open-leads",
    title: "Open leads",
    value: "18",
    detail: "5 nieuw deze week",
    icon: "leads",
  },
  {
    id: "open-offers",
    title: "Offertes open",
    value: "7",
    detail: "€24.800 totaal",
    icon: "offers",
  },
  {
    id: "won-month",
    title: "Gewonnen deze maand",
    value: "4",
    detail: "€18.200 omzet",
    icon: "won",
  },
  {
    id: "pipeline",
    title: "Pipeline waarde",
    value: "€52.400",
    detail: "12 actieve kansen",
    icon: "pipeline",
  },
  {
    id: "followups",
    title: "Follow-ups vandaag",
    value: "6",
    detail: "2 met hoge prioriteit",
    icon: "followups",
  },
];

export const salesPipeline: PipelineStage[] = [
  { id: "nieuw", label: "Nieuw", count: 5, value: 8200, fill: "#38bdf8" },
  { id: "contact", label: "Contact", count: 4, value: 12400, fill: "#173A8A" },
  { id: "offerte", label: "Offerte", count: 7, value: 24800, fill: "#0ea5e9" },
  {
    id: "onderhandeling",
    label: "Onderhandeling",
    count: 3,
    value: 15600,
    fill: "#F28C28",
  },
  { id: "gewonnen", label: "Gewonnen", count: 4, value: 18200, fill: "#22c55e" },
  { id: "verloren", label: "Verloren", count: 2, value: 0, fill: "#94a3b8" },
];

export const salesLeads: SalesLead[] = [
  {
    id: "lead-1",
    bedrijf: "Eventbedrijf Noord",
    contact: "Mark de Vries",
    email: "mark@eventbedrijfnoord.nl",
    status: "offerte",
    waarde: 4800,
    eigenaar: "Jaeden",
    bron: "Website",
    laatsteContact: "Vandaag",
  },
  {
    id: "lead-2",
    bedrijf: "Restaurant De Haven",
    contact: "Sofia Bakker",
    email: "sofia@dehaven.nl",
    status: "contact",
    waarde: 3200,
    eigenaar: "Mesbah",
    bron: "Referral",
    laatsteContact: "Gisteren",
  },
  {
    id: "lead-3",
    bedrijf: "Festival Zomerlicht",
    contact: "Tom Jansen",
    email: "tom@zomerlicht.nl",
    status: "nieuw",
    waarde: 12500,
    eigenaar: "Tyrone",
    bron: "LinkedIn",
    laatsteContact: "2 dagen geleden",
  },
  {
    id: "lead-4",
    bedrijf: "Catering Groep BV",
    contact: "Naomi Peters",
    email: "naomi@cateringgroep.nl",
    status: "gewonnen",
    waarde: 6100,
    eigenaar: "Jaeden",
    bron: "HubSpot",
    laatsteContact: "3 dagen geleden",
    hubspotId: "hs-mock-001",
  },
  {
    id: "lead-5",
    bedrijf: "Stadion Events",
    contact: "Rick van Dijk",
    email: "rick@stadionevents.nl",
    status: "offerte",
    waarde: 8900,
    eigenaar: "Mesbah",
    bron: "Beurs",
    laatsteContact: "Vandaag",
  },
  {
    id: "lead-6",
    bedrijf: "Horeca Partners",
    contact: "Lisa Vermeer",
    email: "lisa@horecapartners.nl",
    status: "verloren",
    waarde: 0,
    eigenaar: "Tyrone",
    bron: "Cold outreach",
    laatsteContact: "1 week geleden",
  },
];

export const pipelineDeals: PipelineDeal[] = [
  {
    id: "deal-1",
    title: "Festival crew Q3",
    bedrijf: "Festival Zomerlicht",
    waarde: 12500,
    stageId: "nieuw",
  },
  {
    id: "deal-2",
    title: "Terras support",
    bedrijf: "Restaurant De Haven",
    waarde: 3200,
    stageId: "contact",
  },
  {
    id: "deal-3",
    title: "Event load-in",
    bedrijf: "Eventbedrijf Noord",
    waarde: 4800,
    stageId: "offerte",
  },
  {
    id: "deal-4",
    title: "Stadion bezetting",
    bedrijf: "Stadion Events",
    waarde: 8900,
    stageId: "offerte",
  },
  {
    id: "deal-5",
    title: "Horeca team weekend",
    bedrijf: "Grand Café Centrum",
    waarde: 5400,
    stageId: "onderhandeling",
  },
  {
    id: "deal-6",
    title: "Catering productie",
    bedrijf: "Catering Groep BV",
    waarde: 6100,
    stageId: "gewonnen",
  },
];

export const salesFollowUps: SalesFollowUp[] = [
  {
    id: "fu-1",
    taak: "Offerte opvolgen eventbedrijf",
    lead: "Eventbedrijf Noord",
    eigenaar: "Jaeden",
    deadline: "Vandaag",
    status: "Vandaag",
    prioriteit: "hoog",
  },
  {
    id: "fu-2",
    taak: "Introductiegesprek plannen",
    lead: "Restaurant De Haven",
    eigenaar: "Mesbah",
    deadline: "Morgen",
    status: "Morgen",
    prioriteit: "normaal",
  },
  {
    id: "fu-3",
    taak: "Capaciteit checken voor festival",
    lead: "Festival Zomerlicht",
    eigenaar: "Tyrone",
    deadline: "Vandaag",
    status: "Vandaag",
    prioriteit: "hoog",
  },
  {
    id: "fu-4",
    taak: "Contract versturen",
    lead: "Catering Groep BV",
    eigenaar: "Jaeden",
    deadline: "Deze week",
    status: "Deze week",
    prioriteit: "normaal",
  },
  {
    id: "fu-5",
    taak: "Herinnering offerte stadion",
    lead: "Stadion Events",
    eigenaar: "Mesbah",
    deadline: "Gisteren",
    status: "Te laat",
    prioriteit: "hoog",
  },
];
