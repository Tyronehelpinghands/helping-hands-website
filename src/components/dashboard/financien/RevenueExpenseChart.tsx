import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, type ChartDataPoint } from "@/lib/finance";

type RevenueExpenseChartProps = {
  data: ChartDataPoint[];
};

export default function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.revenue, d.expenses, Math.abs(d.margin)]),
    1,
  );

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Omzet & kosten
        </CardTitle>
        <CardDescription>
          Maandelijks overzicht — omzet, kosten en marge (demo).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3 overflow-x-auto pb-2">
          {data.map((point) => (
            <div
              key={point.label}
              className="flex min-w-[72px] flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-40 w-full items-end justify-center gap-1">
                <div
                  className="w-3 rounded-t bg-green-500"
                  style={{
                    height: `${(point.revenue / maxValue) * 100}%`,
                    minHeight: point.revenue > 0 ? "4px" : "0",
                  }}
                  title={`Omzet: ${formatCurrency(point.revenue)}`}
                />
                <div
                  className="w-3 rounded-t bg-red-400"
                  style={{
                    height: `${(point.expenses / maxValue) * 100}%`,
                    minHeight: point.expenses > 0 ? "4px" : "0",
                  }}
                  title={`Kosten: ${formatCurrency(point.expenses)}`}
                />
                <div
                  className="w-3 rounded-t bg-[#173A8A]"
                  style={{
                    height: `${(Math.max(point.margin, 0) / maxValue) * 100}%`,
                    minHeight: point.margin > 0 ? "4px" : "0",
                  }}
                  title={`Marge: ${formatCurrency(point.margin)}`}
                />
              </div>
              <span className="text-xs font-medium text-[#101828]/65">
                {point.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#101828]/65">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-500" />
            Omzet
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
            Kosten
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#173A8A]" />
            Marge
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
