"use client";

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
import type { OpenAction } from "@/data/dashboardMockData";
import { cn } from "@/lib/utils";

const statusStyles: Record<OpenAction["status"], string> = {
  Bezig: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A] hover:bg-[#173A8A]/10",
  "Follow-up": "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a] hover:bg-[#F28C28]/10",
  Nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7] hover:bg-[#38bdf8]/10",
  Wachten: "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
};

type OpenActionsTableProps = {
  actions: OpenAction[];
};

export default function OpenActionsTable({ actions }: OpenActionsTableProps) {
  if (actions.length === 0) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">
            Open acties
          </CardTitle>
          <CardDescription>Geen openstaande acties op dit moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Open acties
        </CardTitle>
        <CardDescription>
          Taken die aandacht nodig hebben van het interne team
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Actie</TableHead>
                <TableHead>Eigenaar</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="max-w-[200px] pl-6 font-semibold text-[#0B1F4D] sm:max-w-none">
                    {action.actie}
                  </TableCell>
                  <TableCell className="text-[#101828]/75">{action.eigenaar}</TableCell>
                  <TableCell className="text-[#101828]/75">{action.deadline}</TableCell>
                  <TableCell className="pr-6">
                    <Badge
                      variant="outline"
                      className={cn("font-semibold", statusStyles[action.status])}
                    >
                      {action.status}
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
