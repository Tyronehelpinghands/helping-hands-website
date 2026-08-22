"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send } from "lucide-react";
import { MvpPageHeader, MvpToast, useToast } from "@/components/dashboard/mvp/MvpShared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsStatusBadge from "@/components/dashboard/instellingen/SettingsStatusBadge";
import { DASHBOARD_ROUTES } from "@/lib/dashboardNavigation";
import type { IntegrationStatusType } from "@/lib/settings";
import { cn } from "@/lib/utils";

type StatusPayload = {
  ok?: boolean;
  configured?: boolean;
  reachable?: boolean;
  status?: IntegrationStatusType | "Ontbreekt";
  message?: string;
  gatewayHost?: string;
};

type SentJob = {
  id: string;
  text: string;
  runId?: string;
  error?: string;
  at: string;
};

function badgeFromStatus(status: StatusPayload): IntegrationStatusType {
  if (status.status === "Actief") return "Actief";
  if (status.status === "Voorbereid") return "Voorbereid";
  if (status.status === "Fout") return "Fout";
  return "Niet gekoppeld";
}

export default function OpenClawAssistantClient() {
  const { toast, showToast } = useToast();
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [jobs, setJobs] = useState<SentJob[]>([]);

  async function refreshStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/integrations/openclaw/status", {
        cache: "no-store",
      });
      const data = (await res.json()) as StatusPayload;
      setStatus(data);
    } catch {
      setStatus({
        ok: false,
        message: "Status ophalen mislukt.",
      });
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
  }, []);

  async function send() {
    const text = message.trim();
    if (!text) {
      showToast("Typ eerst een opdracht.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/integrations/openclaw/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        runId?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        const error = data.error ?? "Verzenden mislukt.";
        setJobs((prev) => [
          {
            id: crypto.randomUUID(),
            text,
            error,
            at: new Date().toLocaleTimeString("nl-NL"),
          },
          ...prev,
        ]);
        showToast(error);
        return;
      }
      setJobs((prev) => [
        {
          id: data.runId ?? crypto.randomUUID(),
          text,
          runId: data.runId,
          at: new Date().toLocaleTimeString("nl-NL"),
        },
        ...prev,
      ]);
      setMessage("");
      showToast(
        "OpenClaw is aan het werk. Het antwoord komt in OpenClaw (Control UI / VS Code), niet als live chat hier.",
      );
    } catch {
      showToast("Netwerkfout naar OpenClaw.");
    } finally {
      setSending(false);
    }
  }

  const canSend = Boolean(status?.ok) && !sending;

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="OpenClaw"
        description="Stuur opdrachten naar de Helping Hands-agent. Cursor en OpenClaw werken naast elkaar; definitieve acties blijven bij Tyrone."
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refreshStatus()}
            disabled={loadingStatus}
          >
            {loadingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Vernieuw status"
            )}
          </Button>
        }
      />

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#173A8A]" />
              <CardTitle className="text-base font-black text-[#0B1F4D]">
                Gateway
              </CardTitle>
            </div>
            <SettingsStatusBadge
              status={status ? badgeFromStatus(status) : "Voorbereid"}
            />
          </div>
          <CardDescription>
            {status?.gatewayHost
              ? `Host: ${status.gatewayHost}`
              : "Host onbekend tot de statuscheck klaar is."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[#101828]/70">
          <p>{status?.message ?? "Status wordt geladen…"}</p>
          <p>
            Koppeling in Cursor: Settings → Tools & MCP → OpenClaw. Uitleg:{" "}
            <Link
              href={DASHBOARD_ROUTES.integraties}
              className="font-semibold text-[#173A8A] hover:underline"
            >
              Integraties
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Opdracht sturen
          </CardTitle>
          <CardDescription>
            Bijvoorbeeld: “Vat de nieuwe website-aanvragen van vandaag samen”
            of “Maak een checklist voor crew-briefing festival X”.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            maxLength={4000}
            placeholder="Wat moet OpenClaw doen?"
            className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#101828]/50">{message.length}/4000</p>
            <Button
              type="button"
              onClick={() => void send()}
              disabled={!canSend}
              className="gap-1.5"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Stuur naar OpenClaw
            </Button>
          </div>
          {!status?.ok ? (
            <p className="text-xs text-amber-800">
              Verzenden kan pas als de Gateway draait en OPENCLAW_HOOKS_TOKEN
              klopt.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {jobs.length > 0 ? (
        <Card className="border-slate-200/80 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-black text-[#0B1F4D]">
              Verzonden deze sessie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm",
                  job.error
                    ? "border-red-200 bg-red-50"
                    : "border-slate-100 bg-[#F5F7FA]",
                )}
              >
                <p className="font-semibold text-[#0B1F4D]">{job.text}</p>
                <p className="mt-1 text-xs text-[#101828]/55">
                  {job.at}
                  {job.runId ? ` · run ${job.runId.slice(0, 8)}…` : ""}
                  {job.error ? ` · ${job.error}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <MvpToast message={toast} />
    </div>
  );
}
