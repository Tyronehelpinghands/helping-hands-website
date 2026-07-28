import { MINIMUM_BILLABLE_HOURS } from "@/lib/opdrachtgeversPolicy";

export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: FaqItem[] = [
  {
    question: "Welke crew kan ik bij Helping Hands Agency inhuren?",
    answer:
      "Wij leveren event crew, stagehands, horeca- en restaurantpersoneel, keuken- en barpersoneel, productie-assistentie, logistiek en hospitality. Van festivals en concerten tot beurzen, stadions en horecalocaties.",
  },
  {
    question: "Hoe snel kan ik personeel aanvragen?",
    answer:
      "Stuur datum, locatie, tijden, functies en aantal mensen via het contactformulier of e-mail. Bij spoedaanvragen denken we mee over wat nog haalbaar is op basis van beschikbaarheid. Bel of app 06 5741 6338, vast 035 785 7307, of mail planning@helpinghandsagency.nl.",
  },
  {
    question: "Wat moet ik aanleveren voor een snelle bezetting?",
    answer:
      "Datum, locatie, start- en eindtijd, aantal mensen, functies, kleding of PBM, contactpersoon op locatie en een korte briefing. Hoe completer, hoe sneller wij kunnen bezetten.",
  },
  {
    question: "Werken jullie vanuit Hilversum of landelijk?",
    answer:
      "Helping Hands Agency is gevestigd in Hilversum (Wandelpad 30) en levert crew door heel Nederland — van Midden-Nederland tot festivals, stadions en locaties landelijk.",
  },
  {
    question: "Werken jullie alleen met events of ook met restaurants?",
    answer:
      "Beide. Naast event- en productiecrew leveren we flexibele ondersteuning voor restaurants en horeca: bediening, runners, bar, keuken en afwas tijdens piekmomenten of tijdelijke bezetting.",
  },
  {
    question: "Wat bedoelen jullie met projectervaring op de website?",
    answer:
      "Logo’s en namen tonen sectoren en producties waar onze crew via jobs, partners of producties ervaring heeft opgedaan. Dat is geen claim van officiële partnership, tenzij dat expliciet staat vermeld.",
  },
  {
    question: "Hoe meld ik mij aan als crewlid?",
    answer:
      "Bekijk de vacatures of stuur je gegevens naar aanmeldingen@helpinghandsagency.nl. Vermeld ervaring, woonplaats, beschikbaarheid en of je ZZP of loondienst zoekt.",
  },
];

export const contactFaqs: FaqItem[] = [
  {
    question: "Welke informatie heb ik nodig voor een personeelsaanvraag?",
    answer:
      "Datum, locatie, start- en eindtijd, aantal mensen, functies, kleding of PBM, contactpersoon op locatie en een korte briefing. Hoe completer, hoe sneller wij kunnen bezetten.",
  },
  {
    question: "Kan ik een spoedaanvraag doen?",
    answer:
      "Ja. Vink spoed aan in het formulier, deel de harde deadline en bel of app ons bij échte urgentie. We kijken wat er nog mogelijk is met beschikbare crew.",
  },
  {
    question: "Hoe snel reageren jullie op een aanvraag?",
    answer:
      "We streven ernaar om zo snel mogelijk terug te koppelen, vooral bij complete aanvragen. Bij spoed: bel of WhatsApp direct naast je mail.",
  },
  {
    question: "Werken jullie landelijk?",
    answer:
      "Ja. Helping Hands Agency is gevestigd in Hilversum en levert crew door heel Nederland.",
  },
  {
    question: "Kan ik meerdere functies tegelijk aanvragen?",
    answer:
      "Ja. Vermeld alle functies en aantallen in één aanvraag — bijvoorbeeld stagehands, barbacks en runners tegelijk.",
  },
  {
    question: "Waar mail ik als opdrachtgever of als crew?",
    answer:
      "Personeelsaanvragen: planning@helpinghandsagency.nl (planner: mesbah@helpinghandsagency.nl). Crewaanmeldingen en sollicitaties: aanmeldingen@helpinghandsagency.nl. Algemene vragen: info@helpinghandsagency.nl.",
  },
  {
    question: "Wordt mijn aanvraag automatisch verstuurd?",
    answer:
      "Nee. Het formulier opent je e-mailprogramma met een kant-en-klare tekst naar het juiste adres. Jij verstuurt de mail — of kopieert de tekst als mailto niet werkt.",
  },
  {
    question: "Wat gebeurt er met mijn gegevens?",
    answer:
      "We gebruiken je gegevens alleen om je aanvraag, aanmelding of vraag op te volgen. We delen ze niet voor marketingdoeleinden.",
  },
];

