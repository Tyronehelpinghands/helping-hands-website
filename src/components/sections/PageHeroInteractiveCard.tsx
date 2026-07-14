"use client";

import type { PageHeroContent, PageHeroTheme } from "@/lib/pageHeroContent";
import { cn } from "@/lib/utils";

type Card = PageHeroContent["interactiveCards"][number];

const themeCardStyles: Record<PageHeroTheme, { active: string; idle: string }> = {
  staffing: {
    active: "border-[#F28C28]/60 bg-[#F28C28]/15 shadow-lg shadow-[#F28C28]/10",
    idle: "border-white/15 bg-white/5 hover:border-[#F28C28]/40 hover:bg-white/10",
  },
  vacatures: {
    active: "border-[#F28C28]/70 bg-[#F28C28]/20 shadow-lg shadow-[#F28C28]/15",
    idle: "border-[#38bdf8]/25 bg-white/5 hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/10",
  },
  projecten: {
    active: "border-[#38bdf8]/50 bg-[#38bdf8]/10 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-[#38bdf8]/35 hover:bg-white/10",
  },
  opdrachtgevers: {
    active: "border-white/40 bg-white/15 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10",
  },
  medewerkers: {
    active: "border-[#38bdf8]/50 bg-[#38bdf8]/15 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-[#38bdf8]/40 hover:bg-white/10",
  },
  diensten: {
    active: "border-[#F28C28]/50 bg-[#F28C28]/12 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-[#173A8A]/40 hover:bg-white/10",
  },
  contact: {
    active: "border-[#F28C28]/60 bg-[#F28C28]/15 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-[#F28C28]/35 hover:bg-white/10",
  },
  over: {
    active: "border-[#F28C28]/50 bg-white/10 shadow-lg",
    idle: "border-white/15 bg-white/5 hover:border-[#F28C28]/30 hover:bg-white/8",
  },
};

type PageHeroInteractiveCardProps = {
  card: Card;
  theme: PageHeroTheme;
  isActive: boolean;
  onSelect: () => void;
};

export default function PageHeroInteractiveCard({
  card,
  theme,
  isActive,
  onSelect,
}: PageHeroInteractiveCardProps) {
  const styles = themeCardStyles[theme];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "group w-full rounded-xl border p-3 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D] sm:p-4",
        isActive ? styles.active : styles.idle,
        !isActive && "hover:-translate-y-0.5",
      )}
    >
      {card.tag ? (
        <span className="mb-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#F28C28]">
          {card.tag}
        </span>
      ) : null}
      <p className="text-sm font-bold text-white sm:text-base">{card.title}</p>
      {card.hoverHint && isActive ? (
        <p className="mt-1 text-xs font-semibold text-[#F28C28]">{card.hoverHint}</p>
      ) : null}
    </button>
  );
}
