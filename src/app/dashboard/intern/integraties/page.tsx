import type { Metadata } from "next";
import { cookies } from "next/headers";
import IntegrationsHubClient from "@/components/dashboard/integraties/IntegrationsHubClient";
import IntegrationsStatusTable, {
  type IntegrationStatusRow,
} from "@/components/dashboard/integraties/IntegrationsStatusTable";
import { MvpPageHeader } from "@/components/dashboard/mvp/MvpShared";
import { getDashboardStats } from "@/lib/dashboard/queries";
import {
  canStartGmailOAuth,
  GMAIL_OAUTH_PENDING_RT_COOKIE,
  getGmailConfigStatusAsync,
} from "@/lib/integrations/gmail";
import {
  getWhatsAppConfigStatus,
  WHATSAPP_MESSAGE_TEMPLATES,
} from "@/lib/integrations/whatsapp";
import {
  ensureMoneybirdInvoiceReady,
  isMoneybirdConfigured,
} from "@/lib/server/moneybird";
import {
  isShiftbaseConfigured,
  isShiftbaseExplicitlyDisabled,
} from "@/lib/shiftbase";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Integraties | Intern dashboard",
  description:
    "Status en live healthchecks voor Supabase, Gmail, Shiftbase, Resend en overige koppelingen.",
};

export default async function InternIntegratiesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const gmailStatusParam =
    typeof params.gmail === "string" ? params.gmail : undefined;
  const gmailMessage =
    typeof params.message === "string" ? params.message : undefined;
  const needsEnv = params.needs_env === "1";

  const cookieStore = await cookies();
  const pendingRefreshToken =
    needsEnv && gmailStatusParam === "connected"
      ? cookieStore.get(GMAIL_OAUTH_PENDING_RT_COOKIE)?.value ?? null
      : null;

  const whatsapp = getWhatsAppConfigStatus();
  const gmail = await getGmailConfigStatusAsync();
  const stats = await getDashboardStats();
  const supabaseConfigured = isSupabaseConfigured();
  const resendActive = Boolean(process.env.RESEND_API_KEY?.trim());
  const moneybirdPrepared = isMoneybirdConfigured();
  const moneybirdInvoiceReady = await ensureMoneybirdInvoiceReady();
  const shiftbasePrepared = isShiftbaseConfigured();
  const shiftbaseDisabled = isShiftbaseExplicitlyDisabled();
  const shiftbaseEnabled = !shiftbaseDisabled;

  const initialRows: IntegrationStatusRow[] = [
    {
      provider: "supabase_auth",
      name: "Supabase Auth",
      status: supabaseConfigured ? "Actief" : "Ontbreekt",
      note: supabaseConfigured
        ? "Login + requireRole actief"
        : "NEXT_PUBLIC_SUPABASE_URL / ANON_KEY ontbreken",
    },
    {
      provider: "supabase_db",
      name: "Supabase Database",
      status: stats.tablesReady
        ? "Actief"
        : supabaseConfigured
          ? "Voorbereid"
          : "Ontbreekt",
      note: stats.tablesReady
        ? "Dashboard-tabellen bereikbaar"
        : "SQL uit docs/internal-dashboard-database.md nog draaien",
    },
    {
      provider: "resend",
      name: "Resend",
      status: resendActive ? "Actief" : "Ontbreekt",
      note: resendActive
        ? "API key aanwezig (contactformulieren)"
        : "RESEND_API_KEY ontbreekt",
    },
    {
      provider: "contact",
      name: "Contactformulieren",
      status: resendActive ? "Actief" : "Voorbereid",
      note: "/api/contact route aanwezig",
    },
    {
      provider: "shiftbase",
      name: "Shiftbase",
      status: shiftbaseDisabled
        ? "Optioneel — uitgeschakeld"
        : shiftbasePrepared
          ? "Actief"
          : "Optioneel — beschikbaar",
      note: shiftbaseDisabled
        ? "SHIFTBASE_ENABLED=false — sync uitgeschakeld; planning blijft op Supabase"
        : shiftbasePrepared
          ? "Helping Hands plant in Supabase; sync naar Shiftbase kan aan"
          : "Zet SHIFTBASE_API_KEY om sync beschikbaar te maken",
    },
    {
      provider: "moneybird",
      name: "Moneybird",
      status: moneybirdInvoiceReady
        ? "Actief"
        : moneybirdPrepared
          ? "Voorbereid"
          : "Ontbreekt",
      note: moneybirdInvoiceReady
        ? "Klaar voor facturen (tax/ledger via env of auto)"
        : moneybirdPrepared
          ? "Token OK (contacts) — tax/ledger nog niet opgelost"
          : "Zet MONEYBIRD_ACCESS_TOKEN + ADMINISTRATION_ID in Vercel",
    },
    {
      provider: "whatsapp",
      name: "WhatsApp",
      status: whatsapp.configured ? "Voorbereid" : "Niet gekoppeld",
      note: whatsapp.configured
        ? "Cloud API env aanwezig — klik Test · wa.me werkt altijd"
        : "wa.me beschikbaar · WhatsApp Business Cloud niet geconfigureerd",
    },
    {
      provider: "gmail",
      name: "Gmail",
      status: gmail.configured ? "Actief" : "Ontbreekt",
      note: gmail.configured
        ? "OAuth aanwezig — klik Test om refresh token te valideren"
        : "OAuth incompleet — mailto fallback · Gmail koppelen",
    },
  ];

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Integraties"
        description="Live status en API-tests. Secrets blijven server-side."
      />

      <IntegrationsStatusTable initialRows={initialRows} />

      <IntegrationsHubClient
        supabaseConfigured={supabaseConfigured}
        whatsappConfigured={whatsapp.configured}
        whatsappMissing={whatsapp.missing}
        planningWaMeUrl={whatsapp.planningWaMeUrl}
        gmailConfigured={gmail.configured}
        gmailMissing={gmail.missing}
        gmailSender={gmail.sender}
        gmailCanConnect={canStartGmailOAuth()}
        shiftbaseConfigured={shiftbasePrepared}
        shiftbaseEnabled={shiftbaseEnabled}
        moneybirdConfigured={moneybirdPrepared}
        moneybirdInvoiceReady={moneybirdInvoiceReady}
        mailboxes={gmail.mailboxes}
        whatsappTemplates={[...WHATSAPP_MESSAGE_TEMPLATES]}
        gmailFlash={
          gmailStatusParam
            ? {
                status: gmailStatusParam,
                message: gmailMessage,
                needsEnv,
                pendingRefreshToken,
              }
            : null
        }
      />
    </div>
  );
}
