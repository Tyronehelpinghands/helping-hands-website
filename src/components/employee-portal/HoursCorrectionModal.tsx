"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
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
import type {
  EmployeeHoursCorrectionRequest,
  EmployeeHoursEntry,
} from "@/lib/employeePortal";
import { formatShiftDate } from "@/lib/employeePortal";

export type HoursCorrectionFormData = {
  reason: string;
  requestedStartTime: string;
  requestedEndTime: string;
  requestedBreakMinutes: string;
  explanation: string;
};

type HoursCorrectionModalProps = {
  entry: EmployeeHoursEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entryId: string, data: HoursCorrectionFormData) => void;
};

export default function HoursCorrectionModal({
  entry,
  open,
  onOpenChange,
  onSubmit,
}: HoursCorrectionModalProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      setSubmitted(false);
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entry) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    onSubmit(entry.id, {
      reason: String(data.get("reason") ?? ""),
      requestedStartTime: String(data.get("requestedStartTime") ?? ""),
      requestedEndTime: String(data.get("requestedEndTime") ?? ""),
      requestedBreakMinutes: String(data.get("requestedBreakMinutes") ?? ""),
      explanation: String(data.get("explanation") ?? ""),
    });
    setSubmitted(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Wijziging doorgeven</DialogTitle>
          <DialogDescription>
            {entry
              ? `${entry.projectName} — ${formatShiftDate(entry.date)}`
              : "Geef een wijziging door aan planning."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700">
            Je wijziging is doorgegeven. Planning controleert dit en past je uren aan
            als dit klopt.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Wat klopt er niet?</Label>
              <Input
                id="reason"
                name="reason"
                required
                placeholder="Bijv. eindtijd onjuist"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="requestedStartTime">Gewenste starttijd</Label>
                <Input
                  id="requestedStartTime"
                  name="requestedStartTime"
                  type="time"
                  defaultValue={entry?.startTime}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedEndTime">Gewenste eindtijd</Label>
                <Input
                  id="requestedEndTime"
                  name="requestedEndTime"
                  type="time"
                  defaultValue={entry?.endTime}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedBreakMinutes">Gewenste pauze (minuten)</Label>
              <Input
                id="requestedBreakMinutes"
                name="requestedBreakMinutes"
                type="number"
                min={0}
                defaultValue={entry?.breakMinutes}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="explanation">Toelichting</Label>
              <Input
                id="explanation"
                name="explanation"
                required
                placeholder="Extra toelichting voor planning"
              />
            </div>
            <div className="space-y-2">
              <Label>Bijlage</Label>
              <Button type="button" variant="outline" className="w-full" disabled>
                <Paperclip className="mr-2 h-4 w-4" />
                Bijlage uploaden — Binnenkort
              </Button>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Annuleren
              </Button>
              <Button type="submit" className="bg-[#F28C28] hover:bg-[#de7c1f]">
                Wijziging versturen
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function buildCorrectionRequest(
  data: HoursCorrectionFormData,
): EmployeeHoursCorrectionRequest {
  return {
    reason: data.reason,
    requestedStartTime: data.requestedStartTime || undefined,
    requestedEndTime: data.requestedEndTime || undefined,
    requestedBreakMinutes: data.requestedBreakMinutes
      ? Number(data.requestedBreakMinutes)
      : undefined,
    explanation: data.explanation,
    requestedAt: new Date().toISOString(),
    status: "Ingediend",
  };
}
