/**
 * One-shot generator for SEO landing data files.
 * Run: node scripts/generate-seo-data.mjs
 */
import fs from "fs";
import path from "path";

const root = path.resolve("src/lib/seo");
fs.mkdirSync(root, { recursive: true });

const DEFAULT_PROCESS = [
  {
    title: "Aanvraag",
    description:
      "Deel datum, locatie, tijden, functies en aantallen via het contactformulier of planning@helpinghandsagency.nl.",
  },
  {
    title: "Planning check",
    description:
      "Wij checken beschikbaarheid en stemmen de bezetting af op jouw productie.",
  },
  {
    title: "Briefing",
    description:
      "Taken, kleding/PBM, verzamelpunt en aanspreekpunt worden helder gecommuniceerd.",
  },
  {
    title: "Inzet",
    description:
      "Crew staat op tijd klaar op locatie met duidelijke instructies.",
  },
  {
    title: "Uren en afronding",
    description:
      "Urenregistratie en terugkoppeling na afloop — kort en overzichtelijk.",
  },
];

const WHY_US = [
  "Snelle schakeling bij wijzigingen of spoedaanvragen",
  "Duidelijke briefing en één aanspreekpunt bij planning",
  "Gemotiveerde crew met praktijkervaring op events en horeca",
  "Ervaring met festivals, producties, horeca en logistiek",
  "Jongeren ontwikkelen via echte werkervaring op locatie",
  "Korte lijnen: gevestigd in Hilversum, actief door heel Nederland",
];

function faqBlock(topic, extras = []) {
  const base = [
    {
      question: `Hoe vraag ik ${topic} aan?`,
      answer:
        "Via /contact of planning@helpinghandsagency.nl. Vermeld datum, locatie, tijden, functies en aantal mensen. Bij spoed: bel of app 06 5741 6338.",
    },
    {
      question: "Werken jullie landelijk?",
      answer:
        "Ja. Helping Hands Agency is gevestigd in Hilversum (Wandelpad 30) en levert personeel door heel Nederland.",
    },
    {
      question: "Kunnen jullie ook op korte termijn leveren?",
      answer:
        "Vaak wel, afhankelijk van beschikbaarheid. Deel zo vroeg mogelijk je planning; bij spoed kijken we wat nog haalbaar is.",
    },
    {
      question: "Hoe werkt de briefing?",
      answer:
        "Vooraf stemmen we taken, kleding/PBM, verzamelpunt en aanspreekpunt af. Zo weet iedereen wat er van hen verwacht wordt.",
    },
    {
      question: "Voor wie is Helping Hands bedoeld?",
      answer:
        "Voor opdrachtgevers die betrouwbare event-, horeca- of productiemeewerkers nodig hebben — en voor crew die wil werken op echte producties.",
    },
  ];
  return [...base, ...extras].slice(0, 6);
}

