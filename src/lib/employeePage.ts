import type { CrewPhoto } from "@/lib/crewPhotos";
import { applicationsEmail } from "@/lib/navigation";
import type { ServiceIconKey } from "@/lib/service-icons";

export type EmployeeBenefit = {
  title: string;
  description: string;
  icon: ServiceIconKey;
};

export type EmployeeRoleLevel = "Instap" | "Ervaring handig" | "Ervaren";

export type EmployeeRoleCategory =
  | "Event"
  | "Horeca"
  | "Restaurant"
  | "Keuken"
  | "Bar"
  | "Stagebouw"
  | "Productie"
  | "Logistiek"
  | "Hospitality";

export type EmployeeRole = {
  id: string;
  category: EmployeeRoleCategory;
  title: string;
  description: string;
  tasks: string[];
  idealFor: string;
  level: EmployeeRoleLevel;
};

export type EmployeeStep = {
  step: string;
  title: string;
  description: string;
};

export type EmployeeExpectation = {
  title: string;
};

export type EmployeeFaq = {
  question: string;
  answer: string;
};

export type EmployeeAudienceItem = {
  title: string;
  description: string;
};

export type EmployeeGrowthStage = {
  step: string;
  title: string;
  description: string;
};

export const employeeApplyMailto = `mailto:${applicationsEmail}?subject=${encodeURIComponent(
  "Aanmelding medewerker Helping Hands",
)}`;

export const employeeHeroTrust = [
  "Duidelijke planning",
  "Eerlijke communicatie",
  "Begeleiding op locatie",
  "Doorgroeien naar teamcaptain",
] as const;

export const employeeHeroPhotos: (CrewPhoto & { badge: string })[] = [
  {
    src: "/images/crew/thumbs-up-branded.webp",
    alt: "Helping Hands crewlid met branding geeft thumbs up",
    badge: "Event crew",
  },
  {
    src: "/images/crew/scaffolding-team-wide.webp",
    alt: "Crew bouwt scaffolding op een evenemententerrein",
    badge: "Stagehands",
  },
  {
    src: "/images/crew/chef-fryer.webp",
    alt: "Keuken- en horecacrew tijdens eventcatering",
    badge: "Horeca",
  },
  {
    src: "/images/crew/stadium-flightcase-push.webp",
    alt: "Productiecrew verplaatst flightcase in een stadion",
    badge: "Productie",
  },
  {
    src: "/images/crew/forklift-operator.webp",
    alt: "Logistieke crew op heftruck tijdens laden en lossen",
    badge: "Logistiek",
  },
];

export const employeeCollagePhotos: (CrewPhoto & { caption: string })[] = [
  {
    src: "/images/crew/scaffolding-team-wide.webp",
    alt: "Helping Hands crew tijdens scaffolding en opbouw",
    caption: "Opbouw & stage",
  },
  {
    src: "/images/crew/crew-woman-branded.webp",
    alt: "Crewlid met Helping Hands branding op locatie",
    caption: "Crew op locatie",
  },
  {
    src: "/images/crew/festival-build-site.webp",
    alt: "Festivalterrein tijdens opbouw met crew en materiaal",
    caption: "Festivals",
  },
  {
    src: "/images/crew/chef-fryer.webp",
    alt: "Horeca- en keukencrew aan het werk",
    caption: "Horeca & keuken",
  },
  {
    src: "/images/crew/arena-flightcase.webp",
    alt: "Crew verplaatst flightcase in een arena",
    caption: "Stadions",
  },
  {
    src: "/images/crew/harness-branded-back.webp",
    alt: "Crewlid met Helping Hands shirt en valbeveiliging",
    caption: "Veilig werken",
  },
];

