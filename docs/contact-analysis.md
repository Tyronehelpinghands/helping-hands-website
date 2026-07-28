# Contactpagina-analyse — Helping Hands Agency

**Datum:** 28 juli 2026  
**Live:** https://helping-hands-website.vercel.app/contact  
**Bron:** `src/app/contact/page.tsx`, `ContactTabs.tsx`, `pageHeroContent.ts` (`/contact`), `faq.ts` (`contactFaqs`), live snapshot  
**Scope:** Alleen documentatie — geen redesign in code

---

## Executive summary

`/contact` is al een **bruikbare dual-funnel pagina** (opdrachtgever ↔ crew) met spoedcheckbox, contactcards, bedrijfsgegevens, FAQ + schema.  

**Niet** meer de oude “formulier niet gekoppeld + alleen info@”-basis:  
- routing naar `planning@` / `mesbah@` / `aanmeldingen@` / `info@` bestaat  
- knoptekst is eerlijk: **“Aanvraag voorbereiden”**  
- FAQ legt uit dat er **geen automatische verzending** is  

**Kritieke gap:** submit toont een successtate maar **opent geen mailto met formuliervelden** en kopieert niets — bezoeker moet zelf mailen. Dat voelt als half-conversie en ondermijnt vertrouwen.

**Totaalscore contactpagina: ~7.4 / 10**  
**SEO-score contact: ~8.0 / 10**

---

## 1. Eerste indruk & scores

### Wat ziet de bezoeker (live)

1. Hero H1: *“Laten we je aanvraag helder maken.”*  
2. CTA’s: **Mail ons** (mailto planning@) + **Crew aanmelden** → `/vacatures`  
3. Topic-tabs: Personeelsaanvraag / Samenwerking / Planning / Administratie  
4. Formulier-tabs: **Personeel aanvragen** | **Aanmelden als medewerker**  
5. Spoedaanvraag-checkbox (client)  
6. Contactfoto-cards + bedrijfsgegevens + fotostrip + FAQ  

| Vraag | Oordeel |
|-------|---------|
| Professioneel genoeg? | **Ja** — branded, dual CTA, echte foto’s |
| Duidelijk voor wie? | **Grotendeels** — form-tabs helpen; hero-topics zijn andere as |
| Verschil aanvraag vs aanmelden? | **Ja** in formulier; hero stuurt crew naar vacatures |
| Betrouwbaar? | **Matig-sterk** — eerlijke copy; submit zonder mailto-body zwakt af |
| Formulier lengte? | Client: **matig lang** (1 scherm); worker: **kort/goed** |
| Spoed? | **Aanwezig** (checkbox) |
| Trust rond form? | **Zwak** — geen checklist/proces/AVG onder knop |

### Scores (1–10)

| Dimensie | Score | Toelichting |
|----------|------:|-------------|
| Professionaliteit | **8** | Layout, brand, contactcards |
| Conversiekracht | **6.5** | Goede intent; submit-flow incompleet |
| Duidelijkheid | **7.5** | Dual tabs ok; hero-topics vs form-tabs verwarrend |
| Vertrouwen | **7** | Eerlijke FAQ; geen proces/AVG/checklist |
| Formulierkwaliteit | **6.5** | Velden ok; geen stappen, geen mailto-body, beperkte validatie |
| Mobiele ervaring | **7.5** | Tabs/form werken; lange form op smalle schermen |
| SEO-potentie | **8** | Title/desc/FAQ/Breadcrumb; H1 iets soft |
| Toegankelijkheid | **7.5** | Labels wrapping; geen aria-live op success; min-h knoppen ok |
| Visuele creativiteit | **7** | Foto-cards + hero; weinig timeline/bento |
| Gebruiksvriendelijkheid | **7** | Duidelijke tabs; frictie na “voorbereiden” |

**Gemiddelde ≈ 7.4**

---

## 2. Sterke punten

