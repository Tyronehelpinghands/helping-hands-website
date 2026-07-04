import type { Metadata } from "next";
import CrewAvailabilityCard from "@/components/dashboard/CrewAvailabilityCard";
import NotificationsList from "@/components/dashboard/NotificationsList";
import OpenActionsTable from "@/components/dashboard/OpenActionsTable";
import ProjectStatusChart from "@/components/dashboard/ProjectStatusChart";
import QuickActions from "@/components/dashboard/QuickActions";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { StatCardsGrid } from "@/components/dashboard/StatCard";
import {
  crewAvailability,
  dashboardNotifications,
  internKpiCards,
  openActions,
  projectStatusDonut,
  quickActions,
  revenueByWeek,
} from "@/data/dashboardMockData";

export const metadata: Metadata = {
  title: "Intern dashboard | Helping Hands Agency",
  description:
    "Intern overzicht voor planning, sales, crew, projecten en administratie.",
};

export default function InternDashboardPage() {
  return (
    <>
      <StatCardsGrid cards={internKpiCards} />

      <RevenueChart data={revenueByWeek} />

      <div className="grid gap-6 xl:grid-cols-2">
        <OpenActionsTable actions={openActions} />
        <ProjectStatusChart data={projectStatusDonut} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CrewAvailabilityCard data={crewAvailability} />
        <NotificationsList notifications={dashboardNotifications} />
      </div>

      <QuickActions actions={quickActions} />
    </>
  );
}
