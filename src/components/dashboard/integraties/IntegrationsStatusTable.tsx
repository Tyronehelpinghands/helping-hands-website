"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { MvpBadge } from "@/components/dashboard/mvp/MvpShared";
import { Button } from "@/components/ui/button";
import type {
  IntegrationHealthResult,
  IntegrationProvider,
} from "@/lib/integrations/healthChecks";
import { cn } from "@/lib/utils";

export type IntegrationStatusRow = {
  provider: IntegrationProvider;
  name: string;
  status: string;
  note: string;
};

type IntegrationsStatusTableProps = {
  initialRows: IntegrationStatusRow[];
};

type RowState = IntegrationStatusRow & {
  loading?: boolean;
  lastCheckedAt?: string | null;
};

function toneForStatus(status: string): "ok" | "warn" | "neutral" | "danger" {
  if (status === "Actief") return "ok";
  if (status === "Voorbereid" || status === "Optioneel — beschikbaar") return "warn";
  if (status === "Fout") return "danger";
  if (status === "Optioneel — uitgeschakeld") return "neutral";
  return "neutral";
}

export default function IntegrationsStatusTable({
  initialRows,
}: IntegrationsStatusTableProps) {
  const [rows, setRows] = useState<RowState[]>(
    initialRows.map((row) => ({ ...row, loading: false, lastCheckedAt: null })),
  );
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  function applyResult(result: IntegrationHealthResult) {
    setRows((prev) =>
      prev.map((row) =>
        row.provider === result.provider
          ? {
              ...row,
              status: result.status,
              note: result.message,
              loading: false,
              lastCheckedAt: result.checkedAt,
            }
          : row,
      ),
    );
  }

  async function refreshOne(provider: IntegrationProvider) {
    setGlobalError(null);
    setRows((prev) =>
      prev.map((row) =>
        row.provider === provider ? { ...row, loading: true } : row,
      ),
    );

    try {
      const res = await fetch(
        `/api/integrations/health?provider=${encodeURIComponent(provider)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as {
        ok?: boolean;
        result?: IntegrationHealthResult;
        error?: string;
      };

      if (!res.ok || !data.result) {
        setRows((prev) =>
          prev.map((row) =>
            row.provider === provider
              ? {
                  ...row,
                  loading: false,
                  status: "Fout",
                  note: data.error ?? `Healthcheck mislukt (${res.status}).`,
                  lastCheckedAt: new Date().toISOString(),
                }
              : row,
          ),
        );
        return;
      }

      applyResult(data.result);
    } catch {
      setRows((prev) =>
        prev.map((row) =>
          row.provider === provider
            ? {
                ...row,
                loading: false,
                status: "Fout",
                note: "Netwerkfout tijdens healthcheck.",
                lastCheckedAt: new Date().toISOString(),
              }
            : row,
        ),
      );
    }
  }

  async function refreshAll() {
    setRefreshingAll(true);
    setGlobalError(null);
    setRows((prev) => prev.map((row) => ({ ...row, loading: true })));

    try {
      const res = await fetch("/api/integrations/health?provider=all", {
        cache: "no-store",
      });
      const data = (await res.json()) as {
        results?: IntegrationHealthResult[];
        error?: string;
      };

      if (!res.ok || !data.results) {
        setGlobalError(data.error ?? `Healthcheck mislukt (${res.status}).`);
        setRows((prev) => prev.map((row) => ({ ...row, loading: false })));
        return;
      }

      for (const result of data.results) {
        applyResult(result);
      }
    } catch {
      setGlobalError("Netwerkfout tijdens alle healthchecks.");
      setRows((prev) => prev.map((row) => ({ ...row, loading: false })));
    } finally {
      setRefreshingAll(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          Test elke API apart of alles tegelijk. Geen secrets in de uitslag.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={refreshingAll || rows.some((r) => r.loading)}
          onClick={refreshAll}
        >
          {refreshingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Test alles
        </Button>
      </div>

      {globalError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {globalError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-[#F5F7FA] text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Integratie</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Toelichting</th>
              <th className="px-3 py-2 text-right">Actie</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.provider} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-[#0B1F4D]">
                  {row.name}
                  {row.lastCheckedAt ? (
                    <span className="mt-0.5 block text-[11px] font-normal text-slate-400">
                      Getest{" "}
                      {new Date(row.lastCheckedAt).toLocaleTimeString("nl-NL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <MvpBadge tone={toneForStatus(row.status)}>
                    {row.status}
                  </MvpBadge>
                </td>
                <td className="max-w-md px-3 py-2 text-slate-600">{row.note}</td>
                <td className="px-3 py-2 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className={cn("gap-1.5", row.loading && "opacity-70")}
                    disabled={row.loading || refreshingAll}
                    onClick={() => refreshOne(row.provider)}
                    aria-label={`${row.name} testen`}
                  >
                    {row.loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Test
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
