"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Route } from "lucide-react";
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
import InvoiceLineEditor from "@/components/dashboard/facturatie/InvoiceLineEditor";
import MoneybirdContactSelector from "@/components/dashboard/facturatie/MoneybirdContactSelector";
import {
  buildLinesFromApprovedHours,
  calculateInvoiceTotals,
  createDraftFromForm,
  createEmptyLine,
  createTravelLine,
  DEMO_CLIENTS,
  formatCurrency,
  getApprovedHoursForInvoicing,
  INVOICE_STATUSES,
  type InvoiceDraft,
  type InvoiceFormData,
} from "@/lib/invoicing";

const emptyForm = (): InvoiceFormData => ({
  clientName: DEMO_CLIENTS[0],
  contactId: "",
  reference: `Helping Hands - Week ${new Date().toISOString().slice(0, 10)}`,
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  projectName: "",
  status: "Concept",
  notes: "",
  lines: [createEmptyLine()],
});

type InvoiceBuilderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (draft: InvoiceDraft, readyForMoneybird?: boolean) => void;
  initialData?: InvoiceFormData;
  existingId?: string;
  mode?: "create" | "edit";
};

export default function InvoiceBuilderModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  existingId,
  mode = "create",
}: InvoiceBuilderModalProps) {
  const [form, setForm] = useState<InvoiceFormData>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData ?? emptyForm());
    }
  }, [open, initialData]);

  const totals = useMemo(
    () => calculateInvoiceTotals(form.lines),
    [form.lines],
  );

  function updateForm(partial: Partial<InvoiceFormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function updateLine(index: number, line: InvoiceFormData["lines"][number]) {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((l, i) => (i === index ? line : l)),
    }));
  }

  function removeLine(index: number) {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  }

  function addLine() {
    setForm((prev) => ({
      ...prev,
      lines: [...prev.lines, createEmptyLine()],
    }));
  }

  function addTravelLine() {
    const crew = "Demo Crew 1";
    const project = form.projectName || "Project";
    const date = form.invoiceDate;
    setForm((prev) => ({
      ...prev,
      lines: [...prev.lines, createTravelLine(crew, project, date, 0)],
    }));
  }

  function importApprovedHours() {
    const hours = getApprovedHoursForInvoicing().filter(
      (h) => !form.clientName || h.clientName === form.clientName,
    );
    const lines =
      hours.length > 0 ? buildLinesFromApprovedHours(hours) : buildLinesFromApprovedHours();
    setForm((prev) => ({ ...prev, lines }));
  }

  function handleSave(readyForMoneybird = false) {
    setSaving(true);
    const draft = createDraftFromForm(
      {
        ...form,
        status: readyForMoneybird ? "Klaar voor Moneybird" : form.status,
      },
      existingId,
    );
    onSave(draft, readyForMoneybird);
    setSaving(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#0B1F4D]">
            {mode === "edit" ? "Factuurconcept bewerken" : "Factuurconcept maken"}
          </DialogTitle>
          <DialogDescription>
            Stel factuurregels samen op basis van goedgekeurde uren en reiskosten.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Klantnaam</Label>
              <Select
                value={form.clientName}
                onValueChange={(v) => updateForm({ clientName: v ?? "" })}
              >
                <SelectTrigger>
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
              <Label>Projectnaam</Label>
              <Input
                value={form.projectName}
                onChange={(e) => updateForm({ projectName: e.target.value })}
                placeholder="GelreDome Arnhem"
              />
            </div>
          </div>

          <MoneybirdContactSelector
            value={form.contactId}
            clientName={form.clientName}
            onChange={(contactId) => updateForm({ contactId })}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Referentie</Label>
              <Input
                value={form.reference}
                onChange={(e) => updateForm({ reference: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  updateForm({
                    status: (v ?? "Concept") as InvoiceFormData["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Factuurdatum</Label>
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => updateForm({ invoiceDate: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vervaldatum</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => updateForm({ dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Factuurregels
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={importApprovedHours}>
                  Uren importeren
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={addLine}>
                  <Plus className="h-4 w-4" />
                  Regel toevoegen
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={addTravelLine}>
                  <Route className="h-4 w-4" />
                  Reiskostenregel
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {form.lines.map((line, index) => (
                <InvoiceLineEditor
                  key={line.id}
                  line={line}
                  index={index}
                  onChange={(updated) => updateLine(index, updated)}
                  onRemove={() => removeLine(index)}
                  canRemove={form.lines.length > 1}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#F5F7FA]/80 px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotaal excl. btw</span>
              <span className="font-medium">{formatCurrency(totals.subtotalExVat)}</span>
            </div>
            <div className="flex justify-between">
              <span>Btw 21%</span>
              <span className="font-medium">{formatCurrency(totals.vatAmount)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-200/80 pt-2 font-bold text-[#0B1F4D]">
              <span>Totaal incl. btw</span>
              <span>{formatCurrency(totals.totalInclVat)}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Notities</Label>
            <Input
              value={form.notes}
              onChange={(e) => updateForm({ notes: e.target.value })}
              placeholder="Interne notitie (optioneel)"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving || !form.reference.trim()}
          >
            Concept opslaan
          </Button>
          <Button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || !form.reference.trim()}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Klaarzetten voor Moneybird
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
