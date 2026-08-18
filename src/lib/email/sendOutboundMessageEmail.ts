import { Resend } from "resend";
import { getContactFromEmail } from "@/lib/contactEmail";
import { formatOutboundMessageEmail } from "@/lib/email/formatOutboundMessageEmail";
import type { EmailSignaturePerson } from "@/lib/email/buildEmailSignature";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const VERIFIED_DOMAIN = "helpinghandsagency.nl";

export type OutboundEmailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export type SendOutboundMessageInput = {
  to: string | string[];
  subject: string;
  body: string;
  recipientName?: string | null;
  sender: EmailSignaturePerson;
  extraHtml?: string | null;
  extraText?: string | null;
  attachments?: OutboundEmailAttachment[];
};

export type SendOutboundMessageResult =
  | { ok: true; id: string | null; from: string; replyTo: string }
  | { ok: false; error: string };

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(normalizeEmail(value));
}

function extractEmailAddress(fromHeader: string): string | null {
  const angled = fromHeader.match(/<([^>]+)>/);
  if (angled?.[1] && isValidEmail(angled[1])) {
    return normalizeEmail(angled[1]);
  }
  if (isValidEmail(fromHeader)) return normalizeEmail(fromHeader);
  return null;
}

function formatFromHeader(name: string, email: string): string {
  const safeName = name.replace(/[<>\r\n"]/g, "").trim() || "Helping Hands";
  return `${safeName} <${email}>`;
}

/**
 * Resolve Resend From / Reply-To for a logged-in staff member.
 *
 * Prefer sending as `Name <user@helpinghandsagency.nl>` when the user mailbox
 * is on the verified domain. If Resend only accepts a single verified mailbox
 * (CONTACT_FROM_EMAIL), we still show the staff display name on From and set
 * Reply-To to the staff email so replies reach the right person.
 */
export function resolveOutboundSenderIdentity(sender: EmailSignaturePerson): {
  from: string;
  replyTo: string;
  usedPersonalMailbox: boolean;
} {
  const replyTo = normalizeEmail(sender.email);
  const displayName = sender.name.trim() || "Helping Hands";
  const domain = replyTo.split("@")[1] ?? "";

  if (domain === VERIFIED_DOMAIN) {
    return {
      from: formatFromHeader(displayName, replyTo),
      replyTo,
      usedPersonalMailbox: true,
    };
  }

  const verifiedHeader = getContactFromEmail();
  const verifiedMailbox =
    extractEmailAddress(verifiedHeader) ?? `noreply@${VERIFIED_DOMAIN}`;

  return {
    from: formatFromHeader(displayName, verifiedMailbox),
    replyTo,
    usedPersonalMailbox: false,
  };
}

/**
 * Send a Berichten e-mail via Resend with staff signature (no dashboard meta footer).
 */
export async function sendOutboundMessageEmail(
  input: SendOutboundMessageInput,
): Promise<SendOutboundMessageResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error:
        "RESEND_API_KEY ontbreekt — e-mail kan niet worden verstuurd. Controleer Vercel env.",
    };
  }

  if (!isValidEmail(input.sender.email)) {
    return {
      ok: false,
      error:
        "Ingelogde gebruiker heeft geen geldig e-mailadres voor verzenden.",
    };
  }

  const recipients = (Array.isArray(input.to) ? input.to : [input.to])
    .map((e) => normalizeEmail(e))
    .filter(isValidEmail);

  if (recipients.length === 0) {
    return {
      ok: false,
      error: "Geen geldig ontvanger-e-mailadres.",
    };
  }

  const { from, replyTo } = resolveOutboundSenderIdentity(input.sender);
  const { subject, text, html } = formatOutboundMessageEmail({
    subject: input.subject,
    body: input.body,
    recipientName: input.recipientName,
    sender: input.sender,
    extraHtml: input.extraHtml,
    extraText: input.extraText,
  });

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: recipients,
      replyTo,
      subject,
      text,
      html,
      ...(input.attachments?.length
        ? {
            attachments: input.attachments.map((a) => ({
              filename: a.filename,
              content:
                typeof a.content === "string"
                  ? Buffer.from(a.content, "utf8")
                  : a.content,
              contentType: a.contentType,
            })),
          }
        : {}),
    });

    if (error) {
      return {
        ok: false,
        error: error.message || "Versturen via Resend is mislukt.",
      };
    }

    return {
      ok: true,
      id: data?.id ?? null,
      from,
      replyTo,
    };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error
          ? e.message
          : "Onbekende fout bij versturen via Resend.",
    };
  }
}
