import type { Metadata } from "next";
import { FinanceMvpClient } from "@/components/dashboard/mvp/FinanceMvpClient";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getDashboardStats,
  getFinanceOverview,
} from "@/lib/dashboard/queries";
import { isMoneybirdConfigured } from "@/lib/server/moneybird";
import type { UserRole } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Financiën | Intern dashboard",
  description:
    "Inzicht in omzet, personeelskosten, marge en openstaande facturen uit echte data.",
};

const FINANCE_VIEW_ROLES: UserRole[] = [
  "owner",
  "admin",
  "finance",
  "planner",
];

function firstParam(
  value: string | string[] | undefined,
): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
}

export default async function InternFinancienPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const period = firstParam(params.period);
  const from = firstParam(params.from);
  const to = firstParam(params.to);

  const [{ profile }, overview, stats] = await Promise.all([
    getCurrentUser(),
    getFinanceOverview({ period, from, to }),
    getDashboardStats(),
  ]);

  const role = profile?.role;
  const canView = Boolean(role && FINANCE_VIEW_ROLES.includes(role));

  return (
    <FinanceMvpClient
      overview={overview}
      tablesReady={stats.tablesReady}
      moneybirdConfigured={isMoneybirdConfigured()}
      canView={canView}
    />
  );
}
