import type { Metadata } from "next";
import HubSpotSyncCard from "@/components/dashboard/sales/HubSpotSyncCard";
import SalesFollowUpTasks from "@/components/dashboard/sales/SalesFollowUpTasks";
import SalesKpiCards from "@/components/dashboard/sales/SalesKpiCards";
import SalesLeadsTable from "@/components/dashboard/sales/SalesLeadsTable";
import SalesPipelineOverview from "@/components/dashboard/sales/SalesPipelineOverview";
import {
  salesFollowUps,
  salesKpiCards,
  salesLeads,
  salesPipeline,
} from "@/data/salesMockData";
import { isHubSpotConfigured } from "@/lib/hubspot";

export const metadata: Metadata = {
  title: "Sales | Intern dashboard",
  description:
    "Sales overzicht, pipeline, leads, follow-ups en HubSpot synchronisatie.",
};

export default function InternSalesPage() {
  const hubspotConfigured = isHubSpotConfigured();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F28C28]">
          Sales
        </p>
        <h2 className="mt-1 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Pipeline & opvolging
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#101828]/70">
          Overzicht van leads, offertes, follow-ups en HubSpot synchronisatie
          voor events, horeca en producties.
        </p>
      </div>

      <SalesKpiCards cards={salesKpiCards} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SalesPipelineOverview stages={salesPipeline} />
        <HubSpotSyncCard initialConfigured={hubspotConfigured} />
      </div>

      <SalesLeadsTable leads={salesLeads} />

      <SalesFollowUpTasks tasks={salesFollowUps} />
    </div>
  );
}
