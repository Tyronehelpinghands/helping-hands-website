import { Resend } from "resend";
import { getContactFromEmail } from "@/lib/contactEmail";
import { formatPortalInviteEmail } from "@/lib/email/formatPortalInviteEmail";
import {
  createAdminClient,
  isAdminConfigured,
} from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;

/** In-memory throttle: email → timestamps (server instance). */
const inviteTimestamps = new Map<string, number[]>();

export type InviteClientInput = {
  clientId: string;
  email: string;
  companyName: string;
  contactName?: string | null;
};

export type InviteClientResult =
  | {
      ok: true;
      invited: true;
      email: string;
      existingUser: boolean;
    }
  | {
      ok: true;
      invited: false;
      skipped: true;
      reason: "no_email" | "invalid_email" | "disabled" | "missing_config";
    }
  | { ok: false; error: string };

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidInviteEmail(email: string): boolean {
  return EMAIL_RE.test(normalizeEmail(email));
}

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = normalizeEmail(email);
  const recent = (inviteTimestamps.get(key) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (recent.length >= RATE_MAX) {
    inviteTimestamps.set(key, recent);
    return false;
  }
  recent.push(now);
  inviteTimestamps.set(key, recent);
  return true;
}

const PRODUCTION_SITE_URL = "https://www.helpinghandsagency.nl";

/**
 * Invite / recovery links must always land on production — never a Vercel
 * preview host — otherwise Site URL / redirect mismatches expire OTPs and
 * dump users on the marketing homepage with a `#error=` hash.
 */
function passwordSetupRedirect(): string {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const looksLikePreviewOrLocal =
    !configured ||
    configured.includes("vercel.app") ||
    configured.includes("localhost") ||
    configured.includes("127.0.0.1");
  const base = looksLikePreviewOrLocal ? PRODUCTION_SITE_URL : configured;
  return `${base}/auth/callback?next=/update-password`;
}

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Te veel uitnodigingen. Probeer het over een kwartier opnieuw.";
  }
  if (lower.includes("already") || lower.includes("registered")) {
    return "Dit e-mailadres hoort al bij een bestaand account.";
  }
  if (lower.includes("invalid") && lower.includes("email")) {
    return "Ongeldig e-mailadres.";
  }
  return message;
}

type ProfileRow = {
  id: string;
  email: string | null;
  role: string;
  full_name: string | null;
};

function escapeIlikeExact(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

async function findProfileByEmail(
  email: string,
): Promise<ProfileRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, email, role, full_name")
    .ilike("email", escapeIlikeExact(email))
    .limit(1);

  return (data?.[0] as ProfileRow | undefined) ?? null;
}

const INTERNAL_OR_CREW = new Set([
  "owner",
  "admin",
  "planner",
  "sales",
  "finance",
  "crew",
]);

async function linkClientProfile(
  clientId: string,
  profileId: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("clients")
    .update({ profile_id: profileId })
    .eq("id", clientId);

  if (error) {
    const msg = error.message.toLowerCase();
    const missingColumn =
      msg.includes("profile_id") &&
      (msg.includes("does not exist") ||
        msg.includes("could not find") ||
        msg.includes("schema cache"));
    throw new Error(
      missingColumn
        ? "Draai SQL voor clients.profile_id (supabase/clients-profile-id.sql in Supabase SQL Editor)."
        : error.message.includes("profile_id")
          ? "Kon opdrachtgever niet koppelen aan portaalaccount (profile_id ontbreekt in database?). Draai supabase/clients-profile-id.sql."
          : error.message,
    );
  }
}

async function generateActionLink(params: {
  email: string;
  existingUser: boolean;
  fullName: string | null;
}): Promise<{ actionLink: string; userId: string }> {
  const admin = createAdminClient();
  const redirectTo = passwordSetupRedirect();

  if (params.existingUser) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: params.email,
      options: { redirectTo },
    });
    if (error || !data?.properties?.action_link) {
      throw new Error(
        translateAuthError(
          error?.message ?? "Kon herstel-link niet aanmaken.",
        ),
      );
    }
    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Gebruiker niet gevonden na herstel-link.");
    }
    return { actionLink: data.properties.action_link, userId };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email: params.email,
    options: {
      redirectTo,
      data: {
        full_name: params.fullName ?? undefined,
        role: "client",
      },
    },
  });

  if (error || !data?.properties?.action_link) {
    const msg = error?.message ?? "";
    if (
      msg.toLowerCase().includes("already") ||
      msg.toLowerCase().includes("registered")
    ) {
      const recovery = await admin.auth.admin.generateLink({
        type: "recovery",
        email: params.email,
        options: { redirectTo },
      });
      if (recovery.error || !recovery.data?.properties?.action_link) {
        throw new Error(
          translateAuthError(
            recovery.error?.message ?? "Kon herstel-link niet aanmaken.",
          ),
        );
      }
      const userId = recovery.data.user?.id;
      if (!userId) {
        throw new Error("Bestaand account gevonden, maar geen gebruikers-id.");
      }
      return {
        actionLink: recovery.data.properties.action_link,
        userId,
      };
    }
    throw new Error(
      translateAuthError(msg || "Kon uitnodigingslink niet aanmaken."),
    );
  }

  const userId = data.user?.id;
  if (!userId) {
    throw new Error("Uitnodiging aangemaakt zonder gebruikers-id.");
  }
  return { actionLink: data.properties.action_link, userId };
}

