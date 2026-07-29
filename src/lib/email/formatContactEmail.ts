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

const NAVY = "#0B1F4D";
const ORANGE = "#F28C28";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";

type Field = { label: string; value: string };
type Section = { title: string; fields: Field[] };

const EMPTY_PLACEHOLDERS = new Set([
  "",
  "-",
  "—",
  "n.n.b.",
  "n.n.b",
  "nnb",
  "n.v.t.",
  "n.v.t",
  "nvt",
  "geen",
  "none",
  "null",
  "undefined",
]);

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "number") return !Number.isFinite(value);
  if (typeof value !== "string") return true;
  const normalized = value.trim().toLowerCase();
  return EMPTY_PLACEHOLDERS.has(normalized);
}

function rawValue(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || isEmptyValue(trimmed)) return null;
    return trimmed;
  }
  return null;
}

/** Display value for required context (subject lines); never blank. */
function displayOrFallback(value: unknown, fallback = "Onbekend"): string {
  return rawValue(value) ?? fallback;
}

function formatDateNl(value: unknown): string | null {
  const text = rawValue(value);
  if (!text) return null;

  // ISO date (YYYY-MM-DD) from <input type="date">
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (isoMatch) {
    const date = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    }
  }

  return text;
}

function formatTimeNl(value: unknown): string | null {
  const text = rawValue(value);
  if (!text) return null;

  const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(text);
  if (match) {
    return `${match[1].padStart(2, "0")}:${match[2]}`;
  }
  return text;
}

function formatTimeRange(
  start: unknown,
  end: unknown,
): string | null {
  const startTime = formatTimeNl(start);
  const endTime = formatTimeNl(end);
  if (startTime && endTime) return `${startTime} – ${endTime}`;
  if (startTime) return `vanaf ${startTime}`;
  if (endTime) return `tot ${endTime}`;
  return null;
}

function field(label: string, value: unknown, formatter?: (v: unknown) => string | null): Field | null {
  const formatted = formatter ? formatter(value) : rawValue(value);
  if (!formatted) return null;
  return { label, value: formatted };
}

function compactFields(fields: Array<Field | null>): Field[] {
  return fields.filter((entry): entry is Field => entry !== null);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStaffSections(payload: ContactEmailPayload): Section[] {
  const sections: Section[] = [
    {
      title: "Aanvraag",
      fields: compactFields([
        field("Bedrijf", payload.companyName),
        field("Type inzet", payload.inzetType),
      ]),
    },
    {
      title: "Contact",
      fields: compactFields([
        field("Contactpersoon", payload.contactName),
        field("E-mail", payload.email),
        field("Telefoon", payload.phone),
      ]),
    },
    {
      title: "Inzet",
      fields: compactFields([
        field("Datum", payload.date, formatDateNl),
        field("Locatie", payload.location),
        (() => {
          const times = formatTimeRange(payload.startTime, payload.endTime);
          return times ? { label: "Tijden", value: times } : null;
        })(),
        field("Aantal medewerkers", payload.numberOfPeople),
        field("Functie(s)", payload.functions),
      ]),
    },
    {
      title: "Op locatie",
      fields: compactFields([
        field("Contactpersoon op locatie", payload.onSiteContact),
        field("Reiskosten / reistijd", payload.travel),
      ]),
    },
    {
      title: "Eisen & opmerkingen",
      fields: compactFields([
        field("Kleding", payload.clothing),
        field("PBM's", payload.pbm),
        field("Certificaten", payload.certificates),
        field("Briefing / opmerkingen", payload.briefing),
      ]),
    },
  ];

  return sections.filter((section) => section.fields.length > 0);
}

function buildCrewSections(payload: ContactEmailPayload): Section[] {
  const sections: Section[] = [
    {
      title: "Persoonlijke gegevens",
      fields: compactFields([
        field("Naam", payload.name || payload.contactName),
        field("E-mail", payload.email),
        field("Telefoon", payload.phone),
        field("Woonplaats", payload.city),
        field("Leeftijd", payload.age),
      ]),
    },
    {
      title: "Beschikbaarheid & voorkeuren",
      fields: compactFields([
        field(
          "Interesse",
          payload.interests?.length ? payload.interests.join(", ") : undefined,
        ),
        field("Ervaring", payload.experience),
        field("Beschikbaarheid", payload.availability),
        field("ZZP of loondienst", payload.contractType),
        field("Rijbewijs", payload.license),
        field("Vervoer", payload.transport),
      ]),
    },
    {
      title: "Motivatie",
      fields: compactFields([
        field("Bericht", payload.motivation || payload.message),
      ]),
    },
  ];

  return sections.filter((section) => section.fields.length > 0);
}

function buildGeneralSections(payload: ContactEmailPayload): Section[] {
  const sections: Section[] = [
    {
      title: "Contact",
      fields: compactFields([
        field("Naam", payload.name || payload.contactName),
        field("E-mail", payload.email),
        field("Telefoon", payload.phone),
        field("Onderwerp", payload.subject),
      ]),
    },
    {
      title: "Bericht",
      fields: compactFields([
        field("Bericht", payload.message || payload.motivation),
      ]),
    },
  ];

  return sections.filter((section) => section.fields.length > 0);
}

function getSections(payload: ContactEmailPayload): Section[] {
  if (payload.formType === "staff_request") return buildStaffSections(payload);
  if (payload.formType === "crew_application") return buildCrewSections(payload);
  return buildGeneralSections(payload);
}

function subjectDateShort(value: unknown): string | null {
  const text = rawValue(value);
  if (!text) return null;
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (isoMatch) {
    const date = new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3]),
    );
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    }
  }
  return text;
}

