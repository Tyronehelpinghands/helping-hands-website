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
  createActionFromForm,
  DEMO_OWNERS,
  RELATED_MODULES,
  RISK_CATEGORIES,
  RISK_LEVELS,
  RISK_PRIORITIES,
  RISK_STATUSES,
  type RiskAction,
  type RiskFormData,
} from "@/lib/riskActions";

const emptyForm = (): RiskFormData => ({
  title: "",
  description: "",
  category: "Operationeel",
  priority: "Normaal",
  riskLevel: "Middel",
  status: "Nieuw",
  owner: DEMO_OWNERS[0],
  dueDate: "",
  relatedModule: "",
  relatedProject: "",
  relatedClient: "",
  impact: "",
  actionRequired: "",
  nextStep: "",
  notes: "",
});

export default function RiskActionFormModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  existingId,
  mode = "create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (action: RiskAction) => void;
  initialData?: RiskFormData;
  existingId?: string;
  mode?: "create" | "edit";
}) {
  const [form, setForm] = useState<RiskFormData>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initialData ?? emptyForm());
  }, [open, initialData]);

  function update<K extends keyof RiskFormData>(field: K, value: RiskFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setSaving(true);
    onSave(createActionFromForm(form, existingId));
    setSaving(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {mode === "edit" ? "Actie bewerken" : "Nieuwe actie"}
          </DialogTitle>
          <DialogDescription>
            Registreer een risico of opvolgactie voor intern beheer.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Titel</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Beschrijving</Label>
            <Input value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Categorie</Label>
            <Select value={form.category} onValueChange={(v) => update("category", (v ?? "Operationeel") as RiskFormData["category"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RISK_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Prioriteit</Label>
            <Select value={form.priority} onValueChange={(v) => update("priority", (v ?? "Normaal") as RiskFormData["priority"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RISK_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Risiconiveau</Label>
            <Select value={form.riskLevel} onValueChange={(v) => update("riskLevel", (v ?? "Middel") as RiskFormData["riskLevel"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RISK_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => update("status", (v ?? "Nieuw") as RiskFormData["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RISK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Eigenaar</Label>
            <Select value={form.owner} onValueChange={(v) => update("owner", v ?? DEMO_OWNERS[0])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DEMO_OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Deadline</Label>
            <Input type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Gerelateerde module</Label>
            <Select value={form.relatedModule || "none"} onValueChange={(v) => update("relatedModule", v === "none" ? "" : v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Geen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Geen</SelectItem>
                {RELATED_MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Gerelateerd project</Label>
            <Input value={form.relatedProject} onChange={(e) => update("relatedProject", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Gerelateerde klant</Label>
            <Input value={form.relatedClient} onChange={(e) => update("relatedClient", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Impact</Label>
            <Input value={form.impact} onChange={(e) => update("impact", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Actie vereist</Label>
            <Input value={form.actionRequired} onChange={(e) => update("actionRequired", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Volgende stap</Label>
            <Input value={form.nextStep} onChange={(e) => update("nextStep", e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notities</Label>
            <Input value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuleren</Button>
          <Button type="button" onClick={handleSubmit} disabled={saving || !form.title.trim() || !form.actionRequired.trim()}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Opslaan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
