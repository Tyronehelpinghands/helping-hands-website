# Cursor-prompt — Helping Hands Agency naar topniveau

Plak dit blok hieronder als één prompt in Cursor Agent. Werk in de repo `helping-hands-website`. Lees eerst `AGENTS.md` / Next.js docs in `node_modules/next/dist/docs/` vóór je nieuwe APIs gebruikt.

---

Je bent een senior Next.js engineer + SEO + UX specialist. Breng https://helping-hands-website.vercel.app/ naar topniveau voor Helping Hands Agency (crew/personeel voor events, horeca, restaurants, keuken, bar, stagebouw, productie, logistiek, hospitality).

**Merkdoel:** beste crewbedrijf van Nederland — professioneel, betrouwbaar, modern, interactief.  
**Inspiratie:** https://www.crewstars.nl/ alleen voor interactie/vertrouwen/sticky header — **geen** teksten/layout/kleuren 1-op-1 kopiëren.  
**Domein:** configureerbaar via `src/lib/siteConfig.ts` (default `https://helpinghandsagency.nl`, Vercel mag tijdelijk).  
**Preserve:** bestaande brandkleuren `#0B1F4D` / `#173A8A` / `#F28C28`, crewfoto’s in `public/images/crew/`, juridische projectdisclaimer, geen “officiële partner”-claims.

## Harde regels

1. Geen lege logo-cards / broken images op live UI.
2. Verwijderd blijven: Ironman, Q-dance, The Good Guyz, Your Productions, LOC7000, ID&T (en TAP Crew / Backstage Masters / Backbone / Stadsfestival tenzij echte logo’s opnieuw bewust worden toegevoegd).
3. Geen Framer Motion tenzij strikt nodig — CSS + kleine client components.
4. Geen secrets in frontend; Moneybird/Shiftbase/Maps server-side.
5. `npm run build` moet slagen.
6. Geen horizontale scroll op mobiel.
7. Documenteer in `docs/website-audit.md`, `docs/seo-plan.md`, `docs/next-steps.md`; update `docs/missing-project-logos.md` en `docs/mobile-responsive-audit.md`.

## Huidige stand (niet opnieuw uitvinden)

- Sticky scroll header bestaat al in `src/components/Header.tsx` — **upgrade**, niet scrapen tenzij refactor naar `PublicHeader` schoner is.
- FloatingCTA bestaat (`src/components/FloatingCTA.tsx`).
- Unieke heroes: `PageHero` + `pageHeroContent.ts`.
- 42 diensten in `src/lib/homeServices.ts` (9 categorieën).
- Projectlogo’s: `src/lib/projectLogos.ts`.
- **Ontbreekt:** `sitemap.ts`, `robots.ts`, OG/Twitter/canonical, JSON-LD, FAQ, `siteConfig.ts`, SEO landings.

---

## P1 — Direct uitvoeren

### 1) `src/lib/siteConfig.ts`
```ts
export const siteConfig = {
  name: "Helping Hands Agency",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://helpinghandsagency.nl",
  email: "info@helpinghandsagency.nl",
  applicationsEmail: "aanmeldingen@helpinghandsagency.nl",
  phone: "", // alleen invullen als bevestigd
  locale: "nl_NL",
  defaultOgImage: "/images/brand/helping-hands-logo.png",
};
```

### 2) SEO foundation
- Update `src/app/layout.tsx`: `metadataBase`, default `openGraph`, `twitter`, title template.
- Maak `src/lib/seo.ts` met helpers: `buildPageMetadata()`, `organizationJsonLd()`, `websiteJsonLd()`, `breadcrumbJsonLd()`, `faqJsonLd()`, `serviceJsonLd()`, `jobPostingJsonLd()`.
- Maak `src/app/sitemap.ts` — alleen publieke marketing routes (geen `/dashboard/*`, `/portaal/medewerkers/*`, `/portaal/opdrachtgevers/*`, `/login` optioneel noindex i.p.v. sitemap).
- Maak `src/app/robots.ts` — allow `/`, disallow dashboard/portaal-subroutes; sitemap URL via siteConfig.
- Per pagina unieke metadata + canonical + OG: `/`, `/diensten`, `/opdrachtgevers`, `/medewerkers`, `/vacatures`, `/projecten`, `/over-ons`, `/contact`.
- `/login` + `/portaal` + alle dashboard/portal pages: `robots: { index: false, follow: false }`.
- Voeg JSON-LD Organization (+ EmploymentAgency/LocalBusiness waar passend) toe in root layout of een `JsonLd` component.
- FAQPage schema waar FAQ staat; JobPosting op vacatures (geen fake salaris); BreadcrumbList op contentpages.

### 3) Cleanup
- Verwijder of markeer deprecated `src/lib/logos.ts` + ongebruikte `LogoShowcase` zodat verwijderde merken niet terugkomen.
- Zorg dat homepage carousel alleen featured uit `projectLogos` toont (geen ID&T/Ironman/etc.).

### 4) Security note in docs
- Documenteer: demo-internal cookie geeft API-toegang; plan echte Supabase auth + strengere API gate (P4).

---

## P2 — Content, conversie, SEO diepte

### Homepage (`src/app/page.tsx`)
Behoud sterke secties; voeg toe / versterk:
1. Hero (bestaand, polish)
2. Trust/proof bar (zonder nep-cijfers — kwalitatieve claims of echte counts uit logo’s)
3. Logo carousel (alleen geldige featured logos)
4. Diensten (ServiceFilter / homeServices)
5. Audience toggle opdrachtgever/crew
6. Projectervaring teaser → `/projecten`
7. Werkwijze (ProcessAccordion)
8. **Waarom Helping Hands** (nieuw)
9. Sectoren (DeploymentCards)
10. Snelle aanvraag (QuickRequestForm)
11. **FAQ** (nieuw component)
12. Eind-CTA + FloatingCTA