1. Duidelijke dual tabs: personeel vs crew  
2. Spoedaanvraag-checkbox met uitleg  
3. Eerlijke knop: “Aanvraag/Aanmelding **voorbereiden**” (geen fake send)  
4. Contactrouting: planning@, mesbah@, aanmeldingen@, info@, tel, WhatsApp  
5. FAQ + `faqJsonLd` + `BreadcrumbJsonLd`  
6. Foto-cards voor aanvraag vs crew  
7. Bedrijfsgegevens (adres, KvK, BTW, IBAN) voor trust/legal  
8. Link naar `/vacatures` en `/diensten`  
9. Hero topic-tabs (2×2) zonder overlap (na eerdere fix)  
10. Geen API-keys in frontend; UI-only fallback bewust  

---

## 3. Zwakke punten

1. **Submit opent geen mailto met ingevulde velden** — grootste conversiegat  
2. Hero-topics (4 onderwerpen) ≠ form-audience (2 rollen) — cognitieve dubbele as  
3. Geen “wat gebeurt er na je aanvraag?”-timeline  
4. Geen privacy/AVG-regel onder formulier  
5. Geen inline field-errors / loading state (alleen required HTML)  
6. Clientformulier is één lange lijst (geen stappen)  
7. Ontbrekende velden: type inzet, certificaten, reiskosten, pauzes (optioneel)  
8. Workerformulier mist interesse-functies / vervoer / multi-select ervaring  
9. Geen sticky contact-CTA specifiek voor deze pagina (site-wide floating wel)  
10. `administratie@` bestaat elders in stack maar niet als publieke contactcard  
11. H1 is soft (“aanvraag helder maken”) i.p.v. keyword-sterk “Personeel aanvragen…”  
12. Title is generiek: `Contact | Helping Hands Agency`  

---

## 4. Hero-analyse

| Element | Huidig |
|---------|--------|
| Eyebrow | Contact |
| H1 | Laten we je aanvraag helder maken. |
| Sub | Stuur personeelsvraag / projectinfo / samenwerking… |
| Primary CTA | Mail ons → mailto planning@ |
| Secondary | Crew aanmelden → /vacatures |
| Visual | Topic-tabs 2×2 + detailtekst |

### Advies

- H1 scherper: **“Personeel nodig of aanmelden als crew?”**  
- Subtekst met beide paden  
- CTA’s: Personeel aanvragen (anchor `#aanvraag`) · Aanmelden · Direct mailen  
- Overweeg hero-topics te **vervangen of te koppelen** aan form-audience (nu parallelle concepten)  
- Split-card Opdrachtgever / Medewerker naast of i.p.v. 4 topic-tabs  

---

## 5. Doelgroep / keuze-flow

| Pad | Status |
|-----|--------|
| A Opdrachtgever | Form tab + planning@ card |
| B Crew | Form tab + aanmeldingen@ + vacatures |
| C Algemeen / samenwerking | Hero-topic + info@ in bedrijfsblok; **geen apart form** |

**Advies:** behoud 2 form-tabs (of 3: + algemene vraag). Hero-topics ofwel:  
- verwijderen / verplaatsen naar “waarover mailen”, of  
- laten doorlinken naar juiste tab + mailto-prefill  

Beste UI: **segmented control** (al grotendeels) + optionele 3e tab “Algemene vraag” (korte textarea → info@).

---

## 6. Formulier opdrachtgevers

### Aanwezig

Bedrijfsnaam*, contactpersoon*, e-mail*, telefoon*, datum*, locatie*, start*, eind*, functies*, aantal*, kleding/PBM, contact op locatie, briefing, spoed.

### Ontbreekt / optioneel later

Type inzet (select), pauzes, certificaten/PBM detail, reiskostenafspraak, deadline spoed.

### Verplicht vs optioneel (advies)

| Verplicht | Optioneel / stap 2 |
|-----------|--------------------|
| Contact + e-mail + tel | Kleding/PBM |
| Datum, locatie, start/eind | Contact op locatie |
| Functies + aantal | Briefing (sterk aangeraden) |
| Spoed ja/nee | Certificaten, reiskosten |

### Structuur-advies (multi-step)

1. Contactgegevens  
2. Project (datum/locatie/tijden)  
3. Inzet (functies/aantal/type)  
4. Briefing & bijzonderheden (+ spoed)  
5. Controleren → **mailto of API**

