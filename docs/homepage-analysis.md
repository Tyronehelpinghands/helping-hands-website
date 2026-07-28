# Homepage-analyse + SEO-score — Helping Hands Agency

**Datum:** 28 juli 2026  
**Live:** https://helping-hands-website.vercel.app/  
**Commit-basis:** o.a. `97d88ce` (crop-fix) + motion `17df5eb` + sprint 2  
**Bron:** live HTML + `src/app/page.tsx` / `seo.ts` / `siteConfig.ts` / `pageHeroContent.ts`

---

## Executive summary

De homepage is een **sterke, conversiegerichte landing** met duidelijke “inhuren”-propositie, dual funnel, eigen crewbeelden, motion en solide SEO-techniek.  

**Totaalscore homepage: 8.5 / 10**  
**SEO-score homepage: 8.6 / 10**

Grootste SEO-risico: **canonical/OG wijzen naar `helpinghandsagency.nl` terwijl de publieke host nu Vercel is** — zolang DNS/domein niet 1:1 klopt, verwatert signaal.

---

## Scores (1–10)

| Dimensie | Score | Toelichting |
|----------|------:|-------------|
| Professionaliteit | **8.5** | Consistente brand, echte foto’s, nette secties |
| Vertrouwen | **8.5** | Hilversum/trust, FAQ, veilige logo-claims, tel/WhatsApp |
| Visuele creativiteit | **8** | Collage, bento, ken-burns, stagger motion |
| Duidelijkheid | **9** | H1 “inhuren” + dual CTA’s |
| Conversiekracht | **8.5** | Sticky CTA, QuickRequest + kopieer, spoedkanalen |
| **SEO** | **8.6** | Sterke on-page + schema; canonical/env aandacht |
| Mobiele ervaring | **8** | Lichtere hero, chips, sticky bar |
| Interactiviteit | **8.5** | Motion + drawers/tabs zonder Framer |
| Beeldgebruik | **8.5** | Lokale webp’s; face-crop thumbs-up gefixt |
| Merkuitstraling | **8.5** | Navy/oranje + crew-identiteit |

**Gemiddelde ≈ 8.5**

---

## Live SEO-check (juli 2026)

| Element | Live waarde |
|---------|-------------|
| **Title** | `Helping Hands Agency \| Event crew & horecapersoneel inhuren` |
| **Meta description** | Huur event crew, stagehands en horecapersoneel… festivals, stadions, beurzen… |
| **Canonical** | `https://helpinghandsagency.nl` |
| **OG image** | `https://helpinghandsagency.nl/images/crew/concert-globe-stage.webp` |
| **H1** | Event crew en horecapersoneel inhuren voor events en producties. |
| **JSON-LD scripts** | 4 (o.a. Organization/EmploymentAgency, WebSite, FAQPage) |

### H2-structuur (live)

1. Professionele crew voor events, horeca en productie  
2. Projectervaring en inzetgebieden  
3. Onze crew in actie  
4. Crew en ondersteuning voor elke fase van je productie.  
5. Waar wij worden ingezet  
6. Zo werken wij  
7. Crew die meedenkt, niet alleen invult.  
8. Voor elke productie de juiste handen.  
9. Vraag snel crew aan  
10. Antwoorden voor opdrachtgevers en crew  

→ Eén H1, logische H2’s, keyword “crew / personeel / inhuren / events / horeca” terugkerend zonder stuffing.

---

## SEO-scorekaart (detail)

| SEO-onderdeel | Score | Status |
|---------------|------:|--------|
| Title tag | **9** | Merk + primaire intent “inhuren” |
| Meta description | **8.5** | Diensten + context + benefit; ~155–170 tekens-achtig |
| H1 | **9.5** | Exact match intent; niet te lang |
| Heading-hiërarchie | **9** | 1× H1, duidelijke H2’s |
| Keyword coverage | **8.5** | event crew, horeca, stagehands, festivals/stadions… |
| Interne links | **9** | Landings `/diensten/*`, projecten, contact, vacatures |
| Alt-teksten | **8.5** | Beschrijvend op crewfoto’s |
| Canonical | **6.5** | Domein ≠ live Vercel-host (risico) |
| Open Graph / Twitter | **8.5** | Crew-OG aanwezig; URL volgt siteConfig |
| Structured data | **9** | Org + EmploymentAgency + WebSite + FAQ |
| Local SEO | **8.5** | Hilversum in body/FAQ/address schema |
| Sitemap / robots | **9** | Core + landings; dashboards geblokkeerd |
| Content depth | **8** | FAQ + diensten + missie; weinig unieke cases |
| Performance SEO | **8** | 1 LCP priority; veel client islands / motion |
| Thin/duplicate risk | **8.5** | Landings bestaan; home is hub |

