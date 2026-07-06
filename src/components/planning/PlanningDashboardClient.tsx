"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AssignCrewDrawer from "@/components/planning/AssignCrewDrawer";
import HoursControlTable from "@/components/planning/HoursControlTable";
import NewShiftModal from "@/components/planning/NewShiftModal";
import PlanningKpiCards from "@/components/planning/PlanningKpiCards";
import PlanningPageToolbar from "@/components/planning/PlanningPageToolbar";
import PlanningShiftCard, { type ShiftCardAction } from "@/components/planning/PlanningShiftCard";
import PlanningTable, { type PlanningTableAction } from "@/components/planning/PlanningTable";
import PlanningViewTabs from "@/components/planning/PlanningViewTabs";
import ShiftDetailDrawer from "@/components/planning/ShiftDetailDrawer";
import ShiftbaseSyncCard from "@/components/planning/ShiftbaseSyncCard";
import TravelCostTable from "@/components/planning/TravelCostTable";
import WeekPlanningBoard from "@/components/planning/WeekPlanningBoard";
import type {
  PlanningAssignment,
  PlanningCrewMember,
  PlanningHours,
  PlanningShift,
  PlanningView,
} from "@/data/planningMockData";
import { mockPlanningCrew } from "@/data/planningMockData";
import type { PlanningDataSource } from "@/lib/planning-utils";
import {
  computePlanningKpis,
  computeShiftStatus,
  downloadPlanningCsv,
  filterShiftsByView,
  sanitizeShiftbaseUiMessage,
  shiftToSupabaseInsert,
  shiftsToCsv,
  type NewShiftFormData,
} from "@/lib/planning-utils";
import { createClient } from "@/lib/supabase/client";

type PlanningDashboardClientProps = {
  initialShifts: PlanningShift[];
  initialAssignments: PlanningAssignment[];
  initialHours: PlanningHours[];
  dataSource: PlanningDataSource;
  shiftbaseConfigured: boolean;
};

