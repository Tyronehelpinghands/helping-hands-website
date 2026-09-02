/**
 * Algemene Voorwaarden Helping Hands Agency 2026 — tekst getrouw aan het bron-PDF.
 * Geen clausules verzinnen; alleen structuur voor weergave.
 */

export const AV_PDF_PATH = "/algemene-voorwaarden-2026.pdf" as const;
export const AV_VERSION_YEAR = "2026" as const;

export type AvClause = {
  ref: string;
  text: string;
  items?: string[];
};

export type AvSubsection = {
  title: string;
  clauses: AvClause[];
};

export type AvArticle = {
  id: string;
  number: number;
  title: string;
  /** Korte intro onder de artikeltitel (geen nieuwe rechtsregel). */
  lead?: string;
  clauses?: AvClause[];
  subsections?: AvSubsection[];
};

export const avCompanyIntro = {
  title: "Bedrijfsgegevens",
  owner: "Tyrone van der Schagt",
  kvk: "88091333",
  location: "Hilversum",
  email: "info@helpinghandsagency.nl",
  website: "www.helpinghandsagency.nl",
  branche:
    "Personeelsbemiddeling voor evenementen, horeca, hospitality, productie en logistiek.",
  description:
    "Helping Hands Agency levert personeel voor events, festivals, concerten, beurzen, horeca, hospitality, productie, logistiek en andere ondersteunende werkzaamheden.",
  workforce:
    "Het bedrijf werkt met medewerkers in loondienst, oproepkrachten, payrollkrachten en ZZP'ers.",
  applicability:
    "Deze Algemene Voorwaarden zijn van toepassing op alle opdrachten, offertes, opdrachtbevestigingen en diensten die Helping Hands Agency levert aan opdrachtgevers.",
} as const;

