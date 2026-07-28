# Homepage-analyse — Helping Hands Agency

**Datum:** 28 juli 2026  
**Live:** https://helping-hands-website.vercel.app/  
**Bron:** `src/app/page.tsx` + gekoppelde componenten/data (gecontroleerd tegen live HTML)  
**Scope:** Documentatie only — geen redesign in deze taak

---

## Context (huidige basis — juli 2026)

Al aanwezig en **niet** opnieuw als “gap” markeren:

- SEO-landings gepubliceerd (`serviceLandings` in `src/lib/services.ts`, alle `published: true`)
- Bedrijfsgegevens in `src/lib/siteConfig.ts`: Helping Hands Agency, Wandelpad 30 Hilversum, telefoon (mobiel + vast), KvK, BTW, IBAN, WhatsApp-URL
- Organization + WebSite JSON-LD in `src/app/layout.tsx`
- Homepage-title/H1 aangescherpt op **inhuren** (`pageHeroContent.ts` + `page.tsx` metadata)
- Hero staffing-media: lokale crew-collage (`homeHeroCollage`) + interactive cards
- Crew-bento “Onze crew in actie” (`HomeCrewBento` + `homeCrewBento`)
- Sectorfoto’s via `DeploymentCards` (geen tekst-`SectorCards` meer op homepage)
- `LogoCarousel` met veilige claimtaal + `projectExperienceDisclaimer`
- Preferred logos actief o.a. Crewstars, Factor F, TAP Crew, Backstage Masters, Jaarbeurs
- `ServiceCard` linkt naar matching `/diensten/[slug]` via `getLandingPathForService`
- `QuickRequestForm`: mailto naar `planning@…` + spoedblok met tel / vast / WhatsApp / mail
- Header: transparent → glass/compact, progress bar, `tel:`-icoon vanaf `sm`, sticky mobiele CTA
- `ProcessAccordion`: desktop stepper-timeline + mobiele accordion
- FAQ + `faqJsonLd` inclusief Hilversum/landelijk + projectervaring-disclaimer
- Banned brands niet in `projectLogos`; Q-dance orphan niet aangetroffen in repo-scan

**Niet meer op homepage** (componenten bestaan nog elders/archief): `SectorCards`, `ProjectExperienceTeaser`.

---

## 1. Eerste indruk & scores

### Wat ziet de bezoeker in de eerste ~3 seconden?

1. Donkere navy hero (`.hero-gradient`) met oranje accent
2. Eyebrow **“Helping Hands Agency”**
3. H1: *“Event crew en horecapersoneel inhuren voor events en producties.”*
4. Twee CTA’s: **Personeel aanvragen** → `/contact`, **Crew aanmelden** → `/vacatures`
5. Trust-pills: Snel schakelen / Duidelijke briefing / Betrouwbare crew / Eén aanspreekpunt
6. Rechts (desktop): **echte crewfoto-collage** + interactive service-tabs eronder

### Vragen & antwoorden

| Vraag | Antwoord |
|-------|----------|
| Begrijp je binnen 5 seconden wat Helping Hands doet? | **Ja.** H1 + subtekst + foto’s maken “inhuren van event/horecacrew” expliciet. |
| Voelt het als een serieus crewbedrijf of een template? | **Serieus merk.** Eigen branded crewfoto’s in hero + bento tillen geloofwaardigheid sterk. |
| Is de primaire actie duidelijk? | **Ja.** Oranje “Personeel aanvragen” in hero, header, sticky bar en door de pagina. |
| Is er vertrouwen zonder scrollen? | **Grotendeels.** Foto’s + bullets; harde metrics (reactietijd, teamgrootte) ontbreken nog. Logo’s volgen direct onder TrustBar. |
| Is mobiel de eerste viewport te vol? | **Ja, risico.** Collage + interactive cards stapelen onder H1/CTA’s → lange first screen. |

### Scores (1–10)

