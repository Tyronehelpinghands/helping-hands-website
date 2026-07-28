# Cursor-prompt: Contactpagina-verbeteringen Helping Hands Agency

Gebruik dit document als **één complete implementatie-opdracht** in Cursor.  
Analysebron: [`docs/contact-analysis.md`](./contact-analysis.md) (28 juli 2026).

---

## Rol

Je bent senior UX/UI, conversie-, SEO-specialist, Next.js developer en formulier-architect.  
Verbeter `/contact` volgens de acceptatiecriteria hieronder.

---

## Harde regels

1. **Geen full-site redesign** — focus `/contact` + gedeelde contact/hero/FAQ/seo helpers.  
2. **Geen Framer Motion** tenzij strikt nodig; CSS + bestaande Reveal/Stagger ok.  
3. **Geen nieuwe zware libraries**.  
4. **Geen API keys / secrets** in frontend of docs.  
5. **Geen fake “verzonden”-melding** als er geen echte mail/API is.  
6. **Geen partnership-claims**; veilige claimtaal.  
7. Alleen lokale images onder `public/`.  
8. Brand: navy `#0B1F4D` / `#173A8A`, oranje `#F28C28`.  
9. **Geen onnodige component-deletes**; hergebruik `ContactTabs`, `PageHero`, `FaqSection`.  
10. `npm run build` moet slagen.  
11. Lees Next docs in `node_modules/next/dist/docs/` bij API-twijfel.

---

## Huidige staat (niet opnieuw uitvinden)

Al aanwezig:

- `src/app/contact/page.tsx` — hero, ContactTabs, foto-cards, bedrijfsgegevens, strip, FAQ  
- `ContactTabs` — dual form (client/worker), spoedcheckbox, “voorbereiden”-copy  
- Mailrouting: planning@, mesbah@, aanmeldingen@, info@ (+ tel/WhatsApp)  
- FAQ + `faqJsonLd` + Breadcrumb  
- Hero topic-tabs (Personeelsaanvraag / Samenwerking / Planning / Administratie)

**Kritieke gap:** submit toont success maar **opent geen mailto met formuliervelden**.

---

## Scope — bestanden

### Primair (verwacht)

- `src/app/contact/page.tsx`  
- `src/components/ContactTabs.tsx` (hergebruik/splits indien nodig)  
- Optioneel nieuwe onder `src/components/contact/`:
  - `ContactProcess.tsx` (timeline)
  - `ContactChecklist.tsx` of trust paneel
  - `ContactCards.tsx` (refactor foto-cards)
  - Alleen splitsen als `ContactTabs.tsx` te groot wordt (`StaffRequestForm` / `CrewApplicationForm`)
- `src/lib/pageHeroContent.ts` (`/contact`)  
- `src/lib/faq.ts` (`contactFaqs`)  
- Optioneel `src/lib/contact.ts` (field defs + mailto builders)  
- `src/lib/seo.ts` (ContactPoint helper indien nodig)  
- `src/lib/siteConfig.ts` / `navigation.ts` — alleen bestaande e-mails gebruiken  

### Niet

- Dashboard/portalen  
- HubSpot/WhatsApp Business API (TODO ok)  
- Verzonnen mailboxen zonder siteConfig  
- Layout-teardown homepage  

---

## Implementeer A–N

### A. Hero aanscherpen

- H1 richting: **“Personeel nodig of aanmelden als crew?”** (of gelijkwaardig keyword-sterk)  
- Subtekst: beide paden + snelle opvolging  
- CTA’s: Personeel aanvragen (scroll/anchor naar form) · Crew aanmelden · Direct mailen  
- Topic-tabs: ofwel koppelen aan form/mailto, of vereenvoudigen zodat ze niet concurreren met form-tabs  
- Geen floating badges over media  

**Acceptatie:** binnen 3s duidelijk wat te doen; dual funnel zichtbaar.

### B. Keuze-flow

- Behoud segmented tabs: Personeel aanvragen | Aanmelden als medewerker  
- Optioneel 3e tab “Algemene vraag” → korte form → mailto `info@`  
- Eén primaire keuze-UI (geen dubbele parallelle systemen zonder koppeling)

### C. Personeelsformulier

