import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import { getFeaturedProjectLogos } from "@/lib/projectLogos";

export default function ProjectLogoCarousel() {
  const featured = getFeaturedProjectLogos();
  const track = [...featured, ...featured];

  return (
    <section className="overflow-hidden border-y border-slate-200/80 bg-[#F5F7FA] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Crewervaring
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
            Projecten, locaties en opdrachtgevers waar crewervaring is opgedaan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#101828]/70 sm:text-base">
            Een selectie van producties, partners en locaties uit ons overzicht van
            projectervaring.
          </p>
        </div>
      </div>

      <div className="relative mt-8 w-full max-w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-16" />
        <div className="project-logo-carousel-track flex w-max gap-3 px-4 sm:gap-4">
          {track.map((logo, index) => (
            <div key={`${logo.id}-${index}`} className="w-36 shrink-0 sm:w-40">
              <ProjectLogoCard logo={logo} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
