"use client";

import { Badge } from "@/components/ui/badge";
import type { PlanningShift } from "@/data/planningMockData";
import {
  formatPlanningTime,
  shiftStatusLabels,
  shiftStatusStyles,
  shiftbaseSyncLabels,
  shiftbaseSyncStyles,
} from "@/lib/planning-utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Route,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";

export type ShiftCardAction =
  | "view"
  | "edit"
  | "crew"
  | "sync"
  | "hours"
  | "km"
  | "cancel"
  | "delete";

type PlanningShiftCardProps = {
  shift: PlanningShift;
  onAction: (action: ShiftCardAction, shift: PlanningShift) => void;
  compact?: boolean;
};

export default function PlanningShiftCard({
  shift,
  onAction,
  compact = false,
}: PlanningShiftCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-[#0B1F4D]/5 transition hover:border-[#38bdf8]/30">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#0B1F4D]">{shift.title}</p>
          <p className="truncate text-xs text-[#101828]/60">{shift.locationName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-[#173A8A]"
                aria-label={`Acties voor ${shift.title}`}
              />
            }
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onAction("view", shift)}>
              <Eye className="h-4 w-4" /> Bekijken
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("edit", shift)}>
              <Pencil className="h-4 w-4" /> Bewerken
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction("crew", shift)}>
              <UserPlus className="h-4 w-4" /> Crew toevoegen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("sync", shift)}>
              <RefreshCw className="h-4 w-4" /> Naar Shiftbase syncen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("hours", shift)}>
              <Eye className="h-4 w-4" /> Uren ophalen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("km", shift)}>
              <Route className="h-4 w-4" /> Kilometerberekening
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction("cancel", shift)}>
              <XCircle className="h-4 w-4" /> Annuleren
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onAction("delete", shift)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Verwijderen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-2 text-xs font-medium text-[#173A8A]">
        {formatPlanningTime(shift.startTime)} – {formatPlanningTime(shift.endTime)}
      </p>
      <p className="text-xs text-[#101828]/55">{shift.roleName}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        <Badge
          variant="outline"
          className={cn("text-[10px] font-semibold", shiftStatusStyles[shift.status])}
        >
          {shiftStatusLabels[shift.status]}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-semibold",
            shiftbaseSyncStyles[shift.shiftbaseSyncStatus],
          )}
        >
          {shiftbaseSyncLabels[shift.shiftbaseSyncStatus]}
        </Badge>
      </div>

      <p className="mt-2 text-xs text-[#101828]/65">
        Crew {shift.crewPlanned}/{shift.crewNeeded} · {shift.planner}
      </p>

      {!compact && shift.crewBriefing && (
        <p className="mt-2 line-clamp-2 text-[10px] text-[#101828]/50">
          {shift.crewBriefing}
        </p>
      )}
    </div>
  );
}
