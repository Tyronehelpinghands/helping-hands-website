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
  CREW_STATUSES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  type Project,
} from "@/data/projectsMockData";
import {
  crewStatusLabels,
  defaultProjectsFilters,
  getProjectFilterOptions,
  projectStatusLabels,
  projectTypeLabels,
  type ProjectsFilterState,
} from "@/lib/projects-utils";

type ProjectsFiltersProps = {
  projects: Project[];
  filters: ProjectsFilterState;
  onChange: (filters: ProjectsFilterState) => void;
};

export default function ProjectsFilters({
  projects,
  filters,
  onChange,
}: ProjectsFiltersProps) {
  const options = getProjectFilterOptions(projects);

  function update(partial: Partial<ProjectsFilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          placeholder="Zoek projectnaam, opdrachtgever, locatie…"
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
            {PROJECT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {projectStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.dateFilter}
          onValueChange={(v) => update({ dateFilter: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Datum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle datums</SelectItem>
            <SelectItem value="today">Vandaag</SelectItem>
            <SelectItem value="week">Deze week</SelectItem>
            <SelectItem value="month">Deze maand</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.projectType}
          onValueChange={(v) => update({ projectType: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Projecttype" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle types</SelectItem>
            {PROJECT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {projectTypeLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.planner}
          onValueChange={(v) => update({ planner: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Planner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle planners</SelectItem>
            {options.planners.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.crewStatus}
          onValueChange={(v) => update({ crewStatus: v ?? "all" })}
        >
          <SelectTrigger className="border-slate-200/80 bg-[#F5F7FA]/60">
            <SelectValue placeholder="Crewstatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle crewstatussen</SelectItem>
            {CREW_STATUSES.map((c) => (
              <SelectItem key={c} value={c}>
                {crewStatusLabels[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultProjectsFilters)}
          className="text-[#173A8A]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
