import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  formatContactEmail,
  type ContactEmailPayload,
  type ContactFormType,
} from "@/lib/email/formatContactEmail";
import { notifyOpenClawFromWebsite } from "@/lib/integrations/openclaw";
import {
  getCcForFormType,
  getContactFromEmail,
  getRecipientForFormType,
  getSuccessMessage,
  normalizeFormType,
  validateContactPayload,
} from "@/lib/contactEmail";

export const dynamic = "force-dynamic";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown): string | undefined {
  const text = asString(value);
  return text || undefined;
}

function asInterests(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length ? items : undefined;
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
}

function buildPayload(
  formType: ContactFormType,
  body: Record<string, unknown>,
  recipient: string,
): ContactEmailPayload {
  return {
    formType,
    recipient,
    email: asString(body.email),
    isUrgent: Boolean(body.isUrgent),
    companyName: asOptionalString(body.companyName),
    contactName: asOptionalString(body.contactName),
    phone: asOptionalString(body.phone),
    date: asOptionalString(body.date),
    location: asOptionalString(body.location),
    startTime: asOptionalString(body.startTime),
    endTime: asOptionalString(body.endTime),
    numberOfPeople:
      asOptionalString(body.numberOfPeople) ??
      (typeof body.numberOfPeople === "number"
        ? body.numberOfPeople
        : undefined),
    functions: asOptionalString(body.functions),
    inzetType: asOptionalString(body.inzetType),
    clothing: asOptionalString(body.clothing),
    pbm: asOptionalString(body.pbm),
    certificates: asOptionalString(body.certificates),
    onSiteContact: asOptionalString(body.onSiteContact),
    travel: asOptionalString(body.travel),
    briefing: asOptionalString(body.briefing),
    name: asOptionalString(body.name),
    city: asOptionalString(body.city),
    age:
      asOptionalString(body.age) ??
      (typeof body.age === "number" ? body.age : undefined),
    experience: asOptionalString(body.experience),
    availability: asOptionalString(body.availability),
    contractType: asOptionalString(body.contractType),
    license: asOptionalString(body.license),
    transport: asOptionalString(body.transport),
    interests: asInterests(body.interests),
    motivation: asOptionalString(body.motivation),
    message: asOptionalString(body.message),
    subject: asOptionalString(body.subject),
  };
}

/** POST /api/contact — publiek contactformulier via Resend (server-only). */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldige JSON-body." },
      { status: 400 },
    );
  }

  // Honeypot: treat as success without sending mail.
  if (asString(body.website)) {
    return NextResponse.json({
      ok: true,
      message: "Bericht ontvangen.",
    });
  }

  const formType = normalizeFormType(body.formType);
  if (!formType) {
    return NextResponse.json(
      { ok: false, error: "Ongeldig formuliertype." },
      { status: 400 },
    );
  }

  const validation = validateContactPayload(formType, body);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, error: validation.error },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "E-mailverzending is tijdelijk niet beschikbaar. Probeer het later opnieuw of mail ons direct.",
      },
      { status: 503 },
    );
  }

  const recipient = getRecipientForFormType(formType);
  const cc = getCcForFormType(formType);
  const from = getContactFromEmail();
  const payload = buildPayload(formType, body, recipient);
  const { subject, text, html } = formatContactEmail(payload);

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: recipient,
    ...(cc ? { cc } : {}),
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Verzenden is mislukt. Probeer het opnieuw of mail ons direct via de fallback hieronder.",
      },
      { status: 502 },
    );
  }

  void notifyOpenClawFromWebsite({
    title: `${formType} · ${payload.companyName || payload.contactName || payload.name || payload.email}`,
    body: text,
  }).catch(() => undefined);

  return NextResponse.json({
    ok: true,
    message: getSuccessMessage(formType),
    id: data?.id ?? null,
  });
}
