"use client";

import { useMemo, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PlanningAssignment, PlanningCrewMember, PlanningShift } from "@/data/planningMockData";
import { formatPlanningDate, formatPlanningTime } from "@/lib/planning-utils";
import { cn } from "@/lib/utils";

type AssignCrewDrawerProps = {
  shift: PlanningShift | null;
  crew: PlanningCrewMember[];
  assignments: PlanningAssignment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (shiftId: string, crewIds: string[]) => void;
  onRemove: (assignmentId: string) => void;
  onSyncShiftbase?: (shift: PlanningShift) => void;
};

export default function AssignCrewDrawer({
  shift,
  crew,
  assignments,
  open,
  onOpenChange,
  onAssign,
  onRemove,
  onSyncShiftbase,
}: AssignCrewDrawerProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const shiftAssignments = useMemo(
    () => assignments.filter((a) => a.shiftId === shift?.id),
    [assignments, shift],
  );

  const assignedIds = new Set(shiftAssignments.map((a) => a.crewMemberId));

  const filteredCrew = useMemo(() => {
    const q = search.trim().toLowerCase();
    return crew.filter((c) => {
      if (assignedIds.has(c.id)) return false;
      if (roleFilter !== "all" && c.role !== roleFilter) return false;
      if (availabilityFilter !== "all" && c.availability !== availabilityFilter) return false;
      if (!q) return true;
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.homeCity.toLowerCase().includes(q)
      );
    });
  }, [crew, search, roleFilter, availabilityFilter, assignedIds]);

  const roles = Array.from(new Set(crew.map((c) => c.role)));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!shift) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">Crew inplannen</SheetTitle>
          <SheetDescription>
            {shift.title} · {formatPlanningDate(shift.startTime)}{" "}
            {formatPlanningTime(shift.startTime)} – {formatPlanningTime(shift.endTime)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-4">
          {shiftAssignments.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Ingepland ({shiftAssignments.length}/{shift.crewNeeded})
              </h3>
              {shiftAssignments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-[#F5F7FA]/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F4D]">{a.crewName}</p>
                    <p className="text-xs text-[#101828]/55">
                      {a.roleName} · {a.homeCity ?? "—"}
                      {a.travelKmReturn != null ? ` · ${a.travelKmReturn} km retour` : ""}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemove(a.id)}
                    aria-label={`Verwijder ${a.crewName}`}
                  >
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </section>
          )}

          <div className="space-y-2">
            <Input
              placeholder="Zoek crew op naam, functie, plaats…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v ?? "all")}>
                <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
                  <SelectValue placeholder="Functie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle functies</SelectItem>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={availabilityFilter}
                onValueChange={(v) => setAvailabilityFilter(v ?? "all")}
              >
                <SelectTrigger className="h-8 w-auto min-w-[140px] text-xs">
                  <SelectValue placeholder="Beschikbaarheid" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="beschikbaar">Beschikbaar</SelectItem>
                  <SelectItem value="deels">Deels beschikbaar</SelectItem>
                  <SelectItem value="niet_beschikbaar">Niet beschikbaar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredCrew.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => toggle(member.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left transition",
                  selected.has(member.id)
                    ? "border-[#173A8A] bg-[#173A8A]/5"
                    : "border-slate-100 bg-white hover:bg-[#F5F7FA]/60",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F4D]">{member.fullName}</p>
                    <p className="text-xs text-[#101828]/55">
                      {member.role} · {member.homeCity}
                      {member.expectedKm != null ? ` · ~${member.expectedKm} km` : ""}
                    </p>
                  </div>
                  {selected.has(member.id) && (
                    <Check className="h-4 w-4 shrink-0 text-[#173A8A]" />
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-[10px]">
                    {member.availability.replace("_", " ")}
                  </Badge>
                  {member.shiftbaseStatus && (
                    <Badge variant="outline" className="text-[10px]">
                      Shiftbase {member.shiftbaseStatus}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            disabled={selected.size === 0}
            onClick={() => {
              onAssign(shift.id, Array.from(selected));
              setSelected(new Set());
            }}
            className="w-full bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            <UserPlus className="h-4 w-4" />
            Toevoegen aan shift ({selected.size})
          </Button>
          {onSyncShiftbase && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => onSyncShiftbase(shift)}
            >
              Sync naar Shiftbase
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
