# Cursor-prompt: Over ons & Diensten — Helping Hands Agency

Gebruik dit document later als **één complete implementatie-opdracht** in Cursor.  
Analysebron: [`docs/about-services-analysis.md`](./about-services-analysis.md) (27 juli 2026).

---

## Rol

Je bent senior UX/UI designer, Next.js developer, conversie- en SEO-specialist.  
Implementeer verbeteringen voor **Over ons** en **Diensten** (hub + landings) volgens de acceptatiecriteria hieronder.

---

## Harde regels

1. **Geen full-site redesign.** Scope = Over ons, Diensten-hub, SEO-landings, en strikt nodige shared componenten/data (PageHero content, ServicesSection-gedrag, nav/footer links, FAQ).
2. **Geen routes breken.** Alle bestaande paths moeten blijven werken:
   - `/over-ons`
   - `/diensten`
   - `/diensten/event-crew`
   - `/diensten/horeca-personeel`
   - `/diensten/stagehands`
   - `/diensten/restaurant-personeel`
   - `/diensten/keukenpersoneel`
   - `/diensten/barpersoneel`
   - `/diensten/productie-assistentie`
   - `/diensten/logistiek`
   - `/diensten/hospitality`
3. **SEO-landings bestaan al** (`published: true` in `src/lib/services.ts`). **Niet deleten** en niet massaal op `published: false` zetten tenzij een landing aantoonbaar pure duplicate is *en* de analyse dat concludeert. Standaard: **verrijken en differentiëren**.
4. **Geen willekeurige tekstinkorting** van het Over ons-verhaal. Wel: H1/H2 dedupe, lichte claimtaal-finetune, structuur/CTA’s.
5. **Veilige claimtaal only:** projectervaring via jobs/partners/producties. Nooit “officiële partner” / partnership-claims zonder expliciete waarheid. Banned brands (ID&T, Ironman, The Good Guyz, Your Productions, LOC7000, Q-dance) nergens toevoegen.
6. **Geen Framer Motion** tenzij strikt noodzakelijk; voorkeur CSS + bestaande Reveal/RevealOnScroll.
7. **Geen nieuwe externe libraries** tenzij onvermijdelijk.
8. **Geen API keys** / geheimen in code of docs.
9. Afbeeldingen: **alleen lokaal** onder `public/`.
10. Behoud merktaal: navy `#0B1F4D` / `#173A8A`, oranje `#F28C28`, dual CTA “Personeel aanvragen” / “Crew aanmelden” (of “Werken bij Helping Hands” waar passend).
11. Lees relevante Next.js docs in `node_modules/next/dist/docs/` bij twijfel (dit project wijkt af van klassiek Next).
12. **`npm run build` moet slagen.**

---

## Strategische beslissing (vast)

**Option A — nu:** versterk `/diensten` als complete centrale hub.  
**Landings:** behouden; unieke content per landing verrijken; duplicatie van de volledige functiecatalogus op landings verminderen door te ankeren/verwijzen naar de hub.  
**Niet** de landings “verbergen tot uniek genoeg” — ze hebben al unieke H1/intro/bullets/meta. Maak ze *unieker*, delete ze niet.

---

## Scope — exacte bestanden / routes

### Primair (verwacht te wijzigen)

**Over ons**

- `src/app/over-ons/page.tsx`
- `src/lib/overOnsContent.ts`
- `src/lib/pageHeroContent.ts` (alleen `/over-ons` entry)
- `src/components/over-ons/*` (Stats, Timeline, Split, Collage, Quote, Reveal — polish, niet herschrijven zonder noodzaak)

**Diensten hub + landings**

- `src/app/diensten/page.tsx`
- `src/app/diensten/[slug]/page.tsx`
- `src/lib/services.ts` (content verrijken; `published` behouden tenzij uitzondering)
- `src/lib/homeServices.ts` (alleen als taxonomie/featured/mapping nodig is)
- `src/lib/pageHeroContent.ts` (`/diensten` entry)
- `src/components/sections/ServicesSection.tsx`
- `src/components/sections/ServiceCard.tsx`
- `src/components/sections/ServiceTabs.tsx`
- `src/components/sections/ServiceDetailDrawer.tsx`
- `src/components/sections/PageHero.tsx` (alleen als shared hero-gedrag voor deze themes nodig is)

**Navigatie / SEO / FAQ**

- `src/lib/navigation.ts` (diensten-dropdown)
- `src/components/Footer.tsx` (`serviceLinks`)
- `src/lib/faq.ts` (+ eventueel FaqSection hergebruik)
- `src/lib/seo.ts` (alleen als nieuw schema-helper nodig)
- `src/app/sitemap.ts` (alleen als landings/hub priority bewust wijzigt — default behouden)

### Niet aanpassen (tenzij build break)

- Dashboard / auth / portalen
- Homepage full redesign (hooguit shared ServicesSection-prop die home niet breekt)
- Backend, HubSpot, Moneybird, env secrets
- Domein-DNS

### Behoud / bouw voort op

