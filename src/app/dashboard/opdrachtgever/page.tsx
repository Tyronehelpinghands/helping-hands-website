import type { Metadata } from "next";
import DashboardMetricCards from "@/components/dashboard/DashboardMetricCards";
import ProjectStatusChart from "@/components/dashboard/ProjectStatusChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import DashboardShell from "@/components/DashboardShell";
import { getSessionProfile } from "@/lib/auth-server";
import { opdrachtgeverRequestStatus, revenueByMonth } from "@/lib/dashboard-data";
import { opdrachtgeverDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Opdrachtgeversdashboard | Helping Hands Agency",
  description: "Overzicht voor aanvragen, projectinformatie en crewplanning.",
};

export default async function OpdrachtgeverDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  return (
    <DashboardShell
      profile={profile}
      title="Opdrachtgeversportaal"
      description="Overzicht voor personeelsaanvragen, projectinformatie en contact met planning."
    >
      <DashboardMetricCards cards={opdrachtgeverDashboard} />
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart
          data={revenueByMonth.map((item) => ({
            label: item.month,
            omzet: Math.round(item.omzet * 0.35),
            aanvragen: Math.max(1, Math.round(item.omzet / 5000)),
          }))}
          title="Inzetvolume"
          description="Maandelijks ingezette crew-uren (demo-data)"
        />
        <ProjectStatusChart
          data={opdrachtgeverRequestStatus}
          title="Status aanvragen"
          description="Verdeling van je personeelsaanvragen"
        />
      </div>
    </DashboardShell>
  );
}
