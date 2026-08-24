# Next steps — Helping Hands website

## Klaar: P1 + P2 + P3 + P4

- P1: SEO foundation
- P2: FAQ/Trust/Why, services, landings, conversie
- P3: PublicHeader / MobileMenu / scroll interactie
- P4: demo API gate, rolredirects, portal layouts, duidelijke demo-banners

## Env (P4)

```env
NEXT_PUBLIC_SITE_URL=https://helpinghandsagency.nl
ALLOW_DEMO_ACCESS=true
ALLOW_DEMO_API_ACCESS=false
```

Op Vercel productie: laat `ALLOW_DEMO_API_ACCESS` uit tenzij je bewust demo-integraties wilt. UI-demo blijft werken via `ALLOW_DEMO_ACCESS`.

## Optioneel daarna

1. Resterende SEO-landings publiceren (`services.ts` → `published: true`)
2. Echte Supabase-rollen + RLS in de database
3. Portal UX polish (bottom tabs medewerkers)
4. HubSpot/form backend voor contactaanvragen
5. OpenClaw: Gateway + dashboard (`/dashboard/intern/openclaw`) + Cursor MCP — zie [`openclaw-integration.md`](./openclaw-integration.md)

Zie ook `.env.example`.
