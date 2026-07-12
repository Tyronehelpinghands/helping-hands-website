"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  INTEGRATION_DEFINITIONS,
  type IntegrationStatusType,
} from "@/lib/settings";

type IntegrationState = {
  status: IntegrationStatusType;
  message?: string;
};

function mapApiToStatus(
  ok: boolean | undefined,
  configured?: boolean,
): IntegrationStatusType {
  if (ok === true) return "Actief";
  if (configured === false) return "Niet gekoppeld";
  if (ok === false) return "Fout";
  return "Voorbereid";
}

export default function IntegrationSettingsPanel() {
  const [states, setStates] = useState<Record<string, IntegrationState>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const initStates = useCallback(() => {
    const initial: Record<string, IntegrationState> = {};
    for (const def of INTEGRATION_DEFINITIONS) {
      initial[def.id] = {
        status: def.checkable ? "Voorbereid" : "Binnenkort",
      };
    }
    setStates(initial);
  }, []);

  useEffect(() => {
    initStates();
  }, [initStates]);

  async function checkIntegration(id: string, url?: string) {
    if (!url) return;
    setLoadingId(id);
    try {
      if (url === "/api/kilometers/status") {
        const res = await fetch(url);
        if (res.status === 404) {
          setStates((prev) => ({
            ...prev,
            [id]: {
              status: "Voorbereid",
              message: "Kilometer endpoint nog niet gebouwd.",
            },
          }));
          return;
        }
        const data = (await res.json()) as { ok?: boolean; message?: string };
        setStates((prev) => ({
          ...prev,
          [id]: {
            status: mapApiToStatus(data.ok),
            message: data.message,
          },
        }));
        return;
      }

      const res = await fetch(url);
      const data = (await res.json()) as {
        ok?: boolean;
        configured?: boolean;
        error?: string;
        message?: string;
      };

      setStates((prev) => ({
        ...prev,
        [id]: {
          status: mapApiToStatus(data.ok, data.configured),
          message: data.message ?? data.error,
        },
      }));
    } catch {
      setStates((prev) => ({
        ...prev,
        [id]: { status: "Fout", message: "Koppeling controleren mislukt." },
      }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#101828]/60">
        Overzicht van externe koppelingen. API-tokens blijven server-side in Vercel.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {INTEGRATION_DEFINITIONS.map((def) => {
          const state = states[def.id];
          const status = state?.status ?? (def.checkable ? "Voorbereid" : "Binnenkort");

          return (
            <Card
              key={def.id}
              className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold text-[#0B1F4D]">
                    {def.name}
                  </CardTitle>
                  <SettingsStatusBadge status={status} />
                </div>
                <CardDescription>{def.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {state?.message && (
                  <p className="text-xs text-[#101828]/60">{state.message}</p>
                )}
                {def.checkable && "checkUrl" in def ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => checkIntegration(def.id, def.checkUrl)}
                    disabled={loadingId === def.id}
                  >
                    {loadingId === def.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Koppeling controleren
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" disabled>
                    Binnenkort
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
