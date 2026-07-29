"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SyncState = "unknown" | "not_linked" | "ready" | "error";

type SyncEmployeesResponse = {
  ok?: boolean;
  imported?: number;
  updated?: number;
  skipped?: number;
  errors?: string[];
  message?: string;
  error?: string;
};

export default function ShiftbaseSyncPanel({
  onSynced,
}: {
  onSynced?: () => void;
}) {
  const [state, setState] = useState<SyncState>("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    void checkConnection();
  }, []);

  async function checkConnection() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/shiftbase/config-status");
      const data = await res.json();

      if (!res.ok) {
        setState("not_linked");
        setMessage(
          typeof data.error === "string"
            ? data.error
            : "Niet ingelogd of geen toegang.",
        );
        return;
      }

      if (data.configured) {
        const testRes = await fetch("/api/shiftbase/test");
        const testData = await testRes.json();
        if (testRes.ok && testData.ok) {
          setState("ready");
          setMessage("Shiftbase koppeling actief.");
        } else {
          setState("error");
          setMessage(
            typeof testData.error === "string"
              ? testData.error.slice(0, 120)
              : "Koppeling geconfigureerd maar API-test mislukt.",
          );
        }
      } else {
        setState("not_linked");
        setMessage("SHIFTBASE_API_TOKEN ontbreekt op de server.");
      }
    } catch {
      setState("not_linked");
      setMessage("Koppeling controleren mislukt.");
    } finally {
      setLoading(false);
    }
  }

  async function syncEmployees() {
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/shiftbase/sync-employees", {
        method: "POST",
      });
      const data = (await res.json()) as SyncEmployeesResponse;
      if (!res.ok || data.ok === false) {
        setState("error");
        setMessage(
          data.error ||
            data.message ||
            "Medewerkers synchroniseren mislukt.",
        );
        return;
      }
      setState("ready");
      setMessage(data.message || "Medewerkers gesynchroniseerd.");
      onSynced?.();
    } catch {
      setState("error");
      setMessage("Netwerkfout tijdens synchroniseren.");
    } finally {
      setSyncing(false);
    }
  }

  const badge = (() => {
    switch (state) {
      case "ready":
        return (
          <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
            Koppeling actief
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
            Niet gekoppeld
          </Badge>
        );
    }
  })();

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Shiftbase koppeling
            </CardTitle>
            <CardDescription>
              Importeer medewerkers uit Shiftbase naar het interne crew-overzicht.
              Bestaande lokale crew wordt niet verwijderd.
            </CardDescription>
          </div>
          {badge}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {message && (
          <p className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2 text-xs text-[#101828]/70">
            {message}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void checkConnection()}
            disabled={loading || syncing}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            Koppeling controleren
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            render={
              <a
                href="https://app.shiftbase.com"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            <ExternalLink className="h-4 w-4" />
            Open Shiftbase
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void syncEmployees()}
            disabled={syncing || loading || state === "not_linked"}
            className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Medewerkers synchroniseren
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
