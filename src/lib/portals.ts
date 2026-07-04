export type PortalType = "intern" | "medewerker" | "opdrachtgever";

export type PortalConfig = {
  id: PortalType;
  title: string;
  description: string;
  features: string[];
  buttonLabel: string;
  href: string;
  dashboardHref: string;
};

// Authenticatie via Supabase Auth + profiles.role
// Rollen: admin, planner, medewerker, opdrachtgever

export const portals: PortalConfig[] = [
  {
    id: "intern",
    title: "Intern portaal",
    description:
      "Voor planning, crewbeheer, aanvragen, projecten en interne administratie.",
    features: [
      "Aanvragen beheren",
      "Crewplanning bekijken",
      "Projecten voorbereiden",
      "Uren en briefing controleren",
    ],
    buttonLabel: "Intern inloggen",
    href: "/login?type=intern",
    dashboardHref: "/dashboard/intern",
  },
  {
    id: "medewerker",
    title: "Medewerkersportaal",
    description:
      "Voor crewleden die hun shifts, briefings, beschikbaarheid en uren willen bekijken.",
    features: [
      "Beschikbaarheid doorgeven",
      "Shifts bekijken",
      "Briefing openen",
      "Uren controleren",
    ],
    buttonLabel: "Medewerker login",
    href: "/login?type=medewerker",
    dashboardHref: "/dashboard/medewerker",
  },
  {
    id: "opdrachtgever",
    title: "Opdrachtgeversportaal",
    description:
      "Voor opdrachtgevers die aanvragen, projectgegevens en crewplanning willen beheren.",
    features: [
      "Personeel aanvragen",
      "Lopende aanvragen bekijken",
      "Projectbriefing delen",
      "Contact met planning",
    ],
    buttonLabel: "Opdrachtgever login",
    href: "/login?type=opdrachtgever",
    dashboardHref: "/dashboard/opdrachtgever",
  },
];

export type DashboardCard = {
  title: string;
  value: string;
  detail: string;
};

export const internDashboard: DashboardCard[] = [
  {
    title: "Nieuwe aanvragen",
    value: "4",
    detail: "Wachten op beoordeling door planning",
  },
  {
    title: "Crew beschikbaarheid",
    value: "28",
    detail: "Crewleden met actuele beschikbaarheid",
  },
  {
    title: "Projectplanning",
    value: "6",
    detail: "Producties in voorbereiding deze week",
  },
  {
    title: "Urencontrole",
    value: "3",
    detail: "Rapportages klaar voor controle",
  },
  {
    title: "Openstaande acties",
    value: "7",
    detail: "Taken voor intern team",
  },
  {
    title: "Facturatie voorbereiding",
    value: "2",
    detail: "Dossiers bijna gereed voor afhandeling",
  },
];

export const medewerkerDashboard: DashboardCard[] = [
  {
    title: "Mijn shifts",
    value: "2",
    detail: "Geplande inzetten komende periode",
  },
  {
    title: "Mijn beschikbaarheid",
    value: "Open",
    detail: "Beschikbaarheid bijwerken voor nieuwe opdrachten",
  },
  {
    title: "Briefings",
    value: "1",
    detail: "Nieuwe briefing beschikbaar",
  },
  {
    title: "Uren",
    value: "12u",
    detail: "Urenregistratie huidige periode",
  },
  {
    title: "Documenten",
    value: "3",
    detail: "Handleidingen en afspraken",
  },
  {
    title: "Contact planning",
    value: "1",
    detail: "Bericht van planningsteam",
  },
];

export const opdrachtgeverDashboard: DashboardCard[] = [
  {
    title: "Nieuwe aanvraag doen",
    value: "+",
    detail: "Start een nieuwe personeelsaanvraag",
  },
  {
    title: "Lopende aanvragen",
    value: "2",
    detail: "Aanvragen in behandeling",
  },
  {
    title: "Projectinformatie",
    value: "1",
    detail: "Actief project met crewplanning",
  },
  {
    title: "Briefing uploaden",
    value: "1",
    detail: "Briefing nog aanvullen voor locatie",
  },
  {
    title: "Contact planning",
    value: "1",
    detail: "Vast aanspreekpunt beschikbaar",
  },
  {
    title: "Factuurinformatie",
    value: "1",
    detail: "Factuurgegevens en referenties",
  },
];

export function getPortalByType(type: string | null): PortalType {
  if (type === "intern" || type === "medewerker" || type === "opdrachtgever") {
    return type;
  }
  return "intern";
}
