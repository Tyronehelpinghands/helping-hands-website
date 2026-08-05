import type { Metadata } from "next";
import { InvoiceMvpClient } from "@/components/dashboard/mvp/InvoiceMvpClient";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getApprovedUninvoicedTimeEntries,
  getDashboardStats,
  getInvoiceDraftsResult,
  getInvoicedOrphanTimeEntries,
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
  const [
    draftsResult,
    projects,
    approvedEntries,
    stats,
    moneybirdInvoiceReady,
    { profile },
  ] = await Promise.all([
    getInvoiceDraftsResult(),
    getProjects(),
    getApprovedUninvoicedTimeEntries(),
    getDashboardStats(),
    ensureMoneybirdInvoiceReady(),
    getCurrentUser(),
  ]);

  const orphanInvoicedEntries = await getInvoicedOrphanTimeEntries(
    draftsResult.data,
  );

  return (
    <InvoiceMvpClient
      drafts={draftsResult.data}
      draftsError={draftsResult.error}
      projects={projects}
      approvedEntries={approvedEntries}
      orphanInvoicedEntries={orphanInvoicedEntries}
      tablesReady={stats.tablesReady}
      moneybirdConfigured={isMoneybirdConfigured()}
      moneybirdInvoiceReady={moneybirdInvoiceReady}
      userRole={profile?.role ?? "planner"}
    />
  );
}
