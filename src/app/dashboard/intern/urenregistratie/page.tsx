import type { Metadata } from "next";
import { HoursMvpClient } from "@/components/dashboard/mvp/HoursMvpClient";
import {
  getCrewMembers,
  getDashboardStats,
  getProjects,
  getTimeEntries,
} from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Urenregistratie | Intern dashboard",
  description:
    "Controleer en keur uren goed per project en crewlid, bereken reiskosten en bereid facturatie voor.",
};

export default async function InternUrenregistratiePage() {
  const [entries, projects, crew, stats] = await Promise.all([
    getTimeEntries(),
    getProjects(),
    getCrewMembers(),
    getDashboardStats(),
  ]);

  return (
    <HoursMvpClient
      entries={entries}
      projects={projects}
      crew={crew}
      tablesReady={stats.tablesReady}
    />
  );
}
