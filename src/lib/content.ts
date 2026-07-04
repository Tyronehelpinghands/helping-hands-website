import type { ServiceIconKey } from "@/lib/service-icons";

export type Service = {
  icon: ServiceIconKey;
  title: string;
  description: string;
  usage: string;
};

export const services: Service[] = [
  {
    icon: "event-crew",
    title: "Event crew",
    description:
      "Floor support, publieksstromen, runners, garderobe en algemene eventondersteuning.",
    usage: "Festivals, concerten, beurzen, stadions en corporate events.",
  },
  {
    icon: "horeca-support",
    title: "Horeca support",
    description:
      "Barbacks, runners, bediening, uitgifte en hospitality tijdens piekmomenten.",
    usage: "Bars, catering, VIP-areas en horeca-events op locatie.",
  },
  {
    icon: "stagehands",
    title: "Stagehands",
    description:
      "Laden, lossen, opbouw, afbouw en materiaalhandling voor producties.",
    usage: "Concerten, producties, load-in/load-out en technische opbouw.",
  },
  {
    icon: "productie-assistentie",
    title: "Productie assistentie",
    description:
      "Ondersteuning voor productieleiders, crewcoördinatie, backstage en praktische uitvoering.",
    usage: "Backstage, productiekantoor en ondersteuning op de werkvloer.",
  },
  {
    icon: "logistiek",
    title: "Logistieke ondersteuning",
    description:
      "Materiaalstromen, transportbewegingen, back-of-house en runners.",
    usage: "Magazijn, transport, materiaalbewegingen en back-of-house.",
  },
  {
    icon: "teamcaptains",
    title: "Teamcaptains",
    description:
      "Aanspreekpunt op locatie, aansturing van crew, briefing en snelle terugkoppeling.",
    usage: "Grotere crews, meerdere functies en complexe producties.",
  },
];

export const sectors = [
  "Evenementen",
  "Horeca",
  "Stagebouw",
  "Productie",
  "Logistiek",
] as const;

export const deployments = [
  {
    label: "Festivals",
    detail: "Opbouw, hospitality & floor support",
    imageKey: "festivals" as const,
  },
  {
    label: "Concerten",
    detail: "Backstage, opbouw & afbouw",
    imageKey: "stagehands" as const,
  },
  {
    label: "Stadions",
    detail: "Event crew & logistiek op schaal",
    imageKey: null,
  },
  {
    label: "Beurzen",
    detail: "Registratie, routing & crew",
    imageKey: null,
  },
  {
    label: "Horecalocaties",
    detail: "Bars, bediening & runners",
    imageKey: "horecaSupport" as const,
  },
  {
    label: "Producties",
    detail: "Crewcoördinatie & assistentie",
    imageKey: "productionBackstage" as const,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Aanvraag",
    description:
      "Je deelt datum, locatie, tijden, functies en aantal mensen.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "Wij stemmen de bezetting af op beschikbaarheid, ervaring en type productie.",
  },
  {
    step: "03",
    title: "Briefing",
    description:
      "Crew ontvangt duidelijke informatie over aankomst, kleding, taken en aanspreekpunten.",
  },
  {
    step: "04",
    title: "Uitvoering",
    description:
      "Het team staat op locatie klaar voor opbouw, show, hospitality, logistiek of afbouw.",
  },
  {
    step: "05",
    title: "Afhandeling",
    description:
      "Na afloop zorgen we voor terugkoppeling, urencontrole en opvolging.",
  },
];

export const dashboardSteps = [
  { label: "Aanvraag ontvangen", status: "Voltooid", done: true },
  { label: "Crew geselecteerd", status: "Voltooid", done: true },
  { label: "Briefing gedeeld", status: "Actief", done: false },
  { label: "Team op locatie", status: "Gepland", done: false },
];

export const projectCategories = [
  {
    title: "Stadionproducties",
    description:
      "Crew voor grote locaties met publieksstromen, hospitality en logistiek op schaal.",
  },
  {
    title: "Festivals",
    description:
      "Opbouw, show en afbouw met stagehands, event crew en floor support.",
  },
  {
    title: "Beurzen",
    description:
      "Registratie, routing, gastvrijheid en operationele ondersteuning.",
  },
  {
    title: "Horeca events",
    description:
      "Bars, bediening, runners en hospitality tijdens piekmomenten.",
  },
  {
    title: "Load-in / load-out",
    description:
      "Stagehands en logistieke ondersteuning bij laden, lossen en materiaalhandling.",
  },
  {
    title: "Productie ondersteuning",
    description:
      "Assistentie voor productieleiders, backstage en crewcoördinatie.",
  },
];
