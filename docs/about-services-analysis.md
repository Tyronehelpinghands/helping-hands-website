# Analyse: Over ons & Diensten — Helping Hands Agency

**Datum:** 27 juli 2026  
**Live:**  
- https://helping-hands-website.vercel.app/over-ons  
- https://helping-hands-website.vercel.app/diensten  
**Scope:** Analyse only — geen redesign, geen route-breaking, geen willekeurige tekstinkorting in deze taak.

---

## Projectcontext (bron van waarheid)

Helping Hands Agency is in **2022** opgericht door **Tyrone van der Schagt**.

**Missie (crewkant):** jongeren en jongvolwassenen die moeite hebben om werk te vinden/houden, in een uitkering zitten, weinig ervaring hebben of niet op de juiste plek zitten — kijken naar **potentieel, motivatie, begeleiding en groei**, niet alleen naar het CV. Structuur, ervaring, verantwoordelijkheid, groeipaden.

**Professioneel (opdrachtgeverskant):** betrouwbare crew, duidelijke briefing, voorbereiding, korte lijnen, professionele uitvoering in events / horeca / stagebouw / productie / logistiek. Samenwerking met grote/ervaren organisaties.

**Veilige claimtaal (hard):** projectervaring via jobs, partners en producties. **Nooit** “officiële partner”, geen partnership-claims tenzij expliciet waar. Formuleer als inzet/projectervaring.

Deze context staat grotendeels al in `src/lib/overOnsContent.ts` en de Over ons-pagina — goed behouden, niet inkorten “om korter te zijn”.

---

## Codebase-kaart (relevante bestanden)

| Rol | Pad |
|-----|-----|
| Over ons page | `src/app/over-ons/page.tsx` |
| Diensten hub | `src/app/diensten/page.tsx` |
| SEO landings | `src/app/diensten/[slug]/page.tsx` |
| Service + landings data | `src/lib/services.ts` (re-export + `serviceLandings`) |
| Functiecatalogus | `src/lib/homeServices.ts` (~42 functies, 9 featured) |
| Over ons copy/foto’s | `src/lib/overOnsContent.ts` |
| Hero copy | `src/lib/pageHeroContent.ts` (`/over-ons`, `/diensten`) |
| PageHero UI | `src/components/sections/PageHero.tsx` |
| Services UI | `ServicesSection`, `ServiceCard`, `ServiceTabs`, `ServiceDetailDrawer` |
| Over ons UI | `OverOnsPhotoCollage`, `OverOnsSplitSection`, `OverOnsStats`, `OverOnsTimeline`, `OverOnsQuote`, `Reveal` |
| Nav/footer | `src/lib/navigation.ts`, `src/components/Footer.tsx`, `PublicHeader` |
| SEO helpers | `src/lib/seo.ts`, `src/lib/siteConfig.ts`, `src/app/sitemap.ts` |
| FAQ | `src/lib/faq.ts` — **niet** gekoppeld aan `/over-ons` of `/diensten` |

---

# Deel A — Over ons (`/over-ons`)

## A1. Story & content

### Wat staat er nu (H1 / secties)

| Element | Bron | Tekst/structuur |
|---------|------|-----------------|
| Metadata title | `page.tsx` | `Over ons` → “Over ons \| Helping Hands Agency” |
| Meta description | `page.tsx` | Oprichting 2022 Tyrone; professionele crew + missie jongeren |
| Hero H1 | `pageHeroContent["/over-ons"]` | **“Meer dan alleen een uitzendbureau.”** |
| Hero sub | idem | Opgericht 2022 door Tyrone… missie eerlijke kans |
| Hero CTAs | idem | Primary: Personeel aanvragen → `/contact`; Secondary: Werken bij Helping Hands → `/vacatures` |
| Highlights | idem | Sinds 2022 · Persoonlijke begeleiding · Professionele uitvoering · Doorgroeimogelijkheden |
| Interactive cards | idem | Maatschappelijke missie / Professionele inzet / Persoonlijke match / Groei op de vloer |
| Intro H2 | `overOnsIntro.title` | **“Meer dan alleen een uitzendbureau”** (herhaalt hero-H1 bijna 1:1) |
| Stats | `OverOnsStats` | 2022 · Heel Nederland · Meerdere specialismen · Persoonlijk & dichtbij |
| Waarom | `overOnsWhy` | Kans voor mensen buiten beeld; motivatie > perfect CV |
| Groei | `overOnsGrowth` | Van kleine opdrachten → grote producties; rol-lijst |
| Timeline H2 | `OverOnsTimeline` | **“Van oprichting tot professionele partner op de vloer”** |
| Aanpak / Ontwikkeling / Opdrachtgevers / Ambitie / Quote | content lib | Volledig verhaal aanwezig |
| Closing CTAs | `page.tsx` | Contact · Diensten · Vacatures + `CTASection` |

