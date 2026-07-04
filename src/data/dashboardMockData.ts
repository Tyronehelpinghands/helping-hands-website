export type KpiCard = {
  id: string;
  title: string;
  value: string;
  detail: string;
  icon: "revenue" | "invoices" | "projects" | "crew" | "leads";
};

export type RevenueDataPoint = {
  label: string;
  omzet: number;
  aanvragen: number;
};

export type OpenAction = {
  id: string;
  actie: string;
  eigenaar: string;
  deadline: string;
  status: "Bezig" | "Follow-up" | "Nieuw" | "Wachten";
};

export type ProjectStatusSlice = {
  status: string;
  count: number;
  fill: string;
};

export type CrewAvailability = {
  label: string;
  count: number;
  fill: string;
};

export type DashboardNotification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "lead" | "project" | "invoice" | "crew" | "request";
};

export type QuickAction = {
  id: string;
  label: string;
  href: string;
  icon: "request" | "crew" | "project" | "lead" | "hours" | "invoice";
};

export const internKpiCards: KpiCard[] = [
  {
    id: "revenue",
    title: "Omzet deze maand",
    value: "€12.450",
    detail: "+8% t.o.v. vorige maand",
    icon: "revenue",
  },
  {
    id: "invoices",
    title: "Openstaande facturen",
    value: "€4.280",
    detail: "3 facturen wachten op betaling",
    icon: "invoices",
  },
  {
    id: "projects",
    title: "Actieve projecten",
    value: "6",
    detail: "2 in voorbereiding, 4 live",
    icon: "projects",
  },
  {
    id: "crew",
    title: "Crew ingepland",
    value: "32",
    detail: "Deze week op locatie",
    icon: "crew",
  },
  {
    id: "leads",
    title: "Nieuwe leads",
    value: "18",
    detail: "5 follow-ups deze week",
    icon: "leads",
  },
];

export const revenueByWeek: RevenueDataPoint[] = [
  { label: "Ma", omzet: 1420, aanvragen: 3 },
  { label: "Di", omzet: 1890, aanvragen: 4 },
  { label: "Wo", omzet: 2100, aanvragen: 5 },
  { label: "Do", omzet: 1750, aanvragen: 3 },
  { label: "Vr", omzet: 2480, aanvragen: 6 },
  { label: "Za", omzet: 3120, aanvragen: 7 },
  { label: "Zo", omzet: 1690, aanvragen: 2 },
];

export const openActions: OpenAction[] = [
  {
    id: "1",
    actie: "Crew zoeken voor festival",
    eigenaar: "Mesbah",
    deadline: "Vandaag",
    status: "Bezig",
  },
  {
    id: "2",
    actie: "Offerte opvolgen eventbedrijf",
    eigenaar: "Jaeden",
    deadline: "Morgen",
    status: "Follow-up",
  },
  {
    id: "3",
    actie: "Contract review 2026",
    eigenaar: "Tyrone",
    deadline: "2 juni",
    status: "Nieuw",
  },
  {
    id: "4",
    actie: "Factuur goedkeuren",
    eigenaar: "Naomi",
    deadline: "3 juni",
    status: "Wachten",
  },
  {
    id: "5",
    actie: "Marketingcampagne Q2",
    eigenaar: "Jaeden",
    deadline: "5 juni",
    status: "Bezig",
  },
];

export const projectStatusDonut: ProjectStatusSlice[] = [
  { status: "Planning", count: 4, fill: "#38bdf8" },
  { status: "Actief", count: 6, fill: "#173A8A" },
  { status: "Afgerond", count: 11, fill: "#F28C28" },
  { status: "Gepauzeerd", count: 2, fill: "#94a3b8" },
];

export const crewAvailability: CrewAvailability[] = [
  { label: "Beschikbaar", count: 24, fill: "#22c55e" },
  { label: "Ingepland", count: 32, fill: "#173A8A" },
  { label: "Niet beschikbaar", count: 8, fill: "#ef4444" },
];

export const dashboardNotifications: DashboardNotification[] = [
  {
    id: "1",
    title: "Nieuwe lead toegevoegd",
    description: "Restaurant De Haven — 8 bedieningsmedewerkers gevraagd",
    time: "12 min geleden",
    type: "lead",
  },
  {
    id: "2",
    title: "Projectstatus gewijzigd",
    description: "Festival Zomerlicht is nu actief",
    time: "45 min geleden",
    type: "project",
  },
  {
    id: "3",
    title: "Factuur voldaan",
    description: "Factuur #2026-041 — €2.850 ontvangen",
    time: "2 uur geleden",
    type: "invoice",
  },
  {
    id: "4",
    title: "Nieuw crewlid toegevoegd",
    description: "Lisa V. — bediening & runner",
    time: "3 uur geleden",
    type: "crew",
  },
  {
    id: "5",
    title: "Nieuwe aanvraag binnengekomen",
    description: "Eventbedrijf Noord — 12 crew voor load-in",
    time: "5 uur geleden",
    type: "request",
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "request",
    label: "Nieuwe aanvraag aanmaken",
    href: "/dashboard/intern/sales",
    icon: "request",
  },
  {
    id: "crew",
    label: "Crew toevoegen",
    href: "/dashboard/intern/crew",
    icon: "crew",
  },
  {
    id: "project",
    label: "Project aanmaken",
    href: "/dashboard/intern/projecten",
    icon: "project",
  },
  {
    id: "lead",
    label: "Lead toevoegen",
    href: "/dashboard/intern/leads",
    icon: "lead",
  },
  {
    id: "hours",
    label: "Uren controleren",
    href: "/dashboard/intern/urenregistratie",
    icon: "hours",
  },
  {
    id: "invoice",
    label: "Factuur voorbereiden",
    href: "/dashboard/intern/facturatie",
    icon: "invoice",
  },
];
