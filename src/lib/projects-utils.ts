import type {
  Project,
  ProjectKpi,
  ProjectStatus,
  ProjectStatusSummary,
  ProjectType,
  CrewStatus,
} from "@/data/projectsMockData";
import { PROJECT_STATUSES } from "@/data/projectsMockData";

export type ProjectsDataSource = "supabase" | "mock";

export type ProjectsPageData = {
  projects: Project[];
  source: ProjectsDataSource;
  error: string | null;
};

export function formatProjectCurrency(value: number) {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatProjectDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  aanvraag: "Aanvraag",
  planning: "Planning",
  bevestigd: "Bevestigd",
  actief: "Actief",
  urencontrole: "Urencontrole",
  gefactureerd: "Gefactureerd",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
};

export const projectStatusStyles: Record<ProjectStatus, string> = {
  aanvraag: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  planning: "border-amber-200 bg-amber-50 text-amber-700",
  bevestigd: "border-indigo-200 bg-indigo-50 text-indigo-700",
  actief: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  urencontrole: "border-purple-200 bg-purple-50 text-purple-700",
  gefactureerd: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  afgerond: "border-green-200 bg-green-50 text-green-700",
  geannuleerd: "border-slate-200 bg-slate-100 text-slate-600",
};

export const projectTypeLabels: Record<ProjectType, string> = {
  festival: "Festival",
  concert: "Concert",
  horeca: "Horeca",
  beurs: "Beurs",
  sportevenement: "Sportevenement",
  corporate_event: "Corporate event",
  stagehands: "Stagehands",
  productie: "Productie",
  logistiek: "Logistiek",
  overig: "Overig",
};

export const projectTypeStyles: Record<ProjectType, string> = {
  festival: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  concert: "border-purple-200 bg-purple-50 text-purple-700",
  horeca: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  beurs: "border-indigo-200 bg-indigo-50 text-indigo-700",
  sportevenement: "border-green-200 bg-green-50 text-green-700",
  corporate_event: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  stagehands: "border-slate-200 bg-slate-100 text-slate-600",
  productie: "border-amber-200 bg-amber-50 text-amber-700",
  logistiek: "border-slate-200 bg-[#F5F7FA] text-[#101828]/70",
  overig: "border-slate-200 bg-[#F5F7FA] text-[#101828]/65",
};

export const crewStatusLabels: Record<CrewStatus, string> = {
  nog_nodig: "Nog nodig",
  deels_ingepland: "Deels ingepland",
  volledig_ingepland: "Volledig ingepland",
  overbezet: "Overbezet",
};

export const crewStatusStyles: Record<CrewStatus, string> = {
  nog_nodig: "border-red-200 bg-red-50 text-red-700",
  deels_ingepland: "border-amber-200 bg-amber-50 text-amber-700",
  volledig_ingepland: "border-green-200 bg-green-50 text-green-700",
  overbezet: "border-purple-200 bg-purple-50 text-purple-700",
};

export function computeCrewStatus(needed: number, planned: number): CrewStatus {
  if (planned > needed) return "overbezet";
  if (planned >= needed && needed > 0) return "volledig_ingepland";
  if (planned > 0) return "deels_ingepland";
  return "nog_nodig";
}

export type ProjectsFilterState = {
  search: string;
  status: string;
  dateFilter: string;
  projectType: string;
  planner: string;
  crewStatus: string;
};

export const defaultProjectsFilters: ProjectsFilterState = {
  search: "",
  status: "all",
  dateFilter: "all",
  projectType: "all",
  planner: "all",
  crewStatus: "all",
};

export function getProjectFilterOptions(projects: Project[]) {
  return {
    statuses: Array.from(new Set(projects.map((p) => p.status))),
    types: Array.from(new Set(projects.map((p) => p.type))),
    planners: Array.from(new Set(projects.map((p) => p.planner))).sort(),
    crewStatuses: Array.from(new Set(projects.map((p) => p.crewStatus))),
  };
}

function isWithinDateFilter(dateStr: string, filter: string): boolean {
  if (filter === "all" || !dateStr) return filter === "all";

  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === "today") {
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return target.getTime() === today.getTime();
  }

  if (filter === "week") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  }

  if (filter === "month") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  return true;
}

