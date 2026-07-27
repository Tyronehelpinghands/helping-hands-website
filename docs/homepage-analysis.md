# Homepage-analyse — Helping Hands Agency

**Datum:** 27 juli 2026  
**Live:** https://helping-hands-website.vercel.app/  
**Bron:** `src/app/page.tsx` + gekoppelde componenten/data  
**Scope:** Analyse only — geen redesign in deze taak

---

## Context (recente basis)

Al aanwezig in de codebase (niet opnieuw “ontdekken” als gap):

- SEO-landings gepubliceerd (`serviceLandings` in `src/lib/services.ts`, alle `published: true`)
- Bedrijfsgegevens in `src/lib/siteConfig.ts`: Helping Hands Agency, Wandelpad 30 Hilversum, telefoon, KvK, BTW, IBAN
- Organization + WebSite JSON-LD in `src/app/layout.tsx` via `organizationJsonLd()` / `websiteJsonLd()`
- Homepage-title/H1 aangescherpt op **inhuren** (`pageHeroContent.ts` + `page.tsx` metadata)
- `QuickRequestForm` opent mailto naar `info@helpinghandsagency.nl`
- Projectdisclaimer: `projectExperienceDisclaimer` in `projectLogos.ts`
- Header scroll-states: `PublicHeader` + `useScrollHeader` (transparent → glass/compact)
- Sticky mobiele CTA: `FloatingCTA` via `SiteChromeExtras`

---

## 1. Eerste indruk

### Wat ziet de bezoeker in de eerste 3 seconden?

1. Donkere navy hero (`.hero-gradient`) met oranje accent
2. Eyebrow **“Helping Hands Agency”**
3. H1: *“Event crew en horecapersoneel inhuren voor events en producties.”*
4. Twee CTA’s: **Personeel aanvragen** → `/contact`, **Crew aanmelden** → `/vacatures`
5. Trust bullets: Snel schakelen / Duidelijke briefing / Betrouwbare crew / Eén aanspreekpunt
6. Rechts: interactieve tekstkaarten (Eventcrew, Horeca support, Stagebouw, Productie) — **geen fotocollage**

### Vragen & antwoorden

| Vraag | Antwoord |
|-------|----------|
| Begrijp je binnen 5 seconden wat Helping Hands doet? | **Ja.** H1 + subtekst maken “inhuren van event/horecacrew” expliciet. |
| Voelt het als een serieus crewbedrijf of een template? | **Serieus merk** (navy/oranje, vaste CTA-taal), maar de hero mist nog echte locatiefoto’s — daardoor iets “product-UI” i.p.v. “crew op de vloer”. |
| Is de primaire actie duidelijk? | **Ja.** Oranje “Personeel aanvragen” is dominant in hero, header en sticky bar. |
| Is er vertrouwen zonder scrollen? | **Gedeeltelijk.** Bullets helpen; logo’s en echte foto’s komen pas ná TrustBar/SectorCards. |
| Is mobiel de eerste viewport te vol? | **Matig.** H1 + CTAs + 4 interactive cards stapelen op smalle schermen; cards voelen als tweede “scherm” onder de fold. |

### Scores (1–10)

| Dimensie | Score | Toelichting |
|----------|------:|-------------|
| Professionaliteit | **8** | Consistente brandkleuren, typografie (`font-black`), nette secties |
| Vertrouwen | **7** | Disclaimer, FAQ, company JSON-LD; hero mist nog “bewijs”-beeld |
| Creativiteit | **5.5** | Interactieve cards oké, maar weinig visuele verrassing; gradient-hero zonder foto |
| Duidelijkheid | **8.5** | Sterke “inhuren”-H1, heldere doelgroep-split later |
| Conversiekracht | **7.5** | Veel CTA’s + sticky bar; mailto-frictie bij QuickRequest |
| Mobiele ervaring | **7** | Sticky CTA + MobileMenu sterk; hero + cards stapelen |
| SEO-potentie | **8** | Title/H1/landings/schemas klaar; domein-DNS/canonical nog risico |

