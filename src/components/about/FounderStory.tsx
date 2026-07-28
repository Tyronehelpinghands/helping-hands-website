import RevealOnScroll from "@/components/RevealOnScroll";
import { aboutFounder } from "@/lib/aboutPage";

export default function FounderStory() {
  return (
    <section id="verhaal" className="scroll-mt-28 bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
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
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="scale">
            <div className="relative overflow-hidden rounded-3xl bg-[#0B1F4D] p-6 text-white shadow-xl sm:p-8">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F28C28]/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-black tracking-wide">
                  {aboutFounder.badge.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-black leading-snug">
                    {aboutFounder.badge.name}
                  </p>
                  <p className="text-sm text-white/70">{aboutFounder.badge.role}</p>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                    {aboutFounder.badge.since}
                  </p>
                </div>
              </div>

              <div className="relative mt-6 border-t border-white/10 pt-6">
                <div className="mb-3 h-1 w-10 rounded-full bg-[#F28C28]" />
                <blockquote className="text-xl font-black leading-snug tracking-tight sm:text-2xl">
                  “{aboutFounder.quote}”
                </blockquote>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