export const employeeBenefits: EmployeeBenefit[] = [
  {
    title: "Duidelijke planning",
    description:
      "Je weet vooraf waar je moet zijn, hoe laat je start, wat je functie is en wie je aanspreekpunt is.",
    icon: "productie-assistentie",
  },
  {
    title: "Werkervaring opbouwen",
    description:
      "Je draait mee op echte producties, events, horeca en backstage omgevingen. Zo bouw je snel praktijkervaring op.",
    icon: "event-crew",
  },
  {
    title: "Begeleiding en structuur",
    description:
      "We helpen je met duidelijke briefings, verwachtingen en communicatie, zodat je weet wat er van je gevraagd wordt.",
    icon: "teamcaptains",
  },
  {
    title: "Afwisselend werk",
    description:
      "Geen week hoeft hetzelfde te zijn. Je kunt werken op festivals, concerten, horeca-events, restaurants, beurzen en producties.",
    icon: "hospitality",
  },
  {
    title: "Doorgroeien",
    description:
      "Laat je zien dat je betrouwbaar bent, dan kun je doorgroeien naar meer verantwoordelijkheid, zoals teamcaptain of vaste crew.",
    icon: "stagehands",
  },
  {
    title: "Korte lijnen",
    description:
      "Je communiceert direct met de planning en krijgt praktische informatie zonder onnodig gedoe.",
    icon: "logistiek",
  },
];

export const employeeRoleCategories: EmployeeRoleCategory[] = [
  "Event",
  "Horeca",
  "Restaurant",
  "Keuken",
  "Bar",
  "Stagebouw",
  "Productie",
  "Logistiek",
  "Hospitality",
];

