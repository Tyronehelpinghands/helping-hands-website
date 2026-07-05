import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PipelineDeal, PipelineStage } from "@/data/salesMockData";
import { formatSalesCurrency } from "@/lib/sales-utils";

type SalesPipelineOverviewProps = {
  stages: PipelineStage[];
  deals: PipelineDeal[];
};

export default function SalesPipelineOverview({
  stages,
  deals,
}: SalesPipelineOverviewProps) {
  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const totalCount = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Pipeline overzicht
        </CardTitle>
        <CardDescription>
          {totalCount} kansen — totaal {formatSalesCurrency(totalValue)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-2 overflow-x-auto pb-2">
          <div className="flex min-w-[720px] gap-3 px-2">
            {stages.map((stage) => {
              const percentage =
                totalValue > 0
                  ? Math.round((stage.value / totalValue) * 100)
                  : 0;
              const stageDeals = deals.filter((deal) => deal.stageId === stage.id);

              return (
                <div
                  key={stage.id}
                  className="flex min-w-[140px] flex-1 flex-col rounded-xl border border-slate-100 bg-[#F5F7FA]/50"
                >
                  <div
                    className="rounded-t-xl px-3 py-2"
                    style={{ borderTop: `3px solid ${stage.fill}` }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-[#0B1F4D]">
                      {stage.label}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-1">
                      <span className="text-lg font-black text-[#173A8A]">
                        {stage.count}
                      </span>
                      <span className="text-[10px] font-semibold text-[#101828]/50">
                        {percentage}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#101828]/65">
                      {formatSalesCurrency(stage.value)}
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-2">
                    {stageDeals.length > 0 ? (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="rounded-lg border border-slate-100 bg-white px-2.5 py-2 shadow-sm"
                        >
                          <p className="truncate text-xs font-semibold text-[#0B1F4D]">
                            {deal.title}
                          </p>
                          <p className="truncate text-[10px] text-[#101828]/55">
                            {deal.bedrijf}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#173A8A]">
                            {formatSalesCurrency(deal.waarde)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 px-2 py-4 text-center text-[10px] text-[#101828]/40">
                        Geen deals
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
