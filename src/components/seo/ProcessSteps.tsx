import type { SeoProcessStep } from "@/lib/seo/types";

type ProcessStepsProps = {
  title?: string;
  steps: SeoProcessStep[];
};

export default function ProcessSteps({
  title = "Zo werkt personeel aanvragen",
  steps,
}: ProcessStepsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">{title}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              Stap {index + 1}
            </p>
            <h3 className="mt-2 text-base font-bold text-[#0B1F4D]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#101828]/75">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
