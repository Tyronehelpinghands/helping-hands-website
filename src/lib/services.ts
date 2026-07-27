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

export type ServiceLandingFaq = {
  question: string;
  answer: string;
};

export type ServiceLanding = {
  slug: ServiceLandingSlug;
  path: string;
  title: string;
  h1: string;
  description: string;
  category: import("@/lib/homeServices").HomeServiceCategory;
  /** Hub category-grid: short one-liner + anchor id */
  hubSummary: string;
  anchorId: string;
  keywords: string[];
  intro: string[];
  bullets: string[];
  /** Unique mid-page content — differs per slug */
  typicalUse: {
    title: string;
    items: string[];
  };
  alignment: {
    title: string;
    items: string[];
  };
  faqs: ServiceLandingFaq[];
  image: { src: string; alt: string };
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
    hubSummary:
      "Floor support, runners, check-in en crowd support voor festivals, concerten en beurzen.",
    anchorId: "event",
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
    typicalUse: {
      title: "Typische inzet event crew",
      items: [
        "Festivals en outdoor events met publieksstromen en meerdere zones",
        "Concerten en stadionshows met strakke call-times",
        "Beurzen en congressen met check-in, hostessen en floor runners",
        "Corporate events waar representatieve support op de vloer nodig is",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Functies, aantallen, start- en eindtijden per zone",
        "Kleding, badge of PBM en verzamelpunt",
        "Takenlijst: check-in, crowd, runnerroutes of hospitality",
        "Contactpersoon op locatie en escalatielijn",
      ],
    },
    faqs: [
      {
        question: "Welke eventfuncties kan ik aanvragen?",
        answer:
          "Onder andere eventmedewerkers, floor support, runners, check-in/ontvangst en crowd support. We stemmen de mix af op jouw productie.",
      },
      {
        question: "Werken jullie landelijk voor events?",
        answer:
          "Ja. We zijn gevestigd in Hilversum en zetten crew in door heel Nederland — van festivals tot beurzen en stadions.",
      },
      {
        question: "Hoe snel kan ik event crew aanvragen?",
        answer:
          "Deel datum, locatie, tijden, functies en aantallen via contact. Bij spoed kijken we wat nog haalbaar is op basis van beschikbaarheid.",
      },
    ],
    image: {
      src: "/images/crew/crew-field-01.webp",
      alt: "Event crew van Helping Hands op locatie",
    },
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
    hubSummary:
      "Flexibele horeca support: bediening, runners, barbacks en bartenders bij events en locaties.",
    anchorId: "horeca",
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
    typicalUse: {
      title: "Typische inzet horeca personeel",
      items: [
        "Festival- en eventcatering met hoge doorloop",
        "Banqueting en corporate diners",
        "Pop-up bars en tijdelijke horecapunten",
        "Locaties die tijdens piekuren extra floor- en barsupport nodig hebben",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Service- of barrol, aantal mensen en shifts",
        "Uniform, hygiëneregels en eventuele certificaten",
        "Taken: uitserveren, afruimen, bijvullen of barback",
        "Aanspreekpunt floor/bar en briefingmoment",
      ],
    },
    faqs: [
      {
        question: "Verschilt horeca support van restaurantpersoneel?",
        answer:
          "Horeca support is vaak event- en cateringgericht (floor, bar, runners). Voor vaste restaurantvloer zie je beter onze restaurant- of keukenlandings.",
      },
      {
        question: "Kunnen jullie ook alleen barbacks of runners leveren?",
        answer:
          "Ja. We bezetten per functie: runners bediening, barbacks, bartenders of een mix — afhankelijk van jouw briefing.",
      },
      {
        question: "Werken jullie met eventcatering én vaste locaties?",
        answer:
          "Beide. We zetten horeca crew in bij festivals en banqueting, én bij horecalocaties die tijdelijk of structureel versterking zoeken.",
      },
    ],
    image: {
      src: "/images/crew/crew-woman-branded.webp",
      alt: "Horeca crewlid van Helping Hands",
    },
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
    hubSummary:
      "Load-in, load-out, materiaalhandling en sitecrew voor podium- en festivalproducties.",
    anchorId: "stagebouw",
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
    typicalUse: {
      title: "Typische inzet stagehands",
      items: [
        "Concert- en tourload-ins met flightcases en risers",
        "Festivalopbouw en -afbouw op het terrein",
        "Podium- en standbouw met materiaalstromen",
        "Sitecrew die zones klaarzet en veilig meedraait",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Call-time, locatie-ingang en parkeer/laden-info",
        "PBM, werkschoenen en kledingvoorschriften",
        "Taken: load-in, cases, opbouw of afbouw",
        "Veiligheidsregels en leiding op locatie",
      ],
    },
    faqs: [
      {
        question: "Leveren jullie alleen load-in of ook afbouw?",
        answer:
          "Beide. We zetten stagehands en sitecrew in voor load-in, opbouw, load-out en afbouw — per shift of als doorlopende bezetting.",
      },
      {
        question: "Hebben stagehands ervaring met materiaalhandling?",
        answer:
          "We matchen op de opdracht: van cases rijden tot opbouw-ondersteuning. Bij zwaardere of gecertificeerde taken stemmen we dat vooraf af.",
      },
      {
        question: "Kunnen jullie sitecrew combineren met logistiek?",
        answer:
          "Ja. Voor grotere producties combineren we vaak stagehands met logistieke crew; we denken mee over de juiste mix.",
      },
    ],
    image: {
      src: "/images/crew/scaffolding-team-wide.webp",
      alt: "Stagehands en sitecrew tijdens opbouw",
    },
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
    hubSummary:
      "Bediening, hosts, runners en floor support voor restaurants en banqueting.",
    anchorId: "restaurant",
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
    typicalUse: {
      title: "Typische inzet restaurantpersoneel",
      items: [
        "Avondpieken en weekenddrukte in restaurants",
        "Banqueting en private dining",
        "Tijdelijke bezetting bij ziekte of seizoen",
        "Hosts aan de deur bij volle services",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Serviceconcept, dresscode en huisregels",
        "Aantal bediening, hosts of runners per shift",
        "Taken op de vloer versus sidework",
        "Inwerkmoment en aanspreekpunt op locatie",
      ],
    },
    faqs: [
      {
        question: "Is dit geschikt voor een vast restaurant, niet alleen events?",
        answer:
          "Ja. Deze landing is gericht op restaurantvloer: bediening, hosts en runners bij pieken of tijdelijke bezetting.",
      },
      {
        question: "Kunnen jullie ook alleen hosts leveren?",
        answer:
          "Ja. We bezetten per rol — hosts, bediening, runners of een combinatie — afgestemd op jouw service.",
      },
      {
        question: "Hoe zit het met kleding en briefing?",
        answer:
          "We stemmen dresscode, taken en inwerkafspraken vooraf af, zodat crew aansluit op jullie huisstandaard.",
      },
    ],
    image: {
      src: "/images/crew/thumbs-up-branded.webp",
      alt: "Restaurant- en floor support crewlid",
    },
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
    hubSummary:
      "Keukenhulpen, spoelkeuken en koks voor restaurants, catering en eventkeukens.",
    anchorId: "keuken",
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
    typicalUse: {
      title: "Typische inzet keukenpersoneel",
      items: [
        "Restaurantkeukens tijdens piekservice",
        "Event- en banquetingkeukens",
        "Spoelkeuken bij hoge doorloop",
        "Tijdelijke versterking met keukenhulp of kok",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Niveau: keukenhulp, afwas of zelfstandig werkend kok",
        "Hygiëne, HACCP-afspraken en kleding",
        "Station, mise-en-place of spoellijn",
        "Shiftijden en aanspreekpunt in de keuken",
      ],
    },
    faqs: [
      {
        question: "Leveren jullie ook zelfstandig werkend koks?",
        answer:
          "Ja. Naast keukenhulp en spoelkeuken kunnen we zelfstandig werkend koks inzetten — we matchen op niveau en opdracht.",
      },
      {
        question: "Werken jullie in restaurant- én eventkeukens?",
        answer:
          "Beide. We zetten keukencrew in bij vaste keukens en bij catering/banqueting op locatie.",
      },
      {
        question: "Wat moet ik aanleveren voor een keukenbezetting?",
        answer:
          "Datum, shifts, gewenst niveau, taken/station, kleding of PBM en contactpersoon in de keuken.",
      },
    ],
    image: {
      src: "/images/crew/chef-fryer.webp",
      alt: "Keukenpersoneel aan het werk",
    },
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
    hubSummary:
      "Bartenders, barbacks en dranken runners voor bars, festivals en eventbars.",
    anchorId: "bar",
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
    typicalUse: {
      title: "Typische inzet barpersoneel",
      items: [
        "Festival- en eventbars met hoge doorloop",
        "Clubs en vaste barlocaties tijdens piekavonden",
        "Corporate bars en pop-ups",
        "Barback- en runnerondersteuning naast bartenders",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Barconcept: snel service, cocktails of mixed",
        "Aantal bartenders, barbacks en runners",
        "Uniform, age-check en huisregels",
        "Opbouw/afbouw van de bar indien nodig",
      ],
    },
    faqs: [
      {
        question: "Verschilt barpersoneel van algemene horeca support?",
        answer:
          "Ja. Deze landing focust op barflow: bartenders, barbacks en dranken runners. Algemene floor/horeca staat op de horeca-landing.",
      },
      {
        question: "Kunnen jullie barbacks zonder bartender leveren?",
        answer:
          "Ja. We bezetten wat jij nodig hebt — alleen barback, alleen bartender, of een complete barcrew.",
      },
      {
        question: "Doen jullie ook bar opbouw en afbouw?",
        answer:
          "Op verzoek wel. Geef dat aan in de briefing zodat we de juiste bezetting en call-times plannen.",
      },
    ],
    image: {
      src: "/images/crew/branded-shirt-flex.webp",
      alt: "Bar- en event crewlid Helping Hands",
    },
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
    hubSummary:
      "Runners, backstage support en productie-assistentie voor live shows en festivals.",
    anchorId: "productie",
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
    typicalUse: {
      title: "Typische inzet productie-assistentie",
      items: [
        "Festival- en tourproducties met veel lopende taken",
        "Corporate events met crewontvangst en runners",
        "Live shows waar backstage strak moet lopen",
        "Productiekantoor-ondersteuning op locatie",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Rol: runner, productie-assistent of backstage support",
        "Call-sheet, radio/communicatie en verzamelpunt",
        "Autorijden/ritten indien nodig",
        "Aanspreekpunt productie en escalatie",
      ],
    },
    faqs: [
      {
        question: "Wat doet een productie-assistent bij jullie?",
        answer:
          "Praktische support voor het productieteam: taken uitzetten, crew ontvangen, briefings doorgeven en backstage rondes — altijd onder jullie regie.",
      },
      {
        question: "Kunnen runners ook ritten rijden?",
        answer:
          "Dat stemmen we vooraf af (rijbewijs, voertuig, verzekering). Niet elke runneropdracht vraagt om rijden.",
      },
      {
        question: "Is dit hetzelfde als event floor support?",
        answer:
          "Nee. Productie-assistentie zit dichter bij het productieteam/backstage; event crew focust meer op floor en publiek.",
      },
    ],
    image: {
      src: "/images/crew/arena-flightcase.webp",
      alt: "Productiecrew met flightcases op locatie",
    },
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
    hubSummary:
      "Materiaalrunners, laad- en loscrew en back-of-house logistiek op events en locaties.",
    anchorId: "logistiek",
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
    typicalUse: {
      title: "Typische inzet logistiek",
      items: [
        "Festivalterrein met meerdere materiaalstromen",
        "Beurzen en congressen met opbouwlogistiek",
        "Stadions en arena’s bij load-in/load-out",
        "Back-of-house voorraad en zone-klaarzet",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Zones, routes en laadtijden",
        "PBM, werkschoenen en voertuig/heftruck indien nodig",
        "Taken: laden/lossen, runners of voorraad",
        "Veiligheid en leiding op de vloer",
      ],
    },
    faqs: [
      {
        question: "Leveren jullie ook heftruckchauffeurs?",
        answer:
          "Waar gecertificeerde krachten nodig zijn, stemmen we dat vooraf af. Niet elke logistieke inzet vraagt om een heftruck.",
      },
      {
        question: "Past logistiek bij stagehands of is het apart?",
        answer:
          "Vaak overlappend, maar logistiek focust op materiaalstromen en back-of-house; stagehands meer op podium/load-in. We denken mee over de mix.",
      },
      {
        question: "Kunnen jullie landelijk logistieke crew leveren?",
        answer:
          "Ja. Vanuit Hilversum zetten we crew in op festivals, beurzen en locaties door heel Nederland.",
      },
    ],
    image: {
      src: "/images/crew/forklift-operator.webp",
      alt: "Logistieke crew tijdens materiaalhandling",
    },
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
    hubSummary:
      "Hosts, guest support, VIP-begeleiding en publieksstromen voor events en locaties.",
    anchorId: "hospitality",
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
    typicalUse: {
      title: "Typische inzet hospitality",
      items: [
        "VIP-lounges en artist hospitality",
        "Ontvangst bij congressen en corporate events",
        "Guest support bij festivals en shows",
        "Wachtrij- en doorstroombegeleiding bij entrees",
      ],
    },
    alignment: {
      title: "Wat wij afstemmen vooraf",
      items: [
        "Dresscode en representatie-eisen",
        "Zones: VIP, entree, lounge of floor",
        "Scripts voor doorverwijzen en FAQ’s op locatie",
        "Aanspreekpunt hospitality en escalatie",
      ],
    },
    faqs: [
      {
        question: "Verschilt hospitality van restaurant hosts?",
        answer:
          "Hospitality hier is event- en VIP-gericht (ontvangst, guest support, stromen). Restaurant hosts staan op de restaurant-landing.",
      },
      {
        question: "Kunnen jullie VIP-begeleiding leveren?",
        answer:
          "Ja. We zetten representatieve crew in voor VIP-zones en guest begeleiding — altijd volgens jullie briefing.",
      },
      {
        question: "Is hospitality ook geschikt voor publieksstromen?",
        answer:
          "Ja. Hosts en guest support helpen bij doorverwijzen, wachtrijen en een rustige eerste indruk bij entrees.",
      },
    ],
    image: {
      src: "/images/crew/crew-field-05.webp",
      alt: "Hospitality crew bij een evenement",
    },
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
