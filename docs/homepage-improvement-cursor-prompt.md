# Cursor-prompt: Homepage-verbeteringen Helping Hands Agency

Gebruik dit document later als **één complete implementatie-opdracht** in Cursor.  
Analysebron: [`docs/homepage-analysis.md`](./homepage-analysis.md) (28 juli 2026).

---

## Rol

Je bent senior UX/UI designer, Next.js developer, conversie- en SEO-specialist.  
Implementeer homepage- + publieke header-verbeteringen volgens de acceptatiecriteria hieronder.

---

## Harde regels

1. **Geen full-site redesign** — alleen homepage (`src/app/page.tsx` + sectiecomponenten die daarop staan) en publieke header/menu (`PublicHeader`, `MobileMenu`, `useScrollHeader`, eventueel `HeaderDropdown` / `BrandLogo` als nodig).
2. **Geen Framer Motion** tenzij strikt noodzakelijk; voorkeur CSS transitions + bestaande `RevealOnScroll`.
3. **Geen nieuwe externe libraries** tenzij onvermijdelijk; liever bestaande stack.
4. **Geen API keys**, geen geheimen in code of docs.
5. **Geen partnership-claims** bij projectlogo’s. Gebruik veilige claimtaal (zie hieronder).
6. **Banned brands** mogen nergens in UI/data verschijnen:
   - ID&T
   - Ironman
   - The Good Guyz
   - Your Productions
   - LOC7000
   - Q-dance  
7. Afbeeldingen: **alleen lokale bestanden** onder `public/` — **geen externe logo/foto-hotlinks**.
8. Behoud bestaande merktaal: navy `#0B1F4D` / `#173A8A`, oranje `#F28C28`, dual CTA “Personeel aanvragen” / “Crew aanmelden”.
9. **Geen componenten hard verwijderen** die elders nog nodig zijn; homepage mag imports/secties herschikken of inkorten. Geen layout-teardown.
10. `npm run build` moet slagen.
11. Lees relevante Next.js docs in `node_modules/next/dist/docs/` bij twijfel over APIs (dit project wijkt af van “klassiek” Next).

---

## Huidige staat (niet opnieuw bouwen)

Al aanwezig — **verbeteren, niet opnieuw uitvinden**:

- Hero staffing-collage (`StaffingHeroMedia` + `homeHeroCollage`)
- `HomeCrewBento` i.p.v. platte strip
- `DeploymentCards` als sectorfoto’s (geen `SectorCards` op home)
- Preferred logos incl. TAP Crew + Backstage Masters in carousel-priority
- Service cards → landings via `getLandingPathForService`
- QuickRequest spoedblok: tel / vast / WhatsApp / mail
- Header `tel:`-icoon, sticky `FloatingCTA`, Process desktop stepper
- FAQ + JSON-LD met Hilversum/landelijk + projectervaring-disclaimer

Focus van deze opdracht: **polish, frictie, mobile density, performance, soft claims, dedupe**.

---

## Veilige claimtaal (projectlogo’s)

Behoud formuleringen in de geest van:

> Onze crew is via jobs, partners en producties ingezet op …  
> Vermelde namen en logo’s duiden projectervaring en inzetgebieden aan. Helping Hands Agency claimt geen officiële partnershipstatus tenzij expliciet vermeld.

Bron: `projectExperienceDisclaimer` in `src/lib/projectLogos.ts`.  
Disclaimer bij carousel behouden. FAQ-item over projectervaring behouden.

---

## Preferred logos (alleen lokale bestanden)

Actief houden / alleen toevoegen als file bestaat + veilige copy:

- Crewstars — `public/images/logos/opdrachtgevers/crewstars.png`
- Factor F — `…/factor-f.webp`
- TAP Crew — `…/tap-crew.png`
- Backstage Masters — `…/backstage-masters.png` (kebab-case)
- Jaarbeurs — actief
- MOJO — alleen als goedgekeurd lokaal bestand aanwezig is

**Niet** toevoegen: banned brands hierboven.

---

## Scope — exacte bestanden / componenten

