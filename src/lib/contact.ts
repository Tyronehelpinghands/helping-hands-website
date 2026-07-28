import { siteConfig } from "@/lib/siteConfig";

export type ContactAudience = "client" | "worker" | "general";

export type ContactFormType =
  | "staff_request"
  | "crew_application"
  | "general_contact";

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
