import type { Metadata } from "next";
import { TasksMvpClient } from "@/components/dashboard/mvp/TasksMvpClient";
import { getDashboardStats, getTasks } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Risico | Intern dashboard",
  description: "Alias voor Risico & Acties.",
};

export default async function InternRisicoPage() {
  const [tasks, stats] = await Promise.all([getTasks(), getDashboardStats()]);

  return <TasksMvpClient tasks={tasks} tablesReady={stats.tablesReady} />;
}