const services = [
  {
    slug: "event-crew",
    title: "Event crew inhuren",
    metaTitle: "Event crew inhuren | Helping Hands Agency",
    metaDescription:
      "Event crew inhuren voor festivals, concerten en beurzen. Floor support, runners en crowd support met duidelijke briefing. Vraag direct aan.",
    h1: "Event crew inhuren voor festivals, events en producties",
    intro:
      "Helping Hands Agency levert event crew voor producties waar timing en doorstroom tellen. Denk aan festivals, concerten, beurzen, corporate events en stadionproducties. Je deelt datum, locatie, tijden en functies — wij bezetten met praktische mensen die snappen wat er op de vloer speelt. Wij zijn gevestigd in Hilversum en actief door heel Nederland. Of je nu floor support, runners of check-in nodig hebt: je hebt één aanspreekpunt bij planning. Vraag personeel aan via contact — wij denken mee over bezetting en briefing.",
    targetKeywords: [
      "event crew inhuren",
      "crew evenementen",
      "event personeel Nederland",
    ],
    services: [
      "Floor support en publieksstromen",
      "Runners tussen zones en backstage",
      "Check-in en ontvangst",
      "Crowd support tijdens piekmomenten",
      "Algemene eventondersteuning op locatie",
    ],
    roles: [
      { title: "Eventmedewerker", description: "Algemene support op de vloer." },
      { title: "Floor support", description: "Zones bewaken en doorstroom begeleiden." },
      { title: "Runner", description: "Snelle boodschappen en materiaalstromen." },
      { title: "Check-in", description: "Ontvangst, badges en first contact." },
    ],
  },
  {
    slug: "festival-crew",
    title: "Festival crew inhuren",
    metaTitle: "Festival crew inhuren | Helping Hands Agency",
    metaDescription:
      "Festival crew inhuren voor opbouw, horeca support en floor. Betrouwbare ploegen met duidelijke briefing. Vraag festivalpersoneel aan.",
    h1: "Festival crew inhuren voor outdoor events en meerdaagse producties",
    intro:
      "Festivals vragen om crew die tegen tempo, wisselende weersomstandigheden en lange dagen kan. Helping Hands Agency levert festival crew voor opbouw, floor support, horeca-ondersteuning en logistiek op het terrein. Wij matchen mensen op beschikbaarheid en functie, met een heldere briefing over taken en verzamelpunten. Gevestigd in Hilversum, inzetbaar in de Randstad en landelijk. Deel je productieplanning — wij denken mee over ploegen, shifts en aanspreekpunten. Personeel aanvragen kan via contact of planning@helpinghandsagency.nl.",
    targetKeywords: [
      "festival crew inhuren",
      "festival personeel",
      "crew outdoor events",
    ],
    services: [
      "Opbouw- en afbouwondersteuning",
      "Floor en crowd support op het terrein",
      "Horeca runners en barbacks",
      "Logistiek en materiaalstromen",
      "Meerdaagse ploegen met wisselende shifts",
    ],
    roles: [
      { title: "Festivalmedewerker", description: "Breed inzetbaar op het terrein." },
      { title: "Site support", description: "Zones, routing en algemene ondersteuning." },
      { title: "Horeca support", description: "Uitserveren, afruimen en bijvullen." },
      { title: "Logistiek", description: "Materiaal en bevoorrading verplaatsen." },
    ],
  },
  {
    slug: "stagehands",
    title: "Stagehands inhuren",
    metaTitle: "Stagehands inhuren | Helping Hands Agency",
    metaDescription:
      "Stagehands inhuren voor load-in, opbouw en afbouw. Materiaalhandling en sitecrew voor concerten, festivals en producties.",
    h1: "Stagehands inhuren voor festivals, events en producties",
    intro:
      "Helping Hands Agency levert stagehands voor producties met strakke call-times. Van load-in tot afbouw: mensen die cases, risers en decor veilig en snel verplaatsen. Geschikt voor concerten, festivals, podiumproducties en locaties waar materiaal constant in beweging is. Wij briefen vooraf over taken, PBM en veiligheidsregels, zodat iedereen weet wat er speelt. Actief vanuit Hilversum door heel Nederland. Vraag stagehands aan via contact — wij checken beschikbaarheid en bezetten praktisch.",
    targetKeywords: [
      "stagehands inhuren",
      "stagebouw personeel",
      "load-in crew",
    ],
    services: [
      "Load-in en load-out",
      "Materiaalhandling en cases rijden",
      "Opbouw- en afbouwondersteuning",
      "Sitecrew rondom podium en backstage",
      "Ondersteuning bij ombouw tussen shows",
    ],
    roles: [
      { title: "Stagehand", description: "Laden, lossen en materiaalhandling." },
      { title: "Sitecrew", description: "Algemene support rondom de productie." },
      { title: "Opbouwmedewerker", description: "Helpen bij podium- en décorbouw." },
      { title: "Afbouwcrew", description: "Snel en veilig afbreken na afloop." },
    ],
  },
  {
    slug: "site-crew",
    title: "Site crew inhuren",
    metaTitle: "Site crew inhuren | Helping Hands Agency",
    metaDescription:
      "Site crew inhuren voor evenemententerreinen: routing, zones, materiaal en algemene productiesupport. Vraag site crew aan.",
    h1: "Site crew inhuren voor evenemententerreinen en producties",
    intro:
      "Site crew houdt een evenemententerrein draaiende: zones, routing, materiaalstromen en praktische ondersteuning van het productieteam. Helping Hands Agency levert site crew die snapt dat kleine taken groot verschil maken in tempo en veiligheid. Ideaal voor festivals, outdoor events en meerdaagse producties. Wij werken met duidelijke briefings en korte lijnen vanuit Hilversum. Deel je terreinplan en functies — wij bezetten mee. Personeel aanvragen via contact of bel 06 5741 6338 bij spoed.",
    targetKeywords: ["site crew inhuren", "sitecrew evenementen", "terreincrew"],
    services: [
      "Terrein- en zoneondersteuning",
      "Routing en publieksstromen",
      "Materiaal verplaatsen op site",
      "Ondersteuning productieteam",
      "Algemene hands-on eventsupport",
    ],
    roles: [
      { title: "Site crew", description: "Praktische support op het terrein." },
      { title: "Zone support", description: "Toezicht en hulp per gebied." },
      { title: "Runner site", description: "Snel schakelen tussen locaties." },
      { title: "Productiesupport", description: "Taken oppakken waar nodig." },
    ],
  },
  {
    slug: "productie-assistenten",
    title: "Productie-assistenten inhuren",
    metaTitle: "Productie-assistenten inhuren | Helping Hands",
    metaDescription:
      "Productie-assistenten inhuren voor planningshulp, runners en floor support. Ontlast je productieteam met betrouwbare crew.",
    h1: "Productie-assistenten inhuren voor events en producties",
    intro:
      "Productie-assistenten ontlasten je team bij drukke callsheets, ombouwen en parallelle taken. Helping Hands Agency levert productieondersteuning die instructies oppakt, meedenkt en op de vloer blijft. Geschikt voor events, beurzen, corporate producties en podiumshows. Wij briefen taken en escalatielijnen vooraf, zodat niemand gokt wat er moet gebeuren. Gevestigd in Hilversum, inzetbaar landelijk. Vraag productie-assistenten aan via contact — wij matchen op beschikbaarheid en ervaring.",
    targetKeywords: [
      "productie assistenten inhuren",
      "productie crew",
      "productieondersteuning",
    ],
    services: [
      "Ondersteuning productieleiding",
      "Runners voor productie",
      "Checklists en praktische uitvoering",
      "Floor support tijdens showtijd",
      "Hulp bij ombouw en planningshiaten",
    ],
    roles: [
      {
        title: "Productie-assistent",
        description: "Hands-on hulp voor het productieteam.",
      },
      { title: "Productierunner", description: "Snel schakelen tussen taken." },
      { title: "Floor PA", description: "Support op de vloer tijdens show." },
      { title: "Backstage support", description: "Helpen achter de schermen." },
    ],
  },
  {
    slug: "logistiek-personeel",
    title: "Logistiek personeel inhuren",
    metaTitle: "Logistiek personeel inhuren | Helping Hands",
    metaDescription:
      "Logistiek personeel inhuren voor laden, lossen en materiaalstromen op events. Betrouwbare logistieke crew met briefing.",
    h1: "Logistiek personeel inhuren voor events en producties",
    intro:
      "Zonder logistiek staat een productie stil. Helping Hands Agency levert logistiek personeel voor laden, lossen, bevoorrading en materiaalstromen op evenementen en locaties. Onze crew werkt praktisch, veilig en volgens briefing. Geschikt voor festivals, beurzen, stadions en horeca-events met veel beweging achter de schermen. Wij opereren vanuit Hilversum en leveren door heel Nederland. Deel je logistieke planning — wij bezetten de juiste handen. Aanvragen via contact of planning@helpinghandsagency.nl.",
    targetKeywords: [
      "logistiek personeel inhuren",
      "logistiek evenementen",
      "laden lossen crew",
    ],
    services: [
      "Laden en lossen",
      "Materiaalstromen op locatie",
      "Bevoorrading back-of-house",
      "Ondersteuning warehouse/depot",
      "Verplaatsen van cases en decor",
    ],
    roles: [
      { title: "Logistiek medewerker", description: "Materiaal en stromen managen." },
      { title: "Loader", description: "Laden en lossen bij trucks." },
      { title: "Depot support", description: "Ordenen en klaarzetten van goederen." },
      { title: "Materiaalrunner", description: "Spullen op tijd op de juiste plek." },
    ],
  },
  {
    slug: "horeca-personeel",
    title: "Horeca personeel inhuren",
    metaTitle: "Horeca personeel inhuren | Helping Hands Agency",
    metaDescription:
      "Horeca personeel inhuren voor events, banqueting en locaties. Bediening, runners en barsupport met duidelijke briefing.",
    h1: "Horeca personeel inhuren voor events en locaties",
    intro:
      "Voor drukke horecadiensten en eventcatering levert Helping Hands Agency flexibele horeca support: uitserveren, afruimen, bijvullen en barondersteuning. Geschikt voor festivals, banqueting, pop-up bars en horecalocaties die tijdelijk extra handen nodig hebben. Wij briefen over taken, uniform en hygiëneregels, zodat je crew meteen mee kan. Gevestigd in Hilversum, actief landelijk. Vraag horeca personeel aan via contact — wij denken mee over shifts en aantallen.",
    targetKeywords: [
      "horeca personeel inhuren",
      "horeca uitzendbureau",
      "event horeca crew",
    ],
    services: [
      "Bediening en floor support",
      "Runners bediening",
      "Barbacks en barondersteuning",
      "Afruimen en bijvullen",
      "Banqueting en eventcatering",
    ],
    roles: [
      { title: "Horecamedewerker", description: "Breed inzetbaar in service." },
      { title: "Runner bediening", description: "Snel afruimen en bijvullen." },
      { title: "Barback", description: "Bar bevoorraden en ondersteunen." },
      { title: "Floor horeca", description: "Gastflow en service op de vloer." },
    ],
  },
  {
    slug: "barpersoneel",
    title: "Barpersoneel inhuren",
    metaTitle: "Barpersoneel inhuren | Helping Hands Agency",
    metaDescription:
      "Barpersoneel inhuren voor events, festivals en locaties. Bartenders en barbacks met heldere briefing. Vraag barcrew aan.",
    h1: "Barpersoneel inhuren voor events, festivals en locaties",
    intro:
      "Een soepel draaiende bar vraagt om tempo, overzicht en goede barbacks. Helping Hands Agency levert barpersoneel voor events, festivals, pop-ups en vaste locaties. Wij stemmen af of je bartenders, barbacks of een mix nodig hebt, inclusief kleding en werkwijze. Gevestigd in Hilversum en inzetbaar door heel Nederland. Deel je barplan en shifts — wij bezetten mee. Personeel aanvragen via contact of bel 06 5741 6338.",
    targetKeywords: [
      "barpersoneel inhuren",
      "bartender inhuren",
      "barcrew events",
    ],
    services: [
      "Bartenders voor events",
      "Barbacks en glazen spoelen",
      "Bevoorrading en ijs",
      "Pop-up bars en festivalbars",
      "Ondersteuning tijdens piekuren",
    ],
    roles: [
      { title: "Bartender", description: "Dranken bereiden en uitserveren." },
      { title: "Barback", description: "Bar ondersteunen en bevoorraden." },
      { title: "Bar runner", description: "Snel bijvullen tussen stations." },
      { title: "Bar support", description: "Algemene hulp rondom de bar." },
    ],
  },
  {
    slug: "barbacks",
    title: "Barbacks inhuren",
    metaTitle: "Barbacks inhuren | Helping Hands Agency",
    metaDescription:
      "Barbacks inhuren voor events en horeca. Bevoorrading, glazen en tempo achter de bar. Vraag barbacks aan bij Helping Hands.",
    h1: "Barbacks inhuren voor events, bars en festivals",
    intro:
      "Barbacks houden de bar draaiende: ijs, glazen, voorraad en opruimen zodat bartenders kunnen blijven schenken. Helping Hands Agency levert barbacks die hard werken, instructies volgen en rust houden tijdens piek. Ideaal voor festivals, clubnights, banqueting en drukke horecalocaties. Wij briefen taken en kleding vooraf. Gevestigd in Hilversum, actief landelijk. Vraag barbacks aan via contact — wij checken beschikbaarheid snel.",
    targetKeywords: ["barbacks inhuren", "barback events", "bar ondersteuning"],
    services: [
      "Bar bevoorraden",
      "Glazen en ijs regelen",
      "Afruimen achter de bar",
      "Ondersteuning bartenders",
      "Piekuren op festivals en events",
    ],
    roles: [
      { title: "Barback", description: "Primaire support achter de bar." },
      { title: "Bar runner", description: "Snel bijvullen tussen bars." },
      {
        title: "Horeca support bar",
        description: "Breed inzetbaar rondom bars.",
      },
      { title: "Event barhelper", description: "Extra handen tijdens piek." },
    ],
  },
  {
    slug: "runners",
    title: "Runners inhuren",
    metaTitle: "Runners inhuren | Helping Hands Agency",
    metaDescription:
      "Runners inhuren voor events, horeca en productie. Snelle support tussen zones, bar en backstage. Vraag runners aan.",
    h1: "Runners inhuren voor events, horeca en producties",
    intro:
      "Runners zijn de verbinding tussen zones: materiaal, boodschappen, afruimen en productietaken. Helping Hands Agency levert runners die tempo aankunnen en zelfstandig schakelen binnen een duidelijke briefing. Inzetbaar bij festivals, beurzen, horeca-events en podiumproducties. Wij opereren vanuit Hilversum en leveren door heel Nederland. Deel routes en taken — wij bezetten de juiste mensen. Aanvragen via contact of planning@helpinghandsagency.nl.",
    targetKeywords: ["runners inhuren", "event runners", "runners bediening"],
    services: [
      "Event runners tussen zones",
      "Horeca runners (afruimen/bijvullen)",
      "Productierunners",
      "Backstage en FOH verbinding",
      "Materiaal en boodschappen",
    ],
    roles: [
      { title: "Event runner", description: "Algemene snelle support." },
      { title: "Horeca runner", description: "Service en afruimen ondersteunen." },
      { title: "Productierunner", description: "Taken voor productieleiding." },
      { title: "Floor runner", description: "Op de vloer blijven schakelen." },
    ],
  },
  {
    slug: "keukenhulp",
    title: "Keukenhulp inhuren",
    metaTitle: "Keukenhulp inhuren | Helping Hands Agency",
    metaDescription:
      "Keukenhulp inhuren voor restaurants, catering en events. Prep, afwas en keukenondersteuning met heldere briefing.",
    h1: "Keukenhulp inhuren voor restaurants, catering en events",
    intro:
      "Keukenhulp houdt de keuken schoon, aangevuld en in tempo. Helping Hands Agency levert keukenondersteuning voor restaurants, catering en eventkeukens: prep, afwas, opruimen en assistentie van de brigade. Wij briefen hygiëne, kleding en taken vooraf. Gevestigd in Hilversum, inzetbaar landelijk. Vraag keukenhulp aan via contact — wij denken mee over shifts en piekmomenten.",
    targetKeywords: [
      "keukenhulp inhuren",
      "keukenpersoneel inhuren",
      "afwas personeel",
    ],
    services: [
      "Prep-ondersteuning",
      "Afwassen en opruimen",
      "Keuken schoonhouden",
      "Assistentie brigade",
      "Event- en cateringkeukens",
    ],
    roles: [
      { title: "Keukenhulp", description: "Algemene keukenondersteuning." },
      { title: "Afwasser", description: "Spoelkeuken en tempo houden." },
      { title: "Prep-assistent", description: "Voorbereiden van mise-en-place." },
      { title: "Keukenrunner", description: "Aanvullen en weglopen van vuil." },
    ],
  },
  {
    slug: "zelfstandig-kok",
    title: "Zelfstandig kok inhuren",
    metaTitle: "Zelfstandig kok inhuren | Helping Hands Agency",
    metaDescription:
      "Zelfstandig kok inhuren voor restaurants, catering en events. Ervaren keukenprofessionals met duidelijke afstemming.",
    h1: "Zelfstandig kok inhuren voor restaurants, catering en events",
    intro:
      "Soms heb je meer nodig dan keukenhulp: een zelfstandig kok die stations draait en tempo houdt. Helping Hands Agency helpt bij het inzetten van ervaren keukenprofessionals voor restaurants, catering en eventkeukens. Wij stemmen niveau, menucontext en verwachtingen vooraf af — zonder overdreven beloftes. Gevestigd in Hilversum, actief landelijk. Deel je vraag via contact of planning@helpinghandsagency.nl; wij kijken wat haalbaar is op basis van beschikbaarheid.",
    targetKeywords: [
      "zelfstandig kok inhuren",
      "kok inhuren",
      "keukenprofessional inhuren",
    ],
    services: [
      "Zelfstandig werkende koks",
      "Station support in de keuken",
      "Catering- en eventkeukens",
      "Tijdelijke versterking bij piek",
      "Afstemming met je keukenbrigade",
    ],
    roles: [
      { title: "Zelfstandig kok", description: "Draait stations zelfstandig." },
      { title: "Keukenprofessional", description: "Ervaren inzet in de brigade." },
      { title: "Eventkok", description: "Werkt in catering/eventkeukens." },
      { title: "Keukenlead support", description: "Ondersteunt de chef op locatie." },
    ],
  },
  {
    slug: "hospitality-personeel",
    title: "Hospitality personeel inhuren",
    metaTitle: "Hospitality personeel inhuren | Helping Hands",
    metaDescription:
      "Hospitality personeel inhuren voor VIP, ontvangst en begeleiding op events. Representatieve crew met duidelijke briefing.",
    h1: "Hospitality personeel inhuren voor events en locaties",
    intro:
      "Hospitality draait om eerste indruk, begeleiding en rust voor gasten. Helping Hands Agency levert hospitality personeel voor VIP-zones, ontvangst, hostessen/hosts en gastbegeleiding op events en locaties. Wij briefen tone-of-voice, kleding en routes vooraf. Gevestigd in Hilversum, actief door heel Nederland. Vraag hospitality crew aan via contact — wij matchen op uitstraling én praktische inzet.",
    targetKeywords: [
      "hospitality personeel inhuren",
      "hostess inhuren",
      "VIP crew events",
    ],
    services: [
      "Ontvangst en registratie",
      "VIP- en loungebegeleiding",
      "Host / hostess inzet",
      "Gastrouting op locatie",
      "Representatieve floor support",
    ],
    roles: [
      { title: "Hospitality medewerker", description: "Gastgerichte support." },
      { title: "Host / hostess", description: "Ontvangst en begeleiding." },
      { title: "VIP support", description: "Begeleiding in VIP-zones." },
      { title: "Registratie", description: "Check-in en first contact." },
    ],
  },
  {
    slug: "teamcaptains",
    title: "Teamcaptains inhuren",
    metaTitle: "Teamcaptains inhuren | Helping Hands Agency",
    metaDescription:
      "Teamcaptains inhuren voor events en horeca. Leiding op de vloer, briefing doorgeven en ploegen aansturen. Vraag teamcaptains aan.",
    h1: "Teamcaptains inhuren voor events, horeca en producties",
    intro:
      "Teamcaptains zijn je ogen en oren op de vloer: zij sturen ploegen aan, geven briefings door en houden overzicht. Helping Hands Agency levert teamcaptains met praktijkervaring in events, horeca of productie. Zij vormen de brug tussen jouw leiding en de crew. Wij stemmen verantwoordelijkheden en escalatie vooraf af. Gevestigd in Hilversum, inzetbaar landelijk. Vraag teamcaptains aan via contact — wij denken mee over span of control.",
    targetKeywords: [
      "teamcaptains inhuren",
      "ploegleider events",
      "crew lead inhuren",
    ],
    services: [
      "Aansturen van crewploegen",
      "Briefing doorgeven op locatie",
      "Kwaliteit en tempo bewaken",
      "Eerste aanspreekpunt op de vloer",
      "Terugkoppeling naar planning",
    ],
    roles: [
      { title: "Teamcaptain", description: "Leidt een ploeg op locatie." },
      { title: "Floor lead", description: "Overzicht op de eventvloer." },
      { title: "Horeca captain", description: "Stuurt serviceploegen aan." },
      { title: "Site lead", description: "Coördineert terreincrew." },
    ],
  },
].map((s) => ({
  ...s,
  path: `/personeel-inhuren/${s.slug}`,
  whyUs: WHY_US,
  processSteps: DEFAULT_PROCESS,
  faqs: faqBlock(s.title.toLowerCase()),
  ctaPrimary: {
    label: "Personeel aanvragen",
    href: "/contact?type=personeel-aanvragen",
  },
  ctaSecondary: { label: "Alle diensten", href: "/personeel-inhuren" },
  relatedPages: [],
}));