### Sterke punten story

1. **Oprichtingsverhaal is compleet en specifiek:** Tyrone, 2022, jongeren/uitkering/weinig ervaring/verkeerde plek, potentieel i.p.v. alleen CV — dit matcht de projectcontext exact.
2. **Dual value proposition** is expliciet: missie voor medewerkers + kwaliteit voor opdrachtgevers (`overOnsClients`).
3. **Groeipaden** concreet (skills-lijst, doorgroei naar sitecrew/heftruck/kok/teamleider/voorman).
4. **Veilige claimrichting** grotendeels oké: “samenwerkt met grote en ervaren organisaties”, “inzet bij grotere producties en ervaren partners” — geen “officiële partner van [merk]”.
5. **Foto’s zijn lokaal** (`/images/crew/…`) en versterken “crew op de vloer”.

### Zwakke / risico-punten story

1. **H1-duplicatie:** hero-titel en intro-H2 zijn vrijwel identiek → SEO/scanbaarheid: één pagina, twee keer dezelfde kop.
2. Timeline-H2 bevat **“professionele partner”** — geen merkclaim, maar semantisch dicht bij partnership-taal; liever “professionele crewpartner / betrouwbare inzetpartner” of “professioneel op de vloer” aanscherpen zonder “partner van X”.
3. Stats zijn **kwalitatief** (“Meerdere specialismen”) — weinig harde social proof (geen aantallen crew/projecten tenzij echt waar).
4. Geen expliciete brug naar **concrete dienstenlandings** (alleen “Bekijk diensten” + rolchips zonder links).
5. Geen FAQ op Over ons (terwijl `faq.ts` al partnership-/projectervaring-antwoorden heeft die hier goed passen).

### Story ↔ conversie

| Doelgroep | Wordt bediend? | Gap |
|-----------|----------------|-----|
| Opdrachtgever | Ja (clients-sectie + CTA’s) | Weinig “wat leveren jullie concreet?” met deep links |
| Crew / jongere | Ja (development + vacatures-CTA) | Geen snelle link naar `/medewerkers` naast vacatures |
| SEO / merkverhaal | Sterk | H1-duplicatie + lange pagina zonder ankers |

---

## A2. Layout & UX

### Sectievolgorde (huidig)

1. `BreadcrumbJsonLd`  
2. `PageHero` (theme `over`) — tekst + interactive cards, **geen foto in hero**  
3. Intro split: tekst + `OverOnsPhotoCollage`  
4. `OverOnsStats`  
5. Why (`OverOnsSplitSection`, foto links)  
6. Growth (tekst + projectfoto)  
7. `OverOnsTimeline` (navy)  
8. Approach split  
9. Development (foto + skills)  
10. Clients split  
11. Ambition full-bleed banner  
12. Quote  
13. Closing card (3 CTA’s)  
14. `CTASection` (dubbele eind-CTA t.o.v. closing card)

### Layout-oordeel

| Dimensie | Score (1–10) | Toelichting |
|----------|-------------:|-------------|
| Professionaliteit | **8.5** | Sterke merktaal, foto’s, navy/oranje |
| Storytelling-ritme | **8** | Goede afwisseling tekst/beeld |
| Scanbaarheid | **6** | Lang; weinig ankers/TOC; herhalende “meer dan uitzendbureau” |
| Conversie-pad | **7** | CTA’s aanwezig, maar laat in de flow voor diensten |
| Mobiel | **7.5** | Collage + splits werken; hero cards stapelen |
| Visuele hero | **6** | Echte foto’s zitten *onder* de fold; hero = gradient + cards |

### Layout-ideeën (later, geen implementatie nu)

1. Hero: subtiele crewcollage of één dominante locatiefoto (lokaal), interactive cards compacter.
2. In-page ankers: Missie · Aanpak · Voor opdrachtgevers · Groei · Contact.
3. Rolchips in Growth linken naar `/diensten/...` landings.
4. Closing card + `CTASection` dedupliceren tot één sterke eindsectie (inhoud behouden).
5. Timeline: copy “partner” finetunen; visueel oké.

