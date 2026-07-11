import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  FileText,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, type FinanceMetric } from "@/lib/finance";

type FinanceOverviewCardsProps = {
  metrics: FinanceMetric;
  outstandingAmount: number;
};

export default function FinanceOverviewCards({
  metrics,
  outstandingAmount,
}: FinanceOverviewCardsProps) {
  const items = [
    {
      label: "Openstaande facturen",
      value: String(metrics.openInvoices),
      icon: FileText,
      href: "/dashboard/intern/facturatie",
    },
    {
      label: "Te late facturen",
      value: String(metrics.overdueInvoices),
      icon: AlertTriangle,
      href: "/dashboard/intern/facturatie",
    },
    {
      label: "Openstaand bedrag",
      value: formatCurrency(outstandingAmount),
      icon: Clock,
      href: "/dashboard/intern/facturatie",
    },
    {
      label: "Actieve projecten",
      value: "7",
      icon: FolderKanban,
      href: "/dashboard/intern/projecten",
    },
  ];

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Financieel overzicht
        </CardTitle>
        <CardDescription>
          Snelle koppelingen naar facturatie, uren en projecten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-[#F5F7FA]/50 px-4 py-3"
              >
                <div>
                  <p className="text-xs text-[#101828]/55">{item.label}</p>
                  <p className="text-lg font-bold text-[#0B1F4D]">
                    {item.value}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  render={<Link href={item.href} />}
                >
                  <Icon className="h-4 w-4" />
                  Openen
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
