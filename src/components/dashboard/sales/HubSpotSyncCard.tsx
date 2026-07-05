"use client";

import { useState } from "react";
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

type SyncStatus = "unknown" | "connected" | "error" | "syncing";

type HubSpotSyncCardProps = {
  initialConfigured?: boolean;
};

export default function HubSpotSyncCard({
  initialConfigured = true,
}: HubSpotSyncCardProps) {
  const [status, setStatus] = useState<SyncStatus>("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState<"test" | "sync-all" | null>(null);

  async function handleTestConnection() {
    setLoading("test");
    setMessage(null);

    try {
      const response = await fetch("/api/hubspot/test");
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "HubSpot connectie mislukt");
        return;
      }

      setStatus("connected");
      setMessage(data.message ?? "HubSpot connectie succesvol");
    } catch {
      setStatus("error");
      setMessage("Kon HubSpot niet bereiken. Controleer je netwerk.");
    } finally {
      setLoading(null);
    }
  }

  async function handleSyncAll() {
    setLoading("sync-all");
    setMessage(null);
    setStatus("syncing");

    try {
      const response = await fetch("/api/hubspot/sync-all", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Synchronisatie mislukt");
        return;
      }

      setStatus("connected");
      setLastSync(new Date().toLocaleString("nl-NL"));
      setMessage(
        `${data.synced} leads gesynchroniseerd${data.failed > 0 ? `, ${data.failed} mislukt` : ""}`,
      );
    } catch {
      setStatus("error");
      setMessage("Bulk synchronisatie mislukt");
    } finally {
      setLoading(null);
    }
  }

  const statusBadge = (() => {
    switch (status) {
      case "connected":
        return (
          <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
            Verbonden
          </Badge>
        );
      case "error":
        return (
          <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
            Fout
          </Badge>
        );
      case "syncing":
        return (
          <Badge className="border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a] hover:bg-[#F28C28]/10">
            Bezig
          </Badge>
        );
      default:
        return (
          <Badge className="border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100">
            Onbekend
          </Badge>
        );
    }
  })();

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
              {status === "connected" ? (
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              ) : status === "error" ? (
                <Unplug className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Wifi className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0B1F4D]">
                {initialConfigured
                  ? "Token geconfigureerd (server-side)"
                  : "Token niet gevonden in omgeving"}
              </p>
              <p className="text-xs text-[#101828]/60">
                {lastSync
                  ? `Laatste sync: ${lastSync}`
                  : "Nog geen synchronisatie uitgevoerd"}
              </p>
            </div>
          </div>
        </div>

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
