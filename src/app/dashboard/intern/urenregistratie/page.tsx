import type { Metadata } from "next";
import { HoursMvpClient } from "@/components/dashboard/mvp/HoursMvpClient";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
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
  const [entries, projects, crew, stats, { profile }] = await Promise.all([
    getTimeEntries(),
    getProjects(),
    getCrewMembers(),
    getDashboardStats(),
    getCurrentUser(),
  ]);

  return (
    <HoursMvpClient
      entries={entries}
      projects={projects}
      crew={crew}
      tablesReady={stats.tablesReady}
      userRole={profile?.role ?? "planner"}
    />
  );
}
