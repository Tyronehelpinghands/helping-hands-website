import Reveal from "@/components/over-ons/Reveal";
import { overOnsStats } from "@/lib/overOnsContent";

export default function OverOnsStats() {
  return (
    <section className="border-y border-[#173A8A]/10 bg-[#F5F7FA] py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {overOnsStats.map((stat, index) => (
          <Reveal key={stat.label} delayMs={index * 60}>
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                {stat.label}
              </p>
              <p className="mt-2 text-xl font-black text-[#0B1F4D] sm:text-2xl">
                {stat.value}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
