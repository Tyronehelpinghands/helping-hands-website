# Google Search Console — plan Helping Hands Agency

Domein: `https://www.helpinghandsagency.nl`  
Doel: duidelijker ranken op **commerciële event-staffing keywords** t.o.v. unrelated “Helping Hands”-merken in zorg. **Niet** concurreren op zorg/thuiszorg-termen.

## 1. Property & sitemap

1. Bevestig Search Console-property op **www** (`https://www.helpinghandsagency.nl`).
2. Dien sitemap opnieuw in: `https://www.helpinghandsagency.nl/sitemap.xml`
3. Controleer of `robots.txt` de sitemap noemt en `/dashboard`, `/portaal`, `/api`, `/login` disallows.

## 2. URL-inspectie (indexering aanvragen)

Prioriteit (na deploy):

| Prioriteit | URL |
|------------|-----|
| P0 | `/` |
| P0 | `/personeel-inhuren` |
| P0 | `/over-ons` |
| P0 | `/contact` |
| P0 | `/locaties/hilversum` |
| P1 | `/personeel-inhuren/event-crew`, `/eventpersoneel`, `/horeca-personeel`, `/horeca-uitzendbureau` |
| P1 | `/personeel-inhuren/stagehands`, `/festival-crew`, `/spoed-personeel-evenementen` |
| P1 | `/event-crew-amsterdam`, `/event-crew-hilversum`, `/horeca-personeel-hilversum` |
| P2 | Nieuwe `/locaties/*` (festival-crew-amsterdam/utrecht, eventpersoneel-*, stagehands-hilversum) |
| P2 | `/werken-bij`, `/vacatures`, `/opdrachtgevers` |

Per URL: Inspecteren → **Indexering aanvragen** als “URL staat niet op Google” of na content-update.

## 3. Redirects & legacy cleanup

Permanente 301’s (al in code):

- `/?page_id=19` → `/contact`
- `/?page_id=16` → `/opdrachtgevers`
- `/?page_id=17` → `/vacatures`
- `/?page_id=23` → `/over-ons`

Overlappende `/locaties/{dienst}-{stad}` → canonieke **root** SEO-URL’s (geen thin duplicates).

In Coverage/Pages:

- Verwacht: oude `page_id`-URL’s als redirect, niet als soft-404.
- Geen handmatige Removals tenzij soft-404 blijft hangen na 2–4 weken.

## 4. Brand & disambiguation signals

Controleer in live SERP/snippet of zichtbaar is:

- Title homepage: `Helping Hands Agency | Event crew & horecapersoneel inhuren`
- Merknaam **Helping Hands Agency** in H1/OG/Organization
- NAP: Wandelpad 30, 1211 GN Hilversum, 06 5741 6338
- Over-ons: industry statement (event staffing / live branche) — **zonder** concurrenten te noemen

## 5. Performance monitoring (8–12 weken)

Queries om te volgen (stijging gewenst):

- event crew inhuren, eventpersoneel, festival crew, stagehands inhuren
- horeca personeel inhuren, horeca uitzendbureau, catering personeel
- event crew amsterdam/hilversum/utrecht, horeca personeel hilversum

Queries om te **negeren / niet optimaliseren**:

- zorg, thuiszorg, begeleid wonen, Wmo, helpende zorg, etc.

Brand queries:

- “helping hands agency”, “helpinghandsagency”, “helping hands agency hilversum”

## 6. Sitelinks

Google kiest sitelinks automatisch. Helpen:

1. Sterke interne links (header/footer/homepage) naar `/personeel-inhuren`, `/werken-bij`, `/vacatures`, `/over-ons`, `/contact`, `/opdrachtgevers`
2. Unieke title + H1 per hub
3. Indexering aanvragen voor die URL’s
4. Wachten op recrawl (dagen–weken)

Alleen demoten in GSC als een sitelink structureel verkeerd is.

## 7. Google Business Profile (handmatig)

- Bedrijfsnaam: **Helping Hands Agency**
- Categorie: uitzendbureau / event services (passend bij staffing)
- Adres: Wandelpad 30, 1211 GN Hilversum (niet QN)
- Telefoon: 06 5741 6338 (primair)
- Website: `https://www.helpinghandsagency.nl`
- Geen nep-reviews, geen review-incentives
- Site CTA gebruikt Maps-zoek-URL of echte GBP-URL via `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` indien bekend

## 8. Checklist na elke SEO-deploy

- [ ] `npm run build` groen
- [ ] Sitemap opnieuw indienen
- [ ] P0/P1 URL’s inspecteren
- [ ] Geen nieuwe soft-404’s op redirects
- [ ] Canonicals op `https://www.helpinghandsagency.nl/...`
- [ ] NAP consistent op contact, footer, LocalBusiness JSON-LD
