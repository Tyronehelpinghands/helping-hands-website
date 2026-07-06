import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectStatusSummary } from "@/data/projectsMockData";
import {
  formatProjectCurrency,
  projectStatusLabels,
  projectStatusStyles,
} from "@/lib/projects-utils";
import { cn } from "@/lib/utils";

type ProjectStatusOverviewProps = {
  summary: ProjectStatusSummary[];
};

export default function ProjectStatusOverview({ summary }: ProjectStatusOverviewProps) {
  const totalCount = summary.reduce((sum, s) => sum + s.count, 0);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Projectstatus overzicht
        </CardTitle>
        <CardDescription>
          {totalCount} projecten verdeeld over {summary.length} statussen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-2 overflow-x-auto pb-1">
          <div className="flex min-w-[960px] gap-2 px-2">
            {summary.map((item) => (
              <div
                key={item.status}
                className="min-w-[110px] flex-1 rounded-xl border border-slate-100 bg-[#F5F7FA]/60 p-3"
              >
                <span
                  className={cn(
                    "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                    projectStatusStyles[item.status],
                  )}
                >
                  {projectStatusLabels[item.status]}
                </span>
                <p className="mt-2 text-xl font-black text-[#173A8A]">
                  {item.count}
                </p>
                <p className="text-xs font-semibold text-[#101828]/55">
                  {item.percentage}% · {formatProjectCurrency(item.value)}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#173A8A]"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