export const employeeRoles: EmployeeRole[] = [
  {
    id: "eventmedewerker",
    category: "Event",
    title: "Eventmedewerker",
    description:
      "Je ondersteunt de vloer tijdens evenementen: doorstroom, netheid en praktische hulp waar nodig.",
    tasks: ["Floor support", "Zones netjes houden", "Gasten helpen", "Instructies opvolgen"],
    idealFor: "Mensen die graag meedraaien op festivals, concerten en beurzen.",
    level: "Instap",
  },
  {
    id: "floor-support",
    category: "Event",
    title: "Floor support",
    description:
      "Je houdt overzicht op de vloer en schakelt snel bij wijzigingen tijdens de productie.",
    tasks: ["Doorstroom regelen", "Crew helpen", "Locatie netjes houden", "Communiceren met leiding"],
    idealFor: "Crew die overzicht houdt en rustig blijft onder druk.",
    level: "Ervaring handig",
  },
  {
    id: "runner",
    category: "Event",
    title: "Runner",
    description:
      "Je loopt mee als praktische schakel tussen teams, materiaal en locaties.",
    tasks: ["Boodschappen en materiaal", "Teams verbinden", "Snel schakelen", "Taken oppakken"],
    idealFor: "Actieve starters die willen leren op echte producties.",
    level: "Instap",
  },
  {
    id: "check-in",
    category: "Event",
    title: "Check-in medewerker",
    description:
      "Je ontvangt gasten of crew bij binnenkomst en zorgt voor een soepele start.",
    tasks: ["Check-in uitvoeren", "Vragen beantwoorden", "Doorstroom bewaken", "Representatief blijven"],
    idealFor: "Mensen met een open houding en duidelijke communicatie.",
    level: "Instap",
  },
  {
    id: "garderobe",
    category: "Event",
    title: "Garderobe support",
    description:
      "Je helpt bij garderobe, jassen en praktische ontvangst rondom het event.",
    tasks: ["Jassen aannemen", "Tickets/nummers bijhouden", "Gastvrij helpen", "Piekdrukte opvangen"],
    idealFor: "Crew die gastvrij is en overzicht houdt.",
    level: "Instap",
  },
  {
    id: "horeca-support",
    category: "Horeca",
    title: "Horeca support",
    description:
      "Je ondersteunt bediening, bar of vloer tijdens drukke horeca- en eventmomenten.",
    tasks: ["Afruimen", "Bijvullen", "Floor support", "Team helpen"],
    idealFor: "Mensen die flexibel willen werken in horeca en evenementen.",
    level: "Instap",
  },
  {
    id: "runner-bediening",
    category: "Horeca",
    title: "Runner bediening",
    description:
      "Je ondersteunt de bediening met snelle runs tussen keuken, bar en vloer.",
    tasks: ["Dranken/gerechten brengen", "Afruimen", "Bar of keuken ontlasten", "Tempo houden"],
    idealFor: "Snelle starters die willen meedraaien in de service.",
    level: "Instap",
  },
  {
    id: "barback",
    category: "Bar",
    title: "Barback",
    description:
      "Je houdt de bar draaiende: bijvullen, ijs, glaswerk en ondersteuning van bartenders.",
    tasks: ["Bar bijvullen", "Glaswerk verzorgen", "IJs en voorraad", "Bartenders ondersteunen"],
    idealFor: "Mensen die graag achter de schermen in de bar meewerken.",
    level: "Instap",
  },
  {
    id: "bartender",
    category: "Bar",
    title: "Bartender",
    description:
      "Je mixt en serveert dranken, houdt tempo aan en blijft representatief.",
    tasks: ["Dranken maken", "Gastcontact", "Bar netjes houden", "Kassasystemen volgen"],
    idealFor: "Crew met barervaring die zelfstandig kan werken.",
    level: "Ervaren",
  },
  {
    id: "hospitality-medewerker",
    category: "Hospitality",
    title: "Hospitality medewerker",
    description:
      "Je zorgt voor ontvangst, hospitalityzones en een soepele gastbeleving.",
    tasks: ["Gasten ontvangen", "Zones bemannen", "Vragen beantwoorden", "Representatief optreden"],
    idealFor: "Mensen met een professionele, gastvrije houding.",
    level: "Ervaring handig",
  },
  {
    id: "bedieningsmedewerker",
    category: "Restaurant",
    title: "Bedieningsmedewerker",
    description:
      "Je bedient gasten in restaurants of tijdelijke horeca-omgevingen tijdens piekdrukte.",
    tasks: ["Bestellingen opnemen", "Uitserveren", "Afruimen", "Gastcontact"],
    idealFor: "Horecamedewerkers die flexibel willen bijspringen.",
    level: "Ervaring handig",
  },
  {
    id: "host",
    category: "Restaurant",
    title: "Host / gastheer / gastvrouw",
    description:
      "Je ontvangt gasten, regelt doorstroom en zorgt voor een warme eerste indruk.",
    tasks: ["Ontvangst", "Tafels toewijzen", "Wachten begeleiden", "Vragen beantwoorden"],
    idealFor: "Mensen die representatief en communicatief sterk zijn.",
    level: "Ervaring handig",
  },
  {
    id: "runner-restaurant",
    category: "Restaurant",
    title: "Runner bediening",
    description:
      "Je ondersteunt restaurantbediening met snelle runs en floor support.",
    tasks: ["Gerechten brengen", "Afruimen", "Bijvullen", "Team ontlasten"],
    idealFor: "Starters die ervaring willen opdoen in restaurants.",
    level: "Instap",
  },
  {
    id: "floor-restaurant",
    category: "Restaurant",
    title: "Floor support restaurant",
    description:
      "Je houdt de vloer overzichtelijk tijdens drukke diensten.",
    tasks: ["Zones netjes houden", "Bediening helpen", "Doorstroom steunen", "Instructies volgen"],
    idealFor: "Crew die rustig blijft tijdens piekmomenten.",
    level: "Instap",
  },
  {
    id: "keukenhulp",
    category: "Keuken",
    title: "Keukenhulp",
    description:
      "Je ondersteunt de keuken met voorbereiding, opruimen en praktische hulp.",
    tasks: ["Mise-en-place", "Opruimen", "Voorbereiding", "Keukenteam helpen"],
    idealFor: "Mensen die willen starten in de keuken.",
    level: "Instap",
  },
  {
    id: "afwasser",
    category: "Keuken",
    title: "Spoelkeuken / afwasser",
    description:
      "Je houdt spoelkeuken en glaswerk op tempo tijdens drukke diensten.",
    tasks: ["Afwassen", "Glaswerk verzorgen", "Stations bijhouden", "Tempo houden"],
    idealFor: "Hardwerkende crew die van duidelijk werk houdt.",
    level: "Instap",
  },
  {
    id: "kok",
    category: "Keuken",
    title: "Zelfstandig werkend kok",
    description:
      "Je bereidt gerechten zelfstandig volgens briefing en productiestandaard.",
    tasks: ["Bereiden", "Mise-en-place", "Kwaliteit bewaken", "Keukenritme volgen"],
    idealFor: "Ervaren keukenpersoneel dat zelfstandig kan draaien.",
    level: "Ervaren",
  },
  {
    id: "mise",
    category: "Keuken",
    title: "Mise-en-place ondersteuning",
    description:
      "Je helpt met voorbereiding zodat de keuken soepel kan starten.",
    tasks: ["Snijden", "Voorbereiden", "Stations klaarzetten", "Opruimen"],
    idealFor: "Starters die keukenervaring willen opbouwen.",
    level: "Instap",
  },
  {
    id: "stagehand",
    category: "Stagebouw",
    title: "Stagehand",
    description:
      "Je helpt bij opbouw, afbouw, load-in, load-out en materiaal op locatie.",
    tasks: [
      "Cases rijden",
      "Materiaal klaarzetten",
      "Opbouw/afbouw ondersteunen",
      "Crew volgen op instructie",
    ],
    idealFor: "Mensen die fysiek willen meewerken op echte producties.",
    level: "Instap",
  },
  {
    id: "load-in",
    category: "Stagebouw",
    title: "Load-in / load-out crew",
    description:
      "Je laadt, lost en verplaatst materiaal bij start en einde van de productie.",
    tasks: ["Laden en lossen", "Flightcases verplaatsen", "Zones vrijhouden", "Veilig tillen"],
    idealFor: "Sterke, betrouwbare crew die tempo aankan.",
    level: "Ervaring handig",
  },
  {
    id: "sitecrew",
    category: "Stagebouw",
    title: "Sitecrew",
    description:
      "Je ondersteunt het terrein: opbouwzones, netheid en praktische hulp.",
    tasks: ["Terrein helpen", "Materiaal verplaatsen", "Zones netjes houden", "Instructies volgen"],
    idealFor: "Crew die graag buiten en op festivals werkt.",
    level: "Instap",
  },
  {
    id: "materiaalcrew",
    category: "Stagebouw",
    title: "Materiaalcrew",
    description:
      "Je zorgt dat materiaal op de juiste plek staat, op het juiste moment.",
    tasks: ["Materiaal sorteren", "Aanvoeren", "Terugbrengen", "Overzicht houden"],
    idealFor: "Mensen die gestructureerd en praktisch werken.",
    level: "Ervaring handig",
  },
  {
    id: "productie-assistent",
    category: "Productie",
    title: "Productie assistent",
    description:
      "Je ondersteunt productie met praktische taken, communicatie en floor help.",
    tasks: ["Taken oppakken", "Teams ondersteunen", "Info doorgeven", "Locatie helpen"],
    idealFor: "Crew die wil doorgroeien in productieomgevingen.",
    level: "Ervaring handig",
  },
  {
    id: "backstage",
    category: "Productie",
    title: "Backstage support",
    description:
      "Je helpt backstage met orde, runs en praktische ondersteuning.",
    tasks: ["Backstage zones", "Runs uitvoeren", "Crew helpen", "Rust bewaren"],
    idealFor: "Mensen die discreet en betrouwbaar werken.",
    level: "Ervaring handig",
  },
  {
    id: "productie-runner",
    category: "Productie",
    title: "Productie runner",
    description:
      "Je bent de snelle schakel tussen productie, crew en locatie.",
    tasks: ["Runs", "Materiaal brengen", "Berichten doorgeven", "Flexibel schakelen"],
    idealFor: "Actieve starters in de eventwereld.",
    level: "Instap",
  },
  {
    id: "floor-productie",
    category: "Productie",
    title: "Floor support",
    description:
      "Je ondersteunt de vloer tijdens show, opbouw of afbouw.",
    tasks: ["Floor helpen", "Netheid", "Crew steunen", "Instructies volgen"],
    idealFor: "Crew die overzicht houdt tijdens drukke momenten.",
    level: "Instap",
  },
  {
    id: "logistiek-medewerker",
    category: "Logistiek",
    title: "Logistiek medewerker",
    description:
      "Je houdt materiaalstromen, zones en voorraden op orde tijdens de klus.",
    tasks: ["Voorraad bijhouden", "Materiaal verplaatsen", "Zones ordenen", "Laden/lossen"],
    idealFor: "Mensen die gestructureerd en fysiek willen werken.",
    level: "Instap",
  },
  {
    id: "materiaal-runner",
    category: "Logistiek",
    title: "Materiaal runner",
    description:
      "Je brengt materiaal heen en weer zodat teams door kunnen werken.",
    tasks: ["Aanvoeren", "Terugbrengen", "Prioriteiten volgen", "Snel schakelen"],
    idealFor: "Actieve crew die graag meeloopt op locatie.",
    level: "Instap",
  },
  {
    id: "laad-los",
    category: "Logistiek",
    title: "Laad- en loscrew",
    description:
      "Je laadt en lost trucks, trailers en materiaal veilig en in tempo.",
    tasks: ["Laden", "Lossen", "Veilig tillen", "Overzicht houden"],
    idealFor: "Sterke crew met gevoel voor veiligheid en tempo.",
    level: "Ervaring handig",
  },
  {
    id: "voorraad",
    category: "Logistiek",
    title: "Voorraad ondersteuning",
    description:
      "Je houdt voorraden en materialen bij zodat de productie soepel blijft lopen.",
    tasks: ["Voorraad checken", "Bijvullen", "Ordenen", "Tekorten melden"],
    idealFor: "Mensen die nauwkeurig en betrouwbaar werken.",
    level: "Instap",
  },
];

