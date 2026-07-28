import type { Metadata } from "next";
import IntegrationsHubClient from "@/components/dashboard/integraties/IntegrationsHubClient";
import { MvpBadge, MvpPageHeader } from "@/components/dashboard/mvp/MvpShared";
import { getGmailConfigStatus } from "@/lib/integrations/gmail";
import {
  getWhatsAppConfigStatus,
  WHATSAPP_MESSAGE_TEMPLATES,
} from "@/lib/integrations/whatsapp";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getDashboardStats } from "@/lib/dashboard/queries";
import { isMoneybirdConfigured } from "@/lib/server/moneybird";
import { isShiftbaseConfigured } from "@/lib/shiftbase";

export const metadata: Metadata = {
  title: "Integraties | Intern dashboard",
  description:
    "Status en snelle acties voor Supabase, WhatsApp, Gmail en overige koppelingen.",
};

function statusLabel(active: boolean, prepared: boolean): string {
  if (active) return "Actief";
  if (prepared) return "Voorbereid";
  return "Ontbreekt";
}

export default async function InternIntegratiesPage() {
  const whatsapp = getWhatsAppConfigStatus();
  const gmail = getGmailConfigStatus();
  const stats = await getDashboardStats();
  const supabaseConfigured = isSupabaseConfigured();
  const resendActive = Boolean(process.env.RESEND_API_KEY);
  const moneybirdPrepared = isMoneybirdConfigured();
  const shiftbasePrepared = isShiftbaseConfigured();

  const rows = [
    {
      name: "Supabase Auth",
      status: statusLabel(supabaseConfigured, false),
      note: "Login + requireRole actief",
    },
    {
      name: "Supabase Database",
      status: statusLabel(stats.tablesReady, supabaseConfigured),
      note: stats.tablesReady
        ? "MVP-tabellen bereikbaar"
        : "SQL uit docs/internal-dashboard-database.md nog draaien",
    },
    {
      name: "Resend",
      status: statusLabel(resendActive, true),
      note: resendActive
        ? "API key aanwezig (contact)"
        : "Voorbereid — key ontbreekt",
    },
    {
      name: "Contactformulieren",
      status: "Actief",
      note: "/api/contact route aanwezig",
    },
    {
      name: "Shiftbase",
      status: statusLabel(false, true),
      note: shiftbasePrepared
        ? "Env aanwezig — sync nog niet gekoppeld aan MVP"
        : "Voorbereid — nog niet gekoppeld",
    },
    {
      name: "Moneybird",
      status: statusLabel(false, true),
      note: moneybirdPrepared
        ? "Env aanwezig — geen auto-send in MVP"
        : "Voorbereid — nog niet gekoppeld",
    },
    {
      name: "WhatsApp Business",
      status: statusLabel(whatsapp.configured, true),
      note: whatsapp.configured
        ? "API voorbereid + wa.me fallback"
        : "Voorbereid — wa.me fallback",
    },
    {
      name: "Gmail",
      status: statusLabel(gmail.configured, true),
      note: gmail.configured
        ? "API voorbereid + mailto fallback"
        : "Voorbereid — mailto fallback",
    },
  ];

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Integraties"
        description="Eerlijke status: Actief / Voorbereid / Ontbreekt. Geen secrets in de UI."
      />

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Integratie</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Toelichting</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                  {row.name}
                </td>
                <td className="px-3 py-2">
                  <MvpBadge
                    tone={
                      row.status === "Actief"
                        ? "ok"
                        : row.status === "Voorbereid"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {row.status}
                  </MvpBadge>
                </td>
                <td className="px-3 py-2 text-slate-600">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IntegrationsHubClient
        supabaseConfigured={supabaseConfigured}
        whatsappConfigured={whatsapp.configured}
        whatsappMissing={whatsapp.missing}
        planningWaMeUrl={whatsapp.planningWaMeUrl}
        gmailConfigured={gmail.configured}
        gmailMissing={gmail.missing}
        gmailSender={gmail.sender}
        mailboxes={gmail.mailboxes}
        whatsappTemplates={[...WHATSAPP_MESSAGE_TEMPLATES]}
      />
    </div>
  );
}
