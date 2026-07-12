import {
  CalendarDays,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  User,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";

export type EmployeePortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const EMPLOYEE_PORTAL_BASE = "/portaal/medewerkers";

export const employeePortalNavItems: EmployeePortalNavItem[] = [
  {
    label: "Overzicht",
    href: EMPLOYEE_PORTAL_BASE,
    icon: LayoutDashboard,
    description: "Dashboard met planning, uren en acties",
  },
  {
    label: "Mijn planning",
    href: `${EMPLOYEE_PORTAL_BASE}/planning`,
    icon: CalendarDays,
    description: "Aankomende diensten en briefings",
  },
  {
    label: "Beschikbaarheid",
    href: `${EMPLOYEE_PORTAL_BASE}/beschikbaarheid`,
    icon: CalendarCheck,
    description: "Doorgeven wanneer je kunt werken",
  },
  {
    label: "Mijn uren",
    href: `${EMPLOYEE_PORTAL_BASE}/uren`,
    icon: Clock,
    description: "Gewerkte uren controleren en accorderen",
  },
  {
    label: "Berichten",
    href: `${EMPLOYEE_PORTAL_BASE}/berichten`,
    icon: MessageSquare,
    description: "Briefings, reminders en updates",
  },
  {
    label: "Documenten",
    href: `${EMPLOYEE_PORTAL_BASE}/documenten`,
    icon: FileText,
    description: "Contracten, certificaten en status",
  },
  {
    label: "Mijn profiel",
    href: `${EMPLOYEE_PORTAL_BASE}/profiel`,
    icon: User,
    description: "Contactgegevens en voorkeuren",
  },
];

export function isEmployeePortalNavActive(pathname: string, href: string): boolean {
  if (href === EMPLOYEE_PORTAL_BASE) {
    return pathname === EMPLOYEE_PORTAL_BASE;
  }
  return pathname.startsWith(href);
}

export type EmployeePortalPageMeta = {
  title: string;
  subtitle?: string;
};

export const employeePortalPageMeta: Record<string, EmployeePortalPageMeta> = {
  [EMPLOYEE_PORTAL_BASE]: {
    title: "Welkom terug, Demo Medewerker",
    subtitle: "Bekijk je planning, beschikbaarheid, uren en berichten.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/planning`]: {
    title: "Mijn planning",
    subtitle: "Aankomende diensten, briefings en locatiegegevens.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/beschikbaarheid`]: {
    title: "Beschikbaarheid",
    subtitle: "Geef door wanneer je kunt werken.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/uren`]: {
    title: "Mijn uren",
    subtitle: "Controleer en accordeer je gewerkte uren.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/berichten`]: {
    title: "Berichten",
    subtitle: "Briefings, reminders en updates van planning.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/documenten`]: {
    title: "Documenten",
    subtitle: "Contracten, certificaten en verificatiestatus.",
  },
  [`${EMPLOYEE_PORTAL_BASE}/profiel`]: {
    title: "Mijn profiel",
    subtitle: "Contactgegevens en voorkeuren voor planning.",
  },
};

export function getEmployeePortalPageMeta(pathname: string): EmployeePortalPageMeta {
  if (employeePortalPageMeta[pathname]) {
    return employeePortalPageMeta[pathname];
  }
  for (const [path, meta] of Object.entries(employeePortalPageMeta)) {
    if (pathname.startsWith(path) && path !== EMPLOYEE_PORTAL_BASE) {
      return meta;
    }
  }
  return {
    title: "Medewerkersportaal",
    subtitle: "Helping Hands Agency crew portal",
  };
}
