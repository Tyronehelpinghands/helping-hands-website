/**
 * One-shot generator for new SEO service + location page snippets.
 * Run: node scripts/generate-seo-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const processSteps = [
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
    description: "Crew staat op tijd klaar op locatie met duidelijke instructies.",
  },
  {
    title: "Uren en afronding",
    description:
      "Urenregistratie en terugkoppeling na afloop — kort en overzichtelijk.",
  },
];

const whyUs = [
  "Snelle schakeling bij wijzigingen of spoedaanvragen",
  "Duidelijke briefing en één aanspreekpunt bij planning",
  "Gemotiveerde crew met praktijkervaring op events en horeca",
  "Ervaring met festivals, producties, horeca en logistiek",
  "Jongeren ontwikkelen via echte werkervaring op locatie",
  "Korte lijnen: gevestigd in Hilversum, actief door heel Nederland",
];

const ctaPrimary = {
  label: "Personeel aanvragen",
  href: "/contact?type=personeel-aanvragen",
};
const ctaSecondary = { label: "Alle diensten", href: "/personeel-inhuren" };

function baseFaqs(label) {
  return [
    {
      question: `Hoe vraag ik ${label} aan?`,
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
      question: "Wat kosten jullie diensten?",
      answer:
        "Tarief op aanvraag. De prijs hangt af van functie, tijden, locatie en aantallen. Deel je planning — wij sturen een passende indicatie.",
    },
    {
      question: "Voor wie is Helping Hands Agency bedoeld?",
      answer:
        "Voor opdrachtgevers die betrouwbare event-, horeca- of productiemeewerkers nodig hebben — en voor crew die wil werken op echte producties in de live branche.",
    },
  ];
}

const newServices = [
  {
    slug: "eventpersoneel",
    title: "Eventpersoneel inhuren",
    metaTitle: "Eventpersoneel inhuren | Helping Hands Agency",
    metaDescription:
      "Eventpersoneel inhuren voor festivals, beurzen en producties. Floor support, runners en ontvangst met duidelijke briefing. Vraag direct aan.",
    h1: "Eventpersoneel inhuren voor festivals, beurzen en producties",
    intro:
      "Helping Hands Agency levert eventpersoneel voor opdrachtgevers die betrouwbare handen nodig hebben op de vloer. Denk aan festivals, beurzen, corporate events, concerten en stadionproducties. Je deelt datum, locatie, tijden en functies — wij bezetten met praktische mensen die snappen wat er speelt. Wij zijn gevestigd in Hilversum en actief door heel Nederland. Of je nu floor support, runners of check-in nodig hebt: je hebt één aanspreekpunt bij planning. Tarief op aanvraag. Vraag personeel aan via contact — wij denken mee over bezetting en briefing.",
    targetKeywords: ["eventpersoneel inhuren", "event personeel", "personeel evenementen"],
    services: [
      "Floor support en publieksstromen",
      "Runners tussen zones",
      "Check-in en ontvangst",
      "Crowd support tijdens piek",
      "Algemene eventondersteuning",
    ],
    roles: [
      { title: "Eventmedewerker", description: "Algemene support op de vloer." },
      { title: "Floor support", description: "Zones en doorstroom begeleiden." },
      { title: "Runner", description: "Snelle taken tussen locaties." },
      { title: "Check-in", description: "Ontvangst en first contact." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/event-crew", label: "Event crew inhuren" },
      { href: "/personeel-inhuren/festival-crew", label: "Festival crew inhuren" },
      { href: "/personeel-inhuren/runners", label: "Runners inhuren" },
      { href: "/personeel-inhuren/spoed-personeel-evenementen", label: "Spoed personeel evenementen" },
    ],
  },
  {
    slug: "horeca-uitzendbureau",
    title: "Horeca uitzendbureau",
    metaTitle: "Horeca uitzendbureau | Helping Hands Agency",
    metaDescription:
      "Horeca uitzendbureau voor events en locaties. Bediening, bar en keukenondersteuning met heldere briefing. Tarief op aanvraag.",
    h1: "Horeca uitzendbureau voor events, catering en locaties",
    intro:
      "Zoek je een horeca uitzendbureau dat snapt hoe events en piekdiensten werken? Helping Hands Agency levert flexibele horecasupport: bediening, runners, barbacks en keukenondersteuning. Geschikt voor banqueting, festivals, pop-ups en horecalocaties die tijdelijk extra handen nodig hebben. Wij briefen over taken, uniform en hygiëne, zodat crew meteen mee kan. Gevestigd in Hilversum, actief landelijk. Tarief op aanvraag. Vraag horecapersoneel aan via contact of planning@helpinghandsagency.nl.",
    targetKeywords: ["horeca uitzendbureau", "horeca personeel inhuren", "uitzendbureau horeca events"],
    services: [
      "Bediening en floor support",
      "Barbacks en barondersteuning",
      "Keukenhulp en afwas",
      "Banqueting en eventcatering",
      "Piekuren en spoedbezetting",
    ],
    roles: [
      { title: "Horecamedewerker", description: "Breed inzetbaar in service." },
      { title: "Bediening", description: "Uitserveren en gastflow." },
      { title: "Barback", description: "Bar bevoorraden en ondersteunen." },
      { title: "Keukenhulp", description: "Prep, afwas en keukenondersteuning." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/horeca-personeel", label: "Horeca personeel inhuren" },
      { href: "/personeel-inhuren/bediening-inhuren", label: "Bediening inhuren" },
      { href: "/personeel-inhuren/catering-personeel", label: "Catering personeel" },
      { href: "/personeel-inhuren/barpersoneel", label: "Barpersoneel inhuren" },
    ],
  },
  {
    slug: "personeel-evenementenbureau",
    title: "Personeel voor evenementenbureau",
    metaTitle: "Personeel evenementenbureau | Helping Hands Agency",
    metaDescription:
      "Personeel voor evenementenbureaus: crew, runners en productie-support. Eén aanspreekpunt, snelle planning. Tarief op aanvraag.",
    h1: "Personeel inhuren voor evenementenbureaus",
    intro:
      "Evenementenbureaus hebben vaak flexibele bezetting nodig zonder zelf een groot vast team aan te houden. Helping Hands Agency levert personeel voor evenementenbureaus: event crew, runners, hospitality, stagehands en horecasupport. Wij werken met duidelijke briefings en één aanspreekpunt, zodat jij je klant kunt blijven bedienen. Gevestigd in Hilversum, inzetbaar landelijk. Tarief op aanvraag. Deel je productieplanning via contact — wij denken mee over ploegen en shifts.",
    targetKeywords: [
      "personeel evenementenbureau",
      "crew voor eventbureau",
      "flex personeel events",
    ],
    services: [
      "Event crew voor bureau-producties",
      "Runners en productie-assistenten",
      "Hospitality en ontvangst",
      "Horecasupport op events",
      "Opbouw- en afbouwondersteuning",
    ],
    roles: [
      { title: "Eventmedewerker", description: "Support op de vloer." },
      { title: "Productierunner", description: "Taken voor het bureauteam." },
      { title: "Hospitality", description: "Gastontvangst en begeleiding." },
      { title: "Sitecrew", description: "Praktische support op terrein." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/event-crew", label: "Event crew inhuren" },
      { href: "/personeel-inhuren/productie-assistenten", label: "Productie-assistenten" },
      { href: "/personeel-inhuren/eventpersoneel", label: "Eventpersoneel inhuren" },
      { href: "/opdrachtgevers", label: "Voor opdrachtgevers" },
    ],
  },
  {
    slug: "festival-medewerkers",
    title: "Festival medewerkers inhuren",
    metaTitle: "Festival medewerkers inhuren | Helping Hands Agency",
    metaDescription:
      "Festival medewerkers inhuren voor opbouw, floor en horeca. Betrouwbare ploegen met briefing. Tarief op aanvraag.",
    h1: "Festival medewerkers inhuren voor outdoor events",
    intro:
      "Festivals vragen om medewerkers die tegen tempo, wisselend weer en lange dagen kunnen. Helping Hands Agency levert festival medewerkers voor opbouw, floor support, horeca-ondersteuning en logistiek op het terrein. Wij matchen mensen op beschikbaarheid en functie, met een heldere briefing over taken en verzamelpunten. Gevestigd in Hilversum, inzetbaar in de Randstad en landelijk. Tarief op aanvraag. Deel je productieplanning — wij denken mee over ploegen en shifts.",
    targetKeywords: [
      "festival medewerkers inhuren",
      "festival personeel",
      "medewerkers outdoor events",
    ],
    services: [
      "Opbouw- en afbouwondersteuning",
      "Floor en crowd support",
      "Horeca runners en barbacks",
      "Logistiek op het terrein",
      "Meerdaagse ploegen",
    ],
    roles: [
      { title: "Festivalmedewerker", description: "Breed inzetbaar op terrein." },
      { title: "Floor support", description: "Publieksstromen en zones." },
      { title: "Horeca support", description: "Uitserveren en bijvullen." },
      { title: "Logistiek", description: "Materiaal en bevoorrading." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/festival-crew", label: "Festival crew inhuren" },
      { href: "/personeel-inhuren/op-en-afbouw-crew", label: "Op- en afbouw crew" },
      { href: "/personeel-inhuren/eventpersoneel", label: "Eventpersoneel" },
      { href: "/festival-crew-randstad", label: "Festival crew Randstad" },
    ],
  },
  {
    slug: "op-en-afbouw-crew",
    title: "Op- en afbouw crew inhuren",
    metaTitle: "Op- en afbouw crew inhuren | Helping Hands Agency",
    metaDescription:
      "Op- en afbouw crew inhuren voor festivals, beurzen en producties. Praktische sitecrew met briefing. Tarief op aanvraag.",
    h1: "Op- en afbouw crew inhuren voor events en producties",
    intro:
      "Opbouw en afbouw bepalen of een productie op tijd start en netjes eindigt. Helping Hands Agency levert op- en afbouw crew voor festivals, beurzen, podiumproducties en outdoor events. Mensen die cases rijden, decor verplaatsen en veilig doorpakken volgens briefing. Wij stemmen PBM, taken en call-times vooraf af. Gevestigd in Hilversum, actief landelijk. Tarief op aanvraag. Vraag op- en afbouw crew aan via contact.",
    targetKeywords: ["opbouw crew inhuren", "afbouw crew", "op en afbouw personeel"],
    services: [
      "Opbouwondersteuning",
      "Afbouw na afloop",
      "Materiaalhandling",
      "Sitecrew rondom podium",
      "Ondersteuning bij ombouw",
    ],
    roles: [
      { title: "Opbouwmedewerker", description: "Helpen bij opbouw en inrichting." },
      { title: "Afbouwcrew", description: "Snel en veilig afbreken." },
      { title: "Sitecrew", description: "Algemene support op terrein." },
      { title: "Stagehand", description: "Laden, lossen en cases." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/stagehands", label: "Stagehands inhuren" },
      { href: "/personeel-inhuren/load-in-load-out-crew", label: "Load-in / load-out crew" },
      { href: "/personeel-inhuren/site-crew", label: "Site crew inhuren" },
      { href: "/personeel-inhuren/festival-crew", label: "Festival crew" },
    ],
  },
  {
    slug: "load-in-load-out-crew",
    title: "Load-in en load-out crew",
    metaTitle: "Load-in load-out crew inhuren | Helping Hands Agency",
    metaDescription:
      "Load-in en load-out crew inhuren voor concerten, festivals en producties. Veilige materiaalhandling met briefing.",
    h1: "Load-in en load-out crew inhuren",
    intro:
      "Load-in en load-out vragen om tempo, overzicht en veilig tillen. Helping Hands Agency levert load-in/load-out crew voor concerten, festivals, beurzen en locatieproducties. Onze mensen werken volgens briefing, met aandacht voor PBM en routing. Geschikt wanneer trucks, cases en decor strak op tijd moeten bewegen. Gevestigd in Hilversum, inzetbaar door heel Nederland. Tarief op aanvraag. Vraag crew aan via contact of bel 06 5741 6338 bij spoed.",
    targetKeywords: ["load-in crew", "load-out crew", "laden lossen evenementen"],
    services: [
      "Load-in bij trucks en docks",
      "Load-out na showtijd",
      "Cases en materiaal verplaatsen",
      "Dock-to-stage support",
      "Veilig werken volgens briefing",
    ],
    roles: [
      { title: "Loader", description: "Laden en lossen bij trucks." },
      { title: "Stagehand", description: "Materiaalhandling op site." },
      { title: "Sitecrew", description: "Routing en support." },
      { title: "Logistiek", description: "Stromen back-of-house." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/stagehands", label: "Stagehands inhuren" },
      { href: "/personeel-inhuren/op-en-afbouw-crew", label: "Op- en afbouw crew" },
      { href: "/personeel-inhuren/logistiek-personeel", label: "Logistiek personeel" },
      { href: "/personeel-inhuren/festival-crew", label: "Festival crew" },
    ],
  },
  {
    slug: "catering-personeel",
    title: "Catering personeel inhuren",
    metaTitle: "Catering personeel inhuren | Helping Hands Agency",
    metaDescription:
      "Catering personeel inhuren voor events, banqueting en locaties. Bediening, runners en keukenondersteuning. Tarief op aanvraag.",
    h1: "Catering personeel inhuren voor events en banqueting",
    intro:
      "Catering op events vraagt om tempo, hygiëne en duidelijke rollen. Helping Hands Agency levert catering personeel voor banqueting, festivals, corporate lunches en locatiecatering. Denk aan bediening, runners, barbacks en keukenondersteuning. Wij briefen taken, uniform en werkwijze vooraf. Gevestigd in Hilversum, actief landelijk. Tarief op aanvraag. Vraag catering personeel aan via contact — wij denken mee over shifts en aantallen.",
    targetKeywords: ["catering personeel inhuren", "event catering crew", "banqueting personeel"],
    services: [
      "Bediening bij banqueting",
      "Catering runners",
      "Keukenhulp in eventkeukens",
      "Barondersteuning",
      "Piekuren en buffetsupport",
    ],
    roles: [
      { title: "Cateringmedewerker", description: "Service tijdens catering." },
      { title: "Bediening", description: "Uitserveren en afruimen." },
      { title: "Keukenhulp", description: "Prep en afwas." },
      { title: "Runner", description: "Stromen tussen keuken en vloer." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/horeca-personeel", label: "Horeca personeel" },
      { href: "/personeel-inhuren/bediening-inhuren", label: "Bediening inhuren" },
      { href: "/personeel-inhuren/keukenhulp", label: "Keukenhulp inhuren" },
      { href: "/personeel-inhuren/horeca-uitzendbureau", label: "Horeca uitzendbureau" },
    ],
  },
  {
    slug: "bediening-inhuren",
    title: "Bediening inhuren",
    metaTitle: "Bediening inhuren | Helping Hands Agency",
    metaDescription:
      "Bediening inhuren voor events, restaurants en banqueting. Service crew met heldere briefing. Tarief op aanvraag.",
    h1: "Bediening inhuren voor events, restaurants en banqueting",
    intro:
      "Goede bediening houdt de floor rustig en gasten tevreden. Helping Hands Agency levert bedieningspersoneel voor events, restaurants, banqueting en pop-ups. Crew die uitserveert, afruimt, bijvult en meedenkt tijdens piek. Wij briefen taken, kleding en hygiëneregels vooraf. Gevestigd in Hilversum, inzetbaar landelijk. Tarief op aanvraag. Vraag bediening aan via contact of planning@helpinghandsagency.nl.",
    targetKeywords: ["bediening inhuren", "bedieningspersoneel", "service personeel events"],
    services: [
      "Bediening op events",
      "Restaurant piekondersteuning",
      "Banqueting service",
      "Afruimen en bijvullen",
      "Floor support horeca",
    ],
    roles: [
      { title: "Bedieningsmedewerker", description: "Service op de vloer." },
      { title: "Runner bediening", description: "Snel afruimen en bijvullen." },
      { title: "Banqueting host", description: "Service bij diners en recepties." },
      { title: "Floor horeca", description: "Gastflow en overzicht." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/horeca-personeel", label: "Horeca personeel" },
      { href: "/personeel-inhuren/catering-personeel", label: "Catering personeel" },
      { href: "/personeel-inhuren/runners", label: "Runners inhuren" },
      { href: "/personeel-inhuren/barpersoneel", label: "Barpersoneel" },
    ],
  },
  {
    slug: "afwassers-keukenpersoneel",
    title: "Afwassers en keukenpersoneel",
    metaTitle: "Afwassers & keukenpersoneel inhuren | Helping Hands Agency",
    metaDescription:
      "Afwassers en keukenpersoneel inhuren voor restaurants, catering en events. Spoelkeuken en prep met briefing.",
    h1: "Afwassers en keukenpersoneel inhuren",
    intro:
      "Zonder spoelkeuken en keukenondersteuning stopt de service. Helping Hands Agency levert afwassers en keukenpersoneel voor restaurants, catering en eventkeukens. Prep, afwas, opruimen en assistentie van de brigade — met briefing over hygiëne en taken. Gevestigd in Hilversum, actief landelijk. Tarief op aanvraag. Vraag keukenpersoneel aan via contact; bij spoed bel of app 06 5741 6338.",
    targetKeywords: ["afwassers inhuren", "keukenpersoneel inhuren", "spoelkeuken personeel"],
    services: [
      "Afwassen en spoelkeuken",
      "Prep-ondersteuning",
      "Keuken schoonhouden",
      "Assistentie brigade",
      "Event- en cateringkeukens",
    ],
    roles: [
      { title: "Afwasser", description: "Spoelkeuken en tempo houden." },
      { title: "Keukenhulp", description: "Algemene keukenondersteuning." },
      { title: "Prep-assistent", description: "Mise-en-place voorbereiden." },
      { title: "Keukenrunner", description: "Aanvullen en weglopen van vuil." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/keukenhulp", label: "Keukenhulp inhuren" },
      { href: "/personeel-inhuren/catering-personeel", label: "Catering personeel" },
      { href: "/personeel-inhuren/horeca-personeel", label: "Horeca personeel" },
      { href: "/personeel-inhuren/zelfstandig-kok", label: "Zelfstandig kok" },
    ],
  },
  {
    slug: "spoed-personeel-evenementen",
    title: "Spoed personeel evenementen",
    metaTitle: "Spoed personeel evenementen | Helping Hands Agency",
    metaDescription:
      "Spoed personeel voor evenementen: snelle bezetting bij last-minute aanvragen. Bel 06 5741 6338. Tarief op aanvraag.",
    h1: "Spoed personeel voor evenementen inhuren",
    intro:
      "Soms valt bezetting uit of komt er last-minute werk bij. Helping Hands Agency helpt bij spoed personeel voor evenementen: event crew, horecasupport, runners of sitecrew — afhankelijk van beschikbaarheid. Deel zo concreet mogelijk datum, locatie, tijden en functies; bij acute spoed bel of app 06 5741 6338. Gevestigd in Hilversum, landelijk inzetbaar. Tarief op aanvraag. Wij beloven geen wonderen, wel snelle check en eerlijke terugkoppeling over wat haalbaar is.",
    targetKeywords: [
      "spoed personeel evenementen",
      "last minute event crew",
      "spoed uitzendkrachten events",
    ],
    services: [
      "Last-minute event crew",
      "Spoed horecasupport",
      "Extra runners op de dag",
      "Vervanging bij uitval",
      "Snelle beschikbaarheidcheck",
    ],
    roles: [
      { title: "Eventmedewerker", description: "Direct inzetbaar op vloer." },
      { title: "Horecasupport", description: "Extra handen in service." },
      { title: "Runner", description: "Snelle taken oppakken." },
      { title: "Sitecrew", description: "Praktische noodondersteuning." },
    ],
    relatedPages: [
      { href: "/personeel-inhuren/eventpersoneel", label: "Eventpersoneel" },
      { href: "/personeel-inhuren/event-crew", label: "Event crew" },
      { href: "/personeel-inhuren/horeca-personeel", label: "Horeca personeel" },
      { href: "/contact?type=personeel-aanvragen", label: "Direct aanvragen" },
    ],
  },
];

function toServicePage(s) {
  return {
    ...s,
    path: `/personeel-inhuren/${s.slug}`,
    whyUs,
    processSteps,
    faqs: baseFaqs(s.title.toLowerCase()),
    ctaPrimary,
    ctaSecondary,
  };
}

const serviceOut = `import type { ServicePage } from "./types";

/** Additional commercial SEO landings under /personeel-inhuren. */
export const additionalServicePages: ServicePage[] = ${JSON.stringify(
  newServices.map(toServicePage),
  null,
  2,
)};
`;

fs.writeFileSync(
  path.join(root, "src/lib/seo/additionalServicePages.ts"),
  serviceOut,
  "utf8",
);

// Location pages for /locaties/*
const locProcess = [
  { title: "Aanvraag", description: "Datum, locatie, tijden, functies en aantallen delen via contact." },
  { title: "Bezetting", description: "Wij matchen beschikbare crew op functie en regio." },
  { title: "Briefing", description: "Taken, kleding/PBM en verzamelpunt vooraf afstemmen." },
  { title: "Inzet", description: "Crew op locatie met één aanspreekpunt tijdens de dienst." },
];

function locFaqs(city, service) {
  const office =
    city === "Hilversum"
      ? "Ja. Ons kantoor zit aan Wandelpad 30, 1211 GN Hilversum."
      : `Nee. Wij zijn gevestigd in Hilversum en leveren personeel in ${city} en omgeving — zonder aparte vestigingsclaim.`;
  return [
    {
      question: `Hoe vraag ik ${service} in ${city} aan?`,
      answer:
        "Via /contact of planning@helpinghandsagency.nl. Vermeld datum, locatie, tijden, functies en aantal mensen. Bij spoed: bel of app 06 5741 6338.",
    },
    {
      question: "Wat kosten jullie diensten?",
      answer:
        "Tarief op aanvraag. De prijs hangt af van functie, tijden, locatie en aantallen.",
    },
    {
      question: `Hebben jullie een kantoor in ${city}?`,
      answer: office,
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
  ];
}

const newLocations = [
  {
    slug: "hilversum",
    city: "Hilversum",
    province: "Noord-Holland",
    primaryService: "event-crew",
    path: "/locaties/hilversum",
    metaTitle: "Event crew & horecapersoneel Hilversum | Helping Hands Agency",
    metaDescription:
      "Helping Hands Agency in Hilversum: event crew, stagehands en horecapersoneel inhuren. Wandelpad 30 — korte lijnen, landelijke inzet.",
    eyebrow: "Vestiging · Hilversum",
    h1: "Helping Hands Agency in Hilversum — event crew & horecapersoneel",
    heroDescription:
      "Ons kantoor aan Wandelpad 30 is de thuisbasis voor event staffing door heel Nederland.",
    intro: [
      "Helping Hands Agency is gevestigd aan Wandelpad 30, 1211 GN Hilversum. Vanuit deze vestiging plannen we event crew, stagehands, horecapersoneel en productiesupport voor opdrachtgevers in Hilversum, Media Park-omgeving, de Randstad en landelijk.",
      "Hilversum is onze enige vestiging — geen nepfilialen elders. Wel leveren we betrouwbare crew op locatie, met duidelijke briefing en één aanspreekpunt. Of je nu een lokaal corporate event, een horecapiek of een landelijke festivalproductie hebt: deel datum, locatie, tijden en functies. Tarief op aanvraag.",
      "Op zoek naar een specifieke dienst? Bekijk event crew Hilversum, horeca personeel Hilversum of stagehands Hilversum — of vraag direct aan via contact.",
    ],
    staffTypes: [
      { title: "Event crew", description: "Floor support, runners en ontvangst voor lokale en landelijke producties." },
      { title: "Stagehands", description: "Load-in, opbouw en afbouw met korte lijnen vanuit Hilversum." },
      { title: "Horecapersoneel", description: "Bediening, barbacks en keukenondersteuning bij piek." },
      { title: "Productie-support", description: "Runners en assistentie voor mediagerelateerde en corporate events." },
    ],
    applications: [
      "Corporate en media-gerelateerde bijeenkomsten in Hilversum",
      "Lokale events en venues in 't Gooi",
      "Horecapieken en catering in de regio",
      "Doorreis naar Randstad-producties vanuit centrale vestiging",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Echte vestiging aan Wandelpad 30, 1211 GN Hilversum",
      "Korte lijnen voor planning en spoed",
      "Event staffing — geen zorg- of thuiszorgorganisatie",
      "Landelijke inzet met één aanspreekpunt",
    ],
    venues: ["Media Park-omgeving", "Lokale venues en corporate locaties", "Horeca in 't Gooi", "Randstad-producties"],
    relatedServiceSlugs: ["event-crew", "horeca-personeel", "stagehands"],
    relatedProjectCaseSlugs: ["rai-amsterdam", "johan-cruijff-arena-amsterdam"],
    faqs: locFaqs("Hilversum", "personeel"),
    image: {
      src: "/images/crew/concert-globe-stage.webp",
      alt: "Event crew van Helping Hands Agency — vestiging Hilversum",
    },
  },
  {
    slug: "stagehands-hilversum",
    city: "Hilversum",
    province: "Noord-Holland",
    primaryService: "stagehands",
    path: "/locaties/stagehands-hilversum",
    metaTitle: "Stagehands Hilversum inhuren | Helping Hands Agency",
    metaDescription:
      "Stagehands inhuren in Hilversum: load-in, opbouw en afbouw. Korte lijnen vanuit Wandelpad 30. Tarief op aanvraag.",
    eyebrow: "Stagehands · Hilversum",
    h1: "Stagehands inhuren in Hilversum",
    heroDescription:
      "Load-in, opbouw en afbouw vanuit onze vestiging in Hilversum — met duidelijke briefing.",
    intro: [
      "Helping Hands Agency zit aan Wandelpad 30 in Hilversum. Voor stagehands in Hilversum en omgeving betekent dat korte lijnen: load-in, materiaalhandling, opbouw en afbouw met heldere call-times.",
      "Geschikt voor mediagerelateerde producties, lokale venues en doorreis naar Randstad-shows. Wij briefen PBM, taken en verzamelpunt vooraf. Tarief op aanvraag. Vraag stagehands aan via contact.",
    ],
    staffTypes: [
      { title: "Stagehand", description: "Laden, lossen en materiaalhandling." },
      { title: "Opbouwcrew", description: "Helpen bij podium- en décorbouw." },
      { title: "Afbouwcrew", description: "Snel en veilig afbreken na afloop." },
      { title: "Sitecrew", description: "Algemene support rondom de productie." },
    ],
    applications: [
      "Lokale producties en venues",
      "Load-in bij mediagerelateerde events",
      "Opbouw- en afbouwdagen",
      "Materiaalstromen backstage",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Gevestigd in Hilversum — korte lijnen",
      "Praktische stagehands met briefing",
      "Eén aanspreekpunt bij planning",
      "Ook landelijk inzetbaar",
    ],
    venues: ["Lokale venues", "Corporate producties", "Outdoor setups", "Randstad doorreis"],
    relatedServiceSlugs: ["stagehands", "logistiek", "event-crew"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "johan-cruijff-arena-amsterdam"],
    faqs: locFaqs("Hilversum", "stagehands"),
    image: {
      src: "/images/crew/stadium-flightcase-push.webp",
      alt: "Stagehands van Helping Hands Agency in Hilversum",
    },
  },
  {
    slug: "eventpersoneel-rotterdam",
    city: "Rotterdam",
    province: "Zuid-Holland",
    primaryService: "event-crew",
    path: "/locaties/eventpersoneel-rotterdam",
    metaTitle: "Eventpersoneel Rotterdam inhuren | Helping Hands Agency",
    metaDescription:
      "Eventpersoneel inhuren in Rotterdam voor halls, festivals en corporate events. Actief vanuit Hilversum. Tarief op aanvraag.",
    eyebrow: "Eventpersoneel · Rotterdam",
    h1: "Eventpersoneel inhuren in Rotterdam",
    heroDescription:
      "Eventpersoneel voor halls, festivals en zakelijke producties in Rotterdam en omgeving.",
    intro: [
      "Rotterdam vraagt om eventpersoneel dat grootschalige locaties en stevig tempo aankan. Helping Hands Agency levert floor support, runners en ontvangst voor halls, festivals en corporate producties in Rotterdam en omgeving.",
      "Wij zijn gevestigd in Hilversum en actief in de Randstad — zonder nepclaim op een Rotterdams filiaal. Duidelijke briefing, één aanspreekpunt. Tarief op aanvraag. Vraag personeel aan via contact.",
    ],
    staffTypes: [
      { title: "Eventmedewerkers", description: "Algemene support op de vloer." },
      { title: "Floor support", description: "Publieksstromen en zones." },
      { title: "Runners", description: "Snelle taken tussen locaties." },
      { title: "Check-in", description: "Ontvangst en registratie." },
    ],
    applications: [
      "Grote zaal- en hallproducties",
      "Festivaldagen met publieksstromen",
      "Zakelijke events met check-in",
      "Horeca-events met floor support",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Actief in regio Rotterdam",
      "Gevestigd in Hilversum, landelijk inzetbaar",
      "Eén aanspreekpunt bij planning",
      "Geen nepvestigingen — wel betrouwbare inzet",
    ],
    venues: ["Halls en arena's", "Festivals", "Corporate venues", "Horeca-events"],
    relatedServiceSlugs: ["event-crew", "hospitality", "horeca-personeel"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "rai-amsterdam"],
    faqs: locFaqs("Rotterdam", "eventpersoneel"),
    image: {
      src: "/images/crew/concert-globe-stage.webp",
      alt: "Eventpersoneel van Helping Hands Agency in Rotterdam",
    },
  },
  {
    slug: "eventpersoneel-amersfoort",
    city: "Amersfoort",
    province: "Utrecht",
    primaryService: "event-crew",
    path: "/locaties/eventpersoneel-amersfoort",
    metaTitle: "Eventpersoneel Amersfoort inhuren | Helping Hands Agency",
    metaDescription:
      "Eventpersoneel inhuren in Amersfoort voor festivals, events en locaties. Actief vanuit Hilversum. Tarief op aanvraag.",
    eyebrow: "Eventpersoneel · Amersfoort",
    h1: "Eventpersoneel inhuren in Amersfoort",
    heroDescription:
      "Eventpersoneel voor festivals, foodevents en locaties in Amersfoort en de regio Eemland.",
    intro: [
      "Amersfoort kent een levendige kalender met foodevents, festivals en lokale producties. Helping Hands Agency levert eventpersoneel in Amersfoort en omgeving: floor support, runners en ontvangst.",
      "Gevestigd in Hilversum, goed bereikbaar voor Midden-Nederland. Geen aparte vestiging in Amersfoort — wel betrouwbare inzet op locatie. Tarief op aanvraag. Vraag crew aan via contact.",
    ],
    staffTypes: [
      { title: "Eventmedewerkers", description: "Support op events en festivals." },
      { title: "Floor support", description: "Doorstroom en zones." },
      { title: "Runners", description: "Snelle ondersteuning." },
      { title: "Horecasupport", description: "Extra handen bij foodevents." },
    ],
    applications: [
      "Foodfestivals en outdoor events",
      "Lokale venues en producties",
      "Corporate bijeenkomsten",
      "Horeca-events in de regio",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Actief in regio Amersfoort / Eemland",
      "Gevestigd in Hilversum",
      "Eén aanspreekpunt",
      "Tarief op aanvraag — geen verborgen beloftes",
    ],
    venues: ["Foodfestivals", "Lokale venues", "Outdoor events", "Corporate locaties"],
    relatedServiceSlugs: ["event-crew", "horeca-personeel", "hospitality"],
    relatedProjectCaseSlugs: ["rai-amsterdam", "zuiderpark-den-haag"],
    faqs: locFaqs("Amersfoort", "eventpersoneel"),
    image: {
      src: "/images/crew/concert-globe-stage.webp",
      alt: "Eventpersoneel van Helping Hands Agency in Amersfoort",
    },
  },
  {
    slug: "eventpersoneel-arnhem",
    city: "Arnhem",
    province: "Gelderland",
    primaryService: "event-crew",
    path: "/locaties/eventpersoneel-arnhem",
    metaTitle: "Eventpersoneel Arnhem inhuren | Helping Hands Agency",
    metaDescription:
      "Eventpersoneel inhuren in Arnhem voor stadion, festivals en producties. Actief in Gelderland vanuit Hilversum.",
    eyebrow: "Eventpersoneel · Arnhem",
    h1: "Eventpersoneel inhuren in Arnhem",
    heroDescription:
      "Eventpersoneel voor stadionproducties, festivals en venues in Arnhem en omgeving.",
    intro: [
      "Voor producties in Arnhem en Gelderland levert Helping Hands Agency eventpersoneel: floor support, runners en ontvangst. Onze crew heeft projectervaring bij grootschalige locaties via opdrachten en productiepartners.",
      "Wij zijn gevestigd in Hilversum en actief landelijk — zonder lokale vestigingsclaim in Arnhem. Duidelijke briefing, één aanspreekpunt. Tarief op aanvraag. Vraag personeel aan via contact.",
    ],
    staffTypes: [
      { title: "Eventmedewerkers", description: "Support op de vloer." },
      { title: "Floor support", description: "Publieksstromen in halls en outdoor." },
      { title: "Runners", description: "Taken tussen zones." },
      { title: "Sitecrew", description: "Praktische terreinondersteuning." },
    ],
    applications: [
      "Stadion- en arenaproducties",
      "Festivals in de regio",
      "Venue-events",
      "Corporate producties",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Actief in regio Arnhem / Gelderland",
      "Gevestigd in Hilversum, landelijk inzetbaar",
      "Eén aanspreekpunt",
      "Geen nepvestigingen",
    ],
    venues: ["Stadion & arena", "Festivals", "Venues", "Corporate events"],
    relatedServiceSlugs: ["event-crew", "stagehands", "logistiek"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "johan-cruijff-arena-amsterdam"],
    faqs: locFaqs("Arnhem", "eventpersoneel"),
    image: {
      src: "/images/crew/stadium-flightcase-push.webp",
      alt: "Eventpersoneel van Helping Hands Agency in Arnhem",
    },
  },
  {
    slug: "festival-crew-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    primaryService: "event-crew",
    path: "/locaties/festival-crew-amsterdam",
    metaTitle: "Festival crew Amsterdam inhuren | Helping Hands Agency",
    metaDescription:
      "Festival crew inhuren in Amsterdam: opbouw, floor en horeca support. Actief in regio Amsterdam vanuit Hilversum.",
    eyebrow: "Festival crew · Amsterdam",
    h1: "Festival crew inhuren in Amsterdam",
    heroDescription:
      "Festival crew voor outdoor events, opbouw en horecasupport in Amsterdam en omgeving.",
    intro: [
      "Amsterdam kent een drukke festivalkalender. Helping Hands Agency levert festival crew voor opbouw, floor support, horeca en logistiek in Amsterdam en de regio. Gevestigd in Hilversum — actief in de Randstad zonder nepfiliaal in de stad.",
      "Wij werken met ploegen, shifts en duidelijke briefing. Tarief op aanvraag. Vraag festival crew aan via contact of planning@helpinghandsagency.nl.",
    ],
    staffTypes: [
      { title: "Festivalmedewerkers", description: "Breed inzetbaar op terrein." },
      { title: "Opbouw / afbouw", description: "Praktische terreincrew." },
      { title: "Floor support", description: "Publieksstromen tijdens showtijd." },
      { title: "Horeca support", description: "Uitserveren en bijvullen op terrein." },
    ],
    applications: [
      "Meerdaagse festivalploegen",
      "Opbouw- en afbouwdagen",
      "Horeca runners op terrein",
      "Outdoor events in de regio",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Actief in regio Amsterdam",
      "Gevestigd in Hilversum",
      "Ervaring met festivaltempo",
      "Eén aanspreekpunt",
    ],
    venues: ["Outdoor festivals", "Parkevents", "Stadionfestivals", "City events"],
    relatedServiceSlugs: ["event-crew", "horeca-personeel", "stagehands"],
    relatedProjectCaseSlugs: ["johan-cruijff-arena-amsterdam", "rai-amsterdam"],
    faqs: locFaqs("Amsterdam", "festival crew"),
    image: {
      src: "/images/crew/concert-globe-stage.webp",
      alt: "Festival crew van Helping Hands Agency in Amsterdam",
    },
  },
  {
    slug: "festival-crew-utrecht",
    city: "Utrecht",
    province: "Utrecht",
    primaryService: "event-crew",
    path: "/locaties/festival-crew-utrecht",
    metaTitle: "Festival crew Utrecht inhuren | Helping Hands Agency",
    metaDescription:
      "Festival crew inhuren in Utrecht: opbouw, floor en horeca. Actief in Midden-Nederland vanuit Hilversum.",
    eyebrow: "Festival crew · Utrecht",
    h1: "Festival crew inhuren in Utrecht",
    heroDescription:
      "Festival crew voor outdoor events en producties in Utrecht en omgeving.",
    intro: [
      "Utrecht ligt centraal voor festivals en outdoor events in Midden-Nederland. Helping Hands Agency levert festival crew voor opbouw, floor support en horeca in Utrecht en omgeving.",
      "Gevestigd in Hilversum, snel ter plaatse in de regio. Geen vestigingsclaim in Utrecht — wel betrouwbare ploegen met briefing. Tarief op aanvraag. Vraag festival crew aan via contact.",
    ],
    staffTypes: [
      { title: "Festivalmedewerkers", description: "Support op terrein." },
      { title: "Opbouwcrew", description: "Inrichting en materiaal." },
      { title: "Floor support", description: "Doorstroom tijdens piek." },
      { title: "Horecasupport", description: "Service op food- en barpunten." },
    ],
    applications: [
      "Outdoor festivals",
      "Campus- en stadsfestivals",
      "Opbouw- en afbouwdagen",
      "Horeca op terrein",
    ],
    process: locProcess,
    whyHelpingHands: [
      "Actief in regio Utrecht",
      "Gevestigd in Hilversum",
      "Centrale ligging Midden-Nederland",
      "Eén aanspreekpunt",
    ],
    venues: ["Outdoor festivals", "Stadsfestivals", "Campus events", "Parklocaties"],
    relatedServiceSlugs: ["event-crew", "horeca-personeel", "stagehands"],
    relatedProjectCaseSlugs: ["rai-amsterdam", "zuiderpark-den-haag"],
    faqs: locFaqs("Utrecht", "festival crew"),
    image: {
      src: "/images/crew/concert-globe-stage.webp",
      alt: "Festival crew van Helping Hands Agency in Utrecht",
    },
  },
];

const locOut = `import type { LocationPage } from "@/data/locations";

/** New /locaties/* SEO pages (no thin duplicates of root SEO URLs). */
export const additionalLocationPages: LocationPage[] = ${JSON.stringify(
  newLocations,
  null,
  2,
)};
`;

fs.writeFileSync(
  path.join(root, "src/data/additionalLocations.ts"),
  locOut,
  "utf8",
);

console.log(
  `Wrote ${newServices.length} services + ${newLocations.length} locations`,
);
