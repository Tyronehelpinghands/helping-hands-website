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
import {
  ALL_CREW_ROLES,
  CREW_EMPLOYMENT_TYPES,
  CREW_STATUSES,
  createCrewFromForm,
  type CrewFormData,
  type CrewMember,
} from "@/lib/crew";

const emptyForm: CrewFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  employmentType: "ZZP",
  status: "Onboarding",
  primaryRole: "",
  roles: "",
  skills: "",
  certificates: "",
  hasDriversLicense: false,
  hasCar: false,
  hourlyRate: "",
  travelRatePerKm: "0.25",
  shiftbaseEmployeeId: "",
  notes: "",
};

type CrewFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (member: CrewMember) => void;
  initialData?: Partial<CrewFormData>;
  mode?: "create" | "edit";
};

export default function CrewFormModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = "create",
}: CrewFormModalProps) {
  const [form, setForm] = useState<CrewFormData>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
    }
  }, [open, initialData]);

  function update<K extends keyof CrewFormData>(field: K, value: CrewFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;

    setSaving(true);
    try {
      const member = createCrewFromForm(form);
      onSave(member);
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
            {mode === "edit" ? "Crewlid bewerken" : "Crewlid toevoegen"}
          </DialogTitle>
          <DialogDescription>
            Vul crewgegevens in. Opslaan is voorlopig lokaal (demo).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Voornaam *</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Achternaam *</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefoon</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Woonplaats</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Dienstverband</Label>
              <Select
                value={form.employmentType}
                onValueChange={(v) =>
                  update("employmentType", (v ?? "ZZP") as CrewFormData["employmentType"])
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CREW_EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  update("status", (v ?? "Onboarding") as CrewFormData["status"])
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CREW_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="primaryRole">Hoofdfunctie</Label>
              <Select
                value={form.primaryRole || undefined}
                onValueChange={(v) => update("primaryRole", v ?? "")}
              >
                <SelectTrigger><SelectValue placeholder="Kies functie" /></SelectTrigger>
                <SelectContent>
                  {ALL_CREW_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="roles">Rollen (komma-gescheiden)</Label>
              <Input
                id="roles"
                placeholder="Stagehand, Runner"
                value={form.roles}
                onChange={(e) => update("roles", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="skills">Skills (komma-gescheiden)</Label>
              <Input
                id="skills"
                value={form.skills}
                onChange={(e) => update("skills", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="certificates">Certificaten (komma-gescheiden)</Label>
              <Input
                id="certificates"
                placeholder="VCA, Rijbewijs B"
                value={form.certificates}
                onChange={(e) => update("certificates", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasDriversLicense}
                  onChange={(e) => update("hasDriversLicense", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Rijbewijs
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasCar}
                  onChange={(e) => update("hasCar", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Auto
              </label>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Uurtarief intern (€)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={form.hourlyRate}
                onChange={(e) => update("hourlyRate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="travelRatePerKm">Reiskosten/km (€)</Label>
              <Input
                id="travelRatePerKm"
                type="number"
                step="0.01"
                value={form.travelRatePerKm}
                onChange={(e) => update("travelRatePerKm", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shiftbaseEmployeeId">Shiftbase medewerker ID</Label>
              <Input
                id="shiftbaseEmployeeId"
                value={form.shiftbaseEmployeeId}
                onChange={(e) => update("shiftbaseEmployeeId", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notities</Label>
              <textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Opslaan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
