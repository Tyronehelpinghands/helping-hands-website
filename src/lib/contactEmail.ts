import { siteConfig } from "@/lib/siteConfig";
import type { ContactFormType } from "@/lib/contact";

const DEFAULT_FROM =
  "Helping Hands Agency <noreply@helpinghandsagency.nl>";

const LEGACY_FORM_TYPE_MAP: Record<string, ContactFormType> = {
  staff_request: "staff_request",
  crew_application: "crew_application",
  general_contact: "general_contact",
  client: "staff_request",
  client_request: "staff_request",
  worker: "crew_application",
  employee_application: "crew_application",
  crew_question: "crew_application",
  general: "general_contact",
  other: "general_contact",
};

export function normalizeFormType(raw: unknown): ContactFormType | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  return LEGACY_FORM_TYPE_MAP[key] ?? null;
}

export function getRecipientForFormType(formType: string): string {
  switch (formType) {
    case "staff_request":
      return (
        process.env.STAFF_REQUEST_TO_EMAIL || siteConfig.planningEmail
      );
    case "crew_application":
      return (
        process.env.CREW_APPLICATION_TO_EMAIL || siteConfig.applicationsEmail
      );
    case "general_contact":
    default:
      return process.env.GENERAL_CONTACT_TO_EMAIL || siteConfig.email;
  }
}

/**
 * Optional CC recipients. Crew applications CC H&R (Marieke) so both
 * aanmeldingen@ and marieke@ get the same mail.
 */
export function getCcForFormType(formType: string): string | undefined {
  if (formType !== "crew_application") return undefined;

  const cc =
    process.env.CREW_APPLICATION_CC_EMAIL ||
    process.env.HR_EMAIL ||
    siteConfig.hrEmail;
  const to = getRecipientForFormType(formType);
  if (!cc || cc.toLowerCase() === to.toLowerCase()) return undefined;
  return cc;
}

export function getContactFromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
}

export function getSuccessMessage(formType: ContactFormType): string {
  switch (formType) {
    case "staff_request":
      return "Bedankt! Je personeelsaanvraag is verzonden naar onze planning. We nemen zo snel mogelijk contact met je op.";
    case "crew_application":
      return "Bedankt! Je aanmelding is verzonden. We nemen zo snel mogelijk contact met je op.";
    case "general_contact":
      return "Bedankt! Je bericht is verzonden. We nemen zo snel mogelijk contact met je op.";
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export type ContactValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateContactPayload(
  formType: ContactFormType,
  body: Record<string, unknown>,
): ContactValidationResult {
  const email = asString(body.email);
  if (!email || !looksLikeEmail(email)) {
    return { ok: false, error: "Vul een geldig e-mailadres in." };
  }

  if (formType === "staff_request") {
    const required: Array<[string, string]> = [
      ["companyName", "bedrijfsnaam"],
      ["contactName", "naam van de contactpersoon"],
      ["date", "datum"],
      ["location", "locatie"],
      ["numberOfPeople", "aantal mensen"],
      ["functions", "functies"],
    ];
    for (const [key, label] of required) {
      if (!asString(body[key])) {
        return { ok: false, error: `Vul ${label} in.` };
      }
    }
    return { ok: true };
  }

  if (formType === "crew_application") {
    const name = asString(body.name) || asString(body.contactName);
    if (!name) {
      return { ok: false, error: "Vul je naam in." };
    }
    if (!asString(body.phone)) {
      return { ok: false, error: "Vul je telefoonnummer in." };
    }
    const message =
      asString(body.message) ||
      asString(body.motivation) ||
      asString(body.experience);
    if (!message) {
      return { ok: false, error: "Vul je ervaring of motivatie in." };
    }
    return { ok: true };
  }

  const name = asString(body.name) || asString(body.contactName);
  if (!name) {
    return { ok: false, error: "Vul je naam in." };
  }
  if (!asString(body.message) && !asString(body.motivation)) {
    return { ok: false, error: "Vul je bericht in." };
  }
  return { ok: true };
}
