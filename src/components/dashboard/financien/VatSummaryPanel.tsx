import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, type VatSummary } from "@/lib/finance";

type VatSummaryPanelProps = {
  summary: VatSummary;
};

export default function VatSummaryPanel({ summary }: VatSummaryPanelProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Btw-samenvatting
        </CardTitle>
        <CardDescription>
          Periode: {summary.periodLabel} — indicatief demo-overzicht.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Btw op omzet</dt>
            <dd className="text-lg font-bold text-[#0B1F4D]">
              {formatCurrency(summary.vatOnRevenue)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Voorbelasting op kosten</dt>
            <dd className="text-lg font-bold text-green-700">
              {formatCurrency(summary.inputVat)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Btw te betalen</dt>
            <dd className="text-lg font-bold text-[#173A8A]">
              {formatCurrency(summary.vatToPay)}
            </dd>
          </div>
        </dl>
        <p className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Controleer btw altijd met je boekhouding voordat je aangifte doet.
        </p>
      </CardContent>
    </Card>
  );
}
