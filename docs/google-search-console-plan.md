# Google Search Console — plan Helping Hands Agency

Domein: `https://www.helpinghandsagency.nl`  
Doel: duidelijker ranken op **commerciële event-staffing keywords** t.o.v. unrelated “Helping Hands”-merken in zorg. **Niet** concurreren op zorg/thuiszorg-termen.

## 1. Property & sitemap

1. Bevestig Search Console-property op **www** (`https://www.helpinghandsagency.nl`) of het **domein-property**.
2. Dien **exact** deze sitemap in (niet `/sitemap` zonder `.xml`):

   `https://www.helpinghandsagency.nl/sitemap.xml`

   `/sitemap` of `/sitemap.txt` gaf eerder **404** via de stad-catch-all. Dat is nu een rewrite naar dezelfde XML.
3. Controleer of `robots.txt` die sitemap noemt en `/dashboard`, `/portaal`, `/api`, `/login` disallows.

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

Zie volledig overzicht in `docs/seo-cleanup.md`.

Permanente 301’s (code: `src/proxy.ts` + `next.config.ts`):

- Bekende `/?page_id=` → marketingpagina’s; onbekende `page_id` → `/`
- WP-noise (`p`, `feed`, `cat`, `m`, `paged`, `attachment_id`, `author`) → `/`
- Oude slugs (`/about-us`, `/rigger`, `/sign-up`, `/wp-content/…`, `/en/…`, …) → moderne routes
- Overlappende `/locaties/{dienst}-{stad}` → canonieke **root** SEO-URL’s

### “Pagina met omleiding” = meestal géén bug

Google sluit de **bron-URL** uit en indexeert de **bestemming**. Verwacht voor:

- `http://…` en `https://helpinghandsagency.nl/…` → `https://www.helpinghandsagency.nl/…`
- Oude WP-query’s en path-aliases met 301

Controleer wel **redirect-ketens**: idealiter 1 hop. Apex→www instellen in **Vercel → Domains** (primary = www).

`/over-ons` en `/opdrachtgevers` op www zijn **200 OK**; GSC-omleiding op die paden is vrijwel altijd de non-www variant.

In Coverage/Pages:

- Verwacht: oude WP-URL’s als redirect, niet als 5xx/soft-404.
- Na fix: op 404/5xx-rapporten **Validatie starten**.
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

SERP-check (brand query): GBP toont soms categorie **“Mediation service”** — dat komt waarschijnlijk door LinkedIn-copy met “bemiddelingsbureau”. Corrigeer in GBP naar staffing/events.

- Bedrijfsnaam: **Helping Hands Agency** (volledige merknaam, niet alleen “Helping Hands”)
- Primaire categorie: **Uitzendbureau** of **Employment agency** (niet Mediation / Bemiddeling)
- Secundair: Event planner / Event venue service / Staffing agency — wat GBP toestaat en past bij crew
- Adres: Wandelpad 30, 1211 GN Hilversum (niet QN)
- Telefoon: 06 5741 6338 (primair) + vast 035 785 7307
- Website: `https://www.helpinghandsagency.nl`
- Openingstijden: ma–vr 09:00–17:30 (of actuele tijden); voorkom structureel “Closed” zonder juiste next-open
- Beschrijving: event staffing / crew / horecapersoneel — **niet** zorg of thuiszorg
- LinkedIn-bedrijfsbio: vermijd “bemiddelingsbureau”; gebruik “event staffing” / “uitzendbureau voor evenementen”
- Reviews: vraag tevreden opdrachtgevers om een echte review (geen incentives)
- Geen nep-reviews, geen review-incentives
- Site CTA gebruikt Maps-zoek-URL of echte GBP-URL via `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` indien bekend

## 8. “72 pagina’s niet geïndexeerd” (augustus 2026)

Dat getal is bijna de hele sitemap (74 URL’s live). Alle 74 geven **200 OK** — de site is niet stuk.

GSC telt in **Niet geïndexeerd** ook:

- Oude WordPress-URL’s en `/diensten/*` / `/locaties/event-crew-*` die **308/301** naar de canonieke pagina gaan (gewenst)
- Apex (`helpinghandsagency.nl`) → www
- Trailing slash (`/contact/` → `/contact`)
- Synoniem-landings (`/personeel-inhuren/eventpersoneel` e.d.) die nu naar de hoofd-URL canonicaliseren
- Login/dashboard (`noindex` / robots)

Na deploy: sitemap opnieuw indienen. P0-URL’s inspecteren + indexering aanvragen. Het oude “72” blijft even staan tot Google de redirects opnieuw classificeert — start **Validatie** op het rapport.

## 9. Checklist na elke SEO-deploy

- [ ] `npm run build` groen
- [ ] Sitemap opnieuw indienen
- [ ] P0/P1 URL’s inspecteren
- [ ] Geen nieuwe soft-404’s op redirects
- [ ] Canonicals op `https://www.helpinghandsagency.nl/...`
- [ ] NAP consistent op contact, footer, LocalBusiness JSON-LD
