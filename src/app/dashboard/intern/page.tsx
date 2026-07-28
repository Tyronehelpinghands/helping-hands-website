import type { Metadata } from "next";
import { OverviewMvpClient } from "@/components/dashboard/mvp/OverviewMvpClient";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  getDashboardStats,
  getProjects,
  getTasks,
  getTimeEntries,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Intern dashboard | Helping Hands Agency",
  description:
    "Intern overzicht voor planning, sales, crew, projecten en administratie.",
};

export default async function InternDashboardPage() {
  const [{ profile }, stats, projects, entries, tasks] = await Promise.all([
    getCurrentUser(),
    getDashboardStats(),
    getProjects(),
    getTimeEntries(),
    getTasks(),
  ]);

  const upcomingProjects = projects
    .filter((p) => ["draft", "confirmed", "in_progress"].includes(p.status))
    .slice(0, 5);
  const pendingHours = entries
    .filter((e) => e.status === "submitted")
    .slice(0, 5);
  const openTasks = tasks
    .filter((t) => ["open", "in_progress"].includes(t.status))
    .slice(0, 5);

  return (
    <OverviewMvpClient
      stats={stats}
      profileName={profile?.full_name ?? null}
      profileRole={profile?.role ?? "admin"}
      upcomingProjects={upcomingProjects}
      pendingHours={pendingHours}
      openTasks={openTasks}
    />
  );
}
