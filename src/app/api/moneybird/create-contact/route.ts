import { NextResponse } from "next/server";
import { requireInternApiAccess } from "@/lib/api-auth";
import {
  formatMoneybirdError,
  isMoneybirdConfigured,
  moneybirdFetch,
  sanitizeMoneybirdContact,
} from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

type CreateContactBody = {
  companyName?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  address1?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  customerId?: string;
};

export async function POST(request: Request) {
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
    const body = (await request.json()) as CreateContactBody;

    if (!body.companyName?.trim() && !body.email?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Bedrijfsnaam of e-mail is verplicht." },
        { status: 400 },
      );
    }

    const payload = {
      contact: {
        company_name: body.companyName?.trim() ?? "",
        firstname: body.firstname?.trim() ?? "",
        lastname: body.lastname?.trim() ?? "",
        email: body.email?.trim() ?? "",
        address1: body.address1?.trim() ?? "",
        zipcode: body.zipcode?.trim() ?? "",
        city: body.city?.trim() ?? "",
        country: body.country?.trim() || "NL",
        customer_id: body.customerId?.trim() ?? "",
      },
    };

    const raw = await moneybirdFetch<Record<string, unknown>>("/contacts.json", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const contact = sanitizeMoneybirdContact(raw);
    return NextResponse.json({
      ok: true,
      contact: {
        id: contact.id,
        company_name: contact.company_name,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error("[Moneybird] Contact aanmaken mislukt");
    return NextResponse.json(
      { ok: false, error: formatMoneybirdError(error) },
      { status: 502 },
    );
  }
}
