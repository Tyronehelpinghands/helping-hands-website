import { applicationsEmail } from "@/lib/navigation";

export type VacancyCategory =
  | "Event"
  | "Horeca"
  | "Restaurant"
  | "Keuken"
  | "Bar"
  | "Stagebouw"
  | "Productie"
  | "Logistiek"
  | "Hospitality"
  | "Leidinggevend";

export type VacancyLevel =
  | "Instap"
  | "Ervaring handig"
  | "Ervaren"
  | "Leidinggevend";

export type Vacancy = {
  id: string;
  slug: string;
  title: string;
  category: VacancyCategory;
  level: VacancyLevel;
  employmentType: string;
  location: string;
  shortDescription: string;
  description: string;
  tasks: string[];
  profile: string[];
  niceToHave?: string[];
  whatYouGet: string[];
  suitableFor: string[];
  tags: string[];
  featured?: boolean;
  urgent?: boolean;
  applicationEmail: string;
};

/** @deprecated Prefer category tabs from vacancyFilters.ts */
export const vacancyFilters = [
  "Alle",
  "Event",
  "Horeca",
  "Restaurant",
  "Keuken",
  "Bar",
  "Stagebouw",
  "Productie",
  "Logistiek",
  "Hospitality",
  "Leidinggevend",
] as const;

export type VacancyFilter = (typeof vacancyFilters)[number];

const email = applicationsEmail;

const defaults = {
  location: "Landelijk, afhankelijk van opdracht",
  whatYouGet: [
    "Duidelijke briefing vooraf",
    "Aanspreekpunt op locatie",
    "Kans om ervaring op te bouwen",
    "Doorgroeimogelijkheden bij goede inzet",
  ],
  applicationEmail: email,
} as const;

function v(
  partial: Omit<Vacancy, "applicationEmail" | "location" | "whatYouGet"> &
    Partial<Pick<Vacancy, "location" | "whatYouGet" | "applicationEmail">>,
): Vacancy {
  return {
    location: defaults.location,
    whatYouGet: [...defaults.whatYouGet],
    applicationEmail: defaults.applicationEmail,
    ...partial,
  };
}

