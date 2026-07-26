/**
 * Canonical service API for marketing UI and SEO landings.
 * Service data lives in homeServices.ts — re-exported here (single source of truth).
 */

export {
  getAllHomeServices as getAllServices,
  getFeaturedHomeServices as getFeaturedServices,
  getHomeServicesByFilter as getServicesByFilter,
  homeServiceFilters as serviceFilters,
  homeServices as services,
  type HomeService as Service,
  type HomeServiceCategory as ServiceCategory,
  type HomeServiceFilter as ServiceFilter,
} from "@/lib/homeServices";

export {
  getAllHomeServices,
  getFeaturedHomeServices,
  getHomeServicesByFilter,
  homeServiceFilters,
  homeServices,
  type HomeService,
  type HomeServiceCategory,
  type HomeServiceFilter,
} from "@/lib/homeServices";

export type ServiceLandingSlug =
  | "event-crew"
  | "horeca-personeel"
  | "stagehands"
  | "restaurant-personeel"
  | "keukenpersoneel"
  | "barpersoneel"
  | "productie-assistentie"
  | "logistiek"
  | "hospitality";

export type ServiceLanding = {
  slug: ServiceLandingSlug;
  path: string;
  title: string;
  h1: string;
  description: string;
  category: import("@/lib/homeServices").HomeServiceCategory;
  keywords: string[];
  intro: string[];
  bullets: string[];
  /** When true, page is live in the app router. */
  published: boolean;
};

export const serviceLandings: ServiceLanding[] = [
  {
    slug: "event-crew",
    path: "/diensten/event-crew",
    title: "Event crew inhuren",
    h1: "Event crew inhuren voor festivals, concerten en beurzen",
    description:
      "Event crew inhuren in Nederland: floor support, runners, check-in, crowd support en hospitality voor evenementen, festivals en beurzen.",
    category: "Event",
    keywords: [
      "event crew inhuren",
      "crew evenementen",
      "event personeel Nederland",
      "runners event",
    ],
    intro: [
      "Helping Hands Agency levert event crew voor producties waar timing en doorstroom tellen. Denk aan festivals, concerten, beurzen, corporate events en stadionproducties.",
      "Je deelt datum, locatie, tijden en functies — wij bezetten met praktische mensen die snappen wat er op de vloer speelt.",
    ],
    bullets: [
      "Eventmedewerkers en floor support",
      "Runners en check-in / ontvangst",
      "Crowd support en hospitality crew",
      "Eén aanspreekpunt voor briefing en bezetting",
    ],
    published: true,
  },
  {
    slug: "horeca-personeel",
    path: "/diensten/horeca-personeel",
    title: "Horeca personeel inhuren",
    h1: "Horeca personeel inhuren voor events en locaties",
    description:
      "Horeca personeel inhuren: bediening, runners, barbacks en bartenders voor events, festivals, banqueting en horecalocaties in Nederland.",
    category: "Horeca",
    keywords: [
      "horeca personeel inhuren",
      "horeca uitzendbureau",
      "barpersoneel inhuren",
      "personeel evenementenbureau",
    ],
    intro: [
      "Voor drukke horecadiensten en eventcatering leveren wij flexibele horeca support: uitserveren, afruimen, bijvullen en barondersteuning.",
      "Geschikt voor festivals, banqueting, pop-up bars en horecalocaties die tijdelijk of structureel extra handen nodig hebben.",
    ],
    bullets: [
      "Horeca support en runners bediening",
      "Bartenders en barbacks",
      "Inzet bij piekmomenten en events",
      "Duidelijke briefing over taken en kleding",
    ],
    published: true,
  },
  {
    slug: "stagehands",
    path: "/diensten/stagehands",
    title: "Stagehands inhuren",
    h1: "Stagehands inhuren voor load-in, opbouw en afbouw",
    description:
      "Stagehands inhuren voor load-in, load-out, materiaalhandling en sitecrew bij concerten, festivals en podiumproducties.",
    category: "Stagebouw",
    keywords: ["stagehands inhuren", "stagebouw personeel", "productie crew"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "restaurant-personeel",
    path: "/diensten/restaurant-personeel",
    title: "Restaurant personeel inhuren",
    h1: "Restaurant personeel inhuren",
    description:
      "Restaurant personeel inhuren: bediening, hosts, runners en floor support voor restaurants en horecalocaties.",
    category: "Restaurant",
    keywords: ["restaurant personeel inhuren"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "keukenpersoneel",
    path: "/diensten/keukenpersoneel",
    title: "Keukenpersoneel inhuren",
    h1: "Keukenpersoneel en koks inhuren",
    description:
      "Keukenpersoneel inhuren: keukenhulpen, afwassers en zelfstandig werkend koks voor restaurants, catering en events.",
    category: "Keuken",
    keywords: ["keukenhulp inhuren", "koks inhuren"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "barpersoneel",
    path: "/diensten/barpersoneel",
    title: "Barpersoneel inhuren",
    h1: "Barpersoneel inhuren",
    description:
      "Barpersoneel inhuren: bartenders, barbacks en dranken runners voor bars, festivals en events.",
    category: "Bar",
    keywords: ["barpersoneel inhuren"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "productie-assistentie",
    path: "/diensten/productie-assistentie",
    title: "Productie assistentie",
    h1: "Productie assistentie en runners",
    description:
      "Productie crew en assistentie voor festivals, live shows en locatieproducties.",
    category: "Productie",
    keywords: ["productie crew"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "logistiek",
    path: "/diensten/logistiek",
    title: "Logistiek personeel evenementen",
    h1: "Logistiek personeel voor evenementen",
    description:
      "Logistiek personeel evenementen: materiaalrunners, laad- en loscrew en voorraadondersteuning.",
    category: "Logistiek",
    keywords: ["logistiek personeel evenementen"],
    intro: [],
    bullets: [],
    published: false,
  },
  {
    slug: "hospitality",
    path: "/diensten/hospitality",
    title: "Hospitality crew",
    h1: "Hospitality crew voor events en VIP",
    description:
      "Hospitality crew: hosts, guest support, VIP support en publieksbegeleiding.",
    category: "Hospitality",
    keywords: ["hospitality crew", "crew agency Nederland"],
    intro: [],
    bullets: [],
    published: false,
  },
];

export function getPublishedServiceLandings(): ServiceLanding[] {
  return serviceLandings.filter((landing) => landing.published);
}

export function getServiceLanding(
  slug: string,
): ServiceLanding | undefined {
  return serviceLandings.find((landing) => landing.slug === slug);
}
