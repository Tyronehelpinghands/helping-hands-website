# Contactformulieren e-mailrouting

Resend wordt gebruikt om formulieren vanaf de website te versturen.

## Environment variables

```env
RESEND_API_KEY=
CONTACT_FROM_EMAIL=Helping Hands Agency <noreply@helpinghandsagency.nl>

STAFF_REQUEST_TO_EMAIL=planning@helpinghandsagency.nl
CREW_APPLICATION_TO_EMAIL=aanmeldingen@helpinghandsagency.nl
GENERAL_CONTACT_TO_EMAIL=info@helpinghandsagency.nl
```

- `RESEND_API_KEY` is **server-only** — nooit `NEXT_PUBLIC_RESEND_API_KEY`.
- Ontbrekende `*_TO_EMAIL` / `CONTACT_FROM_EMAIL` vallen terug op de defaults hierboven.

## Routing

| formType | Formulier | Ontvanger |
|---|---|---|
| `staff_request` | Personeel aanvragen | `planning@helpinghandsagency.nl` |
| `crew_application` | Aanmelden als medewerker | `aanmeldingen@helpinghandsagency.nl` |
| `general_contact` | Algemene vraag | `info@helpinghandsagency.nl` |

Legacy aliases die worden gemapt:

- `client` / `client_request` → `staff_request`
- `worker` / `employee_application` / `crew_question` → `crew_application`
- `general` / `other` → `general_contact`

## API

`POST /api/contact` (`src/app/api/contact/route.ts`)

- Leest JSON body met `formType` + velden
- Kiest ontvanger via `getRecipientForFormType`
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
