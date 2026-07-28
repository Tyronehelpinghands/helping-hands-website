import type { Metadata } from "next";
import { ProjectsMvpClient } from "@/components/dashboard/mvp/ProjectsMvpClient";
import {
  getClients,
  getDashboardStats,
  getInvoiceDrafts,
  getProjects,
  getShifts,
  getTasks,
  getTimeEntries,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Projecten | Intern dashboard",
  description:
    "Beheer actieve projecten, planning, crewbezetting en projectstatus voor Helping Hands Agency.",
};

export default async function InternProjectenPage() {
  const [projects, clients, shifts, timeEntries, invoices, tasks, stats] =
    await Promise.all([
      getProjects(),
      getClients(),
      getShifts(),
      getTimeEntries(),
      getInvoiceDrafts(),
      getTasks(),
      getDashboardStats(),
    ]);

  return (
    <ProjectsMvpClient
      projects={projects}
      clients={clients}
      shifts={shifts}
      timeEntries={timeEntries}
      invoices={invoices}
      tasks={tasks}
      tablesReady={stats.tablesReady}
    />
  );
}
