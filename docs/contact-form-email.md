# Contactformulieren e-mailrouting

Resend wordt gebruikt om formulieren vanaf de website te versturen.

## Environment variables

```env
RESEND_API_KEY=
CONTACT_FROM_EMAIL=Helping Hands Agency <noreply@helpinghandsagency.nl>

STAFF_REQUEST_TO_EMAIL=planning@helpinghandsagency.nl
CREW_APPLICATION_TO_EMAIL=aanmeldingen@helpinghandsagency.nl
CREW_APPLICATION_CC_EMAIL=marieke@helpinghandsagency.nl
# of: HR_EMAIL=marieke@helpinghandsagency.nl
GENERAL_CONTACT_TO_EMAIL=info@helpinghandsagency.nl
```

- `RESEND_API_KEY` is **server-only** — nooit `NEXT_PUBLIC_RESEND_API_KEY`.
- Ontbrekende `*_TO_EMAIL` / `CONTACT_FROM_EMAIL` vallen terug op de defaults hierboven.
- Crewaanmeldingen CC’en standaard `siteConfig.hrEmail` (Marieke); override via `CREW_APPLICATION_CC_EMAIL` of `HR_EMAIL`.

## Routing

| formType | Formulier | Ontvanger | CC |
|---|---|---|---|
| `staff_request` | Personeel aanvragen | `planning@helpinghandsagency.nl` | — |
| `crew_application` | Aanmelden als medewerker | `aanmeldingen@helpinghandsagency.nl` | `marieke@helpinghandsagency.nl` (H&R) |
| `general_contact` | Algemene vraag | `info@helpinghandsagency.nl` | — |

Legacy aliases die worden gemapt:

- `client` / `client_request` → `staff_request`
- `worker` / `employee_application` / `crew_question` → `crew_application`
- `general` / `other` → `general_contact`

## API

`POST /api/contact` (`src/app/api/contact/route.ts`)

- Leest JSON body met `formType` + velden
- Kiest ontvanger via `getRecipientForFormType` (+ CC via `getCcForFormType` voor crewaanmeldingen)
- Verstuurt met Resend: `from = CONTACT_FROM_EMAIL`, `replyTo =` e-mail van de invuller
- Honeypot-veld `website`: bij invulling geen mail, wel `{ ok: true }`
- Geen fake success als Resend faalt

## Frontend

`ContactTabs` op `/contact` doet `fetch("/api/contact")` — geen mailto-submit.
Mailto-links blijven alleen zichtbaar als **fout-fallback** onder de foutmelding.

## Belangrijk

- Geen mailto-submit
- Resend alleen server-side
- Reply-to is de invuller
- Fallback mailto alleen bij foutmelding

## Interne Berichten (dashboard)

`/dashboard/intern/berichten` verstuurt outbound mail via dezelfde `RESEND_API_KEY`.

- **From:** `Naam <medewerker@helpinghandsagency.nl>` als het auth/profiel-adres op het geverifieerde domein zit.
- **Fallback:** mailbox uit `CONTACT_FROM_EMAIL` (bijv. `noreply@…`) met display name van de medewerker; **Reply-To** = e-mail van de ingelogde gebruiker.
- Handtekening: `src/lib/email/buildEmailSignature.ts` (naam, rol, telefoon, bedrijf, logo, socials).
- Profielvelden: `profiles.full_name`, `profiles.email`, `profiles.role`, optioneel `profiles.phone`.
