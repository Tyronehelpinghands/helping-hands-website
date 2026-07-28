/**
 * Centrale bron voor afname- en annuleringsvoorwaarden richting opdrachtgevers.
 * Wordt gebruikt op /opdrachtgevers (secties) én in de opdrachtgevers-FAQ, zodat er
 * nergens afwijkende cijfers ontstaan. Geen percentages of bedragen verzinnen: de
 * exacte termijnen en eventuele financiële gevolgen staan in de opdrachtbevestiging
 * en onze algemene voorwaarden — niet hardcoded op de website.
 */

/** Minimaal aantal declarabele uren per medewerker per inzet, tenzij anders afgesproken. */
export const MINIMUM_BILLABLE_HOURS = 5;

export const minimumAfnameText = `Per medewerker per inzet hanteren wij standaard minimaal ${MINIMUM_BILLABLE_HOURS} declarabele uren, tenzij in de opdrachtbevestiging schriftelijk iets anders is afgesproken. Dit geldt ook bij een kortere daadwerkelijke inzet.`;

export type CancellationCase = {
  title: string;
  description: string;
};

export const cancellationCases: CancellationCase[] = [
  {
    title: "Jij wijzigt of annuleert de opdracht",
    description:
      "Geef wijzigingen en annuleringen zo vroeg mogelijk door. Hoe eerder wij dit weten, hoe beter we crew elders kunnen inzetten. De exacte termijnen en eventuele gevolgen staan in de opdrachtbevestiging en onze algemene voorwaarden.",
  },
  {
    title: "Eén medewerker valt individueel uit",
    description:
      "Een ziekmelding of no-show van één crewlid is geen annulering van de hele opdracht. Wij proberen direct vervanging te regelen — zie ook 'Uitval, bereikbaarheid en vervanging' hierboven.",
  },
  {
    title: "Helping Hands moet een toezegging intrekken",
    description:
      "Komt dit uitzonderlijk voor, dan laten we dit zo snel mogelijk weten en denken we actief mee over een oplossing. Eventuele financiële afspraken hierover staan — indien van toepassing — in de opdrachtbevestiging of voorwaarden, niet standaard op deze pagina.",
  },
];

export const requestVoorwaardenCta = {
  label: "Vraag onze voorwaarden op",
  href: "/contact",
} as const;
