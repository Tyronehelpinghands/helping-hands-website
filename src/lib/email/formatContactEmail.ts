import type { ContactFormType } from "@/lib/contact";

export type { ContactFormType };

export type ContactEmailPayload = {
  formType: ContactFormType;
  email: string;
  isUrgent?: boolean;
  recipient: string;
  // staff_request
  companyName?: string;
  contactName?: string;
  phone?: string;
  date?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  numberOfPeople?: string | number;
  functions?: string;
  inzetType?: string;
  clothing?: string;
  pbm?: string;
  certificates?: string;
  onSiteContact?: string;
  travel?: string;
  briefing?: string;
  // crew_application
  name?: string;
  city?: string;
  age?: string | number;
  experience?: string;
  availability?: string;
  contractType?: string;
  license?: string;
  transport?: string;
  interests?: string[];
  motivation?: string;
  message?: string;
  // general_contact
  subject?: string;
};

const FORM_TYPE_LABELS: Record<ContactFormType, string> = {
  staff_request: "Personeel aanvragen",
  crew_application: "Aanmelden als medewerker",
  general_contact: "Algemene vraag",
};

function dash(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || "n.n.b.";
  }
  return "n.n.b.";
}

function line(label: string, value: unknown): string {
  return `${label}: ${dash(value)}`;
}

export function getContactSubject(payload: ContactEmailPayload): string {
  if (payload.formType === "staff_request") {
    const company = dash(payload.companyName);
    return payload.isUrgent
      ? `SPOED personeelsaanvraag via website - ${company}`
      : `Nieuwe personeelsaanvraag via website - ${company}`;
  }

  if (payload.formType === "crew_application") {
    const name = dash(payload.name || payload.contactName);
    return `Nieuwe medewerker aanmelding via website - ${name}`;
  }

  const name = dash(payload.name || payload.contactName);
  return `Nieuw contactbericht via website - ${name}`;
}

export function formatContactEmail(payload: ContactEmailPayload): {
  subject: string;
  text: string;
} {
  const subject = getContactSubject(payload);
  const header = [
    `Type formulier: ${FORM_TYPE_LABELS[payload.formType]} (${payload.formType})`,
    `Ontvanger: ${payload.recipient}`,
    payload.formType === "staff_request"
      ? `Spoed: ${payload.isUrgent ? "ja" : "nee"}`
      : null,
    "Verzonden vanaf website: helpinghandsagency.nl/contact",
    "",
  ].filter((entry): entry is string => entry !== null);

  let body: string[];

  if (payload.formType === "staff_request") {
    body = [
      line("Bedrijf", payload.companyName),
      line("Contactpersoon", payload.contactName),
      line("E-mail", payload.email),
      line("Telefoon", payload.phone),
      line("Type inzet", payload.inzetType),
      line("Datum", payload.date),
      line("Locatie", payload.location),
      line("Starttijd", payload.startTime),
      line("Eindtijd", payload.endTime),
      line("Aantal medewerkers", payload.numberOfPeople),
      line("Functie(s)", payload.functions),
      line("Kleding", payload.clothing),
      line("PBM's", payload.pbm),
      line("Certificaten", payload.certificates),
      line("Contactpersoon op locatie", payload.onSiteContact),
      line("Reiskosten/reistijd", payload.travel),
      line("Briefing/opmerkingen", payload.briefing),
    ];
  } else if (payload.formType === "crew_application") {
    body = [
      line("Naam", payload.name || payload.contactName),
      line("E-mail", payload.email),
      line("Telefoon", payload.phone),
      line("Woonplaats", payload.city),
      line("Leeftijd", payload.age),
      line(
        "Interesse",
        payload.interests?.length ? payload.interests.join(", ") : undefined,
      ),
      line("Ervaring", payload.experience),
      line("Beschikbaarheid", payload.availability),
      line("ZZP of loondienst", payload.contractType),
      line("Rijbewijs", payload.license),
      line("Vervoer", payload.transport),
      line("Motivatie/bericht", payload.motivation || payload.message),
    ];
  } else {
    body = [
      line("Naam", payload.name || payload.contactName),
      line("E-mail", payload.email),
      line("Telefoon", payload.phone),
      line("Onderwerp", payload.subject),
      "",
      dash(payload.message || payload.motivation),
    ];
  }

  return {
    subject,
    text: [...header, ...body].join("\n"),
  };
}
