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
    description: "Deals, follow-ups en pipeline-overzicht.",
    href: DASHBOARD_ROUTES.sales,
    status: "demo",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Kansen en opvolging — Supabase met demo-fallback.",
    href: DASHBOARD_ROUTES.leads,
    status: "live",
  },
  {
    id: "projecten",
    title: "Projecten",
    description: "Projectstatus, crewbezetting en briefing.",
    href: DASHBOARD_ROUTES.projecten,
    status: "live",
  },
  {
    id: "planning",
    title: "Planning",
    description: "Shifts en inzet — Shiftbase-ready, nu deels demo.",
    href: DASHBOARD_ROUTES.planning,
    status: "demo",
  },
  {
    id: "crew",
    title: "Crew",
    description: "Profielen, beschikbaarheid en certificaten.",
    href: DASHBOARD_ROUTES.crew,
    status: "demo",
  },
  {
    id: "uren",
    title: "Urenregistratie",
    description: "Controle en goedkeuring van uren.",
    href: DASHBOARD_ROUTES.urenregistratie,
    status: "demo",
  },
  {
    id: "facturatie",
    title: "Facturatie",
    description: "Concepten en Moneybird-voorbereiding.",
    href: DASHBOARD_ROUTES.facturatie,
    status: "demo",
  },
  {
    id: "financien",
    title: "Financiën",
    description: "Omzet, kosten, marge en openstaande posten.",
    href: DASHBOARD_ROUTES.financien,
    status: "demo",
  },
  {
    id: "risico",
    title: "Risico & Acties",
    description: "Operationele risico's en deadlines.",
    href: DASHBOARD_ROUTES.risicoActies,
    status: "demo",
  },
  {
    id: "berichten",
    title: "Berichten",
    description: "Communicatievoorbereiding met crew en klanten.",
    href: DASHBOARD_ROUTES.berichten,
    status: "demo",
  },
  {
    id: "integraties",
    title: "Integraties",
    description: "Supabase, WhatsApp, Gmail en overige koppelingen.",
    href: DASHBOARD_ROUTES.integraties,
    status: "live",
  },
  {
    id: "instellingen",
    title: "Instellingen",
    description: "Bedrijfsgegevens, tarieven en voorkeuren.",
    href: DASHBOARD_ROUTES.instellingen,
    status: "demo",
  },
];

export function moduleStatusLabel(status: ModuleStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "demo":
      return "Demo";
    case "coming":
      return "Binnenkort";
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
