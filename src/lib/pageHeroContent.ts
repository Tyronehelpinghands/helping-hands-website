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
    title: "Flexibele crew voor events, horeca en productie.",
    description:
      "Van last-minute extra handen tot complete projectinzet: Helping Hands levert praktische mensen die begrijpen wat er op locatie nodig is.",
    theme: "staffing",
    primaryCta: { label: "Personeel aanvragen", href: "/contact" },
    secondaryCta: { label: "Crew aanmelden", href: "/vacatures" },
    highlights: [
      { label: "Snel schakelen" },
      { label: "Duidelijke briefing" },
      { label: "Betrouwbare crew" },
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
    title: "Gebouwd vanuit praktijkervaring op de vloer.",
    description:
      "Helping Hands Agency is ontstaan vanuit ervaring in evenementen, horeca en productie. Wij leveren geen anonieme handjes, maar mensen die weten hoe ze zich op locatie moeten gedragen.",
    theme: "over",
    primaryCta: { label: "Bekijk projecten", href: "/projecten" },
    secondaryCta: { label: "Neem contact op", href: "/contact" },
    highlights: [
      { label: "Praktijkervaring" },
      { label: "Eén aanspreekpunt" },
      { label: "Duidelijke afspraken" },
      { label: "Betrouwbare uitvoering" },
    ],
    interactiveCards: [
      {
        title: "Praktijkervaring",
        description: "Wij kennen de werkvloer van events, horeca en productie van binnenuit.",
      },
      {
        title: "Eén aanspreekpunt",
        description: "Opdrachtgevers hebben één vast contact voor bezetting en terugkoppeling.",
      },
      {
        title: "Duidelijke afspraken",
        description: "Functie, tijden, kleding en taken worden vooraf helder afgestemd.",
      },
      {
        title: "Betrouwbare uitvoering",
        description: "Van aanvraag tot afhandeling: structuur in het proces en opvolging.",
      },
    ],
  },
  "/vacatures": {
    eyebrow: "Werken via Helping Hands",
    title: "Pak klussen mee die bij jou passen.",
    description:
      "Schrijf je in voor event-, horeca-, keuken-, stagebouw- en productiewerk. Jij geeft je beschikbaarheid door, wij koppelen je aan passende opdrachten.",
    theme: "vacatures",
    primaryCta: { label: "Crew aanmelden", href: "/vacatures#vacatures" },
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
      "Wij helpen met crewplanning, briefing, functies, aantallen en uitvoering. Van losse inzet tot terugkerende projectondersteuning.",
    theme: "opdrachtgevers",
    primaryCta: { label: "Aanvraag doen", href: "/contact" },
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
    eyebrow: "Voor crew",
    title: "Werken op events, horeca en productie.",
    description:
      "Via Helping Hands kun je ingezet worden op afwisselende klussen. Jij geeft je beschikbaarheid door, wij zorgen voor duidelijke informatie.",
    theme: "medewerkers",
    primaryCta: { label: "Aanmelden", href: "/vacatures" },
    secondaryCta: { label: "Naar medewerkersportaal", href: "/portaal/medewerkers" },
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
    title: "Laten we je aanvraag helder maken.",
    description:
      "Stuur je personeelsvraag, projectinformatie of samenwerking door. We denken mee over functies, aantallen, tijden en briefing.",
    theme: "contact",
    primaryCta: { label: "Mail ons", href: "mailto:info@helpinghandsagency.nl" },
    secondaryCta: { label: "Crew aanmelden", href: "/vacatures" },
    highlights: [
      { label: "Personeelsaanvraag" },
      { label: "Samenwerking" },
      { label: "Planning" },
      { label: "Administratie" },
    ],
    interactiveCards: [
      {
        title: "Personeelsaanvraag",
        description: "Datum, locatie, functies en aantal mensen — wij reageren snel.",
      },
      {
        title: "Samenwerking",
        description: "Vragen over structurele inzet of terugkerende projecten.",
      },
      {
        title: "Planning",
        description: "Afstemming over bezetting, briefing en tijden op locatie.",
      },
      {
        title: "Administratie",
        description: "Facturatie, uren en praktische vragen na afloop.",
      },
    ],
  },
};

export function getPageHeroContent(pathname: string): PageHeroContent {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  return pageHeroByPath[normalized] ?? pageHeroByPath["/"];
}
