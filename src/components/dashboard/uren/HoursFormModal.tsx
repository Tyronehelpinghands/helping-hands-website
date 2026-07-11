"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Route } from "lucide-react";
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
import {
  calcTravelCost,
  calcWorkedHours,
  createHoursFromForm,
  DEFAULT_ROLE_RATES,
  DEFAULT_TRAVEL_RATE_PER_KM,
  DEMO_CLIENTS,
  DEMO_CREW_NAMES,
  formatEuro,
  getDefaultRateForRole,
  HOURS_EMPLOYMENT_TYPES,
  HOURS_STATUSES,
  type HoursFormData,
  type HoursEntry,
} from "@/lib/hours";

const emptyForm: HoursFormData = {
  projectName: "",
  clientName: DEMO_CLIENTS[0],
  locationName: "",
  locationAddress: "",
  crewMemberName: DEMO_CREW_NAMES[0],
  role: "Eventmedewerker",
  employmentType: "ZZP",
  date: new Date().toISOString().slice(0, 10),
  startTime: "08:00",
  endTime: "17:00",
  breakMinutes: "45",
  billableHours: "",
  clientHourlyRate: String(getDefaultRateForRole("Eventmedewerker")),
  crewHourlyRate: "",
  travelRatePerKm: String(DEFAULT_TRAVEL_RATE_PER_KM),
  kilometers: "0",
  returnTrip: false,
  status: "Concept",
  notes: "",
};

type HoursFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: HoursEntry) => void;
  initialData?: Partial<HoursFormData>;
  existingId?: string;
  mode?: "create" | "edit";
};

