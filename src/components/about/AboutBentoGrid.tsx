import HomeCrewBento from "@/components/sections/HomeCrewBento";
import RevealOnScroll from "@/components/RevealOnScroll";
import { aboutBentoIntro } from "@/lib/aboutPage";
import { aboutBentoPhotos } from "@/lib/crewPhotos";

export default function AboutBentoGrid() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {aboutBentoIntro.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              {aboutBentoIntro.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-[#101828]/70">
              {aboutBentoIntro.description}
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 sm:mt-12">
          <HomeCrewBento photos={aboutBentoPhotos} />
        </div>
      </div>
    </section>
  );
}
