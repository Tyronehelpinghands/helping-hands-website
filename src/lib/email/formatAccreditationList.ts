import { csvEscape, formatDate, formatTime } from "@/lib/dashboard/formatters";
import { siteConfig } from "@/lib/siteConfig";

export type AccreditationListRow = {
  fullName: string;
  roleName: string | null;
  phone: string | null;
  company: string;
  shiftDate: string;
  startTime: string | null;
  endTime: string | null;
};

export type AccreditationListPayload = {
  projectName: string;
  location?: string | null;
  rows: AccreditationListRow[];
};

const TEXT = "#101828";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const HEADER_BG = "#F5F7FA";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugifyFilename(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
}

/** CSV attachment content (UTF-8 with BOM for Excel). */
export function buildAccreditationListCsv(
  payload: AccreditationListPayload,
): string {
  const header = [
    "Naam",
    "Functie",
    "Telefoon",
    "Bedrijf",
    "Datum",
    "Start",
    "Eind",
  ];
  const lines = [
    header.map(csvEscape).join(","),
    ...payload.rows.map((row) =>
      [
        row.fullName,
        row.roleName ?? "",
        row.phone ?? "",
        row.company,
        formatDate(row.shiftDate),
        formatTime(row.startTime),
        formatTime(row.endTime),
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];
  return `\uFEFF${lines.join("\r\n")}`;
}

export function accreditationListFilename(
  projectName: string,
  ext: "csv" | "html" = "csv",
): string {
  const slug = slugifyFilename(projectName) || "project";
  return `accreditatielijst-${slug}.${ext}`;
}

/** HTML table section for inline email body (Dutch labels). */
export function buildAccreditationListHtmlSection(
  payload: AccreditationListPayload,
): string {
  const location = payload.location?.trim();
  const rowsHtml =
    payload.rows.length === 0
      ? `<tr><td colspan="6" style="padding:10px 12px;color:${MUTED};">Geen toegewezen crew voor dit project.</td></tr>`
      : payload.rows
          .map(
            (row) => `<tr>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(row.fullName)}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(row.roleName || "—")}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(row.phone || "—")}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(row.company)}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(formatDate(row.shiftDate))}</td>
  <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${TEXT};">${escapeHtml(formatTime(row.startTime))}–${escapeHtml(formatTime(row.endTime))}</td>
</tr>`,
          )
          .join("\n");

  return `
<div style="margin:24px 0 0;">
  <p style="margin:0 0 4px;font-size:16px;font-weight:bold;color:${TEXT};">Accreditatielijst</p>
  <p style="margin:0 0 12px;font-size:13px;color:${MUTED};">
    ${escapeHtml(payload.projectName)}${location ? ` · ${escapeHtml(location)}` : ""}
    · ${payload.rows.length} ${payload.rows.length === 1 ? "persoon" : "personen"}
  </p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border:1px solid ${BORDER};font-size:13px;font-family:Arial,Helvetica,sans-serif;">
    <thead>
      <tr style="background:${HEADER_BG};">
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Naam</th>
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Functie</th>
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Telefoon</th>
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Bedrijf</th>
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Datum</th>
        <th align="left" style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${MUTED};font-weight:600;">Tijd</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</div>`.trim();
}

/** Plain-text fallback of the accreditation list. */
export function buildAccreditationListTextSection(
  payload: AccreditationListPayload,
): string {
  const location = payload.location?.trim();
  const lines = [
    "Accreditatielijst",
    `${payload.projectName}${location ? ` · ${location}` : ""}`,
    "",
    ...payload.rows.map((row) => {
      const time = `${formatTime(row.startTime)}–${formatTime(row.endTime)}`;
      return [
        row.fullName,
        row.roleName || "—",
        row.phone || "—",
        row.company,
        formatDate(row.shiftDate),
        time,
      ].join(" | ");
    }),
  ];
  if (payload.rows.length === 0) {
    lines.push("Geen toegewezen crew voor dit project.");
  }
  return lines.join("\n");
}

export function defaultAccreditationCompany(): string {
  return siteConfig.shortName;
}
