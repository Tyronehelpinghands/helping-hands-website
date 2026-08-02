/** Content voor de uitgebreide /opdrachtgevers-pagina — bedrijfszekerheid, personeelsvormen, uren en team. */

import { MINIMUM_BILLABLE_HOURS, minimumAfnameText } from "@/lib/opdrachtgeversPolicy";

export type OpdrachtgeversTrustPoint = {
  title: string;
  text: string;
};

export const opdrachtgeversTrustPoints: OpdrachtgeversTrustPoint[] = [
  {
    title: "Voornamelijk loondienst & payroll",
    text: "Het merendeel van onze medewerkers werkt via loondienst of payroll. Zzp zetten we alleen in waar dat past bij de opdracht.",
  },
  {
    title: "Planning vrijwel 24/7 bereikbaar",
    text: "Tijdens kantoortijden altijd via telefoon, WhatsApp en mail. Bij lopende producties houden we ook daarbuiten actief een lijn open voor spoed.",
  },
  {
    title: "Gecontroleerde urenregistratie",
    text: "Uren lopen via een roosterapp, worden op locatie gecontroleerd en pas na jouw akkoord verwerkt richting facturatie.",
  },
  {
    title: "Eén vast aanspreekpunt per opdracht",
    text: "Van aanvraag tot afhandeling weet je precies wie je planner is — geen wisselende contactpersonen.",
  },
];

export type ZekerheidCardKey =
  | "opdrachtbevestiging"
  | "gecontroleerd"
  | "accreditatie"
  | "pbm"
  | "controle"
  | "bereikbaar";

export type ZekerheidCard = {
  key: ZekerheidCardKey;
  title: string;
  text: string;
};

export const zekerheidCards: ZekerheidCard[] = [
  {
    key: "opdrachtbevestiging",
    title: "Opdrachtbevestiging",
    text: "Iedere inzet leggen we vast in een opdrachtbevestiging met functies, aantallen, tijden en gemaakte afspraken — zodat er voor beide kanten geen onduidelijkheid ontstaat.",
  },
  {
    key: "gecontroleerd",
    title: "Gecontroleerde medewerkers",
    text: "Onze crew wordt vooraf beoordeeld op ervaring, beschikbaarheid en geschiktheid voor de functie. Waar relevant checken we certificaten voordat iemand wordt ingepland.",
  },
  {
    key: "accreditatie",
    title: "Accreditatie",
    text: "Vraagt jouw locatie of productie om accreditatie? Dan stemmen we de aanlevering van namen en gegevens af op jullie proces en deadline.",
  },
  {
    key: "pbm",
    title: "Persoonlijke beschermingsmiddelen",
    text: "Onze crew werkt met de juiste PBM's waar dat nodig is. Welke PBM's precies vereist zijn, verschilt per locatie en opdracht — dit stemmen we vooraf af in de briefing.",
  },
  {
    key: "controle",
    title: "Controle op locatie",
    text: "Bij grotere inzetten stuurt een teamcaptain of crewchief de groep aan, bewaakt de kwaliteit en is rechtstreeks aanspreekbaar tijdens de dienst.",
  },
  {
    key: "bereikbaar",
    title: "Bereikbare planning",
    text: "Vragen of wijzigingen tijdens de dienst? Onze planning is tijdens kantoortijden altijd bereikbaar en houdt tijdens lopende producties ook daarbuiten een lijn open.",
  },
];

export const personeelsvormenIntro = {
  eyebrow: "Personeelsvormen en accreditatie",
  title: "Voornamelijk loondienst en payroll — zzp alleen waar het past",
  paragraphs: [
    "Het merendeel van onze medewerkers werkt via loondienst of payroll. Voor payroll werken we samen met Fooks Payrolling, zodat dienstverbanden, verloning en aanverwante administratie professioneel geregeld zijn.",
    "In een beperkt aantal gevallen zetten we een zzp'er in, wanneer dat beter aansluit bij de opdracht of specialistische functie. Dit melden we vooraf, en de inzet wordt vastgelegd in onze administratie.",
  ],
};

export const personeelsvormenTypes = [
  {
    title: "Loondienst",
    text: "De basis van onze crew werkt in loondienst bij Helping Hands Agency.",
  },
  {
    title: "Payroll (Fooks Payrolling)",
    text: "Voor een deel van de inzet werken we via payroll, met Fooks Payrolling als partner.",
  },
  {
    title: "Zzp (uitzondering)",
    text: "Alleen wanneer dit past bij de opdracht — vooraf gemeld en intern vastgelegd.",
  },
] as const;

