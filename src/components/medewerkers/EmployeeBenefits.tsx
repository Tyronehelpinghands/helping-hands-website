import RevealOnScroll from "@/components/RevealOnScroll";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import { employeeBenefits } from "@/lib/employeePage";

export default function EmployeeBenefits() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Waarom Helping Hands
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Waarom werken via Helping Hands?
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Structuur, begeleiding en echte werkervaring — professioneel voor
              opdrachtgevers, eerlijk voor crew.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {employeeBenefits.map((benefit, index) => (
            <RevealOnScroll key={benefit.title} delayMs={index * 60}>
              <article className="group h-full rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 transition hover:border-[#F28C28]/45 hover:bg-white hover:shadow-lg hover:shadow-[#0B1F4D]/8">
                <ServiceIconBadge icon={benefit.icon} size="md" interactive />
                <h3 className="mt-5 text-lg font-black text-[#0B1F4D]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#101828]/70">
                  {benefit.description}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
