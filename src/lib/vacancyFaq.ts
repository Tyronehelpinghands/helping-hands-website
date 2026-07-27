import { applicationsEmail } from "@/lib/navigation";

export type VacancyFaqItem = {
  question: string;
  answer: string;
};

export const vacancyFaqs: VacancyFaqItem[] = [
  {
    question: "Heb ik ervaring nodig om te solliciteren?",
    answer:
      "Niet altijd. Voor instaprollen zoals eventmedewerker, garderobe, runner of keukenhulp telt motivatie en betrouwbaarheid zwaar. Voor bartender, kok of leidinggevende rollen is ervaring handig of nodig. We kijken samen welke vacature bij jou past.",
  },
  {
    question: "Kan ik flexibel werken?",
    answer:
      "Ja. De meeste klussen zijn oproepbasis of projectbasis. Jij geeft je beschikbaarheid door; wij koppelen je aan passende opdrachten wanneer het past.",
  },
  {
    question: "Op wat voor locaties kan ik werken?",
    answer:
      "Afhankelijk van de opdracht werk je op events, festivals, concerten, beurzen, stadions, restaurants, horecalocaties, stagebouwlocaties en producties — landelijk, afhankelijk van de planning.",
  },
  {
    question: "Hoe krijg ik mijn planning?",
    answer:
      "Je ontvangt vooraf een duidelijke briefing met locatie, tijden, functie, kleding en aanspreekpunt. Ingeschreven crew kan ook het medewerkersportaal gebruiken voor planning en beschikbaarheid.",
  },
  {
    question: "Wat moet ik meenemen naar een klus?",
    answer:
      "Dat staat in je briefing. Vaak: afgesproken werkkleding of zwarte outfit, stevige schoenen, opgeladen telefoon en je identiteitsbewijs. Specifieke eisen (bijv. veiligheidsschoenen) vermelden we vooraf.",
  },
  {
    question: "Kan ik doorgroeien?",
    answer:
      "Ja. Wie op tijd is, goed communiceert en verantwoordelijkheid pakt, kan vaker worden ingepland en doorgroeien naar vaste crew, teamcaptain of coördinatie-ondersteuning.",
  },
  {
    question: "Kan ik ook in horeca of keuken werken?",
    answer:
      "Absoluut. Naast event crew en stagebouw hebben we horeca vacatures, barback en bartender rollen, keukenhulp, koks en restaurantbediening. Filter op Horeca, Keuken, Bar of Restaurant.",
  },
  {
    question: "Hoe snel hoor ik iets na mijn aanmelding?",
    answer: `We streven ernaar zo snel mogelijk te reageren op complete aanmeldingen via ${applicationsEmail}. In drukke periodes kan het iets langer duren — vermeld altijd je beschikbaarheid en voorkeursfunctie.`,
  },
];
