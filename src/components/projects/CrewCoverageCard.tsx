import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project, ProjectRole } from "@/data/projectsMockData";
import { crewStatusLabels, crewStatusStyles } from "@/lib/projects-utils";
import { cn } from "@/lib/utils";

type CrewCoverageCardProps = {
  projects: Project[];
};

function RoleRow({ role }: { role: ProjectRole }) {
  const shortage = Math.max(0, role.quantityNeeded - role.quantityPlanned);
  const status =
    role.quantityPlanned > role.quantityNeeded
      ? "overbezet"
      : shortage === 0 && role.quantityNeeded > 0
        ? "volledig_ingepland"
        : role.quantityPlanned > 0
          ? "deels_ingepland"
          : "nog_nodig";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-[#F5F7FA]/50 px-3 py-2 text-sm">
      <div>
        <p className="font-semibold text-[#0B1F4D]">{role.roleName}</p>
        <p className="text-xs text-[#101828]/55">
          {role.quantityNeeded} nodig · {role.quantityPlanned} ingepland
          {shortage > 0 ? ` · ${shortage} tekort` : " · compleet"}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn("shrink-0 text-[10px] font-semibold", crewStatusStyles[status])}
      >
        {shortage > 0
          ? `${shortage} tekort`
          : status === "overbezet"
            ? "Overbezet"
            : crewStatusLabels[status]}
      </Badge>
    </div>
  );
}

export default function CrewCoverageCard({ projects }: CrewCoverageCardProps) {
  const projectsWithRoles = projects.filter(
    (p) => p.roles && p.roles.length > 0 && !["afgerond", "geannuleerd"].includes(p.status),
  );

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">Crewbezetting</CardTitle>
        <CardDescription>
          Functies, benodigde aantallen en tekorten per actief project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectsWithRoles.length === 0 ? (
          <p className="text-sm text-[#101828]/55">
            Geen crewrollen beschikbaar voor actieve projecten.
          </p>
        ) : (
          projectsWithRoles.slice(0, 3).map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#173A8A]">{project.naam}</p>
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
              <div className="space-y-1.5">
                {project.roles!.map((role) => (
                  <RoleRow key={role.id} role={role} />
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
