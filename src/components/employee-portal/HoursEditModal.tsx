"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { EmployeeHoursEntry } from "@/lib/employeePortal";
import { formatShiftDate } from "@/lib/employeePortal";
import { calculateWorkedHours } from "@/lib/dashboard/calculations";

export type HoursEditFormData = {
  startTime: string;
  endTime: string;
  breakMinutes: string;
  kilometers: string;
  travelTimeHours: string;
};

type HoursEditModalProps = {
  entry: EmployeeHoursEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entryId: string, data: HoursEditFormData) => void;
  pending?: boolean;
};

export default function HoursEditModal({
  entry,
  open,
  onOpenChange,
  onSubmit,
  pending = false,
}: HoursEditModalProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("0");
  const [kilometers, setKilometers] = useState("0");
  const [travelTimeHours, setTravelTimeHours] = useState("0");

  useEffect(() => {
    if (!entry || !open) return;
    setStartTime(entry.startTime !== "—" ? entry.startTime : "09:00");
    setEndTime(entry.endTime !== "—" ? entry.endTime : "17:00");
    setBreakMinutes(String(entry.breakMinutes ?? 0));
    setKilometers(String(entry.kilometers ?? 0));
    setTravelTimeHours(String(entry.travelTimeHours ?? 0));
  }, [entry, open]);

  const previewHours = calculateWorkedHours(
    startTime,
    endTime,
    Number(breakMinutes) || 0,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entry) return;
    onSubmit(entry.id, {
      startTime,
      endTime,
      breakMinutes,
      kilometers,
      travelTimeHours,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Uren & kilometers aanpassen</DialogTitle>
          <DialogDescription>
            {entry
              ? `${entry.projectName} — ${formatShiftDate(entry.date)}`
              : "Pas je registratie aan vóór goedkeuring."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="editStart">Starttijd</Label>
              <Input
                id="editStart"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEnd">Eindtijd</Label>
              <Input
                id="editEnd"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="editBreak">Pauze (min)</Label>
              <Input
                id="editBreak"
                type="number"
                min={0}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editKm">Kilometers</Label>
              <Input
                id="editKm"
                type="number"
                min={0}
                step="0.1"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTravel">Reistijd (u)</Label>
              <Input
                id="editTravel"
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
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              className="bg-[#173A8A] hover:bg-[#0B1F4D]"
              disabled={pending}
            >
              {pending ? "Bezig…" : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
