"use client";

/**
 * Medewerker dient eigen uren + kilometers in op toegewezen shifts.
 * Zelfde time_entries-tabel als intern dashboard / opdrachtgeversportaal.
 */

import { useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EmployeeHoursShiftOption } from "@/lib/employeePortal";
import { formatShiftDate } from "@/lib/employeePortal";
import { calculateWorkedHours } from "@/lib/dashboard/calculations";
import { submitOwnTimeEntryAction } from "@/lib/employee-portal/mutations";

export default function HoursSubmitForm({
  shiftOptions = [],
  onSubmitted,
}: {
  shiftOptions?: EmployeeHoursShiftOption[];
  onSubmitted?: () => void;
}) {
  const openShifts = useMemo(
    () => shiftOptions.filter((s) => !s.hasTimeEntry),
    [shiftOptions],
  );
  const [open, setOpen] = useState(false);
  const [shiftId, setShiftId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [kilometers, setKilometers] = useState("0");
  const [travelTimeHours, setTravelTimeHours] = useState("0");

  const selected = openShifts.find((s) => s.id === shiftId) ?? null;
  const previewHours = calculateWorkedHours(
    startTime,
    endTime,
    Number(breakMinutes) || 0,
  );

  function openDialog() {
    const first = openShifts[0];
    setShiftId(first?.id ?? "");
    setStartTime(first?.startTime !== "—" ? first.startTime : "09:00");
    setEndTime(first?.endTime !== "—" ? first.endTime : "17:00");
    setBreakMinutes("30");
    setKilometers("0");
    setTravelTimeHours("0");
    setError(null);
    setSuccess(null);
    setOpen(true);
  }

  function handleShiftChange(id: string) {
    setShiftId(id);
    const shift = openShifts.find((s) => s.id === id);
    if (shift) {
      if (shift.startTime !== "—") setStartTime(shift.startTime);
      if (shift.endTime !== "—") setEndTime(shift.endTime);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setError("Selecteer een shift.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitOwnTimeEntryAction({
        projectId: selected.projectId,
        shiftId: selected.id,
        workDate: selected.date,
        startTime,
        endTime,
        breakMinutes: Number(breakMinutes) || 0,
        kilometers: Number(kilometers) || 0,
        travelTimeHours: Number(travelTimeHours) || 0,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Uren en kilometers ingediend. Planning beoordeelt je registratie.");
      setOpen(false);
      onSubmitted?.();
    });
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">
              Uren & kilometers indienen
            </CardTitle>
            <CardDescription>
              Vul gewerkte uren en kilometers in voor je toegewezen shifts. Goedkeuring
              gebeurt in het interne dashboard.
            </CardDescription>
          </div>
          <Button
            type="button"
            className="shrink-0 bg-[#F28C28] hover:bg-[#de7c1f]"
            disabled={openShifts.length === 0}
            onClick={openDialog}
          >
            <Plus className="mr-1 h-4 w-4" />
            Indienen
          </Button>
        </CardHeader>
        <CardContent>
          {success ? (
            <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </p>
          ) : null}
          {openShifts.length === 0 ? (
            <p className="text-sm text-slate-500">
              Geen openstaande shifts zonder urenregistratie. Heb je al uren ingevuld,
              of nog geen toegewezen shift?
            </p>
          ) : (
            <p className="text-sm text-slate-600">
              {openShifts.length} shift(s) klaar voor uren + km.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Uren & kilometers indienen</DialogTitle>
            <DialogDescription>
              Dezelfde registratie komt bij planning én (na goedkeuring) bij de
              opdrachtgever terecht.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="shiftId">Shift / project</Label>
              <select
                id="shiftId"
                value={shiftId}
                onChange={(e) => handleShiftChange(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {openShifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    {formatShiftDate(s.date)} — {s.projectName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Starttijd</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Eindtijd</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="breakMinutes">Pauze (min)</Label>
                <Input
                  id="breakMinutes"
                  type="number"
                  min={0}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kilometers">Kilometers</Label>
                <Input
                  id="kilometers"
                  type="number"
                  min={0}
                  step="0.1"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="travelTimeHours">Reistijd (u)</Label>
                <Input
                  id="travelTimeHours"
                  type="number"
                  min={0}
                  step="0.25"
                  value={travelTimeHours}
                  onChange={(e) => setTravelTimeHours(e.target.value)}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Berekende uren:{" "}
              <span className="font-semibold text-[#0B1F4D]">
                {previewHours.toFixed(2)} u
              </span>
            </p>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                className="bg-[#F28C28] hover:bg-[#de7c1f]"
                disabled={pending}
              >
                {pending ? "Bezig…" : "Indienen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