export default function HoursFormModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  existingId,
  mode = "create",
}: HoursFormModalProps) {
  const [form, setForm] = useState<HoursFormData>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);
  const [kmApiAvailable, setKmApiAvailable] = useState(false);
  const [kmMessage, setKmMessage] = useState<string | null>(null);
  const [kmLoading, setKmLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
      setKmMessage(null);
    }
  }, [open, initialData]);

  useEffect(() => {
    fetch("/api/kilometers", { method: "HEAD" })
      .then((res) => setKmApiAvailable(res.ok))
      .catch(() => setKmApiAvailable(false));
  }, []);

  const workedHours = useMemo(
    () =>
      calcWorkedHours(
        form.startTime,
        form.endTime,
        Number(form.breakMinutes) || 0,
      ),
    [form.startTime, form.endTime, form.breakMinutes],
  );

  const effectiveKm = form.returnTrip
    ? (Number(form.kilometers) || 0) * 2
    : Number(form.kilometers) || 0;

  const travelCost = calcTravelCost(
    effectiveKm,
    Number(form.travelRatePerKm) || DEFAULT_TRAVEL_RATE_PER_KM,
  );

  useEffect(() => {
    if (!form.billableHours && workedHours > 0) {
      setForm((prev) => ({ ...prev, billableHours: String(workedHours) }));
    }
  }, [workedHours, form.billableHours]);

  function update<K extends keyof HoursFormData>(
    field: K,
    value: HoursFormData[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "role" && typeof value === "string") {
        next.clientHourlyRate = String(getDefaultRateForRole(value));
      }
      return next;
    });
  }

  async function handleCalculateKm() {
    setKmLoading(true);
    setKmMessage(null);
    try {
      if (!kmApiAvailable) {
        setKmMessage(
          "Kilometerberekening gebruikt later de Google Maps koppeling.",
        );
        return;
      }
      const res = await fetch("/api/kilometers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: form.locationAddress,
          toAddress: form.locationAddress,
        }),
      });
      const data = await res.json();
      if (data.kilometers) {
        update("kilometers", String(data.kilometers));
        setKmMessage(`Berekend: ${data.kilometers} km`);
      } else {
        setKmMessage(
          "Kilometerberekening gebruikt later de Google Maps koppeling.",
        );
      }
    } catch {
      setKmMessage(
        "Kilometerberekening gebruikt later de Google Maps koppeling.",
      );
    } finally {
      setKmLoading(false);
    }
  }

  function handleSubmit() {
    setSaving(true);
    const entry = createHoursFromForm(form, existingId);
    onSave(entry);
    setSaving(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {mode === "edit" ? "Uren bewerken" : "Uren toevoegen"}
          </DialogTitle>
          <DialogDescription>
            Vul project-, crew- en uurgegevens in. Bedragen worden automatisch
            berekend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Project
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="projectName">Projectnaam</Label>
                <Input
                  id="projectName"
                  value={form.projectName}
                  onChange={(e) => update("projectName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientName">Klantnaam</Label>
                <Select
                  value={form.clientName}
                  onValueChange={(v) => update("clientName", v ?? "")}
                >
                  <SelectTrigger id="clientName">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_CLIENTS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="locationName">Locatie</Label>
                <Input
                  id="locationName"
                  value={form.locationName}
                  onChange={(e) => update("locationName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="locationAddress">Locatie adres</Label>
                <Input
                  id="locationAddress"
                  value={form.locationAddress}
                  onChange={(e) => update("locationAddress", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Crew
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="crewMemberName">Crewlid</Label>
                <Select
                  value={form.crewMemberName}
                  onValueChange={(v) => update("crewMemberName", v ?? "")}
                >
                  <SelectTrigger id="crewMemberName">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_CREW_NAMES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Functie</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => update("role", v ?? "")}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(DEFAULT_ROLE_RATES).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="employmentType">Dienstverband</Label>
                <Select
                  value={form.employmentType}
                  onValueChange={(v) =>
                    update(
                      "employmentType",
                      (v ?? "ZZP") as HoursFormData["employmentType"],
                    )
                  }
                >
                  <SelectTrigger id="employmentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS_EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Uren
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="date">Datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startTime">Starttijd</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">Eindtijd</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="breakMinutes">Pauze (minuten)</Label>
                <Input
                  id="breakMinutes"
                  type="number"
                  min={0}
                  value={form.breakMinutes}
                  onChange={(e) => update("breakMinutes", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gewerkte uren</Label>
                <Input value={`${workedHours} u`} readOnly className="bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billableHours">Facturabele uren</Label>
                <Input
                  id="billableHours"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.billableHours}
                  onChange={(e) => update("billableHours", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Tarieven & reiskosten
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="clientHourlyRate">Klanttarief per uur</Label>
                <Input
                  id="clientHourlyRate"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.clientHourlyRate}
                  onChange={(e) => update("clientHourlyRate", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="crewHourlyRate">Crewtarief per uur</Label>
                <Input
                  id="crewHourlyRate"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.crewHourlyRate}
                  onChange={(e) => update("crewHourlyRate", e.target.value)}
                  placeholder="Optioneel"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="travelRatePerKm">Reiskosten per km</Label>
                <Input
                  id="travelRatePerKm"
                  type="number"
                  step="0.01"
                  min={0}
                  value={form.travelRatePerKm}
                  onChange={(e) => update("travelRatePerKm", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kilometers">Kilometers</Label>
                <Input
                  id="kilometers"
                  type="number"
                  step="0.1"
                  min={0}
                  value={form.kilometers}
                  onChange={(e) => update("kilometers", e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2 sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.returnTrip}
                    onChange={(e) => update("returnTrip", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Retour (km × 2)
                </label>
                <span className="text-sm font-medium text-[#173A8A]">
                  Reiskosten: {formatEuro(travelCost)}
                  {form.returnTrip && effectiveKm > 0
                    ? ` (${effectiveKm} km)`
                    : ""}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => void handleCalculateKm()}
                disabled={kmLoading}
              >
                {kmLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Route className="h-4 w-4" />
                )}
                Kilometers berekenen
              </Button>
              {kmMessage && (
                <p className="text-xs text-[#101828]/65">{kmMessage}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Status & notities
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    update("status", (v ?? "Concept") as HoursFormData["status"])
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="notes">Interne notitie</Label>
                <Input
                  id="notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Optioneel"
                />
              </div>
            </div>
          </fieldset>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuleren
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={saving || !form.projectName.trim()}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
