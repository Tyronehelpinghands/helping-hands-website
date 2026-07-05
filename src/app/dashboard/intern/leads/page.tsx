import type { Metadata } from "next";
import LeadsDashboardClient from "@/components/leads/LeadsDashboardClient";
import { getLeadsPageData } from "@/lib/leads-server";
import { isHubSpotConfigured } from "@/lib/hubspot";

export const metadata: Metadata = {
  title: "Leads | Intern dashboard",
  description:
    "Beheer nieuwe kansen, contactmomenten en opvolging voor Helping Hands Agency.",
};

export default async function InternLeadsPage() {
  const { leads, followUps, source } = await getLeadsPageData();
  const hubspotConfigured = isHubSpotConfigured();

  return (
    <LeadsDashboardClient
      initialLeads={leads}
      initialFollowUps={followUps}
      dataSource={source}
      hubspotConfigured={hubspotConfigured}
    />
  );
}
