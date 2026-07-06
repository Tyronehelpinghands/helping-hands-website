"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CrewCoverageCard from "@/components/projects/CrewCoverageCard";
import NewProjectModal from "@/components/projects/NewProjectModal";
import ProjectDetailDrawer from "@/components/projects/ProjectDetailDrawer";
import ProjectStatusOverview from "@/components/projects/ProjectStatusOverview";
import ProjectsFilters from "@/components/projects/ProjectsFilters";
import ProjectsKpiCards from "@/components/projects/ProjectsKpiCards";
import ProjectsPageToolbar from "@/components/projects/ProjectsPageToolbar";
import ProjectsTable, {
  type ProjectTableAction,
} from "@/components/projects/ProjectsTable";
import ProjectsThisWeek from "@/components/projects/ProjectsThisWeek";
import WorkBriefModal from "@/components/projects/WorkBriefModal";
import type { Project } from "@/data/projectsMockData";
import { mockProjectsThisWeek } from "@/data/projectsMockData";
import type { ProjectsDataSource } from "@/lib/projects-utils";
import {
  computeCrewStatus,
  computeProjectKpis,
  computeStatusOverview,
  defaultProjectsFilters,
  downloadProjectsCsv,
  filterProjects,
  projectToSupabaseInsert,
  projectsToCsv,
  type NewProjectFormData,
  type ProjectsFilterState,
} from "@/lib/projects-utils";
import { createClient } from "@/lib/supabase/client";

type ProjectsDashboardClientProps = {
  initialProjects: Project[];
  dataSource: ProjectsDataSource;
};

function projectToFormData(project: Project): NewProjectFormData {
  return {
    naam: project.naam,
    opdrachtgever: project.opdrachtgever,
    contact: project.contact,
    email: project.email,
    telefoon: project.telefoon,
    locatie: project.locatie,
    startDatum: project.startDatum,
    eindDatum: project.eindDatum ?? "",
    startTijd: project.startTijd,
    eindTijd: project.eindTijd,
    type: project.type,
    status: project.status,
    planner: project.planner,
    crewNodig: String(project.crewNodig),
    functiesNodig: project.functiesNodig ?? "",
    uurtarief: project.uurtarief ? String(project.uurtarief) : "",
    reiskostenPerKm: project.reiskostenPerKm ? String(project.reiskostenPerKm) : "0.25",
    verwachteOmzet: project.verwachteOmzet ? String(project.verwachteOmzet) : "",
    notities: project.notities ?? "",
    crewBriefing: project.crewBriefing ?? "",
  };
}

