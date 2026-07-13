/**
 * Demo-login redirects en role mapping.
 *
 * TODO: Supabase Auth koppelen
 * TODO: Rollen opslaan in user profile
 * TODO: Role-based redirects server-side afdwingen
 * TODO: Middleware per rol maken
 * TODO: Alleen intern/admin naar /dashboard/intern
 * TODO: Alleen medewerkers naar /portaal/medewerkers
 * TODO: Alleen opdrachtgevers naar /portaal/opdrachtgevers
 * TODO: Row Level Security instellen
 */

import type { PortalType } from "@/lib/portals";

export type DemoUserRole = "internal" | "employee" | "client";

export const DEMO_ROLE_STORAGE_KEY = "demoRole";
export const DEMO_ROLE_COOKIE = "demo_role";

export const roleRedirects: Record<DemoUserRole, string> = {
  internal: "/dashboard/intern",
  employee: "/portaal/medewerkers",
  client: "/portaal/opdrachtgevers",
};

export function getRedirectForRole(role: DemoUserRole): string {
  return roleRedirects[role];
}

export function isDemoUserRole(
  value: string | null | undefined,
): value is DemoUserRole {
  return value === "internal" || value === "employee" || value === "client";
}

export function portalTypeToDemoRole(portal: PortalType): DemoUserRole {
  switch (portal) {
    case "intern":
      return "internal";
    case "medewerker":
      return "employee";
    case "opdrachtgever":
      return "client";
  }
}

export function demoRoleToPortalType(role: DemoUserRole): PortalType {
  switch (role) {
    case "internal":
      return "intern";
    case "employee":
      return "medewerker";
    case "client":
      return "opdrachtgever";
  }
}

/** Client-side: sla demo-rol op voor refresh en server middleware. */
export function persistDemoRole(role: DemoUserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_ROLE_STORAGE_KEY, role);
  document.cookie = `${DEMO_ROLE_COOKIE}=${role};path=/;max-age=604800;SameSite=Lax`;
}

/** Client-side: verwijder demo-rol bij uitloggen. */
export function clearDemoRole(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_ROLE_STORAGE_KEY);
  document.cookie = `${DEMO_ROLE_COOKIE}=;path=/;max-age=0;SameSite=Lax`;
}

export function readDemoRoleFromStorage(): DemoUserRole | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(DEMO_ROLE_STORAGE_KEY);
  return isDemoUserRole(value) ? value : null;
}

export type LoginPortalCard = {
  portalType: PortalType;
  demoRole: DemoUserRole;
  title: string;
  description: string;
  audience: string;
  buttonLabel: string;
};

export const LOGIN_PORTAL_CARDS: LoginPortalCard[] = [
  {
    portalType: "intern",
    demoRole: "internal",
    title: "Intern dashboard",
    description:
      "Voor planning, crewbeheer, urenregistratie, facturatie, sales en administratie.",
    audience: "Eigenaar, admin, planner, administratie, sales",
    buttonLabel: "Inloggen als intern",
  },
  {
    portalType: "medewerker",
    demoRole: "employee",
    title: "Medewerkersportaal",
    description:
      "Voor crewleden om planning, beschikbaarheid, uren, berichten en documenten te bekijken.",
    audience: "Crew, medewerker, ZZP'er, payroll medewerker",
    buttonLabel: "Inloggen als medewerker",
  },
  {
    portalType: "opdrachtgever",
    demoRole: "client",
    title: "Opdrachtgeversportaal",
    description:
      "Voor opdrachtgevers om aanvragen, projecten, briefings, planning en facturen te bekijken.",
    audience: "Klant, opdrachtgever, restaurant, evenementenbureau, productiebedrijf",
    buttonLabel: "Inloggen als opdrachtgever",
  },
];