### Primair (verwacht te wijzigen)

- `src/app/page.tsx` — copy-dichtheid, eventueel lichte sectie-polish (volgorde is al goed)
- `src/lib/pageHeroContent.ts` — highlights/trust-tekst indien nodig (H1 “inhuren” behouden)
- `src/components/sections/PageHero.tsx` (+ `PageHeroHighlights`, `PageHeroInteractiveCard`)
- `src/components/layout/PublicHeader.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/hooks/useScrollHeader.ts` (alleen finetune)
- `src/components/LogoCarousel.tsx`
- `src/lib/projectLogos.ts` (+ eventueel `ProjectLogoCard.tsx`)
- `src/components/DeploymentCards.tsx`
- `src/components/sections/ServicesSection.tsx`, `ServiceCard.tsx`, `ServiceTabs.tsx`, `ServiceDetailDrawer.tsx`
- `src/components/ProcessAccordion.tsx` (lichte polish)
- `src/components/QuickRequestForm.tsx`
- `src/components/sections/FaqSection.tsx` / `src/lib/faq.ts`
- `src/components/sections/WhyHelpingHands.tsx` — soft claim temperen
- `src/components/sections/TrustBar.tsx` — optioneel local/trust zin
- `src/components/AudienceToggle.tsx` — alleen indien verplaatsen/compact maken
- `src/components/FloatingCTA.tsx` / `CTASection.tsx` (lichte trust nabij CTA)
- `src/components/sections/HomeCrewBento.tsx` / `src/lib/crewPhotos.ts` — photo dedupe + priority
- `src/app/globals.css` — carousel/hero/motion utilities indien nodig
- Optioneel map: `public/images/home/{hero,crew,sectors,backgrounds}/` (lokale kopieën/aliases, geen hotlinks)

### Niet aanpassen (tenzij build break)

- Dashboard / portalen / auth
- Volledige rest van marketingpages (tenzij gedeelde component breekt — dan minimaal fixen)
- Backend, HubSpot, Moneybird, env secrets
- Hard delete van `SectorCards.tsx` / `ProjectExperienceTeaser.tsx` (ze staan niet op home; laten staan)

### Behoud

- SEO landings published
- `siteConfig` company details + WhatsApp/tel
- Organization / WebSite / FAQ JSON-LD
- Homepage title/H1 “inhuren”
- QuickRequest mailto-flow (mag verbeteren, niet verplicht API)
- Header transparent → glass compact
- Sectievolgorde Hero → Trust → Logos → Bento → Diensten → Sectoren → Werkwijze → Why → Audience → QuickRequest → FAQ → CTA (tenzij analyse een kleine verplaatsing rechtvaardigt)

---

## Verbeteringen A–N (implementeren)

### A. Sticky scroll header

- Finetune `PublicHeader` + `useScrollHeader`: transparant op dark hero → glass/compact na scroll.
- Progress bar behouden.
- Mobiel: CTA “Aanvragen” + menu bruikbaar op 320px.
- `tel:`-icoon behouden; optioneel discreet WhatsApp-icoon naast tel (`siteConfig.whatsappUrl` only).

**Acceptatie:** op `/` inverted header bovenaan; na scroll witte/glass compacte bar; geen layout jump > ~6px; menu Escape/overlay werkt; geen banned hotlinks.

### B. Hero media & mobiele dichtheid

- Behoud lokale crew-collage; **geen floating badges** over foto’s.
- H1/sub/primary CTA behouden (H1 blijft “inhuren…”).
- **Mobiel:** collage inkorten (bijv. 2–3 tiles) en/of interactive cards verplaatsen/verkleinen zodat primaire CTA sneller boven de fold blijft.
- Desktop: collage + compacte cards mogen blijven.
- Exact **één** homepage LCP-image met `priority` (hero collage hero-tile); geen tweede eager LCP in bento.

**Acceptatie:** eerste viewport voelt als crewbedrijf; H1 “inhuren…” intact; primary CTA zichtbaar zonder extreme scroll op desktop; op 375px bereikbaar binnen redelijke scroll; geen externe images.