export const vacancies: Vacancy[] = [
  // ——— Event ———
  v({
    id: "eventmedewerker-floor-support",
    slug: "eventmedewerker-floor-support",
    title: "Eventmedewerker / Floor support",
    category: "Event",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ondersteun publieksstromen, floor support en algemene eventtaken op locatie.",
    description:
      "Als eventmedewerker help je op festivals, concerten, beurzen en andere evenementen. Je begeleidt gasten, ondersteunt de vloer en zorgt dat het programma soepel draait. Geschikt als vacature event crew of eventmedewerker vacature — ook als je nog weinig ervaring hebt maar wel aanpakgericht bent.",
    tasks: [
      "Publieksstromen begeleiden",
      "Floor support tijdens show",
      "Garderobe en check-in ondersteunen",
      "Runnerswerk en praktische hulp",
      "Algemene eventondersteuning",
    ],
    profile: [
      "Representatief en gastvrij",
      "Communicatief sterk",
      "Stressbestendig",
      "Op tijd en betrouwbaar",
    ],
    suitableFor: [
      "Mensen die energie krijgen van gasten helpen",
      "Instappers die willen werken in de evenementen",
      "Flexibel werk events naast studie of andere werkzaamheden",
    ],
    tags: ["event crew", "floor support", "festivals", "instap"],
    featured: true,
  }),
  v({
    id: "runner-events",
    slug: "runner-events",
    title: "Runner events",
    category: "Event",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Snel schakelen: materialen, berichten en ondersteuning heen en weer op events.",
    description:
      "Als runner op events ben je de schakel tussen teams. Je brengt materiaal, steunt productie en floor, en houdt het tempo hoog wanneer het druk wordt.",
    tasks: [
      "Materialen en berichten rondbrengen",
      "Teams op de vloer ondersteunen",
      "Kleine taken snel oppakken",
      "Contact houden met teamcaptain",
    ],
    profile: [
      "Snel en alert",
      "Fysiek fit",
      "Teamspeler",
      "Flexibel inzetbaar",
    ],
    suitableFor: [
      "Mensen die graag in beweging blijven",
      "Instappers die events willen leren kennen",
    ],
    tags: ["runner", "event crew", "festivals", "tempo"],
  }),
  v({
    id: "check-in-medewerker",
    slug: "check-in-medewerker",
    title: "Check-in medewerker",
    category: "Event",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ontvang bezoekers professioneel bij check-in, tickets en toegang.",
    description:
      "Bij check-in ben jij het eerste gezicht van het event. Je helpt gasten snel en vriendelijk binnen, beantwoordt korte vragen en werkt netjes volgens de briefing.",
    tasks: [
      "Gasten checken en doorlaten",
      "Tickets of badges controleren",
      "Wachtrijen soepel houden",
      "Samenwerken met security en floor",
    ],
    profile: [
      "Gastvrij en representatief",
      "Duidelijk communiceren",
      "Nauwkeurig werken",
      "Rustig onder drukte",
    ],
    suitableFor: [
      "Mensen die graag gasten helpen",
      "Wie representatief wil werken op events",
    ],
    tags: ["check-in", "hospitality", "event crew", "gasten"],
  }),
  v({
    id: "garderobe-support",
    slug: "garderobe-support",
    title: "Garderobe support",
    category: "Event",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Beheer jassen en tassen netjes en vriendelijk bij events en locaties.",
    description:
      "Garderobe support houdt de flow bij de ingang soepel. Je werkt snel, netjes en gastvrij — ideaal als eerste stap in event crew werk.",
    tasks: [
      "Jassen en tassen aannemen en teruggeven",
      "Nummers en tickets bijhouden",
      "Wachtrijen begeleiden",
      "Gasten vriendelijk te woord staan",
    ],
    profile: [
      "Netjes en georganiseerd",
      "Gastvrij",
      "Tempo kunnen maken",
      "Betrouwbaar",
    ],
    suitableFor: ["Instappers", "Mensen die graag met gasten werken"],
    tags: ["garderobe", "event crew", "instap"],
  }),

  // ——— Horeca ———
  v({
    id: "horeca-support",
    slug: "horeca-support",
    title: "Horeca support",
    category: "Horeca",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ondersteun bars, uitgifte en hospitality tijdens piekmomenten.",
    description:
      "Horeca vacature voor wie wil meedraaien op events en locaties: barback, runner, uitgifte en hospitality. Je houdt het tempo hoog en het team scherp.",
    tasks: [
      "Bar en uitgifte ondersteunen",
      "Runnerswerk in horeca",
      "Voorraad aanvullen",
      "Gastgerichte service",
    ],
    profile: [
      "Gastgericht",
      "Snel kunnen schakelen",
      "Netjes werken",
      "Ervaring is mooi meegenomen",
    ],
    suitableFor: [
      "Mensen die energie krijgen van keuken/horeca",
      "Flexibele horecahulp",
    ],
    tags: ["horeca", "barback", "runner", "hospitality"],
    featured: true,
  }),
  v({
    id: "runner-bediening",
    slug: "runner-bediening",
    title: "Runner bediening",
    category: "Horeca",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Breng gerechten en dranken snel en netjes naar tafels of zones.",
    description:
      "Als runner bediening ondersteun je de vloer tijdens drukke diensten. Je houdt focus, tempo en netheid — op restaurants, terrassen en events.",
    tasks: [
      "Gerechten uitlopen",
      "Dranken brengen",
      "Tafels afruimen",
      "Bediening ondersteunen tijdens pieken",
    ],
    profile: [
      "Snel en praktisch",
      "Fysiek fit",
      "Teamspeler",
      "Oog voor netheid",
    ],
    suitableFor: ["Instappers in horeca", "Mensen die graag in beweging werken"],
    tags: ["runner", "bediening", "horeca", "restaurant"],
  }),
  v({
    id: "barback",
    slug: "barback",
    title: "Barback",
    category: "Bar",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Houd de bar draaiende: voorraad, glaswerk, ijs en schoonmaak.",
    description:
      "Barback vacature voor festivals, bars en restaurants. Je ondersteunt bartenders zodat de bar snel en netjes blijft draaien.",
    tasks: [
      "Bar aanvullen",
      "Glaswerk verzamelen en spoelen",
      "IJs en garnituren bijhouden",
      "Bar schoon en werkbaar houden",
    ],
    profile: [
      "Snel schakelen",
      "Praktisch en oplettend",
      "Geen moeite met fysiek werk",
      "Teamspeler",
    ],
    suitableFor: ["Wie keuken/horeca energie geeft", "Instappers bar"],
    tags: ["barback", "bar", "horeca", "festivals"],
    featured: true,
  }),
  v({
    id: "bartender",
    slug: "bartender",
    title: "Bartender",
    category: "Bar",
    level: "Ervaring handig",
    employmentType: "Oproepbasis / flexibel / projectbasis",
    shortDescription:
      "Werk achter de bar bij restaurants, events en festivals.",
    description:
      "Bartender vacature voor wie snel, netjes en gastgericht achter de bar kan werken. Ervaring is een plus; houding en tempo zijn doorslaggevend.",
    tasks: [
      "Dranken bereiden en uitgeven",
      "Barvoorraad bewaken",
      "Gasten helpen aan de bar",
      "Samenwerken met barbacks",
    ],
    profile: [
      "Horeca-ervaring gewenst",
      "Gastgericht",
      "Stressbestendig",
      "Representatief",
    ],
    niceToHave: ["Cocktailkennis", "Ervaring op festivals"],
    suitableFor: ["Ervaren barcrew", "Horecamedewerkers die flexibel willen bijspringen"],
    tags: ["bartender", "bar", "horeca", "events"],
  }),
  v({
    id: "hospitality-medewerker",
    slug: "hospitality-medewerker",
    title: "Hospitality medewerker",
    category: "Hospitality",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ontvang gasten, ondersteun publieksstromen en zorg voor een nette en gastvrije ervaring.",
    description:
      "Als hospitality medewerker zorg je dat gasten zich welkom voelen: ontvangst, begeleiding en service in hospitality-zones.",
    tasks: [
      "Gasten ontvangen en begeleiden",
      "Hospitality-ruimtes netjes houden",
      "Drankjes of snacks uitserveren indien gevraagd",
      "Samenwerken met floor en host",
    ],
    profile: [
      "Gastvrij en representatief",
      "Rustig en vriendelijk",
      "Goede uitstraling",
      "Communicatief",
    ],
    suitableFor: ["Wie gasten helpen leuk vindt", "Instappers hospitality"],
    tags: ["hospitality", "gasten", "events", "ontvangst"],
    featured: true,
  }),
  v({
    id: "vip-support",
    slug: "vip-support",
    title: "VIP support",
    category: "Hospitality",
    level: "Ervaring handig",
    employmentType: "Oproepbasis / flexibel / projectbasis",
    shortDescription:
      "Ondersteun VIP-ruimtes, ontvangst, routing en gastbeleving tijdens events en producties.",
    description:
      "VIP support zorgt voor een soepele ervaring rond VIP-zones: ontvangst, routing, netheid en discrete service zodat gasten en organisatoren rust houden.",
    tasks: [
      "VIP-gasten ontvangen en begeleiden",
      "VIP-ruimtes netjes en klaar houden",
      "Routing en toegang ondersteunen",
      "Samenwerken met hospitality en floor",
    ],
    profile: [
      "Representatief en discreet",
      "Gastgericht",
      "Stressbestendig",
      "Ervaring met gasten of hospitality is een plus",
    ],
    suitableFor: [
      "Wie VIP- of hospitalitywerk leuk vindt",
      "Crew met service-ervaring",
    ],
    tags: ["vip", "hospitality", "events", "ontvangst"],
  }),

  // ——— Restaurant ———
  v({
    id: "bedieningsmedewerker-restaurant",
    slug: "bedieningsmedewerker-restaurant",
    title: "Bedieningsmedewerker restaurant",
    category: "Restaurant",
    level: "Ervaring handig",
    employmentType: "Oproepbasis / flexibel / projectbasis",
    shortDescription:
      "Bediening in restaurants, diners en horecalocaties met tempo en gastvrijheid.",
    description:
      "Werk in de bediening waar gastvrijheid en tempo samenkomen. Geschikt als horeca vacature voor restaurants en eventdiners.",
    tasks: [
      "Gasten ontvangen en bedienen",
      "Bestellingen opnemen",
      "Dranken en gerechten uitserveren",
      "Tafels indekken en afruimen",
    ],
    profile: [
      "Gastvrij en representatief",
      "Communicatief sterk",
      "Stressbestendig",
      "Netjes en professioneel",
    ],
    suitableFor: ["Horecamedewerkers", "Wie restaurantvloer leuk vindt"],
    tags: ["bediening", "restaurant", "horeca"],
  }),
  v({
    id: "host-gastheer-gastvrouw",
    slug: "host-gastheer-gastvrouw",
    title: "Host / Gastheer / Gastvrouw",
    category: "Restaurant",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ontvang gasten professioneel en zorg voor een sterke eerste indruk.",
    description:
      "Als host ben je het gezicht bij binnenkomst: reserveringen, doorverwijzen en een rustige ontvangst.",
    tasks: [
      "Gasten ontvangen",
      "Reserveringen begeleiden",
      "Doorverwijzen naar tafels of zones",
      "Wachtrijen stroomlijnen",
    ],
    profile: [
      "Representatief",
      "Gastvrij",
      "Communicatief sterk",
      "Rustig en vriendelijk",
    ],
    suitableFor: ["Wie gasten helpen leuk vindt", "Representatieve instappers"],
    tags: ["host", "restaurant", "hospitality", "ontvangst"],
  }),
  v({
    id: "runner-bediening-restaurant",
    slug: "runner-bediening-restaurant",
    title: "Runner bediening restaurant",
    category: "Restaurant",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ondersteun restaurantbediening met uitlopen, afruimen en aanvullen.",
    description:
      "Runner rol specifiek op restaurantvloer: snel, netjes en in sync met bediening en keuken.",
    tasks: [
      "Gerechten uitlopen",
      "Afruimen",
      "Voorraad op de vloer aanvullen",
      "Bediening ontlasten tijdens pieken",
    ],
    profile: ["Snel", "Praktisch", "Teamgericht", "Netjes"],
    suitableFor: ["Instappers restaurant", "Horeca support"],
    tags: ["runner", "restaurant", "bediening"],
  }),
  v({
    id: "floor-support-restaurant",
    slug: "floor-support-restaurant",
    title: "Floor support restaurant",
    category: "Restaurant",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Houd overzicht en flow op de restaurantvloer tijdens drukke momenten.",
    description:
      "Floor support in restaurants: je helpt waar de vloer het nodig heeft — van afruimen tot gasten begeleiden.",
    tasks: [
      "Vloer ondersteunen",
      "Gasten helpen waar nodig",
      "Netheid bewaken",
      "Schakelen tussen taken",
    ],
    profile: ["Alert", "Gastgericht", "Flexibel", "Betrouwbaar"],
    suitableFor: ["Instappers", "Horecamedewerkers"],
    tags: ["floor support", "restaurant", "horeca"],
  }),

  // ——— Keuken ———
  v({
    id: "afwasser-spoelkeuken",
    slug: "afwasser-spoelkeuken",
    title: "Afwasser / Spoelkeuken medewerker",
    category: "Keuken",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Houd vaat en spoelkeuken draaiende zodat de keuken kan blijven produceren.",
    description:
      "Keukenhulp vacature op instapniveau: spoelkeuken, vaat en netheid. Fysiek werk met direct resultaat.",
    tasks: [
      "Afwassen en spoelen",
      "Keukengerei schoonhouden",
      "Schone spullen terugplaatsen",
      "Spoelkeuken netjes houden",
    ],
    profile: ["Aanpakker", "Netjes", "Fysiek fit", "Tempo kunnen maken"],
    suitableFor: ["Instappers keuken", "Wie fysiek wil aanpakken"],
    tags: ["afwas", "spoelkeuken", "keuken", "instap"],
  }),
  v({
    id: "keukenhulp-hulp-kok",
    slug: "keukenhulp-hulp-kok",
    title: "Keukenhulp / Hulp kok",
    category: "Keuken",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel / projectbasis",
    shortDescription:
      "Ondersteun de keuken met mise-en-place, voorbereiding en schoonmaak.",
    description:
      "Keukenhulp vacature voor restaurants, catering en events. Je leert de keuken kennen en ondersteunt koks tijdens service.",
    tasks: [
      "Mise-en-place voorbereiden",
      "Snijden en portioneren",
      "Keuken schoon houden",
      "Koks ondersteunen tijdens service",
    ],
    profile: [
      "Praktisch ingesteld",
      "Hygiënisch werken",
      "Stressbestendig",
      "Leergierig",
    ],
    suitableFor: ["Wie keuken/horeca energie geeft", "Instappers keuken"],
    tags: ["keukenhulp", "keuken", "horeca", "mise-en-place"],
    featured: true,
  }),
  v({
    id: "zelfstandig-werkend-kok",
    slug: "zelfstandig-werkend-kok",
    title: "Zelfstandig werkend kok",
    category: "Keuken",
    level: "Ervaren",
    employmentType: "Projectbasis / flexibel / op aanvraag",
    shortDescription:
      "Draai zelfstandig mee in voorbereiding en service op locatie.",
    description:
      "Voor koks met aantoonbare ervaring die flexibel willen bijspringen in restaurants, events of catering.",
    tasks: [
      "Mise-en-place draaien",
      "Gerechten bereiden",
      "Service meedraaien",
      "Kwaliteit en presentatie bewaken",
    ],
    profile: [
      "Aantoonbare keukenervaring",
      "Zelfstandig kunnen werken",
      "HACCP-basiskennis",
      "Professionele werkhouding",
    ],
    suitableFor: ["Ervaren koks", "Flexibele keukeninvulling"],
    tags: ["kok", "keuken", "ervaren"],
  }),
  v({
    id: "chef-de-partie",
    slug: "chef-de-partie",
    title: "Chef de partie",
    category: "Keuken",
    level: "Ervaren",
    employmentType: "Projectbasis / op aanvraag",
    shortDescription:
      "Verantwoordelijkheid op een eigen partie tijdens voorbereiding en service.",
    description:
      "Pak een partie en werk samen met chef en brigade. Voor wie overzicht en kwaliteit wil bewaken in de keuken.",
    tasks: [
      "Eigen partie voorbereiden",
      "Gerechten bereiden en doorgeven",
      "Mise-en-place bewaken",
      "Kwaliteit controleren",
    ],
    profile: [
      "Ervaring als kok of chef de partie",
      "Georganiseerd",
      "Kwaliteitsgericht",
      "Rustig onder druk",
    ],
    suitableFor: ["Ervaren keukencrew", "Wie verantwoordelijkheid zoekt"],
    tags: ["chef de partie", "keuken", "ervaren"],
  }),

  // ——— Stagebouw ———
  v({
    id: "stagehand-load-in-out",
    slug: "stagehand-load-in-out",
    title: "Stagehand / Load-in & Load-out",
    category: "Stagebouw",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Laden, lossen, opbouw en afbouw op producties met strakke timing.",
    description:
      "Stagehand vacature voor wie fysiek wil aanpakken op concerten, festivals en productielocaties. Veiligheid en tempo staan centraal — werken op festivals en in stagebouw.",
    tasks: [
      "Laden en lossen",
      "Opbouw en afbouw",
      "Materiaalhandling",
      "Ondersteuning van productiecrew",
    ],
    profile: [
      "Fysiek sterk",
      "Praktisch ingesteld",
      "Veilig werken",
      "Geen 9-tot-5 mentaliteit",
    ],
    suitableFor: [
      "Wie fysiek wil aanpakken",
      "Mensen die stagehand willen worden",
    ],
    tags: ["stagehand", "load-in", "festivals", "fysiek"],
    featured: true,
  }),
  v({
    id: "sitecrew",
    slug: "sitecrew",
    title: "Sitecrew",
    category: "Stagebouw",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Praktische ondersteuning op het terrein tijdens opbouw en show.",
    description:
      "Sitecrew helpt op het eventterrein: materiaal, routing en praktische taken zodat productie kan doorpakken.",
    tasks: [
      "Terrein- en sitetaken",
      "Materiaal verplaatsen",
      "Teams ondersteunen",
      "Netheid en veiligheid meenemen",
    ],
    profile: ["Aanpakker", "Flexibel", "Veiligheidsbewust", "Teamspeler"],
    suitableFor: ["Fysieke instappers", "Eventcrew die breed wil meedraaien"],
    tags: ["sitecrew", "stagebouw", "events"],
  }),
  v({
    id: "materiaalcrew",
    slug: "materiaalcrew",
    title: "Materiaalcrew",
    category: "Stagebouw",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Beheer en verplaats flightcases, truss en overig productiemateriaal.",
    description:
      "Materiaalcrew houdt overzicht op cases en materiaalstromen tijdens load-in, show en load-out.",
    tasks: [
      "Materiaal verplaatsen en stapelen",
      "Flightcases begeleiden",
      "Opslagzones netjes houden",
      "Samenwerken met stagehands",
    ],
    profile: ["Fysiek fit", "Ordelijk", "Oplettend", "Betrouwbaar"],
    suitableFor: ["Wie fysiek wil aanpakken", "Logistiek-minded crew"],
    tags: ["materiaal", "stagebouw", "flightcases"],
  }),

  // ——— Productie ———
  v({
    id: "productie-assistent",
    slug: "productie-assistent",
    title: "Productie assistent",
    category: "Productie",
    level: "Ervaring handig",
    employmentType: "Oproepbasis / projectbasis",
    shortDescription:
      "Ondersteun productieleiders met backstage taken en praktische uitvoering.",
    description:
      "Productie assistent vacature voor wie achter de schermen wilt meedraaien: runnerswerk, coördinatie en uitvoering op locatie.",
    tasks: [
      "Ondersteuning productieleider",
      "Backstage support",
      "Runnerswerk",
      "Praktische uitvoering",
    ],
    profile: [
      "Zelfstandig",
      "Oplossingsgericht",
      "Communicatief",
      "Flexibel inzetbaar",
    ],
    suitableFor: [
      "Wie achter de schermen wilt werken",
      "Organisatie-minded crew",
    ],
    tags: ["productie assistent", "backstage", "events"],
    featured: true,
  }),
  v({
    id: "backstage-support",
    slug: "backstage-support",
    title: "Backstage support",
    category: "Productie",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Houd backstage zones draaiende: materiaal, toegang en praktische hulp.",
    description:
      "Backstage support zorgt dat artiesten, crew en productie soepel kunnen werken achter de schermen.",
    tasks: [
      "Backstage zones ondersteunen",
      "Praktische taken oppakken",
      "Materiaal rondbrengen",
      "Contact houden met productie",
    ],
    profile: ["Discreet", "Alert", "Behulpzaam", "Betrouwbaar"],
    suitableFor: ["Wie achter de schermen wilt werken", "Instappers productie"],
    tags: ["backstage", "productie", "support"],
  }),
  v({
    id: "productie-runner",
    slug: "productie-runner",
    title: "Productie runner",
    category: "Productie",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Snel schakelen voor productie: berichten, materiaal en ondersteuning.",
    description:
      "Als productie runner ben je de snelle schakel voor het productieteam op locatie.",
    tasks: [
      "Opdrachten van productie uitvoeren",
      "Materiaal en berichten brengen",
      "Teams verbinden",
      "Tempo hoog houden",
    ],
    profile: ["Snel", "Communicatief", "Flexibel", "Stressbestendig"],
    suitableFor: ["Wie achter de schermen wilt werken", "Actieve instappers"],
    tags: ["runner", "productie", "events"],
  }),
  v({
    id: "floor-support-productie",
    slug: "floor-support-productie",
    title: "Floor support productie",
    category: "Productie",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Ondersteun de productievloer tijdens opbouw, show en afbouw.",
    description:
      "Floor support productie combineert praktische hulp met overzicht op de vloer — ideaal om productie van dichtbij te leren kennen.",
    tasks: [
      "Vloer ondersteunen",
      "Kleine productietaken",
      "Samenwerken met stage en eventcrew",
      "Briefing volgen",
    ],
    profile: ["Praktisch", "Teamgericht", "Alert", "Op tijd"],
    suitableFor: ["Instappers productie", "Breed inzetbare crew"],
    tags: ["floor support", "productie", "events"],
  }),

  // ——— Logistiek ———
  v({
    id: "logistiek-medewerker-events",
    slug: "logistiek-medewerker-events",
    title: "Logistiek medewerker events",
    category: "Logistiek",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Help met materiaal, voorraad, laad- en losmomenten en praktische ondersteuning op eventlocaties.",
    description:
      "Logistiek medewerker events houdt overzicht op materiaalstromen en praktische logistiek tijdens producties.",
    tasks: [
      "Materiaalstromen ondersteunen",
      "Zones en routes helpen bewaken",
      "Laden/lossen assisteren",
      "Samenwerken met productie",
    ],
    profile: ["Ordelijk", "Fysiek fit", "Oplettend", "Teamspeler"],
    suitableFor: ["Wie fysiek wil aanpakken", "Logistiek-minded mensen"],
    tags: ["logistiek", "events", "materiaal"],
  }),
  v({
    id: "materiaal-runner",
    slug: "materiaal-runner",
    title: "Materiaal runner",
    category: "Logistiek",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Zorg dat materialen op de juiste plek komen en ondersteun crew en productie op locatie.",
    description:
      "Materiaal runner is een actieve rol: je verplaatst wat nodig is zodat teams door kunnen.",
    tasks: [
      "Materiaal rondbrengen",
      "Cases en kratten verplaatsen",
      "Opslagzones aanvullen",
      "Instructies van captain volgen",
    ],
    profile: ["Snel", "Fysiek sterk", "Betrouwbaar", "Veilig werken"],
    suitableFor: ["Wie fysiek wil aanpakken", "Actieve instappers"],
    tags: ["runner", "logistiek", "materiaal"],
  }),
  v({
    id: "laad-en-loscrew",
    slug: "laad-en-loscrew",
    title: "Laad- en loscrew",
    category: "Logistiek",
    level: "Instap",
    employmentType: "Oproepbasis / flexibel",
    shortDescription:
      "Laden en lossen van trucks en trailers op eventlocaties.",
    description:
      "Laad- en loscrew werkt hard en veilig bij load-in en load-out. Fysiek, direct en teamgericht.",
    tasks: [
      "Trucks laden en lossen",
      "Materiaal stapelen",
      "Veilig tillen en tillen in team",
      "Tempo maken met de ploeg",
    ],
    profile: [
      "Fysiek sterk",
      "Veiligheidsbewust",
      "Aanpakker",
      "Geen 9-tot-5 mentaliteit",
    ],
    suitableFor: ["Wie fysiek wil aanpakken", "Stagebouw/logistiek"],
    tags: ["laden", "lossen", "logistiek", "fysiek"],
    featured: true,
  }),

  // ——— Leidinggevend ———
  v({
    id: "teamcaptain",
    slug: "teamcaptain",
    title: "Teamcaptain",
    category: "Leidinggevend",
    level: "Leidinggevend",
    employmentType: "Op aanvraag / voor ervaren crew",
    shortDescription:
      "Leid crew op locatie en wees aanspreekpunt tussen team en opdrachtgever.",
    description:
      "Als teamcaptain bewaak je briefing, kwaliteit en communicatie. Voor ervaren crew die wil organiseren en overzicht houden.",
    tasks: [
      "Crew aansturen",
      "Briefing bewaken",
      "Aanspreekpunt op locatie",
      "Terugkoppeling na afloop",
    ],
    profile: [
      "Ervaring op events",
      "Leiding kunnen geven",
      "Rustig onder druk",
      "Duidelijk communiceren",
    ],
    suitableFor: [
      "Wie organiseert en overzicht houdt",
      "Ervaren crew die wil doorgroeien",
    ],
    tags: ["teamcaptain", "leiding", "events"],
    featured: true,
  }),
  v({
    id: "shiftleader-horeca",
    slug: "shiftleader-horeca",
    title: "Shiftleader / Floor manager horeca",
    category: "Leidinggevend",
    level: "Leidinggevend",
    employmentType: "Projectbasis / op aanvraag",
    shortDescription:
      "Stuur bediening, runners en floor aan tijdens drukke horecadiensten.",
    description:
      "Shiftleader horeca houdt overzicht op de vloer, brief het team en lost problemen snel op.",
    tasks: [
      "Team aansturen",
      "Briefing geven",
      "Overzicht houden op de vloer",
      "Contact met opdrachtgever/manager",
    ],
    profile: [
      "Horeca-ervaring",
      "Leidinggevende houding",
      "Communicatief sterk",
      "Gastgericht",
    ],
    suitableFor: ["Ervaren horeca", "Wie organiseert en overzicht houdt"],
    tags: ["shiftleader", "horeca", "leiding"],
  }),
  v({
    id: "sous-chef",
    slug: "sous-chef",
    title: "Sous-chef",
    category: "Leidinggevend",
    level: "Leidinggevend",
    employmentType: "Projectbasis / op aanvraag",
    shortDescription:
      "Ondersteun de chef en stuur de keuken mee aan tijdens service.",
    description:
      "Sous-chef rol voor wie keukenervaring combineert met aansturing en overzicht.",
    tasks: [
      "Keukenteam ondersteunen en aansturen",
      "Mise-en-place controleren",
      "Service bewaken",
      "Kwaliteit en tempo bewaken",
    ],
    profile: [
      "Ruime keukenervaring",
      "Leiding kunnen geven",
      "HACCP-kennis",
      "Professionele communicatie",
    ],
    suitableFor: ["Ervaren keukenleiders", "Wie organiseert in de keuken"],
    tags: ["sous-chef", "keuken", "leiding"],
  }),
  v({
    id: "chef-kok",
    slug: "chef-kok",
    title: "Chef-kok",
    category: "Leidinggevend",
    level: "Leidinggevend",
    employmentType: "Projectbasis / op aanvraag",
    shortDescription:
      "Neem leiding in de keuken bij restaurants, events of tijdelijke producties.",
    description:
      "Chef-kok voor projecten waar structuur, kwaliteit en teamsturing nodig zijn.",
    tasks: [
      "Keuken aansturen",
      "Service organiseren",
      "Kwaliteit bewaken",
      "Team instrueren",
    ],
    profile: [
      "Ervaring als chef of leidinggevende kok",
      "Sterke communicatie",
      "Discipline en overzicht",
      "Kwaliteitsgericht",
    ],
    suitableFor: ["Chefs", "Leidinggevende keukenrollen"],
    tags: ["chef-kok", "keuken", "leiding"],
  }),
];

