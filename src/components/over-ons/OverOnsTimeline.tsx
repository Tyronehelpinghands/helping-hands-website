import Reveal from "@/components/over-ons/Reveal";
import { overOnsTimeline } from "@/lib/overOnsContent";

export default function OverOnsTimeline() {
  return (
    <section className="bg-[#0B1F4D] py-14 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Ons pad
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Van oprichting tot professionele inzet op de vloer
          </h2>
        </Reveal>

        <ol className="relative mt-10 space-y-6 border-l border-white/20 pl-6 sm:mt-12 sm:space-y-8 sm:pl-8">
          {overOnsTimeline.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 50}>
              <li className="relative">
                <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full bg-[#F28C28] sm:-left-[2.4rem]" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                  {item.year}
                </p>
                <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                  {item.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
