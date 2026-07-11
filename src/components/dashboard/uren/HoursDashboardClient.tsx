"use client";

import { useCallback, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HoursDetailDrawer from "@/components/dashboard/uren/HoursDetailDrawer";
import HoursExportPanel from "@/components/dashboard/uren/HoursExportPanel";
import HoursFiltersBar from "@/components/dashboard/uren/HoursFilters";
import HoursFormModal from "@/components/dashboard/uren/HoursFormModal";
import HoursStatsCards from "@/components/dashboard/uren/HoursStats";
import HoursTable, {
  type HoursTableAction,
} from "@/components/dashboard/uren/HoursTable";
import ShiftbaseHoursSyncPanel from "@/components/dashboard/uren/ShiftbaseHoursSyncPanel";
import {
  buildHoursEntry,
  computeHoursStats,
  defaultHoursFilters,
  demoHoursEntries,
  filterHoursEntries,
  hoursEntryToFormData,
  type HoursEntry,
  type HoursFilters,
} from "@/lib/hours";

export default function HoursDashboardClient() {
  const [entries, setEntries] = useState<HoursEntry[]>(demoHoursEntries);
  const [filters, setFilters] = useState<HoursFilters>(defaultHoursFilters);
  const [detailEntry, setDetailEntry] = useState<HoursEntry | null>(null);
  const [editEntry, setEditEntry] = useState<HoursEntry | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterHoursEntries(entries, filters),
    [entries, filters],
  );

  const stats = useMemo(() => computeHoursStats(entries), [entries]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const updateEntry = useCallback(
    (id: string, patch: Partial<HoursEntry>) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.id !== id) return e;
          return buildHoursEntry({ ...e, ...patch });
        }),
      );
      setDetailEntry((prev) =>
        prev?.id === id ? buildHoursEntry({ ...prev, ...patch }) : prev,
      );
    },
    [],
  );

  const handleSave = useCallback(
    (entry: HoursEntry) => {
      if (editEntry) {
        setEntries((prev) =>
          prev.map((e) => (e.id === editEntry.id ? { ...entry, id: editEntry.id } : e)),
        );
        setEditEntry(null);
        showToast("Urenregel bijgewerkt (demo).");
      } else {
        setEntries((prev) => [entry, ...prev]);
        showToast(
          "Urenregel voorbereid. Koppel dit later aan Supabase, Shiftbase of Moneybird.",
        );
      }
    },
    [editEntry, showToast],
  );

  const handleAction = useCallback(
    (action: HoursTableAction, entry: HoursEntry) => {
      switch (action) {
        case "view":
          setDetailEntry(entry);
          break;
        case "edit":
          setEditEntry(entry);
          setFormOpen(true);
          break;
        case "approve":
          updateEntry(entry.id, {
            status: "Goedgekeurd",
            approvedBy: "Demo Planner",
            approvedAt: new Date().toISOString(),
          });
          showToast("Uren goedgekeurd (demo).");
          break;
        case "reject":
          updateEntry(entry.id, { status: "Afgekeurd" });
          showToast("Uren afgekeurd (demo).");
          break;
        case "invoice":
          updateEntry(entry.id, {
            status: "Gefactureerd",
            moneybirdInvoiceId: `MB-${Date.now().toString().slice(-6)}`,
          });
          showToast("Gemarkeerd als gefactureerd (demo).");
          break;
      }
    },
    [showToast, updateEntry],
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      <HoursStatsCards stats={stats} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          {filtered.length} van {entries.length} urenregels
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditEntry(null);
            setFormOpen(true);
          }}
        >
          <Clock className="h-4 w-4" />
          Uren toevoegen
        </Button>
      </div>

      <ShiftbaseHoursSyncPanel />

      <HoursExportPanel entries={entries} />

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Urenoverzicht
          </CardTitle>
          <CardDescription>
            Controleer uren per project en crewlid, keur goed en bereid facturatie
            voor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <HoursFiltersBar filters={filters} onChange={setFilters} />
          <HoursTable entries={filtered} onAction={handleAction} />
        </CardContent>
      </Card>

      <HoursDetailDrawer
        entry={detailEntry}
        open={detailEntry !== null}
        onOpenChange={(open) => {
          if (!open) setDetailEntry(null);
        }}
        onEdit={(entry) => {
          setDetailEntry(null);
          setEditEntry(entry);
          setFormOpen(true);
        }}
        onApprove={(entry) => handleAction("approve", entry)}
        onReject={(entry) => handleAction("reject", entry)}
        onInvoice={(entry) => handleAction("invoice", entry)}
      />

      <HoursFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditEntry(null);
        }}
        onSave={handleSave}
        initialData={editEntry ? hoursEntryToFormData(editEntry) : undefined}
        existingId={editEntry?.id}
        mode={editEntry ? "edit" : "create"}
      />
    </div>
  );
}