export const restaurantVacancyGroups = [
  {
    title: "Bediening & floor",
    roles: [
      "Bedieningsmedewerker restaurant",
      "Runner bediening restaurant",
      "Host / Gastheer / Gastvrouw",
      "Floor support restaurant",
    ],
  },
  {
    title: "Bar & hospitality",
    roles: ["Barback", "Bartender", "Horeca support", "Hospitality medewerker", "VIP support"],
  },
  {
    title: "Keuken & leidinggevend",
    roles: [
      "Afwasser / Spoelkeuken medewerker",
      "Keukenhulp / Hulp kok",
      "Zelfstandig werkend kok",
      "Chef de partie",
      "Sous-chef",
      "Chef-kok",
      "Shiftleader / Floor manager horeca",
    ],
  },
] as const;

export function getVacancyById(id: string): Vacancy | undefined {
  return vacancies.find((vacancy) => vacancy.id === id);
}

export function getVacancyBySlug(slug: string): Vacancy | undefined {
  return vacancies.find((vacancy) => vacancy.slug === slug);
}

export function vacancyApplyMailto(vacancy: Vacancy): string {
  const subject = encodeURIComponent(
    `Sollicitatie ${vacancy.title} Helping Hands`,
  );
  const body = encodeURIComponent(
    [
      "Hallo Helping Hands,",
      "",
      `Ik wil solliciteren op de functie ${vacancy.title}.`,
      "",
      "Naam:",
      "Telefoon:",
      "Woonplaats:",
      "Ervaring:",
      "Beschikbaarheid:",
      "Vervoer:",
      "Opmerking:",
      "",
      "Groet,",
    ].join("\n"),
  );
  return `mailto:${vacancy.applicationEmail}?subject=${subject}&body=${body}`;
}