| Dimensie | Score | Toelichting |
|----------|------:|-------------|
| Professionaliteit | **8.5** | Consistente brandkleuren, typografie, nette secties, echte foto’s |
| Vertrouwen | **8** | Disclaimer, FAQ, company JSON-LD, lokale foto’s, logo-carousel vroeg |
| Creativiteit | **7.5** | Collage + bento-shapes sterk; hero-achtergrond nog abstract gradient |
| Duidelijkheid | **8.5** | Sterke “inhuren”-H1, dual funnel, heldere diensten/sectoren |
| Conversiekracht | **8** | Veel CTA’s + tel/WhatsApp bij QuickRequest; mailto blijft frictie |
| Mobiele ervaring | **7** | Sticky CTA + menu sterk; hero-hoogte en 9 service-tabs zwaar |
| SEO-potentie | **8.5** | Title/H1/landings/schemas klaar; canonical/env blijft aandachtspunt |

**Gemiddelde indruk (~8.0):** homepage is conversie- en merk-klaar. Grootste resterende gaps: **mobiele hero-dichtheid**, **soft claims zonder bewijs**, **mailto-frictie**, **LCP/priority-overlap** en **paginalengte/CTA-herhaling**.

---

## 2. Sterke & zwakke punten

### Sterke punten

1. Duidelijke **inhuren**-propositie in title + H1
2. Eigen crewfotografie in hero, bento én sectorcards (geen stock-only)
3. Volwassen design system: navy `#0B1F4D` / `#173A8A`, oranje `#F28C28`
4. Sticky header (inverted → glass) + sticky mobile CTA + desktop floating CTA
5. Veilige projectlogo-claimtaal + FAQ-item over projectervaring
6. SEO-foundation: metadata, FAQ/Organization/WebSite schema, published landings
7. Dual audience (opdrachtgever/crew) expliciet in hero + `AudienceToggle`
8. QuickRequest met spoedkanalen (mobiel, vast, WhatsApp, mail)
9. Banned brands afwezig in actieve logo-catalogus
10. Sectievolgorde al dicht bij ideale conversieflow (bewijs vroeg, aanvraag laat)

### Zwakke punten

1. Mobiele hero: collage + 4 interactive cards = lange first viewport
2. Soft claim “beste crewbedrijf van Nederland” zonder meetbaar bewijs
3. TrustBar/highlights zijn generieke labels, geen harde trust-metrics
4. Mailto-only QuickRequest (e-mailclient vereist)
5. Meerdere `priority`-images (hero collage + bento) → LCP-concurrentie
6. 9 service-filters op homepage kan overwhelmen, vooral mobiel
7. Pagina is lang; CTA “Personeel aanvragen” herhaalt zonder nieuwe info
8. Foto-overlap tussen hero, bento en deployment (zelfde assets hergebruikt)
9. Canonical/OG volgen `NEXT_PUBLIC_SITE_URL` / default `helpinghandsagency.nl` — live Vercel-host kan afwijken
10. Weinig case-snippet / “wat krijg je concreet” naast processtappen

---

## 3. Hero-sectie

**Component:** `src/components/sections/PageHero.tsx` (`StaffingHeroMedia` bij theme `staffing`)  
**Content:** `getPageHeroContent("/")` in `src/lib/pageHeroContent.ts`  
**Media:** `homeHeroCollage` in `src/lib/crewPhotos.ts` (5 lokale webp’s; 1e `priority`)

### Huidige staat

| Element | Waarde |
|---------|--------|
| Eyebrow | Helping Hands Agency |
| H1 | Event crew en horecapersoneel inhuren voor events en producties. |
| Subtekst | Van last-minute extra handen tot complete projectinzet… |
| Primary CTA | Personeel aanvragen → `/contact` |
| Secondary CTA | Crew aanmelden → `/vacatures` |
| Trust bullets | 4 labels via `PageHeroHighlights` (pills) |
| Visual side | Foto-collage (2×2 / lg 3-col) + interactive cards + live detailpanel |
| Achtergrond | CSS `.hero-gradient` (geen full-bleed foto) |

