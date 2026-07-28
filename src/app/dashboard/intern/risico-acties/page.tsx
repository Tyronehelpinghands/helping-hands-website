import type { Metadata } from "next";
import { TasksMvpClient } from "@/components/dashboard/mvp/TasksMvpClient";
import { getDashboardStats, getTasks } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Risico & Acties | Intern dashboard",
  description:
    "Beheer operationele risico's, openstaande acties, deadlines en opvolging.",
};

export default async function InternRisicoActiesPage() {
  const [tasks, stats] = await Promise.all([getTasks(), getDashboardStats()]);

  return <TasksMvpClient tasks={tasks} tablesReady={stats.tablesReady} />;
}