export function getContactSubject(payload: ContactEmailPayload): string {
  if (payload.formType === "staff_request") {
    const company = displayOrFallback(payload.companyName, "Onbekend bedrijf");
    const date = subjectDateShort(payload.date);
    const inzet = rawValue(payload.inzetType);
    const parts = [company, date, inzet].filter(Boolean);
    const detail = parts.join(" · ");
    return payload.isUrgent
      ? `SPOED · Personeelsaanvraag: ${detail}`
      : `Personeelsaanvraag: ${detail}`;
  }

  if (payload.formType === "crew_application") {
    const name = displayOrFallback(
      payload.name || payload.contactName,
      "Onbekende naam",
    );
    return `Medewerker aanmelding: ${name}`;
  }

  const name = displayOrFallback(
    payload.name || payload.contactName,
    "Onbekende naam",
  );
  const subject = rawValue(payload.subject);
  return subject
    ? `Contactbericht: ${subject} · ${name}`
    : `Contactbericht: ${name}`;
}

function formatTextSections(sections: Section[]): string[] {
  const lines: string[] = [];
  for (const section of sections) {
    lines.push(`— ${section.title.toUpperCase()} —`);
    for (const item of section.fields) {
      lines.push(`${item.label}: ${item.value}`);
    }
    lines.push("");
  }
  return lines;
}

function formatPlainText(payload: ContactEmailPayload, sections: Section[]): string {
  const header: string[] = [
    FORM_TYPE_LABELS[payload.formType],
    `Ontvanger: ${payload.recipient}`,
  ];

  if (payload.formType === "staff_request") {
    if (payload.isUrgent) {
      header.push("⚠ SPOED: ja — graag zo snel mogelijk oppakken");
    }
  }

  header.push("Bron: helpinghandsagency.nl/contact", "");

  return [...header, ...formatTextSections(sections)].join("\n").trimEnd() + "\n";
}

function renderFieldRows(fields: Field[]): string {
  return fields
    .map(
      (item, index) => `
      <tr>
        <td style="padding:10px 0;${index < fields.length - 1 ? `border-bottom:1px solid ${BORDER};` : ""}vertical-align:top;width:38%;font-size:13px;line-height:1.45;color:${MUTED};font-family:Arial,Helvetica,sans-serif;">
          ${escapeHtml(item.label)}
        </td>
        <td style="padding:10px 0;${index < fields.length - 1 ? `border-bottom:1px solid ${BORDER};` : ""}vertical-align:top;font-size:14px;line-height:1.5;color:${NAVY};font-family:Arial,Helvetica,sans-serif;font-weight:600;">
          ${escapeHtml(item.value).replace(/\n/g, "<br />")}
        </td>
      </tr>`,
    )
    .join("");
}

function renderHtmlSections(sections: Section[]): string {
  return sections
    .map(
      (section) => `
    <tr>
      <td style="padding:0 0 18px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:8px;background:#ffffff;">
          <tr>
            <td style="padding:14px 18px 6px 18px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:${ORANGE};font-weight:700;font-family:Arial,Helvetica,sans-serif;">
              ${escapeHtml(section.title)}
            </td>
          </tr>
          <tr>
            <td style="padding:4px 18px 10px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${renderFieldRows(section.fields)}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join("");
}

function formatHtml(payload: ContactEmailPayload, sections: Section[]): string {
  const formLabel = FORM_TYPE_LABELS[payload.formType];
  const urgentBanner =
    payload.formType === "staff_request" && payload.isUrgent
      ? `
    <tr>
      <td style="padding:0 0 18px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;">
          <tr>
            <td style="padding:14px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#B91C1C;line-height:1.4;">
              SPOED — deze aanvraag graag zo snel mogelijk oppakken
            </td>
          </tr>
        </table>
      </td>
    </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(formLabel)}</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
          <tr>
            <td style="padding:0 0 20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NAVY};border-radius:10px;">
                <tr>
                  <td style="padding:22px 24px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ORANGE};font-weight:700;margin-bottom:8px;">
                      Helping Hands Agency
                    </div>
                    <div style="font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">
                      ${escapeHtml(formLabel)}
                    </div>
                    <div style="margin-top:10px;font-size:13px;line-height:1.5;color:#CBD5E1;">
                      Ontvanger: ${escapeHtml(payload.recipient)}<br />
                      Bron: helpinghandsagency.nl/contact
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${urgentBanner}
          ${renderHtmlSections(sections)}
          <tr>
            <td style="padding:8px 4px 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${MUTED};">
              Antwoord op deze e-mail gaat naar de afzender (reply-to).
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function formatContactEmail(payload: ContactEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = getContactSubject(payload);
  const sections = getSections(payload);

  return {
    subject,
    text: formatPlainText(payload, sections),
    html: formatHtml(payload, sections),
  };
}
