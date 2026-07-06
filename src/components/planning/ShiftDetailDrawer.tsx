"use client";

import { Pencil, RefreshCw, Route, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ShiftbaseDescriptionPreview from "@/components/planning/ShiftbaseDescriptionPreview";
import type { PlanningShift } from "@/data/planningMockData";
import {
  formatPlanningDate,
  formatPlanningTime,
  shiftStatusLabels,
  shiftStatusStyles,
  shiftbaseSyncLabels,
  shiftbaseSyncStyles,
} from "@/lib/planning-utils";
import { cn } from "@/lib/utils";

type ShiftDetailDrawerProps = {
  shift: PlanningShift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (shift: PlanningShift) => void;
  onCrew: (shift: PlanningShift) => void;
  onSync: (shift: PlanningShift) => void;
  onKm: (shift: PlanningShift) => void;
};

export default function ShiftDetailDrawer({
  shift,
  open,
  onOpenChange,
  onEdit,
  onCrew,
  onSync,
  onKm,
}: ShiftDetailDrawerProps) {
  if (!shift) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{shift.title}</SheetTitle>
          <SheetDescription>
            {shift.clientName} · {shift.locationName}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn("font-semibold", shiftStatusStyles[shift.status])}
            >
              {shiftStatusLabels[shift.status]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-semibold", shiftbaseSyncStyles[shift.shiftbaseSyncStatus])}
            >
              {shiftbaseSyncLabels[shift.shiftbaseSyncStatus]}
            </Badge>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Planning
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Datum</dt>
              <dd>{formatPlanningDate(shift.startTime)}</dd>
              <dt className="text-[#101828]/55">Tijden</dt>
              <dd>
                {formatPlanningTime(shift.startTime)} – {formatPlanningTime(shift.endTime)}
              </dd>
              <dt className="text-[#101828]/55">Functie</dt>
              <dd>{shift.roleName}</dd>
              <dt className="text-[#101828]/55">Crew</dt>
              <dd>
                {shift.crewPlanned}/{shift.crewNeeded}
              </dd>
              <dt className="text-[#101828]/55">Planner</dt>
              <dd>{shift.planner}</dd>
              <dt className="text-[#101828]/55">Adres</dt>
              <dd className="col-span-1">{shift.locationAddress || "—"}</dd>
            </dl>
          </section>

          {(shift.contactName || shift.contactPhone) && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Contact locatie
              </h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-[#101828]/55">Contact</dt>
                <dd>{shift.contactName ?? "—"}</dd>
                <dt className="text-[#101828]/55">Telefoon</dt>
                <dd>{shift.contactPhone ?? "—"}</dd>
              </dl>
            </section>
          )}

          {shift.crewBriefing && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Crew briefing
              </h3>
              <p className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 p-3 text-sm">
                {shift.crewBriefing}
              </p>
            </section>
          )}

          <ShiftbaseDescriptionPreview shift={shift} />
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={() => onEdit(shift)}
            className="w-full bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            <Pencil className="h-4 w-4" /> Bewerken
          </Button>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onCrew(shift)}>
              <UserPlus className="h-4 w-4" /> Crew
            </Button>
            <Button type="button" variant="outline" onClick={() => onSync(shift)}>
              <RefreshCw className="h-4 w-4" /> Shiftbase
            </Button>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => onKm(shift)}>
            <Route className="h-4 w-4" /> Kilometerberekening
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
