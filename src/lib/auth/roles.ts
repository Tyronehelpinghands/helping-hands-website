import { getPortalDashboardPath, type PortalType } from "@/lib/portals";
import type { UserRole } from "@/lib/supabase/types";

/** Rollen die het interne dashboard (/dashboard/intern) mogen gebruiken. */
export const internalRoles: UserRole[] = [
  "owner",
  "admin",
  "planner",
  "sales",
  "finance",
];

/** Rollen die het medewerkersportaal (/portaal/medewerkers) mogen gebruiken. */
export const employeeRoles: UserRole[] = ["owner", "admin", "planner", "crew"];

/** Rollen die het opdrachtgeversportaal (/portaal/opdrachtgevers) mogen gebruiken. */
export const clientRoles: UserRole[] = ["owner", "admin", "sales", "client"];

export function isInternRole(role: UserRole): boolean {
  return internalRoles.includes(role);
}

export function isEmployeePortalRole(role: UserRole): boolean {
  return employeeRoles.includes(role);
}

export function isClientPortalRole(role: UserRole): boolean {
  return clientRoles.includes(role);
}

/** Rolnaam voor weergave in de UI (sidebar, header, instellingen). */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "owner":
      return "Eigenaar";
    case "admin":
      return "Administrator";
    case "planner":
      return "Planner";
    case "sales":
      return "Sales";
    case "finance":
      return "Financiën";
    case "crew":
      return "Crew";
    case "client":
      return "Opdrachtgever";
    default:
      return "Gebruiker";
  }
}

/** Standaard bestemming direct na inloggen, op basis van rol. */
export function getDashboardPathForRole(role: UserRole): string {
  if (isInternRole(role)) return "/dashboard/intern";
  if (role === "crew") return "/portaal/medewerkers";
  if (role === "client") return "/portaal/opdrachtgevers";
  return "/login";
}

/** Mag deze rol het opgevraagde dashboard-/portaalpad benaderen? */
export function canAccessDashboardPath(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith("/dashboard/intern")) {
    return isInternRole(role);
  }
  if (
    pathname.startsWith("/dashboard/medewerker") ||
    pathname.startsWith("/portaal/medewerkers")
  ) {
    return isEmployeePortalRole(role);
  }
  if (
    pathname.startsWith("/dashboard/opdrachtgever") ||
    pathname.startsWith("/portaal/opdrachtgevers")
  ) {
    return isClientPortalRole(role);
  }
  return false;
}

/** Mag deze rol inloggen op het gekozen portaal (loginpagina-keuze)? */
export function canAccessPortal(role: UserRole, portalType: PortalType): boolean {
  switch (portalType) {
    case "intern":
      return isInternRole(role);
    case "medewerker":
      return isEmployeePortalRole(role);
    case "opdrachtgever":
      return isClientPortalRole(role);
    default:
      return false;
  }
}

/** Bepaal redirect na login op basis van gekozen portaal, rol en optionele redirectTo-URL. */
export function resolveLoginDestination(
  role: UserRole,
  portalType: PortalType | null,
  redirectTo?: string | null,
): string {
  if (portalType && canAccessPortal(role, portalType)) {
    return getPortalDashboardPath(portalType);
  }
  if (redirectTo && canAccessDashboardPath(role, redirectTo)) {
    return redirectTo;
  }
  return getDashboardPathForRole(role);
}
