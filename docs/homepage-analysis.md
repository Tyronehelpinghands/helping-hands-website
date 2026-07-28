# Homepage-analyse — Helping Hands Agency

**Datum:** 28 juli 2026 (post-polish `09c1a14` + sprint 2)  
**Live:** https://helping-hands-website.vercel.app/  
**Bron:** `src/app/page.tsx` + componenten + live snapshot  
**Scope:** Analyse-baseline; sprint 2 implementeert resterende P1–P5-items hieronder

### Sprint 2 (implementatie)

- Case-snippet “Uit de praktijk” + missiezin 2022 in Why  
- Subtiele full-bleed hero-atmosfeer (lazy, lage opacity)  
- Mobiele dienstchips (Event / Stagehands / Horeca / Productie)  
- CTA-fatigue: Why zonder oranje primary; ServiceCards 1 primary knop  
- Homepage OG-image → crewfoto `concert-globe-stage.webp`  
- Logo-carousel via `next/image`  
- Service cards visueel lichter

---

## Context: wat is er net verbeterd?

Sinds de polish van juli 2026 (`09c1a14`) staat o.a.:

- Lichtere **mobiele hero** (3 collage-tiles; interactive cards vanaf `md`)
- Trustregel **Hilversum · landelijk · Bel…** in hero + TrustBar
- Soft claim “beste crewbedrijf van Nederland” **verwijderd**
- **Eén LCP `priority`** (hero-tile); bento lazy
- Bento-foto’s **gededupliceerd** t.o.v. hero
- Diensten-intro **ingekort**; dubbele oranje CTA in intro weg
- QuickRequest: duidelijke mailto-copy + **Kopieer aanvraagtekst**
- Header: **WhatsApp** naast bel
- Sectorcards klikbaar naar `/projecten`
- `.env.example` met `NEXT_PUBLIC_SITE_URL`

Deze analyse beschrijft de **huidige** homepage — niet de oude gaps als open bugs.

---

## 1. Eerste indruk & scores

### Eerste ~3 seconden (live)

1. Navy hero + oranje accent  
2. Merk: **Helping Hands Agency**  
3. H1: *Event crew en horecapersoneel inhuren voor events en producties.*  
4. CTA’s: **Personeel aanvragen** / **Crew aanmelden**  
5. Trust pills + *Hilversum · landelijk · Bel 06…*  
6. Desktop: crew-collage + service cards; mobiel: collage zonder cards  

| Vraag | Oordeel |
|-------|---------|
| Duidelijk wat HH doet? | **Ja** — “inhuren” + foto’s |
| Professioneel genoeg? | **Ja** — branded crew, consistente UI |
| Onderscheidend? | **Sterk** t.o.v. generieke uitzend-templates |
| Dual funnel (client + crew)? | **Ja** — hero + sticky CTA + AudienceToggle |
| Mobiele first fold? | **Beter** dan vóór polish; collage onder CTA blijft nog relatief lang |

### Scores (1–10) — juli 2026 post-polish

| Dimensie | Score | Δ vs pre-polish | Toelichting |
|----------|------:|:---------------:|-------------|
| Professionaliteit | **8.5** | = | Brand + eigen foto’s |
| Vertrouwen | **8.5** | +0.5 | Local/trust + veilige claims + tel/WhatsApp |
| Visuele creativiteit | **7.5** | = | Collage/bento sterk; gradient-hero nog abstract |
| Duidelijkheid | **9** | +0.5 | Sterke H1, kortere diensten-intro |
| Conversiekracht | **8.5** | +0.5 | Kopieer-fallback + spoedkanalen |
| SEO-potentie | **8.5** | = | Title/H1/landings/schema; env-canonical blijft |
| Mobiele ervaring | **8** | +1 | Lichtere hero; tabs al select op mobiel |
| Interactiviteit | **8** | = | Tabs, drawer, process, carousel |
| Beeldgebruik | **8.5** | +0.5 | Minder overlap hero↔bento |
| Merkuitstraling | **8.5** | = | Navy/oranje + echte crew |

**Gemiddelde ≈ 8.4** — homepage is conversie- en merk-klaar. Resterende winst zit in diepte (cases), performance-finetune, en lengte/CTA-herhaling.

---

## 2. Sterke punten

1. Crystal-clear **inhuren**-propositie (title + H1 + meta)  
2. Eigen crewfotografie (geen stock-only) in hero, bento, sectoren, CTA  
3. Dual audience overal aanwezig zonder verwarring  
4. Sticky header (inverted → glass) + sticky mobile CTA + desktop float  
5. Veilige logo-claimtaal + disclaimer + FAQ over projectervaring  
6. SEO-foundation: landings, FAQ/Organization/WebSite JSON-LD, interne links  
7. QuickRequest met mailto **én** kopieer-fallback + tel/WhatsApp/vast  
8. Sectievolgorde volgt bewijs → diensten → proces → aanvraag  
9. Banned brands afwezig in actieve catalogus  
10. Local SEO: Hilversum zichtbaar in hero, TrustBar, FAQ, footer  