**Gemiddelde indruk:** sterke conversie- en SEO-basis; grootste gap is **visuele beleving in de hero** en **sectiedruk/duplicatie** lager op de pagina.

---

## 2. Hero-sectie analyse

**Component:** `src/components/sections/PageHero.tsx`  
**Content:** `getPageHeroContent("/")` in `src/lib/pageHeroContent.ts`

### Huidige staat

| Element | Waarde |
|---------|--------|
| Eyebrow | Helping Hands Agency |
| H1 | Event crew en horecapersoneel inhuren voor events en producties. |
| Subtekst | Van last-minute extra handen tot complete projectinzet… |
| Primary CTA | Personeel aanvragen → `/contact` |
| Secondary CTA | Crew aanmelden → `/vacatures` |
| Trust bullets | 4 labels via `PageHeroHighlights` |
| Visual side | `PageHeroInteractiveCard` grid (tekst, geen Image) |
| Achtergrond | CSS `.hero-gradient` (geen foto) |

### Sterke punten

- Keyword **inhuren** in H1 (SEO + conversie)
- Duidelijke dual audience (opdrachtgever vs crew)
- Interactieve cards geven “wat leveren jullie?” zonder naar diensten te scrollen
- Header inverted (wit logo) werkt met dark hero (`pathHasDarkHero("/")`)

### Zwakke punten

- Geen dominante **crew-/locatiefoto** in eerste viewport → merk voelt abstract
- Interactive cards concurreren met H1/CTA’s (vooral mobiel)
- Geen trust-badges (KvK/reactietijd/regio) naast CTA
- Geen scroll-cue of subtiele motion naar TrustBar

### Concrete verbeteringen (later implementeren)

1. **Hero media collage** rechts (of full-bleed achter tekst): 3–5 lokale crewfoto’s uit `/images/crew/`
2. Trust badges onder CTA’s: “Hilversum · landelijk inzetbaar”, telefoon, “één aanspreekpunt”
3. Primary CTA behouden; secondary lichter; optioneel derde: `tel:` of WhatsApp
4. Interactive cards inkorten op mobiel (2 zichtbaar + “meer”) of verplaatsen onder TrustBar
5. Subtiele CSS hover/scale op collage; `prefers-reduced-motion` respecteren (zoals `RevealOnScroll`)
6. Eyebrow mag merk blijven; H1 niet langer maken

---

## 3. Header / navigatie

### Huidige implementatie

| Bestand | Rol |
|---------|-----|
| `PublicHeader.tsx` | Fixed header, inverted/glass, progress bar, CTA |
| `MobileMenu.tsx` | Slide-over, accordions, CTA’s onderaan |
| `HeaderDropdown.tsx` | Desktop mega-achtige dropdowns |
| `useScrollHeader.ts` | `scrolled` + `progress` (threshold 24px) |
| `navigation.ts` | `navDropdowns` + `simpleNavLinks` |

### Wat werkt al goed

- Sticky/fixed overlay
- Transparent op dark hero → `bg-white/90 backdrop-blur-md` na scroll
- Compacte hoogte: `h-[4.5rem]` → `h-14` (scrolled)
- Oranje CTA altijd zichtbaar (mobiel: “Aanvragen”)
- Active states + Escape/click-outside
- Body scroll lock bij open menu
- Scroll progress oranje streep

### Verbeterplan (finetune, geen rebuild)

1. **PublicHeader.tsx**
   - Glass-state iets sterker op homepage (meer blur / subtielere border)
   - Op zeer smalle schermen CTA + hamburger spacing bewaken (nu oké met `shrink-0`)
   - Overweeg telefoon-icoon naast CTA op `sm+` (directe conversie)
2. **MobileMenu.tsx**
   - Logo/`HeaderBrandLogo` i.p.v. alleen tekst “Helping Hands”
   - Snelle contactrij: tel + mail (mail staat al)
   - Accordion “Diensten” default open op `/` optioneel (discoverability)