---

## A3. Conversie (Over ons)

### Huidige CTA’s

- Hero: Contact + Vacatures  
- Closing: Contact + Diensten + Vacatures  
- CTASection: Contact + Vacatures  
- Sticky `FloatingCTA` (sitebreed)

### Gaps

1. **Geen mid-page CTA** na “Voor opdrachtgevers” — bezoeker die overtuigd is scrollt nog ver.  
2. **Geen telefoon/WhatsApp** in page-flow (wel in footer/`siteConfig`).  
3. Dual audience is goed; voor opdrachtgevers mist een **korte “zo werkt aanvragen”**-blok (3 stappen) dat naar `/contact` of `/opdrachtgevers` wijst.  
4. Crew-pad mist `/medewerkers` als soft entry naast vacatures.

### Conversie-ideeën

- Soft CTA na Clients-sectie: “Personeel aanvragen” + “Bekijk diensten”.  
- Trustregel bij CTA: Hilversum · landelijk · één aanspreekpunt (`siteConfig`).  
- Behoud dual CTA-taal (Personeel aanvragen / Crew aanmelden) consistent met rest van de site.

---

## A4. SEO (Over ons)

### Huidige staat

| Item | Status |
|------|--------|
| `buildPageMetadata` | Ja — title, description, canonical, OG |
| BreadcrumbJsonLd | Ja |
| Organization JSON-LD | Sitebreed via layout |
| FAQ JSON-LD | Nee op deze pagina |
| H1 | 1× in hero (“Meer dan alleen een uitzendbureau.”) |
| Unieke content | Rijk, NL, merk-specifiek |
| Interne links | Naar `/contact`, `/diensten`, `/vacatures` — beperkt naar landings |
| Sitemap | `/over-ons` priority 0.8 |

### SEO-verbeterpunten

1. Intro-H2 hernoemen zodat H1 uniek blijft (bijv. “Wie wij zijn sinds 2022”).  
2. Optioneel About/Person-snippet voor Tyrone (alleen feiten die al publiek kloppen).  
3. Interne links vanuit rollen/sectoren naar dienstenlandings.  
4. FAQ-sectie met 3–4 vragen (missie, kwaliteit vs. missie, projectervaring, hoe aanvragen) + `faqJsonLd`.  
5. Title mag iets keyword-vriendelijker blijven zonder clickbait: “Over ons” is oké; description is al sterk.

---

## A5. Ideeën Over ons (prioriteit later)

| Prio | Idee |
|------|------|
| P1 | H1/H2 dedupe + mid-page CTA na clients |
| P2 | Rolchips → landingslinks; ankers |
| P3 | Hero media; FAQ + schema |
| P4 | Timeline-woordkeuze “partner”; stats alleen aanscherpen met echte cijfers |
| P5 | Soft link `/medewerkers`; één eind-CTA i.p.v. twee bijna gelijke blokken |

---

# Deel B — Diensten (`/diensten` + landings)

## B1. Huidige structuur hub (`/diensten`)

### Wat de pagina doet

1. `BreadcrumbJsonLd` Home → Diensten  
2. `PageHero` — H1: **“De juiste mensen op de juiste plek.”**  
   - Sub: events, horeca, restaurants, stagebouw, productie, logistiek, hospitality  
   - CTAs: Personeel aanvragen · Bekijk vacatures  
   - Highlights: Events · Horeca · Stagebouw · Logistiek  
   - Interactive cards: Event & floor / Horeca & restaurant / Stagebouw / Productie & logistiek  
3. Introblok H2: **“Crew voor elke fase van je productie”** + pill-links naar **alle published landings** via `getPublishedServiceLandings()`  
4. `ServicesSection showAllWhenAlle` — tabs + cards + drawer (bij “Alle”: **alle ~42** functies)  
5. Sectie **Horeca & restaurant** — 5 deep links (restaurant, keuken, bar, horeca, hospitality) + CTA Contact  
6. Navy strip “Snel de juiste functie ingezet” — Planning / Briefing / Uitvoering (generiek, geen links)  
7. `CTASection`

### Metadata

- Title: `Diensten`  
- Description: keyword-rijk (event crew, stagehands, horeca, restaurant, keuken, bar, productie, logistiek, hospitality)

