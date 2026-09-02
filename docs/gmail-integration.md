# Gmail-integratie — Helping Hands Agency

Pragmatische setup: **mailto + gedeelde mailboxen werken direct**. Gmail API send pas wanneer Google OAuth env in Vercel staat.

## Mailboxen (siteConfig)

| Adres | Doel |
|-------|------|
| `planning@helpinghandsagency.nl` | Crewaanvragen opdrachtgevers |
| `aanmeldingen@helpinghandsagency.nl` | Crewaanmeldingen |
| `marieke@helpinghandsagency.nl` | H&R |
| `info@helpinghandsagency.nl` | Algemeen |
| `tyrone@helpinghandsagency.nl` | Eigenaar / operationeel |
| `sieb@helpinghandsagency.nl` | Mede-eigenaar |

Bron: `src/lib/siteConfig.ts` → `getSharedMailboxes()` in `src/lib/integrations/gmail.ts`.

## Aanbevolen pad

1. **Nu:** mailto vanuit dashboard / contactformulieren  
2. **Outbound API:** Gmail API met OAuth2 refresh token (Workspace-mailbox)  
3. **Later optioneel:** Resend / SMTP alleen voor transactionele mail (niet geïmplementeerd)

## Env-vars (server-only — nooit `NEXT_PUBLIC_`)

| Variable | Verplicht | Doel |
|----------|-----------|------|
| `GOOGLE_CLIENT_ID` | Ja (voor API) | OAuth client (Google Cloud) |
| `GOOGLE_CLIENT_SECRET` | Ja (voor API) | OAuth secret |
| `GOOGLE_REFRESH_TOKEN` | Ja (voor API) | Long-lived refresh voor send-mailbox |
| `GMAIL_SENDER` | Aanbevolen | Afzender, bv. `planning@helpinghandsagency.nl` (fallback: planning@ uit siteConfig) |
| `GMAIL_REDIRECT_URI` | Optioneel | Override; default = `NEXT_PUBLIC_SITE_URL` + `/api/gmail/callback` |

### Redirect URI’s (Google Cloud Console → OAuth client)

| Omgeving | URI |
|----------|-----|
| Productie | `https://www.helpinghandsagency.nl/api/gmail/callback` |
| Lokaal | `http://localhost:3000/api/gmail/callback` |

Zet beide in de OAuth-client (Authorized redirect URIs). Voor lokaal: `NEXT_PUBLIC_SITE_URL=http://localhost:3000` of `GMAIL_REDIRECT_URI=http://localhost:3000/api/gmail/callback`.

## Google Cloud setup (kort)

1. Project in [Google Cloud Console](https://console.cloud.google.com/)  
2. OAuth consent screen (Internal voor Workspace bij voorkeur)  
3. OAuth client (Web application) + redirect URI’s hierboven  
4. Scopes minimaal: `https://www.googleapis.com/auth/gmail.send`  
   (later optioneel `gmail.readonly` voor inbox)  
5. Zet `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (+ optioneel `GMAIL_SENDER`) in Vercel  
6. Koppel via Integraties (zie hieronder) → plak refresh token als `GOOGLE_REFRESH_TOKEN` → redeploy  
7. Zorg dat de Google-user toegang heeft tot `GMAIL_SENDER` (of send-as alias)

## Gmail koppelen vanaf Integraties

1. Log in op `/dashboard/intern/integraties` (interne rol)  
2. Zorg dat client ID/secret in Vercel staan  
3. Klik **Gmail koppelen** → `/api/gmail/connect`  
4. Google consent (offline + consent → refresh token)  
5. Callback: `/api/gmail/callback`  
6. Refresh token wordt bij voorkeur opgeslagen in `company_settings` (key `gmail_oauth`)  
7. Als opslaan faalt: eenmalige banner op Integraties — kopieer naar Vercel `GOOGLE_REFRESH_TOKEN` en redeploy  

Env `GOOGLE_REFRESH_TOKEN` heeft altijd voorrang op `company_settings`.

## Code

| Pad | Rol |
|-----|-----|
| `src/lib/integrations/gmail.ts` | Config-check, mailto, OAuth helpers, `sendGmailMessage` |
| `GET /api/gmail/connect` | Start OAuth — interne rollen + CSRF cookie |
| `GET /api/gmail/callback` | Token exchange — geen tokens in URL/logs |
| `POST /api/integrations/gmail/send` | Verzenden — interne rollen |
| `GET /api/integrations/gmail/status` | Status + mailboxlijst, geen secrets |
| `/dashboard/intern/integraties` | UI-status, koppelen, mailboxen, mailto |

## Security

- Client secret + refresh token alleen in Vercel / `.env.local`  
- Geen `NEXT_PUBLIC_` secrets  
- Prefer refresh token in Vercel `GOOGLE_REFRESH_TOKEN`; fallback `company_settings.gmail_oauth`  
- Connect/callback: interne sessie; CSRF `state` cookie  
- Refresh token nooit in publieke querystring; hoogstens eenmalige httpOnly cookie → UI-flash  
- Send-route via `requireInternApiAccess`  
- Responses / logs bevatten geen tokens  

## Status-logica in UI

| Situatie | Badge |
|----------|--------|
| Env ontbreekt | Niet gekoppeld — mailto werkt; knop Gmail koppelen |
| Env aanwezig | Voorbereid (OAuth klaar; send-test via API) |
| Send-fout (401/403) | Fout — scopes / token controleren |
