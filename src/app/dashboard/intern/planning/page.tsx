import type { Metadata } from "next";
import PlanningDashboardClient from "@/components/planning/PlanningDashboardClient";
import { getPlanningPageData } from "@/lib/planning-server";
import { isShiftbaseConfigured } from "@/lib/shiftbase";

export const metadata: Metadata = {
  title: "Planning | Intern dashboard",
  description:
    "Plan crew op events, restaurants en producties met overzicht per dag, week en project.",
};

export default async function InternPlanningPage() {
  const { shifts, assignments, hours, source } = await getPlanningPageData();
  const shiftbaseConfigured = isShiftbaseConfigured();

  return (
    <PlanningDashboardClient
      initialShifts={shifts}
      initialAssignments={assignments}
      initialHours={hours}
      dataSource={source}
      shiftbaseConfigured={shiftbaseConfigured}
    />
  );
}