export const avArticles: AvArticle[] = [
  {
    id: "artikel-1",
    number: 1,
    title: "Definities",
    clauses: [
      {
        ref: "1.1",
        text: "Helping Hands Agency (HHA): de eenmanszaak Helping Hands Agency, gevestigd te Hilversum, ingeschreven bij de KvK onder nummer 88091333.",
      },
      {
        ref: "1.2",
        text: "Opdrachtgever: de natuurlijke persoon, rechtspersoon of organisatie die een opdracht verstrekt aan Helping Hands Agency.",
      },
      {
        ref: "1.3",
        text: "Medewerker: iedere persoon die via Helping Hands Agency wordt ingezet bij opdrachtgever, ongeacht contractvorm.",
      },
      {
        ref: "1.4",
        text: "Oproepkracht: een medewerker met een oproepovereenkomst die op basis van beschikbaarheid wordt ingezet.",
      },
      {
        ref: "1.5",
        text: "ZZP'er: een zelfstandige zonder personeel die via Helping Hands Agency wordt ingezet op basis van een overeenkomst van opdracht.",
      },
      {
        ref: "1.6",
        text: "Payrollkracht: een medewerker die via een payrollorganisatie is aangesteld en door Helping Hands Agency wordt ingezet.",
      },
      {
        ref: "1.7",
        text: "Dienst: de werkzaamheden die door personeel worden uitgevoerd op een specifieke datum, tijd en locatie.",
      },
      {
        ref: "1.8",
        text: "Opdracht: de overeenkomst tussen opdrachtgever en Helping Hands Agency voor het leveren van personeel of diensten.",
      },
      {
        ref: "1.9",
        text: "Opdrachtbevestiging: de schriftelijke bevestiging van een opdracht per e-mail, WhatsApp, offerte, planningstool of ander schriftelijk medium.",
      },
      {
        ref: "1.10",
        text: "Locatie: de werkplek waar personeel wordt ingezet.",
      },
      {
        ref: "1.11",
        text: "Inzet: het daadwerkelijk leveren van personeel op een opdracht.",
      },
      {
        ref: "1.12",
        text: "Uurtarief: het overeengekomen tarief per gewerkt uur, exclusief btw tenzij anders vermeld.",
      },
      {
        ref: "1.13",
        text: "Reiskosten: kosten voor woon-werkverkeer of reizen naar de locatie, indien apart overeengekomen.",
      },
      {
        ref: "1.14",
        text: "Annulering: het geheel of gedeeltelijk intrekken van een bevestigde opdracht door opdrachtgever.",
      },
      {
        ref: "1.15",
        text: "Wijziging: het aanpassen van datum, tijd, locatie, aantal medewerkers, functie of werkzaamheden na bevestiging.",
      },
      {
        ref: "1.16",
        text: "Overmacht: omstandigheden buiten redelijke controle van een partij die nakoming verhinderen.",
      },
      {
        ref: "1.17",
        text: "No-show: situatie waarin personeel op locatie verschijnt maar niet kan starten door omstandigheden aan de kant van opdrachtgever of locatie.",
      },
      {
        ref: "1.18",
        text: "Geplande uren: het aantal uren zoals bevestigd in de opdrachtbevestiging.",
      },
      {
        ref: "1.19",
        text: "Gewerkte uren: het daadwerkelijk aantal uren dat personeel op locatie heeft gewerkt.",
      },
      {
        ref: "1.20",
        text: "Verplichte aanwezigheidstijd: tijd die opdrachtgever of locatie vereist voor briefing, accreditatie, meldtijd of omkleedtijd.",
      },
      {
        ref: "1.21",
        text: "Wachttijd: tijd waarin personeel beschikbaar is maar nog niet actief kan werken door omstandigheden op locatie.",
      },
    ],
  },
  {
    id: "artikel-2",
    number: 2,
    title: "Toepasselijkheid",
    clauses: [
      {
        ref: "2.1",
        text: "Deze algemene voorwaarden zijn van toepassing op alle offertes, opdrachtbevestigingen, opdrachten, personeelsinzetten, vervolgopdrachten en diensten van Helping Hands Agency.",
      },
      {
        ref: "2.2",
        text: "Afwijkende afspraken gelden uitsluitend indien deze schriftelijk door Helping Hands Agency zijn bevestigd.",
      },
      {
        ref: "2.3",
        text: "Indien een offerte of opdrachtbevestiging afwijkt van deze algemene voorwaarden, prevaleert de offerte of opdrachtbevestiging.",
      },
      {
        ref: "2.4",
        text: "Deze algemene voorwaarden zijn eveneens van toepassing op vervolgopdrachten, aanvullende werkzaamheden en verlengingen.",
      },
      {
        ref: "2.5",
        text: "De toepasselijkheid van eventuele inkoop- of andere voorwaarden van opdrachtgever wordt uitdrukkelijk van de hand gewezen.",
      },
    ],
  },
  {
    id: "artikel-3",
    number: 3,
    title: "Offertes en opdrachtbevestiging",
    clauses: [
      {
        ref: "3.1",
        text: "Alle offertes van Helping Hands Agency zijn vrijblijvend, tenzij uitdrukkelijk anders vermeld.",
      },
      {
        ref: "3.2",
        text: "Een opdracht is definitief na akkoord per e-mail, WhatsApp, offerte, planningstool, opdrachtbevestiging of andere schriftelijke bevestiging.",
      },
      {
        ref: "3.3",
        text: "Opdrachtgever is verantwoordelijk voor het verstrekken van correcte en volledige informatie over locatie, datum, starttijd, eindtijd, werkzaamheden, kledingvoorschriften, veiligheidsregels, contactpersoon, aanmeldprocedure en accreditatie.",
      },
      {
        ref: "3.4",
        text: "Onvolledige, onjuiste of te laat verstrekte informatie komt voor rekening en risico van opdrachtgever.",
      },
      {
        ref: "3.5",
        text: "Wijzigingen in een bevestigde opdracht moeten zo vroeg mogelijk schriftelijk aan Helping Hands Agency worden doorgegeven.",
      },
    ],
  },
  {
    id: "artikel-4",
    number: 4,
    title: "Inzet van personeel",
    clauses: [
      {
        ref: "4.1",
        text: "Helping Hands Agency spant zich in om geschikt en gekwalificeerd personeel te leveren conform de opdracht.",
      },
      {
        ref: "4.2",
        text: "Helping Hands Agency is gerechtigd personeel te vervangen bij ziekte, verhindering of operationele noodzaak, zonder dat dit de opdracht beëindigt.",
      },
      {
        ref: "4.3",
        text: "Opdrachtgever is verplicht personeel professioneel, veilig en respectvol te behandelen.",
      },
      {
        ref: "4.4",
        text: "Discriminatie, agressie, intimidatie, bedreiging of onveilige werkomstandigheden kunnen voor Helping Hands Agency reden zijn om personeel per direct terug te trekken.",
      },
      {
        ref: "4.5",
        text: "Indien personeel wordt teruggetrokken door omstandigheden aan de kant van opdrachtgever of locatie, blijven de geplande uren volledig verschuldigd.",
      },
    ],
  },
  {
    id: "artikel-5",
    number: 5,
    title: "Werkzaamheden",
    clauses: [
      {
        ref: "5.1",
        text: "Helping Hands Agency kan personeel leveren voor onder meer de volgende werkzaamheden:",
        items: [
          "stagehand werkzaamheden;",
          "opbouw en afbouw;",
          "horeca;",
          "hospitality;",
          "runners;",
          "logistiek;",
          "laden en lossen;",
          "productieondersteuning;",
          "festivals en concerten;",
          "beurzen en zakelijke events;",
          "crew- en locatiewerkzaamheden;",
          "andere ondersteunende werkzaamheden op locatie.",
        ],
      },
      {
        ref: "5.2",
        text: "De exacte werkzaamheden worden vastgelegd in de opdrachtbevestiging. Helping Hands Agency is niet verantwoordelijk voor werkzaamheden die buiten de opdracht vallen.",
      },
    ],
  },
  {
    id: "artikel-6",
    number: 6,
    title: "Tarieven",
    clauses: [
      {
        ref: "6.1",
        text: "De tarieven voor personeelsinzet staan vermeld in de offerte of opdrachtbevestiging.",
      },
      {
        ref: "6.2",
        text: "Alle bedragen zijn exclusief btw, tenzij uitdrukkelijk anders vermeld.",
      },
      {
        ref: "6.3",
        text: "Het standaardtarief van Helping Hands Agency bedraagt €31,50 exclusief btw per uur, tenzij schriftelijk anders overeengekomen.",
      },
      {
        ref: "6.4",
        text: "Reiskosten, parkeerkosten, OV-kosten, hotelkosten, accreditatiekosten en andere opdrachtgerelateerde kosten kunnen apart worden doorbelast aan opdrachtgever.",
      },
      {
        ref: "6.5",
        text: "Toeslagen kunnen gelden voor nachtwerk, weekendwerk, feestdagen, spoedaanvragen, last-minute wijzigingen, wachttijd, reistijd en verlenging op locatie.",
      },
      {
        ref: "6.6",
        text: "Bij grote opdrachten vanaf 25 medewerkers kunnen afwijkende prijsafspraken gelden, mits schriftelijk bevestigd.",
      },
    ],
  },
  {
    id: "artikel-7",
    number: 7,
    title: "Urenregistratie",
    clauses: [
      {
        ref: "7.1",
        text: "Gewerkte uren worden geregistreerd via urenlijst, app, e-mail, WhatsApp, planningstool, opdrachtgeverregistratie of interne registratie van Helping Hands Agency.",
      },
      {
        ref: "7.2",
        text: "Opdrachtgever dient de geregistreerde uren direct of uiterlijk binnen 48 uur na afloop van de dienst te controleren.",
      },
      {
        ref: "7.3",
        text: "Zonder schriftelijk bezwaar binnen 48 uur worden de geregistreerde uren als akkoord beschouwd en vormen zij de basis voor facturatie.",
      },
      {
        ref: "7.4",
        text: "Verplichte meldtijd, briefing, wachttijd, accreditatie, omkleedtijd en verplichte aanwezigheid kunnen worden gefactureerd indien opdrachtgever of locatie dit vereist.",
      },
      {
        ref: "7.5",
        text: "Indien medewerkers langer moeten blijven dan de bevestigde eindtijd, worden de extra uren volledig doorberekend.",
      },
      {
        ref: "7.6",
        text: "Afgeronde uren of een minimale inzetduur kunnen gelden indien dit vooraf schriftelijk is bevestigd.",
      },
    ],
  },
  {
    id: "artikel-8",
    number: 8,
    title: "Pauzes, roosterwijzigingen en starttijden",
    lead:
      "Pauzes zijn betaald tenzij vooraf schriftelijk anders overeengekomen. Facturatie start vanaf de afgesproken starttijd.",
    subsections: [
      {
        title: "Pauzes",
        clauses: [
          {
            ref: "8.1",
            text: "Pauzes zijn betaald en facturabel, tenzij vooraf schriftelijk anders is overeengekomen in de offerte, opdrachtbevestiging, planning, e-mail, WhatsApp of andere schriftelijke bevestiging. Zonder schriftelijke afspraak vooraf worden pauzes als gewerkte tijd beschouwd.",
          },
          {
            ref: "8.2",
            text: "Opdrachtgever mag na afloop van de opdracht niet eenzijdig pauzes in mindering brengen op de gewerkte uren indien deze pauzes niet vooraf schriftelijk zijn overeengekomen.",
          },
          {
            ref: "8.3",
            text: "Een pauze geldt uitsluitend als pauze indien de medewerker daadwerkelijk vrij is van werkzaamheden, de werkplek mag verlaten of aantoonbaar geen werkzaamheden hoeft uit te voeren.",
          },
          {
            ref: "8.4",
            text: "Indien personeel tijdens een pauze beschikbaar moet blijven, moet wachten, bereikbaar moet zijn, instructies moet opvolgen, op locatie moet blijven zonder vrije invulling, of niet daadwerkelijk pauze kan houden, wordt deze tijd als gewerkte tijd en facturabele tijd beschouwd.",
          },
          {
            ref: "8.5",
            text: "Indien een vooraf afgesproken pauze door drukte, planning, instructies of omstandigheden op locatie niet of niet volledig kan worden opgenomen, blijft deze tijd volledig facturabel.",
          },
        ],
      },
      {
        title: "Roosterwijzigingen",
        clauses: [
          {
            ref: "8.6",
            text: "Wijzigingen in starttijd, eindtijd, meldtijd, locatie, werkzaamheden, functie of aantal medewerkers moeten minimaal 24 uur vóór aanvang schriftelijk door opdrachtgever worden doorgegeven en door Helping Hands Agency schriftelijk worden bevestigd.",
          },
          {
            ref: "8.7",
            text: "Een wijziging binnen 24 uur vóór aanvang is uitsluitend geldig indien Helping Hands Agency deze schriftelijk accepteert. Zonder schriftelijke acceptatie blijft de oorspronkelijke opdrachtbevestiging leidend.",
          },
        ],
      },
      {
        title: "Starttijd en facturatie",
        clauses: [
          {
            ref: "8.8",
            text: "Indien personeel is ingepland en beschikbaar is op basis van de afgesproken starttijd, wordt vanaf de oorspronkelijk afgesproken starttijd gefactureerd. Dit geldt ook indien opdrachtgever de starttijd later probeert te wijzigen, het personeel later laat beginnen, de locatie nog niet gereed is, de accreditatie ontbreekt, de briefing vertraagd is of opdrachtgever op locatie nog geen werkzaamheden kan aanbieden.",
          },
          {
            ref: "8.9",
            text: "Wachttijd door vertraging, onduidelijke instructies, ontbrekende toegang, ontbrekende accreditatie, gewijzigde planning of omstandigheden aan de kant van opdrachtgever of locatie wordt volledig doorberekend als facturabele tijd.",
          },
          {
            ref: "8.10",
            text: "Bij een te late, onduidelijke of niet-bevestigde wijziging blijven de oorspronkelijk bevestigde uren, starttijd, eindtijd en geplande inzet volledig leidend voor facturatie.",
          },
        ],
      },
      {
        title: "Verhouding tot annuleringsregeling",
        clauses: [
          {
            ref: "8.11",
            text: "Deze 24-uursregeling geldt voor praktische roosterwijzigingen en doet niets af aan de strengere annuleringsregeling van Helping Hands Agency. Annulering, verlaging of vermindering van uren binnen 4 kalenderdagen / 96 uur vóór aanvang blijft volledig facturabel conform de annuleringsvoorwaarden uit artikel 10. De 4-dagenregeling is specifiek van toepassing op personeel in loondienst, oproepkrachten en payrollkrachten waarvoor Helping Hands Agency wettelijk gehouden kan zijn loon door te betalen.",
          },
        ],
      },
    ],
  },
  {
    id: "artikel-9",
    number: 9,
    title: "Contact met personeel en communicatieprotocol",
    lead:
      "Alle planning, wijzigingen, toekomstige inzet en communicatie over personeel verloopt via Helping Hands Agency. Rechtstreeks contact met personeel zonder voorafgaande schriftelijke toestemming van Helping Hands Agency is niet toegestaan.",
    clauses: [
      {
        ref: "9.1",
        text: "Alle communicatie over planning, beschikbaarheid, wijzigingen, annuleringen, extra inzet, tarieven, functies, werktijden, roosters en toekomstige opdrachten verloopt uitsluitend via Helping Hands Agency, tenzij Helping Hands Agency vooraf schriftelijk anders heeft bevestigd.",
      },
      {
        ref: "9.2",
        text: "Opdrachtgever mag medewerkers, oproepkrachten, payrollers, ZZP'ers, kandidaten of andere via Helping Hands Agency ingezette krachten niet rechtstreeks benaderen via WhatsApp, telefoon, e-mail, social media, privéberichten of andere kanalen voor planning, beschikbaarheid, toekomstige opdrachten, extra diensten, tarieven, wijzigingen of afspraken buiten Helping Hands Agency om, zonder voorafgaande schriftelijke toestemming van Helping Hands Agency. Noodzakelijke operationele instructies tijdens een lopende opdracht vallen onder artikel 9.3.",
      },
      {
        ref: "9.3",
        text: "Direct contact met personeel is uitsluitend toegestaan voor noodzakelijke operationele instructies tijdens een lopende opdracht op locatie, zoals veiligheidsinstructies, werkverdeling, pauzetijden op locatie en directe uitvoeringsinformatie. Dit contact mag niet worden gebruikt voor planning, tariefafspraken, toekomstige opdrachten, extra shifts, annuleringen, klachtenafhandeling, overname, doorboeking of afspraken buiten Helping Hands Agency om.",
      },
      {
        ref: "9.4",
        text: "Indien opdrachtgever direct contact wil opnemen met personeel vóór, tijdens of na een opdracht over planning, beschikbaarheid, aanvullende inzet, wijzigingen of toekomstige werkzaamheden, moet opdrachtgever dit vooraf schriftelijk melden én schriftelijke toestemming krijgen van Helping Hands Agency via WhatsApp of e-mail.",
      },
      {
        ref: "9.5",
        text: "Het is opdrachtgever verboden om personeel rechtstreeks toe te voegen aan WhatsApp-groepen, planningsgroepen, roostersystemen, e-maillijsten of andere communicatiekanalen zonder voorafgaande schriftelijke toestemming van Helping Hands Agency, tenzij dit noodzakelijk is voor één specifieke lopende opdracht en Helping Hands Agency hiervoor vooraf schriftelijk toestemming heeft verleend.",
      },
      {
        ref: "9.6",
        text: "Indien opdrachtgever rechtstreeks contact opneemt met personeel zonder voorafgaande schriftelijke toestemming van Helping Hands Agency, is opdrachtgever per overtreding een direct opeisbare contractuele boete verschuldigd van €1.000 per overtreding, met een maximum van €5.000 per opdracht, onverminderd het recht van Helping Hands Agency op aanvullende schadevergoeding indien de daadwerkelijke schade hoger is.",
      },
      {
        ref: "9.7",
        text: "Indien het directe contact leidt tot omzeiling, rechtstreekse inzet, overname, indienstneming, inhuring of samenwerking buiten Helping Hands Agency om, geldt daarnaast de vergoeding zoals opgenomen in artikel 20 (Overname en benadering van personeel).",
      },
      {
        ref: "9.8",
        text: "Onder overtreding wordt verstaan iedere afzonderlijke vorm van direct contact, benadering, uitnodiging, appbericht, telefoongesprek, e-mail, social media-bericht, toevoeging aan een groep of andere communicatie met personeel zonder voorafgaande schriftelijke toestemming van Helping Hands Agency.",
      },
      {
        ref: "9.9",
        text: "Deze bepaling is bedoeld om planning, verantwoordelijkheid, urenregistratie, veiligheid, communicatie, aansprakelijkheid en naleving van afspraken centraal via Helping Hands Agency te laten verlopen.",
      },
    ],
  },
  {
    id: "artikel-10",
    number: 10,
    title: "Annulering door opdrachtgever",
    lead:
      "Annulering binnen 4 kalenderdagen (loondienst) of 24 uur (ZZP) is 100% facturabel. Per contractvorm gelden aparte termijnen.",
    subsections: [
      {
        title: "Toepassing per contractvorm",
        clauses: [
          {
            ref: "10.1",
            text: "De annuleringsregeling wordt toegepast per ingezette kracht en per contractvorm. Voor ZZP'ers geldt de regeling zoals opgenomen in artikel 10.2 tot en met 10.4. Voor medewerkers in loondienst, oproepkrachten, payrollkrachten en andere werknemers geldt de regeling zoals opgenomen in artikel 10.5 tot en met 10.7.",
          },
        ],
      },
      {
        title: "Annulering ZZP'ers",
        clauses: [
          {
            ref: "10.2",
            text: "Annulering van een opdracht voor ZZP'ers meer dan 48 uur vóór de geplande aanvang is kosteloos, tenzij Helping Hands Agency al aantoonbare kosten heeft gemaakt of de ZZP'er al definitief is vastgelegd en hiervoor kosten verschuldigd zijn.",
          },
          {
            ref: "10.3",
            text: "Bij annulering van een opdracht voor ZZP'ers tussen 48 en 24 uur vóór de geplande aanvang is opdrachtgever 50% van de geplande uren verschuldigd, vermeerderd met reeds gemaakte kosten.",
          },
          {
            ref: "10.4",
            text: "Bij annulering van een opdracht voor ZZP'ers binnen 24 uur vóór de geplande aanvang is opdrachtgever 100% van de geplande uren verschuldigd, vermeerderd met reeds gemaakte kosten.",
          },
        ],
      },
      {
        title: "Annulering loondienst, oproepkrachten en payrollkrachten",
        clauses: [
          {
            ref: "10.5",
            text: "Annulering van een opdracht voor medewerkers in loondienst, oproepkrachten, payrollkrachten of andere werknemers meer dan 4 kalenderdagen / 96 uur vóór de geplande aanvang is kosteloos, tenzij Helping Hands Agency al aantoonbare kosten heeft gemaakt of personeel al definitief heeft vastgelegd.",
          },
          {
            ref: "10.6",
            text: "Bij annulering, verlaging of vermindering van uren voor medewerkers in loondienst, oproepkrachten, payrollkrachten of andere werknemers binnen 4 kalenderdagen / 96 uur vóór de geplande aanvang is opdrachtgever 100% van de geplande uren verschuldigd, vermeerderd met reeds gemaakte kosten.",
          },
          {
            ref: "10.7",
            text: "Indien opdrachtgever binnen 4 kalenderdagen / 96 uur vóór aanvang de starttijd, eindtijd, datum, locatie, functie, werkzaamheden of het aantal medewerkers verlaagt of wijzigt voor medewerkers in loondienst, oproepkrachten, payrollkrachten of andere werknemers, blijven de oorspronkelijk bevestigde uren volledig verschuldigd.",
          },
        ],
      },
      {
        title: "Overige bepalingen",
        clauses: [
          {
            ref: "10.8",
            text: "Indien een opdracht bestaat uit een combinatie van ZZP'ers, medewerkers in loondienst, oproepkrachten, payrollkrachten of andere werknemers, wordt de annuleringsregeling per persoon en per contractvorm toegepast.",
          },
          {
            ref: "10.9",
            text: "Indien opdrachtgever extra uren, extra medewerkers of verlenging aanvraagt, worden deze extra uren volledig doorberekend tegen het overeengekomen tarief.",
          },
          {
            ref: "10.10",
            text: "Indien personeel op locatie verschijnt maar niet kan starten door foutieve informatie, ontbrekende accreditatie, geen toegang, verkeerde planning, een geannuleerd event of andere omstandigheden aan de kant van opdrachtgever of locatie, is opdrachtgever 100% van de geplande uren verschuldigd.",
          },
          {
            ref: "10.11",
            text: "Helping Hands Agency werkt onder meer met medewerkers in loondienst, oproepkrachten, payrollkrachten en andere ingeplande werknemers. Bij annulering, verlaging of wijziging binnen 4 kalenderdagen kan Helping Hands Agency op grond van het Burgerlijk Wetboek, toepasselijke arbeidsvoorwaarden, payrollafspraken of loonverplichtingen gehouden zijn loon, oproepuren of vergoedingen door te betalen. Dit risico wordt volledig aan opdrachtgever doorbelast.",
          },
          {
            ref: "10.12",
            text: "Bij opdrachten vanaf 25 medewerkers, meerdaagse opdrachten, spoedopdrachten of maatwerkprojecten kan Helping Hands Agency afwijkende annuleringsvoorwaarden hanteren, mits schriftelijk bevestigd.",
          },
        ],
      },
    ],
  },
  {
    id: "artikel-11",
    number: 11,
    title: "Annulering door Helping Hands Agency",
    clauses: [
      {
        ref: "11.1",
        text: "Helping Hands Agency mag annuleren, wijzigen of opschorten bij overmacht, ziekte, veiligheidsrisico's, betalingsachterstand, onjuiste informatie, reputatierisico of omstandigheden buiten haar controle.",
      },
      {
        ref: "11.2",
        text: "Helping Hands Agency probeert waar mogelijk vervanging of een passende oplossing te regelen.",
      },
      {
        ref: "11.3",
        text: "Helping Hands Agency is niet aansprakelijk voor indirecte schade, gevolgschade, omzetverlies of reputatieschade als gevolg van annulering.",
      },
    ],
  },
  {
    id: "artikel-12",
    number: 12,
    title: "Wijzigingen door opdrachtgever",
    clauses: [
      {
        ref: "12.1",
        text: "Wijzigingen in datum, tijd, locatie, werkzaamheden, aantal medewerkers of functie moeten zo vroeg mogelijk schriftelijk worden doorgegeven.",
      },
      {
        ref: "12.2",
        text: "Helping Hands Agency kan niet garanderen dat last-minute wijzigingen mogelijk zijn.",
      },
      {
        ref: "12.3",
        text: "Extra kosten door wijzigingen worden doorbelast aan opdrachtgever.",
      },
      {
        ref: "12.4",
        text: "Bij vermindering van het aantal medewerkers of uren binnen 4 kalenderdagen vóór aanvang blijven de oorspronkelijk bevestigde uren volledig verschuldigd.",
      },
    ],
  },
  {
    id: "artikel-13",
    number: 13,
    title: "Betaling",
    lead:
      "Betalingstermijn is 14 dagen. Bij betalingsachterstand mag HHA opdrachten opschorten. Bezwaar binnen 7 dagen melden.",
    clauses: [
      {
        ref: "13.1",
        text: "De betalingstermijn is 14 kalenderdagen na factuurdatum, tenzij schriftelijk anders overeengekomen.",
      },
      {
        ref: "13.2",
        text: "Bij nieuwe klanten mag Helping Hands Agency vooruitbetaling of aanbetaling vragen voorafgaand aan de opdracht.",
      },
      {
        ref: "13.3",
        text: "Bij late betaling is Helping Hands Agency gerechtigd wettelijke handelsrente, incassokosten en redelijke administratiekosten in rekening te brengen.",
      },
      {
        ref: "13.4",
        text: "Bij betalingsachterstand mag Helping Hands Agency nieuwe of lopende opdrachten opschorten zonder aansprakelijkheid voor eventuele gevolgen.",
      },
      {
        ref: "13.5",
        text: "Bezwaar tegen een factuur moet binnen 7 kalenderdagen na factuurdatum schriftelijk worden gemeld. Na deze termijn wordt de factuur als akkoord beschouwd.",
      },
      {
        ref: "13.6",
        text: "Klachten over de uitvoering schorten de betalingsverplichting niet automatisch op.",
      },
    ],
  },
  {
    id: "artikel-14",
    number: 14,
    title: "Klachten",
    clauses: [
      {
        ref: "14.1",
        text: "Klachten over personeel, werkzaamheden of uitvoering moeten direct tijdens de opdracht worden gemeld aan Helping Hands Agency.",
      },
      {
        ref: "14.2",
        text: "Uiterlijk binnen 24 uur na afloop van de opdracht moeten klachten schriftelijk worden bevestigd per e-mail.",
      },
      {
        ref: "14.3",
        text: "Opdrachtgever moet Helping Hands Agency de kans geven om het probleem op te lossen of te herstellen.",
      },
      {
        ref: "14.4",
        text: "Klachten achteraf zonder bewijs of zonder tijdige melding worden niet automatisch geaccepteerd.",
      },
      {
        ref: "14.5",
        text: "Klachten geven geen automatisch recht op korting, verrekening of opschorting van betaling.",
      },
    ],
  },
  {
    id: "artikel-15",
    number: 15,
    title: "Veiligheid en verantwoordelijkheid locatie",
    clauses: [
      {
        ref: "15.1",
        text: "Opdrachtgever is verantwoordelijk voor veilige werkomstandigheden op de locatie.",
      },
      {
        ref: "15.2",
        text: "Opdrachtgever zorgt voor duidelijke instructies, persoonlijke beschermingsmiddelen indien nodig, toegang, pauzes, toiletten, drinkwater, veiligheidsbriefing en toezicht.",
      },
      {
        ref: "15.3",
        text: "Opdrachtgever is verantwoordelijk voor vergunningen, veiligheidsplannen, locatie-eisen en naleving van veiligheidsregels.",
      },
      {
        ref: "15.4",
        text: "Helping Hands Agency mag personeel terugtrekken bij onveilige situaties zonder aansprakelijkheid.",
      },
      {
        ref: "15.5",
        text: "Opdrachtgever blijft in dat geval de geplande uren verschuldigd als de onveilige situatie aan opdrachtgever of locatie te wijten is.",
      },
    ],
  },
  {
    id: "artikel-16",
    number: 16,
    title: "Gedrag op locatie",
    clauses: [
      {
        ref: "16.1",
        text: "Opdrachtgever moet zorgen voor een professionele en respectvolle werkomgeving voor ingezet personeel.",
      },
      {
        ref: "16.2",
        text: "Agressie, discriminatie, intimidatie, bedreiging, seksuele intimidatie of misbruik richting personeel wordt niet geaccepteerd.",
      },
      {
        ref: "16.3",
        text: "Helping Hands Agency mag personeel direct terugtrekken bij ongewenst gedrag of onveiligheid.",
      },
      {
        ref: "16.4",
        text: "Schade of kosten door dit soort situaties kunnen aan opdrachtgever worden doorbelast. Geplande uren blijven verschuldigd.",
      },
    ],
  },
  {
    id: "artikel-17",
    number: 17,
    title: "Aansprakelijkheid",
    lead:
      "Aansprakelijkheid is beperkt tot het factuurbedrag. HHA is niet aansprakelijk voor indirecte of gevolgschade.",
    clauses: [
      {
        ref: "17.1",
        text: "Helping Hands Agency is uitsluitend aansprakelijk voor directe schade die aantoonbaar is veroorzaakt door een toerekenbare tekortkoming van Helping Hands Agency.",
      },
      {
        ref: "17.2",
        text: "De aansprakelijkheid van Helping Hands Agency is beperkt tot het factuurbedrag van de betreffende opdracht, dan wel het bedrag dat de aansprakelijkheidsverzekering in het betreffende geval uitkeert.",
      },
      {
        ref: "17.3",
        text: "Helping Hands Agency is niet aansprakelijk voor indirecte schade, gevolgschade, omzetverlies, vertraging, reputatieschade, gemiste inkomsten, boetes van derden of schade veroorzaakt door derden.",
      },
      {
        ref: "17.4",
        text: "Opdrachtgever moet schade direct schriftelijk melden en aantonen.",
      },
      {
        ref: "17.5",
        text: "Opdrachtgever is verantwoordelijk voor de werklocatie, materialen, instructies en veiligheid.",
      },
    ],
  },
  {
    id: "artikel-18",
    number: 18,
    title: "Schade door personeel",
    clauses: [
      {
        ref: "18.1",
        text: "Schade moet direct worden gemeld aan Helping Hands Agency.",
      },
      {
        ref: "18.2",
        text: "Opdrachtgever moet aantonen dat schade daadwerkelijk is veroorzaakt door personeel dat via Helping Hands Agency is ingezet.",
      },
      {
        ref: "18.3",
        text: "Normale gebruiksschade, onduidelijke schade of schade zonder bewijs wordt niet automatisch vergoed.",
      },
      {
        ref: "18.4",
        text: "Helping Hands Agency krijgt altijd de mogelijkheid om schade te onderzoeken voordat aansprakelijkheid wordt erkend.",
      },
      {
        ref: "18.5",
        text: "Aansprakelijkheid blijft beperkt zoals opgenomen in artikel 17.",
      },
    ],
  },
  {
    id: "artikel-19",
    number: 19,
    title: "Overmacht",
    clauses: [
      {
        ref: "19.1",
        text: "Overmacht omvat onder andere: ziekte, extreme weersomstandigheden, files, OV-storingen, staking, stroomstoring, overheidsmaatregelen, calamiteiten, veiligheidsrisico's, technische storingen, pandemie, terreurdreiging, brand, uitval van personeel of andere omstandigheden buiten redelijke controle.",
      },
      {
        ref: "19.2",
        text: "Bij overmacht is Helping Hands Agency niet aansprakelijk voor het niet of niet-tijdig nakomen van verplichtingen.",
      },
      {
        ref: "19.3",
        text: "Verplichtingen kunnen worden opgeschort zolang de overmacht voortduurt.",
      },
      {
        ref: "19.4",
        text: "Reeds uitgevoerde werkzaamheden en gemaakte kosten blijven verschuldigd.",
      },
    ],
  },
  {
    id: "artikel-20",
    number: 20,
    title: "Overname en benadering van personeel",
    clauses: [
      {
        ref: "20.1",
        text: "Opdrachtgever mag medewerkers, oproepkrachten, payrollers, ZZP'ers, kandidaten of andere krachten van Helping Hands Agency niet direct of indirect benaderen, aannemen, inhuren of inzetten buiten Helping Hands Agency om.",
      },
      {
        ref: "20.2",
        text: "Dit verbod geldt tijdens de samenwerking en gedurende 12 maanden na de laatste inzet of kennismaking.",
      },
      {
        ref: "20.3",
        text: "Dit verbod geldt ook wanneer benadering plaatsvindt via derden, andere bedrijven, tussenpersonen of groepsmaatschappijen.",
      },
      {
        ref: "20.4",
        text: "Bij overtreding van dit artikel is opdrachtgever een direct opeisbare vergoeding verschuldigd van €5.000 per persoon, dan wel 25% van het verwachte bruto jaarsalaris of jaaromzet van de betreffende persoon, afhankelijk van welk bedrag hoger is.",
      },
      {
        ref: "20.5",
        text: "Deze vergoeding laat het recht van Helping Hands Agency op aanvullende schadevergoeding onverlet.",
      },
      {
        ref: "20.6",
        text: "Het verbod op overname en benadering geldt naast het algemene communicatieprotocol uit artikel 9. Direct contact zonder voorafgaande schriftelijke toestemming van Helping Hands Agency kan worden beschouwd als een poging tot omzeiling indien dit contact betrekking heeft op beschikbaarheid, tarieven, toekomstige opdrachten, extra diensten of rechtstreekse inzet.",
      },
      {
        ref: "20.7",
        text: "De boete voor ongeoorloofd direct contact (artikel 9.6) staat los van de hogere vergoeding voor overname, omzeiling of rechtstreekse inzet buiten Helping Hands Agency om zoals opgenomen in dit artikel.",
      },
    ],
  },
  {
    id: "artikel-21",
    number: 21,
    title: "Geheimhouding",
    clauses: [
      {
        ref: "21.1",
        text: "Tarieven, klantgegevens, personeelsgegevens, planningen, draaiboeken, contactgegevens, offertes, werkwijzen en bedrijfsinformatie van Helping Hands Agency zijn vertrouwelijk.",
      },
      {
        ref: "21.2",
        text: "Beide partijen zijn verplicht vertrouwelijke informatie geheim te houden en niet met derden te delen zonder schriftelijke toestemming.",
      },
      {
        ref: "21.3",
        text: "Deze geheimhoudingsverplichting blijft ook na afloop van de samenwerking onverminderd van kracht.",
      },
    ],
  },
  {
    id: "artikel-22",
    number: 22,
    title: "Privacy / AVG",
    clauses: [
      {
        ref: "22.1",
        text: "Helping Hands Agency verwerkt persoonsgegevens voor planning, administratie, facturatie, uitvoering van opdrachten en wettelijke verplichtingen.",
      },
      {
        ref: "22.2",
        text: "Opdrachtgever mag persoonsgegevens van ingezet personeel uitsluitend gebruiken voor de betreffende opdracht.",
      },
      {
        ref: "22.3",
        text: "Persoonsgegevens mogen niet worden gedeeld met derden zonder noodzaak of uitdrukkelijke toestemming.",
      },
      {
        ref: "22.4",
        text: "Beide partijen houden zich aan de Algemene Verordening Gegevensbescherming (AVG).",
      },
    ],
  },
  {
    id: "artikel-23",
    number: 23,
    title: "Gebruik van naam, logo, foto en promotie",
    clauses: [
      {
        ref: "23.1",
        text: "Helping Hands Agency mag opdrachtgever als referentie noemen, tenzij opdrachtgever hier schriftelijk bezwaar tegen maakt.",
      },
      {
        ref: "23.2",
        text: "Foto's en video's van personeel mogen alleen met toestemming van de betreffende persoon worden gebruikt.",
      },
      {
        ref: "23.3",
        text: "Opdrachtgever mag personeel niet filmen, fotograferen of publiceren op een manier die privacygevoelig is zonder uitdrukkelijke toestemming.",
      },
      {
        ref: "23.4",
        text: "Huisstijl, documenten, formats, werkwijzen en teksten van Helping Hands Agency blijven eigendom van Helping Hands Agency.",
      },
    ],
  },
  {
    id: "artikel-24",
    number: 24,
    title: "Opschorting en beëindiging",
    clauses: [
      {
        ref: "24.1",
        text: "Helping Hands Agency mag opdrachten opschorten of beëindigen bij betalingsachterstand, onveiligheid, agressie, discriminatie, misbruik, reputatierisico, foutieve informatie of schending van afspraken.",
      },
      {
        ref: "24.2",
        text: "Reeds geplande, uitgevoerde en verschuldigde kosten blijven volledig opeisbaar.",
      },
      {
        ref: "24.3",
        text: "Helping Hands Agency is niet aansprakelijk voor schade door opschorting of beëindiging wanneer de oorzaak bij opdrachtgever ligt.",
      },
    ],
  },
  {
    id: "artikel-25",
    number: 25,
    title: "Slotbepalingen",
    clauses: [
      {
        ref: "25.1",
        text: "Indien één of meerdere bepalingen uit deze algemene voorwaarden ongeldig, nietig of niet-afdwingbaar blijken te zijn, blijven de overige bepalingen volledig van kracht.",
      },
      {
        ref: "25.2",
        text: "Partijen zullen in dat geval de ongeldige of niet-afdwingbare bepaling vervangen door een geldige bepaling die zoveel mogelijk aansluit bij het doel en de strekking van de oorspronkelijke bepaling.",
      },
      {
        ref: "25.3",
        text: "Helping Hands Agency is gerechtigd deze algemene voorwaarden te wijzigen. De gewijzigde voorwaarden gelden voor nieuwe opdrachten en vervolgopdrachten nadat deze aan opdrachtgever zijn verstrekt of kenbaar zijn gemaakt.",
      },
      {
        ref: "25.4",
        text: "Indien opdrachtgever na ontvangst van gewijzigde algemene voorwaarden een nieuwe opdracht verstrekt of gebruik blijft maken van diensten van Helping Hands Agency, wordt opdrachtgever geacht met de gewijzigde voorwaarden akkoord te zijn gegaan, tenzij schriftelijk bezwaar is gemaakt.",
      },
    ],
  },
  {
    id: "artikel-26",
    number: 26,
    title: "Toepasselijk recht en geschillen",
    clauses: [
      {
        ref: "26.1",
        text: "Op deze algemene voorwaarden en alle opdrachten is Nederlands recht van toepassing.",
      },
      {
        ref: "26.2",
        text: "Partijen proberen geschillen eerst onderling op te lossen in goed overleg.",
      },
      {
        ref: "26.3",
        text: "Indien onderling overleg niet tot een oplossing leidt, wordt het geschil voorgelegd aan de bevoegde rechter in het arrondissement Midden-Nederland, tenzij dwingend recht anders bepaalt.",
      },
    ],
  },
];