### Sterke punten

- Keyword **inhuren** in H1 (SEO + conversie)
- Echte locatiefoto’s in eerste viewport — merk voelt als crewbedrijf
- Dual audience CTA’s
- Interactive cards geven snelle dienst-scan zonder scroll
- Header inverted werkt met dark hero (`pathHasDarkHero("/")`)
- Hover-scale + `motion-reduce` op collage

### Zwakke punten

- Op mobiel: tekst → CTA → pills → collage → cards = te veel voor “één compositie”
- Interactive cards concurreren met collage (dubbele “wat doen jullie?”)
- Geen harde trust naast CTA (Hilversum / landelijk / telefoon als tekstbadge)
- Achtergrond blijft abstract gradient i.p.v. subtiele full-bleed atmosfeer
- 5e collage-foto `hidden sm:block` — oké, maar LCP blijft zwaar op mobile

### Concrete verbeteringen (later)

1. Mobiel: collage inkorten (2–3 tiles) of cards onder TrustBar/Diensten
2. Trust-regel onder CTA: “Hilversum · landelijk inzetbaar” + `tel:` tekstlink
3. Primary CTA dominant houden; secondary lichter (al grotendeels zo)
4. Optioneel: één soft full-bleed crewfoto achter gradient (opacity laag) — geen floating badges
5. Geen langere H1; merk in eyebrow behouden

---

## 4. Header / navigatie

### Huidige implementatie

| Bestand | Rol |
|---------|-----|
| `PublicHeader.tsx` | Fixed header, inverted/glass, progress bar, CTA, `tel:` |
| `MobileMenu.tsx` | Slide-over, accordions, WhatsApp/contact |
| `HeaderDropdown.tsx` | Desktop dropdowns |
| `useScrollHeader.ts` | `scrolled` + `progress` |
| `navigation.ts` | `navDropdowns` + `simpleNavLinks` |
| `FloatingCTA.tsx` | Desktop float + sticky mobile bar |
| `layout.tsx` | `pb-20` op `<lg` tegen sticky bar |

### Wat werkt al goed

- Transparent op dark hero → `bg-white/85 backdrop-blur-xl` na scroll
- Compacte hoogte bij scroll
- Oranje CTA altijd zichtbaar (mobiel: “Aanvragen”)
- `tel:`-icoon vanaf `sm`
- Escape / click-outside / body scroll lock
- Op `/` opent mobiel accordion “Diensten” standaard
- Scroll progress oranje streep

### Verbeterplan (finetune)

1. Op zeer smalle schermen (<360px) spacing CTA + hamburger blijven bewaken
2. Optioneel WhatsApp-icoon discreet naast tel (alleen `siteConfig.whatsappUrl`)
3. Glass-contrast op drukke hero-foto’s testen (collage kan header-contrast beïnvloeden bij scroll-start)
4. Geen Framer Motion nodig

---

## 5. Layout / sectievolgorde

### Huidige volgorde (`src/app/page.tsx`) — live bevestigd

1. `PageHero` (collage + interactive cards)
2. `TrustBar`
3. `LogoCarousel`
4. “Onze crew in actie” → `HomeCrewBento`
5. Diensten-intro + `ServicesSection`
6. Sectoren → `DeploymentCards`
7. Werkwijze → `ProcessAccordion`
8. `WhyHelpingHands`
9. Audience-sectie → `AudienceToggle`
10. `QuickRequestForm`
11. `FaqSection`
12. `CTASection`

### Oordeel

Volgorde is **sterk** en sluit aan bij conversiebest practice: belofte → soft trust → sociaal bewijs (logo’s) → beeld → diensten → sectoren → proces → differentiatie → split audience → aanvraag → FAQ → slot-CTA.

