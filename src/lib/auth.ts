import { getPortalDashboardPath, type PortalType } from "@/lib/portals";

export const USER_ROLES = [
  "admin",
  "planner",
  "medewerker",
  "opdrachtgever",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type Profile = {
  id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
};

export const PROFILE_INCOMPLETE_MESSAGE =
  "Je account is nog niet volledig ingesteld. Neem contact op met Helping Hands.";

export function isValidRole(role: string | null | undefined): role is UserRole {
  return USER_ROLES.includes(role as UserRole);
}

export function isInternRole(role: UserRole): boolean {
  return role === "admin" || role === "planner";
}

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
    case "planner":
      return "/dashboard/intern";
    case "medewerker":
      return "/portaal/medewerkers";
    case "opdrachtgever":
      return "/dashboard/opdrachtgever";
    default:
      return "/login";
  }
}

export function canAccessDashboardPath(
  role: UserRole,
  pathname: string,
): boolean {
  if (pathname.startsWith("/dashboard/intern")) {
    return isInternRole(role);
  }
  if (pathname.startsWith("/dashboard/medewerker")) {
    return role === "medewerker";
  }
  if (pathname.startsWith("/portaal/medewerkers")) {
    return role === "medewerker" || isInternRole(role);
  }
  if (pathname.startsWith("/dashboard/opdrachtgever")) {
    return role === "opdrachtgever";
  }
  return false;
}

/** Mag deze rol inloggen op het gekozen portaal? */
export function canAccessPortal(role: UserRole, portalType: PortalType): boolean {
  switch (portalType) {
    case "intern":
      return isInternRole(role);
    case "medewerker":
      return role === "medewerker" || isInternRole(role);
    case "opdrachtgever":
      return role === "opdrachtgever";
    default:
      return false;
  }
}

/** Bepaal redirect na login op basis van gekozen portaal, rol en optionele next-URL. */
export function resolveLoginDestination(
  role: UserRole,
  portalType: PortalType,
  redirectTo?: string | null,
): string {
  if (redirectTo && canAccessDashboardPath(role, redirectTo)) {
    return redirectTo;
  }
  if (canAccessPortal(role, portalType)) {
    return getPortalDashboardPath(portalType);
  }
  return getDashboardPathForRole(role);
}

export const PORTAL_LOGIN_TITLES: Record<PortalType, string> = {
  intern: "Inloggen intern portaal",
  medewerker: "Inloggen medewerkersportaal",
  opdrachtgever: "Inloggen opdrachtgeversportaal",
};

export const PORTAL_INTROS: Record<PortalType, string> = {
  intern:
    "Voor planning, aanvragen, crewbeheer, projecten en administratie.",
  medewerker:
    "Voor shifts, beschikbaarheid, briefings, uren en kilometerregistratie.",
  opdrachtgever:
    "Voor aanvragen, lopende projecten, crewplanning en contact met Helping Hands.",
};