// Wire related pages after we know all slugs
const relatedMap = {
  "event-crew": ["festival-crew", "runners", "site-crew", "hospitality-personeel"],
  "festival-crew": ["event-crew", "stagehands", "horeca-personeel", "logistiek-personeel"],
  stagehands: ["site-crew", "logistiek-personeel", "productie-assistenten", "festival-crew"],
  "site-crew": ["stagehands", "event-crew", "logistiek-personeel", "runners"],
  "productie-assistenten": ["runners", "event-crew", "stagehands", "teamcaptains"],
  "logistiek-personeel": ["stagehands", "site-crew", "runners", "festival-crew"],
  "horeca-personeel": ["barpersoneel", "barbacks", "runners", "keukenhulp"],
  barpersoneel: ["barbacks", "horeca-personeel", "runners", "hospitality-personeel"],
  barbacks: ["barpersoneel", "horeca-personeel", "runners", "keukenhulp"],
  runners: ["event-crew", "horeca-personeel", "productie-assistenten", "barbacks"],
  keukenhulp: ["zelfstandig-kok", "horeca-personeel", "barbacks", "runners"],
  "zelfstandig-kok": ["keukenhulp", "horeca-personeel", "barpersoneel", "runners"],
  "hospitality-personeel": ["event-crew", "runners", "horeca-personeel", "teamcaptains"],
  teamcaptains: ["event-crew", "horeca-personeel", "productie-assistenten", "runners"],
};

