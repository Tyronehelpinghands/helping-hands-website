"use client";

/**
 * Medewerkersportaal uren — alleen bekijken en correcties doorgeven.
 *
 * TODO: Medewerker mag alleen eigen uren bekijken
 * TODO: Medewerker mag alleen correctieverzoek maken
 * TODO: Medewerker mag nooit status Goedgekeurd zetten
 * TODO: Alleen interne admin/planning mag uren goedkeuren via /dashboard/intern/urenregistratie
 * TODO: Later afdwingen met Supabase Auth + Row Level Security
 */

import { useState } from "react";
import { Eye, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import HoursCorrectionModal, {
  buildCorrectionRequest,
  type HoursCorrectionFormData,
} from "@/components/employee-portal/HoursCorrectionModal";
import HoursDetailDrawer from "@/components/employee-portal/HoursDetailDrawer";
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import {
  canEmployeeSubmitHoursCorrection,
  DEMO_EMPLOYEE_HOURS,
  formatShiftDate,
} from "@/lib/employeePortal";

export default function HoursCheckTable({
  entries = DEMO_EMPLOYEE_HOURS,
}: {
  entries?: EmployeeHoursEntry[];
}) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [correctionEntry, setCorrectionEntry] = useState<EmployeeHoursEntry | null>(null);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [viewEntry, setViewEntry] = useState<EmployeeHoursEntry | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  function openView(entry: EmployeeHoursEntry) {
    setViewEntry(entry);
    setViewOpen(true);
  }

  function openCorrection(entry: EmployeeHoursEntry) {
    setCorrectionEntry(entry);
    setCorrectionOpen(true);
  }

  function handleCorrectionSubmit(entryId: string, data: HoursCorrectionFormData) {
    const correctionRequest = buildCorrectionRequest(data);
    setLocalEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              status: "Correctie aangevraagd" as const,
              correctionRequest,
            }
          : entry,
      ),
    );
    if (viewEntry?.id === entryId) {
      setViewEntry((prev) =>
        prev
          ? {
              ...prev,
              status: "Correctie aangevraagd",
              correctionRequest,
            }
          : prev,
      );
    }
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Mijn uren</CardTitle>
          <CardDescription>
            Bekijk je gewerkte uren. Klopt er iets niet? Geef een wijziging door — planning
            beoordeelt dit in het interne dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Eind</TableHead>
                  <TableHead>Pauze</TableHead>
                  <TableHead>Uren</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatShiftDate(entry.date)}</TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {entry.projectName}
                    </TableCell>
                    <TableCell>{entry.startTime}</TableCell>
                    <TableCell>{entry.endTime}</TableCell>
                    <TableCell>{entry.breakMinutes} min</TableCell>
                    <TableCell>{entry.workedHours.toFixed(2)}</TableCell>
                    <TableCell>
                      <EmployeeStatusBadge status={entry.status} variant="hours" />
                    </TableCell>
                    <TableCell className="text-right">
                      <HoursActions
                        entry={entry}
                        onView={() => openView(entry)}
                        onCorrection={() => openCorrection(entry)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {localEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#0B1F4D]">{entry.projectName}</p>
                    <p className="text-sm text-slate-600">{formatShiftDate(entry.date)}</p>
                  </div>
                  <EmployeeStatusBadge status={entry.status} variant="hours" />
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {entry.startTime} – {entry.endTime} · Pauze {entry.breakMinutes} min ·{" "}
                  {entry.workedHours.toFixed(2)} u
                </p>
                <div className="mt-3">
                  <HoursActions
                    entry={entry}
                    onView={() => openView(entry)}
                    onCorrection={() => openCorrection(entry)}
                    stacked
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <HoursDetailDrawer
        entry={viewEntry}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onRequestCorrection={openCorrection}
      />

      <HoursCorrectionModal
        entry={correctionEntry}
        open={correctionOpen}
        onOpenChange={setCorrectionOpen}
        onSubmit={handleCorrectionSubmit}
      />
    </>
  );
}

function HoursActions({
  entry,
  onView,
  onCorrection,
  stacked = false,
}: {
  entry: EmployeeHoursEntry;
  onView: () => void;
  onCorrection: () => void;
  stacked?: boolean;
}) {
  const canCorrect = canEmployeeSubmitHoursCorrection(entry);

  return (
    <div className={stacked ? "flex flex-col gap-2" : "flex justify-end gap-1"}>
      <Button type="button" variant="ghost" size="sm" onClick={onView}>
        <Eye className="mr-1 h-4 w-4" />
        Bekijken
      </Button>
      {canCorrect ? (
        <Button
          type="button"
          variant={stacked ? "outline" : "ghost"}
          size="sm"
          className={stacked ? "border-[#F28C28]/30 text-[#c46a12] hover:bg-[#F28C28]/10" : ""}
          onClick={onCorrection}
        >
          <PencilLine className="mr-1 h-4 w-4" />
          Wijziging doorgeven
        </Button>
      ) : null}
    </div>
  );
}