3. **useScrollHeader.ts**
   - Threshold 24 is fine; eventueel homepage-specifieke threshold voor “glass earlier”
   - Geen Framer Motion nodig

---

## 4. Layout / volgorde

### Huidige volgorde (`page.tsx`)

1. `PageHero`
2. `TrustBar`
3. `SectorCards` (tekst, 6 sectoren)
4. `LogoCarousel`
5. Crew strip “Onze crew in actie” (`homeCrewStrip`)
6. Diensten-intro + `ServicesSection`
7. `AudienceToggle`
8. `ProjectExperienceTeaser` (logo-grid + disclaimer)
9. Werkwijze (`ProcessAccordion`)
10. `WhyHelpingHands`
11. Sectoren foto (`DeploymentCards`)
12. `QuickRequestForm`
13. `FaqSection`
14. `CTASection`

### Aanbevolen flow (conversie)

1. Hero (met media)
2. TrustBar (kort)
3. LogoCarousel (sociaal bewijs vroeg)
4. Crew/beeld bento of strip
5. Diensten (tabs/cards)
6. Sectorfoto’s (`DeploymentCards`) — **niet** dubbele tekst-`SectorCards`
7. Werkwijze (timeline)
8. Why / differentiatie
9. AudienceToggle (of eerder na hero als compact)
10. Snelle aanvraag
11. FAQ
12. Slot-CTA

### Keep / expand / move / combine / remove

| Sectie | Advies |
|--------|--------|
| PageHero | **Keep + expand** (media) |
| TrustBar | **Keep** (compact houden) |
| SectorCards | **Combine/remove of verplaats** — overlapt met DeploymentCards |
| LogoCarousel | **Keep**; claim language checken |
| Crew strip | **Expand** naar bento óf laten + verbeteren aspect-ratio mix |
| ServicesSection | **Keep + polish** cards/CTAs |
| AudienceToggle | **Keep**; eventueel omhoog |
| ProjectExperienceTeaser | **Combine** met carousel of inkorten (nu dubbele logo-ervaring) |
| ProcessAccordion | **Keep**; optioneel visuele timeline |
| WhyHelpingHands | **Keep** |
| DeploymentCards | **Keep** (sterkste sectorvisual) |
| QuickRequestForm | **Keep**; UX mailto verbeteren |
| FAQ + CTA | **Keep** |

---

## 5. Creativiteit van afbeeldingen

### Huidige kwaliteit

- **Sterk:** eigen crewfoto’s in `public/images/crew/*.webp` via `crewPhotos.ts` — branded shirts, scaffolding, stadion, keuken
- **Zwak:** hero gebruikt **geen** van deze foto’s
- Alt-teksten: over het algemeen beschrijvend en bruikbaar
- Optimalisatie: webp aanwezig; logo’s soms png/jpg/webp mix; carousel gebruikt `<img>` niet altijd `next/image`
- Geen externe hotlinks in homepage-beeldflow (goed)

### Consistency

- Crewfotos: consistente “op locatie”-sfeer
- Logo’s: wisselende crop/padding in bronbestanden → `object-contain` helpt
- SectorCards zonder beeld vs DeploymentCards mét beeld = inconsistentie

### Ideeën A–E

| | Idee | Doel |
|---|------|------|
| **A** | Hero collage (3–5 crew shots) | Eerste indruk = echt crewbedrijf |
| **B** | Image bento onder logo’s | Visuele ademhaling + storytelling |
| **C** | Sector cards met foto-achtergrond (DeploymentCards-stijl vroeger) | SectorCards vervangen/upgraden |
| **D** | Before / during / after strip (load-in → show → load-out) | Proces begrijpelijk maken |
| **E** | Interactive image cards i.p.v. pure tekstcards in hero | Behoud interactie + beeld |

