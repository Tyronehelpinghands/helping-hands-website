import type { PageHeroContent } from "@/lib/pageHeroContent";

type PageHeroHighlightsProps = {
  highlights: PageHeroContent["highlights"];
};

export default function PageHeroHighlights({ highlights }: PageHeroHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {highlights.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm"
        >
          {item.value ? (
            <p className="text-lg font-black text-[#F28C28]">{item.value}</p>
          ) : (
            <span className="mb-1.5 block h-1 w-6 rounded-full bg-[#F28C28]" />
          )}
          <p className="text-xs font-bold leading-snug text-white/90 sm:text-sm">
            {item.label}
          </p>
          {item.description ? (
            <p className="mt-0.5 text-[0.65rem] text-white/55">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