async function sendBrandedInvite(params: {
  toEmail: string;
  contactName?: string | null;
  companyName: string;
  actionLink: string;
  existingUser: boolean;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY ontbreekt — uitnodiging kan niet worden verstuurd.",
    );
  }

  const { subject, text, html } = formatPortalInviteEmail({
    toEmail: params.toEmail,
    contactName: params.contactName,
    companyName: params.companyName,
    actionLink: params.actionLink,
    existingUser: params.existingUser,
  });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: getContactFromEmail(),
    to: params.toEmail,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(
      error.message || "Versturen van de uitnodigingsmail is mislukt.",
    );
  }
}

/**
 * Invite (or re-invite) an opdrachtgever to `/portaal/opdrachtgevers`.
 * Uses service role + Resend branded HTML. Safe to call after client insert.
 */
export async function inviteClientToPortal(
  input: InviteClientInput,
): Promise<InviteClientResult> {
  const raw = input.email?.trim() ?? "";
  if (!raw) {
    return { ok: true, invited: false, skipped: true, reason: "no_email" };
  }

  const email = normalizeEmail(raw);
  if (!isValidInviteEmail(email)) {
    return {
      ok: true,
      invited: false,
      skipped: true,
      reason: "invalid_email",
    };
  }

  if (!isAdminConfigured()) {
    return {
      ok: true,
      invited: false,
      skipped: true,
      reason: "missing_config",
    };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      ok: true,
      invited: false,
      skipped: true,
      reason: "missing_config",
    };
  }

  if (!checkRateLimit(email)) {
    return {
      ok: false,
      error:
        "Te veel uitnodigingen voor dit e-mailadres. Probeer het over een kwartier opnieuw.",
    };
  }

  try {
    const existing = await findProfileByEmail(email);
    if (existing && INTERNAL_OR_CREW.has(existing.role)) {
      return {
        ok: false,
        error:
          "Dit e-mailadres hoort bij een bestaand intern- of medewerkersaccount. Gebruik een ander e-mailadres voor het opdrachtgeversportaal.",
      };
    }

    const existingUser = Boolean(existing);
    const fullName =
      input.contactName?.trim() || input.companyName.trim() || null;

    const { actionLink, userId } = await generateActionLink({
      email,
      existingUser,
      fullName,
    });

    // Trigger may create profile as 'crew' — force client role + email.
    const admin = createAdminClient();
    await admin.from("profiles").upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        role: "client",
      },
      { onConflict: "id" },
    );
    await linkClientProfile(input.clientId, userId);

    await sendBrandedInvite({
      toEmail: email,
      contactName: input.contactName,
      companyName: input.companyName,
      actionLink,
      existingUser,
    });

    return { ok: true, invited: true, email, existingUser };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Uitnodiging versturen mislukt.";
    return { ok: false, error: translateAuthError(message) };
  }
}

export function inviteResultMessage(
  result: InviteClientResult,
  emailFallback?: string | null,
): string {
  if (result.ok && result.invited) {
    return result.existingUser
      ? `Opdrachtgever gekoppeld. Nieuwe inlog-mail verstuurd naar ${result.email}.`
      : `Opdrachtgever aangemaakt. Uitnodiging verstuurd naar ${result.email}.`;
  }
  if (result.ok && result.skipped) {
    switch (result.reason) {
      case "no_email":
        return "Opdrachtgever aangemaakt (geen e-mail — geen uitnodiging).";
      case "invalid_email":
        return "Opdrachtgever aangemaakt (ongeldig e-mailadres — geen uitnodiging).";
      case "missing_config":
        return "Opdrachtgever aangemaakt. Uitnodiging niet verstuurd (serverconfiguratie incompleet).";
      case "disabled":
        return "Opdrachtgever aangemaakt (geen uitnodiging).";
      default:
        return "Opdrachtgever aangemaakt.";
    }
  }
  if (!result.ok) {
    const email = emailFallback?.trim();
    return email
      ? `Opdrachtgever aangemaakt, maar uitnodiging mislukt: ${result.error}`
      : result.error;
  }
  return "Opdrachtgever aangemaakt.";
}
