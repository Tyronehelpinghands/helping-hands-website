import {
  applicationsEmail,
  contactEmail,
  planningEmail,
} from "@/lib/navigation";

export type ContactAudience = "client" | "worker" | "general";

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

function valueOrDash(value: FormDataEntryValue | null): string {
  const text = typeof value === "string" ? value.trim() : "";
  return text || "n.n.b.";
}

export function buildClientRequestPlainText(
  formData: FormData,
  isUrgent: boolean,
): string {
  const lines = [
    "Hallo Helping Hands,",
    "",
    isUrgent
      ? "SPOED — ik wil graag personeel/crew aanvragen:"
      : "Ik wil graag personeel/crew aanvragen:",
    "",
    `Bedrijfsnaam: ${valueOrDash(formData.get("bedrijfsnaam"))}`,
    `Contactpersoon: ${valueOrDash(formData.get("contactpersoon"))}`,
    `E-mail: ${valueOrDash(formData.get("email"))}`,
    `Telefoon: ${valueOrDash(formData.get("telefoon"))}`,
    `Type inzet: ${valueOrDash(formData.get("type-inzet"))}`,
    `Datum: ${valueOrDash(formData.get("datum"))}`,
    `Locatie: ${valueOrDash(formData.get("locatie"))}`,
    `Starttijd: ${valueOrDash(formData.get("starttijd"))}`,
    `Eindtijd: ${valueOrDash(formData.get("eindtijd"))}`,
    `Functies: ${valueOrDash(formData.get("functies"))}`,
    `Aantal mensen: ${valueOrDash(formData.get("aantal"))}`,
    `Kleding / PBM: ${valueOrDash(formData.get("kleding-pbm"))}`,
    `Contactpersoon op locatie: ${valueOrDash(formData.get("contact-locatie"))}`,
    `Extra briefing: ${valueOrDash(formData.get("briefing"))}`,
    "",
    "Graag hoor ik wat er mogelijk is.",
  ];
  return lines.join("\n");
}

export function buildWorkerApplicationPlainText(
  formData: FormData,
  interests: string[],
): string {
  const lines = [
    "Hallo Helping Hands,",
    "",
    "Ik wil mij aanmelden als medewerker/crew:",
    "",
    `Naam: ${valueOrDash(formData.get("naam"))}`,
    `E-mail: ${valueOrDash(formData.get("email"))}`,
    `Telefoon: ${valueOrDash(formData.get("telefoon"))}`,
    `Woonplaats: ${valueOrDash(formData.get("woonplaats"))}`,
    `Leeftijd: ${valueOrDash(formData.get("leeftijd"))}`,
    `Interesse: ${interests.length ? interests.join(", ") : "n.n.b."}`,
    `Ervaring: ${valueOrDash(formData.get("ervaring"))}`,
    `Beschikbaarheid: ${valueOrDash(formData.get("beschikbaarheid"))}`,
    `ZZP of loondienst: ${valueOrDash(formData.get("contractvorm"))}`,
    `Rijbewijs: ${valueOrDash(formData.get("rijbewijs"))}`,
    `Vervoer: ${valueOrDash(formData.get("vervoer"))}`,
    "",
    "Graag hoor ik hoe ik verder kan.",
  ];
  return lines.join("\n");
}

export function buildGeneralQuestionPlainText(formData: FormData): string {
  return [
    "Hallo Helping Hands,",
    "",
    "Ik heb een algemene vraag / samenwerkingsvraag:",
    "",
    `Naam: ${valueOrDash(formData.get("naam"))}`,
    `E-mail: ${valueOrDash(formData.get("email"))}`,
    `Telefoon: ${valueOrDash(formData.get("telefoon"))}`,
    `Onderwerp: ${valueOrDash(formData.get("onderwerp"))}`,
    "",
    valueOrDash(formData.get("bericht")),
    "",
    "Graag hoor ik van jullie.",
  ].join("\n");
}

export function buildClientMailto(formData: FormData, isUrgent: boolean): string {
  const company = valueOrDash(formData.get("bedrijfsnaam"));
  const subject = encodeURIComponent(
    isUrgent
      ? `SPOED crewaanvraag — ${company}`
      : `Crewaanvraag — ${company}`,
  );
  const body = encodeURIComponent(
    buildClientRequestPlainText(formData, isUrgent),
  );
  return `mailto:${planningEmail}?subject=${subject}&body=${body}`;
}

export function buildWorkerMailto(
  formData: FormData,
  interests: string[],
): string {
  const name = valueOrDash(formData.get("naam"));
  const subject = encodeURIComponent(`Aanmelding medewerker — ${name}`);
  const body = encodeURIComponent(
    buildWorkerApplicationPlainText(formData, interests),
  );
  return `mailto:${applicationsEmail}?subject=${subject}&body=${body}`;
}

export function buildGeneralMailto(formData: FormData): string {
  const subject = encodeURIComponent(
    `Contactvraag — ${valueOrDash(formData.get("onderwerp"))}`,
  );
  const body = encodeURIComponent(buildGeneralQuestionPlainText(formData));
  return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
}
