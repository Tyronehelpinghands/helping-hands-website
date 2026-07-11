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
import {
  formatCurrency,
  formatPercentage,
  type MarginSummary,
  type ProjectMargin,
} from "@/lib/finance";

type MarginAnalysisPanelProps = {
  summary: MarginSummary;
  projects: ProjectMargin[];
};

export default function MarginAnalysisPanel({
  summary,
  projects,
}: MarginAnalysisPanelProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Marge-analyse
        </CardTitle>
        <CardDescription>
          Brutomarge en breakdown per project (demo).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Omzet excl. btw</dt>
            <dd className="font-bold">{formatCurrency(summary.revenueExVat)}</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Crewkosten</dt>
            <dd className="font-bold">{formatCurrency(summary.crewCosts)}</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Reiskosten</dt>
            <dd className="font-bold">{formatCurrency(summary.travelCosts)}</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Overige directe kosten</dt>
            <dd className="font-bold">
              {formatCurrency(summary.otherDirectCosts)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Brutomarge</dt>
            <dd
              className={`font-bold ${summary.grossMargin >= 0 ? "text-green-700" : "text-red-700"}`}
            >
              {formatCurrency(summary.grossMargin)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Margepercentage</dt>
            <dd className="font-bold text-[#173A8A]">
              {formatPercentage(summary.marginPercentage)}
            </dd>
          </div>
        </dl>

        <div className="overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Project</TableHead>
                <TableHead>Omzet</TableHead>
                <TableHead>Crewkosten</TableHead>
                <TableHead>Reiskosten</TableHead>
                <TableHead>Marge</TableHead>
                <TableHead>Marge %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.projectName}>
                  <TableCell className="font-medium">{p.projectName}</TableCell>
                  <TableCell>{formatCurrency(p.revenue)}</TableCell>
                  <TableCell>{formatCurrency(p.crewCosts)}</TableCell>
                  <TableCell>{formatCurrency(p.travelCosts)}</TableCell>
                  <TableCell
                    className={
                      p.margin >= 0 ? "text-green-700" : "text-red-700"
                    }
                  >
                    {formatCurrency(p.margin)}
                  </TableCell>
                  <TableCell>{formatPercentage(p.marginPercentage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