### Backend nu

UI-only is oké **als** submit:
- mailto opent met subject/body uit velden, **of**
- “Kopieer aanvraagtekst” (zoals homepage QuickRequest)

Huidige success-state zonder data-doorvoer = **niet voldoende**.

---

## 7. Formulier medewerkers

Aanwezig: naam*, e-mail*, tel*, woonplaats*, leeftijd, ervaring*, beschikbaarheid, ZZP/loondienst, rijbewijs.

### Advies

- Behoud tab op `/contact` (korte funnel)  
- Verrijk met: interesse-functies (chips), vervoer, horeca/stage ervaring checkboxes  
- CV-upload = later (API)  
- Sterke CTA naar `/vacatures` + `/medewerkers` behouden  

Als pagina te druk: worker-tab = korte lead + deep link (nu al deels zo).

---

## 8. Direct contact

| Kanaal | Op contactpagina? |
|--------|-------------------|
| planning@ | ✅ |
| mesbah@ | ✅ |
| aanmeldingen@ | ✅ |
| info@ | ✅ (bedrijfsblok) |
| tel + vast + WhatsApp | ✅ |
| administratie@ | ❌ publiek (wel in interne settings/portal) |
| tyrone@ | ✅ bedrijfsblok |

**Advies:** bento “Contactopties” met 4 cards: Aanvraag / Aanmelden / Algemeen / (optioneel) Administratie — alleen adressen die in `siteConfig`/`navigation` bestaan. Geen verzonnen mailboxen.

---

## 9. Conversie

| Check | Status |
|-------|--------|
| CTA boven fold | ✅ hero |
| Form zichtbaar | ✅ onder hero |
| Spoed | ✅ |
| Succesverwachting | ⚠️ vaag na submit |
| Procesuitleg | ❌ |
| Trust checklist | ❌ |
| Sticky (site) | ✅ FloatingCTA elders |
| Fake send | ✅ vermeden in copy; ⚠️ success UI kan misleiden |

### Prioritaire conversiefixes

1. Mailto/body of kopieer-tekst bij submit  
2. Proces-timeline (5 stappen)  
3. Checklist naast form (“wat we nodig hebben”)  
4. AVG-regel  
5. Hero H1 + CTA’s aanscherpen  
6. aria-live success  

---

## 10. Visuele layout

- Formulier in witte card: goed  
- Foto-cards: goed  
- Mist: timeline, checklist-paneel, eind-CTA band, eventueel bento contactopties  
- Bedrijfsgegevens-blok is functioneel maar kaal  
- Fotostrip “Van aanvraag tot crew” is sfeer, geen proces  

---

## 11. Aanvraagproces (ontbreekt)

Adviseer sectie **“Zo behandelen wij je aanvraag”**:

1. Jij stuurt aanvraag  
2. Wij checken datum/locatie/functies  
3. We denken mee over crew  
4. Bevestiging/afstemming  
5. Briefing → crew op locatie  

UI: horizontale timeline desktop / accordion of cards mobiel.

---

## 12. FAQ

Aanwezig (4 items) + schema — **goed**. Uitbreiden met:

- Hoe snel reageren jullie?  
- Landelijk?  
- Meerdere functies tegelijk?  
- Horeca/keuken ook?  
- Privacy: wat gebeurt met mijn gegevens?  

Houd antwoorden synchroon met mailto-realiteit.

---

## 13. SEO

| Item | Live / code |
|------|-------------|
| Title | `Contact \| Helping Hands Agency` |
| Description | Personeel aanvragen of crew aanmelden… spoed… |
| H1 | Laten we je aanvraag helder maken. |
| H2’s | Aanvraag/aanmelden, Personeelsaanvragen, Crew, Bedrijfsgegevens, Van aanvraag…, FAQ |
| Breadcrumb | ✅ |
| FAQ schema | ✅ |
| Org/EmploymentAgency | via layout |
| ContactPoint | ❌ apart op /contact |

### Advies metadata

