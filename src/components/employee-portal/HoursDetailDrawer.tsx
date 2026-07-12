"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import { canEmployeeSubmitHoursCorrection, formatShiftDate } from "@/lib/employeePortal";
import { formatDateTime } from "@/lib/dashboardHelpers";

type HoursDetailDrawerProps = {
  entry: EmployeeHoursEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCorrection: (entry: EmployeeHoursEntry) => void;
};

export default function HoursDetailDrawer({
  entry,
  open,
  onOpenChange,
  onRequestCorrection,
}: HoursDetailDrawerProps) {
  if (!entry) return null;

  const canCorrect = canEmployeeSubmitHoursCorrection(entry);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">{entry.projectName}</SheetTitle>
          <SheetDescription className="text-left">
            {formatShiftDate(entry.date)}
          </SheetDescription>
          <EmployeeStatusBadge status={entry.status} variant="hours" />
        </SheetHeader>

        <div className="flex-1 space-y-4 py-4 text-sm">
          <DetailRow label="Starttijd" value={entry.startTime} />
          <DetailRow label="Eindtijd" value={entry.endTime} />
          <DetailRow label="Pauze" value={`${entry.breakMinutes} minuten`} />
          <DetailRow label="Gewerkte uren" value={`${entry.workedHours.toFixed(2)} uur`} />
          {entry.notes ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Notitie van planning
              </p>
              <p className="mt-1 text-slate-700">{entry.notes}</p>
            </div>
          ) : null}
          {entry.correctionRequest ? (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-800">
                Correctiehistorie
              </p>
              <p className="mt-2 text-slate-700">
                <strong>Reden:</strong> {entry.correctionRequest.reason}
              </p>
              {entry.correctionRequest.requestedStartTime &&
              entry.correctionRequest.requestedEndTime ? (
                <p className="mt-1 text-slate-700">
                  <strong>Gewenst:</strong> {entry.correctionRequest.requestedStartTime} –{" "}
                  {entry.correctionRequest.requestedEndTime}
                  {entry.correctionRequest.requestedBreakMinutes !== undefined
                    ? ` · Pauze ${entry.correctionRequest.requestedBreakMinutes} min`
                    : ""}
                </p>
              ) : null}
              <p className="mt-1 text-slate-700">
                <strong>Toelichting:</strong> {entry.correctionRequest.explanation}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Ingediend op {formatDateTime(entry.correctionRequest.requestedAt)} · Status:{" "}
                {entry.correctionRequest.status}
              </p>
            </div>
          ) : null}
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          {canCorrect ? (
            <Button
              type="button"
              className="w-full bg-[#F28C28] hover:bg-[#de7c1f]"
              onClick={() => {
                onOpenChange(false);
                onRequestCorrection(entry);
              }}
            >
              Wijziging doorgeven
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Sluiten
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 font-medium text-[#0B1F4D]">{value}</p>
    </div>
  );
}