### Aanbevolen mapstructuur (later)

```text
public/images/home/
  hero/
  crew/
  sectors/
  backgrounds/
```

Huidige assets mogen blijven in `/images/crew/` en `/images/logos/`; home-specifieke selects kunnen aliases/copies krijgen zonder hotlinks.

**Regel:** geen Unsplash/externe CDN-hotlinks op marketinghomepage.

---

## 6. Logo carrousel

**Component:** `LogoCarousel.tsx` → `getHomepageFeaturedLogos()` → `projectLogos.ts`  
**Card:** `ProjectLogoCard` variant `carousel` (180–260px breed)

### Sterke punten

- CSS-marquee (`.logo-carousel-track`), pause on hover
- Gradient fades links/rechts
- Eyebrow “Crewervaring” + veilige copy over inzet via opdrachten/partners
- Featured + priority: Crewstars, Factor F, Jaarbeurs eerst

### Banned brands check

Mag **niet** verschijnen: ID&T, Ironman, The Good Guyz, Your Productions, LOC7000, Q-dance.

| Status | Resultaat |
|--------|-----------|
| In `projectLogos` array | **Afwezig** (correct) |
| Alleen genoemd in comment / docs | OK |
| Orphan file `Q-dance_logo_2018.png` in `public/` | **Risico:** niet in UI, wel in repo — opruimen of buiten webroot houden |

### Preferred logos (lokaal)

| Logo | Bestand | In `projectLogos`? |
|------|---------|-------------------|
| Crewstars | `opdrachtgevers/crewstars.png` | **Ja** |
| Factor F | `opdrachtgevers/factor-f.webp` | **Ja** |
| TAP Crew | `opdrachtgevers/tap-crew.png` | **Nee** (bewust verwijderd; file bestaat) |
| Backstage Masters | `opdrachtgevers/backstage masters.png` | **Nee** (bewust; file bestaat) |
| MOJO | verwacht `mojo.png` | **Nee** — in `missingProjectLogos` |

**Aanbeveling:** TAP Crew + Backstage Masters opnieuw toevoegen *alleen* met disclaimer-taal; MOJO toevoegen zodra officieel lokaal bestand er is. Banned brands blijven hard blok.

### Leesbaarheid / broken

- Cards groot genoeg op desktop; op mobiel 180px is acceptabel
- `imageError → null` verbergt broken images (goed), maar kan “gaten” in track geven
- Grayscale hover: fancy, soms slechter leesbaar op lichte logo’s

### Claim language

Veilig aanwezig:

- Carousel: “ingezet via verschillende opdrachten, partners en producties”
- Teaser + FAQ + `projectExperienceDisclaimer`
- Vermijd: “wij werken voor / partners van / official supplier van …” zonder contract

---

## 7. Diensten-sectie

**UI:** `ServicesSection` + `ServiceTabs` + `ServiceCard` + `ServiceDetailDrawer`  
**Data:** `homeServices.ts` / re-export `services.ts`

### Huidig gedrag

- Tabs per categorie (Event, Horeca, Restaurant, …)
- “Alle” toont **featured** services (niet alle) op homepage — correct voor scanbaarheid
- Drawer voor detail; card-CTA “Personeel aanvragen” → `/contact`
- Introblok met deep links naar `/diensten`, landings en contact

### Sterke punten

- Rijke taxonomie (veel functies)
- Icon badges
- Interne links naar SEO-landings

### Zwakke punten

- Veel filters op homepage kan overwhelmen
- Cards zijn border/shadow-heavy (veel “card-UI”)
- Geen directe link per card naar matching landing (alleen drawer + contact)
- Diensten-sectie staat relatief ver onder logo’s/crewstrip

### Layout-verbeteringen

1. Featured-first grid (max 6–9) + “Bekijk alle diensten”
2. Card → primaire landing-link waar slug matcht (event-crew, stagehands, …)
3. Drawer behouden voor detail; CTA “Personeel aanvragen” prominent houden
4. Tabs sticky op mobiel of dropdown-select op smalle viewports