### Keep / expand / move / combine / remove

| Sectie | Advies |
|--------|--------|
| PageHero | **Keep + polish** (mobiele dichtheid) |
| TrustBar | **Keep**; optioneel 1 local/metric zin |
| LogoCarousel | **Keep** |
| HomeCrewBento | **Keep**; foto-select diversifiëren t.o.v. hero |
| ServicesSection | **Keep + polish** (mobiele filters) |
| DeploymentCards | **Keep** (primaire sectorvisual) |
| ProcessAccordion | **Keep** (desktop timeline al aanwezig) |
| WhyHelpingHands | **Keep**; soft claim temperen of onderbouwen |
| AudienceToggle | **Keep**; eventueel omhoog ná TrustBar als compact strip |
| QuickRequestForm | **Keep**; mailto-frictie mitigeren |
| FAQ + CTA | **Keep** |
| SectorCards / ProjectExperienceTeaser | **Niet terugzetten** op home |

---

## 6. Imagery / creativiteit

### Huidige kwaliteit

- **Sterk:** lokale crewfoto’s in `/images/crew/*.webp` via `crewPhotos.ts`
- Hero collage, bento (organische radii + brand rings), deployment photo-cards, CTA-achtergrond
- Alt-teksten beschrijvend en bruikbaar
- Geen externe hotlinks in homepage-beeldflow
- `next/image` op hero/bento/deployment/CTA

### Consistency

- Sfeer “op locatie / branded shirts” is consistent
- Overlap: scaffolding, thumbs-up, chef-fryer, stadium komen in meerdere secties terug → herhaling voelbaar bij scroll
- Logo’s: wisselende bronformats; carousel gebruikt `<img>` in `ProjectLogoCard` (niet `next/image`)

### Ideeën A–E (volgende iteratie)

| | Idee | Doel |
|---|------|------|
| **A** | Mobiele hero-media inkorten | Snellere first action |
| **B** | Unieke foto-sets per sectie (minder overlap) | Frissere scroll |
| **C** | Subtiele full-bleed hero atmosfeer (lage opacity) | Merkdiepte zonder badges |
| **D** | Mini “load-in → show → load-out” strip | Proces visueel |
| **E** | Case-beeld + 1 zin resultaat (zonder partnership-claim) | Conversiebewijs |

**Regel:** geen Unsplash/externe CDN-hotlinks; geen floating badges over hero-media.

---

## 7. Logo-carrousel

**Component:** `LogoCarousel.tsx` → `getHomepageFeaturedLogos()` → `projectLogos.ts`  
**Card:** `ProjectLogoCard` variant `carousel`

### Sterke punten

- CSS-marquee (`.logo-carousel-track`), pause on hover, gradient fades
- Eyebrow “Crewervaring” + expliciete non-partnership copy
- Priority IDs: Crewstars, Factor F, TAP Crew, Backstage Masters, Jaarbeurs
- Disclaimer zichtbaar onder track
- CTA naar `/projecten`

### Banned brands check

Mag **niet**: ID&T, Ironman, The Good Guyz, Your Productions, LOC7000, Q-dance.

| Status | Resultaat |
|--------|-----------|
| In `projectLogos` | **Afwezig** (correct) |
| Orphan Q-dance in public | **Niet gevonden** (juli 2026 scan) |

### Preferred logos

| Logo | In catalogus? |
|------|---------------|
| Crewstars | Ja, featured |
| Factor F | Ja, featured |
| TAP Crew | Ja, featured |
| Backstage Masters | Ja, featured |
| MOJO | Alleen als goedgekeurd lokaal bestand bestaat |

### Restpunten

- Carousel `<img>` i.p.v. `next/image` (lazy ok, sizing minder strak)
- `imageError → null` kan gaten in track geven
- Category-chips + logo naam: leesbaarheid wisselt per asset-padding
- Claimtaal is veilig — behouden; geen “wij werken voor …” zonder contract

