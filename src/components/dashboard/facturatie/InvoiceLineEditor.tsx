"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  calculateLineTotal,
  formatCurrency,
  type InvoiceLine,
} from "@/lib/invoicing";

type InvoiceLineEditorProps = {
  line: InvoiceLine;
  index: number;
  onChange: (line: InvoiceLine) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function InvoiceLineEditor({
  line,
  index,
  onChange,
  onRemove,
  canRemove,
}: InvoiceLineEditorProps) {
  function update<K extends keyof InvoiceLine>(field: K, value: InvoiceLine[K]) {
    const next = { ...line, [field]: value };
    if (field === "quantity" || field === "price") {
      next.totalExVat = calculateLineTotal(
        field === "quantity" ? (value as number) : line.quantity,
        field === "price" ? (value as number) : line.price,
      );
    }
    onChange(next);
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
          Regel {index + 1}
        </p>
        {canRemove && (
          <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Omschrijving</Label>
          <Input
            value={line.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Site crew – Demo Crew 1 – Project – datum – tijden"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Aantal</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            value={line.quantity}
            onChange={(e) => update("quantity", Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Eenheid</Label>
          <Select
            value={line.unit}
            onValueChange={(v) =>
              update("unit", (v ?? "uur") as InvoiceLine["unit"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uur">uur</SelectItem>
              <SelectItem value="km">km</SelectItem>
              <SelectItem value="stuk">stuk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Prijs</Label>
          <Input
            type="number"
            step="0.01"
            min={0}
            value={line.price}
            onChange={(e) => update("price", Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Btw</Label>
          <Input value="21%" readOnly className="bg-slate-50" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Totaal excl. btw</Label>
          <p className="text-sm font-semibold text-[#0B1F4D]">
            {formatCurrency(line.totalExVat)}
          </p>
        </div>
      </div>
    </div>
  );
}
