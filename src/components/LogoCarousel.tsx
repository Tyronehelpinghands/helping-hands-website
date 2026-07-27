import Link from "next/link";
import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import {
  getHomepageFeaturedLogos,
  projectExperienceDisclaimer,
} from "@/lib/projectLogos";

type LogoCarouselProps = {
  showCta?: boolean;
};

export default function LogoCarousel({ showCta = true }: LogoCarouselProps) {
  const featured = getHomepageFeaturedLogos();
  const track = [...featured, ...featured];

  return (
    <section className="overflow-hidden border-y border-slate-200/80 bg-[#F5F7FA] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Crewervaring
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            Projectervaring en inzetgebieden
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#101828]/75 sm:text-lg">
            Onze crew is via jobs, partners en producties ingezet op uiteenlopende
            evenementen en locaties. Geen partnership-claims — wel concrete
            projectervaring.
          </p>
          {showCta ? (
            <Link
              href="/projecten"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
            >
              Bekijk projectervaring
            </Link>
          ) : null}
        </div>
      </div>

      <div className="relative mt-10 w-full max-w-full overflow-hidden sm:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="logo-carousel-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
          {track.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="w-[200px] shrink-0 sm:w-[240px] lg:w-[280px]"
            >
              <ProjectLogoCard logo={logo} variant="carousel" />
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-3xl px-4 text-center text-xs leading-6 text-[#101828]/55 sm:px-6">
        {projectExperienceDisclaimer}
      </p>
    </section>
  );
}
