import Link from "next/link";
import PortalBanner from "@/components/PortalBanner";
import PortalDashboard from "@/components/PortalDashboard";
import PortalHeroMark from "@/components/PortalHeroMark";
import { opdrachtgeverDashboard } from "@/lib/portals";

export const metadata = {
  title: "Opdrachtgeversportaal | Helping Hands Agency",
  description: "Demo-dashboard voor opdrachtgevers: aanvragen en projectinformatie.",
};

export default function OpdrachtgeversPortaalPage() {
  return (
    <>
      <PortalBanner />
      <PortalHeroMark
        label="Opdrachtgevers"
        title="Opdrachtgeversportaal"
        description="Overzicht voor personeelsaanvragen, projectinformatie en contact met planning."
        action={
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            Personeel aanvragen
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PortalDashboard cards={opdrachtgeverDashboard} />
      </section>
    </>
  );
}
