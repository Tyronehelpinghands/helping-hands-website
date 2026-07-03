import Link from "next/link";
import PortalBanner from "@/components/PortalBanner";
import PortalDashboard from "@/components/PortalDashboard";
import PortalHeroMark from "@/components/PortalHeroMark";
import { internDashboard } from "@/lib/portals";

export const metadata = {
  title: "Intern portaal | Helping Hands Agency",
  description: "Demo-dashboard voor intern planning en crewbeheer.",
};

export default function InternPortaalPage() {
  return (
    <>
      <PortalBanner />
      <PortalHeroMark
        label="Intern"
        title="Intern portaal"
        description="Overzicht voor planning, aanvragen, crew en projectadministratie."
        action={
          <Link
            href="/login?type=intern"
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
          >
            Naar login
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalDashboard cards={internDashboard} />
      </section>
    </>
  );
}