Maak:
- `src/components/sections/FaqSection.tsx` + data in `src/lib/faq.ts` (aparte FAQ home/contact/opdrachtgevers waar nodig)
- `src/components/sections/WhyHelpingHands.tsx`
- `src/components/sections/TrustBar.tsx`

### Diensten
- Consolideer naar `src/lib/services.ts` (mag re-export/merge van `homeServices.ts` zijn — geen dubbele waarheid).
- Zorg ≥4 services per categorie: Event, Horeca, Restaurant, Keuken, Bar, Stagebouw, Productie, Logistiek, Hospitality.
- Componenten (refactor of alias bestaande ServiceFilter):
  - `ServicesSection`, `ServiceCard`, `ServiceTabs`, `ServiceDetailDrawer` onder `src/components/sections/` indien nog niet aanwezig.
- Optioneel SEO landings (minimaal 1–2 nu, rest TODO in docs):
  - `/diensten/event-crew`, `/diensten/horeca-personeel`, `/diensten/stagehands`, `/diensten/restaurant-personeel`, `/diensten/keukenpersoneel`, `/diensten/barpersoneel`, `/diensten/productie-assistentie`, `/diensten/logistiek`, `/diensten/hospitality`
  - Plus later: `/personeel-inhuren`, `/crew-aanmelden`, `/event-personeel-nederland`, `/horeca-personeel-inhuren`, `/stagehands-inhuren`

### Projecten
- Geen lege cards; missing → `docs/missing-project-logos.md`.
- Veilige copy: “projectervaring”, “crewervaring opgedaan”, “via jobs/partners/producties”.
- Verbeter grid/carousel/filters (grotere cards, object-contain).

### Vacatures
- JobPosting JSON-LD per vacature zonder nep-salaris.
- Duidelijke title/locatie/type/taken/profiel/CTA.

### Contact / conversie
- Sterker formulierblok: datum, locatie, tijden, aantal, functies, kleding/PBM, contactpersoon, briefing.
- Spoedaanvraag + crew-aanmeld CTA + FAQ + trust.
- Mag UI-only blijven als backend ontbreekt, maar professioneel.

### Over-ons / Opdrachtgevers / Medewerkers
- Meer unieke SEO-tekst (niet homepage herhalen).
- Behoud foto’s; versterk interne links naar diensten/contact/vacatures.

---

## P3 — Header & interactie (Crewstars-niveau, eigen stijl)

Refactor of upgrade publieke header:

**Gewenste bestanden (mag Header.tsx opsplitsen):**
- `src/components/layout/PublicHeader.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/HeaderDropdown.tsx`
- `src/hooks/useScrollHeader.ts`

**Gedrag:**
- Top: ruimer, meer transparant over donkere heroes waar passend
- Na scroll: compacter, logo kleiner, wit/glass blur, shadow/border
- CTA “Personeel aanvragen” altijd zichtbaar
- Active route highlight
- Mooiere dropdowns
- Mobiel: professioneel slide-over, body scroll lock, sluit bij navigatie, geen horizontal overflow
- Optioneel: subtiele scroll progress bar

Werkt op: `/`, `/diensten`, `/opdrachtgevers`, `/medewerkers`, `/vacatures`, `/projecten`, `/over-ons`, `/contact`, `/login`, `/portaal`.

### Micro-interacties
- Hover cards, FAQ accordion, service drawer/tabs, logo carousel, section reveal via IntersectionObserver/CSS
- Floating CTA behouden/polish
- Geen zware animatie-libs

---

## P4 — Portalen (alleen als P1–P3 stabiel)

- Login redirects per rol
- Intern dashboard niet default voor iedereen
- Medewerkersportaal: geen goedkeuringsflow voor uren die intern is
- Opdrachtgevers: geen marges/interne crewdata
- Demo-banners duidelijk
- Versterk API auth: demo cookie niet eeuwig volledige productie-API (feature flag of env)

---

## Keyword focus (copy + landings)

Gebruik natuurlijk in titles/H1/H2/body (geen stuffing):  
crew evenementen, event crew inhuren, stagehands inhuren, horeca personeel inhuren, restaurant personeel inhuren, productie crew, event personeel Nederland, personeel evenementenbureau, horeca uitzendbureau, stagebouw personeel, runners event, barpersoneel inhuren, koks inhuren, keukenhulp inhuren, hospitality crew, logistiek personeel evenementen, crew agency Nederland, personeel festival/concert/beurs/stadion.

---

## Acceptatiecriteria

- [ ] `npm run build` slaagt
- [ ] `/sitemap.xml` en `/robots.txt` werken
- [ ] Elke marketingpagina: unieke title, description, H1, canonical, OG
- [ ] Login/portaal/dashboard: noindex
- [ ] Organization (+ relevante) JSON-LD aanwezig
- [ ] FAQ op home en/of contact
- [ ] Header scroll-gedrag merkbaar professioneler
- [ ] Mobiel menu + geen horizontal scroll
- [ ] Geen broken/empty logo cards
- [ ] Ongewenste merken niet zichtbaar
- [ ] Docs bijgewerkt
- [ ] Geen partnership-claims zonder bewijs

## Werkwijze

1. P1 eerst (SEO foundation + cleanup) → build  
2. P2 content/FAQ/conversie → build  
3. P3 header polish → build + mobiel check  
4. P4 alleen met expliciete go  
5. Commit niet tenzij gevraagd; push niet tenzij gevraagd

Start nu met P1.
