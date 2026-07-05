import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SalesFollowUp } from "@/data/salesMockData";
import { cn } from "@/lib/utils";

const statusStyles: Record<SalesFollowUp["status"], string> = {
  Vandaag: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  Morgen: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  "Deze week": "border-slate-200 bg-slate-100 text-slate-600",
  "Te laat": "border-red-200 bg-red-50 text-red-700",
};

const priorityStyles: Record<SalesFollowUp["prioriteit"], string> = {
  hoog: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  normaal: "border-slate-200 bg-slate-100 text-slate-600",
  laag: "border-slate-200 bg-[#F5F7FA] text-[#101828]/60",
};

type SalesFollowUpTasksProps = {
  tasks: SalesFollowUp[];
};

export default function SalesFollowUpTasks({ tasks }: SalesFollowUpTasksProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Follow-up taken
        </CardTitle>
        <CardDescription>
          Opvolging per lead met deadline en prioriteit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-slate-100 bg-[#F5F7FA]/60 p-4 transition hover:border-[#38bdf8]/30 hover:bg-white"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-[#0B1F4D]">{task.taak}</p>
                <p className="mt-1 text-sm text-[#101828]/65">{task.lead}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={cn("font-semibold", statusStyles[task.status])}
                >
                  {task.deadline}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn("font-semibold", priorityStyles[task.prioriteit])}
                >
                  {task.prioriteit}
                </Badge>
              </div>
            </div>
            <p className="mt-2 text-xs font-medium text-[#173A8A]">
              Eigenaar: {task.eigenaar}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
