"use client";

import { CalendarDays, Download, FolderPlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProjectsPageToolbarProps = {
  onNewProject: () => void;
  onImport: () => void;
  onPlanning: () => void;
  onExport: () => void;
};

export default function ProjectsPageToolbar({
  onNewProject,
  onImport,
  onPlanning,
  onExport,
}: ProjectsPageToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        type="button"
        size="sm"
        onClick={onNewProject}
        className="bg-[#173A8A] text-white hover:bg-[#0B1F4D]"
      >
        <FolderPlus className="h-4 w-4" aria-hidden="true" />
        Nieuw project
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onImport}
        className="border-slate-200/80 bg-white"
      >
        <Upload className="h-4 w-4" aria-hidden="true" />
        Project importeren
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={onPlanning}
        className="bg-[#F28C28] text-white hover:bg-[#de7c1f]"
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Planning bekijken
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onExport}
        className="border-slate-200/80 bg-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Exporteren
      </Button>
    </div>
  );
}
