import {
  AlertTriangle,
  Bot,
  CalendarDays,
  Clock,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Settings,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Centrale route-configuratie voor het interne dashboard. */
export const DASHBOARD_ROUTES = {
  intern: "/dashboard/intern",
  sales: "/dashboard/intern/sales",
  leads: "/dashboard/intern/leads",
  projecten: "/dashboard/intern/projecten",
  planning: "/dashboard/intern/planning",
  crew: "/dashboard/intern/crew",
  urenregistratie: "/dashboard/intern/urenregistratie",
  facturatie: "/dashboard/intern/facturatie",
  financien: "/dashboard/intern/financien",
  risicoActies: "/dashboard/intern/risico-acties",
  berichten: "/dashboard/intern/berichten",
  openclaw: "/dashboard/intern/openclaw",
  integraties: "/dashboard/intern/integraties",
  instellingen: "/dashboard/intern/instellingen",
} as const;

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { href: DASHBOARD_ROUTES.intern, label: "Dashboard", icon: LayoutDashboard },
  { href: DASHBOARD_ROUTES.sales, label: "Sales", icon: TrendingUp },
  { href: DASHBOARD_ROUTES.leads, label: "Leads", icon: Users },
  { href: DASHBOARD_ROUTES.projecten, label: "Projecten", icon: FolderKanban },
  { href: DASHBOARD_ROUTES.planning, label: "Planning", icon: CalendarDays },
  { href: DASHBOARD_ROUTES.crew, label: "Crew", icon: UserCog },
  {
    href: DASHBOARD_ROUTES.urenregistratie,
    label: "Urenregistratie",
    icon: Clock,
  },
  { href: DASHBOARD_ROUTES.facturatie, label: "Facturatie", icon: FileText },
  { href: DASHBOARD_ROUTES.financien, label: "Financiën", icon: Wallet },
  {
    href: DASHBOARD_ROUTES.risicoActies,
    label: "Risico & Acties",
    icon: AlertTriangle,
  },
  { href: DASHBOARD_ROUTES.berichten, label: "Berichten", icon: MessageSquare },
  { href: DASHBOARD_ROUTES.openclaw, label: "OpenClaw", icon: Bot },
  {
    href: DASHBOARD_ROUTES.integraties,
    label: "Integraties",
    icon: Link2,
  },
  {
    href: DASHBOARD_ROUTES.instellingen,
    label: "Instellingen",
    icon: Settings,
  },
];

export type DashboardModuleName =
  | "Planning"
  | "Crew"
  | "Projecten"
  | "Sales"
  | "Leads"
  | "Urenregistratie"
  | "Facturatie"
  | "Financiën"
  | "Risico & Acties"
  | "Berichten"
  | "OpenClaw"
  | "Integraties"
  | "Instellingen";

/** Centrale module-links — gebruik overal waar modules naar elkaar verwijzen. */
export const MODULE_LINKS: Record<DashboardModuleName, string> = {
  Planning: DASHBOARD_ROUTES.planning,
  Crew: DASHBOARD_ROUTES.crew,
  Projecten: DASHBOARD_ROUTES.projecten,
  Sales: DASHBOARD_ROUTES.sales,
  Leads: DASHBOARD_ROUTES.leads,
  Urenregistratie: DASHBOARD_ROUTES.urenregistratie,
  Facturatie: DASHBOARD_ROUTES.facturatie,
  Financiën: DASHBOARD_ROUTES.financien,
  "Risico & Acties": DASHBOARD_ROUTES.risicoActies,
  Berichten: DASHBOARD_ROUTES.berichten,
  OpenClaw: DASHBOARD_ROUTES.openclaw,
  Integraties: DASHBOARD_ROUTES.integraties,
  Instellingen: DASHBOARD_ROUTES.instellingen,
};

export function getModuleLink(module?: DashboardModuleName): string | null {
  if (!module) return null;
  return MODULE_LINKS[module] ?? null;
}

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === DASHBOARD_ROUTES.intern) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
