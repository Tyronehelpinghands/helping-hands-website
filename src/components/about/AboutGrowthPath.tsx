import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";
import { aboutGrowthIntro, aboutGrowthPath } from "@/lib/aboutPage";

export default function AboutGrowthPath() {
  return (
    <section id="groei" className="relative scroll-mt-28 overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-24">
      <div
        className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#F28C28]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {aboutGrowthIntro.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {aboutGrowthIntro.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75 sm:text-lg">
              {aboutGrowthIntro.description}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm font-bold uppercase tracking-[0.14em] text-white/60">
            Door te werken leren medewerkers onder andere
          </p>
          <ul className="mx-auto mt-4 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {aboutGrowthIntro.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85"
              >
                {skill}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <StaggerReveal
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          stepMs={60}
        >
          {aboutGrowthPath.map((stage) => (
            <article
              key={stage.step}
              className="relative h-full rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:border-[#F28C28]/50 hover:bg-white/10"
            >
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                Stap {stage.step}
              </span>
              <h3 className="mt-3 text-lg font-black">{stage.title}</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                {stage.description}
              </p>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
