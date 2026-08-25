import { crewApplyHref } from "@/lib/navigation";

export type PageHeroTheme =
  | "staffing"
  | "vacatures"
  | "projecten"
  | "opdrachtgevers"
  | "medewerkers"
  | "diensten"
  | "contact"
  | "over";

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  theme: PageHeroTheme;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  highlights: {
    label: string;
    value?: string;
    description?: string;
  }[];
  interactiveCards: {
    title: string;
    description: string;
    tag?: string;
    hoverHint?: string;
  }[];
};

const pageHeroByPath: Record<string, PageHeroContent> = {
  "/": {
    eyebrow: "Helping Hands Agency",
    title: "Event crew en horecapersoneel inhuren voor events en producties.",
    description:
      "Van last-minute extra handen tot complete projectinzet: Helping Hands Agency levert event crew, stagehands en horecapersoneel die begrijpen wat er op locatie nodig is.",
    theme: "staffing",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Crew aanmelden", href: crewApplyHref },
    highlights: [
      { label: "Snel schakelen" },
      { label: "Duidelijke briefing" },
      { label: "Hilversum · landelijk" },
      { label: "Eén aanspreekpunt" },
    ],
    interactiveCards: [
      {
        title: "Eventcrew",
        description: "Opbouw, afbouw, runners en algemene ondersteuning op locatie.",
        tag: "Events",
      },
      {
        title: "Horeca support",
        description: "Bar, bediening, keukenhulp en floor support tijdens drukke momenten.",
        tag: "Horeca",
      },
      {
        title: "Stagebouw",
        description: "Load-in, load-out en sitecrew voor producties met strakke timing.",
        tag: "Productie",
      },
      {
        title: "Productie",
        description: "Assistentie achter de schermen zodat het team op locatie kan focussen.",
        tag: "Backstage",
      },
    ],
  },
  "/over-ons": {
    eyebrow: "Over ons",
    title: "Meer dan alleen een uitzendbureau.",
    description:
      "Opgericht in 2022 door Tyrone van der Schagt: professionele crew voor events, horeca en productie — met een missie om jongeren een eerlijke kans op de arbeidsmarkt te geven.",
    theme: "over",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Werken bij Helping Hands", href: "/vacatures" },
    highlights: [
      { label: "Sinds 2022" },
      { label: "Persoonlijke begeleiding" },
      { label: "Professionele uitvoering" },
      { label: "Doorgroeimogelijkheden" },
    ],
    interactiveCards: [
      {
        title: "Maatschappelijke missie",
        description:
          "Jongeren en jongvolwassenen weer in beweging brengen met werk, structuur en begeleiding.",
      },
      {
        title: "Professionele inzet",
        description:
          "Opdrachtgevers krijgen crew die op tijd is, veilig werkt en verantwoordelijkheid neemt.",
      },
      {
        title: "Persoonlijke match",
        description:
          "Niet elke opdracht past bij iedereen — wij kijken naar motivatie, houding en ontwikkeling.",
      },
      {
        title: "Groei op de vloer",
        description:
          "Van eerste opdracht tot doorgroei als specialist, teamleider of voorman.",
      },
    ],
  },
  "/vacatures": {
    eyebrow: "Werken via Helping Hands",
    title: "Pak klussen mee die bij jou passen.",
    description:
      "Schrijf je in voor event-, horeca-, keuken-, stagebouw- en productiewerk. Jij geeft je beschikbaarheid door, wij koppelen je aan passende opdrachten.",
    theme: "vacatures",
    primaryCta: { label: "Crew aanmelden", href: crewApplyHref },
    secondaryCta: { label: "Bekijk functies", href: "/vacatures#vacatures" },
    highlights: [
      { label: "Flexibel" },
      { label: "Afwisselend" },
      { label: "Duidelijke info" },
      { label: "Portaal" },
    ],
    interactiveCards: [
      {
        title: "Flexibele diensten",
        description: "Werk wanneer het jou uitkomt — events, horeca en productie.",
        hoverHint: "Voor mensen die aanpakken",
      },
      {
        title: "Events & horeca",
        description: "Van festivals en concerten tot restaurants en catering.",
        hoverHint: "Ook voor koks en horeca",
      },
      {
        title: "Keuken & bar",
        description: "Bediening, bar, keuken en spoel — met briefing vooraf.",
        hoverHint: "Duidelijke briefings",
      },
      {
        title: "Stagebouw & productie",
        description: "Load-in, sitecrew en backstage via planning en portaal.",
        hoverHint: "Planning via portaal",
      },
    ],
  },
  "/projecten": {
    eyebrow: "Projectervaring",
    title: "Ervaring op locaties, festivals en producties.",
    description:
      "Onze crew is via verschillende opdrachten, partners en producties ingezet binnen events, horeca, stagebouw, logistiek en hospitality.",
    theme: "projecten",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Bekijk diensten", href: "/diensten" },
    highlights: [
      { label: "Crewervaring" },
      { label: "Diverse sectoren" },
      { label: "Landelijk" },
      { label: "Projectmatig" },
    ],
    interactiveCards: [
      {
        title: "Festivals",
        description: "Crewervaring opgedaan bij uiteenlopende festivalproducties.",
        tag: "Events",
      },
      {
        title: "Stadions",
        description: "Inzet via opdrachten en partners op grootschalige locaties.",
        tag: "Locaties",
      },
      {
        title: "Beurslocaties",
        description: "Ondersteuning bij beurzen, congressen en zakelijke events.",
        tag: "Beurs",
      },
      {
        title: "Horeca events",
        description: "Floor support en horeca-ervaring bij events en restaurants.",
        tag: "Horeca",
      },
    ],
  },
  "/diensten": {
    eyebrow: "Diensten",
    title: "De juiste mensen op de juiste plek.",
    description:
      "Wij leveren ondersteuning voor events, horeca, restaurants, stagebouw, productie, logistiek en hospitality.",
    theme: "diensten",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Bekijk vacatures", href: "/vacatures" },
    highlights: [
      { label: "Events" },
      { label: "Horeca" },
      { label: "Stagebouw" },
      { label: "Logistiek" },
    ],
    interactiveCards: [
      {
        title: "Event & floor support",
        description: "Runners, crowd support en algemene eventcrew op locatie.",
      },
      {
        title: "Horeca & restaurant",
        description: "Bar, bediening, keuken en leidinggevende ondersteuning.",
      },
      {
        title: "Stagebouw & load-out",
        description: "Load-in, load-out en sitecrew voor strakke producties.",
      },
      {
        title: "Productie & logistiek",
        description: "Assistentie, magazijn en logistieke ondersteuning.",
      },
    ],
  },
  "/opdrachtgevers": {
    eyebrow: "Voor opdrachtgevers",
    title: "Personeel nodig zonder gedoe?",
    description:
      "Voor events, producties, podiumbouw, logistiek en horeca regelen wij functies, aantallen, planning, briefing, accreditatie, urenregistratie en begeleiding op locatie — van losse inzet tot terugkerende projectondersteuning.",
    theme: "opdrachtgevers",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Bekijk projectervaring", href: "/projecten" },
    highlights: [
      { label: "Snelle aanvraag" },
      { label: "Heldere planning" },
      { label: "Briefing" },
      { label: "Terugkoppeling" },
    ],
    interactiveCards: [
      {
        title: "Snelle aanvraag",
        description: "Deel datum, locatie, functies en aantal — wij denken mee.",
        tag: "Stap 1",
      },
      {
        title: "Heldere planning",
        description: "Crew afgestemd op ervaring, beschikbaarheid en type productie.",
        tag: "Stap 2",
      },
      {
        title: "Briefing vooraf",
        description: "Aankomst, kleding, taken en aanspreekpunten zijn helder.",
        tag: "Stap 3",
      },
      {
        title: "Terugkoppeling achteraf",
        description: "Eén vast contact bij Helping Hands — ook na afloop.",
        tag: "Stap 4",
      },
    ],
  },
  "/medewerkers": {
    eyebrow: "Werken bij Helping Hands",
    title: "Pak klussen mee, bouw ervaring op en groei door in de eventwereld.",
    description:
      "Bij Helping Hands werk je op events, horeca, stagebouw, productie en logistiek. Je krijgt duidelijke afspraken, begeleiding en de kans om jezelf te ontwikkelen op echte producties.",
    theme: "medewerkers",
    primaryCta: { label: "Aanmelden als crewlid", href: crewApplyHref },
    secondaryCta: { label: "Bekijk vacatures", href: "/vacatures" },
    highlights: [
      { label: "Planning" },
      { label: "Beschikbaarheid" },
      { label: "Uren" },
      { label: "Berichten" },
    ],
    interactiveCards: [
      {
        title: "Planning bekijken",
        description: "Zie je komende diensten en projectinformatie in het portaal.",
      },
      {
        title: "Beschikbaarheid doorgeven",
        description: "Geef aan wanneer je kunt — planning koppelt passende opdrachten.",
      },
      {
        title: "Uren controleren",
        description: "Bekijk gewerkte uren en geef wijzigingen door indien nodig.",
      },
      {
        title: "Berichten ontvangen",
        description: "Updates over planning, wijzigingen en belangrijke info.",
      },
    ],
  },
  "/contact": {
    eyebrow: "Contact",
    title: "Personeel nodig of aanmelden als crew?",
    description:
      "Vertel ons wat je nodig hebt. Voor personeelsaanvragen, samenwerkingen en crew-aanmeldingen helpen we je snel naar de juiste vervolgstap.",
    theme: "contact",
    primaryCta: { label: "Personeel aanvragen", href: "/contact#aanvraag" },
    secondaryCta: { label: "Crew aanmelden", href: crewApplyHref },
    highlights: [
      { label: "Snel schakelen" },
      { label: "Duidelijke briefing" },
      { label: "Korte lijnen" },
    ],
    interactiveCards: [
      {
        title: "Personeelsaanvraag",
        description:
          "Datum, locatie, functies en aantal mensen — mail naar planning.",
      },
      {
        title: "Crew aanmelden",
        description:
          "Ervaring en beschikbaarheid — mail naar aanmeldingen.",
      },
      {
        title: "Algemene vraag",
        description: "Samenwerking of overige vragen — mail naar info.",
      },
      {
        title: "Spoed",
        description:
          "Korte doorlooptijd? Vink spoed aan en bel of app direct.",
      },
    ],
  },
};

export function getPageHeroContent(pathname: string): PageHeroContent {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  return pageHeroByPath[normalized] ?? pageHeroByPath["/"];
}