export const employeeSteps: EmployeeStep[] = [
  {
    step: "01",
    title: "Meld je aan",
    description: "Laat je gegevens, ervaring en beschikbaarheid achter.",
  },
  {
    step: "02",
    title: "Kennismaking",
    description:
      "We kijken wat bij je past: event, horeca, stagebouw, productie, logistiek of keuken.",
  },
  {
    step: "03",
    title: "Eerste klus",
    description:
      "Je krijgt een duidelijke briefing met locatie, tijden, kleding en aanspreekpunt.",
  },
  {
    step: "04",
    title: "Laten zien wat je kan",
    description:
      "Ben je op tijd, communiceer je goed en werk je netjes, dan kun je vaker worden ingepland.",
  },
  {
    step: "05",
    title: "Doorgroeien",
    description:
      "Betrouwbare crewleden kunnen doorgroeien naar vaste inzet of teamcaptain.",
  },
];

export const employeeAudience: EmployeeAudienceItem[] = [
  {
    title: "Jongeren die werkervaring willen opbouwen",
    description: "Eerste stappen in events, horeca of productie — met begeleiding.",
  },
  {
    title: "Mensen die flexibel willen werken",
    description: "Afwisselende klussen naast studie, andere werkzaamheden of een nieuw ritme.",
  },
  {
    title: "Crew met eventervaring",
    description: "Al stagehands, runners of floor support gedaan? Dan kun je sneller meedraaien.",
  },
  {
    title: "Horecamedewerkers",
    description: "Bediening, bar, keuken of hospitality — flexibel bijspringen waar nodig.",
  },
  {
    title: "Stagehands en productiecrew",
    description: "Opbouw, afbouw, load-in en backstage: fysiek werk op echte locaties.",
  },
  {
    title: "Mensen die willen doorgroeien",
    description: "Van eerste klus naar vaste crew of teamcaptain als je betrouwbaar bent.",
  },
  {
    title: "Mensen die structuur en begeleiding zoeken",
    description: "Duidelijke briefing, verwachtingen en korte lijnen — zonder soft gepraat.",
  },
];

