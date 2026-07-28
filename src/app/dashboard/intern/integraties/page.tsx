import type { Metadata } from "next";
import IntegrationsHubClient from "@/components/dashboard/integraties/IntegrationsHubClient";
import { getGmailConfigStatus } from "@/lib/integrations/gmail";
import {
  getWhatsAppConfigStatus,
  WHATSAPP_MESSAGE_TEMPLATES,
} from "@/lib/integrations/whatsapp";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Integraties | Intern dashboard",
  description:
    "Status en snelle acties voor Supabase, WhatsApp, Gmail en overige koppelingen.",
};

export default function InternIntegratiesPage() {
  const whatsapp = getWhatsAppConfigStatus();
  const gmail = getGmailConfigStatus();

  return (
    <IntegrationsHubClient
      supabaseConfigured={isSupabaseConfigured()}
      whatsappConfigured={whatsapp.configured}
      whatsappMissing={whatsapp.missing}
      planningWaMeUrl={whatsapp.planningWaMeUrl}
      gmailConfigured={gmail.configured}
      gmailMissing={gmail.missing}
      gmailSender={gmail.sender}
      mailboxes={gmail.mailboxes}
      whatsappTemplates={[...WHATSAPP_MESSAGE_TEMPLATES]}
    />
  );
}
