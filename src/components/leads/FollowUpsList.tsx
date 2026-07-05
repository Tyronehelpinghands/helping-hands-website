import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeadFollowUp } from "@/data/leadsMockData";
import { leadPriorityLabels, leadPriorityStyles } from "@/lib/leads-utils";
import { cn } from "@/lib/utils";

const statusStyles: Record<LeadFollowUp["status"], string> = {
  Vandaag: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  Morgen: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  "Deze week": "border-slate-200 bg-slate-100 text-slate-600",
  "Te laat": "border-red-200 bg-red-50 text-red-700",
  Gepland: "border-slate-200 bg-[#F5F7FA] text-[#101828]/60",
};

type FollowUpsListProps = {
  tasks: LeadFollowUp[];
};

export default function FollowUpsList({ tasks }: FollowUpsListProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Follow-ups
        </CardTitle>
        <CardDescription>Geplande opvolgtaken per lead</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Taak</TableHead>
                <TableHead>Lead / bedrijf</TableHead>
                <TableHead>Eigenaar</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Prioriteit</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="max-w-[200px] truncate pl-6 font-medium text-[#0B1F4D]">
                    {task.taak}
                  </TableCell>
                  <TableCell className="text-[#101828]/75">{task.lead}</TableCell>
                  <TableCell className="text-[#101828]/75">{task.eigenaar}</TableCell>
                  <TableCell className="text-[#101828]/75">{task.deadline}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold",
                        leadPriorityStyles[task.prioriteit],
                      )}
                    >
                      {leadPriorityLabels[task.prioriteit]}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-semibold", statusStyles[task.status])}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
