"use client";

/**
 * Medewerkersportaal uren — bekijken, indienen/bewerken (uren+km), correcties.
 * Goedkeuring gebeurt alleen in het interne dashboard.
 */

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, PencilLine } from "lucide-react";
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
import HoursEditModal, {
  type HoursEditFormData,
} from "@/components/employee-portal/HoursEditModal";
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import {
  canEmployeeEditOwnHours,
  canEmployeeSubmitHoursCorrection,
  formatShiftDate,
} from "@/lib/employeePortal";
import { calculateWorkedHours } from "@/lib/dashboard/calculations";
import { formatKilometersNl } from "@/lib/time-entries/shared";
import {
  submitHoursCorrectionAction,
  updateOwnTimeEntryAction,
} from "@/lib/employee-portal/mutations";

export default function HoursCheckTable({
  entries = [],
}: {
  entries?: EmployeeHoursEntry[];
}) {
  const router = useRouter();
  const [localEntries, setLocalEntries] = useState(entries);
  const [correctionEntry, setCorrectionEntry] = useState<EmployeeHoursEntry | null>(null);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<EmployeeHoursEntry | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewEntry, setViewEntry] = useState<EmployeeHoursEntry | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLocalEntries(entries);
  }, [entries]);

  function openView(entry: EmployeeHoursEntry) {
    setViewEntry(entry);
    setViewOpen(true);
  }

  function openCorrection(entry: EmployeeHoursEntry) {
    setCorrectionEntry(entry);
    setCorrectionOpen(true);
  }

  function openEdit(entry: EmployeeHoursEntry) {
    setEditEntry(entry);
    setEditOpen(true);
  }

  function handleCorrectionSubmit(entryId: string, data: HoursCorrectionFormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitHoursCorrectionAction({
        entryId,
        reason: data.reason,
        requestedStartTime: data.requestedStartTime,
        requestedEndTime: data.requestedEndTime,
        requestedBreakMinutes: data.requestedBreakMinutes,
        requestedKilometers: data.requestedKilometers,
        explanation: data.explanation,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
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
      router.refresh();
    });
  }

  function handleEditSubmit(entryId: string, data: HoursEditFormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateOwnTimeEntryAction(entryId, {
        startTime: data.startTime,
        endTime: data.endTime,
        breakMinutes: Number(data.breakMinutes) || 0,
        kilometers: Number(data.kilometers) || 0,
        travelTimeHours: Number(data.travelTimeHours) || 0,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const workedHours = calculateWorkedHours(
        data.startTime,
        data.endTime,
        Number(data.breakMinutes) || 0,
      );
      const patch = {
        startTime: data.startTime,
        endTime: data.endTime,
        breakMinutes: Number(data.breakMinutes) || 0,
        workedHours,
        kilometers: Number(data.kilometers) || 0,
        travelTimeHours: Number(data.travelTimeHours) || 0,
        status: "Ingediend" as const,
        dbStatus: "submitted" as const,
        correctionRequest: undefined,
      };
      setLocalEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId ? { ...entry, ...patch } : entry,
        ),
      );
      setEditOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Mijn uren & kilometers
          </CardTitle>
          <CardDescription>
            Bekijk en bewerk je registraties. Goedgekeurde uren: geef een wijziging door —
            planning beoordeelt dit in het interne dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {localEntries.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nog geen uren voor jou geregistreerd. Dien hierboven uren & kilometers in.
            </p>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Datum</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>Eind</TableHead>
                      <TableHead>Uren</TableHead>
                      <TableHead>Km</TableHead>
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
                        <TableCell>{entry.workedHours.toFixed(2)}</TableCell>
                        <TableCell>
                          {formatKilometersNl(entry.kilometers ?? 0)}
                        </TableCell>
                        <TableCell>
                          <EmployeeStatusBadge status={entry.status} variant="hours" />
                        </TableCell>
                        <TableCell className="text-right">
                          <HoursActions
                            entry={entry}
                            onView={() => openView(entry)}
                            onEdit={() => openEdit(entry)}
                            onCorrection={() => openCorrection(entry)}
                            disabled={pending}
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
                        <p className="text-sm text-slate-600">
                          {formatShiftDate(entry.date)}
                        </p>
                      </div>
                      <EmployeeStatusBadge status={entry.status} variant="hours" />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {entry.startTime} – {entry.endTime} · {entry.workedHours.toFixed(2)} u ·{" "}
                      {formatKilometersNl(entry.kilometers ?? 0)}
                    </p>
                    <div className="mt-3">
                      <HoursActions
                        entry={entry}
                        onView={() => openView(entry)}
                        onEdit={() => openEdit(entry)}
                        onCorrection={() => openCorrection(entry)}
                        stacked
                        disabled={pending}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <HoursDetailDrawer
        entry={viewEntry}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onRequestCorrection={openCorrection}
        onEdit={openEdit}
      />

      <HoursEditModal
        entry={editEntry}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEditSubmit}
        pending={pending}
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
  onEdit,
  onCorrection,
  stacked = false,
  disabled = false,
}: {
  entry: EmployeeHoursEntry;
  onView: () => void;
  onEdit: () => void;
  onCorrection: () => void;
  stacked?: boolean;
  disabled?: boolean;
}) {
  const canEdit = canEmployeeEditOwnHours(entry);
  const canCorrect = canEmployeeSubmitHoursCorrection(entry) && !canEdit;

  return (
    <div className={stacked ? "flex flex-col gap-2" : "flex justify-end gap-1"}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={stacked ? "min-h-11 w-full justify-center" : ""}
        onClick={onView}
      >
        <Eye className="mr-1 h-4 w-4" />
        Bekijken
      </Button>
      {canEdit ? (
        <Button
          type="button"
          variant={stacked ? "outline" : "ghost"}
          size="sm"
          disabled={disabled}
          className={stacked ? "min-h-11 w-full justify-center" : ""}
          onClick={onEdit}
        >
          <Pencil className="mr-1 h-4 w-4" />
          Bewerken
        </Button>
      ) : null}
      {canCorrect ? (
        <Button
          type="button"
          variant={stacked ? "outline" : "ghost"}
          size="sm"
          disabled={disabled}
          className={
            stacked
              ? "min-h-11 w-full justify-center border-[#F28C28]/30 text-[#c46a12] hover:bg-[#F28C28]/10"
              : ""
          }
          onClick={onCorrection}
        >
          <PencilLine className="mr-1 h-4 w-4" />
          Wijziging doorgeven
        </Button>
      ) : null}
    </div>
  );
}