export const employeeExpectations: EmployeeExpectation[] = [
  { title: "Op tijd komen" },
  { title: "Duidelijk communiceren" },
  { title: "Afspraken nakomen" },
  { title: "Professionele houding" },
  { title: "Netjes omgaan met opdrachtgevers en collega’s" },
  { title: "Veilig werken" },
  { title: "Telefoon bereikbaar houden rondom klussen" },
  { title: "Kledingvoorschriften volgen" },
];

export const employeeGrowthPath: EmployeeGrowthStage[] = [
  {
    step: "01",
    title: "Nieuwe crew",
    description: "Eerste klussen, briefing volgen, laten zien dat je betrouwbaar bent.",
  },
  {
    step: "02",
    title: "Vaste crew",
    description: "Vaker ingepland worden op basis van beschikbaarheid en inzet.",
  },
  {
    step: "03",
    title: "Ervaren crew",
    description: "Meer verantwoordelijkheid op locatie en complexere producties.",
  },
  {
    step: "04",
    title: "Teamcaptain",
    description: "Team aansturen, aanspreekpunt op locatie en kwaliteit bewaken.",
  },
  {
    step: "05",
    title: "Planning / coördinatie",
    description: "Ondersteuning bij planning, briefing en operationele coördinatie.",
  },
];

