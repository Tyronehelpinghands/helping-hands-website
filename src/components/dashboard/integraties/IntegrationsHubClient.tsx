"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsStatusBadge from "@/components/dashboard/instellingen/SettingsStatusBadge";
import type { SharedMailbox } from "@/lib/integrations/gmail";
import type { IntegrationStatusType } from "@/lib/settings";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

export type IntegrationHubProps = {
  supabaseConfigured: boolean;
  whatsappConfigured: boolean;
  whatsappMissing: string[];
  planningWaMeUrl: string;
  gmailConfigured: boolean;
  gmailMissing: string[];
  gmailSender?: string;
  mailboxes: SharedMailbox[];
  whatsappTemplates: Array<{ id: string; label: string; body: string }>;
};

function configBadge(configured: boolean): IntegrationStatusType {
  return configured ? "Voorbereid" : "Niet gekoppeld";
}

function mailto(to: string, subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${to}${qs ? `?${qs}` : ""}`;
}

export default function IntegrationsHubClient({
  supabaseConfigured,
  whatsappConfigured,
  whatsappMissing,
  planningWaMeUrl,
  gmailConfigured,
  gmailMissing,
  gmailSender,
  mailboxes,
  whatsappTemplates,
}: IntegrationHubProps) {
  const [waTo, setWaTo] = useState(siteConfig.phoneTel.replace("+", ""));
  const [waBody, setWaBody] = useState(whatsappTemplates[0]?.body ?? "");
  const [waSending, setWaSending] = useState(false);
  const [waFeedback, setWaFeedback] = useState<string | null>(null);

  const [mailTo, setMailTo] = useState(siteConfig.planningEmail);
  const [mailSubject, setMailSubject] = useState("Helping Hands — bericht");
  const [mailBody, setMailBody] = useState("");
  const [mailSending, setMailSending] = useState(false);
  const [mailFeedback, setMailFeedback] = useState<string | null>(null);

  async function sendWhatsAppApi() {
    setWaSending(true);
    setWaFeedback(null);
    try {
      const res = await fetch("/api/integrations/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: waTo, body: waBody }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setWaFeedback(data.error ?? "Verzenden mislukt");
      } else {
        setWaFeedback(data.message ?? "Verzonden");
      }
    } catch {
      setWaFeedback("Netwerkfout bij WhatsApp-send");
    } finally {
      setWaSending(false);
    }
  }

  async function sendGmailApi() {
    setMailSending(true);
    setMailFeedback(null);
    try {
      const res = await fetch("/api/integrations/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: mailTo,
          subject: mailSubject,
          body: mailBody,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setMailFeedback(data.error ?? "Verzenden mislukt");
      } else {
        setMailFeedback(data.message ?? "Verzonden");
      }
    } catch {
      setMailFeedback("Netwerkfout bij Gmail-send");
    } finally {
      setMailSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Supabase Auth
              </CardTitle>
              <SettingsStatusBadge
                status={supabaseConfigured ? "Actief" : "Niet gekoppeld"}
              />
            </div>
            <CardDescription>
              Login, sessies en rollen voor dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              {supabaseConfigured
                ? "URL + anon key aanwezig. Interne routes via requireRole."
                : "NEXT_PUBLIC_SUPABASE_URL / ANON_KEY ontbreken."}
            </p>
            {supabaseConfigured && (
              <p className="inline-flex items-center gap-1 font-semibold text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Live
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                WhatsApp
              </CardTitle>
              <SettingsStatusBadge status={configBadge(whatsappConfigured)} />
            </div>
            <CardDescription>
              wa.me direct · Cloud API bij env.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Planning: {siteConfig.phoneDisplay}.{" "}
              {whatsappConfigured
                ? "Cloud API env aanwezig."
                : `Ontbreekt: ${whatsappMissing.join(", ") || "token + phone id"}.`}
            </p>
            <a
              href={planningWaMeUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-fit gap-1.5",
              )}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Open WhatsApp
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Gmail
              </CardTitle>
              <SettingsStatusBadge status={configBadge(gmailConfigured)} />
            </div>
            <CardDescription>
              mailto direct · API bij OAuth env.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Afzender: {gmailSender ?? siteConfig.planningEmail}.{" "}
              {gmailConfigured
                ? "OAuth env aanwezig."
                : `Ontbreekt: ${gmailMissing.join(", ") || "OAuth vars"}.`}
            </p>
            <a
              href={mailto(
                siteConfig.planningEmail,
                "Helping Hands",
                "Hoi,\n\n",
              )}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-fit gap-1.5",
              )}
            >
              <Mail className="h-3.5 w-3.5" />
              Open mailto
            </a>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Shiftbase / Moneybird
              </CardTitle>
              <SettingsStatusBadge status="Binnenkort" />
            </div>
            <CardDescription>
              Planning & facturatie — status elders te controleren.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Geen fake “connected”. Controleer via Instellingen of het
              integratiepanel.
            </p>
            <Link
              href="/dashboard/intern/instellingen"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "w-fit",
              )}
            >
              Naar instellingen
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              WhatsApp — snelle acties
            </CardTitle>
            <CardDescription>
              Templates openen wa.me. API-send alleen als Cloud API geconfigureerd
              is.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {whatsappTemplates.map((tpl) => (
                <Button
                  key={tpl.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setWaBody(tpl.body)}
                >
                  {tpl.label}
                </Button>
              ))}
            </div>
            <label className="block space-y-1 text-sm">
              <span className="font-semibold text-[#0B1F4D]">
                Naar (telefoon)
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm"
                value={waTo}
                onChange={(e) => setWaTo(e.target.value)}
                placeholder="31657416338"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-semibold text-[#0B1F4D]">Bericht</span>
              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm"
                value={waBody}
                onChange={(e) => setWaBody(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${waTo.replace(/\D/g, "")}?text=${encodeURIComponent(waBody)}`}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <MessageCircle className="h-4 w-4" />
                Open in WhatsApp
              </a>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!whatsappConfigured || waSending}
                onClick={sendWhatsAppApi}
                title={
                  whatsappConfigured
                    ? "Verstuur via Cloud API"
                    : "Cloud API niet geconfigureerd"
                }
              >
                {waSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                API verzenden
              </Button>
            </div>
            {waFeedback && (
              <p className="text-xs text-[#101828]/70">{waFeedback}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Gmail — mailboxen & verzenden
            </CardTitle>
            <CardDescription>
              Gedeelde adressen uit siteConfig. Geen nep-inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {mailboxes.map((box) => (
                <li
                  key={box.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F4D]">
                      {box.email}
                    </p>
                    <p className="text-xs text-[#101828]/55">{box.purpose}</p>
                  </div>
                  <a
                    href={mailto(box.email)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                  >
                    mailto
                  </a>
                </li>
              ))}
            </ul>

            <label className="block space-y-1 text-sm">
              <span className="font-semibold text-[#0B1F4D]">Naar</span>
              <input
                className="w-full rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm"
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-semibold text-[#0B1F4D]">Onderwerp</span>
              <input
                className="w-full rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm"
                value={mailSubject}
                onChange={(e) => setMailSubject(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-semibold text-[#0B1F4D]">Bericht</span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm"
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <a
                href={mailto(mailTo, mailSubject, mailBody)}
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <Mail className="h-4 w-4" />
                Open mailto
              </a>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!gmailConfigured || mailSending}
                onClick={sendGmailApi}
                title={
                  gmailConfigured
                    ? "Verstuur via Gmail API"
                    : "Gmail API niet geconfigureerd"
                }
              >
                {mailSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                API verzenden
              </Button>
            </div>
            {mailFeedback && (
              <p className="text-xs text-[#101828]/70">{mailFeedback}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-[#101828]/50">
        Documentatie:{" "}
        <code className="rounded bg-slate-100 px-1">
          docs/whatsapp-integration.md
        </code>{" "}
        ·{" "}
        <code className="rounded bg-slate-100 px-1">
          docs/gmail-integration.md
        </code>
      </p>
    </div>
  );
}