- 9 published SEO landings met unieke `h1` / `description` / `intro` / `bullets`
- `getLandingPathForService` mapping
- `buildPageMetadata`, BreadcrumbJsonLd, `serviceJsonLd`
- Over ons storytelling in `overOnsContent.ts`
- `siteConfig` bedrijfsgegevens

---

## Verbeteringen A–F (implementeren)

### A. Over ons — story, scanbaarheid, conversie

**Doel:** verhaal behouden; structuur en conversie verbeteren.

1. **H1/H2 dedupe:** hero H1 mag blijven *“Meer dan alleen een uitzendbureau.”*; geef intro-sectie (`overOnsIntro.title`) een **andere** H2 (bijv. “Wie wij zijn” / “Opgericht in 2022”) — geen inhoud schrappen.
2. **Mid-page CTA** na de opdrachtgevers-sectie (`overOnsClients`): Personeel aanvragen + Bekijk diensten (en optioneel Vacatures).
3. **Rolchips** in Growth: waar relevant linken naar matching `/diensten/[slug]` (stagehands, event-crew, horeca, keuken, logistiek, productie, hospitality).
4. **Timeline-copy:** finetune “professionele partner” naar veilige formulering zonder partnership-suggestie.
5. Optioneel: korte anker-nav (Missie / Aanpak / Opdrachtgevers / Groei) — geen zware sticky UI.
6. Closing card vs `CTASection`: dedupe of complementary maken (niet twee identieke blokken).
7. Optioneel FAQ (3–4 items) over missie vs kwaliteit, projectervaring, aanmelden, aanvragen — hergebruik geest van `faq.ts`; veilige claimtaal.

**Acceptatie A**

- [ ] Over ons-verhaal (Tyrone, 2022, potentieel/motivatie/begeleiding) blijft inhoudelijk intact
- [ ] Slechts één H1; intro-H2 is distinct
- [ ] Minstens één mid-page CTA-groep naar `/contact` en `/diensten`
- [ ] Geen partnership-claims; geen banned brands
- [ ] Routes intact; build ok

---

### B. Diensten-hub versterken (Option A)

**Doel:** `/diensten` wordt de complete centrale pagina.

1. Behoud `PageHero` + bestaande keyword-rijke meta (title mag SEO-scherper: diensten + event crew / stagehands / horeca — zonder stuffing).
2. Vervang of upgrade de pill-rij door een **category hub grid** van alle **9** published landings (titel, 1 zin, link). Bron: `getPublishedServiceLandings()`.
3. Houd `ServicesSection showAllWhenAlle` als functiezoeker **onder** de category grid.
4. Los overlapping op tussen pill-rij / horeca-subsectie / cards: één duidelijke hiërarchie (categories → functies → CTA). Horeca-highlight mag blijven als cluster, maar niet drie keer dezelfde links zonder meerwaarde.
5. “Planning / Briefing / Uitvoering”-strip: korte uitleg + link naar `/opdrachtgevers` of `/contact`.
6. Sterke eind-`CTASection` behouden.
7. Optioneel FAQ op hub (inhuren, wat aanleveren, sectoren) + `faqJsonLd`.

**Acceptatie B**

- [ ] `/diensten` toont alle 9 landings als primaire navigatie
- [ ] Functiefilter/catalogus blijft bruikbaar
- [ ] Primary CTA “Personeel aanvragen” duidelijk
- [ ] Geen broken links; hub voelt completer dan alleen filter-UI
- [ ] Build ok

---

### C. Landings differentiëren (niet deleten)

**Doel:** published landings unieker maken; duplicate catalogus-gevoel wegnemen.

1. Behoud per landing: unieke `h1`, `description`, `intro`, `bullets`, metadata, breadcrumb, `serviceJsonLd`.
2. **Verrijk** waar nodig: 1 unieke sectie extra (bijv. “Typische inzet”, “Wat wij afstemmen vooraf”, of 2–3 FAQ-items) — content moet per slug verschillen.
3. **Pas `ServicesSection` op landings aan:**
   - Of: toon alleen related category functies (geen volledige site-catalogus)
   - Of: vervang door compacte related list + CTA “Alle diensten filteren” → `/diensten`
   - Hub blijft de plek voor `showAllWhenAlle`
4. Cross-links naar andere landings behouden.
5. Voeg waar mogelijk 1 lokale image per landing/category toe (hergebruik bestaande crew/sector assets).
6. Zet **geen** landing op unpublished tenzij expliciet duplicate *en* geverifieerd; prefer unique content.

**Acceptatie C**

- [ ] Alle 9 paths nog 200 / statically generated
- [ ] Elke landing heeft merkbaar unieke body boven de fold + midden
- [ ] Geen volledige 42-card catalogus meer op elke landing (of duidelijk beperkt tot category)
- [ ] `generateStaticParams` / sitemap blijven alle published landings bevatten
- [ ] Build ok

---

### D. Interne links, nav, footer, taxonomie

