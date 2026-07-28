import RevealOnScroll from "@/components/RevealOnScroll";
import PhotoBackgroundCard from "@/components/PhotoBackgroundCard";
import { uitvalContent } from "@/lib/opdrachtgeversContent";
import { opdrachtgeversHorecaPhoto } from "@/lib/crewPhotos";

export default function UitvalSection() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
          <RevealOnScroll>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {uitvalContent.eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              {uitvalContent.title}
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-base leading-8 text-[#101828]/80">
              {uitvalContent.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={80}>
            <PhotoBackgroundCard
              photo={opdrachtgeversHorecaPhoto}
              className="min-h-[16rem] lg:min-h-[20rem]"
              overlayClassName="bg-[#0B1F4D]/70"
            >
              <div className="flex h-full min-h-[16rem] flex-col justify-end p-6 text-white sm:p-8 lg:min-h-[20rem]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                  In de praktijk
                </p>
                <p className="mt-2 text-lg font-black leading-snug">
                  Snel schakelen, eerlijk communiceren
                </p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Bij uitval gaan we direct op zoek naar een oplossing — en
                  laten we het weten als iets écht niet lukt.
                </p>
              </div>
            </PhotoBackgroundCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
