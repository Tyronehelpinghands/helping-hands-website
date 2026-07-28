import { Compass, MessageSquare, Route, UserCheck, type LucideIcon } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";

type Difference = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const differences: Difference[] = [
  {
    title: "Persoonlijke intake",
    description:
      "We kijken verder dan een cv: motivatie, situatie en potentieel bepalen mee waar iemand het beste past.",
    icon: UserCheck,
  },
  {
    title: "Begeleiding op locatie",
    description:
      "Teamleiders sturen crew aan, bewaken kwaliteit en lossen problemen snel op — zonder onnodige belasting voor de opdrachtgever.",
    icon: Compass,
  },
  {
    title: "Korte lijnen",
    description:
      "Eén vast aanspreekpunt voor planning, briefing en opvolging — voor opdrachtgevers én crew.",
    icon: MessageSquare,
  },
  {
    title: "Groeigerichte aanpak",
    description:
      "Wie laat zien dat hij of zij betrouwbaar is, krijgt de kans om door te groeien naar meer verantwoordelijkheid en nieuwe functies.",
    icon: Route,
  },
];

export default function AboutDifference() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Wat ons anders maakt
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Maatschappelijke missie, professionele uitvoering
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="mt-10 grid gap-4 sm:grid-cols-2" stepMs={70}>
          {differences.map((item) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B1F4D] text-[#F28C28]">
                <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-black text-[#0B1F4D]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#101828]/75">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
