"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCw,
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

export type GmailFlash = {
  status: string;
  message?: string;
  needsEnv?: boolean;
  pendingRefreshToken?: string | null;
};

export type IntegrationHubProps = {
  supabaseConfigured: boolean;
  whatsappConfigured: boolean;
  whatsappMissing: string[];
  planningWaMeUrl: string;
  gmailConfigured: boolean;
  gmailMissing: string[];
  gmailSender?: string;
  gmailCanConnect?: boolean;
  shiftbaseConfigured?: boolean;
  /** When false, Shiftbase sync is explicitly disabled (SHIFTBASE_ENABLED=false). */
  shiftbaseEnabled?: boolean;
  moneybirdConfigured?: boolean;
  moneybirdInvoiceReady?: boolean;
  mailboxes: SharedMailbox[];
  whatsappTemplates: Array<{ id: string; label: string; body: string }>;
  gmailFlash?: GmailFlash | null;
};

function configBadge(
  configured: boolean,
  whenReady: IntegrationStatusType = "Voorbereid",
): IntegrationStatusType {
  return configured ? whenReady : "Niet gekoppeld";
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
  gmailCanConnect = false,
  shiftbaseConfigured = false,
  shiftbaseEnabled = true,
  moneybirdConfigured = false,
  moneybirdInvoiceReady = false,
  mailboxes,
  whatsappTemplates,
  gmailFlash = null,
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
  const [tokenCopied, setTokenCopied] = useState(false);
  const [hideToken, setHideToken] = useState(false);
  const [liveChecks, setLiveChecks] = useState<
    Record<string, { loading: boolean; ok: boolean | null; message: string | null }>
  >({});
  const [shiftbaseSyncing, setShiftbaseSyncing] = useState(false);
  const [shiftbaseSyncMessage, setShiftbaseSyncMessage] = useState<string | null>(
    null,
  );
  const [shiftbaseSyncOk, setShiftbaseSyncOk] = useState<boolean | null>(null);

  const pendingToken =
    !hideToken && gmailFlash?.pendingRefreshToken
      ? gmailFlash.pendingRefreshToken
      : null;

  async function syncShiftbaseEmployees() {
    setShiftbaseSyncing(true);
    setShiftbaseSyncMessage(null);
    setShiftbaseSyncOk(null);
    try {
      const res = await fetch("/api/shiftbase/sync-employees", {
        method: "POST",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        statusCode?: number | null;
        endpointUsed?: string;
        imported?: number;
        updated?: number;
        skipped?: number;
      };
      if (!res.ok || data.ok === false) {
        setShiftbaseSyncOk(false);
        const statusPart =
          data.statusCode != null ? `HTTP ${data.statusCode}` : `HTTP ${res.status}`;
        const endpointPart = data.endpointUsed
          ? ` · endpoint ${data.endpointUsed}`
          : "";
        const cause =
          data.error || data.message || "Medewerkers synchroniseren mislukt.";
        setShiftbaseSyncMessage(
          `${statusPart}${endpointPart}. ${cause} Actie: Controleer Public API token, App Center Plus en endpoint.`,
        );
        return;
      }
      setShiftbaseSyncOk(true);
      setShiftbaseSyncMessage(
        data.message || "Medewerkers gesynchroniseerd.",
      );
    } catch {
      setShiftbaseSyncOk(false);
      setShiftbaseSyncMessage(
        "Netwerkfout tijdens synchroniseren. Actie: Controleer Public API token, App Center Plus en endpoint.",
      );
    } finally {
      setShiftbaseSyncing(false);
    }
  }

  async function runLiveCheck(provider: string) {
    setLiveChecks((prev) => ({
      ...prev,
      [provider]: { loading: true, ok: null, message: null },
    }));
    try {
      const res = await fetch(
        `/api/integrations/health?provider=${encodeURIComponent(provider)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as {
        result?: { ok: boolean; message: string };
        error?: string;
      };
      if (!res.ok || !data.result) {
        setLiveChecks((prev) => ({
          ...prev,
          [provider]: {
            loading: false,
            ok: false,
            message: data.error ?? `Test mislukt (${res.status})`,
          },
        }));
        return;
      }
      setLiveChecks((prev) => ({
        ...prev,
        [provider]: {
          loading: false,
          ok: data.result!.ok,
          message: data.result!.message,
        },
      }));
    } catch {
      setLiveChecks((prev) => ({
        ...prev,
        [provider]: {
          loading: false,
          ok: false,
          message: "Netwerkfout tijdens test",
        },
      }));
    }
  }

  function LiveTestButton({ provider }: { provider: string }) {
    const state = liveChecks[provider];
    return (
      <div className="space-y-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={state?.loading}
          onClick={() => runLiveCheck(provider)}
        >
          {state?.loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Test API
        </Button>
        {state?.message ? (
          <p
            className={cn(
              "text-[11px] leading-snug",
              state.ok ? "text-green-700" : "text-red-700",
            )}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    );
  }

  async function copyRefreshToken() {
    if (!pendingToken) return;
    try {
      await navigator.clipboard.writeText(pendingToken);
      setTokenCopied(true);
    } catch {
      setTokenCopied(false);
    }
  }

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
      {gmailFlash?.status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          Gmail-koppeling mislukt
          {gmailFlash.message ? `: ${gmailFlash.message}` : "."}
        </div>
      )}

      {gmailFlash?.status === "connected" && !pendingToken && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900"
        >
          Gmail OAuth gelukt.
          {gmailConfigured
            ? " API is klaar voor verzenden."
            : " Zet ontbrekende env-vars in Vercel indien nodig."}
        </div>
      )}

      {pendingToken && (
        <div
          role="status"
          className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">
            Zet <code className="rounded bg-amber-100 px-1">GOOGLE_REFRESH_TOKEN</code>{" "}
            in Vercel
          </p>
          <p className="text-xs text-amber-900/80">
            Dit token wordt één keer getoond (alleen voor ingelogde interne
            gebruikers). Kopieer het naar Vercel env en redeploy. Deel het niet.
          </p>
          <pre className="max-h-24 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white/80 p-3 text-xs">
            {pendingToken}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={copyRefreshToken}
            >
              <Copy className="h-3.5 w-3.5" />
              {tokenCopied ? "Gekopieerd" : "Kopieer token"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setHideToken(true)}
            >
              Verberg
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            <LiveTestButton provider="supabase_auth" />
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
              wa.me direct · Cloud API optioneel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Planning: {siteConfig.phoneDisplay}.{" "}
              {whatsappConfigured
                ? "Cloud API env aanwezig."
                : `Ontbreekt: ${whatsappMissing.join(", ") || "token + phone id"}.`}
            </p>
            <div className="flex flex-wrap items-start gap-2">
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
              <LiveTestButton provider="whatsapp" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Gmail
              </CardTitle>
              <SettingsStatusBadge
                status={configBadge(gmailConfigured, "Actief")}
              />
            </div>
            <CardDescription>
              mailto direct · Gmail API bij OAuth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Afzender: {gmailSender ?? siteConfig.planningEmail}.{" "}
              {gmailConfigured
                ? "OAuth env aanwezig."
                : `Ontbreekt: ${gmailMissing.join(", ") || "OAuth vars"}.`}
            </p>
            {!gmailConfigured &&
              gmailCanConnect &&
              gmailMissing.includes("GOOGLE_REFRESH_TOKEN") && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-950">
                  Client ID/secret staan al. Klik <strong>Gmail koppelen</strong>,
                  log in met het Google-account van je mailbox, en zet daarna het
                  getoonde token in Vercel als{" "}
                  <code className="rounded bg-amber-100 px-1">GOOGLE_REFRESH_TOKEN</code>{" "}
                  (of laat opslaan in company_settings als SQL al gedraaid is).
                </p>
              )}
            <div className="flex flex-wrap items-start gap-2">
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
              {!gmailConfigured && (
                <a
                  href="/api/gmail/connect"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-fit gap-1.5",
                  )}
                  title={
                    gmailCanConnect
                      ? "Start Google OAuth"
                      : "Zet eerst GOOGLE_CLIENT_ID en GOOGLE_CLIENT_SECRET in Vercel"
                  }
                >
                  Gmail koppelen
                </a>
              )}
              <LiveTestButton provider="gmail" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Shiftbase
              </CardTitle>
              <SettingsStatusBadge
                status={
                  !shiftbaseEnabled
                    ? "Optioneel — uitgeschakeld"
                    : shiftbaseConfigured
                      ? "Actief"
                      : "Optioneel — beschikbaar"
                }
              />
            </div>
            <CardDescription>
              Helping Hands plant in Supabase; sync naar Shiftbase kan aan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            <p>
              Shifts en medewerkers staan in Supabase. Zolang je operationeel
              Shiftbase gebruikt, kun je medewerkers en shifts syncen wanneer de
              API key staat.
            </p>
            {!shiftbaseEnabled ? (
              <p className="text-slate-500">
                Sync staat uit via{" "}
                <code className="rounded bg-slate-100 px-1">SHIFTBASE_ENABLED=false</code>
                . Verwijder die flag of zet{" "}
                <code className="rounded bg-slate-100 px-1">true</code> om weer
                te syncen (default: aan als API key aanwezig is).
              </p>
            ) : (
              <>
                <p>
                  {shiftbaseConfigured
                    ? "API key aanwezig — auto-sync bij shift aanmaken staat aan. Handmatige sync hieronder."
                    : "Nog geen API key — zet SHIFTBASE_API_KEY (of TOKEN) in Vercel. Zonder key wordt sync stil overgeslagen."}
                </p>
                {shiftbaseSyncMessage ? (
                  <p
                    className={
                      shiftbaseSyncOk === false
                        ? "text-red-700"
                        : "text-green-700"
                    }
                  >
                    {shiftbaseSyncMessage}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-start gap-2">
                  <LiveTestButton provider="shiftbase" />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={!shiftbaseConfigured || shiftbaseSyncing}
                    onClick={() => void syncShiftbaseEmployees()}
                  >
                    {shiftbaseSyncing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Medewerkers synchroniseren
                  </Button>
                  <Link
                    href="/dashboard/intern/crew"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-fit",
                    )}
                  >
                    Naar Crew
                  </Link>
                  <Link
                    href="/dashboard/intern/planning"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-fit",
                    )}
                  >
                    Naar Planning
                  </Link>
                  <Link
                    href="/dashboard/intern/urenregistratie"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-fit",
                    )}
                  >
                    Uren → Shiftbase
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Moneybird
              </CardTitle>
              <SettingsStatusBadge
                status={
                  moneybirdInvoiceReady
                    ? "Actief"
                    : configBadge(moneybirdConfigured)
                }
              />
            </div>
            <CardDescription>
              Facturatie API — concepten naar Moneybird; verzenden alleen via Bevestig factuur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-[#101828]/65">
            {moneybirdInvoiceReady ? (
              <p>
                Klaar voor facturen (token + tax/ledger via env of automatisch).
                Test API, maak concepten in Facturatie → Moneybird.
              </p>
            ) : moneybirdConfigured ? (
              <p>
                Token OK (contacts). BTW-tarief/omzetrekening kon niet
                automatisch worden bepaald — zet optioneel{" "}
                <code>MONEYBIRD_DEFAULT_TAX_RATE_ID</code> /{" "}
                <code>MONEYBIRD_DEFAULT_LEDGER_ACCOUNT_ID</code>. Zie
                docs/moneybird-integration.md.
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="font-semibold text-[#0B1F4D]">
                  Niet gekoppeld — zo koppel je Moneybird:
                </p>
                <ol className="list-decimal space-y-1 pl-4">
                  <li>
                    Moneybird → Personal Access Token (sales_invoices +
                    contacts)
                  </li>
                  <li>
                    Vercel env: <code>MONEYBIRD_ACCESS_TOKEN</code> (of{" "}
                    <code>MONEYBIRD_API_TOKEN</code>) +{" "}
                    <code>MONEYBIRD_ADMINISTRATION_ID</code>
                  </li>
                  <li>
                    Optioneel: tax/ledger IDs; anders auto uit Moneybird
                  </li>
                  <li>Redeploy → Test API</li>
                </ol>
              </div>
            )}
            <div className="flex flex-wrap items-start gap-2">
              <LiveTestButton provider="moneybird" />
              <Link
                href="/dashboard/intern/facturatie"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-fit",
                )}
              >
                Naar facturatie
              </Link>
            </div>
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
              Open wa.me direct. Cloud API-verzending alleen als WhatsApp
              Business Cloud is geconfigureerd.
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
              Gedeelde mailboxen uit siteConfig · Gmail API of mailto.
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
