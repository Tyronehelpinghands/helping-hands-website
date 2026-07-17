import type { ServiceIconKey } from "@/lib/service-icons";

export type HomeServiceCategory =
  | "Event"
  | "Horeca"
  | "Restaurant"
  | "Keuken"
  | "Bar"
  | "Stagebouw"
  | "Productie"
  | "Logistiek"
  | "Hospitality";

export type HomeServiceFilter = "Alle" | HomeServiceCategory;

export type HomeService = {
  id: string;
  title: string;
  category: HomeServiceCategory;
  shortDescription: string;
  description: string;
  tasks: string[];
  idealFor: string[];
  icon: ServiceIconKey;
  featured?: boolean;
  ctaLabel?: string;
};

export const homeServiceFilters: HomeServiceFilter[] = [
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
];

export const homeServices: HomeService[] = [
  // Event
  {
    id: "eventmedewerkers",
    title: "Eventmedewerkers",
    category: "Event",
    shortDescription:
      "Flexibele crew voor events, publieksstromen en praktische ondersteuning op locatie.",
    description:
      "Eventmedewerkers zorgen voor doorstroom, netheid en praktische ondersteuning tijdens evenementen. Zij schakelen snel bij wijzigingen en ontlasten het productieteam op de vloer.",
    tasks: [
      "Gasten begeleiden",
      "Doorstroom ondersteunen",
      "Locatie netjes houden",
      "Productieteam helpen",
      "Praktische vragen oplossen",
    ],
    idealFor: ["Festivals", "Concerten", "Beurzen", "Corporate events"],
    icon: "event-crew",
    featured: true,
  },
  {
    id: "event-floor-support",
    title: "Floor support",
    category: "Event",
    shortDescription:
      "Praktische ondersteuning op de vloer tijdens events en producties.",
    description:
      "Floor support houdt overzicht op de vloer, helpt bij gastenstromen en lost ad-hoc problemen op. Een zichtbaar aanspreekpunt voor crew en organisatoren.",
    tasks: [
      "Gastenstromen ondersteunen",
      "Materiaal op locatie verplaatsen",
      "Productieteam ontlasten",
      "Ad-hoc problemen oplossen",
      "Zichtbaar aanspreekpunt zijn",
    ],
    idealFor: ["Beurzen", "Publieksevents", "Horecaproducties", "Corporate events"],
    icon: "event-crew",
  },
  {
    id: "crowd-support",
    title: "Crowd support",
    category: "Event",
    shortDescription:
      "Ondersteuning bij doorstroom, wachtrijen en publieksbegeleiding.",
    description:
      "Crowd support begeleidt bezoekers veilig en duidelijk door de locatie. Ideaal bij piekmomenten, entrees en drukke zones.",
    tasks: [
      "Wachtrijen begeleiden",
      "Doorstroom bewaken",
      "Zones vrijhouden",
      "Instructies doorgeven",
      "Snel schakelen bij wijzigingen",
    ],
    idealFor: ["Festivals", "Stadions", "Concerten", "Grote publieksevents"],
    icon: "event-crew",
  },
  {
    id: "event-hospitality-crew",
    title: "Hospitality crew",
    category: "Event",
    shortDescription:
      "Representatieve crew voor ontvangst, hospitality en gastbegeleiding.",
    description:
      "Hospitality crew ontvangt gasten, begeleidt VIP-zones en zorgt voor een soepele ervaring vanaf aankomst tot vertrek.",
    tasks: [
      "Gasten ontvangen",
      "VIP zones ondersteunen",
      "Doorverwijzen",
      "Vragen beantwoorden",
      "Representatief aanspreekpunt zijn",
    ],
    idealFor: ["VIP areas", "Corporate events", "Festivals", "Concerten"],
    icon: "hospitality",
  },
  {
    id: "check-in-ontvangst",
    title: "Check-in / ontvangst",
    category: "Event",
    shortDescription:
      "Snelle en duidelijke ontvangst bij entrees, registratie en check-in.",
    description:
      "Check-in crew zorgt voor een soepele start van het event: registratie, ticketcontrole, badge-uitgifte en heldere routing.",
    tasks: [
      "Gasten checken",
      "Badges of tickets controleren",
      "Registratie ondersteunen",
      "Routing aangeven",
      "Wachtrijen begeleiden",
    ],
    idealFor: ["Beurzen", "Congressen", "Corporate events", "Festivals"],
    icon: "event-crew",
  },
  {
    id: "event-runners",
    title: "Runners",
    category: "Event",
    shortDescription:
      "Flexibele runners voor snelle praktische taken op locatie.",
    description:
      "Runners ondersteunen productie, hospitality en crew met snelle klussen: materiaal ophalen, boodschappen, spoedritten en ad-hoc hulp.",
    tasks: [
      "Materialen ophalen",
      "Crew ondersteunen",
      "Boodschappen en ritten",
      "Productiekantoor helpen",
      "Kleine spoedklussen oplossen",
    ],
    idealFor: [
      "Productiekantoren",
      "Backstage",
      "Events met veel wisselingen",
      "Last-minute ondersteuning",
    ],
    icon: "productie-assistentie",
    featured: true,
  },

  // Horeca
  {
    id: "horeca-support",
    title: "Horeca support",
    category: "Horeca",
    shortDescription:
      "Extra handen voor drukke horeca- en eventdiensten.",
    description:
      "Horeca support helpt bij uitserveren, afruimen, bijvullen en algemene ondersteuning tijdens piekmomenten in horeca en events.",
    tasks: [
      "Uitserveren",
      "Tafels afruimen",
      "Bijvullen",
      "Gasten helpen",
      "Bar en keuken ondersteunen",
    ],
    idealFor: ["Events", "Festivals", "Restaurants", "Banqueting"],
    icon: "horeca-support",
    featured: true,
  },
  {
    id: "runners-bediening",
    title: "Runners bediening",
    category: "Horeca",
    shortDescription:
      "Snelle ondersteuning tussen keuken, bar en vloer.",
    description:
      "Runners bediening houden de service soepel door gerechten, dranken en voorraden snel te verplaatsen tussen keuken, bar en vloer.",
    tasks: [
      "Dranken en gerechten lopen",
      "Tafels bijhouden",
      "Voorraad aanvullen",
      "Bediening ontlasten",
      "Mise-en-place helpen",
    ],
    idealFor: ["Restaurants", "Strandtenten", "Grote diners", "Horeca events"],
    icon: "horeca-support",
  },
  {
    id: "horeca-barbacks",
    title: "Barbacks",
    category: "Horeca",
    shortDescription:
      "Ondersteuning achter de bar zodat bartenders kunnen blijven draaien.",
    description:
      "Barbacks houden de bar bevoorraad, schoon en operationeel. Zo blijft de bartender focussen op uitschenken en gasten.",
    tasks: [
      "Glaswerk aanvullen",
      "Drankvoorraad aanvullen",
      "IJs bijvullen",
      "Bar schoonhouden",
      "Lege kratten wegbrengen",
    ],
    idealFor: ["Festivals", "Clubs", "Bars", "Eventlocaties"],
    icon: "bar",
    featured: true,
  },
  {
    id: "horeca-bartenders",
    title: "Bartenders",
    category: "Horeca",
    shortDescription:
      "Barpersoneel voor events, horeca en producties.",
    description:
      "Bartenders werken volgens briefing, houden de bar netjes en zorgen voor snelle, nette uitgifte van dranken tijdens drukke diensten.",
    tasks: [
      "Dranken uitschenken",
      "Bar netjes houden",
      "Gasten helpen",
      "Voorraad bijhouden",
      "Werken volgens briefing",
    ],
    idealFor: ["Bars", "Festivals", "Bedrijfsfeesten", "Horeca events"],
    icon: "bar",
  },

  // Restaurant
  {
    id: "bedieningsmedewerkers",
    title: "Bedieningsmedewerkers",
    category: "Restaurant",
    shortDescription:
      "Representatieve medewerkers voor bediening en gastcontact.",
    description:
      "Bedieningsmedewerkers zorgen voor een soepele service: ontvangen, bestellingen, uitserveren en afruimen tijdens drukke diensten.",
    tasks: [
      "Gasten ontvangen",
      "Bestellingen opnemen",
      "Uitserveren",
      "Tafels afruimen",
      "Service ondersteunen",
    ],
    idealFor: ["Restaurants", "Hotels", "Strandtenten", "Banqueting"],
    icon: "restaurant",
  },
  {
    id: "hosts-gastheer",
    title: "Hosts / gastheer / gastvrouw",
    category: "Restaurant",
    shortDescription:
      "Professionele ontvangst en begeleiding van gasten.",
    description:
      "Hosts zijn het eerste aanspreekpunt: welkom heten, reserveringen begeleiden, wachtrijen managen en gasten netjes doorverwijzen.",
    tasks: [
      "Gasten welkom heten",
      "Reserveringen begeleiden",
      "Doorverwijzen",
      "Wachtrijen begeleiden",
      "Eerste aanspreekpunt zijn",
    ],
    idealFor: ["Restaurants", "Events", "VIP ontvangsten", "Bedrijfsdiners"],
    icon: "hospitality",
  },
  {
    id: "floor-support-restaurant",
    title: "Floor support restaurant",
    category: "Restaurant",
    shortDescription:
      "Ondersteuning op de vloer tijdens piekdrukte.",
    description:
      "Floor support in restaurants helpt bij piekmomenten: tafels klaarzetten, runners, begeleiding en netheid op de vloer.",
    tasks: [
      "Tafels klaarzetten",
      "Gasten begeleiden",
      "Bediening ondersteunen",
      "Runner taken uitvoeren",
      "Netheid bewaken",
    ],
    idealFor: ["Piekmomenten", "Zomerdrukte", "Grote groepen", "Spoedbezetting"],
    icon: "restaurant",
  },
  {
    id: "restaurant-runners",
    title: "Restaurant runners",
    category: "Restaurant",
    shortDescription:
      "Snelle ondersteuning tussen keuken, bar en bediening.",
    description:
      "Restaurant runners houden de service draaiend door gerechten, glaswerk en voorraden snel te verplaatsen tijdens drukte.",
    tasks: [
      "Gerechten lopen",
      "Glaswerk aanvullen",
      "Voorraad bijvullen",
      "Bediening ontlasten",
      "Mise-en-place helpen",
    ],
    idealFor: ["Restaurants", "Banqueting", "Strandtenten", "Events"],
    icon: "horeca-support",
  },

  // Keuken
  {
    id: "keukenhulpen",
    title: "Keukenhulpen",
    category: "Keuken",
    shortDescription:
      "Extra ondersteuning in de keuken voor voorbereiding en service.",
    description:
      "Keukenhulpen ondersteunen koks met mise-en-place, snijwerk, voorraad en schoonhouden van de werkplek tijdens drukke diensten.",
    tasks: [
      "Mise-en-place",
      "Snijwerk",
      "Voorraad aanvullen",
      "Schoonhouden werkplek",
      "Koks ondersteunen",
    ],
    idealFor: ["Restaurants", "Catering", "Events", "Keukenteams met piekdrukte"],
    icon: "keuken",
  },
  {
    id: "zelfstandig-werkend-koks",
    title: "Zelfstandig werkend koks",
    category: "Keuken",
    shortDescription:
      "Ervaren koks voor zelfstandig meedraaien in de keuken.",
    description:
      "Zelfstandig werkend koks draaien mee in de brigade, bereiden gerechten en houden de sectie op peil volgens planning en HACCP.",
    tasks: [
      "Gerechten bereiden",
      "Sectie draaien",
      "Mise-en-place voorbereiden",
      "HACCP naleven",
      "Service ondersteunen",
    ],
    idealFor: ["Restaurants", "Catering", "Banqueting", "Tijdelijke vervanging"],
    icon: "keuken",
    featured: true,
  },
  {
    id: "spoelkeuken-afwassers",
    title: "Spoelkeuken / afwassers",
    category: "Keuken",
    shortDescription:
      "Betrouwbare spoelkeukenondersteuning voor drukke diensten.",
    description:
      "Afwassers houden de spoelkeuken draaiend: afwas verwerken, servies aanvullen en de keuken ondersteunen tijdens pieken.",
    tasks: [
      "Afwas verwerken",
      "Spoelkeuken schoonhouden",
      "Servies aanvullen",
      "Keuken ondersteunen",
      "Afvalstromen bijhouden",
    ],
    idealFor: ["Restaurants", "Events", "Hotels", "Cateringlocaties"],
    icon: "keuken",
  },
  {
    id: "chef-ondersteuning",
    title: "Chef ondersteuning",
    category: "Keuken",
    shortDescription:
      "Ondersteuning voor chef, sous-chef en keukenleiding.",
    description:
      "Chef ondersteuning helpt bij planning, mise-en-place, productie en het bewaken van het keukenproces tijdens drukke diensten.",
    tasks: [
      "Team ondersteunen",
      "Mise-en-place controleren",
      "Productie voorbereiden",
      "Service meedraaien",
      "Keukenproces bewaken",
    ],
    idealFor: [
      "Drukke restaurants",
      "Events met keukenbrigade",
      "Tijdelijke vervanging",
      "Projectkeukens",
    ],
    icon: "keuken",
  },

  // Bar
  {
    id: "bartenders",
    title: "Bartenders",
    category: "Bar",
    shortDescription:
      "Barpersoneel voor events, clubs, festivals en horeca.",
    description:
      "Bartenders zorgen voor snelle uitgifte, nette presentatie en een soepele bar tijdens drukke diensten.",
    tasks: [
      "Dranken uitschenken",
      "Bar netjes houden",
      "Gasten helpen",
      "Voorraad bijhouden",
      "Werken volgens briefing",
    ],
    idealFor: ["Bars", "Festivals", "Clubs", "Bedrijfsfeesten"],
    icon: "bar",
  },
  {
    id: "barbacks",
    title: "Barbacks",
    category: "Bar",
    shortDescription:
      "Ondersteuning achter de bar voor snelle bevoorrading en schoonmaak.",
    description:
      "Barbacks houden glaswerk, ijs, drank en garnituren op peil zodat de bar blijft draaien.",
    tasks: [
      "Glaswerk aanvullen",
      "Bar bevoorraden",
      "IJs en garnituren klaarzetten",
      "Bar schoonhouden",
      "Uitgifte versnellen",
    ],
    idealFor: ["Festivals", "Clubs", "Bars", "Eventlocaties"],
    icon: "bar",
  },
  {
    id: "cocktail-support",
    title: "Cocktail support",
    category: "Bar",
    shortDescription:
      "Ondersteuning bij cocktailbars, prep en uitgifte.",
    description:
      "Cocktail support helpt bij prep, garnituren, glaswerk en snelle uitgifte bij cocktailbars en premium barset-ups.",
    tasks: [
      "Garnituren klaarzetten",
      "Prep ondersteunen",
      "Glaswerk aanvullen",
      "Bar bevoorraden",
      "Uitgifte versnellen",
    ],
    idealFor: ["Cocktailbars", "VIP areas", "Bedrijfsfeesten", "Festivals"],
    icon: "bar",
  },
  {
    id: "dranken-runners",
    title: "Dranken runners",
    category: "Bar",
    shortDescription:
      "Runners voor snelle dranklogistiek tussen bar, voorraad en vloer.",
    description:
      "Dranken runners zorgen dat voorraden, kratten en ijs op tijd bij de bar aankomen en retourstromen soepel lopen.",
    tasks: [
      "Drankvoorraad aanvullen",
      "Kratten wegbrengen",
      "IJs bijvullen",
      "Bar bevoorraden",
      "Zones vrijhouden",
    ],
    idealFor: ["Festivals", "Grote bars", "Events", "Banqueting"],
    icon: "logistiek",
  },
  {
    id: "bar-opbouw-afbouw",
    title: "Bar opbouw / bar afbouw",
    category: "Bar",
    shortDescription:
      "Praktische crew voor opbouw, inrichting en afbouw van bars.",
    description:
      "Bar opbouw- en afbouwcrew helpt bij klaarzetten, inrichten, opruimen en terugladen van barset-ups op locatie.",
    tasks: [
      "Bar klaarzetten",
      "Materiaal plaatsen",
      "Voorraad positioneren",
      "Afbouw na dienst",
      "Opruimen en terugladen",
    ],
    idealFor: ["Festivals", "Pop-up bars", "Events", "Locatieproducties"],
    icon: "stagehands",
  },

  // Stagebouw
  {
    id: "stagehands",
    title: "Stagehands",
    category: "Stagebouw",
    shortDescription:
      "Laden, lossen, opbouw, afbouw en materiaalhandling voor producties.",
    description:
      "Stagehands ondersteunen technische en productiecrew bij load-in, opbouw, materiaalhandling en afbouw. Praktisch, sterk en inzetbaar onder tijdsdruk.",
    tasks: [
      "Load-in en load-out",
      "Podiumdelen verplaatsen",
      "Cases rijden",
      "Materiaal klaarzetten",
      "Basis opbouw en afbouw",
      "Ondersteuning technische crew",
    ],
    idealFor: ["Concerten", "Festivals", "Podiumproducties", "Beursvloeren"],
    icon: "stagehands",
    featured: true,
  },
  {
    id: "load-in-load-out",
    title: "Load-in / Load-out crew",
    category: "Stagebouw",
    shortDescription:
      "Sterke crew voor snelle op- en afbouwmomenten.",
    description:
      "Load-in/load-out crew focust op trucks lossen, cases verplaatsen, klaarzetten voor show en snelle afbouw na afloop.",
    tasks: [
      "Trucks lossen",
      "Flightcases verplaatsen",
      "Decor en materiaal klaarzetten",
      "Afbouw na show",
      "Opruimen en terugladen",
    ],
    idealFor: [
      "Nachtelijke load-outs",
      "Festivalafbouw",
      "Theaterproducties",
      "Arena’s en stadions",
    ],
    icon: "stagehands",
  },
  {
    id: "sitecrew",
    title: "Sitecrew",
    category: "Stagebouw",
    shortDescription:
      "Algemene ondersteuning op terrein, backstage en productiezone.",
    description:
      "Sitecrew helpt op het terrein met materialen plaatsen, netheid, runners ondersteunen en kleine operationele taken.",
    tasks: [
      "Terreinondersteuning",
      "Bewegwijzering en materialen plaatsen",
      "Crew runners ondersteunen",
      "Backstage opruimen",
      "Kleine operationele taken",
    ],
    idealFor: ["Festivals", "Evenemententerreinen", "Grote producties", "Buitenlocaties"],
    icon: "stagehands",
  },
  {
    id: "materiaalcrew",
    title: "Materiaalcrew",
    category: "Stagebouw",
    shortDescription:
      "Ondersteuning bij materiaal, logistiek en praktische uitvoering.",
    description:
      "Materiaalcrew houdt overzicht op voorraden, verdeelt materialen en houdt werkzones netjes tijdens opbouw en uitvoering.",
    tasks: [
      "Materiaal tellen",
      "Materialen verdelen",
      "Crew supplies klaarzetten",
      "Werkzones netjes houden",
      "Hulp bij transport op locatie",
    ],
    idealFor: [
      "Productiekantoren",
      "Stagebouwbedrijven",
      "Event suppliers",
      "Locatieproducties",
    ],
    icon: "logistiek",
  },

  // Productie
  {
    id: "productie-assistenten",
    title: "Productie assistenten",
    category: "Productie",
    shortDescription:
      "Ondersteuning voor producers, projectleiders en productieteams.",
    description:
      "Productie assistenten ondersteunen planning, crewontvangst, briefings en praktische uitvoering op locatie.",
    tasks: [
      "Productieplanning ondersteunen",
      "Crew ontvangen",
      "Runners aansturen",
      "Briefings doorgeven",
      "Materialen controleren",
      "Contact houden met locatie",
    ],
    idealFor: ["Festivals", "Corporate events", "Live shows", "Locatieproducties"],
    icon: "productie-assistentie",
    featured: true,
  },
  {
    id: "productie-runners",
    title: "Runners",
    category: "Productie",
    shortDescription:
      "Flexibele runners voor snelle praktische taken op locatie.",
    description:
      "Productierunners lossen spoedklussen op, ondersteunen het productiekantoor en houden materiaalstromen op gang.",
    tasks: [
      "Materialen ophalen",
      "Crew ondersteunen",
      "Boodschappen en ritten",
      "Productiekantoor helpen",
      "Kleine spoedklussen oplossen",
    ],
    idealFor: [
      "Productiekantoren",
      "Backstage",
      "Events met veel wisselingen",
      "Last-minute ondersteuning",
    ],
    icon: "productie-assistentie",
  },
  {
    id: "backstage-support",
    title: "Backstage support",
    category: "Productie",
    shortDescription:
      "Ondersteuning achter de schermen voor artiesten, crew en productie.",
    description:
      "Backstage support houdt ruimtes klaar, ondersteunt routing en zorgt voor orde achter de schermen tijdens shows.",
    tasks: [
      "Backstage ruimtes klaarzetten",
      "Cateringpunten ondersteunen",
      "Artiestenrouting ondersteunen",
      "Crewbeweging begeleiden",
      "Orde en netheid bewaren",
    ],
    idealFor: ["Concerten", "Festivals", "Theaters", "Artist handling"],
    icon: "productie-assistentie",
  },
  {
    id: "productie-floor-support",
    title: "Floor support",
    category: "Productie",
    shortDescription:
      "Praktische ondersteuning op de vloer tijdens events en producties.",
    description:
      "Floor support ontlast het productieteam op de vloer met gastenstromen, materiaalverplaatsing en snelle probleemoplossing.",
    tasks: [
      "Gastenstromen ondersteunen",
      "Materiaal op locatie verplaatsen",
      "Productieteam ontlasten",
      "Ad-hoc problemen oplossen",
      "Zichtbaar aanspreekpunt zijn",
    ],
    idealFor: ["Beurzen", "Publieksevents", "Horecaproducties", "Corporate events"],
    icon: "event-crew",
  },
  {
    id: "productie-logistiek",
    title: "Productie logistiek",
    category: "Productie",
    shortDescription:
      "Logistieke ondersteuning voor materiaal, crew en leveranciers.",
    description:
      "Productie logistiek begeleidt leveringen, laad- en losmomenten en houdt materiaalstromen in lijn met de planning.",
    tasks: [
      "Leveringen begeleiden",
      "Materiaalstromen controleren",
      "Laad- en losmomenten ondersteunen",
      "Zones vrijhouden",
      "Productieplanning volgen",
    ],
    idealFor: ["Grote evenementen", "Beursopbouw", "Festivalterreinen", "Stadions"],
    icon: "logistiek",
  },

  // Logistiek
  {
    id: "logistiek-medewerkers",
    title: "Logistiek medewerkers",
    category: "Logistiek",
    shortDescription:
      "Praktische logistieke crew voor materiaal, zones en stromen op locatie.",
    description:
      "Logistiek medewerkers houden materiaalstromen, zones en voorraden op orde tijdens opbouw, show en afbouw.",
    tasks: [
      "Materiaal verplaatsen",
      "Leveringen begeleiden",
      "Zones klaarzetten",
      "Voorraad aanvullen",
      "Afval en retourstromen ondersteunen",
    ],
    idealFor: ["Festivals", "Beurzen", "Stadions", "Locatieproducties"],
    icon: "logistiek",
    featured: true,
  },
  {
    id: "materiaal-runners",
    title: "Materiaal runners",
    category: "Logistiek",
    shortDescription:
      "Snelle runners voor materiaal tussen magazijn, zone en productie.",
    description:
      "Materiaal runners brengen supplies en cases naar de juiste zone en houden de productie soepel draaiend.",
    tasks: [
      "Materiaal ophalen",
      "Cases verplaatsen",
      "Zones bevoorraden",
      "Retours verzamelen",
      "Productieteam helpen",
    ],
    idealFor: ["Productiekantoren", "Festivals", "Beursvloeren", "Backstage"],
    icon: "logistiek",
  },
  {
    id: "laad-loscrew",
    title: "Laad- en loscrew",
    category: "Logistiek",
    shortDescription:
      "Sterke crew voor trucks, pallets en snelle laad- en losmomenten.",
    description:
      "Laad- en loscrew ondersteunt leveranciers en productie bij inkomende en uitgaande stromen onder tijdsdruk.",
    tasks: [
      "Trucks lossen",
      "Pallets verplaatsen",
      "Laadzones vrijhouden",
      "Materiaal klaarzetten",
      "Terugladen ondersteunen",
    ],
    idealFor: ["Arena’s", "Festivals", "Beurzen", "Nachtelijke afbouw"],
    icon: "stagehands",
  },
  {
    id: "voorraad-ondersteuning",
    title: "Voorraad ondersteuning",
    category: "Logistiek",
    shortDescription:
      "Ondersteuning bij voorraad, telling en bevoorrading op locatie.",
    description:
      "Voorraad ondersteuning houdt overzicht op supplies, vult aan en zorgt dat zones niet stil komen te liggen.",
    tasks: [
      "Voorraad tellen",
      "Aanvullen",
      "Supplies verdelen",
      "Tekorten signaleren",
      "Werkzones bevoorraden",
    ],
    idealFor: ["Horeca events", "Festivals", "Producties", "Banqueting"],
    icon: "logistiek",
  },
  {
    id: "transport-op-locatie",
    title: "Transport op locatie",
    category: "Logistiek",
    shortDescription:
      "Verplaatsen van materiaal en supplies over het terrein.",
    description:
      "Transport op locatie zorgt dat materiaal snel van A naar B komt: tussen dock, magazijn, stage en hospitalityzones.",
    tasks: [
      "Materiaal verplaatsen",
      "Routes vrijhouden",
      "Zones bevoorraden",
      "Crew ondersteunen",
      "Retourstromen helpen",
    ],
    idealFor: ["Festivalterreinen", "Grote locaties", "Stadions", "Beurzen"],
    icon: "logistiek",
  },

  // Hospitality
  {
    id: "hosts",
    title: "Hosts",
    category: "Hospitality",
    shortDescription:
      "Representatieve hosts voor ontvangst en begeleiding van gasten.",
    description:
      "Hosts zijn het gezicht van de locatie: welkom heten, doorverwijzen en een professioneel eerste aanspreekpunt zijn.",
    tasks: [
      "Gasten ontvangen",
      "Vragen beantwoorden",
      "Doorverwijzen",
      "Wachtrijen begeleiden",
      "Representatief aanspreekpunt zijn",
    ],
    idealFor: ["Events", "Restaurants", "VIP ontvangsten", "Corporate events"],
    icon: "hospitality",
    featured: true,
  },
  {
    id: "guest-support",
    title: "Guest support",
    category: "Hospitality",
    shortDescription:
      "Gastondersteuning voor vragen, routing en comfort op locatie.",
    description:
      "Guest support helpt bezoekers met praktische vragen, routing en een soepele ervaring tijdens het event.",
    tasks: [
      "Gasten helpen",
      "Vragen beantwoorden",
      "Doorverwijzen",
      "Comfortpunten ondersteunen",
      "Feedback doorgeven",
    ],
    idealFor: ["Festivals", "Beurzen", "Concerten", "Publieksevents"],
    icon: "hospitality",
  },
  {
    id: "vip-support",
    title: "VIP support",
    category: "Hospitality",
    shortDescription:
      "Discrete ondersteuning voor VIP-zones, gasten en hospitality.",
    description:
      "VIP support begeleidt gasten in exclusieve zones, houdt overzicht en werkt netjes volgens briefing.",
    tasks: [
      "VIP gasten begeleiden",
      "Zones ondersteunen",
      "Cateringpunten helpen",
      "Discrete ondersteuning bieden",
      "Briefing volgen",
    ],
    idealFor: ["VIP areas", "Corporate events", "Concerten", "Festivals"],
    icon: "hospitality",
  },
  {
    id: "backstage-hospitality",
    title: "Backstage hospitality",
    category: "Hospitality",
    shortDescription:
      "Hospitality achter de schermen voor artiesten en crew.",
    description:
      "Backstage hospitality houdt ruimtes, cateringpunten en ontvangst achter de schermen soepel en representatief.",
    tasks: [
      "Backstage ruimtes klaarzetten",
      "Cateringpunten ondersteunen",
      "Crew en artiesten helpen",
      "Netheid bewaken",
      "Routing ondersteunen",
    ],
    idealFor: ["Concerten", "Festivals", "Theaters", "Artist handling"],
    icon: "productie-assistentie",
  },
  {
    id: "publieksbegeleiding",
    title: "Publieksbegeleiding",
    category: "Hospitality",
    shortDescription:
      "Begeleiding van bezoekersstromen, entrees en publiekszones.",
    description:
      "Publieksbegeleiding zorgt voor duidelijke routing, vriendelijke instructies en een soepele doorstroom bij entrees en zones.",
    tasks: [
      "Bezoekers begeleiden",
      "Routing aangeven",
      "Wachtrijen ondersteunen",
      "Vragen beantwoorden",
      "Zones netjes houden",
    ],
    idealFor: ["Festivals", "Stadions", "Beurzen", "Concerten"],
    icon: "event-crew",
  },
];

export function getFeaturedHomeServices(): HomeService[] {
  return homeServices.filter((service) => service.featured);
}

export function getHomeServicesByFilter(
  filter: HomeServiceFilter,
  options?: { showAllWhenAlle?: boolean },
): HomeService[] {
  if (filter === "Alle") {
    return options?.showAllWhenAlle ? homeServices : getFeaturedHomeServices();
  }
  return homeServices.filter((service) => service.category === filter);
}

export function getAllHomeServices(): HomeService[] {
  return homeServices;
}
