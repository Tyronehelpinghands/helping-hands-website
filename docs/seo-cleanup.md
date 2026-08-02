# SEO cleanup — Helping Hands Agency

Datum: 2026-08-02  
Domein: `https://www.helpinghandsagency.nl`

## Oude page_id URL’s

WordPress-achtige query-URL’s worden via `src/proxy.ts` permanent (301) doorgestuurd:

| Oude URL | Bestemming |
|----------|------------|
| `/?page_id=19` | `/contact` |
| `/?page_id=16` | `/opdrachtgevers` |
| `/?page_id=17` | `/vacatures` |
| `/?page_id=23` | `/over-ons` |

Ook `/index.php?page_id=…` valt onder dezelfde mapping wanneer die path gematcht wordt.

## Overige redirects (`next.config.ts`)

- `/medewerkers` → `/werken-bij`
- Overlappende `/diensten/*` → `/personeel-inhuren/*`
- Overlappende `/locaties/*` → root SEO-locatie-URL’s (bijv. `/event-crew-amsterdam`)

## Canonicals

Marketingpagina’s gebruiken `buildPageMetadata()` met schone canonicals op `siteConfig.url` (default `https://www.helpinghandsagency.nl`).

## NAP (enige bron)

- Helping Hands Agency  
- Wandelpad 30, 1211 GN Hilversum  
- 06 5741 6338  
- planning@ / aanmeldingen@ / info@helpinghandsagency.nl  

Placeholders (`info@eventcrew.nl`, nepnummers/adressen) horen niet in de codebase.

## Nieuwe SEO-structuur

- `/personeel-inhuren` + 14 dienstlandings  
- `/werken-bij` + `/werken-als/*` (10)  
- 12 lokale root-URL’s (o.a. `/event-crew-amsterdam`, `/festival-crew-randstad`)  
- Data: `src/lib/seo/*`  
- UI: `src/components/seo/*`

## Sitemap & robots

- `src/app/sitemap.ts` — bevat nieuwe SEO-routes; redirect-doelen niet dubbel  
- `src/app/robots.ts` — disallow `/dashboard`, `/portaal`, `/api`, `/login` (+ auth-hulproutes)

## Structured data

- Organization + LocalBusiness + WebSite (root layout)  
- BreadcrumbList, Service, FAQPage op SEO-pagina’s  
- JobPosting alleen op echte vacaturepagina’s (`VacancyJobPostingsJsonLd`)

## Google Search Console — stappen

1. Sitemap opnieuw indienen: `https://www.helpinghandsagency.nl/sitemap.xml`  
2. URL-inspectie voor `/`, `/personeel-inhuren`, `/werken-bij`, `/contact`, top locatiepagina’s  
3. Oude `page_id`-URL’s laten verdwijnen via 301 + canonical (geen handmatige removal tenzij soft-404 blijft hangen)  
4. Coverage/errors controleren (redirects, 404’s, duplicate canonicals)

## GBP

`ReviewCta` toont consistente NAP en linkt naar Google Maps-zoek-URL. Geen nep-reviews, geen review-incentives.
