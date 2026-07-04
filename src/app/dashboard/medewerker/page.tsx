import type { Metadata } from "next";
import DashboardShell from "@/components/DashboardShell";
import PortalDashboard from "@/components/PortalDashboard";
import { getSessionProfile } from "@/lib/auth-server";
import { medewerkerDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Medewerkersdashboard | Helping Hands Agency",
  description: "Overzicht voor shifts, beschikbaarheid, briefings en uren.",
};

export default async function MedewerkerDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  return (
    <DashboardShell
      profile={profile}
      title="Medewerkersportaal"
      description="Overzicht voor shifts, beschikbaarheid, briefings en uren."
    >
      <PortalDashboard cards={medewerkerDashboard} />
    </DashboardShell>
  );
}
