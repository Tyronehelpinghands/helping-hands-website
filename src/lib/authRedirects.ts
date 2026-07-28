/**
 * Login-portal UI helpers (geen authenticatie).
 *
 * Auth/rollen: Supabase Auth + public.profiles (zie docs/supabase-auth-setup.md).
 * Beschermde routes: src/proxy.ts + requireRole in layouts.
 */

import type { PortalType } from "@/lib/portals";

export type LoginPortalCard = {
  portalType: PortalType;
  title: string;
  description: string;
  audience: string;
  buttonLabel: string;
};

export const LOGIN_PORTAL_CARDS: LoginPortalCard[] = [
  {
    portalType: "intern",
    title: "Intern dashboard",
    description:
      "Voor planning, crewbeheer, urenregistratie, facturatie, sales en administratie.",
    audience: "Eigenaar, admin, planner, administratie, sales",
    buttonLabel: "Doorgaan als intern",
  },
  {
    portalType: "medewerker",
    title: "Medewerkersportaal",
    description:
      "Voor crewleden om planning, beschikbaarheid, uren, berichten en documenten te bekijken.",
    audience: "Crew, medewerker, ZZP'er, payroll medewerker",
    buttonLabel: "Doorgaan als medewerker",
  },
  {
    portalType: "opdrachtgever",
    title: "Opdrachtgeversportaal",
    description:
      "Voor opdrachtgevers om aanvragen, projecten, briefings, planning en facturen te bekijken.",
    audience: "Klant, opdrachtgever, restaurant, evenementenbureau, productiebedrijf",
    buttonLabel: "Doorgaan als opdrachtgever",
  },
];

/** Client-side uitloggen + terug naar login. */
export async function performPortalLogout(loginType?: PortalType): Promise<void> {
  const { createClient } = await import("@/lib/supabase/client");
  const { isSupabaseConfigured } = await import("@/lib/supabase/env");
  if (isSupabaseConfigured()) {
    try {
      await createClient().auth.signOut();
    } catch {
      // Uitloggen gaat door.
    }
  }
  const loginUrl = loginType ? `/login?type=${loginType}` : "/login";
  window.location.assign(loginUrl);
}