export const employeeFaqs: EmployeeFaq[] = [
  {
    question: "Heb ik ervaring nodig?",
    answer:
      "Niet altijd. Voor sommige functies is ervaring handig, maar motivatie en betrouwbaarheid zijn het belangrijkst. We kijken welke klus bij jou past.",
  },
  {
    question: "Waar kan ik werken?",
    answer:
      "Op events, festivals, concerten, horeca, restaurants, stagebouw, productie en logistieke klussen.",
  },
  {
    question: "Hoe weet ik waar ik moet zijn?",
    answer:
      "Je krijgt vooraf een briefing met locatie, starttijd, functie, kleding en aanspreekpunt.",
  },
  {
    question: "Kan ik doorgroeien?",
    answer:
      "Ja. Betrouwbare crewleden kunnen vaker worden ingepland en doorgroeien naar meer verantwoordelijkheid.",
  },
  {
    question: "Hoe meld ik me aan?",
    answer: `Via de aanmeldknop op de pagina of via ${applicationsEmail}.`,
  },
  {
    question: "Moet ik altijd beschikbaar zijn?",
    answer:
      "Nee, maar duidelijke beschikbaarheid helpt de planning. Hoe betrouwbaarder je communiceert, hoe beter we je kunnen inzetten.",
  },
];

export function rolesByCategory(category: EmployeeRoleCategory | "Alle") {
  if (category === "Alle") return employeeRoles;
  return employeeRoles.filter((role) => role.category === category);
}

export function levelBadgeClass(level: EmployeeRoleLevel) {
  switch (level) {
    case "Instap":
      return "border-[#173A8A]/25 bg-[#173A8A]/10 text-[#173A8A]";
    case "Ervaring handig":
      return "border-[#F28C28]/35 bg-[#FFF7ED] text-[#c2410c]";
    case "Ervaren":
      return "border-[#0B1F4D]/30 bg-[#0B1F4D] text-white";
  }
}