export default function ProjectsDashboardClient({
  initialProjects,
  dataSource,
}: ProjectsDashboardClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filters, setFilters] = useState<ProjectsFilterState>(defaultProjectsFilters);

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [werkbriefProject, setWerkbriefProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [placeholderOpen, setPlaceholderOpen] = useState(false);
  const [placeholderMessage, setPlaceholderMessage] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters],
  );

  const kpiCards = useMemo(() => computeProjectKpis(projects), [projects]);
  const statusOverview = useMemo(() => computeStatusOverview(projects), [projects]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const showPlaceholder = useCallback((msg: string) => {
    setPlaceholderMessage(msg);
    setPlaceholderOpen(true);
  }, []);

  const persistProject = useCallback(
    async (project: Project, mode: "create" | "update") => {
      if (dataSource !== "supabase") return;

      try {
        const supabase = createClient();
        const payload = projectToSupabaseInsert(project);

        if (mode === "create") {
          const { data, error } = await supabase
            .from("projects")
            .insert(payload)
            .select("id")
            .single();
          if (error) throw error;
          if (data?.id) project.id = data.id;
        } else {
          const { error } = await supabase
            .from("projects")
            .update(payload)
            .eq("id", project.id);
          if (error) throw error;
        }
      } catch (error) {
        console.error("[Projecten] Supabase opslag mislukt:", error);
        showToast("Opslaan in Supabase mislukt — lokaal opgeslagen.");
      }
    },
    [dataSource, showToast],
  );

  const handleSaveProject = useCallback(
    async (project: Project) => {
      if (editProject) {
        const crewNodig = project.crewNodig;
        const crewIngepland = editProject.crewIngepland;
        const updated: Project = {
          ...editProject,
          naam: project.naam,
          opdrachtgever: project.opdrachtgever,
          contact: project.contact,
          email: project.email,
          telefoon: project.telefoon,
          locatie: project.locatie,
          startDatum: project.startDatum,
          eindDatum: project.eindDatum,
          startTijd: project.startTijd,
          eindTijd: project.eindTijd,
          type: project.type,
          status: project.status,
          planner: project.planner,
          crewNodig,
          crewStatus: computeCrewStatus(crewNodig, crewIngepland),
          uurtarief: project.uurtarief,
          reiskostenPerKm: project.reiskostenPerKm,
          verwachteOmzet: project.verwachteOmzet,
          notities: project.notities,
          crewBriefing: project.crewBriefing,
          functiesNodig: project.functiesNodig,
          activityLog: [
            ...(editProject.activityLog ?? []),
            {
              id: `act-${Date.now()}`,
              action: "Project bijgewerkt",
              timestamp: new Date().toISOString(),
            },
          ],
        };
        setProjects((prev) => prev.map((p) => (p.id === editProject.id ? updated : p)));
        await persistProject(updated, "update");
        setEditProject(null);
        showToast("Project bijgewerkt.");
      } else {
        setProjects((prev) => [project, ...prev]);
        await persistProject(project, "create");
        showToast("Project toegevoegd.");
      }
    },
    [editProject, persistProject, showToast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteProject) return;

    if (dataSource === "supabase") {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", deleteProject.id);
        if (error) throw error;
      } catch (error) {
        console.error("[Projecten] Supabase delete mislukt:", error);
        showToast("Verwijderen in Supabase mislukt.");
        setDeleteProject(null);
        return;
      }
    }

    setProjects((prev) => prev.filter((p) => p.id !== deleteProject.id));
    setDeleteProject(null);
    if (detailProject?.id === deleteProject.id) setDetailProject(null);
    showToast("Project verwijderd.");
  }, [deleteProject, dataSource, detailProject, showToast]);

  const handleTableAction = useCallback(
    (action: ProjectTableAction, project: Project) => {
      switch (action) {
        case "view":
          setDetailProject(project);
          break;
        case "edit":
          setEditProject(project);
          break;
        case "planning":
          showPlaceholder(`Planning voor "${project.naam}" wordt binnenkort beschikbaar.`);
          break;
        case "crew":
          showPlaceholder(`Crew toevoegen voor "${project.naam}" wordt binnenkort beschikbaar.`);
          break;
        case "werkbrief":
          setWerkbriefProject(project);
          break;
        case "uren":
          showPlaceholder(`Urencontrole voor "${project.naam}" wordt binnenkort beschikbaar.`);
          break;
        case "factuur":
          showPlaceholder(`Factuur voorbereiden voor "${project.naam}" wordt binnenkort beschikbaar.`);
          break;
        case "duplicate": {
          const copy: Project = {
            ...project,
            id: `proj-${Date.now()}`,
            naam: `${project.naam} (kopie)`,
            status: "aanvraag",
            crewIngepland: 0,
            crewStatus: computeCrewStatus(project.crewNodig, 0),
            createdAt: new Date().toISOString(),
          };
          setProjects((prev) => [copy, ...prev]);
          showToast("Project gedupliceerd.");
          break;
        }
        case "cancel":
          setProjects((prev) =>
            prev.map((p) =>
              p.id === project.id ? { ...p, status: "geannuleerd" as const } : p,
            ),
          );
          showToast(`${project.naam} geannuleerd.`);
          break;
        case "delete":
          setDeleteProject(project);
          break;
      }
    },
    [showPlaceholder, showToast],
  );

  const handleExport = useCallback(() => {
    const csv = projectsToCsv(filteredProjects);
    downloadProjectsCsv(
      csv,
      `helping-hands-projecten-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    showToast(`${filteredProjects.length} projecten geëxporteerd.`);
  }, [filteredProjects, showToast]);

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#173A8A]/20 bg-[#0B1F4D] px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}

      {dataSource === "mock" && process.env.NODE_ENV === "development" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          Mock data actief — voer{" "}
          <code className="font-mono">supabase/projects-module.sql</code> uit voor live data.
        </div>
      )}

      <ProjectsPageToolbar
        onNewProject={() => setNewProjectOpen(true)}
        onImport={() =>
          showPlaceholder("Project importeren wordt binnenkort beschikbaar.")
        }
        onPlanning={() =>
          showPlaceholder("Planning bekijken wordt binnenkort beschikbaar.")
        }
        onExport={handleExport}
      />

      <ProjectsKpiCards cards={kpiCards} />

      <ProjectStatusOverview summary={statusOverview} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProjectsThisWeek items={mockProjectsThisWeek} />
        </div>
        <CrewCoverageCard projects={projects} />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Alle projecten
          </CardTitle>
          <CardDescription>
            {filteredProjects.length} van {projects.length} projecten
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectsFilters
            projects={projects}
            filters={filters}
            onChange={setFilters}
          />
          <ProjectsTable projects={filteredProjects} onAction={handleTableAction} />
        </CardContent>
      </Card>

      <NewProjectModal
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        onSave={handleSaveProject}
      />

      <NewProjectModal
        open={!!editProject}
        onOpenChange={(open) => !open && setEditProject(null)}
        onSave={handleSaveProject}
        initialData={editProject ? projectToFormData(editProject) : undefined}
        mode="edit"
      />

      <ProjectDetailDrawer
        project={detailProject}
        open={!!detailProject}
        onOpenChange={(open) => !open && setDetailProject(null)}
        onEdit={(p) => {
          setDetailProject(null);
          setEditProject(p);
        }}
        onCrew={(p) =>
          showPlaceholder(`Crew toevoegen voor "${p.naam}" wordt binnenkort beschikbaar.`)
        }
        onPlanning={(p) =>
          showPlaceholder(`Planning voor "${p.naam}" wordt binnenkort beschikbaar.`)
        }
        onWerkbrief={(p) => setWerkbriefProject(p)}
        onUren={(p) =>
          showPlaceholder(`Urencontrole voor "${p.naam}" wordt binnenkort beschikbaar.`)
        }
        onFactuur={(p) =>
          showPlaceholder(`Factuur voorbereiden voor "${p.naam}" wordt binnenkort beschikbaar.`)
        }
      />

      <WorkBriefModal
        project={werkbriefProject}
        open={!!werkbriefProject}
        onOpenChange={(open) => !open && setWerkbriefProject(null)}
      />

      <Dialog open={placeholderOpen} onOpenChange={setPlaceholderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">Binnenkort beschikbaar</DialogTitle>
            <DialogDescription>{placeholderMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setPlaceholderOpen(false)}>
              Sluiten
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteProject} onOpenChange={(open) => !open && setDeleteProject(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0B1F4D]">Project verwijderen</DialogTitle>
            <DialogDescription>
              Weet je zeker dat je &quot;{deleteProject?.naam}&quot; wilt verwijderen? Dit kan
              niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteProject(null)}>
              Annuleren
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => void handleDelete()}
            >
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