---

## 8. Diensten-sectie

**UI:** `ServicesSection` + `ServiceTabs` + `ServiceCard` + `ServiceDetailDrawer`  
**Data:** `src/lib/services.ts` (+ landings mapping)

### Huidig gedrag

- Tabs: Alle / Event / Horeca / Restaurant / Keuken / Bar / Stagebouw / Productie / Logistiek / Hospitality
- “Alle” op homepage = **featured** (live: “9 uitgelichte diensten”)
- Drawer voor detail; CTA “Personeel aanvragen” → `/contact`
- Titel link + “Meer over deze dienst →” naar matching landing
- Introblok met deep links naar event crew / stagehands / horeca + knoppenrij

### Sterke punten

- Rijke taxonomie + taken/idealFor
- SEO-interne links naar landings
- Conversiepad per card

### Zwakke punten

- Lange intro (3 alinea’s) vóór grid — scanbaarheid daalt
- 9 filters op smalle schermen: horizontale overflow / cognitive load
- Cards nog border/shadow-heavy (veel “card-UI”)
- Dubbele CTA-rij (“Bekijk inzet” + “Personeel aanvragen” + landing link) voelt druk

### Verbeteringen

1. Intro inkorten tot 1 alinea + linkrij
2. Mobiel: select/dropdown i.p.v. volle tabstrip, of sticky compact chips
3. Featured max 6–9 behouden; “Bekijk alle diensten” prominenter
4. Drawer behouden; primaire oranje CTA behouden

---

## 9. Sectoren

**Component:** `DeploymentCards` + data `deployments` in `src/lib/content.ts` + foto’s `homeDeploymentPhotos`

### Huidige staat

Zes foto-cards: Festivals, Concerten, Stadions, Beurzen, Horecalocaties, Producties — overlay gradient, label “Crew”, korte detailregel.

### Oordeel

- Visueel sterkste sectorpresentatie; goed geplaatst ná diensten
- Touch-vriendelijk (geen hover-only essentiële copy)
- `SectorCards` hoort **niet** terug op homepage (duplicatie)

### Verbeteringen

1. Optioneel: card klikbaar naar relevante landing of `/projecten` filter
2. Detailcopy iets concreter per sector (1 zin met “wat leveren we”)
3. Foto-select afstemmen op unieke shots t.o.v. hero/bento

---

## 10. Conversie

### CTA-frequentie “Personeel aanvragen” / contact

Voorkomt o.a. in: header, hero, diensten-intro, elke `ServiceCard`, Why, Audience (clients), QuickRequest, `CTASection`, `FloatingCTA`.

→ **Frequent genoeg**; risico is vermoeidheid, niet tekort.

### QuickRequest

- Mailto naar `planning@helpinghandsagency.nl` met subject/body — werkt zonder backend
- Spoedblok: Bel / Vast / WhatsApp / Mail — **sterk**
- Frictie: e-mailclient vereist; op sommige mobiele browsers wisselvallig
- Successtate aanwezig

### Sticky / floating

- Mobiel: vaste bottom bar Personeel | Werken
- Desktop: floating panel na scroll (threshold 320)
- `body.pb-20` op `<lg` — correct

### Trust nabij CTA’s

- Hero: soft pills, geen tel-tekst
- Header: tel-icoon (`sm+`)
- QuickRequest: beste trust-cluster
- Eind-CTA: sfeerfoto + dual CTA; geen KvK in hero (hoort footer — oké)

### Contactkanalen

| Kanaal | Status |
|--------|--------|
| Mail / planning@ | Sterk |
| Mobiel + vast | In QuickRequest + siteConfig; header-icoon |
| WhatsApp | In QuickRequest + MobileMenu + contactpagina |
| Contactpagina | Primair conversiedoel |

---

## 11. SEO

### Title / meta / H1

