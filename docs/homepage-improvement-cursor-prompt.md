# Cursor-prompt: Homepage-verbeteringen Helping Hands Agency

Gebruik dit document later als **één complete implementatie-opdracht** in Cursor.  
Analysebron: [`docs/homepage-analysis.md`](./homepage-analysis.md) (27 juli 2026).

---

## Rol

Je bent senior UX/UI designer, Next.js developer, conversie- en SEO-specialist.  
Implementeer homepage- + header-verbeteringen volgens acceptatiecriteria hieronder.

---

## Harde regels

1. **Geen full-site redesign** — alleen homepage (`src/app/page.tsx` + sectiecomponenten die daarop staan) en publieke header/menu (`PublicHeader`, `MobileMenu`, `useScrollHeader`, eventueel `HeaderDropdown` / `BrandLogo` als nodig voor header-polish).
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
   Verwijder orphan-bestanden uit `public/` als ze alleen tot verwarring leiden (o.a. `Q-dance_logo_2018.png`).
7. Afbeeldingen: **alleen lokale bestanden** onder `public/` — geen externe hotlinks.
8. Behoud bestaande merktaal: navy `#0B1F4D` / `#173A8A`, oranje `#F28C28`, dual CTA “Personeel aanvragen” / “Crew aanmelden”.
9. `npm run build` moet slagen.
10. Lees relevante Next.js docs in `node_modules/next/dist/docs/` bij twijfel over APIs (dit project wijkt af van “klassiek” Next).

---

## Veilige claimtaal (projectlogo’s)

Gebruik / behoud formuleringen in de geest van:

> Onze crew is via jobs, partners en producties ingezet op …  
> Vermelde namen en logo’s duiden projectervaring en inzetgebieden aan. Helping Hands Agency claimt geen officiële partnershipstatus tenzij expliciet vermeld.

Bron: `projectExperienceDisclaimer` in `src/lib/projectLogos.ts`.  
Toon disclaimer bij carousel en/of teaser. FAQ-item over projectervaring behouden.

---

## Preferred logos (alleen als lokaal bestand bestaat)

Mag (opnieuw) in catalogus als file bestaat + veilige copy:

- Crewstars — `public/images/logos/opdrachtgevers/crewstars.png` (al actief)
- Factor F — `…/factor-f.webp` (al actief)
- TAP Crew — `…/tap-crew.png` (file bestaat, nu niet in array)
- Backstage Masters — `…/backstage masters.png` (hernoem naar kebab-case bij toevoegen)
- MOJO — alleen als `mojo.png` aanwezig is

**Niet** toevoegen: banned brands hierboven.

---

## Scope — exacte bestanden / componenten

### Primair (verwacht te wijzigen)

- `src/app/page.tsx` — sectievolgorde, hero media, eventueel secties combineren
- `src/lib/pageHeroContent.ts` — hero copy/CTAs/highlights indien nodig (H1 “inhuren” behouden)
- `src/components/sections/PageHero.tsx` (+ highlights/interactive cards)
- `src/components/layout/PublicHeader.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/hooks/useScrollHeader.ts` (alleen finetune)
- `src/components/LogoCarousel.tsx`
- `src/lib/projectLogos.ts` (+ eventueel `ProjectLogoCard.tsx`)
- `src/components/SectorCards.tsx` en/of `src/components/DeploymentCards.tsx`
- `src/components/sections/ServicesSection.tsx`, `ServiceCard.tsx`, `ServiceTabs.tsx`, `ServiceDetailDrawer.tsx`
- `src/components/ProcessAccordion.tsx` (timeline-polish)
- `src/components/QuickRequestForm.tsx`
- `src/components/sections/FaqSection.tsx` / `src/lib/faq.ts`
- `src/components/sections/ProjectExperienceTeaser.tsx`
- `src/components/FloatingCTA.tsx` / `CTASection.tsx` (lichte trust nabij CTA)
- `src/lib/crewPhotos.ts` — hero/bento/sector image selects
- `src/app/globals.css` — carousel/hero/motion utilities indien nodig
- Optioneel map: `public/images/home/{hero,crew,sectors,backgrounds}/` (kopieën/aliases van bestaande assets)

