"use client";

import Link from "next/link";
import { useState } from "react";
import PageHeroHighlights from "@/components/sections/PageHeroHighlights";
import PageHeroInteractiveCard from "@/components/sections/PageHeroInteractiveCard";
import type { PageHeroContent, PageHeroTheme } from "@/lib/pageHeroContent";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  content: PageHeroContent;
};

const themeShell: Record<
  PageHeroTheme,
  { section: string; eyebrow: string; glowA: string; glowB: string; panel: string }
> = {
  staffing: {
    section: "hero-gradient",
    eyebrow: "text-[#F28C28]",
    glowA: "bg-[#F28C28]/15",
    glowB: "bg-[#F28C28]/8",
    panel: "border-white/15 bg-white/5",
  },
  vacatures: {
    section: "hero-gradient",
    eyebrow: "text-[#38bdf8]",
    glowA: "bg-[#F28C28]/20",
    glowB: "bg-[#38bdf8]/15",
    panel: "border-[#38bdf8]/20 bg-white/10",
  },
  projecten: {
    section: "hero-gradient",
    eyebrow: "text-[#38bdf8]",
    glowA: "bg-[#38bdf8]/12",
    glowB: "bg-[#F28C28]/10",
    panel: "border-white/15 bg-[#0B1F4D]/30",
  },
  opdrachtgevers: {
    section: "hero-gradient",
    eyebrow: "text-white/80",
    glowA: "bg-white/8",
    glowB: "bg-[#173A8A]/30",
    panel: "border-white/20 bg-white/10",
  },
  medewerkers: {
    section: "hero-gradient",
    eyebrow: "text-[#38bdf8]",
    glowA: "bg-[#38bdf8]/15",
    glowB: "bg-[#F28C28]/10",
    panel: "border-[#38bdf8]/15 bg-white/5",
  },
  diensten: {
    section: "hero-gradient",
    eyebrow: "text-[#F28C28]",
    glowA: "bg-[#173A8A]/25",
    glowB: "bg-[#F28C28]/12",
    panel: "border-white/15 bg-white/5",
  },
  contact: {
    section: "hero-gradient",
    eyebrow: "text-[#F28C28]",
    glowA: "bg-[#F28C28]/18",
    glowB: "bg-white/10",
    panel: "border-[#F28C28]/20 bg-white/10",
  },
  over: {
    section: "hero-gradient",
    eyebrow: "text-[#F28C28]",
    glowA: "bg-[#F28C28]/12",
    glowB: "bg-white/5",
    panel: "border-white/12 bg-white/10",
  },
};

function HeroCta({ href, label, variant }: { href: string; label: string; variant: "primary" | "secondary" }) {
  const className = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D] sm:w-auto sm:text-base",
    variant === "primary"
      ? "bg-[#F28C28] text-white shadow-xl shadow-black/25 hover:bg-[#de7c1f]"
      : "border-2 border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-[#0B1F4D]",
  );

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function PageHero({ content }: PageHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = themeShell[content.theme];
  const activeCard = content.interactiveCards[activeIndex] ?? content.interactiveCards[0];

  return (
    <section className={cn("relative overflow-hidden text-white", theme.section)}>
      <div
        className={cn(
          "pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl",
          theme.glowA,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full blur-3xl",
          theme.glowB,
        )}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20 xl:py-24">
        <div className="min-w-0">
          <p className={cn("text-sm font-bold uppercase tracking-[0.2em]", theme.eyebrow)}>
            {content.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            {content.description}
          </p>

          {(content.primaryCta || content.secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {content.primaryCta ? (
                <HeroCta href={content.primaryCta.href} label={content.primaryCta.label} variant="primary" />
              ) : null}
              {content.secondaryCta ? (
                <HeroCta
                  href={content.secondaryCta.href}
                  label={content.secondaryCta.label}
                  variant="secondary"
                />
              ) : null}
            </div>
          )}

          <PageHeroHighlights highlights={content.highlights} />
        </div>

        <div className="min-w-0">
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl border p-5 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-8",
              theme.panel,
            )}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/55">
              {content.theme === "opdrachtgevers"
                ? "Zo werkt samenwerken"
                : content.theme === "vacatures"
                  ? "Kies je richting"
                  : content.theme === "projecten"
                    ? "Sectoren & locaties"
                    : content.theme === "contact"
                      ? "Waar kunnen we mee helpen?"
                      : "Meer informatie"}
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
              {content.interactiveCards.map((card, index) => (
                <PageHeroInteractiveCard
                  key={card.title}
                  card={card}
                  theme={content.theme}
                  isActive={activeIndex === index}
                  onSelect={() => setActiveIndex(index)}
                />
              ))}
            </div>

            {activeCard ? (
              <div
                className="mt-4 rounded-xl border border-white/10 bg-black/15 px-4 py-3 transition-all duration-300"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm font-bold text-white">{activeCard.title}</p>
                <p className="mt-1 text-sm leading-6 text-white/75">{activeCard.description}</p>
                {activeCard.hoverHint ? (
                  <p className="mt-2 text-xs font-semibold text-[#F28C28]">{activeCard.hoverHint}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