function shiftToFormData(shift: PlanningShift): NewShiftFormData {
  const start = new Date(shift.startTime);
  const end = new Date(shift.endTime);
  return {
    title: shift.title,
    clientName: shift.clientName,
    locationName: shift.locationName,
    locationAddress: shift.locationAddress,
    date: shift.startTime.slice(0, 10),
    startTime: `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
    endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
    breakMinutes: String(shift.breakMinutes),
    roleName: shift.roleName,
    crewNeeded: String(shift.crewNeeded),
    customerHourlyRate: shift.customerHourlyRate ? String(shift.customerHourlyRate) : "",
    crewHourlyRate: shift.crewHourlyRate ? String(shift.crewHourlyRate) : "",
    travelFeePerKm: String(shift.travelFeePerKm),
    description: shift.description ?? "",
    internalNotes: shift.internalNotes ?? "",
    crewBriefing: shift.crewBriefing ?? "",
    clothingRequirements: shift.clothingRequirements ?? "",
    contactName: shift.contactName ?? "",
    contactPhone: shift.contactPhone ?? "",
    shiftbaseLocation: shift.shiftbaseLocation ?? "",
    shiftbaseTeam: shift.shiftbaseTeam ?? "",
    shiftbaseDepartment: shift.shiftbaseDepartment ?? "",
    planner: shift.planner,
  };
}

export default function PlanningDashboardClient({
  initialShifts,
  initialAssignments,
  initialHours,
  dataSource,
  shiftbaseConfigured,
}: PlanningDashboardClientProps) {
  const [shifts, setShifts] = useState<PlanningShift[]>(initialShifts);
  const [assignments, setAssignments] = useState<PlanningAssignment[]>(initialAssignments);
  const [hours, setHours] = useState<PlanningHours[]>(initialHours);
  const [crew] = useState<PlanningCrewMember[]>(mockPlanningCrew);
  const [view, setView] = useState<PlanningView>("week");

  const [newShiftOpen, setNewShiftOpen] = useState(false);
  const [editShift, setEditShift] = useState<PlanningShift | null>(null);
  const [detailShift, setDetailShift] = useState<PlanningShift | null>(null);
  const [assignShift, setAssignShift] = useState<PlanningShift | null>(null);
  const [deleteShift, setDeleteShift] = useState<PlanningShift | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredShifts = useMemo(
    () => filterShiftsByView(shifts, view),
    [shifts, view],
  );

  const kpiCards = useMemo(
    () => computePlanningKpis(shifts, assignments, hours),
    [shifts, assignments, hours],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const persistShift = useCallback(
    async (shift: PlanningShift, mode: "create" | "update") => {
      if (dataSource !== "supabase") return;
      try {
        const supabase = createClient();
        const payload = shiftToSupabaseInsert(shift);
        if (mode === "create") {
          const { data, error } = await supabase
            .from("planning_shifts")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw error;
          if (data?.id) shift.id = data.id;
        } else {
          const { error } = await supabase
            .from("planning_shifts")
            .update(payload)
            .eq("id", shift.id);
          if (error) throw error;
        }
      } catch (error) {
        console.error("[Planning] Supabase opslag mislukt:", error);
        showToast("Opslaan in Supabase mislukt — lokaal opgeslagen.");
      }
    },
    [dataSource, showToast],
  );

  const handleSaveShift = useCallback(
    async (shift: PlanningShift) => {
      if (editShift) {
        const updated: PlanningShift = {
          ...editShift,
          ...shift,
          id: editShift.id,
          crewPlanned: editShift.crewPlanned,
          status: computeShiftStatus(shift.crewNeeded, editShift.crewPlanned),
        };
        setShifts((prev) => prev.map((s) => (s.id === editShift.id ? updated : s)));
        await persistShift(updated, "update");
        setEditShift(null);
        showToast("Shift bijgewerkt.");
      } else {
        setShifts((prev) => [shift, ...prev]);
        await persistShift(shift, "create");
        showToast("Shift toegevoegd.");
      }
    },
    [editShift, persistShift, showToast],
  );

  const syncShiftToShiftbase = useCallback(
    async (shift: PlanningShift) => {
      setSyncing(true);
      try {
        const res = await fetch("/api/shiftbase/sync-shift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shift),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          window.dispatchEvent(
            new CustomEvent("shiftbase-sync", {
              detail: { ok: false, message: sanitizeShiftbaseUiMessage(data.error) },
            }),
          );
          return;
        }
        setShifts((prev) =>
          prev.map((s) =>
            s.id === shift.id
              ? {
                  ...s,
                  shiftbaseSyncStatus: "gesynct" as const,
                  shiftbaseShiftId: data.shiftbaseShiftId,
                  shiftbaseLastSyncedAt: data.syncedAt,
                }
              : s,
          ),
        );
        window.dispatchEvent(
          new CustomEvent("shiftbase-sync", {
            detail: { ok: true, synced: 1, message: "Shift gesynchroniseerd met Shiftbase." },
          }),
        );
        showToast("Shift gesynchroniseerd met Shiftbase.");
      } catch {
        showToast("Shiftbase sync mislukt.");
      } finally {
        setSyncing(false);
      }
    },
    [showToast],
  );

  const handleSyncAll = useCallback(async () => {
    setSyncing(true);
    try {
      const unsynced = shifts.filter((s) => s.shiftbaseSyncStatus !== "gesynct");
      const res = await fetch("/api/shiftbase/sync-all-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shifts: unsynced }),
      });
      const data = await res.json();
      window.dispatchEvent(
        new CustomEvent("shiftbase-sync", {
          detail: {
            ok: data.ok,
            synced: data.synced,
            message: data.message ?? sanitizeShiftbaseUiMessage(data.error),
          },
        }),
      );
      if (data.ok) showToast(data.message);
    } catch {
      showToast("Shiftbase sync mislukt.");
    } finally {
      setSyncing(false);
    }
  }, [shifts, showToast]);

  const handleFetchHours = useCallback(async () => {
    try {
      const res = await fetch("/api/shiftbase/sync-hours", { method: "POST" });
      const data = await res.json();
      window.dispatchEvent(
        new CustomEvent("shiftbase-sync", {
          detail: {
            ok: data.ok,
            hours: data.count,
            message: data.message ?? sanitizeShiftbaseUiMessage(data.error),
          },
        }),
      );
      if (data.ok) showToast(data.message);
      else showToast(sanitizeShiftbaseUiMessage(data.error));
    } catch {
      showToast("Uren ophalen mislukt.");
    }
  }, [showToast]);

  const handleFetchAddresses = useCallback(async () => {
    const ids = crew
      .filter((c) => c.shiftbaseEmployeeId)
      .map((c) => c.shiftbaseEmployeeId!);
    try {
      const res = await fetch("/api/shiftbase/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeIds: ids }),
      });
      const data = await res.json();
      if (data.ok) showToast(`${data.count} adressen verwerkt.`);
      else showToast(sanitizeShiftbaseUiMessage(data.error));
    } catch {
      showToast("Adressen ophalen mislukt.");
    }
  }, [crew, showToast]);

  const handleAssignCrew = useCallback(
    (shiftId: string, crewIds: string[]) => {
      const shift = shifts.find((s) => s.id === shiftId);
      if (!shift) return;

      const newAssignments: PlanningAssignment[] = crewIds.map((crewId) => {
        const member = crew.find((c) => c.id === crewId)!;
        const oneWay = member.expectedKm ?? 15;
        const returnKm = oneWay * 2;
        return {
          id: `asgn-${Date.now()}-${crewId}`,
          shiftId,
          crewMemberId: crewId,
          crewName: member.fullName,
          roleName: member.role,
          status: "gepland" as const,
          homeCity: member.homeCity,
          travelKmOneWay: oneWay,
          travelKmReturn: returnKm,
          travelFeePerKm: shift.travelFeePerKm,
          travelFeeTotal: Math.round(returnKm * shift.travelFeePerKm * 100) / 100,
          travelCalculationStatus: "berekend" as const,
          shiftbaseEmployeeId: member.shiftbaseEmployeeId,
        };
      });

      const newPlanned = shift.crewPlanned + crewIds.length;
      setAssignments((prev) => [...prev, ...newAssignments]);
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shiftId
            ? {
                ...s,
                crewPlanned: newPlanned,
                status: computeShiftStatus(s.crewNeeded, newPlanned),
              }
            : s,
        ),
      );
      showToast(`${crewIds.length} crewleden toegevoegd.`);
    },
    [shifts, crew, showToast],
  );

  const handleRemoveAssignment = useCallback(
    (assignmentId: string) => {
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (!assignment) return;
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setShifts((prev) =>
        prev.map((s) => {
          if (s.id !== assignment.shiftId) return s;
          const newPlanned = Math.max(0, s.crewPlanned - 1);
          return {
            ...s,
            crewPlanned: newPlanned,
            status: computeShiftStatus(s.crewNeeded, newPlanned),
          };
        }),
      );
      showToast("Crewlid verwijderd uit shift.");
    },
    [assignments, showToast],
  );

  const handleKmCalculate = useCallback(
    async (shift: PlanningShift) => {
      const shiftAssignments = assignments.filter((a) => a.shiftId === shift.id);
      let updated = 0;
      for (const a of shiftAssignments) {
        try {
          const res = await fetch("/api/shiftbase/calculate-kilometers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              homeCity: a.homeCity,
              projectAddress: shift.locationAddress,
              feePerKm: shift.travelFeePerKm,
            }),
          });
          const data = await res.json();
          if (data.ok && data.status === "berekend") {
            setAssignments((prev) =>
              prev.map((x) =>
                x.id === a.id
                  ? {
                      ...x,
                      travelKmOneWay: data.oneWayKm,
                      travelKmReturn: data.returnKm,
                      travelFeeTotal: data.totalFee,
                      travelCalculationStatus: "berekend",
                    }
                  : x,
              ),
            );
            updated++;
          }
        } catch {
          /* skip */
        }
      }
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shift.id ? { ...s, travelStatus: "berekend" } : s,
        ),
      );
      showToast(
        updated > 0
          ? `Kilometers berekend voor ${updated} crewleden.`
          : "Geen kilometers berekend — controleer adressen.",
      );
    },
    [assignments, showToast],
  );

  const handleShiftAction = useCallback(
    (action: ShiftCardAction | PlanningTableAction, shift: PlanningShift) => {
      switch (action) {
        case "view":
          setDetailShift(shift);
          break;
        case "edit":
          setEditShift(shift);
          break;
        case "crew":
          setAssignShift(shift);
          break;
        case "sync":
          void syncShiftToShiftbase(shift);
          break;
        case "hours":
          void handleFetchHours();
          break;
        case "km":
          void handleKmCalculate(shift);
          break;
        case "cancel":
          setShifts((prev) =>
            prev.map((s) =>
              s.id === shift.id ? { ...s, status: "geannuleerd" as const } : s,
            ),
          );
          showToast(`${shift.title} geannuleerd.`);
          break;
        case "delete":
          setDeleteShift(shift);
          break;
      }
    },
    [syncShiftToShiftbase, handleFetchHours, handleKmCalculate, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteShift) return;
    if (dataSource === "supabase") {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("planning_shifts")
          .delete()
          .eq("id", deleteShift.id);
        if (error) throw error;
      } catch {
        showToast("Verwijderen in Supabase mislukt.");
        setDeleteShift(null);
        return;
      }
    }
    setShifts((prev) => prev.filter((s) => s.id !== deleteShift.id));
    setAssignments((prev) => prev.filter((a) => a.shiftId !== deleteShift.id));
    setDeleteShift(null);
    showToast("Shift verwijderd.");
  }, [deleteShift, dataSource, showToast]);

  const handleExport = useCallback(() => {
    const csv = shiftsToCsv(filteredShifts);
    downloadPlanningCsv(
      csv,
      `helping-hands-planning-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    showToast(`${filteredShifts.length} shifts geëxporteerd.`);
  }, [filteredShifts, showToast]);

  const handleApproveHours = useCallback((h: PlanningHours) => {
    setHours((prev) =>
      prev.map((x) => (x.id === h.id ? { ...x, status: "goedgekeurd" as const } : x)),
    );
    showToast(`Uren van ${h.crewName} goedgekeurd.`);
  }, [showToast]);

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      {dataSource === "mock" && process.env.NODE_ENV === "development" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Mock data actief — voer <code className="font-mono">supabase/planning-module.sql</code> uit
          voor live data.
        </div>
      )}

      <PlanningPageToolbar
        onNewShift={() => setNewShiftOpen(true)}
        onAssignCrew={() => setAssignShift(shifts[0] ?? null)}
        onSyncShiftbase={handleSyncAll}
        onFetchHours={handleFetchHours}
        onExport={handleExport}
        syncing={syncing}
      />

      <PlanningKpiCards cards={kpiCards} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-black text-[#0B1F4D]">
                Planning overzicht
              </CardTitle>
              <CardDescription>
                {filteredShifts.length} shifts in {view === "week" ? "weekoverzicht" : view}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanningViewTabs view={view} onChange={setView}>
                {{
                  dag: (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredShifts.map((s) => (
                        <PlanningShiftCard
                          key={s.id}
                          shift={s}
                          onAction={handleShiftAction}
                        />
                      ))}
                    </div>
                  ),
                  week: <WeekPlanningBoard shifts={filteredShifts} onAction={handleShiftAction} />,
                  project: (
                    <div className="space-y-4">
                      {Array.from(new Set(filteredShifts.map((s) => s.title))).map((title) => (
                        <div key={title}>
                          <h3 className="mb-2 text-sm font-bold text-[#173A8A]">{title}</h3>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {filteredShifts
                              .filter((s) => s.title === title)
                              .map((s) => (
                                <PlanningShiftCard
                                  key={s.id}
                                  shift={s}
                                  onAction={handleShiftAction}
                                  compact
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                  crew: (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredShifts.map((s) => (
                        <PlanningShiftCard
                          key={s.id}
                          shift={s}
                          onAction={handleShiftAction}
                          compact
                        />
                      ))}
                    </div>
                  ),
                  open: (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredShifts.map((s) => (
                        <PlanningShiftCard
                          key={s.id}
                          shift={s}
                          onAction={handleShiftAction}
                        />
                      ))}
                    </div>
                  ),
                }}
              </PlanningViewTabs>
            </CardContent>
          </Card>
        </div>
        <ShiftbaseSyncCard
          initialConfigured={shiftbaseConfigured}
          onSyncShifts={handleSyncAll}
          onFetchHours={handleFetchHours}
          onFetchAddresses={handleFetchAddresses}
          syncing={syncing}
        />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Alle shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanningTable shifts={shifts} onAction={handleShiftAction} />
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Urencontrole</CardTitle>
          <CardDescription>Geklokte uren uit Shiftbase vs. planning</CardDescription>
        </CardHeader>
        <CardContent>
          <HoursControlTable hours={hours} onApprove={handleApproveHours} />
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Kilometervergoeding
          </CardTitle>
          <CardDescription>Standaard €0,25 per km retour</CardDescription>
        </CardHeader>
        <CardContent>
          <TravelCostTable assignments={assignments} shifts={shifts} />
        </CardContent>
      </Card>

      <NewShiftModal open={newShiftOpen} onOpenChange={setNewShiftOpen} onSave={handleSaveShift} />
      <NewShiftModal
        open={!!editShift}
        onOpenChange={(open) => !open && setEditShift(null)}
        onSave={handleSaveShift}
        initialData={editShift ? shiftToFormData(editShift) : undefined}
        mode="edit"
      />
      <ShiftDetailDrawer
        shift={detailShift}
        open={!!detailShift}
        onOpenChange={(open) => !open && setDetailShift(null)}
        onEdit={(s) => {
          setDetailShift(null);
          setEditShift(s);
        }}
        onCrew={(s) => {
          setDetailShift(null);
          setAssignShift(s);
        }}
        onSync={syncShiftToShiftbase}
        onKm={handleKmCalculate}
      />
      <AssignCrewDrawer
        shift={assignShift}
        crew={crew}
        assignments={assignments}
        open={!!assignShift}
        onOpenChange={(open) => !open && setAssignShift(null)}
        onAssign={handleAssignCrew}
        onRemove={handleRemoveAssignment}
        onSyncShiftbase={syncShiftToShiftbase}
      />

      <Dialog open={!!deleteShift} onOpenChange={(open) => !open && setDeleteShift(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">Shift verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je &quot;{deleteShift?.title}&quot; wilt verwijderen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteShift(null)}>
              Annuleren
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => void handleDelete()}
            >
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
