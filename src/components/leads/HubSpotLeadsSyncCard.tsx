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
import { sanitizeHubSpotUiMessage } from "@/lib/leads-utils";

type HubSpotStatus = "untested" | "active" | "error" | "no_token";

type HubSpotLeadsSyncCardProps = {
  initialConfigured?: boolean;
  selectedCount?: number;
  onSyncSelected?: () => void;
  onSyncNew?: () => void;
  syncing?: boolean;
};

export default function HubSpotLeadsSyncCard({
  initialConfigured = true,
  selectedCount = 0,
  onSyncSelected,
  onSyncNew,
  syncing = false,
}: HubSpotLeadsSyncCardProps) {
  const [status, setStatus] = useState<HubSpotStatus>(
    initialConfigured ? "untested" : "no_token",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [lastTest, setLastTest] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncedCount, setSyncedCount] = useState(0);
  const [loading, setLoading] = useState<"test" | null>(null);

  useEffect(() => {
    function handleSyncResult(event: Event) {
      const detail = (event as CustomEvent<{
        ok: boolean;
        message?: string;
        synced?: number;
      }>).detail;

      if (detail.ok) {
        setStatus("active");
        setLastSync(new Date().toLocaleString("nl-NL"));
        setSyncedCount((c) => c + (detail.synced ?? 0));
        setMessage(detail.message ?? "Synchronisatie voltooid.");
      } else {
        setStatus("error");
        setMessage(
          detail.message ?? "HubSpot koppeling mislukt. Controleer token of scopes.",
        );
      }
    }

    window.addEventListener("hubspot-leads-sync", handleSyncResult);
    return () => window.removeEventListener("hubspot-leads-sync", handleSyncResult);
  }, []);

  async function handleTestConnection() {
    setLoading("test");
    setMessage(null);

    try {
      const response = await fetch("/api/hubspot/test");
      const data = await response.json();
      setLastTest(new Date().toLocaleString("nl-NL"));

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
      case "no_token":
        return (
          <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
            Token ontbreekt
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
              HubSpot koppeling
            </CardTitle>
            <CardDescription>
              Server-side synchronisatie voor leads
            </CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#F5F7FA]/60 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173A8A]/10 text-[#173A8A]">
            {statusIcon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0B1F4D]">
              {initialConfigured
                ? "Token geconfigureerd (server-side)"
                : "HUBSPOT_ACCESS_TOKEN niet gevonden"}
            </p>
            <p className="truncate text-xs text-[#101828]/55">
              {message && status === "error" ? message : "Veilige API-koppeling"}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg border border-slate-100 px-2 py-2">
            <dt className="text-[10px] text-[#101828]/55">Laatste test</dt>
            <dd className="mt-0.5 text-xs font-semibold text-[#0B1F4D]">
              {lastTest ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-100 px-2 py-2">
            <dt className="text-[10px] text-[#101828]/55">Laatste sync</dt>
            <dd className="mt-0.5 text-xs font-semibold text-[#0B1F4D]">
              {lastSync ?? "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-100 px-2 py-2">
            <dt className="text-[10px] text-[#101828]/55">Leads gesynced</dt>
            <dd className="mt-0.5 text-xs font-semibold text-[#173A8A]">
              {syncedCount}
            </dd>
          </div>
        </dl>

        {message && status !== "error" && (
          <div
            className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
            role="status"
          >
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleTestConnection}
            disabled={loading !== null || syncing}
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            {loading === "test" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            Test connectie
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSyncSelected}
            disabled={syncing || selectedCount === 0}
            className="border-[#F28C28]/30 text-[#c96f1a]"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync geselecteerde ({selectedCount})
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSyncNew}
            disabled={syncing}
            className="border-slate-200/80"
          >
            Sync alle nieuwe leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
