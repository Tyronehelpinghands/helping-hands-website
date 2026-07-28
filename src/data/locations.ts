/**
 * Regional SEO location pages — /locaties + /locaties/[slug].
 *
 * Each entry is unique, city-specific content (no city-name-only template
 * swap). Safe claim language only: "projectervaring", "via productiepartner",
 * "op locatie" — no exclusivity or "beste van Nederland" claims.
 */
import type { ServiceLandingSlug } from "@/lib/services";

export type LocationFaq = {
  question: string;
  answer: string;
};

export type LocationStaffType = {
  title: string;
  description: string;
};

export type LocationProcessStep = {
  title: string;
  description: string;
};

export type LocationPage = {
  slug: string;
  city: string;
  province: string;
  /** Primary service angle reflected in the slug/positioning. */
  primaryService: ServiceLandingSlug;
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  /** Unique intro copy — no city-name-only swap. */
  intro: string[];
  staffTypes: LocationStaffType[];
  applications: string[];
  process: LocationProcessStep[];
  whyHelpingHands: string[];
  /** Example venues / event types in or near this city (illustrative, not exhaustive). */
  venues: string[];
  relatedServiceSlugs: ServiceLandingSlug[];
  relatedProjectCaseSlugs: string[];
  faqs: LocationFaq[];
  image: { src: string; alt: string };
};

