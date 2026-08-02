import { siteConfig } from "@/lib/siteConfig";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/personeel-inhuren", label: "Personeel inhuren" },
  { href: "/diensten", label: "Diensten" },
  { href: "/opdrachtgevers", label: "Opdrachtgevers" },
  { href: "/werken-bij", label: "Werken bij" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/projecten", label: "Projecten" },
  { href: "/locaties", label: "Locaties" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
] as const;

export const contactEmail = siteConfig.email;
export const planningEmail = siteConfig.planningEmail;
export const plannerEmail = siteConfig.plannerEmail;
export const applicationsEmail = siteConfig.applicationsEmail;
export const employeeApplyMailto = `mailto:${applicationsEmail}?subject=${encodeURIComponent(
  "Aanmelding medewerker Helping Hands",
)}`;
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
        title: "Personeel inhuren",
        description: "Overzicht van alle inhuur-landingspagina's.",
        href: "/personeel-inhuren",
      },
      {
        title: "Event crew",
        description:
          "Floor support, publieksstromen, runners en algemene eventondersteuning.",
        href: "/personeel-inhuren/event-crew",
      },
      {
        title: "Stagehands",
        description: "Laden, lossen, opbouw, afbouw en materiaalhandling.",
        href: "/personeel-inhuren/stagehands",
      },
      {
        title: "Horeca support",
        description: "Barbacks, runners, bediening, uitgifte en hospitality.",
        href: "/personeel-inhuren/horeca-personeel",
      },
      {
        title: "Restaurant personeel",
        description: "Bediening, hosts, runners en floor support in restaurants.",
        href: "/diensten/restaurant-personeel",
      },
      {
        title: "Keukenhulp",
        description: "Keukenhulpen, afwassers en ondersteuning in de brigade.",
        href: "/personeel-inhuren/keukenhulp",
      },
      {
        title: "Barpersoneel",
        description: "Bartenders, barbacks en dranken runners voor bars en events.",
        href: "/personeel-inhuren/barpersoneel",
      },
      {
        title: "Productie-assistenten",
        description:
          "Backstage support, runners en praktische productieondersteuning.",
        href: "/personeel-inhuren/productie-assistenten",
      },
      {
        title: "Logistiek",
        description: "Materiaalstromen, back-of-house en transportbewegingen.",
        href: "/personeel-inhuren/logistiek-personeel",
      },
      {
        title: "Hospitality",
        description: "Hosts, guest support, VIP-begeleiding en ontvangst.",
        href: "/personeel-inhuren/hospitality-personeel",
      },
      {
        title: "Alle diensten",
        description: "Filter op event, horeca, keuken, bar, stagebouw en meer.",
        href: "/diensten",
      },
      {
        title: "Locaties",
        description: "Bekijk onze werkgebieden per stad en regio.",
        href: "/locaties",
      },
    ],
    cta: { label: "Personeel inhuren", href: "/personeel-inhuren" },
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
        href: "/contact?type=personeel-aanvragen",
      },
      {
        title: "Personeel inhuren",
        description: "Alle inhuur-landingspagina's op een rij.",
        href: "/personeel-inhuren",
      },
      {
        title: "Voor opdrachtgevers",
        description:
          "Bekijk hoe wij planning, briefing en uitvoering aanpakken.",
        href: "/opdrachtgevers",
      },
    ],
    cta: {
      label: "Vraag crew aan",
      href: "/contact?type=personeel-aanvragen",
    },
  },
  {
    id: "medewerkers",
    label: "Werken bij",
    href: "/werken-bij",
    panelTitle: "Werken bij Helping Hands",
    items: [
      {
        title: "Werken bij",
        description: "Shifts, begeleiding en doorgroeien op echte producties.",
        href: "/werken-bij",
      },
      {
        title: "Bekijk vacatures",
        description: "Openstaande functies voor events, horeca en producties.",
        href: "/vacatures",
      },
      {
        title: "Aanmelden als crewlid",
        description: "Meld je aan voor events, horeca en producties.",
        href: employeeApplyMailto,
      },
      {
        title: "Doorgroeien",
        description: "Van crewlid naar teamcaptain.",
        href: "/werken-bij",
      },
      {
        title: "Werken als eventmedewerker",
        description: "Floor support, runners en events.",
        href: "/werken-als/eventmedewerker",
      },
    ],
    cta: { label: "Aanmelden", href: "/contact?type=crew-aanmelden" },
  },
];

export type MobileNavLink = { label: string; href: string };

export type MobileNavGroup = {
  id: NavDropdownConfig["id"];
  label: string;
  href: string;
  items: MobileNavLink[];
};

/** Curated flat link lists for the mobile drawer accordions (mobile-only; desktop dropdowns use navDropdowns). */
export const mobileNavGroups: MobileNavGroup[] = [
  {
    id: "diensten",
    label: "Diensten",
    href: "/personeel-inhuren",
    items: [
      { label: "Personeel inhuren", href: "/personeel-inhuren" },
      { label: "Event crew", href: "/personeel-inhuren/event-crew" },
      { label: "Horeca personeel", href: "/personeel-inhuren/horeca-personeel" },
      { label: "Restaurant personeel", href: "/diensten/restaurant-personeel" },
      { label: "Keukenhulp", href: "/personeel-inhuren/keukenhulp" },
      { label: "Barpersoneel", href: "/personeel-inhuren/barpersoneel" },
      { label: "Stagehands", href: "/personeel-inhuren/stagehands" },
      {
        label: "Productie-assistenten",
        href: "/personeel-inhuren/productie-assistenten",
      },
      { label: "Logistiek", href: "/personeel-inhuren/logistiek-personeel" },
      {
        label: "Hospitality",
        href: "/personeel-inhuren/hospitality-personeel",
      },
      { label: "Alle diensten", href: "/diensten" },
      { label: "Locaties", href: "/locaties" },
    ],
  },
  {
    id: "opdrachtgevers",
    label: "Opdrachtgevers",
    href: "/opdrachtgevers",
    items: [
      {
        label: "Personeel aanvragen",
        href: "/contact?type=personeel-aanvragen",
      },
      { label: "Personeel inhuren", href: "/personeel-inhuren" },
      { label: "Voor opdrachtgevers", href: "/opdrachtgevers" },
      { label: "Projectervaring", href: "/projecten" },
    ],
  },
  {
    id: "medewerkers",
    label: "Werken bij",
    href: "/werken-bij",
    items: [
      { label: "Werken bij Helping Hands", href: "/werken-bij" },
      { label: "Vacatures bekijken", href: "/vacatures" },
      { label: "Crew aanmelden", href: "/contact?type=crew-aanmelden" },
      {
        label: "Werken als eventmedewerker",
        href: "/werken-als/eventmedewerker",
      },
      { label: "Medewerkersportaal", href: "/portaal/medewerkers" },
    ],
  },
];

export const simpleNavLinks = [
  { href: "/", label: "Home" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
  { href: "/projecten", label: "Projecten" },
  { href: "/login", label: "Login" },
] as const;
