import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import { aboutFounder } from "@/lib/aboutPage";

export default function FounderStory() {
  const { badge } = aboutFounder;

  return (
    <section id="verhaal" className="scroll-mt-28 bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14">
          <RevealOnScroll>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {aboutFounder.eyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              {aboutFounder.title}
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-base leading-8 text-[#101828]/80 sm:text-lg">
              {aboutFounder.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="relative mt-8 max-w-xl overflow-hidden rounded-3xl bg-[#0B1F4D] p-6 text-white shadow-xl sm:p-8">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F28C28]/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="mb-3 h-1 w-10 rounded-full bg-[#F28C28]" />
                <blockquote className="text-xl font-black leading-snug tracking-tight sm:text-2xl">
                  “{aboutFounder.quote}”
                </blockquote>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="scale">
            <figure className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[4/5] min-h-[22rem] overflow-hidden rounded-2xl bg-[#0B1F4D] shadow-xl sm:min-h-[26rem] lg:min-h-[32rem]">
                {badge.image ? (
                  <Image
                    src={badge.image.src}
                    alt={badge.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, min(560px, 48vw)"
                    className="object-cover object-[center_18%]"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-black tracking-wide text-white">
                    {badge.initials}
                  </div>
                )}
              </div>
              <figcaption className="mt-5">
                <p className="text-lg font-black leading-snug text-[#0B1F4D]">
                  {badge.name}
                </p>
                <p className="mt-0.5 text-sm text-[#101828]/70">{badge.role}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  {badge.since}
                </p>
              </figcaption>
            </figure>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
