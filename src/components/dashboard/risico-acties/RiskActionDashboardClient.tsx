"use client";

import { useCallback, useMemo, useState } from "react";
import { LayoutGrid, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RiskActionBoard from "@/components/dashboard/risico-acties/RiskActionBoard";
import RiskActionDrawer from "@/components/dashboard/risico-acties/RiskActionDrawer";
import RiskActionExportPanel from "@/components/dashboard/risico-acties/RiskActionExportPanel";
import RiskActionFiltersBar from "@/components/dashboard/risico-acties/RiskActionFilters";
import RiskActionFormModal from "@/components/dashboard/risico-acties/RiskActionFormModal";
import RiskActionStatsCards from "@/components/dashboard/risico-acties/RiskActionStats";
import RiskActionTable, {
  type RiskTableAction,
} from "@/components/dashboard/risico-acties/RiskActionTable";
import RiskActionTimeline from "@/components/dashboard/risico-acties/RiskActionTimeline";
import {
  actionToFormData,
  buildTimelineEvents,
  computeRiskStats,
  defaultRiskFilters,
  demoRiskActions,
  downloadRiskCsv,
  exportRiskActionsCsv,
  filterRiskActions,
  type RiskAction,
  type RiskFilters,
  type RiskStatus,
} from "@/lib/riskActions";

type ViewMode = "table" | "board";

export default function RiskActionDashboardClient() {
  const [actions, setActions] = useState<RiskAction[]>(demoRiskActions);
  const [filters, setFilters] = useState<RiskFilters>(defaultRiskFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [detailAction, setDetailAction] = useState<RiskAction | null>(null);
  const [editAction, setEditAction] = useState<RiskAction | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterRiskActions(actions, filters),
    [actions, filters],
  );

  const stats = useMemo(() => computeRiskStats(actions), [actions]);
  const timeline = useMemo(() => buildTimelineEvents(actions), [actions]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const updateStatus = useCallback(
    (item: RiskAction, status: RiskStatus) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === item.id
            ? { ...a, status, updatedAt: new Date().toISOString() }
            : a,
        ),
      );
      setDetailAction((prev) =>
        prev?.id === item.id
          ? { ...prev, status, updatedAt: new Date().toISOString() }
          : prev,
      );
      showToast(`Status gewijzigd naar "${status}" (demo).`);
    },
    [showToast],
  );

  const handleSave = useCallback(
    (action: RiskAction) => {
      if (editAction) {
        setActions((prev) =>
          prev.map((a) =>
            a.id === editAction.id
              ? { ...action, id: editAction.id, createdAt: editAction.createdAt }
              : a,
          ),
        );
        setEditAction(null);
        showToast("Actie bijgewerkt (demo).");
      } else {
        setActions((prev) => [action, ...prev]);
        showToast(
          "Actie voorbereid. Koppel dit later aan Supabase of een takenmodule.",
        );
      }
    },
    [editAction, showToast],
  );

  const handleTableAction = useCallback(
    (type: RiskTableAction, item: RiskAction) => {
      switch (type) {
        case "view":
          setDetailAction(item);
          break;
        case "edit":
          setEditAction(item);
          setFormOpen(true);
          break;
        case "in_progress":
          updateStatus(item, "In behandeling");
          break;
        case "waiting":
          updateStatus(item, "Wacht op reactie");
          break;
        case "completed":
          updateStatus(item, "Afgerond");
          break;
        case "delete":
          setActions((prev) => prev.filter((a) => a.id !== item.id));
          showToast("Actie verwijderd (demo).");
          break;
      }
    },
    [showToast, updateStatus],
  );

  const handleWeekOverview = useCallback(() => {
    const weekActions = actions.filter(
      (a) => a.dueDate && a.status !== "Afgerond",
    );
    const csv = exportRiskActionsCsv(weekActions);
    downloadRiskCsv(csv, "risk-actions-weekoverzicht.csv");
    showToast("Weekoverzicht geëxporteerd (demo CSV).");
  }, [actions, showToast]);

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          {filtered.length} van {actions.length} acties
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditAction(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nieuwe actie
        </Button>
      </div>

      <RiskActionStatsCards stats={stats} />

      <RiskActionFiltersBar filters={filters} onChange={setFilters} />

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={viewMode === "table" ? "default" : "outline"}
          onClick={() => setViewMode("table")}
        >
          <List className="h-4 w-4" />
          Tabel
        </Button>
        <Button
          type="button"
          size="sm"
          variant={viewMode === "board" ? "default" : "outline"}
          onClick={() => setViewMode("board")}
        >
          <LayoutGrid className="h-4 w-4" />
          Board
        </Button>
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Risico&apos;s & acties
          </CardTitle>
          <CardDescription>
            Operationele risico&apos;s, taken en opvolging per eigenaar en deadline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <RiskActionTable actions={filtered} onAction={handleTableAction} />
          ) : (
            <RiskActionBoard
              actions={filtered}
              onStatusChange={updateStatus}
              onView={setDetailAction}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <RiskActionTimeline events={timeline} />
        <RiskActionExportPanel
          actions={actions}
          onWeekOverview={handleWeekOverview}
        />
      </div>

      <RiskActionDrawer
        action={detailAction}
        open={detailAction !== null}
        onOpenChange={(open) => {
          if (!open) setDetailAction(null);
        }}
        onEdit={(action) => {
          setDetailAction(null);
          setEditAction(action);
          setFormOpen(true);
        }}
        onStatusChange={updateStatus}
      />

      <RiskActionFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditAction(null);
        }}
        onSave={handleSave}
        initialData={editAction ? actionToFormData(editAction) : undefined}
        existingId={editAction?.id}
        mode={editAction ? "edit" : "create"}
      />
    </div>
  );
}
