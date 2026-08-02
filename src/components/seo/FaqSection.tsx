import type { SeoFaq } from "@/lib/seo/types";

type SeoFaqSectionProps = {
  items: SeoFaq[];
  title?: string;
  description?: string;
};

/** Server-friendly FAQ accordion (native details/summary). */
export default function SeoFaqSection({
  items,
  title = "Veelgestelde vragen",
  description,
}: SeoFaqSectionProps) {
  return (
    <section className="bg-[#F5F7FA] py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-center text-base leading-7 text-[#101828]/70">
            {description}
          </p>
        ) : null}
        <div className="mt-8 space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-[#0B1F4D] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-[#F28C28] transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#101828]/75">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