---

## 3. Zwakke punten (resterend)

1. Pagina is **lang**; veel herhaalde “Personeel aanvragen” (cards + Why + Audience + Floating + eind-CTA)  
2. Hero-achtergrond blijft **abstract gradient** — weinig full-bleed atmosfeer  
3. Interactive hero-cards verdwijnen op mobiel → mobiele bezoeker mist snelle dienst-scan tot Diensten  
4. Geen harde metrics (reactietijd, #crew, cases) — trust is soft  
5. Carousel gebruikt nog `<img>` (lazy ok; sizing/CLS minder strak dan `next/image`)  
6. Canonical hangt aan `NEXT_PUBLIC_SITE_URL` / default domain — preview vs productie blijft aandachtspunt  
7. OG-image nog logo-achtig i.p.v. sterke crew-shot  
8. Missie/verhaal Tyrone 2022 leeft sterker op `/over-ons` dan op home  
9. Service cards nog relatief “card-heavy” (borders/shadows)  
10. Deployment-foto’s overlap deels met hero-sectorbeelden (bewust breed, maar herkenbaar)

---

## 4. Hero

| Element | Huidige staat |
|---------|----------------|
| H1 | Event crew en horecapersoneel **inhuren**… ✅ |
| CTA’s | Personeel aanvragen → `/contact`; Crew aanmelden → `/vacatures` |
| Trust | Pills + Hilversum/landelijk/`tel:` |
| Media | 3 tiles mobiel / 5 vanaf `sm`; cards vanaf `md` |
| LCP | Alleen collage[0] `priority` ✅ |

**Oordeel:** desktop compositie is sterk; mobiel is merkbaar lichter. Volgende stap optioneel: één soft full-bleed foto achter gradient (lage opacity), of mobiele mini-dienstchips i.p.v. volle cards.

---

## 5. Header / navigatie

- Transparent op dark hero → glass/compact na scroll  
- Progress bar aanwezig  
- Tel + WhatsApp vanaf `sm`  
- CTA “Personeel aanvragen” / mobiel “Aanvragen”  
- MobileMenu met Escape/overlay  

**Oordeel:** voldoet aan sticky-scroll brief. Finetune: header-contrast bij scroll over collage; 320px spacing blijven bewaken.

---

## 6. Sectievolgorde (huidig)

1. PageHero  
2. TrustBar  
3. LogoCarousel  
4. HomeCrewBento  
5. ServicesSection  
6. DeploymentCards  
7. ProcessAccordion  
8. WhyHelpingHands  
9. AudienceToggle  
10. QuickRequestForm  
11. FaqSection  
12. CTASection  

**Oordeel:** behouden. Eventueel AudienceToggle eerder als compact strip — geen harde noodzaak.

| Sectie | Advies |
|--------|--------|
| Hero | Keep + optioneel atmosfeer |
| TrustBar | Keep |
| LogoCarousel | Keep; next/image overwegen |
| Bento | Keep |
| Diensten | Keep; card-UI licht vereenvoudigen |
| Sectoren | Keep (nu met link `/projecten`) |
| Werkwijze | Keep |
| Why | Keep (claims veilig) |
| Audience | Keep |
| QuickRequest | Keep |
| FAQ / CTA | Keep |

---

## 7. Beeldgebruik

- **Hero set:** scaffolding-wide, thumbs-up, stadium, chef, standbouw  
- **Bento set:** arena, crew-woman, harness, scaffolding-portrait, forklift, crew-field-03  
- **Sectoren:** festival / concert / stadium / beurs / horeca / producties  

Overlap hero↔bento is bewust verlaagd. Sectoren delen nog sfeer met hero (logistiek/scaffolding) — acceptabel. Geen externe hotlinks.

---

## 8. Logo-carousel

- Claim: Crewervaring / projectervaring — **geen partnerships**  
- Priority: Crewstars, Factor F, TAP Crew, Backstage Masters, Jaarbeurs  
- Banned (ID&T, Ironman, The Good Guyz, Your Productions, LOC7000, Q-dance): **niet in catalogus**  
- Disclaimer + `/projecten` CTA aanwezig  
- Cards iets groter na polish  

Restpunt: `ProjectLogoCard` carousel = lazy `<img>`; broken → `null` (kan gaten geven).

---

## 9. Diensten

- Featured-first + drawer + landingslinks  
- Mobiel: `<select>` i.p.v. volle tabstrip ✅  
- Intro: 1 alinea + landingslinks + knoppenrij (zonder extra oranje CTA)  

Restpunt: 9 filters op desktop blijven breed; cards kunnen visueel lichter.

---

## 10. Conversie

| Pad | Status |
|-----|--------|
| Primary CTA | Overal aanwezig; soms te frequent |
| QuickRequest | Mailto + **Kopieer** + spoedblok |
| Sticky mobile | Personeel \| Werken |
| Header | Tel + WhatsApp + Aanvragen |
| Eind-CTA | Dual: contact + vacatures |

**Risico:** CTA-fatigue, niet te weinig CTA’s.  
**Kans:** 1 echte case-snippet of “wat we nodig hebben”-checklist dichter bij QuickRequest.

---

## 11. SEO

| Item | Waarde / status |
|------|-----------------|
| Title | `Helping Hands Agency \| Event crew & horecapersoneel inhuren` |
| H1 | Matcht intent “inhuren” |
| Description | `siteConfig.description` (events/horeca/briefing) |
| Schemas | FAQPage (home) + Organization + WebSite (layout) |
| Canonical | `siteConfig.url` ← `NEXT_PUBLIC_SITE_URL` |
| Interne links | Sterk naar `/diensten/*`, `/projecten`, `/contact`, `/vacatures` |

**Primair keywords:** event crew inhuren, horecapersoneel inhuren, stagehands, personeel evenementen, crew agency Nederland.  
**Lokaal:** Hilversum / Midden-Nederland — aanwezig in body + FAQ.

---

## 12. Content & tone

- Direct B2B Nederlands, operationeel  
- Claims veilig na polish  
- Dual voice behouden  
- Missie (jongeren/2022) nog dun op home — oké als bewuste keuze  

---

## 13. Interactie

Aanwezig: RevealOnScroll, header progress, carousel pause/hover, service drawer, process stepper/accordion, audience toggle, hero cards (md+).  
Geen Framer Motion. Reduced-motion grotendeels gerespecteerd.

---

## 14. Mobile

- Sticky CTA + `pb-20` voorkomt bedekking  
- Hero lichter; collage blijft onder fold-content  
- Service filter = select  
- QuickRequest type-grid nog lang maar bruikbaar  
- Geen horizontale page-scroll verwacht bij huidige layouts  

---

## 15. Performance

| Onderwerp | Status |
|-----------|--------|
| LCP priority | 1× hero ✅ |
| Bento | lazy ✅ |
| Images | webp + `next/image` op kernsecties |
| Client islands | Nog veel (hero, services, process, forms) — acceptabel |
| Carousel | `<img>` lazy |
| CWV focus | LCP hero; CLS via aspect boxes |

---

## 16. Prioriteiten (volgende iteratie)

### P1 — Diepte & conversie
- Optioneel 1 case-snippet (zonder partnership-claim) nabij Why of QuickRequest  
- CTA-herhaling in Why/Audience finetunen (niet verwijderen waar het waarde heeft)

### P2 — Visuele premium
- Subtiele full-bleed hero-atmosfeer (lage opacity)  
- OG-image crew-shot 1200×630  
- Service cards visueel lichter

### P3 — Mobiel dienst-scan
- Compacte dienstchips op mobiel i.p.v. niets tot Diensten-sectie

### P4 — Techniek
- Production `NEXT_PUBLIC_SITE_URL` op Vercel verifiëren  
- Carousel naar `next/image` waar zinvol  

### P5 — Merkverhaal
- 1 zin missie/Tyrone 2022 op home (niet in hero — bij Why of Audience)

---

## Top 10 resterende verbeteringen

1. Case-snippet zonder partnership-claim  
2. Hero full-bleed atmosfeer (subtiel)  
3. Mobiele mini-dienstchips  
4. CTA-fatigue reduceren in mid-page  
5. OG crew-image  
6. Canonical/env productie check  
7. Carousel `next/image`  
8. Service card UI lichter  
9. 1 zin maatschappelijke missie op home  
10. Optioneel harde trust-metric alleen als echt meetbaar  

---

## Componentkaart

| UI | Pad |
|----|-----|
| Page | `src/app/page.tsx` |
| Hero | `sections/PageHero`, highlights, interactive cards |
| Trust / Why / FAQ | `TrustBar`, `WhyHelpingHands`, `FaqSection` |
| Logo’s | `LogoCarousel`, `ProjectLogoCard` |
| Crew | `HomeCrewBento`, `crewPhotos.ts` |
| Diensten | `ServicesSection`, `ServiceTabs`, `ServiceCard`, drawer |
| Sectoren | `DeploymentCards` |
| Conversie | `QuickRequestForm`, `AudienceToggle`, `CTASection`, `FloatingCTA` |
| Header | `PublicHeader`, `MobileMenu`, `useScrollHeader` |

---

## Conclusie

De homepage is **niet meer “basis”**: professioneel, dual-funnel, SEO-klaar, veilig in claims, en na `09c1a14` merkbaar beter op mobiel en conversie-frictie. Volgende stappen zijn **premium diepte** (cases, atmosfeer, OG) en **finetune** (CTA-volume, carousel techniek, env), geen layout-teardown.

*Implementatieprompt voor resterende items: `docs/homepage-improvement-cursor-prompt.md` (update indien nieuwe sprint).*
