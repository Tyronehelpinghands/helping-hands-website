"use client";

import {
  MvpEmptyState,
  MvpPageHeader,
} from "@/components/dashboard/mvp/MvpShared";
import { formatCurrency, formatHours, formatNumber } from "@/lib/dashboard/formatters";
import type { FinanceSummary } from "@/lib/dashboard/queries";

export function FinanceMvpClient({
  summary,
  tablesReady,
}: {
  summary: FinanceSummary;
  tablesReady: boolean;
}) {
  const hasData =
    summary.openDraftCount > 0 ||
    summary.totalHours > 0 ||
    summary.paidRevenue > 0 ||
    summary.draftRevenue > 0 ||
    summary.readyRevenue > 0;

  return (
    <div className="space-y-6">
      <MvpPageHeader
        title="Financiën"
        description="Omzet, uren, reiskosten en marge op basis van factuurconcepten en goedgekeurde uren."
        notice={
          tablesReady
            ? "Moneybird-verzending is nog niet gekoppeld — cijfers komen uit Supabase."
            : "Voer docs/internal-dashboard-database.md uit in Supabase."
        }
      />

      {!hasData ? (
        <MvpEmptyState
          title="Nog onvoldoende financiële data"
          description="Maak factuurconcepten of keur uren goed om omzet en marge te zien."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Concept-omzet",
              value: formatCurrency(summary.draftRevenue),
            },
            {
              label: "Klaar / verstuurd",
              value: formatCurrency(summary.readyRevenue),
            },
            {
              label: "Betaald",
              value: formatCurrency(summary.paidRevenue),
            },
            {
              label: "Open concepten",
              value: String(summary.openDraftCount),
            },
            {
              label: "Uren (approved/invoiced)",
              value: formatHours(summary.totalHours),
            },
            {
              label: "Reiskosten",
              value: formatCurrency(summary.travelCosts),
            },
            {
              label: "Crew-kosten (indicatie)",
              value: formatCurrency(summary.crewCostEstimate),
            },
            {
              label: "Marge-indicatie",
              value: `${formatCurrency(summary.marginEstimate)}${
                summary.marginPercent !== null
                  ? ` (${formatNumber(summary.marginPercent, 1)}%)`
                  : ""
              }`,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-xl font-black text-[#0B1F4D]">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
