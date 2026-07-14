"use client";

import {
  Calendar,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import ResponsiveTable from "@/components/dashboard/shared/ResponsiveTable";

export type ProjectTableAction =
  | "view"
  | "edit"
  | "planning"
  | "crew"
  | "werkbrief"
  | "uren"
  | "factuur"
  | "duplicate"
  | "cancel"
  | "delete";

type ProjectsTableProps = {
  projects: Project[];
  onAction: (action: ProjectTableAction, project: Project) => void;
};

export default function ProjectsTable({ projects, onAction }: ProjectsTableProps) {
  return (
    <ResponsiveTable tableMinWidthClass="min-w-[1200px]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Project</TableHead>
            <TableHead>Opdrachtgever</TableHead>
            <TableHead>Locatie</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Tijden</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Crew nodig</TableHead>
            <TableHead>Crew ingepland</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Planner</TableHead>
            <TableHead>Omzet</TableHead>
            <TableHead className="pr-6 text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={12}
                className="py-12 text-center text-sm text-[#101828]/55"
              >
                Geen projecten gevonden. Pas filters aan of voeg een nieuw project toe.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} className="hover:bg-[#F5F7FA]/40">
                <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                  {project.naam}
                </TableCell>
                <TableCell className="text-[#101828]">{project.opdrachtgever}</TableCell>
                <TableCell className="text-[#101828]/75">{project.locatie}</TableCell>
                <TableCell className="text-xs text-[#101828]/70">
                  {formatProjectDate(project.startDatum)}
                </TableCell>
                <TableCell className="text-xs text-[#101828]/70">
                  {project.startTijd} – {project.eindTijd}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold",
                      projectTypeStyles[project.type],
                    )}
                  >
                    {projectTypeLabels[project.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium">{project.crewNodig}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{project.crewIngepland}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        crewStatusStyles[project.crewStatus],
                      )}
                    >
                      {crewStatusLabels[project.crewStatus]}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold",
                      projectStatusStyles[project.status],
                    )}
                  >
                    {projectStatusLabels[project.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#101828]/75">{project.planner}</TableCell>
                <TableCell className="font-semibold text-[#173A8A]">
                  {formatProjectCurrency(project.verwachteOmzet)}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-[#173A8A]"
                          aria-label={`Acties voor ${project.naam}`}
                        />
                      }
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => onAction("view", project)}>
                        <Eye className="h-4 w-4" />
                        Bekijken
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("edit", project)}>
                        <Pencil className="h-4 w-4" />
                        Bewerken
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAction("planning", project)}>
                        <Calendar className="h-4 w-4" />
                        Planning openen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("crew", project)}>
                        <UserPlus className="h-4 w-4" />
                        Crew toevoegen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("werkbrief", project)}>
                        <ClipboardList className="h-4 w-4" />
                        Werkbrief maken
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("uren", project)}>
                        <FileText className="h-4 w-4" />
                        Uren controleren
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("factuur", project)}>
                        <FileText className="h-4 w-4" />
                        Factuur voorbereiden
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAction("duplicate", project)}>
                        <Copy className="h-4 w-4" />
                        Dupliceren
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction("cancel", project)}>
                        <XCircle className="h-4 w-4" />
                        Annuleren
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAction("delete", project)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ResponsiveTable>
  );
}
