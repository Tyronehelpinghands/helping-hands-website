import type { Metadata } from "next";
import ProjectCta from "@/components/projects/ProjectCta";
import ProjectExperienceStats from "@/components/projects/ProjectExperienceStats";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectLogoCarousel from "@/components/projects/ProjectLogoCarousel";
import ProjectLogoGrid from "@/components/projects/ProjectLogoGrid";
import ProjectSectorCards from "@/components/projects/ProjectSectorCards";

export const metadata: Metadata = {
  title: "Projecten & ervaring | Helping Hands Agency",
  description:
    "Bekijk projectervaring van Helping Hands Agency binnen events, horeca, stagebouw, productie, logistiek en hospitality.",
};

export default function ProjectenPage() {
  return (
    <>
      <ProjectHero />
      <ProjectExperienceStats />
      <ProjectLogoCarousel />
      <ProjectLogoGrid />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Ervaring via verschillende producties en partners
          </h2>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Onze crew is via verschillende opdrachten, partners en producties ingezet op
            uiteenlopende locaties en evenementen. Op deze pagina tonen we een overzicht
            van projectervaring en sectoren waarin Helping Hands Agency actief is.
          </p>
        </div>
      </section>

      <ProjectSectorCards />
      <ProjectCta />
    </>
  );
}
