"use client";

import {
  Calendar,
  ClipboardList,
  FileText,
  Pencil,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Project } from "@/data/projectsMockData";
import {
  crewStatusLabels,
  crewStatusStyles,
  formatProjectCurrency,
  formatProjectDate,
  projectStatusLabels,
  projectStatusStyles,
  projectTypeLabels,
  projectTypeStyles,
} from "@/lib/projects-utils";
import { cn } from "@/lib/utils";

type ProjectDetailDrawerProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (project: Project) => void;
  onCrew: (project: Project) => void;
  onPlanning: (project: Project) => void;
  onWerkbrief: (project: Project) => void;
  onUren: (project: Project) => void;
  onFactuur: (project: Project) => void;
};

const urenLabels: Record<NonNullable<Project["urenStatus"]>, string> = {
  open: "Open",
  ingediend: "Ingediend",
  goedgekeurd: "Goedgekeurd",
};

const facturatieLabels: Record<NonNullable<Project["facturatieStatus"]>, string> = {
  niet_gestart: "Niet gestart",
  voorbereid: "Voorbereid",
  verzonden: "Verzonden",
  betaald: "Betaald",
};

export default function ProjectDetailDrawer({
  project,
  open,
  onOpenChange,
  onEdit,
  onCrew,
  onPlanning,
  onWerkbrief,
  onUren,
  onFactuur,
}: ProjectDetailDrawerProps) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-[#0B1F4D]">{project.naam}</SheetTitle>
          <SheetDescription>{project.opdrachtgever}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn("font-semibold", projectStatusStyles[project.status])}
            >
              {projectStatusLabels[project.status]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-semibold", projectTypeStyles[project.type])}
            >
              {projectTypeLabels[project.type]}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-semibold", crewStatusStyles[project.crewStatus])}
            >
              {crewStatusLabels[project.crewStatus]}
            </Badge>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Contactgegevens
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Contact</dt>
              <dd>{project.contact || "—"}</dd>
              <dt className="text-[#101828]/55">E-mail</dt>
              <dd className="truncate">{project.email || "—"}</dd>
              <dt className="text-[#101828]/55">Telefoon</dt>
              <dd>{project.telefoon || "—"}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Locatie & planning
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Locatie</dt>
              <dd>{project.locatie}</dd>
              <dt className="text-[#101828]/55">Datum</dt>
              <dd>
                {formatProjectDate(project.startDatum)}
                {project.eindDatum ? ` – ${formatProjectDate(project.eindDatum)}` : ""}
              </dd>
              <dt className="text-[#101828]/55">Tijden</dt>
              <dd>
                {project.startTijd} – {project.eindTijd}
              </dd>
              <dt className="text-[#101828]/55">Planner</dt>
              <dd>{project.planner}</dd>
            </dl>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Crew & omzet
            </h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-[#101828]/55">Crew nodig</dt>
              <dd>{project.crewNodig}</dd>
              <dt className="text-[#101828]/55">Crew ingepland</dt>
              <dd>{project.crewIngepland}</dd>
              <dt className="text-[#101828]/55">Verwachte omzet</dt>
              <dd className="font-bold text-[#173A8A]">
                {formatProjectCurrency(project.verwachteOmzet)}
              </dd>
              <dt className="text-[#101828]/55">Urenstatus</dt>
              <dd>{project.urenStatus ? urenLabels[project.urenStatus] : "—"}</dd>
              <dt className="text-[#101828]/55">Facturatiestatus</dt>
              <dd>
                {project.facturatieStatus
                  ? facturatieLabels[project.facturatieStatus]
                  : "—"}
              </dd>
            </dl>
          </section>

          {project.notities && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Interne notities
              </h3>
              <p className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 p-3 text-sm text-[#101828]/75">
                {project.notities}
              </p>
            </section>
          )}

          {project.crewBriefing && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Crew briefing
              </h3>
              <p className="rounded-lg border border-slate-100 bg-[#F5F7FA]/60 p-3 text-sm text-[#101828]/75">
                {project.crewBriefing}
              </p>
            </section>
          )}

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Tijdlijn
            </h3>
            <div className="space-y-2">
              {(project.activityLog ?? []).length > 0 ? (
                project.activityLog!.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm"
                  >
                    <p className="font-medium text-[#0B1F4D]">{item.action}</p>
                    {item.message && (
                      <p className="text-xs text-[#101828]/55">{item.message}</p>
                    )}
                    <p className="mt-1 text-[10px] text-[#101828]/45">
                      {new Date(item.timestamp).toLocaleString("nl-NL")}
                      {item.user ? ` · ${item.user}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#101828]/55">Nog geen activiteit.</p>
              )}
            </div>
          </section>
        </div>

        <SheetFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={() => onEdit(project)}
            className="w-full bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
          >
            <Pencil className="h-4 w-4" />
            Bewerken
          </Button>
          <div className="grid w-full grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => onCrew(project)}>
              <UserPlus className="h-4 w-4" />
              Crew toevoegen
            </Button>
            <Button type="button" variant="outline" onClick={() => onPlanning(project)}>
              <Calendar className="h-4 w-4" />
              Planning
            </Button>
            <Button type="button" variant="outline" onClick={() => onWerkbrief(project)}>
              <ClipboardList className="h-4 w-4" />
              Werkbrief
            </Button>
            <Button type="button" variant="outline" onClick={() => onUren(project)}>
              <FileText className="h-4 w-4" />
              Uren
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#F28C28]/40 text-[#c96f1a] hover:bg-[#F28C28]/10"
            onClick={() => onFactuur(project)}
          >
            Factuur voorbereiden
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
