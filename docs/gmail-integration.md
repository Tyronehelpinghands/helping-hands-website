# Gmail-integratie — Helping Hands Agency

Pragmatische setup: **mailto + gedeelde mailboxen werken direct**. Gmail API send pas wanneer Google OAuth env in Vercel staat.

## Mailboxen (siteConfig)

| Adres | Doel |
|-------|------|
| `planning@helpinghandsagency.nl` | Crewaanvragen opdrachtgevers |
| `mesbah@helpinghandsagency.nl` | Planning & inzet |
| `aanmeldingen@helpinghandsagency.nl` | Crewaanmeldingen |
| `info@helpinghandsagency.nl` | Algemeen |
| `tyrone@helpinghandsagency.nl` | Direct / operationeel |

Bron: `src/lib/siteConfig.ts` → `getSharedMailboxes()` in `src/lib/integrations/gmail.ts`.

## Aanbevolen pad

1. **Nu:** mailto vanuit dashboard / contactformulieren  
2. **Outbound API:** Gmail API met OAuth2 refresh token (Workspace-mailbox)  
3. **Later optioneel:** Resend / SMTP alleen voor transactionele mail (niet geïmplementeerd)

## Env-vars (server-only — nooit `NEXT_PUBLIC_`)

| Variable | Verplicht | Doel |
|----------|-----------|------|
| `GOOGLE_CLIENT_ID` | Ja | OAuth client (Google Cloud) |
| `GOOGLE_CLIENT_SECRET` | Ja | OAuth secret |
| `GOOGLE_REFRESH_TOKEN` | Ja | Long-lived refresh voor send-mailbox |
| `GMAIL_SENDER` | Aanbevolen | Afzender, bv. `planning@helpinghandsagency.nl` (fallback: planning@ uit siteConfig) |

## Google Cloud setup (kort)

1. Project in [Google Cloud Console](https://console.cloud.google.com/)  
2. OAuth consent screen (Internal voor Workspace bij voorkeur)  
3. OAuth client (Web application)  
4. Scopes minimaal: `https://www.googleapis.com/auth/gmail.send`  
   (later `gmail.readonly` voor inbox)  
5. Eenmalig auth-code flow → refresh token opslaan als `GOOGLE_REFRESH_TOKEN`  
6. Zorg dat de Google-user toegang heeft tot `GMAIL_SENDER` (of send-as alias)

## Code

| Pad | Rol |
|-----|-----|
| `src/lib/integrations/gmail.ts` | Config-check, mailto helper, `sendGmailMessage` (fetch, geen `googleapis` dep) |
| `POST /api/integrations/gmail/send` | Verzenden — interne rollen |
| `GET /api/integrations/gmail/status` | Status + mailboxlijst, geen secrets |
| `/dashboard/intern/integraties` | UI-status, mailboxen, mailto-acties |

## Security

- Client secret + refresh token alleen in Vercel / `.env.local`  
- Send-route via `requireInternApiAccess`  
- Responses bevatten geen tokens  
- UI toont nooit “Actief/connected” als env ontbreekt  

## Status-logica in UI

| Situatie | Badge |
|----------|--------|
| Env ontbreekt | Niet gekoppeld — mailto werkt |
| Env aanwezig | Voorbereid (OAuth klaar; send-test via API) |
| Send-fout (401/403) | Fout — scopes / token controleren |