export const personeelsvormenVerzekering = {
  title: "Aansprakelijkheid en verzekering",
  paragraphs: [
    "Onze medewerkers zijn voor hun inzet verzekerd op een manier die past bij hun dienstverband — loondienst, payroll of zzp. Voor payroll loopt dit via onze partner Fooks Payrolling.",
    "De precieze dekking, aansprakelijkheidsverdeling en verzekeringsvoorwaarden leggen we niet los op deze pagina vast: die staan in de opdrachtbevestiging en onze algemene voorwaarden. Wil je dit vooraf doornemen, vraag dan gerust onze voorwaarden op.",
  ],
};

export type UrenStep = {
  step: string;
  title: string;
  description: string;
};

export const urenSteps: UrenStep[] = [
  {
    step: "01",
    title: "Registratie via roosterapp",
    description:
      "Crew checkt in en uit via onze roosterapp, direct op locatie. Zo staat de basis van de urenregistratie vanaf de eerste minuut vast.",
  },
  {
    step: "02",
    title: "Controle op locatie",
    description:
      "Een teamcaptain, crewchief of planner vergelijkt de geregistreerde uren met de planning en signaleert afwijkingen zo vroeg mogelijk.",
  },
  {
    step: "03",
    title: "Goedkeuring door opdrachtgever",
    description:
      "Jij of je contactpersoon op locatie accordeert de uren. Bij afwijkingen nemen we eerst contact op, voordat uren definitief worden verwerkt richting facturatie.",
  },
];

export const uitvalContent = {
  eyebrow: "Uitval, bereikbaarheid en vervanging",
  title: "Eerlijk over wat wij wel en niet kunnen garanderen",
  paragraphs: [
    "Valt een medewerker onverwacht uit door ziekte of een calamiteit, dan proberen we zo snel mogelijk vervanging te regelen vanuit beschikbare crew. In de meeste gevallen lukt dit — maar we garanderen niet dat er op elk moment van de dag, voor elke functie, direct een vervanger beschikbaar is. Bij zeer kort dagelijkse spoed of specialistische functies kan vervanging tijd kosten.",
    "Tijdens kantoortijden is onze planning altijd bereikbaar via telefoon, WhatsApp en mail. Bij lopende producties houden we ook buiten kantoortijden actief een lijn open voor spoedmeldingen. Dit is een actieve inspanning om bereikbaar te zijn wanneer het nodig is — geen garantie dat iedere melding op ieder moment van de nacht direct wordt opgepakt.",
  ],
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  note?: string;
  image?: { src: string; alt: string };
};

export const teamMembers: TeamMember[] = [
  {
    name: "Tyrone van der Schagt",
    role: "Eigenaar en opdrachtgeverrelaties",
    initials: "TS",
    image: {
      src: "/images/team/tyrone.jpg",
      alt: "Tyrone van der Schagt — oprichter Helping Hands Agency",
    },
  },
  {
    name: "Mesbah Kashit",
    role: "Planning en crewcoördinatie",
    initials: "MK",
  },
  {
    name: "Marieke",
    role: "HR en personeelszaken",
    initials: "M",
  },
];

export const teamAvondDienst = {
  role: "Avond- en calamiteitenplanning",
  text: "Tijdens lopende producties buiten kantoortijden schuift het planningsteam de bereikbaarheid onderling door, zodat er bij spoed altijd iemand vanuit het team te bereiken is.",
};

export const teamCaptainsNote = {
  role: "Teamcaptains en crewchiefs",
  text: "Bij grotere inzetten sturen ervaren teamcaptains en crewchiefs de crew aan op locatie: zij bewaken kwaliteit, briefing en zijn rechtstreeks aanspreekbaar tijdens de dienst.",
};

export const briefingChecklistGroups: { title: string; items: string[] }[] = [
  {
    title: "Basis van de aanvraag",
    items: [
      "Datum",
      "Locatie",
      "Start- en eindtijd",
      "Functie(s) en aantal mensen",
      "Contactpersoon op locatie",
    ],
  },
  {
    title: "Op locatie",
    items: [
      "Kledingvoorschriften",
      "Pauzes",
      "Parkeer- en laadmogelijkheden",
      "Reis- en verblijfsafspraken (indien van toepassing)",
    ],
  },
  {
    title: "Veiligheid en toegang",
    items: [
      "Vereiste PBM's",
      "Vereiste certificaten",
      "Accreditatieproces en deadline",
    ],
  },
  {
    title: "Administratie",
    items: [
      "Naam crewchief of aanspreekpunt tijdens de dienst",
      "Wie tekent de uren voor akkoord",
      "Afspraken over overwerk of wijzigingen tijdens de dienst",
      "Factuurreferentie of PO-nummer",
    ],
  },
];

export const briefingClosingNote =
  "Hoe vollediger de briefing vooraf, hoe beter wij crew kunnen voorbereiden — en hoe minder er op de dag zelf hoeft te worden uitgezocht.";

export { MINIMUM_BILLABLE_HOURS, minimumAfnameText };
