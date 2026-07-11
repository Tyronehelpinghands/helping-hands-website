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
  defaultFinanceFilters,
  EXPENSE_CATEGORY_OPTIONS,
  FINANCE_PERIODS,
  INVOICE_STATUS_OPTIONS,
  type FinanceFilters,
} from "@/lib/finance";

type FinanceFiltersBarProps = {
  filters: FinanceFilters;
  onChange: (filters: FinanceFilters) => void;
};

export default function FinanceFiltersBar({
  filters,
  onChange,
}: FinanceFiltersBarProps) {
  function update(partial: Partial<FinanceFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Zoek klant, project, leverancier, factuur…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 sm:col-span-2"
        />
        <Select
          value={filters.period}
          onValueChange={(v) =>
            update({ period: (v ?? "Deze maand") as FinanceFilters["period"] })
          }
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            {FINANCE_PERIODS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v ?? "Alle" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {INVOICE_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.category}
          onValueChange={(v) => update({ category: v ?? "Alle" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(defaultFinanceFilters)}
        className="text-[#173A8A]"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset filters
      </Button>
    </div>
  );
}
