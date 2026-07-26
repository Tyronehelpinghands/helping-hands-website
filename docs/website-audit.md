# Website-audit — Helping Hands Agency

Datum: 25 juli 2026  
Live: https://helping-hands-website.vercel.app/

## Samenvatting

De site voelt al als een serieus crewbedrijf (CTA’s, diensten, foto’s, projectdisclaimer). SEO-fundament (P1), content/conversie (P2) en header/interactie (P3) zijn uitgevoerd. Portalen/security volgen in P4 (expliciete go).

## Uitgevoerde fixes

### P1 — SEO foundation

- `src/lib/siteConfig.ts` — configureerbaar domein (`NEXT_PUBLIC_SITE_URL` of `helpinghandsagency.nl`)
- `src/lib/seo.ts` — metadata + JSON-LD helpers
- `src/app/sitemap.ts` + `src/app/robots.ts`
- Root layout: `metadataBase`, Open Graph, Twitter, Organization/WebSite JSON-LD
- Unieke metadata + canonical/OG op marketingpagina’s
- `noindex` op login, portaal, dashboard, forgot/update-password
- JobPosting JSON-LD op `/vacatures` (geen fake salaris)
- Verwijderd: ongebruikte `LogoShowcase.tsx` + stale `logos.ts`

### P2 — Content / conversie / SEO-diepte

- Homepage: TrustBar, WhyHelpingHands, ProjectExperienceTeaser, FAQ + FAQPage schema
- `src/lib/faq.ts` + `FaqSection` (home, contact, opdrachtgevers)
- `src/lib/services.ts` (canonical API + landingsconfig; data blijft in `homeServices.ts`)
- Service UI: `ServicesSection` / `ServiceCard` / `ServiceTabs` / `ServiceDetailDrawer`
- SEO-landings live: `/diensten/event-crew`, `/diensten/horeca-personeel` (+ Service JSON-LD)
- Contactformulier uitgebreid (PBM, contact locatie, spoed, briefing)
- Uniekere SEO-copy + interne links op opdrachtgevers / medewerkers / projecten / over-ons
- Projectlogo-grid: grotere cards, `object-contain`

### P3 — Header / interactie (gedaan)

- `PublicHeader` fixed overlay: transparant/wit-logo op donkere heroes → glass/compact na scroll
- `MobileMenu` slide-over + body scroll lock + CTA altijd zichtbaar in header
- `HeaderDropdown` + scroll progress bar
- `RevealOnScroll` op homepage-secties; FloatingCTA verschijnt na scroll (desktop)

### P4 — Portalen / security (gedaan)

- `ALLOW_DEMO_API_ACCESS` (default uit): demo cookie ontgrendelt géén productie-API’s
- `ALLOW_DEMO_ACCESS` (default aan; zet `false` om demo UI te blokkeren)
- Middleware: Supabase-toegang op **profile.role**, niet “elke user = intern”
- Portal layouts: `requirePortalAccess` voor medewerkers/opdrachtgevers
- Login: geen default naar intern; auth callback rol-aware
- Demo-banners per portaal; urengoedkeuring blijft intern-only
- Opdrachtgever: geen intern API-status checks meer vanuit client portal

## Technische risico’s

### Demo-internal cookie (na P4)

UI-demo mag nog (tenzij `ALLOW_DEMO_ACCESS=false`).  
API-demo alleen met `ALLOW_DEMO_API_ACCESS=true`.  
Productie: echte Supabase-rollen + RLS blijven de lange-termijn gate.

## SEO-aandachtspunten

- Keywords natuurlijk in titles/H2’s (geen stuffing)
- Geen partnership-claims zonder bewijs
- Resterende landings (`stagehands`, `restaurant-personeel`, …) staan als `published: false` in `services.ts`

## Interactie

- PublicHeader met scroll-states + progress
- FloatingCTA (desktop na scroll; mobiel sticky bottom)
- FAQ accordion + service drawer + RevealOnScroll (CSS/client, geen Framer Motion)