---

## 8. Conversie

### Frequentie “Personeel aanvragen” / contact-CTA’s

Voorkomt op homepage o.a. in:

- Header (`PublicHeader`)
- Hero primary
- Diensten-intro + elke `ServiceCard`
- `AudienceToggle` (clients)
- `WhyHelpingHands`
- `QuickRequestForm` submit
- `CTASection`
- `FloatingCTA` (desktop + mobiel sticky)

→ **Frequent genoeg**; risico is herhaling zonder nieuwe info, niet tekort.

### QuickRequest

- Mailto-flow: werkt zonder backend/API keys
- Frictie: gebruiker moet e-mailclient hebben; op mobiel wisselvallig
- Successtate legt tel + mail uit — goed
- Ontbreekt: WhatsApp deep link

### Sticky mobile CTA

- `FloatingCTA`: vaste bottom bar `Personeel | Werken`
- `body` heeft `pb-20` op `<lg` zodat content niet achter bar valt — goed
- Desktop floating panel na scroll (threshold 320)

### Trust nabij CTA’s

- Hero: bullets ja, soft proof nee
- QuickRequest: tel/mail spoedregel ja
- Eind-CTA: sfeerfoto ja, geen KvK/adres (adres hoort in footer — oké)

### Contactkanalen

| Kanaal | Status |
|--------|--------|
| Mail | Sterk (`info@…`, mailto forms) |
| Telefoon | In QuickRequest + siteConfig; beperkt in hero/header |
| WhatsApp | **Niet** aanwezig |
| Contactpagina | Primair conversiedoel |

---

## 9. SEO

### Title / meta / H1

| Item | Waarde |
|------|--------|
| Homepage title | `Helping Hands Agency \| Event crew & horecapersoneel inhuren` (`absoluteTitle: true`) |
| Meta description | `siteConfig.description` (inhuren + festivals/stadions/… + briefing) |
| H1 | Event crew en horecapersoneel inhuren voor events en producties. |

### Headings

- Meerdere duidelijke H2’s (Trust, Diensten, Audience, Projecten, Werkwijze, Why, Sectoren, QuickRequest, FAQ)
- Let op: twee “sector”-achtige blokken (SectorCards + DeploymentCards) → keyword-spreiding oké, UX-dubbel

### Interne links

Sterk naar `/diensten/*`, `/projecten`, `/contact`, `/vacatures`, `/over-ons`. Landings zijn live — homepage deep links kunnen nog uitgebreider per service card.

### Alts / keywords / local SEO

- Alts op crewfoto’s aanwezig
- Local: Hilversum in `siteConfig` + Organization PostalAddress; homepage-copy is landelijk (bewust)
- Overweeg 1× “Hilversum / Midden-Nederland / landelijk” in TrustBar of footer-adjacent blok

### Schemas / OG / canonical

- FAQPage JSON-LD op homepage (`faqJsonLd(homeFaqs)`)
- Organization + WebSite in root layout
- OG/Twitter via `buildPageMetadata`
- **Canonical:** `absoluteUrl("/")` → default `https://helpinghandsagency.nl`  
  **Let op:** domein-DNS kan nog pending zijn; live staat op Vercel. Zolang `NEXT_PUBLIC_SITE_URL` niet op het live Vercel-domein staat, kunnen canonical/OG naar het toekomstige domein wijzen. Documenteer env per environment.

### Performance & SEO

- Veel client components op homepage (hero, services, forms, reveal) → hydrate cost
- Images deels `next/image` (crew, deployment, CTA); logo carousel `<img>`

### Keywordlijst (prioriteit voor homepage + landings)

Primair:

- event crew inhuren
- horecapersoneel inhuren
- stagehands inhuren
- personeel evenementen
- crew uitzendbureau events

Secundair:

