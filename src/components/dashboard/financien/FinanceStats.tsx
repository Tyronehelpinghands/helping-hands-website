import {
  AlertTriangle,
  ArrowDownUp,
  Percent,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  formatPercentage,
  type FinanceMetric,
} from "@/lib/finance";

type FinanceStatsProps = {
  metrics: FinanceMetric;
  outstandingAmount: number;
};

export default function FinanceStatsCards({
  metrics,
  outstandingAmount,
}: FinanceStatsProps) {
  const cards = [
    {
      id: "revenue",
      title: "Omzet excl. btw",
      value: formatCurrency(metrics.revenueExVat),
      detail: "Gefactureerde omzet",
      icon: TrendingUp,
      accent: "text-green-700",
      bar: "bg-green-500",
    },
    {
      id: "expenses",
      title: "Kosten excl. btw",
      value: formatCurrency(metrics.expensesExVat),
      detail: "Totale kosten",
      icon: TrendingDown,
      accent: "text-[#0B1F4D]",
      bar: "bg-[#173A8A]",
    },
    {
      id: "margin",
      title: "Brutomarge",
      value: formatCurrency(metrics.grossMargin),
      detail: "Omzet minus crew & reis",
      icon: Wallet,
      accent: metrics.grossMargin >= 0 ? "text-green-700" : "text-red-700",
      bar: metrics.grossMargin >= 0 ? "bg-green-500" : "bg-red-500",
    },
    {
      id: "marginPct",
      title: "Marge %",
      value: formatPercentage(metrics.grossMarginPercentage),
      detail: "Brutomarge / omzet",
      icon: Percent,
      accent: "text-[#0B1F4D]",
      bar: "bg-[#F28C28]",
    },
    {
      id: "outstanding",
      title: "Openstaand bedrag",
      value: formatCurrency(outstandingAmount),
      detail: "Nog te ontvangen",
      icon: Receipt,
      accent: "text-amber-700",
      bar: "bg-amber-500",
    },
    {
      id: "overdue",
      title: "Te late facturen",
      value: String(metrics.overdueInvoices),
      detail: "Over vervaldatum",
      icon: AlertTriangle,
      accent: metrics.overdueInvoices > 0 ? "text-red-700" : "text-green-700",
      bar: metrics.overdueInvoices > 0 ? "bg-red-500" : "bg-green-500",
    },
    {
      id: "vat",
      title: "Btw te betalen",
      value: formatCurrency(metrics.vatToPay),
      detail: "Omzet-btw minus voorbelasting",
      icon: Receipt,
      accent: "text-[#0B1F4D]",
      bar: "bg-[#173A8A]",
    },
    {
      id: "cashflow",
      title: "Cashflow",
      value: formatCurrency(metrics.cashflow),
      detail: "Cash in minus cash out",
      icon: ArrowDownUp,
      accent: metrics.cashflow >= 0 ? "text-green-700" : "text-red-700",
      bar: metrics.cashflow >= 0 ? "bg-green-500" : "bg-red-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#38bdf8]/30 hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173A8A]/10 text-[#173A8A]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p
                  className={`text-xl font-black tracking-tight ${card.accent}`}
                >
                  {card.value}
                </p>
              </div>
              <CardTitle className="mt-3 text-sm font-bold text-[#0B1F4D]">
                {card.title}
              </CardTitle>
              <CardDescription className="text-xs leading-5">
                {card.detail}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className={`h-1 w-10 rounded-full ${card.bar}`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
