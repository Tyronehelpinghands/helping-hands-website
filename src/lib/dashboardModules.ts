import type { IntegrationStatusType } from "@/lib/settings";
import { DASHBOARD_ROUTES } from "@/lib/dashboardNavigation";

export type ModuleStatus = "live" | "demo" | "coming";

export type DashboardModuleCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  status: ModuleStatus;
};

export const DASHBOARD_MODULE_CARDS: DashboardModuleCard[] = [
  {
    id: "sales",
    title: "Sales",
    description: "Opdrachtgevers, leads en follow-ups.",
    href: DASHBOARD_ROUTES.sales,
    status: "live",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Kansen en opvolging via Supabase.",
    href: DASHBOARD_ROUTES.leads,
    status: "live",
  },
  {
    id: "projecten",
    title: "Projecten",
    description: "Projectstatus, briefing en tarieven.",
    href: DASHBOARD_ROUTES.projecten,
    status: "live",
  },
  {
    id: "planning",
    title: "Planning",
    description: "Shifts en crewtoewijzing.",
    href: DASHBOARD_ROUTES.planning,
    status: "live",
  },
  {
    id: "crew",
    title: "Crew",
    description: "Profielen, skills en certificaten.",
    href: DASHBOARD_ROUTES.crew,
    status: "live",
  },
  {
    id: "uren",
    title: "Urenregistratie",
    description: "Invoer, goedkeuring en correcties.",
    href: DASHBOARD_ROUTES.urenregistratie,
    status: "live",
  },
  {
    id: "facturatie",
    title: "Facturatie",
    description: "Concepten uit uren + CSV-export.",
    href: DASHBOARD_ROUTES.facturatie,
    status: "live",
  },
  {
    id: "financien",
    title: "Financiën",
    description: "Omzet, uren, reiskosten en marge.",
    href: DASHBOARD_ROUTES.financien,
    status: "live",
  },
  {
    id: "risico",
    title: "Risico & Acties",
    description: "Taken, prioriteit en deadlines.",
    href: DASHBOARD_ROUTES.risicoActies,
    status: "live",
  },
  {
    id: "berichten",
    title: "Berichten",
    description: "Concepten met mailto/wa.me fallback.",
    href: DASHBOARD_ROUTES.berichten,
    status: "live",
  },
  {
    id: "integraties",
    title: "Integraties",
    description: "Eerlijke status Actief/Voorbereid.",
    href: DASHBOARD_ROUTES.integraties,
    status: "live",
  },
  {
    id: "instellingen",
    title: "Instellingen",
    description: "company_settings: tarieven en e-mail.",
    href: DASHBOARD_ROUTES.instellingen,
    status: "live",
  },
];

export function moduleStatusLabel(status: ModuleStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "demo":
      return "Lokaal";
    case "coming":
      return "Nog niet gekoppeld";
  }
}

export function moduleStatusToBadge(
  status: ModuleStatus,
): IntegrationStatusType {
  switch (status) {
    case "live":
      return "Actief";
    case "demo":
      return "Voorbereid";
    case "coming":
      return "Binnenkort";
  }
}