### C. Logo carousel

- Leesbaarheid/grootte finetunen; broken images netjes afhandelen.
- Priority featured behouden: Crewstars, Factor F, TAP Crew, Backstage Masters, Jaarbeurs.
- Banned brands hard uitsluiten.
- Veilige claim copy + disclaimer + link `/projecten` behouden.
- Overweeg `next/image` i.p.v. raw `<img>` waar dat CLS/lazy verbetert — zonder hotlinks.

**Acceptatie:** geen banned logos in DOM; disclaimer zichtbaar; carousel pauzeert op hover; `prefers-reduced-motion` gerespecteerd.

### D. Image bento polish

- Behoud `HomeCrewBento`; verbeter foto-select zodat overlap met hero/deployment daalt.
- Goede alts; `next/image` + sizes; **geen** `priority` op bento als hero al LCP is.
- Geen stock/externe CDN.

**Acceptatie:** visueel rijk; geen CLS; mobiel leesbaar; captions blijven.

### E. Services cards & filters

- Featured-first behouden (niet alle diensten dumpen op home).
- Intro in `page.tsx` inkorten tot ~1 alinea + bestaande link/CTA-rij.
- `ServiceCard`: CTA “Personeel aanvragen” + landing-link behouden.
- Mobiel: tabs bruikbaar maken (horizontale scroll verbeteren of native `<select>` / compact chips).

**Acceptatie:** max overwhelm; elke card heeft conversiepad; landingslinks werken; drawer open/close ok.

### F. Sector cards

- Behoud `DeploymentCards` als enige homepage-sectorsectie.
- Zet `SectorCards` **niet** terug op home.
- Optioneel: cards linken naar `/projecten` of relevante landing; copy iets concreter.
- Essentiële tekst altijd zichtbaar (geen hover-only).

**Acceptatie:** sectorinfo leesbaar op touch; geen dubbele tekst-sectorsectie op home.

### G. Werkwijze timeline

- Behoud 5 stappen + desktop stepper + mobiele accordion.
- Lichte CSS polish only; geen Framer Motion.
- Keyboard/accessible expand behouden.

**Acceptatie:** Aanvraag → Planning → Briefing → Uitvoering → Afhandeling intact; focus states zichtbaar.

### H. Snelle aanvraag

- Behoud mailto naar `planning@…`.
- Spoedblok met tel / vast / WhatsApp / mail behouden of versterken.
- Mitigeer frictie: duidelijke copy dat e-mailclient opent; optioneel “kopieer aanvraagtekst” fallback (geen API keys, geen backend verplicht).

**Acceptatie:** submit opent mailto met velden; tel/WhatsApp werken; geen secrets; geen console errors.

### I. FAQ

- Behoud FAQ + `faqJsonLd`.
- Max 1 nieuwe vraag alleen als écht nodig; geen keyword stuffing.
- Antwoorden matchen `siteConfig` contactgegevens.

**Acceptatie:** FAQ zichtbaar; JSON-LD structuur intact.

### J. SEO metadata & interne links

- Behoud sharpened title/H1.
- Check `buildPageMetadata` path `/`; description met primaire keywords.
- Interne links diensten/sectoren → landings behouden/versterken.
- Respecteer canonical via `siteConfig.url` / `NEXT_PUBLIC_SITE_URL` (niet hardcoden naar verkeerde host).
- Geen fake reviews/ratings schema.
- Soft claim in Why: vervang of nuanceer “beste crewbedrijf van Nederland” naar onderbouwbare taal.

**Acceptatie:** title/description/canonical correct; geen AggregateRating-spam; Why-copy veilig.

### K. Mobile UX

- Test mindset 320–414, tablet, desktop.
- Sticky `FloatingCTA` mag content niet bedekken (`pb-20` behouden/aanpassen).
- Header CTA + hamburger geen overflow.
- Hero + services + QuickRequest scanbaar.

**Acceptatie:** geen horizontale page-scroll; CTA’s tappable ≥44px; sticky bar dekt geen primaire form-knoppen af.

