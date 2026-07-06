import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectWeekItem } from "@/data/projectsMockData";
import { crewStatusLabels, crewStatusStyles } from "@/lib/projects-utils";
import { cn } from "@/lib/utils";

type ProjectsThisWeekProps = {
  items: ProjectWeekItem[];
};

export default function ProjectsThisWeek({ items }: ProjectsThisWeekProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Projecten deze week
        </CardTitle>
        <CardDescription>Compact overzicht van geplande projecten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-2 overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                <th className="px-2 py-2">Datum</th>
                <th className="px-2 py-2">Project</th>
                <th className="px-2 py-2">Locatie</th>
                <th className="px-2 py-2">Crew</th>
                <th className="px-2 py-2">Starttijd</th>
                <th className="px-2 py-2">Planner</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 hover:bg-[#F5F7FA]/40"
                >
                  <td className="px-2 py-2.5">
                    <span className="font-medium text-[#0B1F4D]">{item.dag}</span>
                  </td>
                  <td className="px-2 py-2.5 font-semibold text-[#173A8A]">
                    {item.project}
                  </td>
                  <td className="px-2 py-2.5 text-[#101828]/75">{item.locatie}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[#101828]/70">{item.crewNodig} crew</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold",
                          crewStatusStyles[item.crewStatus],
                        )}
                      >
                        {crewStatusLabels[item.crewStatus]}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-[#101828]/70">{item.startTijd}</td>
                  <td className="px-2 py-2.5 text-[#101828]/75">{item.planner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
