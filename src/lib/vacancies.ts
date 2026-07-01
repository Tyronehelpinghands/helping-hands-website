import { applicationsEmail } from "@/lib/navigation";

export type VacancyCategory =
  | "Event"
  | "Horeca"
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
];

export function vacancyMailto(title: string, email = applicationsEmail) {
  const subject = encodeURIComponent(
    `Sollicitatie ${title} - Helping Hands Agency`,
  );
  return `mailto:${email}?subject=${subject}`;
}
