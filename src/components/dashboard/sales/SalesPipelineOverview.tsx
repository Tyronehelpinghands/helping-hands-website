import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PipelineStage } from "@/data/salesMockData";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

type SalesPipelineOverviewProps = {
  stages: PipelineStage[];
};

export default function SalesPipelineOverview({
  stages,
}: SalesPipelineOverviewProps) {
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const activeStages = stages.filter((stage) => stage.id !== "verloren");

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Pipeline overzicht
        </CardTitle>
        <CardDescription>
          Leads en kansen per fase — totaal {formatCurrency(totalValue)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeStages.map((stage) => {
          const percentage =
            totalValue > 0 ? Math.round((stage.value / totalValue) * 100) : 0;

          return (
            <div key={stage.id}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.fill }}
                  />
                  <span className="font-semibold text-[#0B1F4D]">
                    {stage.label}
                  </span>
                  <span className="text-xs text-[#101828]/50">
                    {stage.count} leads
                  </span>
                </div>
                <span className="font-bold text-[#173A8A]">
                  {formatCurrency(stage.value)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(percentage, stage.count > 0 ? 4 : 0)}%`,
                    backgroundColor: stage.fill,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