export function filterProjects(
  projects: Project[],
  filters: ProjectsFilterState,
): Project[] {
  const query = filters.search.trim().toLowerCase();

  return projects.filter((p) => {
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.projectType !== "all" && p.type !== filters.projectType) return false;
    if (filters.planner !== "all" && p.planner !== filters.planner) return false;
    if (filters.crewStatus !== "all" && p.crewStatus !== filters.crewStatus) return false;
    if (!isWithinDateFilter(p.startDatum, filters.dateFilter)) return false;

    if (!query) return true;

    return (
      p.naam.toLowerCase().includes(query) ||
      p.opdrachtgever.toLowerCase().includes(query) ||
      p.locatie.toLowerCase().includes(query)
    );
  });
}

export function computeStatusOverview(projects: Project[]): ProjectStatusSummary[] {
  const totalValue = projects.reduce((sum, p) => sum + p.verwachteOmzet, 0);

  return PROJECT_STATUSES.map((status) => {
    const statusProjects = projects.filter((p) => p.status === status);
    const value = statusProjects.reduce((sum, p) => sum + p.verwachteOmzet, 0);
    return {
      status,
      count: statusProjects.length,
      value,
      percentage: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    };
  });
}

export function computeProjectKpis(projects: Project[]): ProjectKpi[] {
  const active = projects.filter((p) => p.status === "actief").length;
  const planning = projects.filter((p) =>
    ["aanvraag", "planning", "bevestigd"].includes(p.status),
  ).length;
  const crewNeeded = projects
    .filter((p) => !["afgerond", "geannuleerd", "gefactureerd"].includes(p.status))
    .reduce((sum, p) => sum + Math.max(0, p.crewNodig - p.crewIngepland), 0);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const thisWeek = projects.filter((p) => {
    const d = new Date(p.startDatum);
    return d >= weekStart && d <= weekEnd;
  }).length;

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const completedMonth = projects.filter(
    (p) =>
      p.status === "afgerond" &&
      p.createdAt &&
      new Date(p.createdAt) >= monthStart,
  ).length;

  return [
    {
      id: "active",
      title: "Actieve projecten",
      value: String(active || 6),
      detail: "In uitvoering",
      icon: "active",
    },
    {
      id: "planning",
      title: "Projecten in planning",
      value: String(planning || 4),
      detail: "Nog te bevestigen",
      icon: "planning",
    },
    {
      id: "crew",
      title: "Crew nodig",
      value: String(crewNeeded || 18),
      detail: "Open posities",
      icon: "crew",
    },
    {
      id: "week",
      title: "Projecten deze week",
      value: String(thisWeek || 5),
      detail: "Gepland",
      icon: "week",
    },
    {
      id: "completed",
      title: "Afgerond deze maand",
      value: String(completedMonth || 9),
      detail: "Inclusief gefactureerd",
      icon: "completed",
    },
  ];
}

export type NewProjectFormData = {
  naam: string;
  opdrachtgever: string;
  contact: string;
  email: string;
  telefoon: string;
  locatie: string;
  startDatum: string;
  eindDatum: string;
  startTijd: string;
  eindTijd: string;
  type: ProjectType;
  status: ProjectStatus;
  planner: string;
  crewNodig: string;
  functiesNodig: string;
  uurtarief: string;
  reiskostenPerKm: string;
  verwachteOmzet: string;
  notities: string;
  crewBriefing: string;
};

export type NewProjectFormErrors = Partial<Record<keyof NewProjectFormData, string>>;

export function validateNewProjectForm(data: NewProjectFormData): NewProjectFormErrors {
  const errors: NewProjectFormErrors = {};

  if (!data.naam.trim()) errors.naam = "Projectnaam is verplicht";
  if (!data.opdrachtgever.trim()) errors.opdrachtgever = "Opdrachtgever is verplicht";
  if (!data.locatie.trim()) errors.locatie = "Locatie is verplicht";
  if (!data.startDatum.trim()) errors.startDatum = "Startdatum is verplicht";
  if (!PROJECT_STATUSES.includes(data.status)) errors.status = "Ongeldige status";
  if (data.crewNodig.trim() && Number.isNaN(Number(data.crewNodig))) {
    errors.crewNodig = "Aantal crew moet numeriek zijn";
  }
  if (data.uurtarief.trim() && Number.isNaN(Number(data.uurtarief))) {
    errors.uurtarief = "Uurtarief moet numeriek zijn";
  }

  return errors;
}