- restaurant personeel inhuren
- keukenpersoneel / barpersoneel
- productie assistentie / logistiek hospitality
- festival crew / stadion crew / beurs personeel

Lokaal:

- Helping Hands Agency Hilversum
- event crew Hilversum / Midden-Nederland

---

## 10. Interactie / animatie

**Voorkeur:** CSS transitions + lichte client hooks — **geen Framer Motion** tenzij strikt nodig.

### Nu aanwezig

- `RevealOnScroll` (IntersectionObserver, reduced-motion aware)
- Header height/background transitions
- Logo carousel CSS keyframes
- Hover scale op foto’s/cards
- Accordion grid-rows animatie (`ProcessAccordion`)
- Service drawer, audience toggle, hero card select

### Aanbevelingen

1. Hero collage: soft fade/slide met CSS only
2. Sector hover al goed — niet overdrijven
3. Vermijd scroll-jacking en zware parallax
4. Behoud `prefers-reduced-motion` patroon van `RevealOnScroll`

---

## 11. Mobile

### 320–414

- Sticky CTA + header CTA: conversie sterk
- Hero + 4 interactive cards: lange first screen
- SectorCards: op mobiel descriptions deels `max-h-0` tot hover — **touch heeft geen hover** → copy kan verborgen blijven (`group-hover`) — fix nodig
- Services tabs: horizontale overflow risico bij 9 filters
- QuickRequest type-grid: 6 buttons — bruikbaar maar lang

### Tablet

- 2-koloms grids werken; logo carousel prettig
- AudienceToggle en QuickRequest splitten netjes vanaf `lg`

### Desktop

- Header dropdowns vanaf `lg`
- Floating CTA rechtsonder na scroll
- Hero 2-koloms layout sterkste desktop-compositie — baat bij echte media rechts

---

## 12. Performance

| Onderwerp | Observatie |
|-----------|------------|
| Images | Crew webp + `next/image` op strip/deployment/CTA |
| Logo’s | `<img>` in carousel/cards; geen priority/sizing via Image |
| Client JS | Veel `"use client"` islands op homepage |
| CLS | Aspect-ratio op crew strip (`aspect-[3/4]`) goed; logo cards vaste heights helpen |
| CWV | Grootste risico: LCP = tekst/gradient hero (snel) óf later zware images zonder priority |
| Aanbeveling | Hero collage: 1 LCP image `priority`; rest lazy; carousel `loading="lazy"` |

---

## 13. Content

### Tone

- Direct, operationeel, Nederlands B2B: “datum, locatie, functies, briefing”
- Weinig bullshit; soms generiek (“beste crewbedrijf van Nederland” in Why — claim soft, onderbouw met bewijs)

### Differentiatie

Uniek t.o.v. generiek uitzendbureau:

- Event + horeca + stagebouw in één taal
- Projectervaring-disclaimer (eerlijk)
- Dual funnel opdrachtgever/crew
- Eigen branded crewfoto’s

Mist nog:

- Reactietijd / regio-dekking / teamgrootte (alleen als waar)
- Korte case-snippet (1 productie, 1 resultaat) zonder partnership-claim

### Suggested blocks (content)

1. “Wat we nodig hebben voor een snelle bezetting” (checklist)
2. “Last-minute vs gepland” (2 scenario’s)
3. Hilversum + landelijke inzet (local SEO)
4. Veilige projectzin bij logo’s (al grotendeels aanwezig)

---

## 14. Prioriteitenlijst P1–P5

### P1 — Conversie & first impression (hoogste impact)

- Hero media collage met lokale crewfoto’s
- Trust nabij primary CTA (tel / regio / snelle opvolging)
- SectorCards touch-fix (geen hover-only copy)
- Header/mobiel: optioneel `tel:` snelle actie

### P2 — Bewijs & logo’s

- Carousel claim language audit
- Preferred logos (TAP Crew, Backstage Masters) veilig heractiveren indien gewenst
- Orphan banned files opruimen (`Q-dance_logo_2018.png`)
- ProjectExperienceTeaser vs LogoCarousel dedupliceren

