"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsStatusBadge from "@/components/dashboard/instellingen/SettingsStatusBadge";
import type { IntegrationStatusType } from "@/lib/settings";

export default function EmployeeShiftbasePanel() {
  const [status, setStatus] = useState<IntegrationStatusType>("Voorbereid");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch("/api/shiftbase");
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (data.ok) {
        setStatus("Actief");
        setMessage(data.message ?? "Shiftbase koppeling actief.");
      } else {
        setStatus("Fout");
        setMessage(data.error ?? "Shiftbase niet bereikbaar.");
      }
    } catch {
      setStatus("Fout");
      setMessage("Statuscontrole mislukt.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void checkStatus();
  }, []);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Shiftbase koppeling</CardTitle>
          <CardDescription>
            Beschikbaarheid kan later automatisch met Shiftbase worden gesynchroniseerd.
          </CardDescription>
        </div>
        <SettingsStatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-3">
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        <Button type="button" variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Status vernieuwen
        </Button>
      </CardContent>
    </Card>
  );
}