| Item | Waarde |
|------|--------|
| Title | `Helping Hands Agency \| Event crew & horecapersoneel inhuren` (`absoluteTitle: true`) |
| Meta description | `siteConfig.description` (inhuren + festivals/stadions/… + briefing) |
| H1 | Event crew en horecapersoneel inhuren voor events en producties. |

Live title matcht.

### Headings & interne links

- Duidelijke H2-structuur per sectie
- Sterke deep links naar `/diensten/*`, `/projecten`, `/contact`, `/vacatures`, `/over-ons`
- Service cards → landings via mapping

### Local SEO

- FAQ: Hilversum + landelijk
- Organization PostalAddress + telefoons in JSON-LD
- Homepage-body blijft landelijk gericht (bewust); TrustBar kan 1× local phrase gebruiken

### Schemas / OG / canonical

- FAQPage JSON-LD op homepage
- Organization + WebSite in root layout
- OG/Twitter via `buildPageMetadata`
- Canonical: `absoluteUrl("/")` → `siteConfig.url` (`NEXT_PUBLIC_SITE_URL` of default `https://helpinghandsagency.nl`)
- **Risico:** live Vercel-URL vs production domain — env per environment documenteren

### Keywordprioriteit

**Primair:** event crew inhuren · horecapersoneel inhuren · stagehands inhuren · personeel evenementen · crew uitzendbureau events  

**Secundair:** restaurant-/keuken-/barpersoneel · productie-assistentie · logistiek · hospitality · festival/stadion/beurs crew  

**Lokaal:** Helping Hands Agency Hilversum · event crew Hilversum / Midden-Nederland

---

## 12. Content & tone

### Tone

- Direct, operationeel, Nederlands B2B: “datum, locatie, functies, briefing”
- Dual voice: professioneel voor opdrachtgevers, menselijk voor crew
- Meestal veilige claims; uitzondering: “beste crewbedrijf van Nederland” in `WhyHelpingHands`

### Differentiatie

- Event + horeca + stagebouw in één taal
- Eerlijke projectervaring-disclaimer
- Dual funnel + eigen branded foto’s
- Missie (jongeren / 2022) leeft sterker op `/over-ons` dan op home — oké, maar 1 zin op home kan merkdiepte geven zonder hero te vervuilen

### Suggested content blocks (later)

1. Checklist “Wat we nodig hebben voor snelle bezetting” (deels in FAQ)
2. Last-minute vs gepland (2 scenario’s)
3. Soft claim vervangen door “praktisch / betrouwbaar / korte lijnen” + bewijs
4. 1 case-snippet zonder partnership-claim

---

## 13. Interactie / animatie

**Voorkeur:** CSS + lichte client hooks — **geen Framer Motion**.

### Aanwezig

- `RevealOnScroll` (IntersectionObserver, reduced-motion)
- Header transitions + progress
- Logo carousel keyframes (+ pause on hover / reduced-motion)
- Hero/bento/deployment hover-scale
- ProcessAccordion stepper + accordion
- Service drawer, audience toggle, hero card select

### Aanbevelingen

1. Geen scroll-jacking / zware parallax
2. Reveal niet om élke sectie wrappen (hydrate cost)
3. Behoud `prefers-reduced-motion` patronen
4. Hero interactive: keyboard/focus al aanwezig — blijven testen

---

## 14. Mobile

### 320–414

- Sticky CTA + header CTA: conversie sterk
- Hero + collage + cards: te lang vóór TrustBar
- Service tabs: 9 chips → overflow / scanmoeilijkheid
- QuickRequest type-grid: bruikbaar maar lang
- Deployment cards: goed (volle info zonder hover)
- `pb-20` voorkomt content achter sticky bar

### Tablet

- 2-koloms grids + carousel prettig
- Process stepper vanaf `lg`

### Desktop

- Hero 2-koloms = sterkste compositie
- Floating CTA rechtsonder na scroll
- Header dropdowns vanaf `lg`

---

