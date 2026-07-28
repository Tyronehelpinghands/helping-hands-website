import StaggerReveal from "@/components/StaggerReveal";
import { opdrachtgeversTrustPoints } from "@/lib/opdrachtgeversContent";

export default function TrustPoints() {
  return (
    <section className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <StaggerReveal
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          stepMs={80}
        >
          {opdrachtgeversTrustPoints.map((point) => (
            <div
              key={point.title}
              className="flex min-h-[8.5rem] flex-col rounded-2xl border border-slate-200/80 bg-[#F5F7FA] px-4 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md sm:px-5"
            >
              <p className="text-base font-black leading-snug tracking-tight text-[#0B1F4D]">
                {point.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                {point.text}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