### Niet aanpassen (tenzij build break)

- Dashboard / portalen / auth
- Volledige rest van marketingpages (tenzij gedeelde component per ongeluk breekt — dan minimaal fixen)
- Backend, HubSpot, Moneybird, env secrets

### Behoud / bouw voort op recente work

- SEO landings published
- `siteConfig` company details
- Organization JSON-LD
- Homepage title/H1 “inhuren”
- QuickRequest mailto
- Header transparent → glass compact (verbeteren, niet verwijderen)

---

## Verbeteringen A–L (implementeren)

### A. Sticky scroll header

- Finetune `PublicHeader` + `useScrollHeader`: transparant op dark hero → glass/compact na scroll.
- Progress bar behouden.
- Mobiel: CTA “Aanvragen” + menu blijven bruikbaar op 320px.
- Optioneel: `tel:`-link discreet naast CTA op `sm+`.

**Acceptatie:** op `/` inverted header bovenaan; na scroll witte/glass compacte bar; geen layout jump > ~6px; menu Escape/overlay werkt.

### B. Hero media collage

- Vervang of vul de rechterkant van `PageHero` (theme `staffing` / path `/`) met collage van **lokale** crewfoto’s (`crewPhotos` / `public/images/crew` of `public/images/home/hero`).
- Behoud H1/sub/CTAs/highlights; interactive cards mogen kleiner, tab-achtig, of onder de collage.
- Eén image `priority` voor LCP; rest lazy.
- Geen floating badges/stickers over foto’s.

**Acceptatie:** eerste viewport voelt als crewbedrijf (echte foto’s); H1 blijft “inhuren…”; primary CTA zichtbaar zonder scroll op desktop; mobiel: collage stacked, CTA’s bereikbaar.

### C. Logo carousel

- Grootte/leesbaarheid verbeteren; broken images netjes afhandelen.
- Priority featured: Crewstars, Factor F, (+ TAP Crew / Backstage Masters als toegevoegd).
- Banned brands hard uitsluiten.
- Veilige claim copy + link naar `/projecten`.
- Overweeg teaser vs carousel dedupliceren (één primaire logo-ervaring op home).

**Acceptatie:** geen banned logos in DOM; disclaimer of veilige zin zichtbaar; carousel pauzeert op hover; build ok.

### D. Image bento

- Upgrade “Onze crew in actie” strip naar bento-achtige compositie (wisselende spans/aspects) met bestaande crewfoto’s.
- Goede alts; `next/image` + sizes.

**Acceptatie:** visueel rijker dan uniforme 6-up grid; geen CLS; mobiel 2-koloms of gestapeld leesbaar.

### E. Services cards

- `ServicesSection` op homepage: featured-first, scanbaar.
- `ServiceCard`: duidelijke CTA “Personeel aanvragen”; waar mogelijk link naar matching `/diensten/[slug]`.
- Drawer behouden voor detail.
- Mobiel: tabs bruikbaar (scroll of select).

**Acceptatie:** max overwhelm; elke card heeft conversiepad; landingslinks werken; drawer open/close ok.

### F. Sector cards

- Los overlap `SectorCards` vs `DeploymentCards` op: één sterke sectorsectie met foto’s (DeploymentCards-stijl), of merge.
- **Touch-fix:** geen essentiële copy alleen via `group-hover` (nu kapot op mobile in `SectorCards`).

**Acceptatie:** sectorinfo leesbaar op touch devices; geen dubbele bijna-identieke secties zonder reden.

### G. Werkwijze timeline

- `ProcessAccordion` polish: op desktop optioneel horizontale/stepper timeline; mobiel accordion ok.
- CSS transitions only.

**Acceptatie:** 5 stappen blijven (Aanvraag → … → Afhandeling); keyboard/accessible expand.

### H. Snelle aanvraag

