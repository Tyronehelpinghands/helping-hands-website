import { Award, Eye, FileCheck, HardHat, Phone, UserCheck, type LucideIcon } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import StaggerReveal from "@/components/StaggerReveal";
import { zekerheidCards, type ZekerheidCardKey } from "@/lib/opdrachtgeversContent";

const iconByKey: Record<ZekerheidCardKey, LucideIcon> = {
  opdrachtbevestiging: FileCheck,
  gecontroleerd: UserCheck,
  accreditatie: Award,
  pbm: HardHat,
  controle: Eye,
  bereikbaar: Phone,
};

export default function ZekerheidGrid() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Zekerheid
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Zekerheid tijdens iedere inzet
            </h2>
            <p className="mt-4 text-base leading-7 text-[#101828]/70">
              Praktische afspraken en controles die ervoor zorgen dat je weet
              wat je krijgt — van bevestiging tot uitvoering op locatie.
            </p>
          </div>
        </RevealOnScroll>

        <StaggerReveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stepMs={70}>
          {zekerheidCards.map((card) => {
            const Icon = iconByKey[card.key];
            return (
              <article
                key={card.key}
                className="group h-full rounded-2xl border border-slate-200/70 bg-[#F5F7FA]/80 p-6 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md hover:shadow-[#0B1F4D]/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#173A8A]/15 bg-gradient-to-br from-[#173A8A]/10 via-white to-[#F5F7FA] text-[#173A8A] transition group-hover:border-[#F28C28]/40 group-hover:text-[#F28C28]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black text-[#0B1F4D]">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#101828]/75">{card.text}</p>
              </article>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
