import type { Metadata } from "next";
import { InvoiceMvpClient } from "@/components/dashboard/mvp/InvoiceMvpClient";
import {
  getApprovedUninvoicedTimeEntries,
  getDashboardStats,
  getInvoiceDrafts,
  getProjects,
} from "@/lib/dashboard/queries";
import {
  isMoneybirdConfigured,
  isMoneybirdInvoiceReady,
} from "@/lib/server/moneybird";

export const metadata: Metadata = {
  title: "Facturatie | Intern dashboard",
  description:
    "Maak factuurconcepten op basis van goedgekeurde uren en sync optioneel naar Moneybird.",
};

export default async function InternFacturatiePage() {
  const [drafts, projects, approvedEntries, stats] = await Promise.all([
    getInvoiceDrafts(),
    getProjects(),
    getApprovedUninvoicedTimeEntries(),
    getDashboardStats(),
  ]);

  return (
    <InvoiceMvpClient
      drafts={drafts}
      projects={projects}
      approvedEntries={approvedEntries}
      tablesReady={stats.tablesReady}
      moneybirdConfigured={isMoneybirdConfigured()}
      moneybirdInvoiceReady={isMoneybirdInvoiceReady()}
    />
  );
}