---

## B2. SEO-landings — huidige staat (belangrijk: al live)

**Bron:** `serviceLandings` in `src/lib/services.ts`  
**Route:** `src/app/diensten/[slug]/page.tsx`  
**Status:** alle **9** landings hebben `published: true` en staan in `sitemap.ts` (priority 0.75).

| Slug | Path | Title (nav/meta) | H1 (uniek) |
|------|------|------------------|------------|
| event-crew | `/diensten/event-crew` | Event crew inhuren | Event crew inhuren voor festivals, concerten en beurzen |
| horeca-personeel | `/diensten/horeca-personeel` | Horeca personeel inhuren | Horeca personeel inhuren voor events en locaties |
| stagehands | `/diensten/stagehands` | Stagehands inhuren | Stagehands inhuren voor load-in, opbouw en afbouw |
| restaurant-personeel | `/diensten/restaurant-personeel` | Restaurant personeel inhuren | Restaurant personeel inhuren voor service en floor support |
| keukenpersoneel | `/diensten/keukenpersoneel` | Keukenpersoneel inhuren | Keukenpersoneel en koks inhuren |
| barpersoneel | `/diensten/barpersoneel` | Barpersoneel inhuren | Barpersoneel inhuren voor bars, festivals en events |
| productie-assistentie | `/diensten/productie-assistentie` | Productie assistentie | Productie assistentie en runners voor live producties |
| logistiek | `/diensten/logistiek` | Logistiek personeel evenementen | Logistiek personeel voor evenementen en locaties |
| hospitality | `/diensten/hospitality` | Hospitality crew | Hospitality crew voor events, VIP en ontvangst |

Elke landing heeft **eigen** `description`, `intro[]` (2 alinea’s), `bullets[]` (4), `keywords[]`, category, plus:

- Breadcrumb + `serviceJsonLd`  
- PageHero met landing-H1  
- Related functies uit `homeServices` (max 4)  
- **Volledige** `ServicesSection showAllWhenAlle` opnieuw  
- Cross-links naar andere landings + `/diensten`  
- CTASection

### Eerlijk oordeel: uniek vs. “thin” / duplicaat

| Aspect | Oordeel |
|--------|---------|
| Meta + H1 + intro + bullets | **Uniek genoeg** voor published landings — geen pure doorway-pages |
| Related functiekaarten | Nuttig, category-specifiek |
| Volledige `ServicesSection` op élke landing | **Voelt duplicaat** t.o.v. hub: zelfde filter-UI + catalogus op 9 pagina’s |
| Diepte (FAQ, proces, cases, foto’s) | **Nog dun** — landings zijn “goed genoeg live”, niet “content-rijk” |
| Canibalisation-risico | Matig: overlap horeca ↔ restaurant ↔ bar ↔ hospitality; te mitigeren met scherpere differentiatie, niet door te deleten |

**Conclusie:** landings **niet verbergen/depubliceren** tenzij later echt duplicate content blijkt in Search Console. Verbetering = **hub versterken** + landings **verrijken/differentiëren**, niet routes breken.

---

## B3. Option A vs Option B

### Option A — `/diensten` als sterke centrale hub (aanbevolen **nu**)

- Hub = overzicht, taxonomie, filters, “welke crew past?”, conversie  
- Landings = keyword-diepte + unieke uitleg per dienst  
- Interne linking: hub ↔ landings ↔ contact  

### Option B — landings als primaire SEO-pagina’s, hub minimal

- Hub wordt dunne index; traffic naar landings  
- Risico nu: hub is al de nav-entry (`navDropdowns`, footer “Alle diensten”); minimaliseren schaadt UX  

### Aanbeveling (NOW)

**Option A.** Versterk `/diensten` tot complete, scanbare centrale pagina.  
**Landings behouden** (ze hebben al unieke H1/intro/bullets).  
Differentiëren door:

1. Op landings: **niet** de volledige catalogus herhalen — wel related + link “Alle diensten filteren” → `/diensten#...`  
2. Per landing: unieke FAQ (2–4), proces/briefing-alinea, sectorfoto, “voor wie / niet voor wie”  
3. Hub: category-grid (9 landings) als primaire navigatie + `ServicesSection` als functiezoeker  
4. Alleen `published: false` overwegen als een landing aantoonbaar geen unieke waarde houdt — **nu niet het geval**

---

## B4. Navigatie & interne links (huidige staat)

