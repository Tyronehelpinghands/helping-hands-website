"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShiftbaseDescriptionPreview from "@/components/planning/ShiftbaseDescriptionPreview";
import { PLANNING_PLANNERS } from "@/data/planningMockData";
import type { PlanningShift } from "@/data/planningMockData";
import {
  createShiftFromForm,
  validateNewShiftForm,
  type NewShiftFormData,
} from "@/lib/planning-utils";

const emptyForm: NewShiftFormData = {
  title: "",
  clientName: "",
  locationName: "",
  locationAddress: "",
  date: "",
  startTime: "08:00",
  endTime: "17:00",
  breakMinutes: "30",
  roleName: "",
  crewNeeded: "1",
  customerHourlyRate: "",
  crewHourlyRate: "",
  travelFeePerKm: "0.25",
  description: "",
  internalNotes: "",
  crewBriefing: "",
  clothingRequirements: "",
  contactName: "",
  contactPhone: "",
  shiftbaseLocation: "",
  shiftbaseTeam: "",
  shiftbaseDepartment: "",
  planner: PLANNING_PLANNERS[0],
};

type NewShiftModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (shift: PlanningShift) => void;
  initialData?: Partial<NewShiftFormData>;
  mode?: "create" | "edit";
};

export default function NewShiftModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = "create",
}: NewShiftModalProps) {
  const [form, setForm] = useState<NewShiftFormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [previewShift, setPreviewShift] = useState<PlanningShift | null>(null);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
      setErrors({});
      setPreviewShift(null);
    }
  }, [open, initialData]);

  function update(field: keyof NewShiftFormData, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (next.title && next.date) {
        try {
          setPreviewShift(createShiftFromForm(next));
        } catch {
          setPreviewShift(null);
        }
      }
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateNewShiftForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation as Record<string, string>);
      return;
    }
    setSaving(true);
    try {
      const shift = createShiftFromForm(form);
      onSave(shift);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {mode === "edit" ? "Shift bewerken" : "Nieuwe shift"}
          </DialogTitle>
          <DialogDescription>
            Plan een nieuwe dienst voor Helping Hands Agency.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Project *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className={errors.title ? "border-red-300" : ""}
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientName">Opdrachtgever</Label>
              <Input
                id="clientName"
                value={form.clientName}
                onChange={(e) => update("clientName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locationName">Locatie *</Label>
              <Input
                id="locationName"
                value={form.locationName}
                onChange={(e) => update("locationName", e.target.value)}
                className={errors.locationName ? "border-red-300" : ""}
              />
              {errors.locationName && (
                <p className="text-xs text-red-600">{errors.locationName}</p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="locationAddress">Adres locatie</Label>
              <Input
                id="locationAddress"
                value={form.locationAddress}
                onChange={(e) => update("locationAddress", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={errors.date ? "border-red-300" : ""}
              />
              {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Planner</Label>
              <Select
                value={form.planner}
                onValueChange={(v) => update("planner", v ?? PLANNING_PLANNERS[0])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLANNING_PLANNERS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Starttijd *</Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
                className={errors.startTime ? "border-red-300" : ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">Eindtijd *</Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
                className={errors.endTime ? "border-red-300" : ""}
              />
              {errors.endTime && <p className="text-xs text-red-600">{errors.endTime}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="breakMinutes">Pauze (min)</Label>
              <Input
                id="breakMinutes"
                type="number"
                min="0"
                value={form.breakMinutes}
                onChange={(e) => update("breakMinutes", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roleName">Functie *</Label>
              <Input
                id="roleName"
                value={form.roleName}
                onChange={(e) => update("roleName", e.target.value)}
                className={errors.roleName ? "border-red-300" : ""}
              />
              {errors.roleName && <p className="text-xs text-red-600">{errors.roleName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="crewNeeded">Aantal crew nodig</Label>
              <Input
                id="crewNeeded"
                type="number"
                min="1"
                value={form.crewNeeded}
                onChange={(e) => update("crewNeeded", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="customerHourlyRate">Uurtarief klant (€)</Label>
              <Input
                id="customerHourlyRate"
                type="number"
                step="0.01"
                value={form.customerHourlyRate}
                onChange={(e) => update("customerHourlyRate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="crewHourlyRate">Uurtarief crew (€)</Label>
              <Input
                id="crewHourlyRate"
                type="number"
                step="0.01"
                value={form.crewHourlyRate}
                onChange={(e) => update("crewHourlyRate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="travelFeePerKm">Reiskosten/km (€)</Label>
              <Input
                id="travelFeePerKm"
                type="number"
                step="0.01"
                value={form.travelFeePerKm}
                onChange={(e) => update("travelFeePerKm", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Omschrijving voor Shiftbase</Label>
              <textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactName">Contactpersoon locatie</Label>
              <Input
                id="contactName"
                value={form.contactName}
                onChange={(e) => update("contactName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Telefoon contactpersoon</Label>
              <Input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="crewBriefing">Crew briefing</Label>
              <textarea
                id="crewBriefing"
                rows={2}
                value={form.crewBriefing}
                onChange={(e) => update("crewBriefing", e.target.value)}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="clothingRequirements">Kledingvoorschriften</Label>
              <Input
                id="clothingRequirements"
                value={form.clothingRequirements}
                onChange={(e) => update("clothingRequirements", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="internalNotes">Interne notities</Label>
              <textarea
                id="internalNotes"
                rows={2}
                value={form.internalNotes}
                onChange={(e) => update("internalNotes", e.target.value)}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          {previewShift && <ShiftbaseDescriptionPreview shift={previewShift} />}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Opslaan" : "Shift aanmaken"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
