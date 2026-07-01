export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/opdrachtgevers", label: "Opdrachtgevers" },
  { href: "/medewerkers", label: "Medewerkers" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/projecten", label: "Projecten" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
] as const;

export const contactEmail = "info@helpinghandsagency.nl";
export const applicationsEmail = "aanmeldingen@helpinghandsagency.nl";

export type DropdownItem = {
  title: string;
  description: string;
  href: string;
};

export type NavDropdownConfig = {
  id: "diensten" | "opdrachtgevers" | "medewerkers";
  label: string;
  href: string;
  panelTitle: string;
  panelDescription?: string;
  items: DropdownItem[];
  cta?: { label: string; href: string };
};

export const navDropdowns: NavDropdownConfig[] = [
  {
    id: "diensten",
    label: "Diensten",
    href: "/diensten",
    panelTitle: "Onze diensten",
    panelDescription: "Crew en ondersteuning voor elke fase van je productie.",
    items: [
      {
        title: "Event crew",
        description:
          "Floor support, publieksstromen, runners en algemene eventondersteuning.",
        href: "/diensten",
      },
      {
        title: "Horeca support",
        description: "Barbacks, runners, bediening, uitgifte en hospitality.",
        href: "/diensten",
      },
      {
        title: "Stagehands",
        description: "Laden, lossen, opbouw, afbouw en materiaalhandling.",
        href: "/diensten",
      },
      {
        title: "Productie assistentie",
        description:
          "Backstage support, runners en praktische productieondersteuning.",
        href: "/diensten",
      },
      {
        title: "Logistiek",
        description: "Materiaalstromen, back-of-house en transportbewegingen.",
        href: "/diensten",
      },
      {
        title: "Teamcaptains",
        description: "Aansturing, briefing en aanspreekpunt op locatie.",
        href: "/diensten",
      },
    ],
  },
  {
    id: "opdrachtgevers",
    label: "Opdrachtgevers",
    href: "/opdrachtgevers",
    panelTitle: "Personeel nodig?",
    items: [
      {
        title: "Personeel aanvragen",
        description: "Deel datum, locatie, tijden, functies en aantal mensen.",
        href: "/contact",
      },
      {
        title: "Voor opdrachtgevers",
        description:
          "Bekijk hoe wij planning, briefing en uitvoering aanpakken.",
        href: "/opdrachtgevers",
      },
      {
        title: "Werkwijze",
        description: "Van aanvraag tot afhandeling.",
        href: "/opdrachtgevers",
      },
    ],
    cta: { label: "Vraag crew aan", href: "/contact" },
  },
  {
    id: "medewerkers",
    label: "Medewerkers",
    href: "/medewerkers",
    panelTitle: "Werken bij Helping Hands",
    items: [
      {
        title: "Bekijk vacatures",
        description: "Openstaande functies voor events, horeca en producties.",
        href: "/vacatures",
      },
      {
        title: "Aanmelden als crewlid",
        description: "Meld je aan voor events, horeca en producties.",
        href: "/vacatures",
      },
      {
        title: "Doorgroeien",
        description: "Van crewlid naar teamcaptain.",
        href: "/medewerkers",
      },
    ],
    cta: { label: "Aanmelden", href: "/vacatures" },
  },
];

export const simpleNavLinks = [
  { href: "/", label: "Home" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/projecten", label: "Projecten" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
] as const;
