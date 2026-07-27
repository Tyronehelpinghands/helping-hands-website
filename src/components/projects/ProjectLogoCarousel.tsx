import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getFeaturedProjectLogos } from "@/lib/projectLogos";

export default function ProjectLogoCarousel() {
  const featured = getFeaturedProjectLogos();
  const track = [...featured, ...featured];

  return (
    <section className="overflow-hidden border-y border-slate-200/80 bg-[#F5F7FA] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Featured
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
              Projectervaring en inzetgebieden
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#101828]/70 sm:text-base">
              Een selectie van producties, partners en locaties waar crewervaring
              is opgedaan.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      <div className="relative mt-10 w-full max-w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-16 lg:w-20" />
        <div className="project-logo-carousel-track flex w-max gap-4 px-4 sm:gap-5 sm:px-6">
          {track.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="w-[180px] shrink-0 sm:w-[240px] lg:w-[280px]"
            >
              <ProjectLogoCard logo={logo} variant="carousel" interactive={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
