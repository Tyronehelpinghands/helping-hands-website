import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  getExpectedIncoming,
  getOutstandingAmount,
  type FinanceInvoice,
  type FinanceMetric,
} from "@/lib/finance";

type CashflowPanelProps = {
  metrics: FinanceMetric;
  invoices: FinanceInvoice[];
};

export default function CashflowPanel({
  metrics,
  invoices,
}: CashflowPanelProps) {
  const outstanding = getOutstandingAmount(invoices);
  const expected = getExpectedIncoming(invoices);
  const maxBar = Math.max(metrics.cashIn, metrics.cashOut, 1);

  const bars = [
    {
      label: "Binnengekomen betalingen",
      value: metrics.cashIn,
      color: "bg-green-500",
    },
    {
      label: "Uitgaande betalingen",
      value: metrics.cashOut,
      color: "bg-red-400",
    },
    {
      label: "Netto cashflow",
      value: Math.abs(metrics.cashflow),
      color: metrics.cashflow >= 0 ? "bg-[#173A8A]" : "bg-red-600",
    },
  ];

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Cashflow
        </CardTitle>
        <CardDescription>
          Inkomende en uitgaande geldstromen op basis van demo-data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-[#101828]/70">{bar.label}</span>
                <span className="font-semibold text-[#0B1F4D]">
                  {formatCurrency(bar.value)}
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${bar.color} transition-all`}
                  style={{ width: `${(bar.value / maxBar) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Openstaande facturen</dt>
            <dd className="font-bold text-amber-700">
              {formatCurrency(outstanding)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">
              Verwachte inkomende betalingen
            </dt>
            <dd className="font-bold text-[#0B1F4D]">
              {formatCurrency(expected)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