### Header (`navigation.ts`)

- Top: `/diensten` in `navLinks` + dropdown `navDropdowns[diensten]`  
- Dropdown items: event-crew, horeca-personeel, stagehands, productie-assistentie, logistiek, Alle diensten  
- **Ontbreken in dropdown:** restaurant-personeel, keukenpersoneel, barpersoneel, hospitality (hospitality wel in footer)

### Footer (`Footer.tsx` `serviceLinks`)

- event-crew, stagehands, horeca-personeel, productie-assistentie, logistiek, hospitality  
- **Ontbreken:** restaurant, keuken, bar  

### Elders

- Homepage: links naar hub + event-crew / stagehands / horeca-personeel + `ServicesSection`  
- Opdrachtgevers: idem subset  
- `ServiceCard` / drawer: `getLandingPathForService()` → deep link waar gemapt  
- Over ons: alleen `/diensten` (geen landings)

### Link-gaps

1. Drie horeca-landings ondervertegenwoordigd in nav/footer t.o.v. hub-sectie.  
2. Hub-pill-rij toont wél alle 9 — goed; nav/footer niet synchroon.  
3. Geen anker-IDs op hub voor “spring naar categorie”.

---

## B5. Service-taxonomie (vereiste lijst — huidige canon)

### Categorieën (`HomeServiceCategory` / filters)

1. Event  
2. Horeca  
3. Restaurant  
4. Keuken  
5. Bar  
6. Stagebouw  
7. Productie  
8. Logistiek  
9. Hospitality  

### SEO-landings (1:1 met bovenstaande categorieën)

Zie tabel B2 — 9 published paths.

### Functiecatalogus

- `homeServices`: **42** items  
- Featured: **9** (homepage “Alle” toont featured; `/diensten` met `showAllWhenAlle` toont alles)  
- Mapping card → landing: `getLandingPathForService` in `services.ts`

### Aanbevolen taxonomie-presentatie op hub

```
Diensten (hub)
├── Event          → /diensten/event-crew
├── Stagebouw      → /diensten/stagehands
├── Productie      → /diensten/productie-assistentie
├── Logistiek      → /diensten/logistiek
├── Horeca         → /diensten/horeca-personeel
├── Restaurant     → /diensten/restaurant-personeel
├── Keuken         → /diensten/keukenpersoneel
├── Bar            → /diensten/barpersoneel
└── Hospitality    → /diensten/hospitality
         ↓
   Functiefilters (ServicesSection) + drawer detail + Contact
```

---

## B6. Layout-ideeën Diensten hub

1. **Category hub grid** (9 kaarten) boven of i.p.v. alleen pill-chips — scanbaarder, SEO-ankertekst.  
2. Daarna **ServicesSection** als “zoek op functie”.  
3. Horeca-subsectie: of mergen in category grid, of behouden als highlight — vermijd drie keer dezelfde links (pills + horeca-grid + cards).  
4. “Planning / Briefing / Uitvoering” koppelen aan `/opdrachtgevers` of korte uitleg + CTA.  
5. Optioneel FAQ + trust (Hilversum, landelijk, korte lijnen).  
6. Hero: H1 is merk-/benefit-gericht (“juiste mensen…”) — overweeg SEO-sterkere H1 zonder spam, bijv. behoud benefit + “inhuren” in sub/title (title is nu alleen “Diensten”).

---

## B7. Story ↔ services koppeling

| Over ons-element | Diensten-koppeling nu | Verbetering |
|------------------|----------------------|-------------|
| Rollijst Growth | Geen links | Link naar landings |
| Missie / begeleiding | Los van diensten | Op landings 1 zin “hoe wij matchen/briefen” |
| Clients-sectie | Alleen Contact/Vacatures | Link “Bekijk diensten” mid-page |
| Timeline groei sectoren | Geen deep links | Soft links events/horeca/stagebouw |

Doel: bezoeker begrijpt **waarom** (Over ons) én **wat** (Diensten) zonder dat teksten willekeurig worden ingekort.

---

## B8. SEO (Diensten + landings)

| Item | Hub `/diensten` | Landings |
|------|-----------------|----------|
| Metadata | Ja | Ja per slug |
| Canonical | Via `buildPageMetadata` | Ja |
| Service JSON-LD | Nee | Ja (`serviceJsonLd`) |
| Breadcrumbs | Ja | Ja (3 niveaus) |
| Sitemap | Priority **0.9** | 0.75 |
| FAQ | Nee | Nee |
| Unieke body | Matig (filter UI + korte horeca-sectie) | Intro+bullets uniek; daarna gedeelde ServicesSection |

