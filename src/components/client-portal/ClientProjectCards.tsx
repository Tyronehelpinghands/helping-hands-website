"use client";

import { useState } from "react";
import { MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ClientProjectDrawer from "@/components/client-portal/ClientProjectDrawer";
import ClientStatusBadge from "@/components/client-portal/ClientStatusBadge";
import type { ClientProject } from "@/lib/clientPortal";
import { DEMO_CLIENT_PROJECTS, formatClientDate } from "@/lib/clientPortal";

const STATUS_FILTERS = ["Alle", "Aanvraag", "Gepland", "Bevestigd", "In uitvoering", "Afgerond", "Geannuleerd"] as const;

export default function ClientProjectCards({
  projects = DEMO_CLIENT_PROJECTS,
}: {
  projects?: ClientProject[];
}) {
  const [filter, setFilter] = useState<string>("Alle");
  const [selected, setSelected] = useState<ClientProject | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered =
    filter === "Alle" ? projects : projects.filter((p) => p.status === filter);

  function openProject(project: ClientProject) {
    setSelected(project);
    setDrawerOpen(true);
  }

  return (
    <>
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-black text-[#0B1F4D]">Projecten</CardTitle>
            <CardDescription>Overzicht van je projecten en statussen.</CardDescription>
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v ?? "Alle")}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-500 sm:col-span-2">Geen projecten gevonden.</p>
          ) : (
            filtered.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => openProject(project)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#173A8A]/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[#0B1F4D]">{project.projectName}</p>
                  <ClientStatusBadge status={project.status} variant="project" />
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {project.locationName}
                  </p>
                  <p>{formatClientDate(project.startDate)}</p>
                  <p className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {project.crewCount} crew · {project.roles.slice(0, 2).join(", ")}
                    {project.roles.length > 2 ? "…" : ""}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ClientStatusBadge status={project.briefingStatus} variant="briefing" />
                  <ClientStatusBadge status={project.hoursStatus} variant="hours" />
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <ClientProjectDrawer
        project={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}

export function NextProjectHighlight({ project }: { project: ClientProject }) {
  return (
    <Card className="border-[#173A8A]/20 bg-gradient-to-br from-[#173A8A]/5 to-white shadow-sm">
      <CardHeader>
        <CardDescription className="font-semibold text-[#173A8A]">
          Eerstvolgende project
        </CardDescription>
        <CardTitle className="text-xl font-black text-[#0B1F4D]">{project.projectName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p>{project.locationName}</p>
        <p>{formatClientDate(project.startDate)}</p>
        <p>{project.crewCount} crew ingezet · {project.roles.join(", ")}</p>
        <ClientStatusBadge status={project.status} variant="project" />
      </CardContent>
    </Card>
  );
}