for (const s of services) {
  s.relatedPages = (relatedMap[s.slug] || []).map((slug) => {
    const target = services.find((x) => x.slug === slug);
    return { href: target.path, label: target.title };
  });
  // Add location + work links later in internalLinks helper
}

const workPages = [
  {
    slug: "eventmedewerker",
    title: "Werken als eventmedewerker",
    metaTitle: "Werken als eventmedewerker | Helping Hands",
    metaDescription:
      "Werken als eventmedewerker bij Helping Hands Agency. Floor support, runners en events — meld je aan en bouw ervaring op.",
    h1: "Werken als eventmedewerker",
    intro:
      "Wil je werken op festivals, beurzen en producties? Als eventmedewerker bij Helping Hands Agency help je op de vloer: publieksstromen, check-in, runners en algemene support. Je krijgt duidelijke planning, briefing en begeleiding — ideaal als je ervaring wilt opbouwen in de evenementen. Meld je aan via aanmeldingen@helpinghandsagency.nl of bekijk vacatures.",
    duties: [
      "Floor support en publieksstromen begeleiden",
      "Check-in en ontvangst ondersteunen",
      "Runnertaken tussen zones",
      "Instructies van teamcaptain of productieleiding opvolgen",
    ],
    learn: [
      "Werken onder tempo op echte producties",
      "Communiceren met gasten en crew",
      "Omgaan met briefing en call-times",
    ],
    expect: [
      "Op tijd komen en betrouwbaar zijn",
      "Instructies opvolgen",
      "Fysiek en mentaal kunnen meedraaien tijdens diensten",
    ],
    growth: [
      "Doorgroeien naar runner-specialisatie",
      "Ervaring opbouwen richting teamcaptain",
    ],
    relatedServiceSlug: "event-crew",
  },
  {
    slug: "stagehand",
    title: "Werken als stagehand",
    metaTitle: "Werken als stagehand | Helping Hands Agency",
    metaDescription:
      "Werken als stagehand: load-in, opbouw en afbouw bij events. Meld je aan bij Helping Hands Agency en pak stagebouwklussen mee.",
    h1: "Werken als stagehand",
    intro:
      "Als stagehand help je met laden, lossen, opbouw en afbouw. Helping Hands Agency zoekt mensen die veilig werken, doorpakken en materiaal respecteren. Je bouwt ervaring op bij concerten, festivals en producties — met duidelijke briefing en begeleiding. Aanmelden kan via vacatures of aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Load-in en load-out",
      "Cases en materiaal verplaatsen",
      "Helpen bij opbouw en afbouw",
      "Werkplek veilig en netjes houden",
    ],
    learn: [
      "Materiaalhandling op producties",
      "Samenwerken in een ploeg",
      "Veilig werken met PBM",
    ],
    expect: [
      "Fysiek werk aankunnen",
      "Veiligheidsinstructies volgen",
      "Flexibel zijn in werktijden",
    ],
    growth: ["Meer verantwoordelijkheid op site", "Richting site lead / teamcaptain"],
    relatedServiceSlug: "stagehands",
  },
  {
    slug: "horecamedewerker",
    title: "Werken als horecamedewerker",
    metaTitle: "Werken als horecamedewerker | Helping Hands",
    metaDescription:
      "Werken als horecamedewerker bij events en locaties. Bijbaan of flexibele shifts via Helping Hands Agency. Meld je aan.",
    h1: "Werken als horecamedewerker",
    intro:
      "Horeca bij Helping Hands betekent werken op events, banqueting en locaties: bediening, afruimen, bijvullen en barsupport. Ideaal als horeca bijbaan of om ervaring op te bouwen. Je krijgt heldere shifts en briefing. Meld je aan via aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Uitserveren en afruimen",
      "Bijvullen van stations",
      "Gasten vriendelijk te woord staan",
      "Samenwerken met bar en keuken",
    ],
    learn: ["Service onder tempo", "Horeca-hygiëne in de praktijk", "Teamwork op events"],
    expect: ["Nette uitstraling", "Stressbestendig tijdens piek", "Op tijd en aanspreekbaar"],
    growth: ["Richting barback of teamcaptain", "Meer zelfstandige shifts"],
    relatedServiceSlug: "horeca-personeel",
  },
  {
    slug: "barback",
    title: "Werken als barback",
    metaTitle: "Werken als barback | Helping Hands Agency",
    metaDescription:
      "Werken als barback op events en in de horeca. Tempo achter de bar, bevoorrading en support. Meld je aan bij Helping Hands.",
    h1: "Werken als barback",
    intro:
      "Als barback houd je de bar draaiende: ijs, glazen, voorraad en opruimen. Bij Helping Hands Agency werk je op festivals, events en drukke horecalocaties. Hard werken, korte lijnen, echte shifts. Aanmelden via vacatures of aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Bar bevoorraden",
      "Glazen en ijs regelen",
      "Bartenders ondersteunen",
      "Achter de bar opruimen",
    ],
    learn: ["Barworkflow", "Werken onder piekdrukte", "Samenwerken met bartenders"],
    expect: ["Tempo aankunnen", "Instructies volgen", "Schoon en veilig werken"],
    growth: ["Richting bartender-ervaring", "Meer verantwoordelijkheid op events"],
    relatedServiceSlug: "barbacks",
  },
  {
    slug: "runner",
    title: "Werken als runner",
    metaTitle: "Werken als runner | Helping Hands Agency",
    metaDescription:
      "Werken als runner op events, horeca of productie. Snelle support met duidelijke briefing. Meld je aan bij Helping Hands.",
    h1: "Werken als runner",
    intro:
      "Runners zijn overal tegelijk nodig. Bij Helping Hands Agency werk je als runner op events, in de horeca of bij productie: materiaal, boodschappen en support tussen zones. Perfect als je actief wilt werken en snel leert. Meld je aan via aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Taken snel uitvoeren tussen zones",
      "Materiaal en boodschappen brengen",
      "Horeca of productie ondersteunen",
      "Communiceren met aanspreekpunt",
    ],
    learn: ["Prioriteiten stellen", "Communicatie op locatie", "Eventtempo aanvoelen"],
    expect: ["Actief en alert zijn", "Zelfstandig kunnen lopen", "Bereikbaar tijdens dienst"],
    growth: ["Specialiseren in event of horeca", "Doorgroeien naar teamcaptain"],
    relatedServiceSlug: "runners",
  },
  {
    slug: "keukenhulp",
    title: "Werken als keukenhulp",
    metaTitle: "Werken als keukenhulp | Helping Hands Agency",
    metaDescription:
      "Werken als keukenhulp in restaurants, catering of events. Prep, afwas en support. Meld je aan bij Helping Hands Agency.",
    h1: "Werken als keukenhulp",
    intro:
      "Als keukenhulp ondersteun je de brigade: prep, afwas, opruimen en tempo houden. Helping Hands Agency plaatst je op restaurants, catering en eventkeukens met duidelijke afspraken. Aanmelden via vacatures of aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Prep-ondersteuning",
      "Afwassen en opruimen",
      "Keuken schoonhouden",
      "Brigade assisteren",
    ],
    learn: ["Keukenhygiëne", "Werken in een brigade", "Tempo in de spoelkeuken"],
    expect: ["Hygiënisch werken", "Op tijd komen", "Tegen warmte en tempo kunnen"],
    growth: ["Richting meer keukenverantwoordelijkheid", "Ervaring voor verdere horeca"],
    relatedServiceSlug: "keukenhulp",
  },
  {
    slug: "zelfstandig-kok",
    title: "Werken als zelfstandig kok",
    metaTitle: "Werken als zelfstandig kok | Helping Hands",
    metaDescription:
      "Werken als zelfstandig kok via Helping Hands Agency. Flexibele keukenklussen in restaurants, catering en events.",
    h1: "Werken als zelfstandig kok",
    intro:
      "Heb je keukenervaring en wil je flexibel werken? Helping Hands Agency zoekt zelfstandig koks voor restaurants, catering en eventkeukens. We stemmen niveau en verwachtingen vooraf af. Meld je aan via aanmeldingen@helpinghandsagency.nl met je ervaring.",
    duties: [
      "Stations zelfstandig draaien",
      "Samenwerken met de brigade",
      "Kwaliteit en tempo bewaken",
      "Hygiëneregels naleven",
    ],
    learn: ["Werken in wisselende keukens", "Aanpassen aan menucontext", "Eventcatering-ritme"],
    expect: ["Aantoonbare keukenervaring", "Zelfstandig kunnen werken", "Professionele houding"],
    growth: ["Vaker terugkerende inzet", "Complexere producties"],
    relatedServiceSlug: "zelfstandig-kok",
  },
  {
    slug: "productie-assistent",
    title: "Werken als productie-assistent",
    metaTitle: "Werken als productie-assistent | Helping Hands",
    metaDescription:
      "Werken als productie-assistent op events. Ondersteun productieteams met runners en floor support. Meld je aan.",
    h1: "Werken als productie-assistent",
    intro:
      "Als productie-assistent help je het productieteam met praktische taken, runners en floor support. Bij Helping Hands Agency leer je hoe producties echt lopen — met briefing, call-times en korte lijnen. Aanmelden via vacatures of aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Productieteam ondersteunen",
      "Runnertaken uitvoeren",
      "Checklists oppakken",
      "Communiceren met leiding op locatie",
    ],
    learn: ["Productieprocessen", "Prioriteiten onder tijdsdruk", "Professioneel schakelen"],
    expect: ["Proactieve houding", "Goede communicatie", "Flexibel inzetbaar"],
    growth: ["Meer verantwoordelijkheid", "Richting teamcaptain"],
    relatedServiceSlug: "productie-assistenten",
  },
  {
    slug: "logistiek-medewerker",
    title: "Werken als logistiek medewerker",
    metaTitle: "Werken als logistiek medewerker | Helping Hands",
    metaDescription:
      "Werken als logistiek medewerker op events: laden, lossen en materiaalstromen. Meld je aan bij Helping Hands Agency.",
    h1: "Werken als logistiek medewerker",
    intro:
      "Logistiek werk op events is fysiek, duidelijk en belangrijk. Bij Helping Hands Agency help je met laden, lossen en materiaalstromen. Je krijgt briefing over veiligheid en taken. Meld je aan via aanmeldingen@helpinghandsagency.nl.",
    duties: [
      "Laden en lossen",
      "Materiaal verplaatsen",
      "Depot of backstage ondersteunen",
      "Veilig werken met zwaar materiaal",
    ],
    learn: ["Eventlogistiek", "Samenwerken in een laadploeg", "Veilig tillen en rijden"],
    expect: ["Fysiek inzetbaar", "Veiligheidsregels volgen", "Betrouwbaar op call-time"],
    growth: ["Meer regie op stromen", "Richting site/logistiek lead"],
    relatedServiceSlug: "logistiek-personeel",
  },
  {
    slug: "teamcaptain",
    title: "Werken als teamcaptain",
    metaTitle: "Werken als teamcaptain | Helping Hands Agency",
    metaDescription:
      "Werken als teamcaptain: ploegen aansturen op events en horeca. Groei door bij Helping Hands Agency.",
    h1: "Werken als teamcaptain",
    intro:
      "Als teamcaptain stuur je een ploeg aan, geef je briefings door en houd je overzicht op de vloer. Helping Hands Agency zoekt captains met praktijkervaring in events of horeca. Je bent de brug tussen planning en crew. Meld je aan via aanmeldingen@helpinghandsagency.nl met je ervaring.",
    duties: [
      "Ploeg aansturen op locatie",
      "Briefing doorgeven",
      "Kwaliteit en tempo bewaken",
      "Terugkoppelen naar planning",
    ],
    learn: ["Leidinggeven op de vloer", "Escaleren wanneer nodig", "Crew coachen"],
    expect: [
      "Eerdere crew- of horeca-ervaring",
      "Duidelijk kunnen communiceren",
      "Verantwoordelijkheid nemen",
    ],
    growth: ["Grotere ploegen", "Complexere producties"],
    relatedServiceSlug: "teamcaptains",
  },
].map((w) => ({
  ...w,
  path: `/werken-als/${w.slug}`,
  faqs: faqBlock(w.title.toLowerCase(), [
    {
      question: "Hoe meld ik me aan?",
      answer:
        "Mail aanmeldingen@helpinghandsagency.nl of gebruik het aanmeldformulier op de contactpagina. Vermeld ervaring, woonplaats en beschikbaarheid.",
    },
  ]),
  ctaPrimary: {
    label: "Meld je aan",
    href: "/contact?type=crew-aanmelden",
  },
  ctaSecondary: { label: "Bekijk vacatures", href: "/vacatures" },
  whyUs: [
    "Eerlijke communicatie over shifts",
    "Duidelijke briefing vooraf",
    "Kans om ervaring op te bouwen",
    "Doorgroeien naar meer verantwoordelijkheid",
  ],
}));

