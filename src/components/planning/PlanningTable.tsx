"use client";

import {
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Route,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export type PlanningTableAction =
  | "view"
  | "edit"
  | "crew"
  | "sync"
  | "hours"
  | "km"
  | "delete";

type PlanningTableProps = {
  shifts: PlanningShift[];
  onAction: (action: PlanningTableAction, shift: PlanningShift) => void;
};

export default function PlanningTable({ shifts, onAction }: PlanningTableProps) {
  return (
    <div className="-mx-4 overflow-x-auto sm:-mx-6">
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Datum</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Locatie</TableHead>
            <TableHead>Tijd</TableHead>
            <TableHead>Functie</TableHead>
            <TableHead>Crew nodig</TableHead>
            <TableHead>Crew ingepland</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shiftbase</TableHead>
            <TableHead>Uren</TableHead>
            <TableHead>KM</TableHead>
            <TableHead className="pr-6 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="py-12 text-center text-sm text-[#101828]/55">
                Geen shifts gevonden.
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id} className="hover:bg-[#F5F7FA]/40">
                <TableCell className="pl-6 text-xs text-[#101828]/70">
                  {formatPlanningDate(shift.startTime)}
                </TableCell>
                <TableCell className="font-semibold text-[#0B1F4D]">{shift.title}</TableCell>
                <TableCell className="text-[#101828]/75">{shift.locationName}</TableCell>
                <TableCell className="text-xs text-[#101828]/70">
                  {formatPlanningTime(shift.startTime)} – {formatPlanningTime(shift.endTime)}
                </TableCell>
                <TableCell className="text-xs">{shift.roleName}</TableCell>
                <TableCell className="text-center">{shift.crewNeeded}</TableCell>
                <TableCell className="text-center font-medium">{shift.crewPlanned}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold", shiftStatusStyles[shift.status])}
                  >
                    {shiftStatusLabels[shift.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      shiftbaseSyncStyles[shift.shiftbaseSyncStatus],
                    )}
                  >
                    {shiftbaseSyncLabels[shift.shiftbaseSyncStatus]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-[#101828]/60">
                  {shift.hoursStatus ?? "—"}
                </TableCell>
                <TableCell className="text-xs text-[#101828]/60">
                  {shift.travelStatus ?? "—"}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-[#173A8A]"
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
                      <DropdownMenuItem onClick={() => onAction("crew", shift)}>
                        <UserPlus className="h-4 w-4" /> Crew inplannen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("sync", shift)}>
                        <RefreshCw className="h-4 w-4" /> Sync naar Shiftbase
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("hours", shift)}>
                        <Eye className="h-4 w-4" /> Uren ophalen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("km", shift)}>
                        <Route className="h-4 w-4" /> KM berekenen
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onAction("delete", shift)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" /> Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
