# SEO-plan — Helping Hands Agency

## Domein

- Productie-URL (config): `https://helpinghandsagency.nl` via `src/lib/siteConfig.ts`
- Override: `NEXT_PUBLIC_SITE_URL` (bijv. Vercel preview/productie)

## P1 (gedaan)

| Item | Status |
|------|--------|
| sitemap.xml | `src/app/sitemap.ts` |
| robots.txt | `src/app/robots.ts` |
| metadataBase / OG / Twitter | root `layout.tsx` |
| Canonical per marketingpagina | `buildPageMetadata()` |
| noindex login/portaal/dashboard | `noIndexMetadata()` |
| Organization + WebSite JSON-LD | root layout |
| JobPosting vacatures | `VacancyJobPostingsJsonLd` |

## P2 (gedaan)

| Item | Status |
|------|--------|
| FAQ + FAQPage schema | home, contact, opdrachtgevers |
| Service landings (2) | `/diensten/event-crew`, `/diensten/horeca-personeel` |
| Service JSON-LD | per live landing |
| BreadcrumbList | diensten, landings, contact, projecten, over-ons, opdrachtgevers, medewerkers |
| `services.ts` + landingsconfig | `published` flag voor rest TODO |
| Uniekere page copy | opdrachtgevers, medewerkers, projecten, contact |

## Marketingroutes in sitemap

- `/`, `/diensten`, `/opdrachtgevers`, `/medewerkers`, `/vacatures`, `/projecten`, `/over-ons`, `/contact`
- Plus gepubliceerde landings uit `getPublishedServiceLandings()`

## Niet in sitemap / geblokkeerd

- `/login`, `/forgot-password`, `/update-password`
- `/dashboard/*`, `/portaal/*`, `/api/*`
- Unpublished landings (`published: false`) — geen routes tot ze live gaan

## Keywordfocus (natuurlijk, geen stuffing)

crew evenementen · event crew inhuren · stagehands inhuren · horeca personeel inhuren · restaurant personeel inhuren · productie crew · event personeel Nederland · barpersoneel / koks / keukenhulp inhuren · hospitality crew · logistiek personeel evenementen · personeel festival/concert/beurs/stadion

## P4 (auth — niet SEO, wel relevant voor indexatie)

Login/portaal/dashboard blijven `noindex`. Demo-API staat default uit (`ALLOW_DEMO_API_ACCESS`).

## Volgende SEO-stappen (na P2)

1. Landings publiceren: stagehands, restaurant-personeel, keukenpersoneel, barpersoneel, productie-assistentie, logistiek, hospitality
2. Extra landings later: `/personeel-inhuren`, `/crew-aanmelden`, `/event-personeel-nederland`, `/horeca-personeel-inhuren`, `/stagehands-inhuren`
3. Search Console + indexatie check op productie-domein

## Claims

Gebruik: projectervaring, crewervaring opgedaan, via opdrachten/partners/producties.  
Vermijd: officiële partner / vaste klanten zonder bewijs.
