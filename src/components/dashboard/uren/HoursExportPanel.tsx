"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  downloadCsv,
  exportHoursToCsv,
  formatEuro,
  round2,
  type HoursEntry,
} from "@/lib/hours";

type HoursExportPanelProps = {
  entries: HoursEntry[];
};

export default function HoursExportPanel({ entries }: HoursExportPanelProps) {
  const approved = entries.filter((e) => e.status === "Goedgekeurd");
  const totalHours = round2(
    approved.reduce((sum, e) => sum + e.workedHours, 0),
  );
  const totalTravel = round2(
    approved.reduce((sum, e) => sum + e.travelCost, 0),
  );
  const totalRevenue = round2(
    approved.reduce((sum, e) => sum + e.revenueAmount, 0),
  );
  const vat = round2(totalRevenue * 0.21);
  const totalInclVat = round2(totalRevenue + vat);

  function handleCsvExport() {
    const csv = exportHoursToCsv(approved);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `uren-export-${date}.csv`);
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Export & facturatie
        </CardTitle>
        <CardDescription>
          Goedgekeurde uren kunnen later worden geëxporteerd naar Moneybird of
          CSV.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Goedgekeurde regels</dt>
            <dd className="font-bold text-[#0B1F4D]">{approved.length}</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Totaal uren</dt>
            <dd className="font-bold text-[#0B1F4D]">{totalHours} u</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Totaal reiskosten</dt>
            <dd className="font-bold text-[#0B1F4D]">
              {formatEuro(totalTravel)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Totaal omzet excl. btw</dt>
            <dd className="font-bold text-[#0B1F4D]">
              {formatEuro(totalRevenue)}
            </dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Btw 21%</dt>
            <dd className="font-bold text-[#0B1F4D]">{formatEuro(vat)}</dd>
          </div>
          <div className="rounded-lg bg-[#F5F7FA]/80 px-3 py-2">
            <dt className="text-xs text-[#101828]/55">Totaal incl. btw</dt>
            <dd className="font-bold text-[#0B1F4D]">
              {formatEuro(totalInclVat)}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={handleCsvExport}>
            <Download className="h-4 w-4" />
            CSV exporteren
          </Button>
          <Button type="button" size="sm" disabled className="opacity-60">
            <FileSpreadsheet className="h-4 w-4" />
            Moneybird factuur voorbereiden — Binnenkort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
