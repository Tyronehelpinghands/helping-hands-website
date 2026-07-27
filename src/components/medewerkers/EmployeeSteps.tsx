import RevealOnScroll from "@/components/RevealOnScroll";
import { employeeSteps } from "@/lib/employeePage";

export default function EmployeeSteps() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Aanmelden
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Zo werkt aanmelden
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Duidelijk proces: van crew aanmelden tot eerste klus en doorgroeien.
            </p>
          </div>
        </RevealOnScroll>

        <ol className="relative mx-auto mt-12 max-w-4xl space-y-4">
          <div
            className="pointer-events-none absolute left-[1.65rem] top-4 bottom-4 hidden w-px bg-gradient-to-b from-[#F28C28] via-[#173A8A]/40 to-[#173A8A]/10 sm:block"
            aria-hidden="true"
          />
          {employeeSteps.map((step, index) => (
            <RevealOnScroll key={step.step} delayMs={index * 50}>
              <li className="relative flex gap-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-5 transition hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md sm:gap-6 sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1F4D] text-sm font-black text-white shadow-md">
                  {step.step}
                </span>
                <div>
                  <h3 className="text-lg font-black text-[#0B1F4D]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#101828]/70">
                    {step.description}
                  </p>
                </div>
              </li>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}
