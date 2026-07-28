import type { Metadata } from "next";
import { SalesMvpClient } from "@/components/dashboard/mvp/SalesMvpClient";
import { getClients, getDashboardStats, getLeads } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Sales dashboard | Intern dashboard",
  description:
    "Beheer opdrachtgevers, leads en follow-ups voor Helping Hands Agency.",
};

export default async function InternSalesPage() {
  const [clients, leads, stats] = await Promise.all([
    getClients(),
    getLeads(),
    getDashboardStats(),
  ]);

  return (
    <SalesMvpClient
      clients={clients}
      leads={leads}
      tablesReady={stats.tablesReady}
      errorMessage={stats.errorMessage}
      mode="sales"
    />
  );
}
