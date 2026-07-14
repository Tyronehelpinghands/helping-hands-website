import Link from "next/link";
import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import { getHomepageFeaturedLogos } from "@/lib/projectLogos";

type LogoCarouselProps = {
  showCta?: boolean;
};

export default function LogoCarousel({ showCta = true }: LogoCarouselProps) {
  const featured = getHomepageFeaturedLogos();
  const track = [...featured, ...featured];

  return (
    <section className="overflow-hidden border-y border-slate-200/80 bg-[#F5F7FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Crewervaring
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            Projectervaring en partners
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#101828]/75 sm:text-lg">
            Onze crew is ingezet via verschillende opdrachten, partners en producties
            binnen events, horeca, stagebouw en productie.
          </p>
          {showCta ? (
            <Link
              href="/projecten"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0B1F4D] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2"
            >
              Bekijk projectervaring
            </Link>
          ) : null}
        </div>
      </div>

      <div className="relative mt-10 w-full max-w-full overflow-hidden sm:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="logo-carousel-track flex w-max gap-4 px-4 sm:gap-6 sm:px-6">
          {track.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="w-[180px] shrink-0 sm:w-[220px] lg:w-[260px]"
            >
              <ProjectLogoCard logo={logo} variant="carousel" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
