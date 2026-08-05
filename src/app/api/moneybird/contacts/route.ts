import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatMoneybirdError,
  isMoneybirdConfigured,
  moneybirdFetch,
  sanitizeMoneybirdContact,
  searchMoneybirdContacts,
} from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireInternApiAccess();
  if ("error" in auth && auth.error) return auth.error;

  if (!isMoneybirdConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Moneybird configuratie ontbreekt. Controleer Vercel Environment Variables.",
      },
      { status: 503 },
    );
  }

  try {
    const query = new URL(request.url).searchParams.get("query")?.trim();
    let contacts;
    if (query) {
      contacts = await searchMoneybirdContacts(query);
    } else {
      const raw = await moneybirdFetch<Record<string, unknown>[]>(
        "/contacts.json",
      );
      contacts = (Array.isArray(raw) ? raw : []).map((c) =>
        sanitizeMoneybirdContact(c),
      );
    }

    return NextResponse.json({ ok: true, contacts });
  } catch (error) {
    console.error("[Moneybird] Contacten ophalen mislukt");
    return NextResponse.json(
      { ok: false, error: formatMoneybirdError(error) },
      { status: 502 },
    );
  }
}
