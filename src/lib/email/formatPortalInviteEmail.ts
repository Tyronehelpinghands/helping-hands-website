import { brandImages } from "@/lib/brand";
import { absoluteUrl, formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";

const NAVY = "#0B1F4D";
const NAVY_MID = "#173A8A";
const ORANGE = "#F28C28";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";

export type PortalInviteEmailPayload = {
  toEmail: string;
  contactName?: string | null;
  companyName: string;
  /** Supabase action_link (invite or recovery) — never log or expose elsewhere. */
  actionLink: string;
  /** True when the auth user already existed (recovery / re-invite). */
  existingUser?: boolean;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function greetingName(payload: PortalInviteEmailPayload): string {
  const contact = payload.contactName?.trim();
  if (contact) return contact;
  return payload.companyName.trim() || "opdrachtgever";
}

export function getPortalInviteSubject(): string {
  return "Welkom bij Helping Hands Agency — stel je account in";
}

function formatPlainText(payload: PortalInviteEmailPayload): string {
  const name = greetingName(payload);
  const cta = payload.existingUser
    ? "Stel je wachtwoord opnieuw in"
    : "Activeer je account";

  return [
    `Hallo ${name},`,
    "",
    `Je hebt toegang tot het opdrachtgeversportaal van ${siteConfig.name}.`,
    "Daarin kun je personeelsaanvragen en projecten volgen.",
    "",
    `${cta}: ${payload.actionLink}`,
    "",
    "Werkt de knop niet? Kopieer de link hierboven naar je browser.",
    "",
    "—",
    siteConfig.name,
    formatAddressSingleLine(),
    siteConfig.url.replace(/^https?:\/\//, ""),
    "",
  ].join("\n");
}

function formatHtml(payload: PortalInviteEmailPayload): string {
  const name = escapeHtml(greetingName(payload));
  const company = escapeHtml(payload.companyName.trim() || "je bedrijf");
  const actionLink = escapeHtml(payload.actionLink);
  const logoUrl = escapeHtml(absoluteUrl(brandImages.logoWhite));
  const websiteHost = escapeHtml(
    siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  );
  const address = escapeHtml(formatAddressSingleLine());
  const ctaLabel = payload.existingUser
    ? "Stel je wachtwoord in"
    : "Activeer account";
  const intro = payload.existingUser
    ? `Er is opnieuw een uitnodiging aangevraagd voor het opdrachtgeversportaal van <strong style="color:${NAVY};">${company}</strong>. Stel je wachtwoord in om in te loggen.`
    : `Welkom bij ${escapeHtml(siteConfig.name)}. Je kunt nu het opdrachtgeversportaal gebruiken voor <strong style="color:${NAVY};">${company}</strong> — aanvragen en projecten op één plek.`;

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(getPortalInviteSubject())}</title>
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
                    <img src="${logoUrl}" alt="${escapeHtml(siteConfig.name)}" width="180" style="display:block;max-width:180px;height:auto;margin-bottom:14px;border:0;" />
                    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ORANGE};font-weight:700;margin-bottom:8px;">
                      Opdrachtgeversportaal
                    </div>
                    <div style="font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">
                      Stel je account in
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 18px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:8px;background:#ffffff;">
                <tr>
                  <td style="padding:22px 22px 8px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${NAVY};">
                    Hallo ${name},
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 22px 18px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#334155;">
                    ${intro}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:4px 22px 22px 22px;">
                    <a href="${actionLink}" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;padding:14px 28px;border-radius:8px;">
                      ${escapeHtml(ctaLabel)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 22px 22px 22px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:${MUTED};">
                    Werkt de knop niet? Kopieer deze link naar je browser:<br />
                    <a href="${actionLink}" style="color:${NAVY_MID};word-break:break-all;">${actionLink}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 4px 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:${MUTED};">
              ${escapeHtml(siteConfig.name)} · ${address}<br />
              <a href="${escapeHtml(absoluteUrl("/"))}" style="color:${NAVY_MID};text-decoration:none;">${websiteHost}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function formatPortalInviteEmail(payload: PortalInviteEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  return {
    subject: getPortalInviteSubject(),
    text: formatPlainText(payload),
    html: formatHtml(payload),
  };
}
