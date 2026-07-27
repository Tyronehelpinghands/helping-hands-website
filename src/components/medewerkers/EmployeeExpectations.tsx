import RevealOnScroll from "@/components/RevealOnScroll";
import { employeeExpectations } from "@/lib/employeePage";

export default function EmployeeExpectations() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Afspraken
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Wat we van jou verwachten
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Je hoeft niet alles al te kunnen, maar je moet wel betrouwbaar zijn
              en willen leren.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {employeeExpectations.map((item, index) => (
            <RevealOnScroll key={item.title} delayMs={index * 30}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm transition hover:border-[#F28C28]/40">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]"
                  aria-hidden="true"
                />
                <p className="text-sm font-bold leading-6 text-[#0B1F4D]">
                  {item.title}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