**Gewogen SEO-totaal: 8.6 / 10**

---

## Wat SEO al goed doet

1. **Intent-match:** title + H1 op “event crew / horecapersoneel **inhuren**”  
2. **EmploymentAgency + Organization** schema met adres, KvK, telefoons, `knowsAbout`  
3. **FAQPage** JSON-LD gekoppeld aan zichtbare FAQ  
4. **WebSite** schema in layout  
5. **Published SEO-landings** + interne deep links vanaf home  
6. **robots.txt** blokkeert login/dashboard/api; sitemap wijst marketing + landings  
7. **Local:** Hilversum zichtbaar (hero, TrustBar, FAQ)  
8. **OG** gebruikt crewfoto i.p.v. alleen logo  
9. Veilige claimtaal (geen nep-AggregateRating / partnerclaims)

---

## SEO-zwaktes / risico’s

1. **Canonical naar `helpinghandsagency.nl` terwijl traffic op `*.vercel.app` zit**  
   - Als custom domain niet (correct) live is: Google kan de verkeerde host indexeren of signalen splitsen.  
   - Fix: `NEXT_PUBLIC_SITE_URL` gelijk trekken aan de échte productie-host.

2. **OG/canonical absolute URLs** volgen dezelfde env — zelfde risico.

3. **Weinige “proof snippets” met unieke long-tail** (bijv. “event crew Hilversum inhuren” in body is soft; kan 1 zin sterker).

4. **Geen BreadcrumbList** op home (niet kritiek voor `/`).

5. **Motion/JS islands** kunnen LCP/INP raken → indirect SEO via Core Web Vitals.

6. **Case-content** nog generiek (“festival load-in”) — veilig, maar weinig unikere indexeerbare diepte.

---

## Keyword mapping (home)

| Intent | Aanwezig? | Waar |
|--------|-----------|------|
| event crew inhuren | ✅ | title, H1, meta, diensten |
| horecapersoneel inhuren | ✅ | title, H1, meta |
| stagehands | ✅ | meta, diensten-links |
| personeel festival / stadion / beurs | ✅ | meta + sectoren |
| crew agency / crewbedrijf Nederland | ⚠️ soft | merk + body, niet exact in title |
| event crew Hilversum | ✅ | local phrases + FAQ |
| bar/keuken/restaurant personeel | ✅ | diensten + FAQ |

---

## UX / conversie (kort)

**Sterk:** dual CTA, sticky mobile bar, QuickRequest + kopieer, spoed tel/WhatsApp, motion die premium voelt.  
**Let op:** lange pagina; CTA’s nog frequent (bewust verminderd in sprint 2).  
**Beeld:** thumbs-up face-crop gefixt (`object-position: 50% 0%`).

---

## Sectievolgorde (huidig)

1. Hero (+ motion + collage)  
2. TrustBar  
3. LogoCarousel  
4. Crew bento  
5. Diensten  
6. Sectoren  
7. Werkwijze  
8. Why (+ missie + case)  
9. AudienceToggle  
10. QuickRequest  
11. FAQ  
12. Eind-CTA  

→ Conversieflow blijft sterk; SEO-hubrol oké.

---

## Prioriteiten (SEO eerst)

### P1 — Techniek
- Productie-`NEXT_PUBLIC_SITE_URL` = echte live domain  
- Verifieer dat canonical/OG/sitemap/host allemaal dezelfde origin gebruiken  

### P2 — On-page
- 1–2 extra lokale zinnen (“event crew Hilversum / Midden-Nederland”) in TrustBar of Why  
- Optioneel title-test: `… inhuren | Hilversum` alleen als domein lokaal moet ranken  

### P3 — Diepte
- 1 echte case-blok met unieke tekst (zonder partnership-claim)  
- OG 1200×630 dedicated crop (nu landscape crew — oké, kan scherper)

### P4 — CWV
- Motion sparend houden; LCP blijft 1× hero priority  
- Monitor INP na motion-release  

---

## Conclusie

| Vraag | Antwoord |
|-------|----------|
| Is de homepage “af” als landing? | **Ja, op hoog niveau** — polish + motion + conversie |
| SEO-klaar om te ranken? | **Ja voor foundation**; winst zit in **domein/canonical consistentie** + lokale/case-diepte |
| SEO-score | **8.6 / 10** |
| Homepage-totaal | **8.5 / 10** |

*Dit document vervangt de eerdere baseline als actuele stand van juli 2026.*
