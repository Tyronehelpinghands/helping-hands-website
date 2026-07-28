import type { Metadata } from "next";
import { LeadsMvpClient } from "@/components/dashboard/mvp/SalesMvpClient";
import { getDashboardStats, getLeads } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Leads | Intern dashboard",
  description:
    "Beheer nieuwe kansen, contactmomenten en opvolging voor Helping Hands Agency.",
};

export default async function InternLeadsPage() {
  const [leads, stats] = await Promise.all([getLeads(), getDashboardStats()]);

  return (
    <LeadsMvpClient
      leads={leads}
      tablesReady={stats.tablesReady}
      errorMessage={stats.errorMessage}
    />
  );
}
