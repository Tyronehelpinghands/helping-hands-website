import type { Metadata } from "next";
import { FinanceMvpClient } from "@/components/dashboard/mvp/FinanceMvpClient";
import {
  getDashboardStats,
  getFinanceSummary,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Financiën | Intern dashboard",
  description:
    "Inzicht in omzet, kosten, marge en openstaande concepten uit echte data.",
};

export default async function InternFinancienPage() {
  const [summary, stats] = await Promise.all([
    getFinanceSummary(),
    getDashboardStats(),
  ]);

  return (
    <FinanceMvpClient summary={summary} tablesReady={stats.tablesReady} />
  );
}
