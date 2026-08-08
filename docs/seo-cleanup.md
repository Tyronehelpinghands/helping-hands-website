# SEO cleanup — Helping Hands Agency

Datum: 2026-08-08  
Domein: `https://www.helpinghandsagency.nl`

## Legacy WordPress query-URL’s (`src/proxy.ts`)

Alle onderstaande query’s krijgen een **301** (nooit 5xx, nooit soft-noindex feedpagina’s):

| Oude URL | Bestemming |
|----------|------------|
| `/?page_id=19` | `/contact` |
| `/?page_id=16` | `/opdrachtgevers` |
| `/?page_id=17` | `/vacatures` |
| `/?page_id=23` | `/over-ons` |
| `/?page_id=*` (onbekend, o.a. 137, 122) | `/` |
| `/?p=*`, `/?p=24`, `/?p=331`, `/en/?p=366` | `/` |
| `/?feed=rss2`, `/?feed=rss2&cat=1`, `/?feed=comments-rss2`, `/?feed=rss2&p=*` | `/` |
| `/?m=2026`, `/?m=202606`, `/?m=20260613`, `/?m=20260622` | `/` |
| `/?cat=*`, `/?paged=*`, `/?attachment_id=*`, `/?author=*` | `/` |
| `/index.php` (+ eventuele WP-query) | `/` |
| `/en`, `/en/*` | `/` (geen Engelse site) |

Catch-all: aanwezigheid van `page_id` / `p` / `feed` / `cat` / `m` / `paged` / `attachment_id` / `author` → 301 naar schone path (homepage voor `/` en `/en`).

## Path redirects (`next.config.ts`)

| Oude path | Bestemming |
|-----------|------------|
| `/medewerkers`, `/crew-aanmelden`, `/sign-up` | `/werken-bij` |
| `/about-us` | `/over-ons` |
| `/privacy-policy` | `/contact` (geen `/privacy`-pagina) |
| `/rigger` | `/personeel-inhuren/stagehands` |
| `/catering-assistant` | `/personeel-inhuren/catering-personeel` |
| `/hospitality-assistant` | `/personeel-inhuren/hospitality-personeel` |
| `/site-crew` | `/personeel-inhuren/site-crew` |
| `/en`, `/en/:path*` | `/` |
| `/wp-content/:path*`, `/wp-includes/:path*`, `/wp-json/:path*` | `/` |
| `/index.php` | `/` |
| Overlappende `/diensten/*` | `/personeel-inhuren/*` |
| Overlappende `/locaties/*` (o.a. horeca-personeel-hilversum) | canonieke root-SEO-URL |

`trailingSlash: false` → `/contact/` wordt doorgestuurd naar `/contact`.

## Pagina’s die wél 200 OK zijn (geen bug)

- `/over-ons`, `/opdrachtgevers`, `/diensten`, `/locaties/productiecrew-eindhoven` op **www** → echte pagina’s.
- GSC “Pagina met omleiding” voor `https://helpinghandsagency.nl/over-ons` e.d. = alleen **apex → www**, geen inhoudsredirect.
- `/contact?type=crew-aanmelden` → 200; canonical blijft `/contact` (query is UX voor formulier-tab).

## Apex / http → www (Vercel)

Code kan host-redirects niet betrouwbaar forceren op Vercel. Stel in:

1. Vercel → Project → **Settings → Domains**
2. `www.helpinghandsagency.nl` = Primary
3. `helpinghandsagency.nl` → **Redirect to www** (één hop)
4. HTTP→HTTPS laat Vercel standaard afhandelen; doel: **één** 301/308 naar `https://www.…` zonder keten `http apex → https apex → https www`

## Canonicals

Marketingpagina’s gebruiken `buildPageMetadata()` met schone canonicals op `siteConfig.url` (`https://www.helpinghandsagency.nl`). Querystrings horen niet in de canonical.

## NAP (enige bron)

- Helping Hands Agency  
- Wandelpad 30, 1211 GN Hilversum  
- 06 5741 6338  
- planning@ / aanmeldingen@ / info@helpinghandsagency.nl  

## Sitemap & robots

- `src/app/sitemap.ts` — publieke SEO-routes; geen dashboard/portaal/login/api; geen redirect-bronnen dubbel  
- `src/app/robots.ts` — disallow `/dashboard`, `/portaal`, `/api`, `/login` (+ auth-hulproutes) → verwacht noindex/uitgesloten

## GSC: wat is normaal vs actie

| GSC-categorie | Normaal? | Actie |
|---------------|----------|-------|
| Pagina met omleiding (apex/http, oude WP, `/locaties/…`→root) | Ja | Negeren; Google indexeert bestemming |
| Uitgesloten door noindex (`/login`, dashboard) | Ja | Negeren |
| Alternatieve pagina met correcte canonieke tag (`/contact?type=…`) | Ja | Negeren |
| Gecrawld – momenteel niet geïndexeerd | Vaak wachten | Kern-URL’s desnoods “Indexering aanvragen” |
| Niet gevonden (404) op oude WP-slugs | Nee → gefixt met 301’s | Na deploy: **Validatie starten** |
| Serverfout (5xx) op `?p=` / feeds | Nee → gefixt (301 i.p.v. crash/soft page) | Na deploy: **Validatie starten** |

### Na deploy in GSC

1. Sitemap opnieuw indienen  
2. Op 404- en 5xx-rapporten: **Validatie starten**  
3. P0-URL’s inspecteren + indexering aanvragen: `/`, `/personeel-inhuren`, `/over-ons`, `/contact`, `/werken-bij`

## Sitelinks

Google kiest sitelinks automatisch. Helpen: sterke interne links, unieke title/H1, indexering kern-URL’s, geduld (dagen–weken).

## GBP

Handmatig controleren: postcode `1211 GN`, telefoon `06 5741 6338`, website `https://www.helpinghandsagency.nl`.
