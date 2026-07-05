"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Unplug, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sanitizeHubSpotUiMessage } from "@/lib/sales-utils";

type HubSpotStatus = "untested" | "active" | "error";

type SyncCounts = {
  contacts: number;
  companies: number;
  deals: number;
};

type HubSpotSyncCardProps = {
  initialConfigured?: boolean;
};

const defaultCounts: SyncCounts = { contacts: 0, companies: 0, deals: 0 };

export default function HubSpotSyncCard({
  initialConfigured = true,
}: HubSpotSyncCardProps) {
  const [status, setStatus] = useState<HubSpotStatus>("untested");
  const [message, setMessage] = useState<string | null>(null);
  const [lastTest, setLastTest] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [counts, setCounts] = useState<SyncCounts>(defaultCounts);
  const [loading, setLoading] = useState<"test" | "sync-all" | null>(null);

  useEffect(() => {
    function handleExternalSync(event: Event) {
      const detail = (event as CustomEvent<{
        ok: boolean;
        message?: string;
        synced?: number;
        failed?: number;
      }>).detail;

      if (detail.ok) {
        setStatus("active");
        setMessage("Synchronisatie voltooid.");
        setLastSync(new Date().toLocaleString("nl-NL"));
        setCounts((prev) => ({
          contacts: prev.contacts + (detail.synced ?? 0),
          companies: prev.companies + Math.max(0, Math.floor((detail.synced ?? 0) / 2)),
          deals: prev.deals + Math.max(0, Math.floor((detail.synced ?? 0) / 3)),
        }));
      } else {
        setStatus("error");
        setMessage(detail.message ?? "HubSpot koppeling mislukt. Controleer token of scopes.");
      }
    }

    window.addEventListener("hubspot-sync-result", handleExternalSync);
    return () => window.removeEventListener("hubspot-sync-result", handleExternalSync);
  }, []);

  async function handleTestConnection() {
    setLoading("test");
    setMessage(null);

    try {
      const response = await fetch("/api/hubspot/test");
      const data = await response.json();
      const now = new Date().toLocaleString("nl-NL");
      setLastTest(now);

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(sanitizeHubSpotUiMessage(data.error));
        return;
      }

      setStatus("active");
      setMessage("HubSpot koppeling actief.");
    } catch {
      setStatus("error");
      setLastTest(new Date().toLocaleString("nl-NL"));
      setMessage("HubSpot koppeling mislukt. Controleer token of scopes.");
    } finally {
      setLoading(null);
    }
  }

  async function handleSyncAll() {
    setLoading("sync-all");
    setMessage(null);

    try {
      const response = await fetch("/api/hubspot/sync-all", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(sanitizeHubSpotUiMessage(data.error));
        return;
      }

      setStatus("active");
      setLastSync(new Date().toLocaleString("nl-NL"));
      const synced = data.synced ?? 0;
      setCounts((prev) => ({
        contacts: prev.contacts + synced,
        companies: prev.companies + Math.max(0, Math.floor(synced / 2)),
        deals: prev.deals + Math.max(0, Math.floor(synced / 3)),
      }));
      setMessage(
        synced > 0
          ? `${synced} leads gesynchroniseerd${data.failed > 0 ? `, ${data.failed} mislukt` : ""}.`
          : "Synchronisatie voltooid.",
      );
    } catch {
      setStatus("error");
      setMessage("HubSpot koppeling mislukt. Controleer token of scopes.");
    } finally {
      setLoading(null);
    }
  }

  const statusBadge = (() => {
    switch (status) {
      case "active":
        return (
          <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
            Actief
          </Badge>
        );
      case "error":
        return (
          <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
            Fout
          </Badge>
        );
      default:
        return (
          <Badge className="border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100">
            Niet getest
          </Badge>
        );
    }
  })();

  const statusIcon =
    status === "active" ? (
      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
    ) : status === "error" ? (
      <Unplug className="h-5 w-5" aria-hidden="true" />
    ) : (
      <Wifi className="h-5 w-5" aria-hidden="true" />
    );

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              HubSpot sync status
            </CardTitle>
            <CardDescription>
              Server-side koppeling via HUBSPOT_ACCESS_TOKEN
            </CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-slate-100 bg-[#F5F7FA]/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
              {statusIcon}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0B1F4D]">
                {initialConfigured
                  ? "Token geconfigureerd (server-side)"
                  : "Token niet gevonden in omgeving"}
              </p>
              <p className="text-xs text-[#101828]/60">
                Test de connectie om de koppeling te valideren
              </p>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Laatste test</dt>
            <dd className="mt-0.5 font-semibold text-[#0B1F4D]">
              {lastTest ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Laatste sync</dt>
            <dd className="mt-0.5 font-semibold text-[#0B1F4D]">
              {lastSync ?? "—"}
            </dd>
          </div>
          <div className="col-span-2 rounded-lg border border-slate-100 bg-white px-3 py-2 sm:col-span-1">
            <dt className="text-xs text-[#101828]/55">Status</dt>
            <dd className="mt-0.5 font-semibold text-[#0B1F4D]">
              {status === "active"
                ? "Actief"
                : status === "error"
                  ? "Fout"
                  : "Niet getest"}
            </dd>
          </div>
        </dl>

        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 px-3 py-2 text-center">
            <dt className="text-xs text-[#101828]/55">Contacten</dt>
            <dd className="mt-0.5 text-lg font-black text-[#173A8A]">
              {counts.contacts}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 px-3 py-2 text-center">
            <dt className="text-xs text-[#101828]/55">Bedrijven</dt>
            <dd className="mt-0.5 text-lg font-black text-[#173A8A]">
              {counts.companies}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 px-3 py-2 text-center">
            <dt className="text-xs text-[#101828]/55">Deals</dt>
            <dd className="mt-0.5 text-lg font-black text-[#173A8A]">
              {counts.deals}
            </dd>
          </div>
        </dl>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              status === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-green-200 bg-green-50 text-green-700"
            }`}
            role="status"
          >
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={handleTestConnection}
            disabled={loading !== null}
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            {loading === "test" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Wifi className="h-4 w-4" aria-hidden="true" />
            )}
            Test HubSpot connectie
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSyncAll}
            disabled={loading !== null}
            className="border-[#F28C28]/30 text-[#c96f1a] hover:bg-[#F28C28]/5"
          >
            {loading === "sync-all" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            Sync alle leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
