"use client";

import { useState } from "react";
import { Check, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmployeeStatusBadge from "@/components/employee-portal/EmployeeStatusBadge";
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import { DEMO_EMPLOYEE_HOURS, formatShiftDate } from "@/lib/employeePortal";

export default function HoursCheckTable({
  entries = DEMO_EMPLOYEE_HOURS,
}: {
  entries?: EmployeeHoursEntry[];
}) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [correctionEntry, setCorrectionEntry] = useState<EmployeeHoursEntry | null>(null);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionSaved, setCorrectionSaved] = useState(false);
  const [viewEntry, setViewEntry] = useState<EmployeeHoursEntry | null>(null);

  function markApproved(id: string) {
    setLocalEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Goedgekeurd" as const } : e)),
    );
  }

  function openCorrection(entry: EmployeeHoursEntry) {
    setCorrectionEntry(entry);
    setCorrectionSaved(false);
    setCorrectionOpen(true);
  }

  function submitCorrection(event: React.FormEvent) {
    event.preventDefault();
    setCorrectionSaved(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">Mijn uren</CardTitle>
          <CardDescription>
            Controleer je gewerkte uren en geef akkoord of vraag een correctie aan.
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
                        onView={() => setViewEntry(entry)}
                        onApprove={() => markApproved(entry.id)}
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
                    onView={() => setViewEntry(entry)}
                    onApprove={() => markApproved(entry.id)}
                    onCorrection={() => openCorrection(entry)}
                    stacked
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(viewEntry)} onOpenChange={() => setViewEntry(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          {viewEntry ? (
            <>
              <DialogHeader>
                <DialogTitle>{viewEntry.projectName}</DialogTitle>
                <DialogDescription>{formatShiftDate(viewEntry.date)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Tijden:</strong> {viewEntry.startTime} – {viewEntry.endTime}
                </p>
                <p>
                  <strong>Pauze:</strong> {viewEntry.breakMinutes} minuten
                </p>
                <p>
                  <strong>Gewerkt:</strong> {viewEntry.workedHours.toFixed(2)} uur
                </p>
                {viewEntry.notes ? (
                  <p>
                    <strong>Opmerking:</strong> {viewEntry.notes}
                  </p>
                ) : null}
                <EmployeeStatusBadge status={viewEntry.status} variant="hours" />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Correctie aanvragen</DialogTitle>
            <DialogDescription>
              {correctionEntry?.projectName} — {correctionEntry && formatShiftDate(correctionEntry.date)}
            </DialogDescription>
          </DialogHeader>
          {correctionSaved ? (
            <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700">
              Correctieverzoek voorbereid. Later wordt dit doorgestuurd naar planning/administratie.
            </p>
          ) : (
            <form onSubmit={submitCorrection} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="corr-issue">Wat klopt er niet?</Label>
                <Input id="corr-issue" required placeholder="Bijv. eindtijd onjuist" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="corr-start">Gewenste starttijd</Label>
                  <Input id="corr-start" type="time" defaultValue={correctionEntry?.startTime} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corr-end">Gewenste eindtijd</Label>
                  <Input id="corr-end" type="time" defaultValue={correctionEntry?.endTime} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="corr-break">Pauze (minuten)</Label>
                <Input
                  id="corr-break"
                  type="number"
                  min={0}
                  defaultValue={correctionEntry?.breakMinutes}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corr-note">Toelichting</Label>
                <Input id="corr-note" placeholder="Extra toelichting voor planning" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#173A8A] hover:bg-[#0B1F4D]">
                  Verzoek voorbereiden
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function HoursActions({
  entry,
  onView,
  onApprove,
  onCorrection,
  stacked = false,
}: {
  entry: EmployeeHoursEntry;
  onView: () => void;
  onApprove: () => void;
  onCorrection: () => void;
  stacked?: boolean;
}) {
  const canAct = entry.status === "Ingediend" || entry.status === "Concept";

  return (
    <div className={stacked ? "flex flex-col gap-2" : "flex justify-end gap-1"}>
      <Button type="button" variant="ghost" size="sm" onClick={onView}>
        <Eye className="mr-1 h-4 w-4" />
        Bekijken
      </Button>
      {canAct ? (
        <>
          <Button type="button" variant="ghost" size="sm" onClick={onApprove}>
            <Check className="mr-1 h-4 w-4" />
            Akkoord
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCorrection}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Correctie
          </Button>
        </>
      ) : null}
    </div>
  );
}