- Title: `Contact \| Personeel aanvragen bij Helping Hands Agency`  
- H1: `Personeel aanvragen of crew aanmelden`  
- ContactPoint schema (customer service / planning / applications)  
- Interne links naar `/opdrachtgevers`, `/medewerkers`, `/projecten` versterken  

**SEO-score: ~8.0** — foundation sterk; title/H1 en ContactPoint tillen naar 8.5+.

---

## 14. Interne links

| Doel | Nu |
|------|-----|
| /diensten | ✅ card |
| /vacatures | ✅ hero + form + tekst |
| /medewerkers | ⚠️ vooral footer/nav |
| /opdrachtgevers | ⚠️ nav |
| /projecten | ⚠️ nav |
| /over-ons | ⚠️ nav |

Advies: 1 linkrij onder form of in checklist.

---

## 15. Form states & validatie

| State | Nu |
|-------|-----|
| Required * | ✅ |
| Focus ring | ✅ |
| Custom errors | ❌ |
| Loading | ❌ |
| Success | ✅ UI (zonder data-mail) |
| Disabled submit | ❌ |
| Privacy | ❌ |
| Mailto met body | ❌ |

---

## 16. Veiligheid / AVG

- Geen fake API-post ✅  
- Geen secrets in form ✅  
- Persoonsgegevens verzameld in browser → moeten **niet** naar console/localStorage  
- Privacytekst ontbreekt ❌  
- Later: honeypot, rate limit, server validation bij API  
- Geen `administratie@` hardcoden zonder siteConfig  

---

## 17. Mobile

- 2 form-tabs ok op sm  
- Lange client-form = scroll-moeilijkheid → multi-step helpt  
- Date/time inputs native: wisselend per OS  
- Touch targets knoppen ≥44px grotendeels  
- Sticky site-CTA + lange form: let op overlap submit (`pb-20` layout)  

---

## 18. Accessibility

- Labels wrappen inputs ✅  
- Tabs = buttons ✅  
- Success zonder `aria-live` ❌  
- Spoed checkbox label ok ✅  
- Eén H1 ✅  
- Error association ontbreekt bij custom validation  

---

## 19. Performance

- `ContactTabs` is client — nodig  
- Geen zware libs  
- Crewfoto’s via bestaande image components  
- Geen layout-teardown nodig  

---

## 20. Prioriteiten

### P1 — Direct
- Submit → mailto met velden **of** kopieer-aanvraagtekst  
- Privacyregel onder form  
- Success copy die niet “verstuurd” suggereert zonder mail  
- Hero H1/CTA’s aanscherpen  

### P2 — Conversie
- Proces-timeline  
- Checklist paneel  
- Multi-step client form  
- FAQ uitbreiden  

### P3 — Design
- Contact bento cards  
- Eind-CTA band  
- Form/trust 2-koloms desktop  

### P4 — SEO
- Title/H1  
- ContactPoint schema  
- Interne links opdrachtgevers/medewerkers/projecten  

### P5 — Toekomst
- `POST /api/contact` (later)  
- HubSpot/WhatsApp/spam — geen secrets frontend  

---

## Top 10 verbeterpunten

1. Mailto/body of “Kopieer aanvraag” bij submit  
2. Privacy/AVG-tekst  
3. Proces-timeline na aanvraag  
4. Checklist “wat we nodig hebben”  
5. Multi-step personeelsformulier  
6. Hero H1 + CTA’s keyword-scherper  
7. Hero-topics vs form-tabs ontwarren  
8. ContactPoint schema  
9. Worker-form chips (functies/ervaring)  
10. Optioneel administratie-card alleen als in siteConfig  

---

## Componentkaart (huidig)

| UI | Pad |
|----|-----|
| Page | `src/app/contact/page.tsx` |
| Form tabs | `src/components/ContactTabs.tsx` |
| Hero | `sections/PageHero` + `pageHeroContent["/contact"]` |
| FAQ | `FaqSection` + `contactFaqs` |
| SEO | `buildPageMetadata`, `faqJsonLd`, `BreadcrumbJsonLd` |
| Mail constants | `navigation.ts` / `siteConfig.ts` |

*Implementatieprompt: `docs/contact-improvement-cursor-prompt.md`.*