### P3 — Diensten & sectorvisuals

- Services cards → landings linken
- DeploymentCards als primaire sectorsectie; SectorCards inkorten/verwijderen
- Image bento i.p.v. platte 6-up strip (optioneel)

### P4 — SEO & techniek

- `NEXT_PUBLIC_SITE_URL` per environment documenteren (Vercel vs helpinghandsagency.nl)
- Homepage local phrase + interne links naar alle landings
- FAQ uitbreiden met 1–2 local/conversievragen
- Logo’s waar zinvol naar `next/image`

### P5 — Polish & performance

- Reveal/motion finetune CSS-only
- QuickRequest WhatsApp-optie of “kopieer aanvraag”
- LCP priority op hero image
- Filter-UI services op mobiel vereenvoudigen

---

## 15. Sterke / zwakke punten + concrete verbeteringen

### Sterke punten

1. Duidelijke **inhuren**-propositie in title + H1
2. Volwassen design system (navy `#0B1F4D`, oranje `#F28C28`)
3. Sticky header + sticky mobile CTA
4. Eigen crewfotografie i.p.v. stock-only
5. Veilige projectlogo-claimtaal + FAQ
6. SEO foundation: metadata, FAQ/Organization schema, service landings
7. Dual audience (opdrachtgever/crew) expliciet
8. QuickRequest zonder backend-afhankelijkheid
9. Banned brands niet in actieve `projectLogos`
10. Bedrijfsgegevens compleet in `siteConfig`

### Zwakke punten

1. Hero zonder echte foto’s
2. SectorCards hover-only copy op touch
3. Dubbele logo-secties (carousel + teaser)
4. Dubbele sector-secties (tekst + foto)
5. Mailto-frictie QuickRequest
6. Orphan logo-bestanden (o.a. Q-dance) in `public/`
7. Preferred partnerlogo’s (TAP/Backstage/MOJO) niet/incompleet in catalogus
8. Weinig directe `tel:`/WhatsApp in hero/header
9. Veel client JS op homepage
10. Canonical/domein mogelijk niet gelijk aan live Vercel-URL

### Concrete verbeteringen (samenvatting)

1. Hero collage uit `/images/crew/`
2. Touch-vriendelijke sector copy
3. Carousel + teaser samenvoegen of teaser inkorten
4. Services → SEO-landings
5. Preferred logos veilig toevoegen; banned orphans verwijderen
6. Tel/WhatsApp naast mail
7. Env-canonical strategie
8. Bento i.p.v. uniforme strip
9. Werkwijze als horizontale timeline op desktop
10. LCP/`priority` + lazy logos

---

## Componentkaart (homepage)

| UI | Pad |
|----|-----|
| Page | `src/app/page.tsx` |
| Layout chrome | `ConditionalSiteChrome`, `PublicHeader`, `MobileMenu`, `Footer`, `FloatingCTA` |
| Hero | `sections/PageHero`, `PageHeroHighlights`, `PageHeroInteractiveCard` |
| Trust / why / FAQ | `TrustBar`, `WhyHelpingHands`, `FaqSection` |
| Sectoren | `SectorCards`, `DeploymentCards` |
| Logo’s | `LogoCarousel`, `ProjectExperienceTeaser`, `ProjectLogoCard` |
| Diensten | `ServicesSection`, `ServiceCard`, `ServiceTabs`, `ServiceDetailDrawer` |
| Conversie | `AudienceToggle`, `QuickRequestForm`, `CTASection`, `ProcessAccordion` |
| Motion | `RevealOnScroll` |
| Data | `pageHeroContent`, `siteConfig`, `projectLogos`, `crewPhotos`, `homeServices`/`services`, `faq`, `seo`, `navigation`, `content` (deployments) |

---

*Dit document is de bron voor `docs/homepage-improvement-cursor-prompt.md`.*
