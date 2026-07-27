import RevealOnScroll from "@/components/RevealOnScroll";

const growthPath = [
  {
    step: "01",
    title: "Nieuwe crew",
    description:
      "Eerste klussen, briefing volgen, laten zien dat je betrouwbaar bent.",
  },
  {
    step: "02",
    title: "Vaste crew",
    description:
      "Vaker ingepland worden op basis van beschikbaarheid en inzet.",
  },
  {
    step: "03",
    title: "Ervaren crew",
    description:
      "Meer verantwoordelijkheid op locatie en complexere producties.",
  },
  {
    step: "04",
    title: "Teamcaptain",
    description:
      "Team aansturen, aanspreekpunt op locatie en kwaliteit bewaken.",
  },
  {
    step: "05",
    title: "Planning / coördinatie",
    description:
      "Ondersteuning bij planning, briefing en operationele coördinatie.",
  },
] as const;

export default function VacancyGrowthPath() {
  return (
    <section className="relative overflow-hidden bg-[#0B1F4D] py-16 text-white sm:py-24">
      <div
        className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#F28C28]/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Doorgroeien
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Groei door binnen Helping Hands
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75 sm:text-lg">
              Wie betrouwbaar is, goed communiceert en verantwoordelijkheid pakt,
              kan bij Helping Hands doorgroeien naar meer en betere klussen.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {growthPath.map((stage, index) => (
            <RevealOnScroll key={stage.step} delayMs={index * 60}>
              <article className="relative h-full rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:border-[#F28C28]/50 hover:bg-white/10">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                  Stap {stage.step}
                </span>
                <h3 className="mt-3 text-lg font-black">{stage.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  {stage.description}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