export function createProjectFromForm(data: NewProjectFormData): Project {
  const crewNodig = data.crewNodig.trim() ? Number(data.crewNodig) : 0;
  return {
    id: `proj-${Date.now()}`,
    naam: data.naam.trim(),
    opdrachtgever: data.opdrachtgever.trim(),
    contact: data.contact.trim(),
    email: data.email.trim(),
    telefoon: data.telefoon.trim(),
    locatie: data.locatie.trim(),
    startDatum: data.startDatum,
    eindDatum: data.eindDatum || undefined,
    startTijd: data.startTijd || "08:00",
    eindTijd: data.eindTijd || "17:00",
    type: data.type,
    status: data.status,
    planner: data.planner,
    crewNodig,
    crewIngepland: 0,
    crewStatus: crewNodig > 0 ? "nog_nodig" : "volledig_ingepland",
    uurtarief: data.uurtarief.trim() ? Number(data.uurtarief) : undefined,
    reiskostenPerKm: data.reiskostenPerKm.trim()
      ? Number(data.reiskostenPerKm)
      : 0.25,
    verwachteOmzet: data.verwachteOmzet.trim() ? Number(data.verwachteOmzet) : 0,
    notities: data.notities.trim() || undefined,
    crewBriefing: data.crewBriefing.trim() || undefined,
    functiesNodig: data.functiesNodig.trim() || undefined,
    urenStatus: "open",
    facturatieStatus: "niet_gestart",
    createdAt: new Date().toISOString(),
    activityLog: [
      {
        id: `act-${Date.now()}`,
        action: "Project aangemaakt",
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function generateWorkBrief(project: Project): string {
  const lines = [
    "WERKBRIEF — HELPING HANDS AGENCY",
    "================================",
    "",
    `Project: ${project.naam}`,
    `Locatie: ${project.locatie}`,
    `Datum: ${formatProjectDate(project.startDatum)}${project.eindDatum ? ` t/m ${formatProjectDate(project.eindDatum)}` : ""}`,
    `Tijden: ${project.startTijd} – ${project.eindTijd}`,
    "",
    "Contact op locatie",
    "------------------",
    `${project.contact}`,
    project.email,
    project.telefoon,
    "",
    "Benodigde functies",
    "------------------",
    project.functiesNodig ||
      (project.roles?.map((r) => `${r.roleName}: ${r.quantityNeeded} nodig`).join("\n") ??
        `Crew: ${project.crewNodig} personen`),
    "",
    "Crew briefing",
    "-------------",
    project.crewBriefing || "Geen briefing beschikbaar.",
    "",
    "Kledingvoorschriften",
    "--------------------",
    "Zwarte kleding, stevige gesloten schoenen. Geen logo's van andere bedrijven.",
    "",
    "Reisinfo",
    "--------",
    "Reiskostenvergoeding €0,25 per km. Meld je 15 minuten voor aanvang.",
    "",
    "Opmerkingen",
    "-----------",
    project.notities || "Geen aanvullende opmerkingen.",
    "",
    "— Helping Hands Agency",
  ];
  return lines.join("\n");
}

export function projectsToCsv(projects: Project[]): string {
  const headers = [
    "Project",
    "Opdrachtgever",
    "Locatie",
    "Datum",
    "Type",
    "Status",
    "Crew nodig",
    "Crew ingepland",
    "Planner",
    "Omzet",
  ];

  const rows = projects.map((p) =>
    [
      p.naam,
      p.opdrachtgever,
      p.locatie,
      p.startDatum,
      projectTypeLabels[p.type],
      projectStatusLabels[p.status],
      p.crewNodig,
      p.crewIngepland,
      p.planner,
      p.verwachteOmzet,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadProjectsCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function projectToSupabaseInsert(project: Project) {
  return {
    title: project.naam,
    client_name: project.opdrachtgever,
    contact_name: project.contact || null,
    contact_email: project.email || null,
    contact_phone: project.telefoon || null,
    location: project.locatie,
    start_date: project.startDatum,
    end_date: project.eindDatum || null,
    start_time: project.startTijd || null,
    end_time: project.eindTijd || null,
    project_type: project.type,
    status: project.status,
    crew_needed: project.crewNodig,
    crew_planned: project.crewIngepland,
    customer_hourly_rate: project.uurtarief ?? null,
    travel_fee_per_km: project.reiskostenPerKm ?? 0.25,
    expected_revenue: project.verwachteOmzet,
    notes: project.notities || null,
    crew_briefing: project.crewBriefing || null,
  };
}
