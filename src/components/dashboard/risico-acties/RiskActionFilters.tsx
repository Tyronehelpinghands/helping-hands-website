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
  defaultRiskFilters,
  RELATED_MODULES,
  RISK_CATEGORIES,
  RISK_LEVELS,
  RISK_PRIORITIES,
  RISK_STATUSES,
  type RiskFilters,
} from "@/lib/riskActions";

const DEADLINE_OPTIONS = [
  "Alle",
  "Vandaag",
  "Deze week",
  "Te laat",
  "Zonder deadline",
];

export default function RiskActionFiltersBar({
  filters,
  onChange,
}: {
  filters: RiskFilters;
  onChange: (f: RiskFilters) => void;
}) {
  function update(p: Partial<RiskFilters>) {
    onChange({ ...filters, ...p });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Input
          placeholder="Zoek titel, eigenaar, klant, project…"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="border-slate-200/80 bg-[#F5F7FA]/60 sm:col-span-2 xl:col-span-2"
        />
        <Select value={filters.category} onValueChange={(v) => update({ category: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle categorieën</SelectItem>
            {RISK_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.priority} onValueChange={(v) => update({ priority: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Prioriteit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle prioriteiten</SelectItem>
            {RISK_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={(v) => update({ status: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle statussen</SelectItem>
            {RISK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.riskLevel} onValueChange={(v) => update({ riskLevel: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Risico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle risiconiveaus</SelectItem>
            {RISK_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.module} onValueChange={(v) => update({ module: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alle">Alle modules</SelectItem>
            {RELATED_MODULES.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.deadline} onValueChange={(v) => update({ deadline: v ?? "Alle" })}>
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            {DEADLINE_OPTIONS.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="ghost" size="sm" className="text-[#173A8A]" onClick={() => onChange(defaultRiskFilters)}>
        <RotateCcw className="h-3.5 w-3.5" />
        Reset filters
      </Button>
    </div>
  );
}
