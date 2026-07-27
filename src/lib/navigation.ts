import { siteConfig } from "@/lib/siteConfig";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/opdrachtgevers", label: "Opdrachtgevers" },
  { href: "/medewerkers", label: "Medewerkers" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/projecten", label: "Projecten" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
] as const;

export const contactEmail = siteConfig.email;
export const applicationsEmail = siteConfig.applicationsEmail;
export const ownerEmail = siteConfig.ownerEmail;
export const contactPhoneDisplay = siteConfig.phoneDisplay;
export const contactPhoneTel = siteConfig.phoneTel;
export const contactWhatsappUrl = siteConfig.whatsappUrl;
export const contactPhoneLandlineDisplay = siteConfig.phoneLandlineDisplay;
export const contactPhoneLandlineTel = siteConfig.phoneLandlineTel;

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
        href: "/diensten/event-crew",
      },
      {
        title: "Stagehands",
        description: "Laden, lossen, opbouw, afbouw en materiaalhandling.",
        href: "/diensten/stagehands",
      },
      {
        title: "Horeca support",
        description: "Barbacks, runners, bediening, uitgifte en hospitality.",
        href: "/diensten/horeca-personeel",
      },
      {
        title: "Restaurant personeel",
        description: "Bediening, hosts, runners en floor support in restaurants.",
        href: "/diensten/restaurant-personeel",
      },
      {
        title: "Keukenpersoneel",
        description: "Keukenhulpen, afwassers en zelfstandig werkend koks.",
        href: "/diensten/keukenpersoneel",
      },
      {
        title: "Barpersoneel",
        description: "Bartenders, barbacks en dranken runners voor bars en events.",
        href: "/diensten/barpersoneel",
      },
      {
        title: "Productie assistentie",
        description:
          "Backstage support, runners en praktische productieondersteuning.",
        href: "/diensten/productie-assistentie",
      },
      {
        title: "Logistiek",
        description: "Materiaalstromen, back-of-house en transportbewegingen.",
        href: "/diensten/logistiek",
      },
      {
        title: "Hospitality",
        description: "Hosts, guest support, VIP-begeleiding en ontvangst.",
        href: "/diensten/hospitality",
      },
      {
        title: "Alle diensten",
        description: "Filter op event, horeca, keuken, bar, stagebouw en meer.",
        href: "/diensten",
      },
    ],
    cta: { label: "Bekijk alle diensten", href: "/diensten" },
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
  { href: "/login", label: "Login" },
] as const;
