import type { Metadata } from "next";
import { InvoiceMvpClient } from "@/components/dashboard/mvp/InvoiceMvpClient";
import {
  getApprovedUninvoicedTimeEntries,
  getDashboardStats,
  getInvoiceDrafts,
  getProjects,
} from "@/lib/dashboard/queries";
import {
  ensureMoneybirdInvoiceReady,
  isMoneybirdConfigured,
} from "@/lib/server/moneybird";

export const metadata: Metadata = {
  title: "Facturatie | Intern dashboard",
  description:
    "Maak factuurconcepten op basis van goedgekeurde uren en sync optioneel naar Moneybird.",
};

export default async function InternFacturatiePage() {
  const [drafts, projects, approvedEntries, stats, moneybirdInvoiceReady] =
    await Promise.all([
      getInvoiceDrafts(),
      getProjects(),
      getApprovedUninvoicedTimeEntries(),
      getDashboardStats(),
      ensureMoneybirdInvoiceReady(),
    ]);

  return (
    <InvoiceMvpClient
      drafts={drafts}
      projects={projects}
      approvedEntries={approvedEntries}
      tablesReady={stats.tablesReady}
      moneybirdConfigured={isMoneybirdConfigured()}
      moneybirdInvoiceReady={moneybirdInvoiceReady}
    />
  );
}