1. Sync **nav dropdown** (`navigation.ts`) met strategische set landings — voeg minstens restaurant / keuken / bar / hospitality toe óf groepeer logisch zonder links te verliezen; behoud link naar `/diensten`.
2. Sync **footer** `serviceLinks`: dekking van alle 9 of bewuste 7+ met “Alle diensten”.
3. Behoud `getLandingPathForService` en card/drawer deep links; vul mapping-gaten alleen als functies orphan zijn.
4. Over ons Growth-rollen → landings (zie A).
5. Optionele ankers op hub: `#event`, `#horeca`, etc., als category grid IDs krijgt.

**Acceptatie D**

- [ ] Geen 404’s vanuit header/footer naar diensten
- [ ] Gebruiker kan vanuit nav én hub én cards bij landings
- [ ] Taxonomie (9 categories ↔ 9 landings) blijft coherent

---

### E. SEO, imagery, mobile, performance

**SEO**

1. Hub + landings: canonical via `buildPageMetadata` behouden.
2. Overweeg sterkere hub-title/description (keywords die al in live description zitten).
3. FAQ JSON-LD alleen met echte on-page FAQ.
4. Geen fake reviews/ratings.
5. Interne links met beschrijvende ankertekst (“Stagehands inhuren”, niet “klik hier”).

**Imagery**

1. Alleen lokale bestanden.
2. Over ons: optioneel hero media (lokaal); bestaande collage behouden/verbeteren.
3. Diensten: category/landing visual zonder floating badges op foto’s.

**Mobile**

1. Filtertabs bruikbaar op 320–414px (scroll of compact control).
2. Touch targets ≥44px behouden.
3. FloatingCTA mag content niet bedekken.
4. Category grid: 1 kolom mobiel, 2–3 desktop.

**Performance**

1. `next/image` + sizes; priority alleen LCP.
2. Geen zware client bundles toevoegen.
3. Minder dubbele client `ServicesSection` op landings = beter.

**Acceptatie E**

- [ ] Mobiel geen horizontale page-scroll
- [ ] LCP niet moedwillig verslechterd
- [ ] Metadata/canonical intact
- [ ] Build ok

---

### F. Acceptatie, waarschuwingen, oplevering

**Waarschuwing (hard):**  
Breek geen routes. Verwijder of unpublish landings niet “voor netheid”. Verrijk `/diensten` zonder de SEO-investering van de 9 landings weg te gooien.

**Eindchecks**

```bash
npm run build
```

Handmatig / checklist:

- [ ] `/over-ons` laadt; H1 correct; CTAs werken
- [ ] `/diensten` laadt; 9 category links werken
- [ ] Elke `/diensten/[slug]` laadt
- [ ] Header dropdown + footer links ok
- [ ] Geen “officiële partner”-copy geïntroduceerd
- [ ] Home `ServicesSection` niet per ongeluk gebroken (`showAllWhenAlle` default false)
- [ ] `npm run build` groen

**Oplevering aan gebruiker**

1. Korte samenvatting wat gewijzigd is (A–F).  
2. Wat bewust níet is gedaan.  
3. Lijst geraakte routes.  
4. Buildresultaat.  
5. Eventuele follow-ups (content die nog unieker kan).

---

## Aanbevolen implementatievolgorde

1. D — nav/footer sync (laag risico)  
2. B — hub `/diensten` category grid + structuur  
3. C — landings differentiatie + ServicesSection-gedrag  
4. A — Over ons H1/H2, CTA’s, rol-links, claimtaal  
5. E — FAQ/imagery/mobile/SEO polish  
6. F — build + checklist  

---

## Out of scope (expliciet later)

- Volledige rebrand  
- Nieuwe CMS  
- CRM-koppeling contactformulier  
- Dashboard UX  
- Depubliceren van landings “omdat hub genoeg is”  
- Willekeurig inkorten van `overOnsContent` paragraphs  

---

## Referentie — huidige H1’s (niet per ongeluk kwijtraken)

| Route | H1 nu |
|-------|--------|
| `/over-ons` | Meer dan alleen een uitzendbureau. |
| `/diensten` | De juiste mensen op de juiste plek. |
| `/diensten/event-crew` | Event crew inhuren voor festivals, concerten en beurzen |
| `/diensten/horeca-personeel` | Horeca personeel inhuren voor events en locaties |
| `/diensten/stagehands` | Stagehands inhuren voor load-in, opbouw en afbouw |
| `/diensten/restaurant-personeel` | Restaurant personeel inhuren voor service en floor support |
| `/diensten/keukenpersoneel` | Keukenpersoneel en koks inhuren |
| `/diensten/barpersoneel` | Barpersoneel inhuren voor bars, festivals en events |
| `/diensten/productie-assistentie` | Productie assistentie en runners voor live producties |
| `/diensten/logistiek` | Logistiek personeel voor evenementen en locaties |
| `/diensten/hospitality` | Hospitality crew voor events, VIP en ontvangst |

Landing-H1’s mogen aangescherpt worden voor SEO/clarity, maar moeten **uniek per slug** blijven en keyword-intent behouden.
