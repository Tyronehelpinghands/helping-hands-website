/** Over ons (rebuild) — inhoud voor hero, missie, verhaal, doelgroepen, aanpak en groei. */

export const aboutHero = {
  eyebrow: "Over Helping Hands Agency",
  title:
    "Meer dan crew leveren: wij bouwen aan kansen, groei en professioneel werk.",
  description:
    "Helping Hands Agency is een event staffing- en crewbedrijf voor evenementen, horeca, stagebouw, productie en logistiek — geen zorg- of thuiszorgorganisatie. Opgericht in 2022 door Tyrone van der Schagt om jongeren en jongvolwassenen die moeilijk aan werk komen een eerlijke kans te geven — met persoonlijke begeleiding, duidelijke structuur en professionele inzet voor opdrachtgevers.",
  primaryCta: { label: "Personeel aanvragen", href: "/contact" },
  secondaryCta: { label: "Werken bij Helping Hands Agency", href: "/werken-bij" },
  tertiaryCta: { label: "Bekijk diensten", href: "/diensten" },
  trustBullets: [
    "Sinds 2022",
    "Persoonlijke begeleiding",
    "Professionele uitvoering",
    "Doorgroeimogelijkheden",
  ],
};

export const aboutFounder = {
  eyebrow: "Het verhaal",
  title: "Waarom Tyrone Helping Hands begon",
  paragraphs: [
    "Tyrone startte Helping Hands vanuit een duidelijke overtuiging: niet iedereen krijgt dezelfde start, maar dat betekent niet dat iemand niet wil of kan werken.",
    "Veel jongeren en jongvolwassenen hebben moeite om werk te vinden of vast te houden. Ze zitten in een uitkering, hebben weinig werkervaring, zijn voortijdig gestopt met school of kwamen terecht op een plek die niet bij hen paste.",
    "Helping Hands kijkt niet alleen naar een cv, maar naar wat iemand kan wórden — met de juiste begeleiding, structuur en een eerlijke kans om te laten zien wat hij of zij kan.",
  ],
  quote:
    "Niet iedereen heeft dezelfde start. Wel verdient iedereen de kans om te laten zien wat hij of zij kan.",
  badge: {
    initials: "TS",
    name: "Tyrone van der Schagt",
    role: "Oprichter, Helping Hands Agency",
    since: "Sinds 2022",
    image: {
      src: "/images/team/tyrone.png",
      alt: "Tyrone van der Schagt — oprichter Helping Hands Agency",
    },
  },
};

export const aboutBentoIntro = {
  eyebrow: "Groeien op de vloer",
  title: "Van eerste klus naar verantwoordelijkheid op locatie",
  description:
    "Elke medewerker begint ergens. Met duidelijke briefing, begeleiding en vertrouwen groeien mensen door — van eerste opdracht tot een vaste, verantwoordelijke rol binnen de crew.",
};

export const aboutForEmployees = {
  eyebrow: "Voor medewerkers",
  title: "Werkervaring, begeleiding en een eerlijke kans om te groeien",
  paragraphs: [
    "Bij Helping Hands draai je mee op echte producties: events, horeca, stagebouw, productie, logistiek en hospitality. Je krijgt een duidelijke briefing, een aanspreekpunt op locatie en de ruimte om te laten zien wat je kan.",
    "Heb je weinig werkervaring, zit je in een uitkering of ben je toe aan een nieuwe start? We kijken naar je motivatie en potentieel — niet alleen naar je cv.",
  ],
  bullets: [
    "Duidelijke planning en briefing vooraf",
    "Persoonlijke begeleiding op locatie",
    "Afwisselend werk in events, horeca en productie",
    "Kans om door te groeien naar meer verantwoordelijkheid",
  ],
  primaryCta: { label: "Werken bij Helping Hands", href: "/medewerkers" },
  secondaryCta: { label: "Bekijk vacatures", href: "/vacatures" },
};

export const aboutForClients = {
  eyebrow: "Voor opdrachtgevers",
  title: "Betrouwbare crew met een professionele werkhouding",
  paragraphs: [
    "Onze maatschappelijke missie betekent geen concessies aan kwaliteit. Opdrachtgevers mogen rekenen op crew die voorbereid, op tijd en inzetbaar is op locatie.",
    "Iedere opdracht stemmen we vooraf af op functie, ervaring, werktijden, veiligheid en eventuele certificaten. Onze teamleiders sturen crew aan op locatie en bewaken de kwaliteit tijdens de dienst.",
  ],
  bullets: [
    "Eén vast aanspreekpunt van aanvraag tot afhandeling",
    "Duidelijke briefing en voorbereiding vooraf",
    "Teamleiders die crew aansturen op locatie",
    "Snel schakelen bij wijzigingen of spoed",
  ],
  primaryCta: { label: "Personeel aanvragen", href: "/contact" },
  secondaryCta: { label: "Bekijk diensten", href: "/diensten" },
};

