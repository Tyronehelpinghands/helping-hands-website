import type { Metadata } from "next";
import CrewDashboardClient from "@/components/dashboard/crew/CrewDashboardClient";

export const metadata: Metadata = {
  title: "Crew | Intern dashboard",
  description:
    "Beheer crewleden, beschikbaarheid, functies, certificaten en Shiftbase-koppeling.",
};

// TODO: later koppelen aan echte auth/rollen — layout beveiligt al admin/planner via intern layout

export default function InternCrewPage() {
  return <CrewDashboardClient />;
}
