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
  defaultHoursFilters,
  HOURS_EMPLOYMENT_TYPES,
  HOURS_SOURCES,
  HOURS_STATUSES,
  type HoursFilters,
} from "@/lib/hours";

type HoursFiltersBarProps = {
  filters: HoursFilters;
  onChange: (filters: HoursFilters) => void;
};

const WEEK_OPTIONS = [
  { value: "all", label: "Alle weken" },
  { value: "this_week", label: "Deze week" },
  { value: "last_week", label: "Vorige week" },
  { value: "week_25", label: "Week 25" },
  { value: "week_26", label: "Week 26" },
  { value: "week_27", label: "Week 27" },
  { value: "week_28", label: "Week 28" },
];

export default function HoursFiltersBar({
  filters,
  onChange,
}: HoursFiltersBarProps) {
  function update(partial: Partial<HoursFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          placeholder="Zoek project, klant, locatie, crew…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 xl:col-span-2"
        />
        <Select
          value={filters.week}
          onValueChange={(v) => update({ week: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Week" />
          </SelectTrigger>
          <SelectContent>
            {WEEK_OPTIONS.map((w) => (
              <SelectItem key={w.value} value={w.value}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => update({ status: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            {HOURS_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.employmentType}
          onValueChange={(v) => update({ employmentType: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Dienstverband" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle dienstverbanden</SelectItem>
            {HOURS_EMPLOYMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
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
            {HOURS_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange(defaultHoursFilters)}
        className="text-[#173A8A]"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset filters
      </Button>
    </div>
  );
}
