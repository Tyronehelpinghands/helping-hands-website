# WhatsApp-integratie — Helping Hands Agency

Pragmatische setup: **wa.me werkt direct**, Cloud API pas wanneer Meta + Vercel env klaar zijn.

## Huidig gebruik (live)

- Planningnummer uit `siteConfig`: `06 5741 6338` → `https://wa.me/31657416338`
- Publieke site (contact, QuickRequest, header) opent WhatsApp via `siteConfig.whatsappUrl`
- Intern dashboard: snelle acties + templates openen wa.me (geen fake “connected”)

## Aanbevolen pad

1. **Nu:** wa.me / WhatsApp Web voor handmatige crew- en klantcommunicatie  
2. **Daarna:** [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) (native, server-side tokens)  
   Alternatief: Twilio WhatsApp (andere env-namen; nog niet geïmplementeerd)

## Env-vars (server-only — nooit `NEXT_PUBLIC_`)

| Variable | Verplicht | Doel |
|----------|-----------|------|
| `WHATSAPP_ACCESS_TOKEN` | Ja (Cloud API) | Permanent / system user token |
| `WHATSAPP_PHONE_NUMBER_ID` | Ja (Cloud API) | Verzendend nummer in Meta |
| `WHATSAPP_VERIFY_TOKEN` | Ja (webhook) | Zelfgekozen string voor webhook-verify |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Optioneel | WABA-id voor beheer / templates later |

Zet deze in **Vercel → Environment Variables** (Production + Preview naar wens). Lokaal: `.env.local`.

## Code

| Pad | Rol |
|-----|-----|
| `src/lib/integrations/whatsapp.ts` | `buildWaMeUrl`, config-check, `sendWhatsAppMessage` |
| `GET/POST /api/integrations/whatsapp/webhook` | Meta verify + receive stub (publiek) |
| `POST /api/integrations/whatsapp/send` | Verzenden — alleen interne rollen (`requireInternApiAccess`) |
| `GET /api/integrations/whatsapp/status` | Status zonder tokens |
| `/dashboard/intern/integraties` | UI-status + snelle acties |

## Webhook op Vercel

1. Callback URL: `https://www.helpinghandsagency.nl/api/integrations/whatsapp/webhook`  
2. Verify token = waarde van `WHATSAPP_VERIFY_TOKEN`  
3. Abonneer op `messages` (en later `message_template_status_update` indien nodig)  
4. GET challenge wordt beantwoord met plain-text `hub.challenge`  
5. POST accepteert events nu als stub (geen inbox-persistatie nog)

## Message templates (UI / wa.me)

Voorbereid in code:

- Crew briefing  
- Beschikbaarheid vragen  
- Klant planning-update  
- Spoedvervanging  

Cloud API **template messages** (goedgekeurde HSM’s) zijn een vervolgstap na Meta-template-approval.

## Security

- Tokens alleen server-side  
- Send-route: Supabase-sessie + interne rol  
- Webhook verify via token-vergelijking  
- Geen tokens in logs of API-responses  

## Status-logica in UI

| Situatie | Badge |
|----------|--------|
| Env ontbreekt | Niet gekoppeld — wa.me werkt |
| Env aanwezig | Voorbereid / Actief (env klaar; echte send hangt van Meta-account af) |
| Nooit | Fake “connected” zonder env |
