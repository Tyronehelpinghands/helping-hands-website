import { siteConfig } from "@/lib/siteConfig";

export type ContactAudience = "client" | "worker" | "general";

export type ContactFormType =
  | "staff_request"
  | "crew_application"
  | "general_contact";

/** Canonical deep links for contact form tabs (query + hash both supported). */
export const staffRequestHref = "/contact?type=personeel-aanvragen";
export const crewApplyHref = "/contact?type=crew-aanmelden";
export const generalContactHref = "/contact?type=algemene-vraag";

const workerTypeValues = new Set([
  "crew-aanmelden",
  "crew",
  "worker",
  "medewerker",
  "aanmelden",
  "crew_application",
  "employee",
]);

const clientTypeValues = new Set([
  "personeel-aanvragen",
  "personeel",
  "client",
  "staff",
  "aanvraag",
  "staff_request",
]);

const generalTypeValues = new Set([
  "algemene-vraag",
  "algemeen",
  "general",
  "vraag",
  "general_contact",
]);

/**
 * Resolve which contact tab to open from `?type=` / `?tab=` / hash.
 * Used by ContactTabs so CTAs like `/contact?type=crew-aanmelden` work.
 */
export function resolveContactAudienceFromUrl(input: {
  search?: string;
  hash?: string;
}): ContactAudience | null {
  const search = input.search ?? "";
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const raw = (
    params.get("type") ??
    params.get("tab") ??
    params.get("form") ??
    ""
  )
    .trim()
    .toLowerCase();

  if (workerTypeValues.has(raw)) return "worker";
  if (clientTypeValues.has(raw)) return "client";
  if (generalTypeValues.has(raw)) return "general";

  const hash = (input.hash ?? "").trim().toLowerCase();
  if (hash === "#aanmelden" || hash === "#crew") return "worker";
  if (hash === "#aanvraag" || hash === "#personeel") return "client";
  if (hash === "#algemeen" || hash === "#vraag") return "general";

  return null;
}

export function getFallbackMailtoHint(formType: ContactFormType): {
  email: string;
  text: string;
} {
  switch (formType) {
    case "staff_request":
      return {
        email: siteConfig.planningEmail,
        text: `Lukt verzenden niet? Mail direct naar ${siteConfig.planningEmail}.`,
      };
    case "crew_application":
      return {
        email: siteConfig.applicationsEmail,
        text: `Lukt verzenden niet? Mail direct naar ${siteConfig.applicationsEmail}.`,
      };
    case "general_contact":
      return {
        email: siteConfig.email,
        text: `Lukt verzenden niet? Mail direct naar ${siteConfig.email}.`,
      };
  }
}

export const contactProcessSteps = [
  {
    step: "01",
    title: "Jij stuurt je aanvraag",
    description:
      "Via het formulier of e-mail: datum, locatie, functies en aantal mensen.",
  },
  {
    step: "02",
    title: "Wij checken de details",
    description:
      "Planning bekijkt haalbaarheid, tijden, locatie en wat er nog nodig is.",
  },
  {
    step: "03",
    title: "We denken mee over crew",
    description:
      "Juiste functies, aantallen en ervaring — afgestemd op jouw productie.",
  },
  {
    step: "04",
    title: "Bevestiging & afstemming",
    description:
      "Je krijgt terugkoppeling over bezetting, tijden en open punten.",
  },
  {
    step: "05",
    title: "Briefing & uitvoering",
    description:
      "Crew krijgt heldere briefing en staat op locatie klaar om aan te pakken.",
  },
] as const;

export const contactChecklistItems = [
  "Datum en locatie",
  "Start- en eindtijd",
  "Functies en aantal mensen",
  "Kleding / PBM (indien nodig)",
  "Contactpersoon op locatie",
  "Korte briefing of bijzonderheden",
] as const;

export const clientInzetTypes = [
  "Event crew",
  "Stagehands",
  "Horeca support",
  "Keuken / bar",
  "Productie assistentie",
  "Logistiek",
  "Hospitality",
  "Mix / overig",
] as const;

export const workerInterestOptions = [
  "Event crew",
  "Stagehands",
  "Horeca",
  "Keuken",
  "Bar",
  "Productie",
  "Logistiek",
  "Hospitality",
] as const;
