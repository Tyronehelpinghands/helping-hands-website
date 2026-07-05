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
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
} from "@/data/leadsMockData";
import {
  defaultLeadsFilters,
  getLeadFilterOptions,
  leadPriorityLabels,
  leadSourceLabels,
  leadStatusLabels,
  type LeadsFilterState,
} from "@/lib/leads-utils";

type LeadsFiltersProps = {
  leads: Lead[];
  filters: LeadsFilterState;
  onChange: (filters: LeadsFilterState) => void;
};

export default function LeadsFilters({
  leads,
  filters,
  onChange,
}: LeadsFiltersProps) {
  const options = getLeadFilterOptions(leads);

  function update(partial: Partial<LeadsFilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          placeholder="Zoek bedrijf, contact, e-mail…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 xl:col-span-2"
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
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {leadStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.owner}
          onValueChange={(v) => update({ owner: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Eigenaar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle eigenaren</SelectItem>
            {options.owners.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.source}
          onValueChange={(v) => update({ source: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Bron" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle bronnen</SelectItem>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {leadSourceLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.priority}
          onValueChange={(v) => update({ priority: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Prioriteit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle prioriteiten</SelectItem>
            {LEAD_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {leadPriorityLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.dateFilter}
          onValueChange={(v) => update({ dateFilter: v ?? "all" })}
        >
          <SelectTrigger className="h-8 w-auto min-w-[140px] border-slate-200/80 bg-white text-xs">
            <SelectValue placeholder="Datum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle datums</SelectItem>
            <SelectItem value="today">Vandaag</SelectItem>
            <SelectItem value="week">Deze week</SelectItem>
            <SelectItem value="month">Deze maand</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultLeadsFilters)}
          className="text-[#173A8A]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
