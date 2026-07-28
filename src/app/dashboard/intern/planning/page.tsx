import type { Metadata } from "next";
import { PlanningMvpClient } from "@/components/dashboard/mvp/PlanningMvpClient";
import {
  endOfWeek,
  startOfWeek,
  toDateString,
} from "@/lib/dashboard/calculations";
import {
  getCrewMembers,
  getDashboardStats,
  getProjects,
  getShifts,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Planning | Intern dashboard",
  description:
    "Plan crew op events, restaurants en producties met overzicht per dag, week en project.",
};

export default async function InternPlanningPage() {
  const weekFrom = toDateString(startOfWeek());
  const weekTo = toDateString(endOfWeek());
  const broadFrom = toDateString(
    new Date(new Date(weekFrom).getTime() - 14 * 86400000),
  );
  const broadTo = toDateString(
    new Date(new Date(weekTo).getTime() + 14 * 86400000),
  );

  const [shifts, projects, crew, stats] = await Promise.all([
    getShifts({ from: broadFrom, to: broadTo }),
    getProjects(),
    getCrewMembers(),
    getDashboardStats(),
  ]);

  return (
    <PlanningMvpClient
      shifts={shifts}
      projects={projects}
      crew={crew}
      tablesReady={stats.tablesReady}
    />
  );
}
