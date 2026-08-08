import { brandImages } from "@/lib/brand";
import { socialLinks } from "@/lib/social";
import { siteConfig } from "@/lib/siteConfig";

/** Production CDN base — email clients must not load preview/localhost assets. */
const EMAIL_ASSET_BASE = "https://www.helpinghandsagency.nl";

const SIGNATURE_BLUE = "#00AEEF";
const SIGNATURE_ORANGE = "#F37021";
const TEXT = "#000000";

export type EmailSignaturePerson = {
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  company?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailAssetUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${EMAIL_ASSET_BASE}${normalized}`;
}

/** Address line matching the Gmail signature style (compact postal code). */
export function signatureAddressLine(): string {
  const { street, postalCode, city } = siteConfig.address;
  const postal = postalCode.replace(/\s+/g, "");
  return `${street}, ${postal} ${city}`;
}

function websiteHost(): string {
  return siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ensureWwwHost(host: string): string {
  return host.startsWith("www.") ? host : `www.${host}`;
}

function contactIconCell(symbol: string): string {
  return `<td style="width:22px;padding:2px 8px 2px 0;vertical-align:top;color:${SIGNATURE_BLUE};font-size:13px;line-height:18px;font-family:Arial,Helvetica,sans-serif;">${symbol}</td>`;
}

function contactRow(symbol: string, valueHtml: string): string {
  return `<tr>
  ${contactIconCell(symbol)}
  <td style="padding:2px 0;vertical-align:top;color:${TEXT};font-size:13px;line-height:18px;font-family:Arial,Helvetica,sans-serif;">${valueHtml}</td>
</tr>`;
}

function socialOrder(): Array<{
  id: string;
  label: string;
  href: string;
  letter: string;
}> {
  const byId = Object.fromEntries(socialLinks.map((l) => [l.id, l]));
  const order: Array<{ id: "facebook" | "linkedin" | "instagram"; letter: string }> =
    [
      { id: "facebook", letter: "f" },
      { id: "linkedin", letter: "in" },
      { id: "instagram", letter: "ig" },
    ];
  return order
    .map((item) => {
      const link = byId[item.id];
      if (!link) return null;
      return {
        id: item.id,
        label: link.label,
        href: link.href,
        letter: item.letter,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}

/**
 * Table-based HTML signature for outbound staff mail (Gmail-style layout).
 * Company address / website / socials use site defaults; phone is omitted when empty.
 */
export function buildEmailSignatureHtml(person: EmailSignaturePerson): string {
  const name = escapeHtml(person.name.trim() || siteConfig.shortName);
  const role = escapeHtml(person.role.trim() || "Team");
  const company = escapeHtml(
    (person.company ?? siteConfig.shortName).trim() || siteConfig.shortName,
  );
  const email = person.email.trim();
  const phone = person.phone?.trim() || "";
  const website = ensureWwwHost(websiteHost());
  const address = signatureAddressLine();
  const logoUrl = escapeHtml(emailAssetUrl(brandImages.logo480));

  const contactRows: string[] = [];
  if (phone) {
    contactRows.push(
      contactRow(
        "&#9742;",
        `<a href="tel:${escapeHtml(phone.replace(/\s+/g, ""))}" style="color:${TEXT};text-decoration:none;">${escapeHtml(phone)}</a>`,
      ),
    );
  }
  if (email) {
    contactRows.push(
      contactRow(
        "&#9993;",
        `<a href="mailto:${escapeHtml(email)}" style="color:${TEXT};text-decoration:none;">${escapeHtml(email)}</a>`,
      ),
    );
  }
  contactRows.push(
    contactRow(
      "&#127760;",
      `<a href="https://${escapeHtml(website)}" style="color:${TEXT};text-decoration:none;" target="_blank">${escapeHtml(website)}</a>`,
    ),
  );
  contactRows.push(contactRow("&#128205;", escapeHtml(address)));

  const socialCells = socialOrder()
    .map((s) => {
      return `<td style="padding:0 0 0 8px;">
  <a href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(s.label)}" style="display:inline-block;width:28px;height:28px;background-color:${SIGNATURE_ORANGE};border-radius:50%;color:#ffffff;text-align:center;line-height:28px;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;">${escapeHtml(s.letter)}</a>
</td>`;
    })
    .join("");

  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:${TEXT};">
  <tr>
    <td style="padding:0 16px 0 0;vertical-align:top;min-width:140px;">
      <div style="font-size:15px;font-weight:bold;line-height:1.35;color:${TEXT};">${name}</div>
      <div style="font-size:13px;line-height:1.35;color:${TEXT};">${role}</div>
      <div style="font-size:13px;line-height:1.35;color:${TEXT};">${company}</div>
    </td>
    <td style="width:1px;background-color:${SIGNATURE_BLUE};padding:0;font-size:0;line-height:0;">&nbsp;</td>
    <td style="padding:0 0 0 16px;vertical-align:top;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${contactRows.join("\n")}
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="padding-top:18px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;padding:0;">
            <a href="${escapeHtml(EMAIL_ASSET_BASE)}" target="_blank" rel="noopener noreferrer">
              <img src="${logoUrl}" alt="${escapeHtml(siteConfig.name)}" width="180" style="display:block;border:0;max-width:180px;height:auto;" />
            </a>
          </td>
          <td style="vertical-align:middle;padding:0;text-align:right;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="border-collapse:collapse;">
              <tr>${socialCells}</tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}

/** Plain-text fallback signature. */
export function buildEmailSignatureText(person: EmailSignaturePerson): string {
  const name = person.name.trim() || siteConfig.shortName;
  const role = person.role.trim() || "Team";
  const company =
    (person.company ?? siteConfig.shortName).trim() || siteConfig.shortName;
  const email = person.email.trim();
  const phone = person.phone?.trim();
  const website = ensureWwwHost(websiteHost());
  const lines = [
    "--",
    name,
    role,
    company,
    phone ? `T: ${phone}` : null,
    email ? `E: ${email}` : null,
    `W: ${website}`,
    `A: ${signatureAddressLine()}`,
    "",
    ...socialOrder().map((s) => `${s.label}: ${s.href}`),
  ].filter((line): line is string => line !== null);
  return lines.join("\n");
}
