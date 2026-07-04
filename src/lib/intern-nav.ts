import {
  AlertTriangle,
  CalendarDays,
  Clock,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Settings,
  TrendingUp,
  UserCog,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type InternNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const internNavItems: InternNavItem[] = [
  { href: "/dashboard/intern", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/intern/sales", label: "Sales", icon: TrendingUp },
  { href: "/dashboard/intern/leads", label: "Leads", icon: Users },
  { href: "/dashboard/intern/projecten", label: "Projecten", icon: FolderKanban },
  { href: "/dashboard/intern/planning", label: "Planning", icon: CalendarDays },
  { href: "/dashboard/intern/crew", label: "Crew", icon: UserCog },
  {
    href: "/dashboard/intern/urenregistratie",
    label: "Urenregistratie",
    icon: Clock,
  },
  { href: "/dashboard/intern/facturatie", label: "Facturatie", icon: FileText },
  { href: "/dashboard/intern/financien", label: "Financiën", icon: Wallet },
  {
    href: "/dashboard/intern/risico",
    label: "Risico & Acties",
    icon: AlertTriangle,
  },
  { href: "/dashboard/intern/berichten", label: "Berichten", icon: MessageSquare },
  { href: "/dashboard/intern/instellingen", label: "Instellingen", icon: Settings },
];

export function isInternNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/intern") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
