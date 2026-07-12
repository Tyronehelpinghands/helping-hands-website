"use client";

import { AlertTriangle, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  buildAttentionPoints,
  downloadRiskCsv,
  exportRiskActionsCsv,
  type RiskAction,
  type RiskAttentionPoint,
} from "@/lib/riskActions";

function AttentionList({ points }: { points: RiskAttentionPoint[] }) {
  const severityClass: Record<RiskAttentionPoint["severity"], string> = {
    info: "border-[#38bdf8]/20 bg-[#38bdf8]/5 text-[#0284c7]",
    warning: "border-orange-200 bg-orange-50 text-orange-800",
    critical: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-[#0B1F4D]">Automatische aandachtspunten</h3>
      {points.length === 0 ? (
        <p className="text-xs text-[#101828]/55">Geen urgente aandachtspunten.</p>
      ) : (
        points.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${severityClass[p.severity]}`}
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {p.label}
          </div>
        ))
      )}
    </div>
  );
}

export default function RiskActionExportPanel({
  actions,
  onWeekOverview,
}: {
  actions: RiskAction[];
  onWeekOverview: () => void;
}) {
  const openActions = actions.filter((a) => a.status !== "Afgerond");
  const attentionPoints = buildAttentionPoints(actions);

  function handleCsv() {
    const csv = exportRiskActionsCsv(openActions);
    downloadRiskCsv(csv);
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Export & opvolging
        </CardTitle>
        <CardDescription>
          Exporteer openstaande acties voor intern overleg of weekstart.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AttentionList points={attentionPoints} />
        <p className="text-xs text-[#101828]/60">
          {openActions.length} openstaande acties beschikbaar voor export.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={handleCsv}>
            <Download className="h-4 w-4" />
            CSV exporteren
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onWeekOverview}>
            <Download className="h-4 w-4" />
            Weekoverzicht maken
          </Button>
          <Button type="button" size="sm" disabled className="opacity-60">
            <Share2 className="h-4 w-4" />
            Actielijst delen — Binnenkort
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
