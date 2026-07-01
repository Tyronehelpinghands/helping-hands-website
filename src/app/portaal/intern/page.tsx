import Link from "next/link";
import PortalBanner from "@/components/PortalBanner";
import PortalDashboard from "@/components/PortalDashboard";
import { internDashboard } from "@/lib/portals";

export const metadata = {
  title: "Intern portaal | Helping Hands Agency",
  description: "Demo-dashboard voor intern planning en crewbeheer.",
};

export default function InternPortaalPage() {
  return (
    <>
      <PortalBanner />
      <section className="hero-gradient text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Intern
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Intern portaal
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
              Overzicht voor planning, aanvragen, crew en projectadministratie.
            </p>
          </div>
          <Link
            href="/login?type=intern"
            className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white/30 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
          >
            Naar login
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalDashboard cards={internDashboard} />
      </section>
    </>
  );
}
