import type { Metadata } from "next";
import { CrewMvpClient } from "@/components/dashboard/mvp/CrewMvpClient";
import { getCrewMembers, getDashboardStats } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Crew | Intern dashboard",
  description:
    "Beheer crewleden, beschikbaarheid, functies, certificaten en Shiftbase-koppeling.",
};

export default async function InternCrewPage() {
  const [crew, stats] = await Promise.all([
    getCrewMembers(),
    getDashboardStats(),
  ]);

  return <CrewMvpClient crew={crew} tablesReady={stats.tablesReady} />;
}
