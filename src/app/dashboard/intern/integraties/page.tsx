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
import { isMoneybirdConfigured } from "@/lib/server/moneybird";
import { isShiftbaseConfigured } from "@/lib/shiftbase";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Integraties | Intern dashboard",
  description:
    "Status en live healthchecks voor Supabase, WhatsApp, Gmail, Shiftbase en overige koppelingen.",
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
  const shiftbasePrepared = isShiftbaseConfigured();

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
        ? "MVP-tabellen bereikbaar"
        : "SQL uit docs/internal-dashboard-database.md nog draaien",
    },
    {
      provider: "resend",
      name: "Resend",
      status: resendActive ? "Actief" : "Ontbreekt",
      note: resendActive
        ? "API key aanwezig (contact)"
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
      status: shiftbasePrepared ? "Voorbereid" : "Ontbreekt",
      note: shiftbasePrepared
        ? "Token aanwezig — klik Test om live API te checken"
        : "SHIFTBASE_API_TOKEN ontbreekt",
    },
    {
      provider: "moneybird",
      name: "Moneybird",
      status: moneybirdPrepared ? "Voorbereid" : "Ontbreekt",
      note: moneybirdPrepared
        ? "Env aanwezig — klik Test (geen auto-send)"
        : "Moneybird env ontbreekt",
    },
    {
      provider: "whatsapp",
      name: "WhatsApp Business",
      status: whatsapp.configured ? "Voorbereid" : "Ontbreekt",
      note: whatsapp.configured
        ? "Cloud API env aanwezig — klik Test · wa.me werkt altijd"
        : "Voorbereid — wa.me fallback",
    },
    {
      provider: "gmail",
      name: "Gmail",
      status: gmail.configured ? "Voorbereid" : "Ontbreekt",
      note: gmail.configured
        ? "OAuth aanwezig — klik Test om refresh token te valideren"
        : "OAuth incompleet — mailto fallback · Gmail koppelen",
    },
  ];

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Integraties"
        description="Eerlijke status + live Test per API. Geen secrets in de UI."
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
        moneybirdConfigured={moneybirdPrepared}
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