### L. Performance

- Eén LCP `priority` image op homepage.
- Geen zware client bundles toevoegen.
- `RevealOnScroll` spaarzaam.
- CLS vermijden met vaste aspect boxes.
- Logo’s lazy laden.

**Acceptatie:** `npm run build` groen; geen nieuwe TS/eslint errors in gewijzigde files.

### M. Trust & content polish

- TrustBar of hero: 1× “Hilversum · landelijk inzetbaar” (of gelijkwaardig) zonder IBAN/KvK in hero.
- Optioneel korte case-achtige zin (sector + type inzet) **zonder** partnership-claim.
- Dual audience tone behouden (professioneel clients / menselijk crew).

**Acceptatie:** local/trust zichtbaar nabij bovenste fold of TrustBar; geen banned brand names; geen onbewezen “#1” claims.

### N. Conversie-hiërarchie & CTA-fatigue

- Behoud primaire oranje CTA-taal.
- Verminder dubbele CTA-rijen waar ze geen nieuwe info toevoegen (bijv. diensten-intro vs cards).
- FloatingCTA / eind-CTA / QuickRequest laten samenwerken i.p.v. elkaar te schreeuwen.
- AudienceToggle mag blijven; verplaats alleen als het conversie aantoonbaar verbetert zonder layout-teardown.

**Acceptatie:** primaire actie blijft “Personeel aanvragen”; secondary “Crew aanmelden/vacatures”; pagina voelt gericht, niet als CTA-spam.

---

## Aanbevolen sectievolgorde (behouden tenzij sterke reden)

1. PageHero (+ media, mobiel lichter)
2. TrustBar (compact + local/trust)
3. LogoCarousel
4. HomeCrewBento
5. Diensten (`ServicesSection`)
6. Sectorfoto’s (`DeploymentCards`)
7. Werkwijze (`ProcessAccordion`)
8. WhyHelpingHands (veilige claims)
9. AudienceToggle
10. QuickRequestForm
11. FAQ
12. CTASection

---

## Acceptatiecriteria (totaal)

- [ ] Alleen homepage + publieke header/menu (en strikt nodige shared data) gewijzigd
- [ ] Geen full redesign / geen layout-teardown / geen onnodige component-deletes
- [ ] H1/title behouden focus op **inhuren**
- [ ] Hero toont lokale crewmedia (geen externe hotlinks)
- [ ] Mobiele hero merkbaar lichter of beter gescand
- [ ] Exact één LCP `priority` op home (of aantoonbaar bewust anders, toegelicht)
- [ ] Geen banned brands in UI
- [ ] Veilige logo-claimtaal + disclaimer zichtbaar
- [ ] Touch: geen hover-only essentiële copy
- [ ] Sticky header scroll-states werken
- [ ] Sticky mobile CTA werkt zonder content te verbergen
- [ ] QuickRequest mailto + tel/WhatsApp bereikbaar
- [ ] FAQ + bestaande JSON-LD intact
- [ ] Soft “beste van Nederland”-claim genuanceerd of onderbouwd
- [ ] Geen Framer Motion (tenzij aantoonbaar nodig en toegelicht)
- [ ] Geen API keys / secrets
- [ ] `npm run build` slaagt

---

## Werkwijze voor de agent

1. Lees `docs/homepage-analysis.md` en dit prompt-bestand.
2. Inspecteer huidige componenten vóór wijziging (state juli 2026 is al vergevorderd).
3. Implementeer A–N in logische stappen (geen drive-by refactors).
4. Run `npm run build`.
5. Korte samenvatting: wat gewijzigd, wat bewust niet, buildresultaat.

---

## Out of scope (expliciet later)

- Volledige rebrand
- Nieuwe animatielibrary
- CRM-/API-koppeling QuickRequest (tenzij later apart gevraagd)
- Domein-DNS / Vercel domain setup (wel env-aware canonical respecteren)
- Dashboard/portaal UX
- Verwijderen van ongebruikte marketingcomponenten enkel “om op te ruimen”
