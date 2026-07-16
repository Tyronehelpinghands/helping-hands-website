"use client";

import { useState } from "react";
import {
  getProjectLogoInitials,
  type ProjectLogo,
} from "@/lib/projectLogos";
import { cn } from "@/lib/utils";

const categoryStyles: Record<ProjectLogo["category"], string> = {
  Opdrachtgevers: "bg-[#173A8A]/10 text-[#173A8A]",
  "Projecten & festivals": "bg-[#F28C28]/10 text-[#c46a12]",
  Locaties: "bg-[#38bdf8]/10 text-[#0284c7]",
};

type ProjectLogoCardVariant = "default" | "compact" | "carousel";

type ProjectLogoCardProps = {
  logo: ProjectLogo;
  interactive?: boolean;
  compact?: boolean;
  variant?: ProjectLogoCardVariant;
};

function logoAreaBackground(logo: ProjectLogo): string {
  if (logo.wordmark) return "bg-transparent border-transparent p-0";
  if (logo.logoTone === "dark") return "bg-[#0B1F4D]";
  if (logo.logoTone === "brand") return "bg-transparent";
  if (logo.category === "Opdrachtgevers") return "bg-white";
  return "bg-[#F5F7FA]/50";
}

function LogoWordmark({
  logo,
  isCarousel,
  isCompact,
}: {
  logo: ProjectLogo;
  isCarousel: boolean;
  isCompact: boolean;
}) {
  const mark = logo.wordmark!;
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center rounded-xl px-3 text-center",
        isCompact ? "gap-0" : "gap-1.5",
      )}
      style={{ backgroundColor: mark.background, color: mark.color }}
      role="img"
      aria-label={logo.altText ?? `${logo.name} logo`}
    >
      <span
        className={cn(
          "font-black leading-none tracking-tight",
          isCarousel && "text-2xl sm:text-3xl",
          isCompact && "text-sm sm:text-base",
          !isCarousel && !isCompact && "text-xl sm:text-2xl lg:text-3xl",
        )}
      >
        {logo.name}
      </span>
      {mark.accent && !isCompact ? (
        <span
          className="mt-1 h-1 w-12 rounded-full sm:w-16"
          style={{ backgroundColor: mark.accent }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

export default function ProjectLogoCard({
  logo,
  interactive = true,
  compact = false,
  variant,
}: ProjectLogoCardProps) {
  const resolvedVariant: ProjectLogoCardVariant =
    variant ?? (compact ? "compact" : "default");
  const isCarousel = resolvedVariant === "carousel";
  const isCompact = resolvedVariant === "compact";
  const showFooter = resolvedVariant === "default";

  const [imageError, setImageError] = useState(false);
  const initials = getProjectLogoInitials(logo.name);
  const alt = logo.altText ?? `${logo.name} logo`;
  const isOpdrachtgever = logo.category === "Opdrachtgevers";
  const tone = logo.logoTone ?? "light";
  const useWordmark = Boolean(logo.wordmark);

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300",
        interactive &&
          "hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-lg hover:shadow-[#173A8A]/5",
        isCarousel && "p-5 sm:p-6",
        isCompact && "p-3",
        resolvedVariant === "default" && "p-4 sm:p-5",
      )}
    >
      <span
        className={cn(
          "inline-flex w-fit rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide",
          categoryStyles[logo.category],
          isCarousel && "text-[0.6rem]",
        )}
      >
        {logo.category}
      </span>

      <div
        className={cn(
          "mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-100",
          logoAreaBackground(logo),
          tone === "dark" && !useWordmark && "border-transparent",
          isCarousel && "h-32 min-h-32 p-3 sm:h-36 sm:p-4 lg:h-40",
          isCompact && "h-20 min-h-20 p-2",
          resolvedVariant === "default" && "h-28 min-h-28 p-3 sm:h-32 sm:p-4",
          useWordmark && "border-0 p-0",
        )}
      >
        {useWordmark ? (
          <LogoWordmark logo={logo} isCarousel={isCarousel} isCompact={isCompact} />
        ) : !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.logoPath}
            alt={alt}
            className={cn(
              "w-auto max-w-full object-contain transition duration-300",
              isCarousel && "max-h-20 sm:max-h-24 lg:max-h-28",
              isCompact && "max-h-14",
              resolvedVariant === "default" && "max-h-20 sm:max-h-24",
              interactive &&
                !isOpdrachtgever &&
                "grayscale group-hover:grayscale-0 group-hover:scale-105",
              interactive &&
                isOpdrachtgever &&
                "opacity-95 group-hover:opacity-100 group-hover:scale-105",
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center"
            role="img"
            aria-label={alt}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full font-black",
                tone === "dark"
                  ? "bg-white/15 text-white"
                  : "bg-[#173A8A]/10 text-[#173A8A]",
                isCarousel ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs",
              )}
            >
              {initials}
            </span>
            <span
              className={cn(
                "font-bold leading-tight",
                tone === "dark" ? "text-white" : "text-[#0B1F4D]",
                isCarousel ? "text-sm" : "text-xs",
              )}
            >
              {logo.name}
            </span>
          </div>
        )}
      </div>

      {showFooter ? (
        <>
          <p className="mt-3 text-center text-sm font-bold text-[#0B1F4D]">{logo.name}</p>
          {logo.tags && logo.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {logo.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
