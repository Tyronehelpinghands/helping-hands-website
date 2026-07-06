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

export default function ShiftbaseSyncPanel() {
  const [state, setState] = useState<SyncState>("unknown");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setMessage("Niet ingelogd of geen toegang.");
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

  const badge = (() => {
    switch (state) {
      case "ready":
        return (
          <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
            Koppeling voorbereid
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
              Crewleden, planning, beschikbaarheid en uren kunnen later met Shiftbase
              worden gesynchroniseerd.
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
            disabled={loading}
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
          <Button type="button" size="sm" disabled className="opacity-60">
            <RefreshCw className="h-4 w-4" />
            Medewerkers synchroniseren — Binnenkort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
