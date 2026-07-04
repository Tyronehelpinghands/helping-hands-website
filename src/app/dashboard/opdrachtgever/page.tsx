import type { Metadata } from "next";
import DashboardShell from "@/components/DashboardShell";
import PortalDashboard from "@/components/PortalDashboard";
import { getSessionProfile } from "@/lib/auth-server";
import { opdrachtgeverDashboard } from "@/lib/portals";

export const metadata: Metadata = {
  title: "Opdrachtgeversdashboard | Helping Hands Agency",
  description: "Overzicht voor aanvragen, projectinformatie en crewplanning.",
};

export default async function OpdrachtgeverDashboardPage() {
  const { profile } = await getSessionProfile();

  if (!profile) {
    return null;
  }

  return (
    <DashboardShell
      profile={profile}
      title="Opdrachtgeversportaal"
      description="Overzicht voor personeelsaanvragen, projectinformatie en contact met planning."
    >
      <PortalDashboard cards={opdrachtgeverDashboard} />
    </DashboardShell>
  );
}
