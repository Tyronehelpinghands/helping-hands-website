import PortalBanner from "@/components/PortalBanner";
import PortalDashboard from "@/components/PortalDashboard";
import PortalHeroMark from "@/components/PortalHeroMark";
import { applicationsEmail } from "@/lib/navigation";
import { medewerkerDashboard } from "@/lib/portals";

export const metadata = {
  title: "Medewerkersportaal | Helping Hands Agency",
  description: "Demo-dashboard voor crewleden: shifts, briefing en uren.",
};

export default function MedewerkersPortaalPage() {
  return (
    <>
      <PortalBanner />
      <PortalHeroMark
        label="Medewerkers"
        title="Medewerkersportaal"
        description="Overzicht voor shifts, beschikbaarheid, briefings en uren."
        action={
          <a
            href={`mailto:${applicationsEmail}`}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            Mail planning
          </a>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalDashboard cards={medewerkerDashboard} />
      </section>
    </>
  );
}
