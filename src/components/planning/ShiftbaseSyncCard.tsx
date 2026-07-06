"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Route, Unplug, Users, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sanitizeShiftbaseUiMessage } from "@/lib/planning-utils";

type ShiftbaseStatus = "untested" | "active" | "error" | "no_token";

type ShiftbaseSyncCardProps = {
  initialConfigured?: boolean;
  onSyncShifts?: () => void;
  onFetchHours?: () => void;
  onFetchAddresses?: () => void;
  syncing?: boolean;
};

export default function ShiftbaseSyncCard({
  initialConfigured = false,
  onSyncShifts,
  onFetchHours,
  onFetchAddresses,
  syncing = false,
}: ShiftbaseSyncCardProps) {
  const [status, setStatus] = useState<ShiftbaseStatus>(
    initialConfigured ? "untested" : "no_token",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [lastTest, setLastTest] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [shiftsSynced, setShiftsSynced] = useState(0);
  const [hoursFetched, setHoursFetched] = useState(0);
  const [kmProcessed, setKmProcessed] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await fetch("/api/shiftbase/config-status");
        const data = await res.json();
        if (res.ok && data.configured) {
          setStatus("untested");
          setMessage(null);
        } else if (res.ok && !data.configured) {
          setStatus("no_token");
          setMessage(data.hint ?? "SHIFTBASE_API_TOKEN ontbreekt in server-runtime.");
        }
      } catch {
        /* ignore */
      }
    }
    void checkConfig();
  }, []);

  useEffect(() => {
    function handleSync(event: Event) {
      const detail = (event as CustomEvent<{
        ok: boolean;
        message?: string;
        synced?: number;
        hours?: number;
      }>).detail;
      if (detail.ok) {
        setStatus("active");
        setLastSync(new Date().toLocaleString("nl-NL"));
        if (detail.synced) setShiftsSynced((c) => c + detail.synced!);
        if (detail.hours) setHoursFetched((c) => c + detail.hours!);
        setMessage(detail.message ?? "Synchronisatie voltooid.");
      } else {
        setStatus("error");
        setMessage(
          detail.message ?? "Shiftbase koppeling mislukt. Controleer token of API-toegang.",
        );
      }
    }
    window.addEventListener("shiftbase-sync", handleSync);
    return () => window.removeEventListener("shiftbase-sync", handleSync);
  }, []);

  async function handleTest() {
    setLoading("test");
    setMessage(null);
    try {
      const res = await fetch("/api/shiftbase/test");
      const data = await res.json();
      setLastTest(new Date().toLocaleString("nl-NL"));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(sanitizeShiftbaseUiMessage(data.error));
        return;
      }
      setStatus("active");
      setMessage("Shiftbase koppeling actief.");
    } catch {
      setStatus("error");
      setMessage("Shiftbase koppeling mislukt. Controleer token of API-toegang.");
    } finally {
      setLoading(null);
    }
  }

  async function handleFetchEmployees() {
    setLoading("employees");
    try {
      const res = await fetch("/api/shiftbase/employees");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(sanitizeShiftbaseUiMessage(data.error));
        return;
      }
      setEmployeesCount(data.count ?? 0);
      setStatus("active");
      setMessage(`${data.count ?? 0} medewerkers opgehaald.`);
    } catch {
      setMessage("Medewerkers ophalen mislukt.");
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

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Shiftbase koppeling
            </CardTitle>
            <CardDescription>
              Medewerkers, shifts, uren en adressen synchroniseren
            </CardDescription>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-[#101828]/55">Laatste test</dt>
          <dd>{lastTest ?? "—"}</dd>
          <dt className="text-[#101828]/55">Laatste sync</dt>
          <dd>{lastSync ?? "—"}</dd>
          <dt className="text-[#101828]/55">Medewerkers</dt>
          <dd className="font-semibold text-[#173A8A]">{employeesCount}</dd>
          <dt className="text-[#101828]/55">Shifts gesynct</dt>
          <dd className="font-semibold text-[#173A8A]">{shiftsSynced}</dd>
          <dt className="text-[#101828]/55">Uren opgehaald</dt>
          <dd className="font-semibold text-[#173A8A]">{hoursFetched}</dd>
          <dt className="text-[#101828]/55">KM verwerkt</dt>
          <dd className="font-semibold text-[#173A8A]">{kmProcessed}</dd>
        </dl>

        {message && (
          <p
            className={`rounded-lg px-3 py-2 text-xs ${
              status === "error"
                ? "bg-red-50 text-red-700"
                : "bg-[#F5F7FA] text-[#101828]/70"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleTest}
            disabled={loading !== null || status === "no_token"}
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
            onClick={handleFetchEmployees}
            disabled={loading !== null || status === "no_token"}
          >
            {loading === "employees" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            Medewerkers ophalen
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onSyncShifts?.();
              setKmProcessed((c) => c + 1);
            }}
            disabled={syncing || status === "no_token"}
            className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Shifts syncen
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onFetchHours}
            disabled={status === "no_token"}
          >
            <Unplug className="h-4 w-4" />
            Uren ophalen
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onFetchAddresses}
            disabled={status === "no_token"}
          >
            <Route className="h-4 w-4" />
            Adressen ophalen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
