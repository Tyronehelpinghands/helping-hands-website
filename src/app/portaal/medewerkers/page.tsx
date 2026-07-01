import PortalBanner from "@/components/PortalBanner";
import PortalDashboard from "@/components/PortalDashboard";
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
      <section className="hero-gradient text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Medewerkers
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Medewerkersportaal
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
              Overzicht voor shifts, beschikbaarheid, briefings en uren.
            </p>
          </div>
          <a
            href={`mailto:${applicationsEmail}`}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            Mail planning
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalDashboard cards={medewerkerDashboard} />
      </section>
    </>
  );
}
