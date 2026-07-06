"use client";

import { useCallback, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CrewFiltersBar from "@/components/dashboard/crew/CrewFilters";
import CrewFormModal from "@/components/dashboard/crew/CrewFormModal";
import CrewProfileDrawer from "@/components/dashboard/crew/CrewProfileDrawer";
import CrewStatsCards from "@/components/dashboard/crew/CrewStats";
import CrewTable, { type CrewTableAction } from "@/components/dashboard/crew/CrewTable";
import ShiftbaseSyncPanel from "@/components/dashboard/crew/ShiftbaseSyncPanel";
import {
  computeCrewStats,
  crewMemberToFormData,
  defaultCrewFilters,
  demoCrewMembers,
  filterCrewMembers,
  type CrewMember,
  type CrewFilters,
} from "@/lib/crew";

export default function CrewDashboardClient() {
  const [members, setMembers] = useState<CrewMember[]>(demoCrewMembers);
  const [filters, setFilters] = useState<CrewFilters>(defaultCrewFilters);
  const [detailMember, setDetailMember] = useState<CrewMember | null>(null);
  const [editMember, setEditMember] = useState<CrewMember | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterCrewMembers(members, filters),
    [members, filters],
  );

  const stats = useMemo(() => computeCrewStats(members), [members]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  }, []);

  const handleSave = useCallback(
    (member: CrewMember) => {
      if (editMember) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editMember.id ? { ...editMember, ...member, id: editMember.id } : m)),
        );
        setEditMember(null);
        showToast("Crewlid bijgewerkt (demo). Koppel later aan Supabase of Shiftbase.");
      } else {
        setMembers((prev) => [member, ...prev]);
        showToast("Crewlid voorbereid. Koppel dit later aan Supabase of Shiftbase.");
      }
    },
    [editMember, showToast],
  );

  const handleAction = useCallback(
    (action: CrewTableAction, member: CrewMember) => {
      switch (action) {
        case "view":
          setDetailMember(member);
          break;
        case "edit":
          setEditMember(member);
          break;
        default:
          break;
      }
    },
    [],
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#101828]/60">
          {filtered.length} van {members.length} crewleden
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditMember(null);
            setFormOpen(true);
          }}
          className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Crewlid toevoegen
        </Button>
      </div>

      <CrewStatsCards stats={stats} />

      <ShiftbaseSyncPanel />

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Crewleden</CardTitle>
          <CardDescription>
            Zoek, filter en beheer crewprofielen voor Helping Hands Agency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CrewFiltersBar filters={filters} onChange={setFilters} />
          <CrewTable members={filtered} onAction={handleAction} />
        </CardContent>
      </Card>

      <CrewFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
      />

      <CrewFormModal
        open={!!editMember}
        onOpenChange={(open) => !open && setEditMember(null)}
        onSave={handleSave}
        initialData={editMember ? crewMemberToFormData(editMember) : undefined}
        mode="edit"
      />

      <CrewProfileDrawer
        member={detailMember}
        open={!!detailMember}
        onOpenChange={(open) => !open && setDetailMember(null)}
        onEdit={(m) => {
          setDetailMember(null);
          setEditMember(m);
        }}
      />
    </div>
  );
}
