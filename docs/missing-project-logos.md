# Ontbrekende projectlogo’s

Items die **niet** op `/projecten` worden getoond omdat het verwachte lokale logo-bestand ontbreekt of nog niet officieel is.

Plaats bestanden in `public/images/logos/` met kleine letters, streepjes en geen spaties.

## Opdrachtgevers

- **MOJO**
  - verwacht bestand: `public/images/logos/opdrachtgevers/mojo.png`
  - reden: alleen een tijdelijke SVG-wordmark aanwezig; geen officieel logo

## Projecten & festivals

Geen ontbrekende items (zichtbare entries hebben een lokaal bestand).

## Locaties

Geen ontbrekende items (zichtbare entries hebben een lokaal bestand).

## Bewust verwijderd van de projectenpagina

Deze items staan niet meer in de live data (niet “missing”, maar verwijderd):

1. Ironman 70.3 Westfriesland
2. Q-dance
3. The Good Guyz
4. Your Productions
5. LOC7000
6. ID&T

## Tip

Na het toevoegen van een ontbrekend logo:

1. Bestand plaatsen met de verwachte naam
2. Entry toevoegen in `src/lib/projectLogos.ts`
3. Item uit `missingProjectLogos` en dit document halen
4. `npm run build` draaien