const locations = [
  {
    slug: "event-crew-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    serviceSlug: "event-crew",
    serviceLabel: "Event crew",
    metaTitle: "Event crew Amsterdam inhuren",
    metaDescription:
      "Event crew inhuren in Amsterdam: floor support, runners en check-in voor beurzen en events. Actief in regio Amsterdam vanuit Hilversum.",
    h1: "Event crew inhuren in Amsterdam",
    intro:
      "Amsterdam kent een hoge dichtheid aan beurzen, arena's en zakelijke events — vaak met korte omsteltijden. Helping Hands Agency levert event crew in Amsterdam en omgeving: floor support, runners, check-in en crowd support. Wij zijn gevestigd in Hilversum en actief in de regio Amsterdam; we claimen geen apart kantoor in de stad. Deel datum, locatie, tijden en functies — wij denken mee over bezetting. Vraag personeel aan via contact.",
    sectors: ["Beurzen", "Arena's", "Corporate events", "Festivals"],
    examples: [
      "Beursvloeren met check-in en hospitality",
      "Arenaproducties met publieksstromen",
      "Corporate events en productlanceringen",
    ],
  },
  {
    slug: "event-crew-utrecht",
    city: "Utrecht",
    province: "Utrecht",
    serviceSlug: "event-crew",
    serviceLabel: "Event crew",
    metaTitle: "Event crew Utrecht inhuren",
    metaDescription:
      "Event crew inhuren in Utrecht voor beurzen, venues en events. Floor support en runners. Actief in regio Utrecht.",
    h1: "Event crew inhuren in Utrecht",
    intro:
      "Utrecht ligt centraal en heeft een drukke eventkalender: van beurzen tot venues en campus-events. Helping Hands Agency levert event crew in Utrecht en omgeving. Gevestigd in Hilversum, goed bereikbaar voor Midden-Nederland. Wij zetten floor support, runners en check-in in met duidelijke briefing. Geen nepclaims over een vestiging in Utrecht — wel betrouwbare inzet in de regio. Vraag crew aan via contact.",
    sectors: ["Beurzen", "Venues", "Campus events", "Corporate"],
    examples: [
      "Congres- en beursondersteuning",
      "Venue-producties met floor support",
      "Meerdaagse events met wisselende ploegen",
    ],
  },
  {
    slug: "event-crew-rotterdam",
    city: "Rotterdam",
    province: "Zuid-Holland",
    serviceSlug: "event-crew",
    serviceLabel: "Event crew",
    metaTitle: "Event crew Rotterdam inhuren",
    metaDescription:
      "Event crew inhuren in Rotterdam voor halls, festivals en corporate events. Actief in regio Rotterdam vanuit Hilversum.",
    h1: "Event crew inhuren in Rotterdam",
    intro:
      "Rotterdam vraagt om crew die grootschalige locaties en stevig tempo aankan. Helping Hands Agency levert event crew in Rotterdam en omgeving voor halls, festivals en corporate producties. Wij zijn gevestigd in Hilversum en actief in de Randstad. Floor support, runners en ontvangst met heldere briefing. Vraag personeel aan via contact of planning@helpinghandsagency.nl.",
    sectors: ["Halls", "Festivals", "Corporate", "Horeca-events"],
    examples: [
      "Grote zaalproducties",
      "Festivaldagen met publieksstromen",
      "Zakelijke events met check-in",
    ],
  },
  {
    slug: "event-crew-den-haag",
    city: "Den Haag",
    province: "Zuid-Holland",
    serviceSlug: "event-crew",
    serviceLabel: "Event crew",
    metaTitle: "Event crew Den Haag inhuren",
    metaDescription:
      "Event crew inhuren in Den Haag voor congressen, outdoor events en venues. Actief in regio Den Haag.",
    h1: "Event crew inhuren in Den Haag",
    intro:
      "Den Haag combineert congressen, outdoor events en venues aan zee. Helping Hands Agency levert event crew in Den Haag en omgeving — vanuit Hilversum, actief in de Randstad. Wij bezetten floor support, runners en hospitality naar briefing. Vraag crew aan via contact; bij spoed bel of app 06 5741 6338.",
    sectors: ["Congressen", "Outdoor", "Venues", "Hospitality"],
    examples: [
      "Congresregistratie en floor support",
      "Outdoor events met crowd support",
      "Hospitality bij zakelijke bijeenkomsten",
    ],
  },
  {
    slug: "event-crew-hilversum",
    city: "Hilversum",
    province: "Noord-Holland",
    serviceSlug: "event-crew",
    serviceLabel: "Event crew",
    metaTitle: "Event crew Hilversum inhuren",
    metaDescription:
      "Event crew inhuren in Hilversum: korte lijnen vanuit ons kantoor aan Wandelpad 30. Floor support en runners voor lokale producties.",
    h1: "Event crew inhuren in Hilversum",
    intro:
      "Helping Hands Agency is gevestigd aan Wandelpad 30 in Hilversum. Voor event crew in Hilversum en Media Park-omgeving betekent dat korte lijnen, snelle briefing en crew die de regio kent. Wij leveren floor support, runners en ontvangst voor lokale producties, corporate events en mediagerelateerde bijeenkomsten. Ook landelijk actief — maar Hilversum is onze thuisbasis. Vraag personeel aan via contact.",
    sectors: ["Media & corporate", "Lokale events", "Venues", "Hospitality"],
    examples: [
      "Corporate bijeenkomsten",
      "Lokale events en producties",
      "Ontvangst en floor support op locatie",
    ],
  },
  {
    slug: "stagehands-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    serviceSlug: "stagehands",
    serviceLabel: "Stagehands",
    metaTitle: "Stagehands Amsterdam inhuren",
    metaDescription:
      "Stagehands inhuren in Amsterdam voor load-in, opbouw en afbouw. Actief in regio Amsterdam vanuit Hilversum.",
    h1: "Stagehands inhuren in Amsterdam",
    intro:
      "Voor load-in, opbouw en afbouw in Amsterdam levert Helping Hands Agency stagehands en sitecrew. Actief in de regio Amsterdam vanuit onze vestiging in Hilversum — zonder claim op een apart Amsterdams kantoor. Wij briefen PBM, taken en call-times vooraf. Vraag stagehands aan via contact.",
    sectors: ["Concerten", "Festivals", "Beurzen", "Podiumproducties"],
    examples: [
      "Load-in bij venues en halls",
      "Festivalopbouw in de regio",
      "Afbouw na showtijd",
    ],
  },
  {
    slug: "stagehands-utrecht",
    city: "Utrecht",
    province: "Utrecht",
    serviceSlug: "stagehands",
    serviceLabel: "Stagehands",
    metaTitle: "Stagehands Utrecht inhuren",
    metaDescription:
      "Stagehands inhuren in Utrecht voor load-in, opbouw en materiaalhandling. Actief in regio Utrecht.",
    h1: "Stagehands inhuren in Utrecht",
    intro:
      "Utrecht is centraal voor producties in Midden-Nederland. Helping Hands Agency levert stagehands in Utrecht en omgeving voor load-in, opbouw en afbouw. Gevestigd in Hilversum, snel ter plaatse in de regio. Duidelijke briefing, praktische ploegen. Vraag stagehands aan via contact.",
    sectors: ["Venues", "Beurzen", "Festivals", "Corporate producties"],
    examples: [
      "Materiaalhandling op beurzen",
      "Podiumopbouw bij venues",
      "Load-out na afloop",
    ],
  },
  {
    slug: "stagehands-arnhem",
    city: "Arnhem",
    province: "Gelderland",
    serviceSlug: "stagehands",
    serviceLabel: "Stagehands",
    metaTitle: "Stagehands Arnhem inhuren",
    metaDescription:
      "Stagehands inhuren in Arnhem voor load-in, opbouw en afbouw. Actief in regio Arnhem / Gelderland.",
    h1: "Stagehands inhuren in Arnhem",
    intro:
      "Voor producties in Arnhem en omgeving levert Helping Hands Agency stagehands voor load-in, opbouw en afbouw. Wij zijn gevestigd in Hilversum en actief door heel Nederland, inclusief Gelderland. Geen lokale vestigingsclaim — wel betrouwbare inzet op locatie. Vraag stagehands aan via contact.",
    sectors: ["Stadion & arena", "Festivals", "Venues", "Producties"],
    examples: [
      "Load-in bij grootschalige locaties",
      "Opbouw- en afbouwondersteuning",
      "Materiaalstromen backstage",
    ],
  },
  {
    slug: "horeca-personeel-hilversum",
    city: "Hilversum",
    province: "Noord-Holland",
    serviceSlug: "horeca-personeel",
    serviceLabel: "Horeca personeel",
    metaTitle: "Horeca personeel Hilversum inhuren",
    metaDescription:
      "Horeca personeel inhuren in Hilversum. Bediening, runners en barsupport met korte lijnen vanuit Wandelpad 30.",
    h1: "Horeca personeel inhuren in Hilversum",
    intro:
      "Helping Hands Agency zit aan Wandelpad 30 in Hilversum. Voor horeca personeel in Hilversum betekent dat korte lijnen: bediening, runners, barbacks en support bij piek. Geschikt voor lokale horeca, corporate catering en events in de regio. Vraag personeel aan via contact of planning@helpinghandsagency.nl.",
    sectors: ["Horeca", "Catering", "Corporate", "Events"],
    examples: [
      "Piekuren in restaurants",
      "Corporate catering",
      "Lokale events met horecasupport",
    ],
  },
  {
    slug: "horeca-personeel-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    serviceSlug: "horeca-personeel",
    serviceLabel: "Horeca personeel",
    metaTitle: "Horeca personeel Amsterdam inhuren",
    metaDescription:
      "Horeca personeel inhuren in Amsterdam voor events, banqueting en locaties. Actief in regio Amsterdam.",
    h1: "Horeca personeel inhuren in Amsterdam",
    intro:
      "Voor horeca in Amsterdam en omgeving levert Helping Hands Agency bediening, runners en barsupport. Actief in de regio vanuit Hilversum — zonder nepclaim op een Amsterdams filiaal. Ideaal voor banqueting, festivals en locaties met piekdrukte. Vraag horeca personeel aan via contact.",
    sectors: ["Banqueting", "Festivals", "Restaurants", "Pop-ups"],
    examples: [
      "Eventcatering met runners",
      "Barsupport op festivals",
      "Tijdelijke versterking bij locaties",
    ],
  },
  {
    slug: "horeca-personeel-utrecht",
    city: "Utrecht",
    province: "Utrecht",
    serviceSlug: "horeca-personeel",
    serviceLabel: "Horeca personeel",
    metaTitle: "Horeca personeel Utrecht inhuren",
    metaDescription:
      "Horeca personeel inhuren in Utrecht voor events en locaties. Bediening en barsupport in regio Utrecht.",
    h1: "Horeca personeel inhuren in Utrecht",
    intro:
      "Helping Hands Agency levert horeca personeel in Utrecht en omgeving voor events, banqueting en locaties. Gevestigd in Hilversum, centraal voor Midden-Nederland. Duidelijke briefing over taken en uniform. Vraag personeel aan via contact.",
    sectors: ["Events", "Horeca", "Banqueting", "Campus"],
    examples: [
      "Bediening op events",
      "Barbacks bij drukke diensten",
      "Cateringondersteuning",
    ],
  },
  {
    slug: "festival-crew-randstad",
    city: "Randstad",
    province: "Noord- & Zuid-Holland / Utrecht",
    serviceSlug: "festival-crew",
    serviceLabel: "Festival crew",
    metaTitle: "Festival crew Randstad inhuren",
    metaDescription:
      "Festival crew inhuren in de Randstad: opbouw, floor en horeca support. Actief vanuit Hilversum door de Randstad.",
    h1: "Festival crew inhuren in de Randstad",
    intro:
      "De Randstad kent een drukke festivalkalender. Helping Hands Agency levert festival crew voor opbouw, floor support, horeca en logistiek in Amsterdam, Utrecht, Rotterdam, Den Haag en omgeving. Gevestigd in Hilversum — strategisch in het midden van de Randstad. Wij werken met ploegen, shifts en duidelijke briefing. Vraag festival crew aan via contact.",
    sectors: ["Festivals", "Outdoor", "Horeca op terrein", "Opbouw/afbouw"],
    examples: [
      "Meerdaagse festivalploegen",
      "Horeca runners op terrein",
      "Opbouw- en afbouwdagen",
    ],
  },
].map((l) => ({
  ...l,
  path: `/${l.slug}`,
  eyebrow: `${l.serviceLabel} · ${l.city}`,
  heroDescription: `${l.serviceLabel} in ${l.city} en omgeving — met duidelijke briefing en één aanspreekpunt.`,
  whyUs: [
    `Actief in regio ${l.city}`,
    "Gevestigd in Hilversum, landelijk inzetbaar",
    "Eén aanspreekpunt bij planning",
    "Geen nepvestigingen — wel betrouwbare inzet op locatie",
  ],
  processSteps: DEFAULT_PROCESS,
  faqs: faqBlock(`${l.serviceLabel.toLowerCase()} in ${l.city}`, [
    {
      question: `Hebben jullie een kantoor in ${l.city}?`,
      answer:
        l.city === "Hilversum"
          ? "Ja. Ons kantoor zit aan Wandelpad 30, 1211 GN Hilversum."
          : `Nee. Wij zijn gevestigd in Hilversum en leveren personeel in ${l.city} en omgeving — zonder aparte vestigingsclaim.`,
    },
  ]),
  ctaPrimary: {
    label: "Personeel aanvragen",
    href: "/contact?type=personeel-aanvragen",
  },
  ctaSecondary: { label: "Alle locaties", href: "/locaties" },
}));

