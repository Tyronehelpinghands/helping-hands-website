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
import { EMPLOYEE_INTEGRATIONS } from "@/lib/employeePortal";

type IntegrationState = {
  status: IntegrationStatusType;
  message?: string;
};

export default function EmployeeIntegrationStatus() {
  const [states, setStates] = useState<Record<string, IntegrationState>>({});
  const [loading, setLoading] = useState(false);

  async function checkAll() {
    setLoading(true);
    const next: Record<string, IntegrationState> = {};

    for (const item of EMPLOYEE_INTEGRATIONS) {
      if (!item.checkUrl) {
        next[item.id] = { status: "Niet gekoppeld", message: "Later beschikbaar" };
        continue;
      }
      try {
        const res = await fetch(item.checkUrl);
        const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
        next[item.id] = data.ok
          ? { status: "Actief", message: data.message }
          : { status: "Fout", message: data.error ?? "Niet bereikbaar" };
      } catch {
        next[item.id] = { status: "Fout", message: "Statuscontrole mislukt" };
      }
    }

    setStates(next);
    setLoading(false);
  }

  useEffect(() => {
    void checkAll();
  }, []);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Integratiestatus</CardTitle>
          <CardDescription>Veilige server-side checks — geen tokens in frontend.</CardDescription>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={checkAll} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {EMPLOYEE_INTEGRATIONS.map((item) => {
          const state = states[item.id];
          const status: IntegrationStatusType =
            state?.status ?? (item.checkUrl ? "Voorbereid" : "Niet gekoppeld");
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0B1F4D]">{item.name}</p>
                {state?.message ? (
                  <p className="truncate text-xs text-slate-500">{state.message}</p>
                ) : null}
              </div>
              <SettingsStatusBadge status={status} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
