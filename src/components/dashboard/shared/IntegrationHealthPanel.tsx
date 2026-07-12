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
import type { IntegrationStatusType } from "@/lib/settings";

export type IntegrationDefinition = {
  id: string;
  name: string;
  description: string;
  checkUrl?: string;
  checkable: boolean;
};

export const SHARED_INTEGRATION_DEFINITIONS: IntegrationDefinition[] = [
  {
    id: "shiftbase",
    name: "Shiftbase",
    description: "Planning, beschikbaarheid, urenregistratie en medewerkers.",
    checkUrl: "/api/shiftbase",
    checkable: true,
  },
  {
    id: "moneybird",
    name: "Moneybird",
    description: "Facturatie, contacten, betaalstatussen en boekhouding.",
    checkUrl: "/api/moneybird/status",
    checkable: true,
  },
  {
    id: "google-maps",
    name: "Google Maps",
    description: "Kilometerberekening en reiskosten.",
    checkUrl: "/api/kilometers/status",
    checkable: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Leads, sales en klantopvolging.",
    checkUrl: "/api/hubspot/test",
    checkable: true,
  },
  {
    id: "gmail",
    name: "Gmail / Google Workspace",
    description: "E-mail, aanmeldingen en communicatie.",
    checkable: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Crewberichten, oproepen en briefings.",
    checkable: false,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Database, auth en realtime data.",
    checkable: false,
  },
];

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

type IntegrationHealthPanelProps = {
  title?: string;
  description?: string;
  compact?: boolean;
  autoCheck?: boolean;
};

export default function IntegrationHealthPanel({
  title = "Integratiestatus",
  description = "Veilige statuschecks via server-side API routes. Geen tokens in frontend.",
  compact = false,
  autoCheck = false,
}: IntegrationHealthPanelProps) {
  const [states, setStates] = useState<Record<string, IntegrationState>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);

  const initStates = useCallback(() => {
    const initial: Record<string, IntegrationState> = {};
    for (const def of SHARED_INTEGRATION_DEFINITIONS) {
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
              message: "Nog niet gebouwd",
            },
          }));
          return;
        }
        const data = (await res.json()) as { ok?: boolean; message?: string };
        setStates((prev) => ({
          ...prev,
          [id]: {
            status: data.ok ? "Actief" : "Voorbereid",
            message: data.message ?? "Koppeling voorbereid",
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

      let message = data.message ?? data.error;
      if (data.configured === false) {
        message = "Niet geconfigureerd";
      } else if (data.ok === true) {
        message = "Koppeling voorbereid";
      }

      setStates((prev) => ({
        ...prev,
        [id]: {
          status: mapApiToStatus(data.ok, data.configured),
          message,
        },
      }));
    } catch {
      setStates((prev) => ({
        ...prev,
        [id]: { status: "Fout", message: "Statuscontrole mislukt" },
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function checkAll() {
    setCheckingAll(true);
    const checkable = SHARED_INTEGRATION_DEFINITIONS.filter(
      (d) => d.checkable && d.checkUrl,
    );
    for (const def of checkable) {
      await checkIntegration(def.id, def.checkUrl);
    }
    setCheckingAll(false);
  }

  useEffect(() => {
    if (autoCheck) {
      void checkAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheck]);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className={compact ? "pb-2" : undefined}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              {title}
            </CardTitle>
            {!compact && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={checkAll}
            disabled={checkingAll}
          >
            {checkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Alles controleren
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={
            compact
              ? "grid gap-2 sm:grid-cols-2"
              : "grid gap-3 md:grid-cols-2"
          }
        >
          {SHARED_INTEGRATION_DEFINITIONS.map((def) => {
            const state = states[def.id];
            const status =
              state?.status ?? (def.checkable ? "Voorbereid" : "Binnenkort");

            return (
              <div
                key={def.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#0B1F4D]">
                      {def.name}
                    </p>
                    {!compact && (
                      <p className="text-xs text-[#101828]/55">
                        {def.description}
                      </p>
                    )}
                  </div>
                  <SettingsStatusBadge status={status} />
                </div>
                {state?.message && (
                  <p className="text-xs text-[#101828]/60">{state.message}</p>
                )}
                {def.checkable && def.checkUrl ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="w-fit text-[#173A8A]"
                    onClick={() => checkIntegration(def.id, def.checkUrl)}
                    disabled={loadingId === def.id}
                  >
                    {loadingId === def.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Controleren
                  </Button>
                ) : (
                  <span className="text-xs text-[#101828]/45">Binnenkort</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