function writeTs(filename, contents) {
  fs.writeFileSync(path.join(root, filename), contents, "utf8");
  console.log("wrote", filename);
}

writeTs(
  "types.ts",
  `export type SeoFaq = { question: string; answer: string };

export type SeoCta = { label: string; href: string };

export type SeoRelatedLink = { href: string; label: string };

export type SeoRole = { title: string; description: string };

export type SeoProcessStep = { title: string; description: string };

export type ServicePage = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  targetKeywords: string[];
  services: string[];
  whyUs: string[];
  processSteps: SeoProcessStep[];
  roles: SeoRole[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
  relatedPages: SeoRelatedLink[];
};

export type WorkPage = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  duties: string[];
  learn: string[];
  expect: string[];
  growth: string[];
  whyUs: string[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
  relatedServiceSlug: string;
};

export type SeoLocationPage = {
  slug: string;
  path: string;
  city: string;
  province: string;
  serviceSlug: string;
  serviceLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  intro: string;
  sectors: string[];
  examples: string[];
  whyUs: string[];
  processSteps: SeoProcessStep[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
};
`,
);

writeTs(
  "servicePages.ts",
  `import type { ServicePage } from "./types";

export const servicePages: ServicePage[] = ${JSON.stringify(services, null, 2)};

export function getAllServicePages(): ServicePage[] {
  return servicePages;
}

export function getServicePage(slug: string): ServicePage | undefined {
  return servicePages.find((page) => page.slug === slug);
}
`,
);

writeTs(
  "workPages.ts",
  `import type { WorkPage } from "./types";

export const workPages: WorkPage[] = ${JSON.stringify(workPages, null, 2)};

export function getAllWorkPages(): WorkPage[] {
  return workPages;
}

export function getWorkPage(slug: string): WorkPage | undefined {
  return workPages.find((page) => page.slug === slug);
}
`,
);

writeTs(
  "locationPages.ts",
  `import type { SeoLocationPage } from "./types";

export const seoLocationPages: SeoLocationPage[] = ${JSON.stringify(locations, null, 2)};

export function getAllSeoLocationPages(): SeoLocationPage[] {
  return seoLocationPages;
}

export function getSeoLocationPage(slug: string): SeoLocationPage | undefined {
  return seoLocationPages.find((page) => page.slug === slug);
}

export function getSeoLocationSlugs(): string[] {
  return seoLocationPages.map((page) => page.slug);
}
`,
);

console.log("done", {
  services: services.length,
  work: workPages.length,
  locations: locations.length,
});
