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
  PROJECT_PLANNERS,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type Project,
  type ProjectType,
} from "@/data/projectsMockData";
import {
  createProjectFromForm,
  projectStatusLabels,
  projectTypeLabels,
  validateNewProjectForm,
  type NewProjectFormData,
} from "@/lib/projects-utils";

const emptyForm: NewProjectFormData = {
  naam: "",
  opdrachtgever: "",
  contact: "",
  email: "",
  telefoon: "",
  locatie: "",
  startDatum: "",
  eindDatum: "",
  startTijd: "08:00",
  eindTijd: "17:00",
  type: "overig",
  status: "aanvraag",
  planner: PROJECT_PLANNERS[0],
  crewNodig: "",
  functiesNodig: "",
  uurtarief: "",
  reiskostenPerKm: "0.25",
  verwachteOmzet: "",
  notities: "",
  crewBriefing: "",
};

type NewProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  initialData?: Partial<NewProjectFormData>;
  mode?: "create" | "edit";
  title?: string;
};

export default function NewProjectModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = "create",
  title,
}: NewProjectModalProps) {
  const [form, setForm] = useState<NewProjectFormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
      setErrors({});
    }
  }, [open, initialData]);

  function update(field: keyof NewProjectFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateNewProjectForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation as Record<string, string>);
      return;
    }

    setSaving(true);
    try {
      const project = createProjectFromForm(form);
      onSave(project);
      onOpenChange(false);
      setForm(emptyForm);
      setErrors({});
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {title ?? (mode === "edit" ? "Project bewerken" : "Nieuw project")}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Wijzig projectgegevens en sla op."
              : "Voeg een nieuw project toe aan Helping Hands Agency."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="naam">Projectnaam *</Label>
              <Input
                id="naam"
                value={form.naam}
                onChange={(e) => update("naam", e.target.value)}
                className={errors.naam ? "border-red-300" : ""}
              />
              {errors.naam && <p className="text-xs text-red-600">{errors.naam}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="opdrachtgever">Opdrachtgever *</Label>
              <Input
                id="opdrachtgever"
                value={form.opdrachtgever}
                onChange={(e) => update("opdrachtgever", e.target.value)}
                className={errors.opdrachtgever ? "border-red-300" : ""}
              />
              {errors.opdrachtgever && (
                <p className="text-xs text-red-600">{errors.opdrachtgever}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact">Contactpersoon</Label>
              <Input
                id="contact"
                value={form.contact}
                onChange={(e) => update("contact", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail contactpersoon</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefoon">Telefoon contactpersoon</Label>
              <Input
                id="telefoon"
                value={form.telefoon}
                onChange={(e) => update("telefoon", e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="locatie">Locatie *</Label>
              <Input
                id="locatie"
                value={form.locatie}
                onChange={(e) => update("locatie", e.target.value)}
                className={errors.locatie ? "border-red-300" : ""}
              />
              {errors.locatie && <p className="text-xs text-red-600">{errors.locatie}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startDatum">Startdatum *</Label>
              <Input
                id="startDatum"
                type="date"
                value={form.startDatum}
                onChange={(e) => update("startDatum", e.target.value)}
                className={errors.startDatum ? "border-red-300" : ""}
              />
              {errors.startDatum && (
                <p className="text-xs text-red-600">{errors.startDatum}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eindDatum">Einddatum</Label>
              <Input
                id="eindDatum"
                type="date"
                value={form.eindDatum}
                onChange={(e) => update("eindDatum", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="startTijd">Starttijd</Label>
              <Input
                id="startTijd"
                type="time"
                value={form.startTijd}
                onChange={(e) => update("startTijd", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eindTijd">Eindtijd</Label>
              <Input
                id="eindTijd"
                type="time"
                value={form.eindTijd}
                onChange={(e) => update("eindTijd", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Projecttype *</Label>
              <Select
                value={form.type}
                onValueChange={(v) => update("type", (v ?? "overig") as ProjectType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {projectTypeLabels[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v ?? "aanvraag")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {projectStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Planner / eigenaar</Label>
              <Select
                value={form.planner}
                onValueChange={(v) => update("planner", v ?? PROJECT_PLANNERS[0])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_PLANNERS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="crewNodig">Aantal crew nodig</Label>
              <Input
                id="crewNodig"
                type="number"
                min="0"
                value={form.crewNodig}
                onChange={(e) => update("crewNodig", e.target.value)}
                className={errors.crewNodig ? "border-red-300" : ""}
              />
              {errors.crewNodig && (
                <p className="text-xs text-red-600">{errors.crewNodig}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="functiesNodig">Functies nodig</Label>
              <Input
                id="functiesNodig"
                placeholder="bijv. Stagehand, Runner, Teamcaptain"
                value={form.functiesNodig}
                onChange={(e) => update("functiesNodig", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uurtarief">Uurtarief klant (€)</Label>
              <Input
                id="uurtarief"
                type="number"
                min="0"
                step="0.01"
                value={form.uurtarief}
                onChange={(e) => update("uurtarief", e.target.value)}
                className={errors.uurtarief ? "border-red-300" : ""}
              />
              {errors.uurtarief && (
                <p className="text-xs text-red-600">{errors.uurtarief}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reiskostenPerKm">Reiskostenvergoeding (€/km)</Label>
              <Input
                id="reiskostenPerKm"
                type="number"
                min="0"
                step="0.01"
                value={form.reiskostenPerKm}
                onChange={(e) => update("reiskostenPerKm", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="verwachteOmzet">Verwachte omzet (€)</Label>
              <Input
                id="verwachteOmzet"
                type="number"
                min="0"
                value={form.verwachteOmzet}
                onChange={(e) => update("verwachteOmzet", e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notities">Interne notities</Label>
              <textarea
                id="notities"
                rows={2}
                value={form.notities}
                onChange={(e) => update("notities", e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="crewBriefing">Briefing voor crew</Label>
              <textarea
                id="crewBriefing"
                rows={3}
                value={form.crewBriefing}
                onChange={(e) => update("crewBriefing", e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173A8A]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Annuleren
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Opslaan" : "Project aanmaken"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
