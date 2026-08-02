"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PageHeroHighlights from "@/components/sections/PageHeroHighlights";
import PageHeroInteractiveCard from "@/components/sections/PageHeroInteractiveCard";
import { homeHeroCollage } from "@/lib/crewPhotos";
import {
  contactPhoneDisplay,
  contactPhoneTel,
} from "@/lib/navigation";
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

function HeroCta({
  href,
  label,
  variant,
  pulse,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
  pulse?: boolean;
}) {
  const className = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D] sm:w-auto sm:text-base",
    variant === "primary"
      ? "bg-[#F28C28] text-white shadow-xl shadow-black/25 hover:bg-[#de7c1f]"
      : "border-2 border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-[#0B1F4D]",
    pulse && variant === "primary" && "home-cta-pulse",
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

function StaffingHeroMedia({
  cards,
  theme,
  activeIndex,
  onSelect,
}: {
  cards: PageHeroContent["interactiveCards"];
  theme: PageHeroTheme;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const activeCard = cards[activeIndex] ?? cards[0];
  const collage = homeHeroCollage.slice(0, 5);

  return (
    <div className="min-w-0 space-y-4">
      {/* Mobile: 3 tiles only; sm+: full collage for denser first viewport */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 lg:grid-rows-2 lg:gap-3">
        {collage.map((photo, index) => {
          const isHero = index === 0;
          return (
            <div
              key={photo.src}
              className={cn(
                "home-hero-tile relative overflow-hidden rounded-2xl bg-white/10",
                isHero
                  ? "col-span-2 aspect-[16/10] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[22rem]"
                  : "aspect-[4/5] lg:aspect-auto lg:min-h-[10.5rem]",
                index >= 3 && "hidden sm:block",
              )}
              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={isHero}
                loading={isHero ? "eager" : "lazy"}
                sizes={
                  isHero
                    ? "(max-width: 1024px) 100vw, 40vw"
                    : "(max-width: 1024px) 50vw, 15vw"
                }
                className={cn(
                  "object-cover transition duration-500 motion-reduce:transition-none motion-reduce:hover:scale-100",
                  photo.objectPosition === "50% 0%"
                    ? "origin-top hover:scale-[1.02]"
                    : "hover:scale-[1.03]",
                )}
                style={{ objectPosition: photo.objectPosition ?? "50% 20%" }}
              />
            </div>
          );
        })}
      </div>

      {/* Interactive cards: desktop/tablet only — reduces mobile hero density */}
      <div
        className={cn(
          "relative hidden overflow-hidden rounded-2xl border p-3 shadow-xl backdrop-blur-sm sm:p-4 md:block",
          themeShell[theme].panel,
        )}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {cards.map((card, index) => (
            <PageHeroInteractiveCard
              key={card.title}
              card={card}
              theme={theme}
              isActive={activeIndex === index}
              onSelect={() => onSelect(index)}
            />
          ))}
        </div>
        {activeCard ? (
          <div
            className="mt-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2.5"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-bold text-white">{activeCard.title}</p>
            <p className="mt-0.5 text-sm leading-6 text-white/75">
              {activeCard.description}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Contact hero: topic tabs stacked above a separate detail panel (no overlap). */
function ContactTopicTabs({
  cards,
  activeIndex,
  onSelect,
}: {
  cards: PageHeroContent["interactiveCards"];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const activeCard = cards[activeIndex] ?? cards[0];

  return (
    <div className="min-w-0">
      <div
        className={cn(
          "rounded-2xl border p-5 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-8",
          themeShell.contact.panel,
        )}
      >
        <div className="flex flex-col gap-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
            Waar kunnen we mee helpen?
          </p>

          {/* Always 2×2 — never force 4 long Dutch labels into one nowrap row. */}
          <div
            role="tablist"
            aria-label="Contactonderwerpen"
            className="grid grid-cols-2 gap-2 rounded-2xl bg-black/25 p-1.5"
          >
            {cards.map((card, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={card.title}
                  type="button"
                  role="tab"
                  id={`contact-topic-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls="contact-topic-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "flex min-h-11 min-w-0 items-center justify-center rounded-xl px-2.5 py-3 text-center text-sm font-bold leading-snug transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D]",
                    isActive
                      ? "bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className="max-w-full break-words hyphens-auto [overflow-wrap:anywhere]">
                    {card.title}
                  </span>
                </button>
              );
            })}
          </div>

          {activeCard ? (
            <div
              id="contact-topic-panel"
              role="tabpanel"
              aria-labelledby={`contact-topic-tab-${activeIndex}`}
              className="rounded-xl border border-white/10 bg-black/15 px-4 py-3.5"
            >
              <p className="text-sm leading-6 text-white/80">{activeCard.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function PageHero({ content }: PageHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = themeShell[content.theme];
  const activeCard = content.interactiveCards[activeIndex] ?? content.interactiveCards[0];
  const showStaffingMedia = content.theme === "staffing";

  const mobileServiceChips = [
    { label: "Event crew", href: "/personeel-inhuren/event-crew" },
    { label: "Stagehands", href: "/diensten/stagehands" },
    { label: "Horeca", href: "/diensten/horeca-personeel" },
    { label: "Productie", href: "/diensten/productie-assistentie" },
  ] as const;

  return (
    <section className={cn("relative overflow-hidden text-white", theme.section)}>
      {showStaffingMedia ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src="/images/crew/festival-build-site.webp"
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            className="home-hero-atmosphere-img object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F4D]/75 via-[#0B1F4D]/55 to-[#0B1F4D]/85" />
        </div>
      ) : null}
      <div
        className={cn(
          "pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl",
          theme.glowA,
          showStaffingMedia && "home-hero-glow",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full blur-3xl",
          theme.glowB,
          showStaffingMedia && "home-hero-glow",
        )}
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-36 xl:pb-24">
        <div className={cn("min-w-0", showStaffingMedia && "home-hero-copy")}>
          <p
            className={cn(
              "text-sm font-bold uppercase tracking-[0.2em]",
              theme.eyebrow,
              showStaffingMedia && "home-hero-item",
            )}
          >
            {content.eyebrow}
          </p>
          <h1
            className={cn(
              "mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl",
              showStaffingMedia && "home-hero-item",
            )}
          >
            {content.title}
          </h1>
          <p
            className={cn(
              "mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg",
              showStaffingMedia && "home-hero-item",
            )}
          >
            {content.description}
          </p>

          {(content.primaryCta || content.secondaryCta) && (
            <div
              className={cn(
                "mt-8 flex flex-col gap-3 sm:flex-row",
                showStaffingMedia && "home-hero-item",
              )}
            >
              {content.primaryCta ? (
                <HeroCta
                  href={content.primaryCta.href}
                  label={content.primaryCta.label}
                  variant="primary"
                  pulse={showStaffingMedia}
                />
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

          <div className={cn(showStaffingMedia && "home-hero-item")}>
            <PageHeroHighlights highlights={content.highlights} />
          </div>

          {showStaffingMedia ? (
            <>
              <p className="home-hero-item mt-5 text-sm leading-6 text-white/70">
                Hilversum · landelijk inzetbaar ·{" "}
                <a
                  href={`tel:${contactPhoneTel}`}
                  className="font-semibold text-white underline-offset-4 transition hover:text-[#F28C28] hover:underline"
                >
                  Bel {contactPhoneDisplay}
                </a>
              </p>
              <div className="home-hero-item -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden">
                {mobileServiceChips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition hover:border-[#F28C28]/60 hover:bg-[#F28C28]"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {showStaffingMedia ? (
          <StaffingHeroMedia
            cards={content.interactiveCards}
            theme={content.theme}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        ) : content.theme === "contact" ? (
          <ContactTopicTabs
            cards={content.interactiveCards}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        ) : (
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
        )}
      </div>
    </section>
  );
}