export function vacancyQuestionMailto(vacancy: Vacancy): string {
  const subject = encodeURIComponent(
    `Vraag over ${vacancy.title} - Helping Hands`,
  );
  const body = encodeURIComponent(
    [
      "Hallo Helping Hands,",
      "",
      `Ik heb een vraag over de functie ${vacancy.title}.`,
      "",
      "Naam:",
      "Telefoon:",
      "Mijn vraag:",
      "",
      "Groet,",
    ].join("\n"),
  );
  return `mailto:${vacancy.applicationEmail}?subject=${subject}&body=${body}`;
}

/** Open aanmelding zonder specifieke functie (mailto fallback). */
export const openApplyMailto = `mailto:${applicationsEmail}?subject=${encodeURIComponent(
  "Aanmelding medewerker Helping Hands",
)}&body=${encodeURIComponent(
  [
    "Hallo Helping Hands,",
    "",
    "Ik wil me aanmelden als crewlid.",
    "",
    "Naam:",
    "Telefoon:",
    "Woonplaats:",
    "Ervaring:",
    "Beschikbaarheid:",
    "Vervoer:",
    "Opmerking:",
    "",
    "Groet,",
  ].join("\n"),
)}`;

/** Primary CTA: contact form crew tab (works without a mail client). */
export { crewApplyHref as openApplyHref } from "@/lib/contact";

/** @deprecated Use vacancyApplyMailto */
export function vacancyMailto(title: string, email = applicationsEmail) {
  const subject = encodeURIComponent(
    `Sollicitatie ${title} - Helping Hands Agency`,
  );
  return `mailto:${email}?subject=${subject}`;
}