- Velden behouden + optioneel: type inzet (select), spoed deadline  
- Multi-step **of** duidelijke sectie-koppen (Contact → Project → Inzet → Briefing)  
- Verplicht: contact, datum, locatie, tijden, functies, aantal  
- **Submit moet:**
  1. `mailto:planning@…` openen met subject/body uit velden, **en/of**
  2. “Kopieer aanvraagtekst” fallback (zoals homepage QuickRequest)  
- Knoptekst blijft eerlijk (“voorbereiden” / “Open in e-mail”)  

### D. Crew-formulier

- Behoud tab; verrijk licht (interesse-chips / rijbewijs select)  
- Mailto `aanmeldingen@` met body **of** kopieer  
- Link `/vacatures` + `/medewerkers`  

### E. Direct contact cards

- Duidelijke cards: Aanvraag (planning@ + tel/WhatsApp) · Aanmelden (aanmeldingen@) · Algemeen (info@)  
- `administratie@` alleen als in siteConfig/navigation bestaat — anders weglaten of “later”  
- Geen IBAN in hero; bedrijfsgegevens mogen blijven  

### F. Proces-timeline

Sectie “Zo behandelen wij je aanvraag” — 5 stappen (aanvraag → check → crew → bevestiging → briefing/uitvoering).  
Desktop timeline / mobiel cards of accordion.

### G. FAQ

- Behoud bestaande + max 2–4 extra (snelheid, landelijk, privacy, meerdere functies)  
- Synchroon met mailto-realiteit  
- `faqJsonLd` intact  

### H. CTA’s / conversie

- Anchor naar form  
- Trust checklist naast form (desktop)  
- Eind-CTA band optioneel  
- Site FloatingCTA mag blijven; geen dubbele sticky die submit bedekt  

### I. SEO metadata

- Title richting: `Contact | Personeel aanvragen bij Helping Hands Agency`  
- Description met inhuren/aanmelden keywords  
- H1 keyword-sterk  
- Interne links `/diensten`, `/opdrachtgevers`, `/medewerkers`, `/vacatures`, `/projecten`  

### J. Structured data

- Behoud Breadcrumb + FAQ  
- Voeg **ContactPoint**(s) toe (planning / applications / customer service) via bestaande Org of page JsonLd  
- Geen fake AggregateRating  

### K. Mobile

- 320–414: tabs, inputs, submit ≥44px  
- Multi-step of secties tegen endless scroll  
- Geen horizontale page-scroll  
- `pb` rekening sticky bar  

### L. Accessibility

- Labels / required  
- `aria-live` op success  
- Focus rings  
- Tabs keyboard  
- Geen success die “verstuurd” claimt zonder mail  

### M. AVG / veiligheid

- Privacyregel onder form (gegevens gebruikt voor opvolging aanvraag/aanmelding)  
- Geen console.log van PII  
- Geen localStorage van complete aanvragen  
- Geen secrets  

### N. Backend TODO

- Documenteer TODO: `POST /api/contact` later (HubSpot/email)  
- Nu: mailto + kopieer is voldoende  
- Geen half-werkende fetch die “success” faket  

---

## Acceptatiecriteria (totaal)

- [ ] Alleen contact-scope (+ strikt nodige shared libs)  
- [ ] Dual funnel duidelijk  
- [ ] Submit levert mailto-body en/of kopieerbare tekst  
- [ ] Geen fake verzonden-claim  
- [ ] Privacytekst zichtbaar  
- [ ] Proces-timeline aanwezig  
- [ ] FAQ + schema intact/uitgebreid  
- [ ] SEO title/H1 verbeterd  
- [ ] ContactPoint aanwezig  
- [ ] Geen secrets / geen Framer (tenzij toegelicht)  
- [ ] `npm run build` groen  

---

## Werkwijze

1. Lees `docs/contact-analysis.md` + dit prompt.  
2. Inspecteer huidige `ContactTabs` / contact page.  
3. Implementeer A–N zonder layout-teardown.  
4. Run `npm run build`.  
5. Korte samenvatting: wat gewijzigd, wat bewust niet, build.

---

## Out of scope

- Volledige CRM-integratie  
- File upload CV  
- WhatsApp Business API  
- Domein-DNS  
- Homepage redesign  

---

## Waarschuwingen

- **Geen API keys of tokens** in clientcode.  
- **Geen fake verzending** als backend ontbreekt.  
- **Geen externe logo/foto-hotlinks.**  
- Gebruik alleen e-mailadressen die in `siteConfig` / `navigation` bestaan.
