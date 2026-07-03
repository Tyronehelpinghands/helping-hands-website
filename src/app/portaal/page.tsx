import Link from "next/link";
import { BrandLogoImage } from "@/components/BrandLogo";
import PortalBanner from "@/components/PortalBanner";
import PortalHeroMark from "@/components/PortalHeroMark";
import { portals } from "@/lib/portals";

export const metadata = {
  title: "Portalen | Helping Hands Agency",
  description:
    "Overzicht van intern portaal, medewerkersportaal en opdrachtgeversportaal.",
};

export default function PortaalPage() {
  return (
    <>
      <PortalBanner />
      <PortalHeroMark
        label="Portalen"
        title="Helping Hands Portalen"
        description="Voorbereide dashboards voor intern gebruik, crewleden en opdrachtgevers. Authenticatie volgt in een latere fase."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {portals.map((portal) => (
            <article
              key={portal.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:border-[#F28C28]/40 hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <BrandLogoImage
                  variant="mark"
                  imageClassName="h-8 w-8 opacity-50"
                />
                <span className="inline-flex rounded-full bg-[#F5F7FA] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#173A8A]">
                  {portal.title}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#101828]/75">
                {portal.description}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={portal.dashboardHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#173A8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
                >
                  Bekijk dashboard
                </Link>
                <Link
                  href={portal.href}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Naar login
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
