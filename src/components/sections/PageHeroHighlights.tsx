import type { PageHeroContent } from "@/lib/pageHeroContent";

type PageHeroHighlightsProps = {
  highlights: PageHeroContent["highlights"];
};

export default function PageHeroHighlights({ highlights }: PageHeroHighlightsProps) {
  if (highlights.length === 0) return null;

  const hasMetrics = highlights.some((item) => item.value || item.description);

  if (!hasMetrics) {
    return (
      <ul className="mt-6 flex list-none flex-wrap gap-2 sm:gap-2.5">
        {highlights.map((item) => (
          <li
            key={item.label}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold leading-snug text-white shadow-sm backdrop-blur-sm sm:px-4 sm:py-2.5"
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]"
            />
            <span className="min-w-0 text-pretty">{item.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
      {highlights.map((item) => (
        <div
          key={item.label}
          className="flex min-h-[4.5rem] min-w-0 flex-col justify-center rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-sm sm:px-4"
        >
          {item.value ? (
            <p className="text-lg font-black text-[#F28C28]">{item.value}</p>
          ) : (
            <span className="mb-1.5 block h-1 w-6 rounded-full bg-[#F28C28]" />
          )}
          <p className="text-pretty text-sm font-bold leading-snug text-white">
            {item.label}
          </p>
          {item.description ? (
            <p className="mt-1 text-xs leading-5 text-white/70">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