### SEO-prioriteiten

1. Hub content verrijken (category grid + korte unieke alinea’s per cluster) zonder landings te vervangen.  
2. Landings: unikere middensecties; verminder duplicate `ServicesSection`-blok.  
3. Title hub: overweeg “Diensten: event crew, stagehands & horecapersoneel” (niet keyword-stuffen).  
4. Interne links nav/footer compleet maken voor alle 9.  
5. Geen fake AggregateRating; partnership-claims vermijden.

---

## B9. Imagery, mobiel, performance

### Imagery

- Over ons: sterk (collage + splits + banner).  
- Diensten hub/landings: **nauwelijks dienst-specifieke foto’s** — vooral PageHero gradient + tekstcards.  
- Aanbeveling: per category 1 lokale crew-/sectorfoto (hergebruik `crewPhotos` / sector assets), geen externe hotlinks.

### Mobiel

- `ServicesSection`: 10 filtertabs — horizontaal scrollen / overwhelm risico.  
- Cards: goede min-h touch targets (11).  
- Drawer: bottom sheet mobiel — oké.  
- Pill-rij 9 landings: wrap oké, kan druk ogen.  
- FloatingCTA + lange catalogus: padding respecteren.

### Performance

- Over ons: veel `next/image` + Reveal delays — let op LCP (hero zonder foto is lichter; collage onder fold).  
- Diensten: client `ServicesSection` op hub **én** elke landing → onnodige JS/DOM herhaling.  
- Geen Framer Motion hier — goed.  
- Priority images spaarzaam houden.

---

# Prioriteiten P1–P5 (gezamenlijk Over ons + Diensten)

| Prio | Focus | Concrete deliverables (later implementatie) |
|------|--------|-----------------------------------------------|
| **P1** | Hub `/diensten` versterken (Option A) | Category grid 9 landings; unieke intro per cluster; conversie-CTA’s; geen routes breken |
| **P2** | Landings differentiëren (niet deleten) | Unieke middencontent; `ServicesSection` op landings inkorten/verwijzen naar hub; FAQ per landing optioneel |
| **P3** | Interne links + taxonomie-sync | Nav dropdown + footer alle relevante landings; Over ons rolchips → landings; ankers |
| **P4** | Over ons polish | H1/H2 dedupe; mid-page CTA; hero media; timeline claimtaal; optioneel FAQ |
| **P5** | Imagery + mobile + SEO finetune | Category foto’s; tab-UX; meta titles; schema FAQ/Service; performance ServicesSection |

---

## Top 10 verbeterpunten (samenvatting)

1. Versterk `/diensten` als **centrale hub** (category grid + unieke clustertekst + CTA).  
2. **Behoud alle 9 published landings**; verrijk i.p.v. depubliceren.  
3. Haal of verkort de **volledige `ServicesSection`-herhaling** op landings (grootste duplicatiegevoel).  
4. Maak **nav + footer** consistent met alle (of strategische) landings — restaurant/keuken/bar nu onderbelicht.  
5. Over ons: **H1/H2 dedupliceren**; intro-H2 een eigen kop geven.  
6. Over ons: **mid-page CTA** + deep links vanuit rollijst naar diensten.  
7. Voeg **dienst-specifieke imagery** toe op hub/landings (lokaal).  
8. Voeg **FAQ** toe op Over ons en/of Diensten (+ landings) met bestaande veilige claimantwoorden.  
9. Verbeter hub **meta title** en landings-diepte zonder keyword stuffing.  
10. Mobile: **filtertabs** en lange 42-card grid scanbaarder maken (groep per categorie, sticky filter, of “toon meer”).

---

## Wat bewust níet doen in een vervolg-implementatie

- Geen full redesign van het merksysteem  
- Geen landings deleten / routes breken zonder expliciet besluit  
- Geen willekeurig inkorten van Over ons-verhaal  
- Geen “officiële partner”-claims of banned brands  
- Geen nieuwe animatie-libraries / API keys  

---

## Docs-only status van deze taak

Deze analyse is documentatie. Implementatie hoort in een aparte Cursor-run via `docs/about-services-improvement-cursor-prompt.md`.
