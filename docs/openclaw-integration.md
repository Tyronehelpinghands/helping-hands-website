# OpenClaw koppelen — Helping Hands

OpenClaw is de interne Helping Hands-agent (VS Code / Gateway). Cursor is de programmeer-assistent. Samen:

1. **Cursor** praat met OpenClaw via MCP (`openclaw mcp serve`)
2. **Intern dashboard** stuurt opdrachten via `POST /hooks/agent`
3. **Website-contactformulier** zet een samenvatting door naar dezelfde agent (geen publieke chatbot)

## Wat je lokaal nodig hebt

Vanuit `helping-hands-website` eenmalig:

```bash
node scripts/setup-openclaw-local.mjs
```

Dat zet `hooks.enabled` in `~/.openclaw/openclaw.json`, maakt een aparte hooks-token (niet het Gateway-token) en vult `.env.local` met:

```env
OPENCLAW_GATEWAY_URL=http://127.0.0.1:18789
OPENCLAW_HOOKS_TOKEN=
OPENCLAW_AGENT_ID=main
OPENCLAW_CONTACT_FORWARD=true
```

Nooit `NEXT_PUBLIC_` voor deze waarden. Daarna Gateway + `next dev` herstarten.

## Cursor (samenwerken in deze chat)

1. Start de Gateway vanuit `C:\HelpingHandsAI\openclaw`:

```bash
node openclaw.mjs gateway run
```

2. In Cursor: **Settings → Tools & MCP**. Server `openclaw` aanzetten / goedkeuren.
3. Globale config staat in `%USERPROFILE%\.cursor\mcp.json` en start `openclaw mcp serve` **zonder** `--url` (anders valt auth terug op het CLI-device-token).
4. Als de Gateway `scope_mismatch` logt: MCP vraagt `operator.read` + `operator.write` + `operator.approvals`, terwijl het CLI-device alleen `operator.write` heeft. Keur de upgrade goed:

```bash
node C:\HelpingHandsAI\openclaw\openclaw.mjs devices list
node C:\HelpingHandsAI\openclaw\openclaw.mjs devices approve <requestId>
```

Daarna kan ik OpenClaw-gesprekken lezen en antwoorden sturen, terwijl jij in het dashboard of op de site werkt.

## Intern dashboard

- Pagina: `/dashboard/intern/openclaw` (alleen interne rollen)
- Status + test: `/dashboard/intern/integraties`
- API: `GET /api/integrations/openclaw/status`, `POST /api/integrations/openclaw/ask`

Het dashboard start een agent-run en toont een `runId`. Het antwoord verschijnt in OpenClaw (Control UI / VS Code), niet als live chat in de browser. Dat houdt de Gateway-token uit de frontend.

## Website

Na een geslaagde `/api/contact` (Resend) wordt **best-effort** een samenvatting naar OpenClaw gestuurd. Als de Gateway uitstaat, blijft de e-mail gewoon werken.

Zet `OPENCLAW_CONTACT_FORWARD=false` om dat uit te schakelen.

## Productie (Vercel)

Vercel kan `127.0.0.1` niet bereiken. Zet `OPENCLAW_GATEWAY_URL` op een bereikbare URL (Tailscale Serve/Funnel, of een tunnel) en dezelfde `OPENCLAW_HOOKS_TOKEN`. Gateway blijft achter auth; hooks-token is alleen server-side.

## Code

| Pad | Rol |
|-----|-----|
| `src/lib/integrations/openclaw.ts` | Status, probe, `/hooks/agent` |
| `GET /api/integrations/openclaw/status` | Health zonder secrets |
| `POST /api/integrations/openclaw/ask` | Dashboard-opdrachten |
| `/dashboard/intern/openclaw` | Assistent-UI |
| `src/app/api/contact/route.ts` | Optionele doorzet naar OpenClaw |
