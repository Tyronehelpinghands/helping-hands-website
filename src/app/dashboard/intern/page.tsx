import type { Metadata } from "next";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import ProjectStatusChart from "@/components/dashboard/ProjectStatusChart";
import RecentRequestsTable from "@/components/dashboard/RecentRequestsTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DashboardShell from "@/components/DashboardShell";
import { getSessionProfile } from "@/lib/auth-server";
import {
  projectStatusBreakdown,
  revenueByMonth,
} from "@/lib/dashboard-data";
import { internDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Intern dashboard | Helping Hands Agency",
  description: "Intern overzicht voor planning, crew en projectadministratie.",
};

export default async function InternDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  return (
    <DashboardShell
      profile={profile}
      title="Intern portaal"
      description="Overzicht voor planning, aanvragen, crew en projectadministratie."
    >
      <DashboardMetricCards cards={internDashboard} />
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueByMonth} />
        <ProjectStatusChart data={projectStatusBreakdown} />
      </div>
      <RecentRequestsTable />
    </DashboardShell>
  );
}
