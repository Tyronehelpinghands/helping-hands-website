import type { Metadata } from "next";
import Link from "next/link";
import MobileProjectCta from "@/components/projects/MobileProjectCta";
import ProjectCta from "@/components/projects/ProjectCta";
import ProjectExperienceBar from "@/components/projects/ProjectExperienceBar";
import ProjectLocationsVisual from "@/components/projects/ProjectLocationsVisual";
import ProjectLogoCarousel from "@/components/projects/ProjectLogoCarousel";
import ProjectLogoGrid from "@/components/projects/ProjectLogoGrid";
import ProjectSectorBento from "@/components/projects/ProjectSectorBento";
import ProjectStorySection from "@/components/projects/ProjectStorySection";
import ProjectsHero from "@/components/projects/ProjectsHero";
import RevealOnScroll from "@/components/RevealOnScroll";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import {
  projectenPageDescription,
  projectenPageTitle,
  projectExperienceItemListJsonLd,
} from "@/lib/projectSeo";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: projectenPageTitle,
  description: projectenPageDescription,
  path: "/projecten",
  absoluteTitle: true,
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
      <JsonLd data={projectExperienceItemListJsonLd()} />

      <ProjectsHero />
      <ProjectExperienceBar />
      <ProjectLogoCarousel />

      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
                Ervaring via verschillende producties en partners
              </h2>
              <p className="mt-4 text-base leading-8 text-[#101828]/75">
                Onze crew is via verschillende opdrachten, partners en producties
                ingezet op uiteenlopende locaties en evenementen. Op deze pagina
                tonen we projectervaring event crew en inzetgebieden — van
                festival crew tot crew voor beurzen en productie crew. Geen
                officiële partnership-claims: wel concrete crewervaring opgedaan
                op locatie.
              </p>
              <p className="mt-4 text-base leading-8 text-[#101828]/75">
                Personeel nodig voor een vergelijkbare productie?{" "}
                <Link
                  href="/contact"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  Vraag crew aan
                </Link>
                , bekijk{" "}
                <Link
                  href="/diensten"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  onze diensten
                </Link>
                , of zie{" "}
                <Link
                  href="/opdrachtgevers"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  opdrachtgevers
                </Link>
                .
              </p>
              <a
                href="#projectoverzicht"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#173A8A]/20 bg-[#F5F7FA] px-5 text-sm font-bold text-[#173A8A] transition hover:border-[#F28C28]/40 hover:text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
              >
                Ga naar overzicht
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <ProjectLogoGrid />
      <ProjectSectorBento />
      <ProjectCta variant="mid" />
      <ProjectStorySection />
      <ProjectLocationsVisual />
      <ProjectCta variant="end" />
      <MobileProjectCta />
    </>
  );
}
