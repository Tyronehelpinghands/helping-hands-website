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
  LEAD_OWNERS,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
} from "@/data/leadsMockData";
import {
  createLeadFromForm,
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  validateNewLeadForm,
  type NewLeadFormData,
} from "@/lib/leads-utils";

const emptyForm: NewLeadFormData = {
  bedrijf: "",
  contact: "",
  email: "",
  telefoon: "",
  website: "",
  bron: "handmatig",
  status: "nieuw",
  prioriteit: "normaal",
  waarde: "",
  eigenaar: LEAD_OWNERS[0],
  volgendeActie: "",
  volgendeActieDatum: "",
  notities: "",
};

type NewLeadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lead: Lead) => void;
  initialData?: Partial<NewLeadFormData>;
  mode?: "create" | "edit";
  title?: string;
};

export default function NewLeadModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode = "create",
  title,
}: NewLeadModalProps) {
  const [form, setForm] = useState<NewLeadFormData>({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initialData });
      setErrors({});
    }
  }, [open, initialData]);

  function update(field: keyof NewLeadFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateNewLeadForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation as Record<string, string>);
      return;
    }

    setSaving(true);
    try {
      const lead = createLeadFromForm(form);
      onSave(lead);
      onOpenChange(false);
      setForm(emptyForm);
      setErrors({});
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {title ?? (mode === "edit" ? "Lead bewerken" : "Nieuwe lead")}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Wijzig leadgegevens en sla op."
              : "Voeg een nieuwe lead toe aan Helping Hands Agency."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bedrijf">Bedrijfsnaam *</Label>
              <Input
                id="bedrijf"
                value={form.bedrijf}
                onChange={(e) => update("bedrijf", e.target.value)}
                className={errors.bedrijf ? "border-red-300" : ""}
              />
              {errors.bedrijf && (
                <p className="text-xs text-red-600">{errors.bedrijf}</p>
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
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefoon">Telefoon</Label>
              <Input
                id="telefoon"
                value={form.telefoon}
                onChange={(e) => update("telefoon", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bron</Label>
              <Select
                value={form.bron}
                onValueChange={(v) => v && update("bron", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {leadSourceLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => v && update("status", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {leadStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioriteit</Label>
              <Select
                value={form.prioriteit}
                onValueChange={(v) => v && update("prioriteit", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {leadPriorityLabels[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="waarde">Potentiële waarde (€)</Label>
              <Input
                id="waarde"
                type="number"
                min="0"
                value={form.waarde}
                onChange={(e) => update("waarde", e.target.value)}
                className={errors.waarde ? "border-red-300" : ""}
              />
              {errors.waarde && (
                <p className="text-xs text-red-600">{errors.waarde}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Eigenaar</Label>
              <Select
                value={form.eigenaar}
                onValueChange={(v) => v && update("eigenaar", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_OWNERS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="volgendeActie">Volgende actie</Label>
              <Input
                id="volgendeActie"
                value={form.volgendeActie}
                onChange={(e) => update("volgendeActie", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="volgendeActieDatum">Volgende actie datum</Label>
              <Input
                id="volgendeActieDatum"
                type="date"
                value={form.volgendeActieDatum}
                onChange={(e) => update("volgendeActieDatum", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notities">Notities</Label>
              <textarea
                id="notities"
                rows={3}
                value={form.notities}
                onChange={(e) => update("notities", e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
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
              type="submit"
              disabled={saving}
              className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Opslaan" : "Lead toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
