import { NextResponse } from "next/server";
import { requireFinanceApiAccess } from "@/lib/api-auth";
import {
  createMoneybirdContact,
  formatMoneybirdError,
  isMoneybirdConfigured,
} from "@/lib/server/moneybird";

export const dynamic = "force-dynamic";

type CreateContactBody = {
  companyName?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  address1?: string;
  zipcode?: string;
  city?: string;
  country?: string;
  customerId?: string;
};

export async function POST(request: Request) {
  const auth = await requireFinanceApiAccess();
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

    if (!body.email?.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "E-mailadres is verplicht om een Moneybird-contact aan te maken.",
        },
        { status: 400 },
      );
    }

    if (
      !body.companyName?.trim() &&
      !body.firstname?.trim() &&
      !body.lastname?.trim()
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bedrijfsnaam of voor-/achternaam is verplicht.",
        },
        { status: 400 },
      );
    }

    const contact = await createMoneybirdContact({
      companyName: body.companyName,
      firstname: body.firstname,
      lastname: body.lastname,
      email: body.email,
      phone: body.phone,
      address1: body.address1,
      zipcode: body.zipcode,
      city: body.city,
      country: body.country,
      customerId: body.customerId,
    });

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
