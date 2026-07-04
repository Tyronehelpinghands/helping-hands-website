import type { Metadata } from "next";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import ProjectStatusChart from "@/components/dashboard/ProjectStatusChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DashboardShell from "@/components/DashboardShell";
import { getSessionProfile } from "@/lib/auth-server";
import { medewerkerShiftTrend } from "@/lib/dashboard-data";
import { medewerkerDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Medewerkersdashboard | Helping Hands Agency",
  description: "Overzicht voor shifts, beschikbaarheid, briefings en uren.",
};

export default async function MedewerkerDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  const shiftChartData = medewerkerShiftTrend.map((item) => ({
    status: item.week,
    count: item.shifts,
    fill: "#173A8A",
  }));

  return (
    <DashboardShell
      profile={profile}
      title="Medewerkersportaal"
      description="Overzicht voor shifts, beschikbaarheid, briefings en uren."
    >
      <DashboardMetricCards cards={medewerkerDashboard} />
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart
          data={medewerkerShiftTrend.map((item) => ({
            month: item.week,
            omzet: item.shifts * 1000,
          }))}
          title="Shiftoverzicht"
          description="Geplande shifts per week (demo-data)"
        />
        <ProjectStatusChart
          data={shiftChartData}
          title="Weekplanning"
          description="Aantal shifts per week in de huidige periode"
        />
      </div>
    </DashboardShell>
  );
}