## 15. Performance

| Onderwerp | Observatie |
|-----------|------------|
| Images | Veel webp + `next/image` op kernsecties |
| Priority | Hero collage[0] **én** bento[0] → dubbele eager LCP-kandidaten |
| Logo’s | `<img>` in carousel; error → null |
| Client JS | Veel `"use client"` islands (hero, services, process, forms, floating CTA) |
| CLS | Aspect boxes op collage/bento helpen |
| CWV-risico | Largest Contentful Paint = hero image; te veel priority schaadt |
| Aanbeveling | Alleen 1 homepage LCP `priority`; rest lazy; carousel lazy; Reveal spaarzaam |

---

## 16. Prioriteiten P1–P5

### P1 — First impression & mobile conversie

- Hero mobiel inkorten (collage en/of cards)
- Soft trust onder CTA (Hilversum / landelijk / bel)
- Soft claim in Why temperen of onderbouwen
- Behoud H1/title “inhuren”

### P2 — Conversie-frictie

- QuickRequest: “kopieer aanvraag” of duidelijker fallback naast mailto
- WhatsApp/tel al aanwezig — in hero/header iets zichtbaarder maken (tekst, niet alleen icoon)
- CTA-herhaling reduceren waar geen nieuwe info

### P3 — Diensten & bewijs

- Mobiele service-filters vereenvoudigen
- Diensten-intro inkorten
- Unieke foto-sets; optioneel 1 case-snippet

### P4 — SEO & techniek

- `NEXT_PUBLIC_SITE_URL` per environment
- Interne links blijven; OG-image eventueel crew-shot i.p.v. alleen logo
- Geen fake Review/AggregateRating schema

### P5 — Performance & polish

- Eén `priority` LCP image
- Logo carousel naar `next/image` waar zinvol
- Reveal/motion finetune CSS-only
- Process/timeline accessibility regressietest

---

## Top 10 verbeteringen (samenvatting)

1. **Mobiele hero inkorten** — collage/cards minder stapelen  
2. **Trust-regel onder hero-CTA** — Hilversum / landelijk / bel  
3. **Soft claim “beste crewbedrijf” temperen** of onderbouwen  
4. **Eén LCP `priority`-image** — bento niet ook eager  
5. **Service-tabs mobiel vereenvoudigen**  
6. **Diensten-intro inkorten**  
7. **QuickRequest-frictie mitigeren** (kopieer / duidelijkere fallback)  
8. **Foto-overlap tussen secties verminderen**  
9. **Canonical/env documenteren** (`NEXT_PUBLIC_SITE_URL`)  
10. **Optioneel case-snippet** zonder partnership-claim  

---

## Componentkaart (homepage)

| UI | Pad |
|----|-----|
| Page | `src/app/page.tsx` |
| Layout chrome | `ConditionalSiteChrome`, `PublicHeader`, `MobileMenu`, `Footer`, `FloatingCTA`, `SiteChromeExtras` |
| Hero | `sections/PageHero`, `PageHeroHighlights`, `PageHeroInteractiveCard` |
| Trust / why / FAQ | `TrustBar`, `WhyHelpingHands`, `FaqSection` |
| Sectoren | `DeploymentCards` (niet `SectorCards` op home) |
| Logo’s | `LogoCarousel`, `ProjectLogoCard` |
| Crewbeeld | `HomeCrewBento` |
| Diensten | `ServicesSection`, `ServiceCard`, `ServiceTabs`, `ServiceDetailDrawer` |
| Conversie | `AudienceToggle`, `QuickRequestForm`, `CTASection`, `ProcessAccordion` |
| Motion | `RevealOnScroll` |
| Data | `pageHeroContent`, `siteConfig`, `projectLogos`, `crewPhotos`, `services`, `faq`, `seo`, `navigation`, `content` |

---

*Dit document is de bron voor `docs/homepage-improvement-cursor-prompt.md`.*
