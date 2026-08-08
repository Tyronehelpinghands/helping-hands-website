import {
  buildEmailSignatureHtml,
  buildEmailSignatureText,
  type EmailSignaturePerson,
} from "@/lib/email/buildEmailSignature";

const TEXT = "#101828";
const MUTED = "#64748B";

export type OutboundMessageEmailPayload = {
  subject: string;
  body: string;
  recipientName?: string | null;
  sender: EmailSignaturePerson;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bodyToHtml(body: string): string {
  const escaped = escapeHtml(body.trim());
  return escaped
    .split(/\r?\n/)
    .map((line) => (line.length ? line : "&nbsp;"))
    .join("<br />");
}

export function formatOutboundMessageEmail(
  payload: OutboundMessageEmailPayload,
): { subject: string; text: string; html: string } {
  const subject = payload.subject.trim() || "(geen onderwerp)";
  const body = payload.body.trim();
  const signatureHtml = buildEmailSignatureHtml(payload.sender);
  const signatureText = buildEmailSignatureText(payload.sender);
  const greeting = payload.recipientName?.trim();

  const textParts = [
    greeting ? `Hallo ${greeting},` : null,
    greeting ? "" : null,
    body,
    "",
    signatureText,
  ].filter((line): line is string => line !== null);

  const html = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#ffffff;color:${TEXT};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
    <tr>
      <td style="padding:24px 20px;font-size:15px;line-height:1.55;color:${TEXT};">
        ${
          greeting
            ? `<p style="margin:0 0 16px;font-size:15px;color:${TEXT};">Hallo ${escapeHtml(greeting)},</p>`
            : ""
        }
        <div style="margin:0;font-size:15px;line-height:1.55;color:${TEXT};">
          ${bodyToHtml(body)}
        </div>
        ${signatureHtml}
        <p style="margin:24px 0 0;font-size:11px;line-height:1.4;color:${MUTED};">
          Dit bericht is verstuurd via het interne dashboard van Helping Hands Agency.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject,
    text: textParts.join("\n"),
    html,
  };
}