export type AboutApproachStep = {
  title: string;
  description: string;
};

export const aboutApproachEmployeeSteps: AboutApproachStep[] = [
  {
    title: "Aanmelden",
    description:
      "Je laat je gegevens, ervaring en beschikbaarheid achter via de vacatures of een aanmelding.",
  },
  {
    title: "Kennismaking & intake",
    description:
      "We bespreken wat bij je past: events, horeca, stagebouw, productie of logistiek.",
  },
  {
    title: "Matching op functie",
    description:
      "We koppelen je aan een opdracht die past bij je ervaring, motivatie en beschikbaarheid.",
  },
  {
    title: "Briefing vooraf",
    description:
      "Je ontvangt duidelijke info over locatie, tijden, kleding, taken en je aanspreekpunt.",
  },
  {
    title: "Werken op locatie",
    description:
      "Je draait mee onder begeleiding van een teamleider en bouwt praktijkervaring op.",
  },
  {
    title: "Doorgroeien",
    description:
      "Laat je zien dat je betrouwbaar bent, dan groei je door naar meer verantwoordelijkheid.",
  },
];

export const aboutApproachClientSteps: AboutApproachStep[] = [
  {
    title: "Aanvraag delen",
    description:
      "Je deelt datum, locatie, tijden, functies en aantallen via contact of planning@helpinghandsagency.nl.",
  },
  {
    title: "Intake & afstemming",
    description:
      "We stemmen de aanvraag af op functie, ervaring, veiligheid en eventuele certificaten.",
  },
  {
    title: "Matching crew",
    description:
      "We selecteren crew op basis van beschikbaarheid, ervaring en het type productie.",
  },
  {
    title: "Briefing & bevestiging",
    description:
      "Crew ontvangt een duidelijke briefing; jij krijgt bevestiging van de planning.",
  },
  {
    title: "Uitvoering op locatie",
    description:
      "Een teamleider stuurt de crew aan en is het aanspreekpunt tijdens de dienst.",
  },
  {
    title: "Afhandeling",
    description:
      "Na afloop controleren we uren, verwerken we feedback en ronden we netjes af.",
  },
];

export const aboutGrowthIntro = {
  eyebrow: "Groeien door te werken",
  title: "Van eerste opdracht naar meer verantwoordelijkheid",
  description:
    "Voor veel medewerkers is een eerste opdracht meer dan een werkdag — het is het begin van een nieuw ritme, meer zelfstandigheid en praktijkervaring die telt.",
  skills: [
    "Op tijd komen en afspraken nakomen",
    "Samenwerken binnen een professionele crew",
    "Verantwoordelijkheid nemen onder werkdruk",
    "Veilig en zelfstandig werken",
    "Communiceren met leidinggevenden",
    "Nieuwe vakvaardigheden ontwikkelen",
  ],
};

export type AboutGrowthStage = {
  step: string;
  title: string;
  description: string;
};

export const aboutGrowthPath: AboutGrowthStage[] = [
  {
    step: "01",
    title: "Nieuwe crew",
    description: "Eerste klussen, briefing volgen en laten zien dat je betrouwbaar bent.",
  },
  {
    step: "02",
    title: "Vaste crew",
    description: "Vaker ingepland worden op basis van beschikbaarheid en inzet.",
  },
  {
    step: "03",
    title: "Ervaren crew",
    description: "Meer verantwoordelijkheid op locatie en complexere producties.",
  },
  {
    step: "04",
    title: "Specialist",
    description:
      "Doorgroeien naar bijvoorbeeld heftruckchauffeur, kok of gecertificeerde kracht.",
  },
  {
    step: "05",
    title: "Teamcaptain / voorman",
    description: "Een team aansturen, aanspreekpunt zijn op locatie en kwaliteit bewaken.",
  },
];

export const aboutCta = {
  eyebrow: "Samenwerken met Helping Hands",
  title: "Klaar om samen te werken met Helping Hands?",
  description:
    "Vraag crew aan voor je volgende productie, of meld je aan als medewerker en bouw mee aan werkervaring, structuur en groei.",
  primaryCta: { label: "Personeel aanvragen", href: "/contact" },
  secondaryCta: { label: "Werken bij Helping Hands", href: "/medewerkers" },
};
