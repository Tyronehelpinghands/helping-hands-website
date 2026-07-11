"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultInvoiceFilters,
  INVOICE_STATUSES,
  type InvoiceFilters,
} from "@/lib/invoicing";

type InvoiceFiltersBarProps = {
  filters: InvoiceFilters;
  onChange: (filters: InvoiceFilters) => void;
};

const PERIOD_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "this_month", label: "Deze maand" },
  { value: "last_month", label: "Vorige maand" },
  { value: "week_25", label: "Week 25" },
  { value: "week_26", label: "Week 26" },
  { value: "week_27", label: "Week 27" },
];

export default function InvoiceFiltersBar({
  filters,
  onChange,
}: InvoiceFiltersBarProps) {
  function update(partial: Partial<InvoiceFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Zoek klant, project, referentie…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 sm:col-span-2"
        />
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            {INVOICE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.period}
          onValueChange={(v) => update({ period: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(defaultInvoiceFilters)}
        className="text-[#173A8A]"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset filters
      </Button>
    </div>
  );
}
