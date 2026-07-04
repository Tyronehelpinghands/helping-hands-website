import { applicationsEmail } from "@/lib/navigation";

export type VacancyCategory =
  | "Event"
  | "Horeca"
  | "Restaurant"
  | "Keuken"
  | "Bar"
  | "Stagebouw"
  | "Productie"
  | "Leidinggevend";

export type Vacancy = {
  title: string;
  category: VacancyCategory;
  type: string;
  location: string;
  intro: string;
  tasks: string[];
  profile: string[];
  email: string;
};

export const vacancyFilters = [
  "Alle",
  "Event",
  "Horeca",
  "Restaurant",
  "Keuken",
  "Bar",
  "Stagebouw",
  "Productie",
  "Leidinggevend",
] as const;

export type VacancyFilter = (typeof vacancyFilters)[number];

export const vacancies: Vacancy[] = [
  {
    title: "Eventmedewerker / Floor support",
    category: "Event",
    type: "Oproepbasis / flexibel",
    location: "Landelijk, afhankelijk van opdracht",
    intro:
      "Ondersteun publieksstromen, garderobe, runners en floor support tijdens events waar timing en gastvrijheid belangrijk zijn.",
    tasks: [
      "Publieksstromen begeleiden",
      "Garderobe",
      "Runners",
      "Floor support",
      "Algemene eventondersteuning",
    ],
    profile: [
      "Representatief",
      "Communicatief sterk",
      "Stressbestendig",
      "Op tijd en betrouwbaar",
    ],
    email: applicationsEmail,
  },
  {
    title: "Stagehand / Load-in & Load-out",
    category: "Stagebouw",
    type: "Oproepbasis / flexibel",
    location: "Concertzalen, stadions, festivals en productielocaties",
    intro:
      "Werk mee aan laden, lossen, opbouw en afbouw op producties waar praktische inzet en veiligheid centraal staan.",
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
    email: applicationsEmail,
  },
  {
    title: "Horeca support / Runner / Barback",
    category: "Horeca",
    type: "Oproepbasis / flexibel",
    location: "Horeca-events, festivals en evenementenlocaties",
    intro:
      "Ondersteun bars, uitgifte en hospitality tijdens piekmomenten op events en horeca-opdrachten.",
    tasks: [
      "Barback",
      "Runner",
      "Uitgifte",
      "Bediening support",
      "Hospitality",
    ],
    profile: [
      "Netjes",
      "Snel kunnen schakelen",
      "Gastgericht",
      "Ervaring is mooi meegenomen",
    ],
    email: applicationsEmail,
  },
  {
    title: "Productie assistent",
    category: "Productie",
    type: "Oproepbasis / projectbasis",
    location: "Evenementen, backstage en producties",
    intro:
      "Ondersteun productieleiders en crew met backstage taken, runnerswerk en praktische uitvoering op locatie.",
    tasks: [
      "Ondersteuning productieleider",
      "Backstage support",
      "Runnerswerk",
      "Crewcoördinatie",
      "Praktische uitvoering",
    ],
    profile: [
      "Zelfstandig",
      "Oplossingsgericht",
      "Communicatief",
      "Flexibel inzetbaar",
    ],
    email: applicationsEmail,
  },
  {
    title: "Teamcaptain",
    category: "Leidinggevend",
    type: "Op aanvraag / voor ervaren crew",
    location: "Events en producties",
    intro:
      "Leid crew op locatie, bewaak de briefing en fungeer als aanspreekpunt tussen opdrachtgever en team.",
    tasks: [
      "Crew aansturen",
      "Briefing bewaken",
      "Aanspreekpunt op locatie",
      "Terugkoppeling na afloop",
    ],
    profile: [
      "Ervaring op events",
      "Leiding kunnen geven",
      "Rustig blijven onder druk",
      "Duidelijk communiceren",
    ],
    email: applicationsEmail,
  },
  {
    title: "Bedieningsmedewerker restaurant",
    category: "Restaurant",
    type: "Oproepbasis / flexibel / projectbasis",
    location: "Restaurants, horecalocaties en events",
    intro:
      "Werk in de bediening bij restaurants, diners, events en horecalocaties waar gastvrijheid en tempo belangrijk zijn.",
    tasks: [
      "Gasten ontvangen en bedienen",
      "Bestellingen opnemen",
      "Dranken en gerechten uitserveren",
      "Tafels indekken en afruimen",
      "Restaurant netjes en representatief houden",
    ],
    profile: [
      "Gastvrij en representatief",
      "Communicatief sterk",
      "Stressbestendig",
      "Netjes en professioneel",
      "Ervaring is mooi meegenomen",
    ],
    email: applicationsEmail,
  },
  {
    title: "Runner bediening",
    category: "Restaurant",
    type: "Oproepbasis / flexibel",
    location: "Restaurants, terrassen, events en horecalocaties",
    intro:
      "Ondersteun de bediening door gerechten, drankjes en materialen snel en netjes te verplaatsen.",
    tasks: [
      "Gerechten uitlopen",
      "Dranken brengen",
      "Tafels afruimen",
      "Voorraad aanvullen",
      "Bediening ondersteunen tijdens piekmomenten",
    ],
    profile: [
      "Snel en praktisch ingesteld",
      "Goed kunnen samenwerken",
      "Fysiek fit",
      "Oog voor netheid",
      "Op tijd en betrouwbaar",
    ],
    email: applicationsEmail,
  },
  {
    title: "Barback",
    category: "Bar",
    type: "Oproepbasis / flexibel",
    location: "Bars, restaurants, festivals en evenementenlocaties",
    intro:
      "Ondersteun bartenders tijdens drukke diensten door voorraad, glaswerk en barprocessen op orde te houden.",
    tasks: [
      "Bar aanvullen",
      "Glaswerk verzamelen en spoelen",
      "Drankenvoorraad bijhouden",
      "IJs, garnituren en materialen aanvullen",
      "Bar schoon en werkbaar houden",
    ],
    profile: [
      "Snel kunnen schakelen",
      "Praktisch en oplettend",
      "Geen moeite met fysiek werk",
      "Teamspeler",
      "Ervaring in horeca is een plus",
    ],
    email: applicationsEmail,
  },
  {
    title: "Bartender",
    category: "Bar",
    type: "Oproepbasis / flexibel / projectbasis",
    location: "Restaurants, bars, festivals en events",
    intro:
      "Werk achter de bar bij restaurants, events en festivals waar snelheid, uitstraling en gastvrijheid samenkomen.",
    tasks: [
      "Dranken bereiden en uitgeven",
      "Barvoorraad bewaken",
      "Gasten helpen aan de bar",
      "Bar schoonhouden",
      "Samenwerken met barbacks en runners",
    ],
    profile: [
      "Horeca-ervaring gewenst",
      "Gastgericht",
      "Snel en netjes werken",
      "Stressbestendig",
      "Representatief",
    ],
    email: applicationsEmail,
  },
  {
    title: "Afwasser / Spoelkeuken medewerker",
    category: "Keuken",
    type: "Oproepbasis / flexibel",
    location: "Restaurants, keukens en horecalocaties",
    intro:
      "Zorg dat de keuken kan blijven draaien door vaat, materialen en spoelkeuken netjes op orde te houden.",
    tasks: [
      "Afwassen en spoelen",
      "Keukengerei schoonhouden",
      "Schone spullen terugplaatsen",
      "Spoelkeuken netjes houden",
      "Keukenteam ondersteunen",
    ],
    profile: [
      "Aanpakker",
      "Netjes werken",
      "Fysiek fit",
      "Tempo kunnen maken",
      "Betrouwbaar",
    ],
    email: applicationsEmail,
  },
  {
    title: "Keukenhulp / Hulp kok",
    category: "Keuken",
    type: "Oproepbasis / flexibel / projectbasis",
    location: "Restaurants, keukens, events en cateringlocaties",
    intro:
      "Ondersteun het keukenteam met mise-en-place, voorbereiding, eenvoudige bereidingen en schoonmaak.",
    tasks: [
      "Mise-en-place voorbereiden",
      "Snijden en portioneren",
      "Eenvoudige gerechten voorbereiden",
      "Keuken schoon en georganiseerd houden",
      "Koks ondersteunen tijdens service",
    ],
    profile: [
      "Praktisch ingesteld",
      "Interesse in koken",
      "Netjes en hygiënisch werken",
      "Stressbestendig",
      "Ervaring is mooi meegenomen",
    ],
    email: applicationsEmail,
  },
  {
    title: "Zelfstandig werkend kok",
    category: "Keuken",
    type: "Projectbasis / flexibel / op aanvraag",
    location: "Restaurants, events, catering en horecalocaties",
    intro:
      "Draai zelfstandig mee in de keuken tijdens voorbereiding, service en drukke productiedagen.",
    tasks: [
      "Mise-en-place draaien",
      "Gerechten bereiden",
      "Service meedraaien",
      "Kwaliteit en presentatie bewaken",
      "Keuken schoon en veilig houden",
    ],
    profile: [
      "Aantoonbare keukenervaring",
      "Zelfstandig kunnen werken",
      "HACCP-basiskennis",
      "Stressbestendig",
      "Professionele werkhouding",
    ],
    email: applicationsEmail,
  },
  {
    title: "Chef de partie",
    category: "Keuken",
    type: "Projectbasis / op aanvraag",
    location: "Restaurants, events en productiekeukens",
    intro:
      "Pak verantwoordelijkheid op een eigen partie en ondersteun het keukenteam tijdens voorbereiding en service.",
    tasks: [
      "Eigen partie voorbereiden",
      "Gerechten bereiden en doorgeven",
      "Mise-en-place bewaken",
      "Kwaliteit controleren",
      "Samenwerken met chef en keukenbrigade",
    ],
    profile: [
      "Ervaring als kok of chef de partie",
      "Zelfstandig en georganiseerd",
      "Kwaliteitsgericht",
      "Goed kunnen communiceren",
      "Rustig onder druk",
    ],
    email: applicationsEmail,
  },
  {
    title: "Sous-chef",
    category: "Leidinggevend",
    type: "Projectbasis / op aanvraag",
    location: "Restaurants, events en horecakeukens",
    intro:
      "Ondersteun de chef en stuur de keuken mee aan tijdens voorbereiding, service en operationele drukte.",
    tasks: [
      "Keukenteam ondersteunen en aansturen",
      "Mise-en-place controleren",
      "Service bewaken",
      "Kwaliteit en tempo controleren",
      "Meedenken over planning en organisatie",
    ],
    profile: [
      "Ruime keukenervaring",
      "Leiding kunnen geven",
      "Overzicht houden",
      "HACCP-kennis",
      "Professionele communicatie",
    ],
    email: applicationsEmail,
  },
  {
    title: "Chef-kok",
    category: "Leidinggevend",
    type: "Projectbasis / op aanvraag",
    location: "Restaurants, horecalocaties en tijdelijke producties",
    intro:
      "Neem leiding in de keuken bij restaurants, events of tijdelijke horecaproducties waar structuur en kwaliteit nodig zijn.",
    tasks: [
      "Keuken aansturen",
      "Mise-en-place en service organiseren",
      "Kwaliteit bewaken",
      "Team instrueren",
      "Meedenken over planning en inkoop",
    ],
    profile: [
      "Ervaring als chef of leidinggevende kok",
      "Sterke communicatie",
      "Overzicht en discipline",
      "Kwaliteitsgericht",
      "Stressbestendig",
    ],
    email: applicationsEmail,
  },
  {
    title: "Host / Gastheer / Gastvrouw",
    category: "Restaurant",
    type: "Oproepbasis / flexibel",
    location: "Restaurants, events en horecalocaties",
    intro:
      "Ontvang gasten professioneel en zorg voor een goede eerste indruk bij restaurants, events en ontvangstmomenten.",
    tasks: [
      "Gasten ontvangen",
      "Reserveringen begeleiden",
      "Doorverwijzen naar tafels of zones",
      "Wachtrijen of ontvangst stroomlijnen",
      "Samenwerken met bediening en floor manager",
    ],
    profile: [
      "Representatief",
      "Gastvrij",
      "Communicatief sterk",
      "Rustig en vriendelijk",
      "Goede uitstraling",
    ],
    email: applicationsEmail,
  },
  {
    title: "Shiftleader / Floor manager horeca",
    category: "Leidinggevend",
    type: "Projectbasis / op aanvraag",
    location: "Restaurants, horeca-events en locaties",
    intro:
      "Stuur bediening, runners en floor support aan tijdens drukke horecadiensten en events.",
    tasks: [
      "Team aansturen",
      "Briefing geven",
      "Overzicht houden op de vloer",
      "Contact houden met opdrachtgever/manager",
      "Problemen snel oplossen",
    ],
    profile: [
      "Horeca-ervaring",
      "Leidinggevende houding",
      "Communicatief sterk",
      "Stressbestendig",
      "Gastgericht",
    ],
    email: applicationsEmail,
  },
];

export const restaurantVacancyGroups = [
  {
    title: "Bediening & floor",
    roles: [
      "Bedieningsmedewerker restaurant",
      "Runner bediening",
      "Host / Gastheer / Gastvrouw",
    ],
  },
  {
    title: "Bar & hospitality",
    roles: ["Barback", "Bartender", "Horeca support / Runner / Barback"],
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

export function vacancyMailto(title: string, email = applicationsEmail) {
  const subject = encodeURIComponent(
    `Sollicitatie ${title} - Helping Hands Agency`,
  );
  return `mailto:${email}?subject=${subject}`;
}
