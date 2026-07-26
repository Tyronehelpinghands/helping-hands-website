import type { Metadata } from "next";
import Link from "next/link";
import ProjectCta from "@/components/projects/ProjectCta";
import ProjectExperienceStats from "@/components/projects/ProjectExperienceStats";
import ProjectLogoCarousel from "@/components/projects/ProjectLogoCarousel";
import ProjectLogoGrid from "@/components/projects/ProjectLogoGrid";
import ProjectSectorCards from "@/components/projects/ProjectSectorCards";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Projecten & ervaring",
  description:
    "Projectervaring van Helping Hands Agency: crewervaring op festivals, concerten, stadions, beurzen, horeca en producties — via jobs, partners en producties.",
  path: "/projecten",
});

export default function ProjectenPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projecten", path: "/projecten" },
        ]}
      />
      <PageHero content={getPageHeroContent("/projecten")} />
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
            van projectervaring en sectoren waarin Helping Hands Agency actief is. Geen
            officiële partnership-claims — wel concrete crewervaring opgedaan op locatie.
          </p>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Personeel nodig voor een vergelijkbare productie?{" "}
            <Link
              href="/contact"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              Vraag crew aan
            </Link>{" "}
            of bekijk{" "}
            <Link
              href="/diensten"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              onze diensten
            </Link>
            .
          </p>
        </div>
      </section>

      <ProjectSectorCards />
      <ProjectCta />
    </>
  );
}
