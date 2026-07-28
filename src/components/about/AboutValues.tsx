import { ClipboardCheck, HeartHandshake, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";

type Value = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const values: Value[] = [
  {
    title: "Kansen geven",
    description:
      "We kijken naar wat iemand kan worden, niet alleen naar wat er op een cv staat. Iedereen verdient een eerlijke kans om te laten zien wat hij of zij kan.",
    icon: HeartHandshake,
  },
  {
    title: "Structuur bieden",
    description:
      "Duidelijke afspraken, heldere verwachtingen en een vast aanspreekpunt — op locatie en daarbuiten.",
    icon: ClipboardCheck,
  },
  {
    title: "Professioneel leveren",
    description:
      "Opdrachtgevers krijgen crew die op tijd is, veilig werkt, goed communiceert en zich professioneel gedraagt.",
    icon: ShieldCheck,
  },
  {
    title: "Groei mogelijk maken",
    description:
      "Wie laat zien dat hij of zij betrouwbaar is, krijgt de kans om door te groeien naar meer verantwoordelijkheid.",
    icon: TrendingUp,
  },
];

export default function AboutValues() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Onze kernwaarden
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Waar Helping Hands voor staat
            </h2>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stepMs={70}>
          {values.map((value) => (
            <article
              key={value.title}
              className="group h-full rounded-2xl border border-slate-200/70 bg-[#F5F7FA]/80 p-6 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md hover:shadow-[#0B1F4D]/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#173A8A]/15 bg-gradient-to-br from-[#173A8A]/10 via-white to-[#F5F7FA] text-[#173A8A] transition group-hover:border-[#F28C28]/40 group-hover:text-[#F28C28]">
                <value.icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-black text-[#0B1F4D]">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#101828]/75">{value.description}</p>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