- `QuickRequestForm` verbeteren: heldere spoedregel met mail + telefoon; optioneel WhatsApp-link **alleen** als nummer al in `siteConfig` past (geen nieuw geheim).
- Mailto mag blijven; successtate duidelijk.
- Geen backend/API keys.

**Acceptatie:** form submit opent mailto met ingevulde velden; tel-link werkt; geen console errors.

### I. FAQ

- Behoud FAQ + `faqJsonLd`.
- Voeg max 1–2 vragen toe indien nodig (local/spoed/wat aanleveren) zonder keyword stuffing.

**Acceptatie:** FAQ zichtbaar op home; JSON-LD valide structuur; antwoorden matchen siteConfig-contact.

### J. SEO metadata

- Behoud sharpened title/H1.
- Check `buildPageMetadata` path `/`; description met primaire keywords.
- Interne links vanuit diensten/sectoren naar landings.
- Documenteer/respecteer: canonical volgt `siteConfig.url` / `NEXT_PUBLIC_SITE_URL` (DNS pending voor helpinghandsagency.nl — niet hardcoden naar verkeerde host zonder env).
- Geen fake reviews/ratings schema.

**Acceptatie:** view-source title/description correct; canonical aanwezig; FAQ/Organization niet kapot.

### K. Mobile

- Test mindset 320–414, tablet, desktop.
- Sticky `FloatingCTA` mag niet content bedekken (`pb-20` behouden/aanpassen).
- Header CTA + hamburger geen overflow.

**Acceptatie:** geen horizontale page-scroll; CTA’s tappable ≥44px; hero niet onbruikbaar lang zonder actie.

### L. Performance

- `next/image` waar zinvol; priority alleen LCP hero.
- Geen zware client bundles toevoegen.
- RevealOnScroll niet om élke pixel wrappen.
- CLS vermijden met vaste aspect boxes.

**Acceptatie:** `npm run build` groen; geen nieuwe eslint/TS errors in gewijzigde files.

---

## Aanbevolen sectievolgorde (na wijziging)

1. PageHero (+ media)
2. TrustBar (compact)
3. LogoCarousel (bewijs)
4. Image bento / crew
5. Diensten (`ServicesSection`)
6. Sectorfoto’s (één sectie)
7. Werkwijze
8. WhyHelpingHands
9. AudienceToggle (of eerder als compact)
10. QuickRequestForm
11. FAQ
12. CTASection

Pas `page.tsx` hierop aan; verwijder of merge duplicaten (SectorCards tekst-only / dubbele logo-teaser) volgens analyse.

---

## Acceptatiecriteria (totaal)

- [ ] Alleen homepage + publieke header/menu (en strikt nodige shared data) gewijzigd
- [ ] H1/title behouden focus op **inhuren**
- [ ] Hero toont lokale crewmedia
- [ ] Geen banned brands in UI
- [ ] Veilige logo-claimtaal zichtbaar
- [ ] Touch: geen hover-only essentiële copy
- [ ] Sticky header scroll-states werken
- [ ] Sticky mobile CTA werkt zonder content te verbergen
- [ ] QuickRequest mailto + telefoon bereikbaar
- [ ] FAQ + bestaande JSON-LD intact
- [ ] Geen Framer Motion (tenzij aantoonbaar nodig en toegelicht)
- [ ] Geen API keys
- [ ] `npm run build` slaagt

---

## Werkwijze voor de agent

1. Lees `docs/homepage-analysis.md` en dit prompt-bestand.
2. Inspecteer huidige componenten vóór wijziging.
3. Implementeer A–L in logische commits/stappen (geen drive-by refactors).
4. Run `npm run build`.
5. Korte samenvatting: wat gewijzigd, wat bewust niet, buildresultaat.

---

## Out of scope (expliciet later)

- Volledige rebrand
- Nieuwe animatielibrary
- CRM-koppeling QuickRequest
- Domein-DNS / Vercel domain setup (wel env-aware canonical respecteren)
- Dashboard/portaal UX