export const locationPages: LocationPage[] = [
  {
    slug: "event-crew-amsterdam",
    city: "Amsterdam",
    province: "Noord-Holland",
    primaryService: "event-crew",
    path: "/locaties/event-crew-amsterdam",
    metaTitle: "Event crew Amsterdam inhuren",
    metaDescription:
      "Event crew inhuren in Amsterdam: floor support, runners, check-in en crowd support voor beurzen, arena's en events. Snel schakelen, één aanspreekpunt.",
    eyebrow: "Event crew · Amsterdam",
    h1: "Event crew inhuren in Amsterdam",
    heroDescription:
      "Van beursvloeren tot arenaproducties: wij zetten event crew in op locaties door heel Amsterdam en de regio.",
    intro: [
      "Amsterdam kent een hoge dichtheid aan beurslocaties, arena's en zakelijke evenementen — vaak met korte omsteltijden en veel gelijktijdige bewegingen op de vloer. Helping Hands Agency levert event crew die daarop is voorbereid: mensen die snappen dat publieksstromen, check-in en runnerroutes op elkaar moeten aansluiten.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij grootschalige locaties in en rond Amsterdam. Je deelt datum, locatie, tijden en functies — wij denken mee over de juiste bezetting.",
    ],
    staffTypes: [
      {
        title: "Eventmedewerkers & floor support",
        description:
          "Publieksstromen begeleiden, zones bewaken en het productieteam ontlasten op de vloer.",
      },
      {
        title: "Runners en check-in",
        description:
          "Snelle ontvangst, badge-uitgifte en boodschappen tussen backstage en front-of-house.",
      },
      {
        title: "Hospitality en gastbegeleiding",
        description:
          "Representatieve ontvangst voor VIP-zones, beursstands en zakelijke bezoekers.",
      },
      {
        title: "Logistiek en materiaalondersteuning",
        description:
          "Materiaalstromen, standbouwondersteuning en back-of-house bevoorrading.",
      },
    ],
    applications: [
      "Beursstands en congressen met check-in en hospitality",
      "Arena- en stadionproducties met publieksstromen",
      "Corporate events en productlanceringen",
      "Meerdaagse producties met wisselende ploegen",
    ],
    process: [
      {
        title: "Aanvraag en briefing",
        description: "Datum, locatie, tijden, functies en aantallen delen via contact.",
      },
      {
        title: "Bezetting",
        description: "Wij matchen crew op ervaring en beschikbaarheid in de regio Amsterdam.",
      },
      {
        title: "Uitvoering op locatie",
        description: "Duidelijke taken, kleding/PBM en één aanspreekpunt tijdens de dienst.",
      },
      {
        title: "Terugkoppeling",
        description: "Na afloop houden we contact voor eventuele vervolginzet.",
      },
    ],
    whyHelpingHands: [
      "Eén aanspreekpunt voor planning, briefing en uitvoering",
      "Crew met projectervaring op grootschalige Amsterdamse locaties",
      "Snel schakelen bij wijzigingen of extra bezetting",
      "Landelijk actief vanuit Hilversum — Amsterdam ligt binnen ons kernwerkgebied",
    ],
    venues: [
      "Beurs- en congreslocaties",
      "Arena- en stadionproducties",
      "Corporate eventlocaties",
      "Hotels en zakelijke venues",
    ],
    relatedServiceSlugs: ["event-crew", "hospitality", "logistiek"],
    relatedProjectCaseSlugs: ["johan-cruijff-arena-amsterdam", "rai-amsterdam"],
    faqs: [
      {
        question: "Leveren jullie event crew voor beurzen én arenaproducties in Amsterdam?",
        answer:
          "Ja. We zetten crew in voor beursstands, congressen en grootschalige arenaproducties in en rond Amsterdam — met functies die passen bij het type locatie.",
      },
      {
        question: "Hoe snel kan ik event crew in Amsterdam aanvragen?",
        answer:
          "Deel datum, locatie, tijden, functies en aantallen via het contactformulier. Bij spoed bellen of appen we mee over wat nog haalbaar is op basis van beschikbaarheid.",
      },
      {
        question: "Werken jullie ook buiten Amsterdam-centrum?",
        answer:
          "Ja, we zijn actief in de hele regio Amsterdam en Noord-Holland, van beursvloeren tot buitenlocaties en havengebonden evenementen.",
      },
      {
        question: "Kunnen jullie meerdaagse beurzen of congressen bezetten?",
        answer:
          "Ja. Voor meerdaagse producties plannen we wisselende ploegen en houden we één vast aanspreekpunt aan voor de hele periode.",
      },
      {
        question: "Bieden jullie ook hospitality naast event crew?",
        answer:
          "Ja. Naast floor support en runners leveren we ook hospitality crew voor VIP-zones en zakelijke ontvangst — vaak in combinatie op dezelfde productie.",
      },
    ],
    image: {
      src: "/images/crew/crew-field-01.webp",
      alt: "Event crew van Helping Hands tijdens een productie in Amsterdam",
    },
  },
  {
    slug: "stagehands-utrecht",
    city: "Utrecht",
    province: "Utrecht",
    primaryService: "stagehands",
    path: "/locaties/stagehands-utrecht",
    metaTitle: "Stagehands Utrecht inhuren",
    metaDescription:
      "Stagehands inhuren in Utrecht voor load-in, opbouw en afbouw bij beurzen en producties. Materiaalhandling en sitecrew met projectervaring in de regio.",
    eyebrow: "Stagehands · Utrecht",
    h1: "Stagehands inhuren in Utrecht",
    heroDescription:
      "Utrecht is een centrale beurs- en congresstad — wij leveren stagehands voor load-in, opbouw, materiaalhandling en afbouw op locatie.",
    intro: [
      "Als centraal gelegen beurs- en congresstad kent Utrecht een constante stroom aan op- en afbouwmomenten. Standbouw, decorstukken en materiaal moeten vaak binnen een strak tijdvenster verplaatst worden — daar leveren wij stagehands en sitecrew voor.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan op beursvloeren en bij podiumproducties in Utrecht en de regio Midden-Nederland. We stemmen call-times, PBM en materiaalstromen vooraf af.",
    ],
    staffTypes: [
      {
        title: "Stagehands",
        description: "Load-in, load-out en materiaalhandling voor beursstands en podia.",
      },
      {
        title: "Sitecrew",
        description: "Ondersteuning op de vloer tijdens opbouw, show en afbouw.",
      },
      {
        title: "Laad- en loscrew",
        description: "Trucks lossen, cases rijden en decor klaarzetten binnen tijdslimieten.",
      },
      {
        title: "Materiaalcrew",
        description: "Materiaal tellen, verdelen en werkzones netjes houden tijdens de productie.",
      },
    ],
    applications: [
      "Beursstands met strakke op- en afbouwvensters",
      "Congressen met decor- en standbouw",
      "Podium- en concertproducties in de regio",
      "Nachtelijke load-outs na afloop van shows",
    ],
    process: [
      {
        title: "Planning",
        description: "Call-time, locatie-ingang en laad/losinformatie afstemmen.",
      },
      {
        title: "Bezetting",
        description: "Stagehands en sitecrew matchen op de opdracht en beschikbaarheid.",
      },
      {
        title: "Uitvoering",
        description: "Materiaalhandling volgens briefing, met PBM en veiligheidsafspraken.",
      },
      {
        title: "Afbouw en oplevering",
        description: "Terugladen, opruimen en overdracht aan locatie of opdrachtgever.",
      },
    ],
    whyHelpingHands: [
      "Praktische crew die onder tijdsdruk kan werken",
      "Projectervaring op beursvloeren en bij podiumproducties in Midden-Nederland",
      "Duidelijke afspraken over PBM, werkschoenen en veiligheid",
      "Combinatie met logistiek mogelijk voor grotere producties",
    ],
    venues: [
      "Beurs- en congreslocaties",
      "Podium- en concertproducties",
      "Standbouwprojecten",
      "Evenemententerreinen in de regio",
    ],
    relatedServiceSlugs: ["stagehands", "logistiek", "productie-assistentie"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "rai-amsterdam"],
    faqs: [
      {
        question: "Leveren jullie stagehands voor beurzen in Utrecht?",
        answer:
          "Ja. We zetten stagehands en sitecrew in voor standbouw, load-in en load-out bij beurzen en congressen in Utrecht en de regio.",
      },
      {
        question: "Kunnen jullie ook een nachtelijke load-out bezetten?",
        answer:
          "Ja, dat stemmen we vooraf af qua call-time en veiligheid. Nachtelijke afbouw komt regelmatig voor bij podium- en beursproducties.",
      },
      {
        question: "Werken stagehands ook met zwaarder materiaal of cases?",
        answer:
          "We matchen op de opdracht: van lichte standonderdelen tot flightcases. Bij gecertificeerde taken zoals heftruckwerk stemmen we dat expliciet af.",
      },
      {
        question: "Is Utrecht onderdeel van jullie vaste werkgebied?",
        answer:
          "Ja. Vanuit Hilversum ligt Utrecht binnen ons kernwerkgebied — we kunnen relatief snel schakelen voor aanvragen in de regio.",
      },
      {
        question: "Kunnen jullie stagehands combineren met logistieke crew?",
        answer:
          "Ja, voor grotere producties combineren we vaak stagehands met logistieke ondersteuning. We denken mee over de juiste mix per opdracht.",
      },
    ],
    image: {
      src: "/images/crew/scaffolding-team-wide.webp",
      alt: "Stagehands van Helping Hands tijdens opbouw in Utrecht",
    },
  },
  {
    slug: "horeca-personeel-hilversum",
    city: "Hilversum",
    province: "Noord-Holland",
    primaryService: "horeca-personeel",
    path: "/locaties/horeca-personeel-hilversum",
    metaTitle: "Horeca personeel Hilversum inhuren",
    metaDescription:
      "Horeca personeel inhuren in Hilversum: bediening, runners, barbacks en bartenders voor events en horecalocaties. Vanuit onze thuisbasis snel inzetbaar.",
    eyebrow: "Horeca personeel · Hilversum",
    h1: "Horeca personeel inhuren in Hilversum",
    heroDescription:
      "Hilversum is onze thuisbasis — hier kunnen we het snelst schakelen voor horeca support, bar- en bedieningscrew.",
    intro: [
      "Helping Hands Agency is gevestigd aan het Wandelpad in Hilversum. Dat betekent dat aanvragen in en rond Hilversum vaak het snelst te bezetten zijn: korte reistijden, direct contact en crew die de regio kent.",
      "We leveren horeca support voor events, catering en horecalocaties: uitserveren, afruimen, bijvullen en barondersteuning tijdens piekmomenten of structurele bezetting.",
    ],
    staffTypes: [
      {
        title: "Horeca support",
        description: "Uitserveren, afruimen en bijvullen tijdens drukke diensten en events.",
      },
      {
        title: "Bartenders en barbacks",
        description: "Bar bevoorraden, uitschenken en bar netjes houden bij pieken.",
      },
      {
        title: "Restaurant- en bedieningscrew",
        description: "Service, gastcontact en floor support voor horecalocaties.",
      },
      {
        title: "Keukenondersteuning",
        description: "Keukenhulpen en spoelkeuken voor catering en eventkeukens.",
      },
    ],
    applications: [
      "Horecalocaties met piekuren of tijdelijke bezetting",
      "Bedrijfsevents en recepties in de regio Gooi en Vechtstreek",
      "Catering en banqueting bij lokale locaties",
      "Pop-up bars en tijdelijke horecapunten",
    ],
    process: [
      {
        title: "Aanvraag",
        description: "Datum, locatie, shifts en gewenste functies doorgeven.",
      },
      {
        title: "Snelle afstemming",
        description: "Door onze vestiging in Hilversum vaak kort contact en snelle terugkoppeling.",
      },
      {
        title: "Briefing",
        description: "Kleding, hygiëneregels en taken helder vooraf.",
      },
      {
        title: "Inzet en nazorg",
        description: "Crew op locatie, met aanspreekpunt tijdens en na de dienst.",
      },
    ],
    whyHelpingHands: [
      "Thuisbasis in Hilversum — korte lijnen en snelle beschikbaarheid",
      "Ervaring in horeca, events en catering in de regio Gooi en Vechtstreek",
      "Flexibele inzet: los, terugkerend of structureel",
      "Persoonlijk contact met planning (Mesbah) voor snelle afstemming",
    ],
    venues: [
      "Horecalocaties en restaurants",
      "Bedrijfsevents en recepties",
      "Catering en banqueting",
      "Pop-up bars en tijdelijke horecapunten",
    ],
    relatedServiceSlugs: ["horeca-personeel", "barpersoneel", "restaurant-personeel"],
    relatedProjectCaseSlugs: ["rai-amsterdam", "zuiderpark-den-haag"],
    faqs: [
      {
        question: "Waarom is Hilversum jullie snelste inzetgebied?",
        answer:
          "Helping Hands Agency is gevestigd in Hilversum (Wandelpad 30). Aanvragen in de directe omgeving zijn daardoor vaak sneller te bezetten en te briefen.",
      },
      {
        question: "Leveren jullie ook structurele horeca-ondersteuning, niet alleen events?",
        answer:
          "Ja. Naast eventgerichte inzet ondersteunen we ook horecalocaties die structureel of terugkerend extra handen nodig hebben.",
      },
      {
        question: "Kunnen jullie op korte termijn horecapersoneel leveren in Hilversum?",
        answer:
          "We proberen dat zo goed mogelijk te faciliteren dankzij onze lokale aanwezigheid. Bel of app bij spoed, dan kijken we direct naar beschikbaarheid.",
      },
      {
        question: "Werken jullie ook in de bredere regio Gooi en Vechtstreek?",
        answer:
          "Ja, naast Hilversum zelf zijn we actief in de bredere regio Gooi en Vechtstreek en landelijk door heel Nederland.",
      },
      {
        question: "Kan ik bartenders en bedieningscrew tegelijk aanvragen?",
        answer:
          "Ja. Vermeld beide functies en aantallen in één aanvraag — wij stemmen de bezetting en briefing op elkaar af.",
      },
    ],
    image: {
      src: "/images/crew/crew-woman-branded.webp",
      alt: "Horeca crewlid van Helping Hands in Hilversum",
    },
  },
  {
    slug: "festival-crew-rotterdam",
    city: "Rotterdam",
    province: "Zuid-Holland",
    primaryService: "event-crew",
    path: "/locaties/festival-crew-rotterdam",
    metaTitle: "Festival crew Rotterdam inhuren",
    metaDescription:
      "Festival crew inhuren in Rotterdam: eventmedewerkers, stagehands en horeca support voor festivals en grote locaties zoals Rotterdam Ahoy.",
    eyebrow: "Festival crew · Rotterdam",
    h1: "Festival crew inhuren in Rotterdam",
    heroDescription:
      "Van haventerrein tot grote evenementenhallen: wij leveren festival crew voor producties in en rond Rotterdam.",
    intro: [
      "Rotterdam combineert grootschalige evenementenlocaties met buitenterreinen en havengebonden ruimtes. Festivalproducties hier vragen om crew die met publieksstromen, opbouw én afbouw kan schakelen — vaak allemaal binnen dezelfde productie.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan op locaties in Rotterdam, waaronder grootschalige evenementenhallen. We bezetten op functie: van floor support tot stagehands en horeca.",
    ],
    staffTypes: [
      {
        title: "Eventmedewerkers en floor support",
        description: "Publieksstromen begeleiden en het productieteam ondersteunen op het terrein.",
      },
      {
        title: "Stagehands en sitecrew",
        description: "Opbouw, afbouw en materiaalhandling op festivalterreinen.",
      },
      {
        title: "Horeca en barcrew",
        description: "Bar- en horecaondersteuning tijdens festivaldagen.",
      },
      {
        title: "Logistiek medewerkers",
        description: "Materiaalstromen en back-of-house ondersteuning op grote terreinen.",
      },
    ],
    applications: [
      "Festivals op buitenterreinen en havengebonden locaties",
      "Producties in grootschalige evenementenhallen",
      "Meerdaagse festivals met wisselende diensten",
      "Op- en afbouwmomenten rond festivaldagen",
    ],
    process: [
      {
        title: "Aanvraag",
        description: "Datum, terrein, zones, functies en aantallen delen.",
      },
      {
        title: "Bezetting per zone",
        description: "Crew indelen op functie: floor, bar, stagehands of logistiek.",
      },
      {
        title: "Briefing op locatie",
        description: "Verzamelpunt, kleding/PBM en taken per zone doornemen.",
      },
      {
        title: "Op- en afbouw",
        description: "Bezetting voor zowel opbouwdagen als het festival zelf.",
      },
    ],
    whyHelpingHands: [
      "Ervaring met grootschalige terreinen en meerdaagse producties",
      "Eén aanspreekpunt voor alle zones en functies",
      "Flexibel op te schalen bij wisselende publieksaantallen",
      "Projectervaring op locaties in Rotterdam en de regio Rijnmond",
    ],
    venues: [
      "Grootschalige evenementenhallen",
      "Buitenterreinen en havengebonden locaties",
      "Festivalterreinen in de regio Rijnmond",
      "Concert- en showproducties",
    ],
    relatedServiceSlugs: ["event-crew", "stagehands", "horeca-personeel"],
    relatedProjectCaseSlugs: ["zuiderpark-den-haag", "scheveningen"],
    faqs: [
      {
        question: "Leveren jullie crew voor meerdaagse festivals in Rotterdam?",
        answer:
          "Ja. We plannen wisselende ploegen voor meerdaagse festivals, inclusief op- en afbouwdagen rond het evenement zelf.",
      },
      {
        question: "Kunnen jullie meerdere functies tegelijk bezetten op één festival?",
        answer:
          "Ja. Denk aan een combinatie van floor support, stagehands, bar en logistiek binnen dezelfde productie — we stemmen dit per zone af.",
      },
      {
        question: "Werken jullie ook op havengebonden of buitenlocaties?",
        answer:
          "Ja, we hebben ervaring met buitenterreinen en havengebonden evenementenlocaties in de regio Rotterdam.",
      },
      {
        question: "Hoe snel kan ik festival crew in Rotterdam aanvragen?",
        answer:
          "Deel datum, terrein, functies en aantallen via contact. Bij spoed bellen of appen we mee over wat nog haalbaar is.",
      },
      {
        question: "Bieden jullie ook horeca- of barondersteuning naast crowd support?",
        answer:
          "Ja. Naast eventcrew en stagehands leveren we ook horeca- en barcrew voor festivaldagen — vaak binnen dezelfde aanvraag.",
      },
    ],
    image: {
      src: "/images/crew/festival-build-site.webp",
      alt: "Festival crew van Helping Hands tijdens opbouw in Rotterdam",
    },
  },
  {
    slug: "eventpersoneel-den-haag",
    city: "Den Haag",
    province: "Zuid-Holland",
    primaryService: "event-crew",
    path: "/locaties/eventpersoneel-den-haag",
    metaTitle: "Eventpersoneel Den Haag inhuren",
    metaDescription:
      "Eventpersoneel inhuren in Den Haag: hospitality, eventmedewerkers en horeca support voor evenementen op locaties zoals Zuiderpark en de kust.",
    eyebrow: "Eventpersoneel · Den Haag",
    h1: "Eventpersoneel inhuren in Den Haag",
    heroDescription:
      "Van stadsparken tot de kust: wij leveren eventpersoneel voor producties in en rond Den Haag.",
    intro: [
      "Den Haag combineert stedelijke evenementenlocaties, parken en kustlocaties binnen relatief korte afstand van elkaar. Dat vraagt om crew die zich kan aanpassen aan verschillende type terreinen — van een stadspark tot een strandlocatie.",
      "Wij leveren eventpersoneel voor producties in en rond Den Haag: representatieve hospitality voor ontvangst, praktische eventmedewerkers voor de vloer, en horeca support waar dat nodig is.",
    ],
    staffTypes: [
      {
        title: "Eventmedewerkers",
        description: "Publieksstromen, netheid en praktische ondersteuning op locatie.",
      },
      {
        title: "Hospitality crew",
        description: "Ontvangst, guest support en VIP-begeleiding bij events.",
      },
      {
        title: "Horeca en barcrew",
        description: "Horecaondersteuning bij buitenevents, strandlocaties en festivals.",
      },
      {
        title: "Crowd support",
        description: "Publieksbegeleiding en doorstroom bij entrees en drukke zones.",
      },
    ],
    applications: [
      "Stadsevents en producties in parken",
      "Kustlocaties en strandevenementen",
      "Corporate events en internationale bijeenkomsten",
      "Meerdaagse buitenevents met horeca en hospitality",
    ],
    process: [
      {
        title: "Aanvraag",
        description: "Datum, locatietype, functies en aantallen doorgeven.",
      },
      {
        title: "Bezetting op terrein",
        description: "Crew afstemmen op het type locatie: park, kust of stedelijk terrein.",
      },
      {
        title: "Briefing",
        description: "Kleding, taken en verzamelpunt per zone bespreken.",
      },
      {
        title: "Uitvoering en nazorg",
        description: "Vast aanspreekpunt tijdens het event en terugkoppeling achteraf.",
      },
    ],
    whyHelpingHands: [
      "Ervaring met uiteenlopende terreintypes: park, kust en stedelijk",
      "Representatieve hospitality gecombineerd met praktische eventcrew",
      "Eén aanspreekpunt voor de hele bezetting",
      "Landelijk actief, met regelmatige inzet in de regio Haaglanden",
    ],
    venues: [
      "Stadsparken en evenemententerreinen",
      "Kust- en strandlocaties",
      "Congres- en corporate locaties",
      "Buitenevents en festivals in de regio Haaglanden",
    ],
    relatedServiceSlugs: ["event-crew", "hospitality", "horeca-personeel"],
    relatedProjectCaseSlugs: ["zuiderpark-den-haag", "scheveningen"],
    faqs: [
      {
        question: "Leveren jullie eventpersoneel voor zowel parken als kustlocaties in Den Haag?",
        answer:
          "Ja. We hebben ervaring met verschillende terreintypes in en rond Den Haag, van stadsparken zoals Zuiderpark tot kustlocaties zoals Scheveningen.",
      },
      {
        question: "Kunnen jullie hospitality en eventcrew combineren op één productie?",
        answer:
          "Ja. Veel producties vragen om een mix — representatieve ontvangst én praktische ondersteuning op de vloer. We stemmen de verdeling vooraf af.",
      },
      {
        question: "Werken jullie ook bij internationale of corporate events in Den Haag?",
        answer:
          "Ja, we zetten crew in bij corporate events en bijeenkomsten in de regio, met aandacht voor representatie en briefing vooraf.",
      },
      {
        question: "Is horeca support ook mogelijk bij buitenevents aan de kust?",
        answer:
          "Ja. Voor strand- en buitenlocaties leveren we horeca- en barcrew naast eventmedewerkers, afgestemd op de weersomstandigheden en het terrein.",
      },
      {
        question: "Hoe vraag ik eventpersoneel aan voor een productie in Den Haag?",
        answer:
          "Deel datum, locatie, tijden, functies en aantallen via contact. Bij spoed bellen of appen we mee over de mogelijkheden.",
      },
    ],
    image: {
      src: "/images/crew/crew-field-05.webp",
      alt: "Eventpersoneel van Helping Hands tijdens een productie in Den Haag",
    },
  },
  {
    slug: "stagehands-arnhem",
    city: "Arnhem",
    province: "Gelderland",
    primaryService: "stagehands",
    path: "/locaties/stagehands-arnhem",
    metaTitle: "Stagehands Arnhem inhuren",
    metaDescription:
      "Stagehands inhuren in Arnhem voor load-in, opbouw en afbouw bij stadion- en concertproducties zoals GelreDome. Materiaalhandling en sitecrew.",
    eyebrow: "Stagehands · Arnhem",
    h1: "Stagehands inhuren in Arnhem",
    heroDescription:
      "Voor stadion- en concertproducties in Arnhem leveren wij stagehands en sitecrew met oog voor tempo en veiligheid.",
    intro: [
      "Arnhem herbergt met GelreDome een van de grotere stadionlocaties van Nederland, waar naast sportwedstrijden ook concerten en evenementen plaatsvinden. Dat soort producties vraagt om stagehands die snel en veilig grote hoeveelheden materiaal kunnen verplaatsen.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij stadionlocaties zoals GelreDome. We leveren stagehands voor load-in, opbouw, materiaalhandling en afbouw.",
    ],
    staffTypes: [
      {
        title: "Stagehands",
        description: "Load-in, load-out en materiaalhandling bij stadion- en concertproducties.",
      },
      {
        title: "Sitecrew",
        description: "Ondersteuning op het terrein tijdens opbouw, show en afbouw.",
      },
      {
        title: "Laad- en loscrew",
        description: "Trucks lossen en materiaal klaarzetten binnen strakke tijdsvensters.",
      },
      {
        title: "Logistiek medewerkers",
        description: "Materiaalstromen en back-of-house ondersteuning op grote locaties.",
      },
    ],
    applications: [
      "Concert- en showproducties in stadions",
      "Sportevenementen met bijkomende crewbehoefte",
      "Grootschalige op- en afbouwmomenten",
      "Nachtelijke load-outs na afloop van shows",
    ],
    process: [
      {
        title: "Planning",
        description: "Call-time, ingang en laad-/losinformatie vooraf afstemmen.",
      },
      {
        title: "Bezetting",
        description: "Stagehands matchen op de schaal en aard van de productie.",
      },
      {
        title: "Uitvoering",
        description: "Materiaalhandling volgens briefing, met PBM en veiligheidsafspraken.",
      },
      {
        title: "Afbouw",
        description: "Terugladen en oplevering van het terrein na afloop.",
      },
    ],
    whyHelpingHands: [
      "Projectervaring bij stadionlocaties zoals GelreDome",
      "Crew die onder tijdsdruk veilig en gestructureerd werkt",
      "Duidelijke afspraken over PBM en werkschoenen",
      "Schaalbaar van kleine crews tot grotere producties",
    ],
    venues: [
      "Stadionlocaties",
      "Concert- en showproducties",
      "Sportevenementen",
      "Grootschalige op- en afbouwprojecten",
    ],
    relatedServiceSlugs: ["stagehands", "logistiek", "event-crew"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "johan-cruijff-arena-amsterdam"],
    faqs: [
      {
        question: "Hebben jullie ervaring met stadionlocaties zoals GelreDome?",
        answer:
          "Ja. Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij stadionlocaties, waaronder GelreDome in Arnhem.",
      },
      {
        question: "Leveren jullie ook crew voor sportevenementen, niet alleen concerten?",
        answer:
          "Ja. Naast concert- en showproducties zetten we ook crew in bij sportevenementen die extra praktische ondersteuning nodig hebben.",
      },
      {
        question: "Kunnen jullie een grote load-in binnen een strak tijdvenster bezetten?",
        answer:
          "Dat stemmen we vooraf af qua aantallen en call-time. Bij grotere producties combineren we vaak stagehands met logistieke crew.",
      },
      {
        question: "Werken stagehands ook aan afbouw na afloop van de show?",
        answer:
          "Ja. We leveren zowel load-in als load-out crew, inclusief nachtelijke afbouwmomenten wanneer dat nodig is.",
      },
      {
        question: "Is Arnhem onderdeel van jullie landelijke werkgebied?",
        answer:
          "Ja. Vanuit Hilversum zetten we crew in door heel Nederland, inclusief Arnhem en de bredere regio Gelderland.",
      },
    ],
    image: {
      src: "/images/crew/stadium-flightcase-push.webp",
      alt: "Stagehands van Helping Hands tijdens load-in in Arnhem",
    },
  },
  {
    slug: "horecapersoneel-amersfoort",
    city: "Amersfoort",
    province: "Utrecht",
    primaryService: "horeca-personeel",
    path: "/locaties/horecapersoneel-amersfoort",
    metaTitle: "Horecapersoneel Amersfoort inhuren",
    metaDescription:
      "Horecapersoneel inhuren in Amersfoort voor foodfestivals, events en horecalocaties. Bediening, bar en keukenondersteuning met projectervaring in de regio.",
    eyebrow: "Horecapersoneel · Amersfoort",
    h1: "Horecapersoneel inhuren in Amersfoort",
    heroDescription:
      "Van foodfestivals tot horecalocaties: wij leveren horecapersoneel in Amersfoort en de regio Eemland.",
    intro: [
      "Amersfoort kent naast horecalocaties ook terugkerende foodevents waar horecacrew op hoog tempo moet uitserveren, bijvullen en bar bijhouden. Dat vraagt om personeel dat drukte gewend is en zelfstandig kan schakelen.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij foodfestivals en horecalocaties in Amersfoort en de regio Eemland. We bezetten op functie: bediening, bar of keuken.",
    ],
    staffTypes: [
      {
        title: "Horeca support",
        description: "Uitserveren, afruimen en bijvullen tijdens foodevents en horecapieken.",
      },
      {
        title: "Bartenders en barbacks",
        description: "Bar bevoorraden en uitschenken tijdens drukke diensten.",
      },
      {
        title: "Keukenhulpen",
        description: "Mise-en-place en ondersteuning in eventkeukens en cateringpunten.",
      },
      {
        title: "Runners bediening",
        description: "Snelle ondersteuning tussen keuken, bar en vloer.",
      },
    ],
    applications: [
      "Foodfestivals en culinaire evenementen",
      "Horecalocaties met piekuren of tijdelijke bezetting",
      "Catering en banqueting in de regio",
      "Pop-up horecapunten bij lokale events",
    ],
    process: [
      {
        title: "Aanvraag",
        description: "Datum, locatie, shifts en gewenste functies delen.",
      },
      {
        title: "Bezetting",
        description: "Horecacrew matchen op ervaring met hoog tempo en drukte.",
      },
      {
        title: "Briefing",
        description: "Kleding, hygiëneregels en taken vooraf afstemmen.",
      },
      {
        title: "Inzet",
        description: "Crew op locatie met aanspreekpunt tijdens de dienst.",
      },
    ],
    whyHelpingHands: [
      "Projectervaring bij foodfestivals en horecalocaties in de regio Eemland",
      "Crew gewend aan hoog tempo en publieksdrukte",
      "Flexibele inzet: eenmalig, terugkerend of structureel",
      "Snel schakelen bij extra bezetting tijdens piekmomenten",
    ],
    venues: [
      "Foodfestivals en culinaire evenementen",
      "Horecalocaties en restaurants",
      "Catering en banqueting",
      "Pop-up horecapunten",
    ],
    relatedServiceSlugs: ["horeca-personeel", "keukenpersoneel", "barpersoneel"],
    relatedProjectCaseSlugs: ["rai-amsterdam", "zuiderpark-den-haag"],
    faqs: [
      {
        question: "Leveren jullie horecapersoneel voor foodfestivals in Amersfoort?",
        answer:
          "Ja. Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij foodfestivals en culinaire evenementen in Amersfoort.",
      },
      {
        question: "Kunnen jullie ook keukenondersteuning leveren, niet alleen bediening?",
        answer:
          "Ja. Naast bediening en bar leveren we ook keukenhulpen voor mise-en-place en ondersteuning tijdens eventcatering.",
      },
      {
        question: "Werken jullie ook bij vaste horecalocaties, niet alleen events?",
        answer:
          "Ja. We ondersteunen ook horecalocaties in Amersfoort die tijdelijk of structureel extra handen nodig hebben tijdens pieken.",
      },
      {
        question: "Hoe snel kan ik horecapersoneel in Amersfoort aanvragen?",
        answer:
          "Deel datum, locatie, shifts en functies via contact. Bij spoed bellen of appen we mee over wat nog haalbaar is.",
      },
      {
        question: "Leveren jullie ook personeel voor meerdaagse evenementen?",
        answer:
          "Ja, voor meerdaagse foodfestivals en events plannen we wisselende ploegen met één vast aanspreekpunt voor de hele periode.",
      },
    ],
    image: {
      src: "/images/crew/chef-fryer.webp",
      alt: "Horecacrew van Helping Hands tijdens een foodevent in Amersfoort",
    },
  },
  {
    slug: "productiecrew-eindhoven",
    city: "Eindhoven",
    province: "Noord-Brabant",
    primaryService: "productie-assistentie",
    path: "/locaties/productiecrew-eindhoven",
    metaTitle: "Productiecrew Eindhoven inhuren",
    metaDescription:
      "Productiecrew inhuren in Eindhoven: runners, backstage support en logistieke ondersteuning voor live producties, corporate events en showcases.",
    eyebrow: "Productiecrew · Eindhoven",
    h1: "Productiecrew inhuren in Eindhoven",
    heroDescription:
      "Voor producties, showcases en corporate events in Eindhoven leveren wij runners en praktische productie-assistentie.",
    intro: [
      "Eindhoven is een stad met veel technologie- en designgerelateerde events, corporate showcases en producties waar strakke planning en discrete ondersteuning achter de schermen belangrijk zijn. Wij leveren productie-assistenten en runners die daarop zijn voorbereid.",
      "Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij live producties en corporate events in Eindhoven en de regio Brainport. We ondersteunen het productieteam zonder dat het opvalt.",
    ],
    staffTypes: [
      {
        title: "Productie-assistenten",
        description: "Ondersteuning voor producers en projectleiders op locatie.",
      },
      {
        title: "Runners",
        description: "Snelle praktische taken tussen productiekantoor, backstage en vloer.",
      },
      {
        title: "Backstage support",
        description: "Ruimtes klaarzetten en routing ondersteunen tijdens shows en showcases.",
      },
      {
        title: "Logistiek medewerkers",
        description: "Materiaalstromen en leveringen begeleiden op locatie.",
      },
    ],
    applications: [
      "Corporate showcases en productlanceringen",
      "Technologie- en designevenementen",
      "Live producties met strakke planning",
      "Beursvloeren en congressen in de regio Brainport",
    ],
    process: [
      {
        title: "Aanvraag",
        description: "Datum, locatie, rol en aantallen doorgeven.",
      },
      {
        title: "Bezetting",
        description: "Productie-assistenten en runners matchen op de productie.",
      },
      {
        title: "Briefing",
        description: "Call-sheet, communicatie en verzamelpunt vooraf afstemmen.",
      },
      {
        title: "Uitvoering",
        description: "Discrete ondersteuning met korte lijnen naar het productieteam.",
      },
    ],
    whyHelpingHands: [
      "Ervaring met corporate en technologiegerichte producties",
      "Discrete, praktische ondersteuning achter de schermen",
      "Eén aanspreekpunt voor planning en escalatie",
      "Landelijk actief, met regelmatige inzet in de regio Brainport",
    ],
    venues: [
      "Corporate showcases en productlanceringen",
      "Technologie- en designevents",
      "Beurs- en congreslocaties",
      "Live producties en shows",
    ],
    relatedServiceSlugs: ["productie-assistentie", "logistiek", "event-crew"],
    relatedProjectCaseSlugs: ["gelredome-arnhem", "johan-cruijff-arena-amsterdam"],
    faqs: [
      {
        question: "Leveren jullie productiecrew voor corporate showcases in Eindhoven?",
        answer:
          "Ja. Onze crew heeft via opdrachten, partners en producties projectervaring opgedaan bij corporate events en live producties in Eindhoven.",
      },
      {
        question: "Wat doet een productie-assistent precies?",
        answer:
          "Praktische support voor het productieteam: taken uitzetten, crew ontvangen, briefings doorgeven en backstage rondes — altijd onder regie van de opdrachtgever.",
      },
      {
        question: "Kunnen runners ook ritten rijden tussen locaties?",
        answer:
          "Dat stemmen we vooraf af op basis van rijbewijs, voertuig en verzekering. Niet elke runneropdracht vraagt om rijden.",
      },
      {
        question: "Werken jullie ook bij technologie- of designevenementen?",
        answer:
          "Ja, we hebben ervaring met dat type events in de regio Brainport, waar discretie en strakke planning belangrijk zijn.",
      },
      {
        question: "Is Eindhoven onderdeel van jullie landelijke dekking?",
        answer:
          "Ja. Vanuit Hilversum zetten we crew in door heel Nederland, inclusief Eindhoven en de bredere regio Noord-Brabant.",
      },
    ],
    image: {
      src: "/images/crew/forklift-operator.webp",
      alt: "Productiecrew van Helping Hands tijdens een productie in Eindhoven",
    },
  },
];

export function getAllLocations(): LocationPage[] {
  return locationPages;
}

export function getLocationBySlug(slug: string): LocationPage | undefined {
  return locationPages.find((location) => location.slug === slug);
}

export function getRelatedLocations(
  slug: string,
  limit = 3,
): LocationPage[] {
  return locationPages.filter((location) => location.slug !== slug).slice(0, limit);
}

/** Location pages relevant to a given service landing — for "Beschikbaar in onder andere" blocks. */
export function getLocationsForService(
  serviceSlug: ServiceLandingSlug,
  limit = 6,
): LocationPage[] {
  const primary = locationPages.filter(
    (location) => location.primaryService === serviceSlug,
  );
  const secondary = locationPages.filter(
    (location) =>
      location.primaryService !== serviceSlug &&
      location.relatedServiceSlugs.includes(serviceSlug),
  );
  return [...primary, ...secondary].slice(0, limit);
}
