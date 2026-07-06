"use client";

import { CalendarPlus, Clock, Download, RefreshCw, Route, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlanningPageToolbarProps = {
  onNewShift: () => void;
  onAssignCrew: () => void;
  onSyncShiftbase: () => void;
  onFetchHours: () => void;
  onExport: () => void;
  syncing?: boolean;
};

export default function PlanningPageToolbar({
  onNewShift,
  onAssignCrew,
  onSyncShiftbase,
  onFetchHours,
  onExport,
  syncing = false,
}: PlanningPageToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        type="button"
        size="sm"
        onClick={onNewShift}
        className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Nieuwe shift
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAssignCrew}
        className="border-slate-200/80 bg-white"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Crew inplannen
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onSyncShiftbase}
        disabled={syncing}
        className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
      >
        <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden="true" />
        Sync met Shiftbase
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onFetchHours}
        className="border-slate-200/80 bg-white"
      >
        <Clock className="h-4 w-4" aria-hidden="true" />
        Uren ophalen
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onExport}
        className="border-slate-200/80 bg-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Exporteren
      </Button>
    </div>
  );
}
