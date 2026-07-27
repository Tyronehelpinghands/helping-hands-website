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
      "Stagehands inhuren voor load-in, load-out, materiaalhandling en sitecrew bij concerten, festivals en podiumproducties in Nederland.",
    category: "Stagebouw",
    keywords: [
      "stagehands inhuren",
      "stagebouw personeel",
      "load-in crew",
      "productie crew",
    ],
    intro: [
      "Helping Hands Agency levert stagehands en sitecrew voor producties met strakke timing. Van load-in tot afbouw: mensen die materiaal veilig en snel verplaatsen.",
      "Geschikt voor concerten, festivals, podiumproducties en locaties waar cases, risers en decor in beweging zijn.",
    ],
    bullets: [
      "Load-in en load-out crew",
      "Materiaalhandling en cases rijden",
      "Opbouw- en afbouwondersteuning",
      "Sitecrew met oog voor veiligheid en tempo",
    ],
    published: true,
  },
  {
    slug: "restaurant-personeel",
    path: "/diensten/restaurant-personeel",
    title: "Restaurant personeel inhuren",
    h1: "Restaurant personeel inhuren voor service en floor support",
    description:
      "Restaurant personeel inhuren: bediening, hosts, runners en floor support voor restaurants, banqueting en horecalocaties in Nederland.",
    category: "Restaurant",
    keywords: [
      "restaurant personeel inhuren",
      "bediening inhuren",
      "hosts restaurant",
      "flex personeel horeca",
    ],
    intro: [
      "Voor restaurants en horecalocaties leveren wij flexibele mensen op de vloer: bediening, hosts, runners en floor support tijdens piekmomenten of tijdelijke bezetting.",
      "Je plant met één aanspreekpunt; wij zorgen voor duidelijke taken, kledingafspraken en mensen die gastgericht meedraaien.",
    ],
    bullets: [
      "Bedieningsmedewerkers en floor support",
      "Hosts / gastheer en gastvrouw",
      "Restaurant runners en afruimen / bijvullen",
      "Inzet bij pieken, events en tijdelijke bezetting",
    ],
    published: true,
  },
  {
    slug: "keukenpersoneel",
    path: "/diensten/keukenpersoneel",
    title: "Keukenpersoneel inhuren",
    h1: "Keukenpersoneel en koks inhuren",
    description:
      "Keukenpersoneel inhuren: keukenhulpen, afwassers en zelfstandig werkend koks voor restaurants, catering, banqueting en events.",
    category: "Keuken",
    keywords: [
      "keukenpersoneel inhuren",
      "keukenhulp inhuren",
      "koks inhuren",
      "afwasser inhuren",
    ],
    intro: [
      "In de keuken telt tempo, hygiëne en meedraaien zonder gedoe. Wij leveren keukenhulpen, spoelkeuken en koks die weten wat er tijdens service of eventcatering nodig is.",
      "Geschikt voor restaurants, catering, banqueting en eventkeukens die tijdelijk of structureel versterking zoeken.",
    ],
    bullets: [
      "Keukenhulpen en mise-en-place support",
      "Spoelkeuken / afwassers",
      "Zelfstandig werkend koks",
      "Chef-ondersteuning tijdens piekmomenten",
    ],
    published: true,
  },
  {
    slug: "barpersoneel",
    path: "/diensten/barpersoneel",
    title: "Barpersoneel inhuren",
    h1: "Barpersoneel inhuren voor bars, festivals en events",
    description:
      "Barpersoneel inhuren: bartenders, barbacks en dranken runners voor bars, clubs, festivals en eventbars in Nederland.",
    category: "Bar",
    keywords: [
      "barpersoneel inhuren",
      "bartender inhuren",
      "barback inhuren",
      "festival bar crew",
    ],
    intro: [
      "Achter de bar moet de flow doorlopen. Helping Hands levert bartenders, barbacks en dranken runners zodat service blijft draaien tijdens drukte.",
      "Inzetbaar op vaste barlocaties, pop-up bars, festivals, clubs en corporate events.",
    ],
    bullets: [
      "Bartenders voor service en cocktails",
      "Barbacks voor ijs, glaswerk en voorraad",
      "Dranken runners tussen bar en floor",
      "Bar opbouw- en afbouwondersteuning",
    ],
    published: true,
  },
  {
    slug: "productie-assistentie",
    path: "/diensten/productie-assistentie",
    title: "Productie assistentie",
    h1: "Productie assistentie en runners voor live producties",
    description:
      "Productie assistentie inhuren: runners, backstage support en assistentie voor festivals, live shows en locatieproducties.",
    category: "Productie",
    keywords: [
      "productie assistentie",
      "productie crew",
      "runners inhuren",
      "backstage support",
    ],
    intro: [
      "Productieteams hebben betrouwbare assistentie nodig: runners, crewontvangst en praktische support zodat producers en projectleiders kunnen focussen.",
      "Wij leveren productie-assistenten en runners voor festivals, corporate events, live shows en locatieproducties.",
    ],
    bullets: [
      "Productie-assistenten op locatie",
      "Runners voor snelle taken en ritten",
      "Crew ontvangen en briefings doorgeven",
      "Backstage en productiekantoor-ondersteuning",
    ],
    published: true,
  },
  {
    slug: "logistiek",
    path: "/diensten/logistiek",
    title: "Logistiek personeel evenementen",
    h1: "Logistiek personeel voor evenementen en locaties",
    description:
      "Logistiek personeel evenementen: materiaalrunners, laad- en loscrew, zone-opbouw en voorraadondersteuning op festivals, beurzen en stadions.",
    category: "Logistiek",
    keywords: [
      "logistiek personeel evenementen",
      "materiaalrunners",
      "event logistiek crew",
      "laad en los crew",
    ],
    intro: [
      "Op grote locaties staat of valt de dag met logistiek: materiaalstromen, zones klaarzetten en leveringen begeleiden zonder chaos.",
      "Helping Hands levert logistieke crew voor festivals, beurzen, stadions en producties waar back-of-house strak moet lopen.",
    ],
    bullets: [
      "Materiaal verplaatsen en zones klaarzetten",
      "Laad- en losondersteuning",
      "Leveringen begeleiden",
      "Voorraad aanvullen op locatie",
    ],
    published: true,
  },
  {
    slug: "hospitality",
    path: "/diensten/hospitality",
    title: "Hospitality crew",
    h1: "Hospitality crew voor events, VIP en ontvangst",
    description:
      "Hospitality crew inhuren: hosts, guest support, VIP-begeleiding en publieksstromen voor events, festivals en horecalocaties.",
    category: "Hospitality",
    keywords: [
      "hospitality crew",
      "hosts inhuren",
      "VIP support event",
      "guest relations crew",
    ],
    intro: [
      "Hospitality vraagt om representatieve, rustige mensen die gasten ontvangen, doorverwijzen en wachtrijen begeleiden — ook onder druk.",
      "Wij leveren hosts en guest support voor events, VIP-ontvangsten, restaurants en locaties waar eerste indruk telt.",
    ],
    bullets: [
      "Hosts voor ontvangst en begeleiding",
      "Guest support en doorverwijzen",
      "VIP- en hospitalityzones",
      "Publieksstromen en wachtrijbegeleiding",
    ],
    published: true,
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

/** Map a homepage service card to its best matching published landing path. */
export function getLandingPathForService(service: {
  id: string;
  category: import("@/lib/homeServices").HomeServiceCategory;
}): string | undefined {
  const byId: Record<string, ServiceLandingSlug> = {
    stagehands: "stagehands",
    "load-in-load-out": "stagehands",
    sitecrew: "stagehands",
    "horeca-support": "horeca-personeel",
    "horeca-bartenders": "barpersoneel",
    bartenders: "barpersoneel",
    barbacks: "barpersoneel",
    "horeca-barbacks": "barpersoneel",
    keukenhulpen: "keukenpersoneel",
    "zelfstandig-werkend-koks": "keukenpersoneel",
    "spoelkeuken-afwassers": "keukenpersoneel",
    bedieningsmedewerkers: "restaurant-personeel",
    "hosts-gastheer": "restaurant-personeel",
    "productie-assistenten": "productie-assistentie",
    "productie-runners": "productie-assistentie",
    "logistiek-medewerkers": "logistiek",
    "materiaal-runners": "logistiek",
    hosts: "hospitality",
    "guest-support": "hospitality",
    "vip-support": "hospitality",
    eventmedewerkers: "event-crew",
    "event-floor-support": "event-crew",
    "event-runners": "event-crew",
  };

  const byCategory: Record<
    import("@/lib/homeServices").HomeServiceCategory,
    ServiceLandingSlug
  > = {
    Event: "event-crew",
    Horeca: "horeca-personeel",
    Restaurant: "restaurant-personeel",
    Keuken: "keukenpersoneel",
    Bar: "barpersoneel",
    Stagebouw: "stagehands",
    Productie: "productie-assistentie",
    Logistiek: "logistiek",
    Hospitality: "hospitality",
  };

  const slug = byId[service.id] ?? byCategory[service.category];
  const landing = getServiceLanding(slug);
  return landing?.published ? landing.path : undefined;
}
