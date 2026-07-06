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
  CREW_CERTIFICATES,
  CREW_EMPLOYMENT_TYPES,
  CREW_ROLE_GROUPS,
  CREW_STATUSES,
  defaultCrewFilters,
  type CrewFilters,
} from "@/lib/crew";

type CrewFiltersBarProps = {
  filters: CrewFilters;
  onChange: (filters: CrewFilters) => void;
};

export default function CrewFiltersBar({ filters, onChange }: CrewFiltersBarProps) {
  function update(partial: Partial<CrewFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Input
          placeholder="Zoek naam, functie, stad, skill…"
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
            {CREW_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.roleGroup}
          onValueChange={(v) => update({ roleGroup: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Functiegroep" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle groepen</SelectItem>
            {Object.keys(CREW_ROLE_GROUPS).map((g) => (
              <SelectItem key={g} value={g}>
                {g}
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
            {CREW_EMPLOYMENT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.certificate}
          onValueChange={(v) => update({ certificate: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Certificaat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle certificaten</SelectItem>
            {CREW_CERTIFICATES.map((c) => (
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
        onClick={() => onChange(defaultCrewFilters)}
        className="text-[#173A8A]"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset filters
      </Button>
    </div>
  );
}
