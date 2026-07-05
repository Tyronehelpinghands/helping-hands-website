import type { Metadata } from "next";
import SalesDashboardClient from "@/components/dashboard/sales/SalesDashboardClient";
import {
  pipelineDeals,
  salesFollowUps,
  salesKpiCards,
  salesLeads,
  salesPipeline,
} from "@/data/salesMockData";
import { isHubSpotConfigured } from "@/lib/hubspot";

export const metadata: Metadata = {
  title: "Sales dashboard | Intern dashboard",
  description:
    "Beheer leads, deals, follow-ups en HubSpot synchronisatie voor Helping Hands Agency.",
};

export default function InternSalesPage() {
  const hubspotConfigured = isHubSpotConfigured();

  return (
    <SalesDashboardClient
      kpiCards={salesKpiCards}
      pipeline={salesPipeline}
      deals={pipelineDeals}
      leads={salesLeads}
      followUps={salesFollowUps}
      hubspotConfigured={hubspotConfigured}
    />
  );
}