export const opdrachtgeversFaqs: FaqItem[] = [
  {
    question: "Voor welke sectoren leveren jullie personeel?",
    answer:
      "Events, festivals, concerten, beurzen, stadions, horeca, restaurants, keuken, bar, stagebouw, productie, logistiek en hospitality.",
  },
  {
    question: "Hoe werkt de briefing van crew?",
    answer:
      "Na bevestiging ontvangt de crew duidelijke info over aankomst, kleding, taken, locatie en aanspreekpunt. Jij houdt één vast contact bij Helping Hands.",
  },
  {
    question: "Kunnen jullie ook restaurantpersoneel of keukenpersoneel leveren?",
    answer:
      "Ja. Denk aan bediening, hosts, runners, bartenders, barbacks, keukenhulpen, afwassers en zelfstandig werkend koks voor piekdrukte of tijdelijke bezetting.",
  },
  {
    question: "Claimen jullie officiële partnerships via de projectlogo’s?",
    answer:
      "Nee. Logo’s en namen geven projectervaring en inzetgebieden weer. Officiële partnership claimen we alleen als dat expliciet vermeld staat.",
  },
  {
    question: "Werken jullie met loondienst, payroll of zzp?",
    answer:
      "Het merendeel van onze medewerkers werkt via loondienst of payroll — voor payroll werken we samen met Fooks Payrolling. Zzp zetten we alleen in als dat beter past bij de opdracht; dit melden we vooraf en leggen we vast in onze administratie.",
  },
  {
    question: "Hoe zit het met verzekering en aansprakelijkheid van jullie medewerkers?",
    answer:
      "Onze medewerkers zijn voor hun inzet verzekerd op een manier die past bij hun dienstverband. De precieze dekking en aansprakelijkheidsafspraken leggen we niet op de website vast — die staan in de opdrachtbevestiging en onze algemene voorwaarden. Vraag ze gerust op via contact.",
  },
  {
    question: "Hoe werkt de urenregistratie bij een inzet?",
    answer:
      "Crew checkt in en uit via een roosterapp op locatie. Een teamcaptain, crewchief of planner controleert de uren aan de hand van de planning, waarna jij of je contactpersoon op locatie de uren accordeert voor verwerking.",
  },
  {
    question: "Wat gebeurt er als de geregistreerde uren afwijken van de planning?",
    answer:
      "Bij afwijkingen nemen wij eerst contact met je op om dit uit te zoeken, voordat uren definitief worden verwerkt richting facturatie. Zo voorkomen we discussie achteraf.",
  },
  {
    question: "Wat gebeurt er als een medewerker tijdens een dienst uitvalt?",
    answer:
      "We proberen zo snel mogelijk vervanging te regelen vanuit beschikbare crew. Dit lukt in de meeste gevallen, maar we kunnen niet garanderen dat er op elk moment, voor elke functie, direct een vervanger klaarstaat — vooral bij zeer kort dagelijkse spoed of specialistische functies.",
  },
  {
    question: "Zijn jullie ook buiten kantoortijden bereikbaar?",
    answer:
      "Tijdens kantoortijden zijn we altijd bereikbaar via telefoon, WhatsApp en mail. Bij lopende producties houden we ook daarbuiten actief een lijn open voor spoedmeldingen — dit is geen garantie dat elke melding letterlijk elke minuut van de nacht direct wordt opgepakt.",
  },
  {
    question: "Is er een minimale afname per medewerker?",
    answer: `Ja. Per medewerker per inzet rekenen wij standaard minimaal ${MINIMUM_BILLABLE_HOURS} declarabele uren, tenzij in de opdrachtbevestiging schriftelijk iets anders is afgesproken.`,
  },
  {
    question: "Hoe gaan jullie om met annuleringen of wijzigingen?",
    answer:
      "Hoe eerder je een wijziging of annulering doorgeeft, hoe beter we crew elders kunnen inzetten. Een individuele ziekmelding of no-show van één crewlid geldt niet als annulering van de hele opdracht. Exacte termijnen en eventuele gevolgen staan in de opdrachtbevestiging en onze algemene voorwaarden.",
  },
  {
    question: "Waar vind ik jullie algemene voorwaarden?",
    answer:
      "Onze algemene voorwaarden delen we op aanvraag. Vraag ze op via contact, dan sturen we ze je toe voordat je een opdracht bevestigt.",
  },
];

