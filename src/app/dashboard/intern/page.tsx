import type { Metadata } from "next";
import DashboardShell from "@/components/DashboardShell";
import PortalDashboard from "@/components/PortalDashboard";
import { getSessionProfile } from "@/lib/auth-server";
import { internDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Intern dashboard | Helping Hands Agency",
  description: "Intern overzicht voor planning, crew en projectadministratie.",
};

export default async function InternDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  return (
    <DashboardShell
      profile={profile}
      title="Intern portaal"
      description="Overzicht voor planning, aanvragen, crew en projectadministratie."
    >
      <PortalDashboard cards={internDashboard} />
    </DashboardShell>
  );
}
