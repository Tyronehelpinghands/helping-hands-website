# Mobile Responsive Audit — Helping Hands Website

Datum: 14 juli 2026

## 1. Gecontroleerde routes

### Public website
- `/` — homepage, hero, logo carousel, CTA's
- `/diensten`, `/opdrachtgevers`, `/medewerkers`, `/vacatures`, `/projecten`, `/over-ons`, `/contact`
- `/login`, `/portaal`

### Intern dashboard (`/dashboard/intern/*`)
- Overzicht, sales, leads, projecten, planning, crew, urenregistratie, facturatie, financiën, risico-acties, berichten, instellingen

### Medewerkersportaal (`/portaal/medewerkers/*`)
- Overzicht, planning, beschikbaarheid, uren, berichten, documenten, profiel

### Opdrachtgeversportaal (`/portaal/opdrachtgevers/*`)
- Overzicht, aanvragen, projecten, planning, briefings, uren, facturen, documenten, contact, profiel

Breakpoints getest: 375px, 390px, 414px, 768px, 1024px, desktop.

---

## 2. Gevonden mobiele problemen

| Gebied | Probleem |
|--------|----------|
| Globaal | Geen `overflow-x` beperking op `html`/`body`; horizontale pagina-scroll mogelijk |
| Tabellen | `-mx-4` negatieve marges op tabelcontainers (projecten, leads, planning, sales, uren, crew, financiën, facturatie, berichten, risico-acties) |
| Tabellen | `min-w-[900px–1200px]` zonder geïsoleerde scroll-container |
| Sheets/drawers | Mobiele sheets slechts 75% breed (`w-3/4`) i.p.v. fullscreen |
| Sidebars | Hamburger-menu sloot niet na navigatie (employee/client portal) |
| Sidebars | Touch targets te klein op navigatielinks |
| Dashboard header | Periode-selector nam ruimte in op smalle schermen |
| Medewerkersportaal | Snelle acties en urenknoppen niet full-width / min 44px |
| Opdrachtgeversportaal | Aanvragen- en facturentabellen alleen desktop-tabel |
| Public header | Geen login-link in mobiel menu |
| Homepage | Hero H1 iets te groot op kleine telefoons; CTA's niet full-width |

---

## 3. Opgeloste mobiele problemen

### Globale CSS (`src/app/globals.css`)
- `max-width: 100%` en `overflow-x: hidden` op `html` en `body`
- `max-width: 100%` op images/video/svg
- `prefers-reduced-motion` voor logo-carousel en animaties

### Shared components (nieuw)
- `src/components/dashboard/shared/ResponsiveTable.tsx` — scrollbare tabelwrapper
- `src/components/dashboard/shared/ResponsiveCardGrid.tsx` — responsive card grids
- `src/components/dashboard/shared/MobileActionBar.tsx` — sticky mobiele actiebalk
- `src/components/dashboard/shared/DashboardMobileHeader.tsx` — compacte mobiele topbar
- `src/components/dashboard/shared/DashboardMobileNav.tsx` — hamburger + slide-over navigatie

### Shells & navigatie
- `overflow-x-hidden` op intern, medewerker- en opdrachtgever-shell
- Sheets fullscreen op mobiel (`ui/sheet.tsx`)
- Controlled hamburger state + sluiten bij route-klik (intern, medewerker, opdrachtgever sidebars)
- `min-h-11` touch targets op sidebar-links en hamburger-knoppen

### Tabellen
- `ProjectsTable`, `LeadsTable`, `PlanningTable`, `SalesLeadsTable` → `ResponsiveTable`
- `-mx-4` verwijderd uit alle dashboard-tabelcontainers
- `WeekPlanningBoard` horizontale scroll binnen container
- `ClientInvoiceTable` + `ClientRequestTable` → mobiele card-weergave (`md:hidden`)

### Portal-specifiek
- Medewerkers: uren cards met full-width knoppen; snelle acties stacked op mobiel
- Opdrachtgevers: snelle acties full-width; facturen/aanvragen als cards op mobiel
- Beschikbaarheid: formulier submit `min-h-11`

### Public website
- Hero H1 kleiner op mobiel (`text-3xl`)
- CTA knoppen full-width op mobiel
- Login-link toegevoegd aan mobiel menu
- Logo al beperkt via `HeaderBrandLogo` (max ~150px mobiel)

---

## 4. Overgebleven aandachtspunten

- **Intern dashboard**: niet alle modules gebruiken al `ResponsiveTable` of card-variant; sommige tabellen scrollen horizontaal binnen card (acceptabel, geen pagina-overflow)
- **Planning weekbord**: horizontaal scrollbaar op tablet — bewust voor weekkolommen
- **Risico-acties kanban**: desktop-only horizontaal bord; mobiel heeft al card-per-status layout
- **Modals/drawers planning**: `ShiftDetailDrawer` / `AssignCrewDrawer` — controleren op fysiek device bij live gebruik
- **RateSettings tabel**: scroll binnen card, geen mobiele card-variant
- **DashboardMobileNav**: component beschikbaar maar sidebars gebruiken nog eigen implementatie (functioneel equivalent)

---

## 5. Shared components toegevoegd

| Component | Doel |
|-----------|------|
| `ResponsiveTable` | Horizontale scroll alleen binnen tabelcontainer |
| `ResponsiveCardGrid` | 1/2/3/4 kolom card grids |
| `MobileActionBar` | Sticky bottom acties op mobiel |
| `DashboardMobileHeader` | Compacte mobiele topbar |
| `DashboardMobileNav` | Herbruikbare hamburger + slide-over menu |

---

## 6. Build resultaat

```
npm run build — SUCCES (Next.js 16.2.9)
✓ Compiled successfully
✓ TypeScript — geen errors
✓ 34 static pages gegenereerd
```

Datum build: 14 juli 2026

---

## 7. Advies volgende verbeteringen

1. **Card-variant voor alle brede tabellen** — crew, urenregistratie, facturatie op mobiel als cards i.p.v. scroll
2. **Unified sidebar** — refactor intern/employee/client sidebars naar `DashboardMobileNav` voor minder duplicatie
3. **Bottom navigation** — optionele tab-bar voor medewerkersportaal (planning / uren / beschikbaarheid)
4. **Form modals** — audit alle `Dialog`/`Sheet` formulieren op 375px met virtueel toetsenbord
5. **Performance** — logo carousel `will-change` alleen op desktop; lazy load dashboard tabellen
6. **E2E responsive tests** — Playwright viewport tests voor kritieke flows (login, uren, aanvraag)