export const overOnsFaqs: FaqItem[] = [
  {
    question: "Wat is de missie van Helping Hands Agency?",
    answer:
      "Helping Hands is in 2022 opgericht door Tyrone van der Schagt om jongeren en jongvolwassenen een eerlijke kans te geven: kijken naar potentieel, motivatie en begeleiding — niet alleen naar het cv — terwijl opdrachtgevers professionele, voorbereide crew krijgen.",
  },
  {
    question: "Betekent jullie missie minder kwaliteit voor opdrachtgevers?",
    answer:
      "Nee. Onze maatschappelijke missie betekent niet dat we concessies doen aan kwaliteit. Opdrachtgevers mogen crew verwachten die op tijd is, veilig werkt en duidelijk is gebrieft — met korte lijnen en één aanspreekpunt.",
  },
  {
    question: "Wat bedoelen jullie met projectervaring?",
    answer:
      "We tonen sectoren en producties waar onze crew via jobs, partners of producties ervaring heeft opgedaan. Dat is geen claim van officiële partnership, tenzij dat expliciet staat vermeld.",
  },
  {
    question: "Hoe vraag ik personeel aan of meld ik mij aan als crew?",
    answer:
      "Opdrachtgevers: stuur datum, locatie, tijden, functies en aantallen via contact of planning@helpinghandsagency.nl. Crew: bekijk vacatures of mail aanmeldingen@helpinghandsagency.nl.",
  },
];

export const dienstenFaqs: FaqItem[] = [
  {
    question: "Welke diensten kan ik bij Helping Hands inhuren?",
    answer:
      "Event crew, stagehands, horeca- en restaurantpersoneel, keuken, bar, productie-assistentie, logistiek en hospitality — voor festivals, concerten, beurzen, stadions en horecalocaties.",
  },
  {
    question: "Wat moet ik aanleveren voor een snelle bezetting?",
    answer:
      "Datum, locatie, start- en eindtijd, aantal mensen, functies, kleding of PBM, contactpersoon op locatie en een korte briefing. Hoe completer, hoe sneller wij kunnen bezetten.",
  },
  {
    question: "Werken jullie in events én restaurants?",
    answer:
      "Beide. Naast event- en productiecrew leveren we flexibele ondersteuning voor restaurants en horeca: bediening, runners, bar, keuken en afwas.",
  },
  {
    question: "Hoe start ik een aanvraag?",
    answer:
      "Gebruik Personeel aanvragen op de contactpagina, of bel/app 06 5741 6338 / vast 035 205 7307. Vermeld datum, locatie, tijden, functies en aantal mensen.",
  },
];

export function getFaqsForPage(
  page: "home" | "contact" | "opdrachtgevers" | "over-ons" | "diensten",
): FaqItem[] {
  switch (page) {
    case "contact":
      return contactFaqs;
    case "opdrachtgevers":
      return opdrachtgeversFaqs;
    case "over-ons":
      return overOnsFaqs;
    case "diensten":
      return dienstenFaqs;
    default:
      return homeFaqs;
  }
}
