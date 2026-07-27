"use client";

import { useState } from "react";
import type { ProjectLogo } from "@/lib/projectLogos";
import { getCategoryContext } from "@/lib/projectCategories";
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
  onSelect?: (logo: ProjectLogo) => void;
};

export default function ProjectLogoCard({
  logo,
  interactive = true,
  compact = false,
  variant,
  onSelect,
}: ProjectLogoCardProps) {
  const resolvedVariant: ProjectLogoCardVariant =
    variant ?? (compact ? "compact" : "default");
  const isCarousel = resolvedVariant === "carousel";
  const isCompact = resolvedVariant === "compact";
  const showFooter = resolvedVariant === "default";
  const clickable = Boolean(onSelect) && interactive;

  const [imageError, setImageError] = useState(false);
  const alt = logo.altText ?? `${logo.name} logo`;

  if (imageError) {
    return null;
  }

  const content = (
    <>
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
          "mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-3",
          isCarousel && "h-28 min-h-28 sm:h-32 sm:p-6 lg:h-36",
          isCompact && "h-20 min-h-20 p-2",
          resolvedVariant === "default" && "h-36 min-h-36 sm:h-40 sm:p-6",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.logoPath}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-auto w-auto max-h-full max-w-full object-contain transition duration-300",
            isCarousel && "max-h-12 sm:max-h-16 lg:max-h-20",
            isCompact && "max-h-14",
            resolvedVariant === "default" && "max-h-24 sm:max-h-28",
            interactive &&
              "opacity-90 grayscale-[0.15] group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0",
          )}
          onError={() => setImageError(true)}
        />
      </div>

      {showFooter ? (
        <>
          <p className="mt-4 text-center text-sm font-bold text-[#0B1F4D] sm:text-base">
            {logo.name}
          </p>
          <p className="mt-1.5 text-center text-xs leading-5 text-[#101828]/60">
            {getCategoryContext(logo.category)}
          </p>
          {logo.tags && logo.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {logo.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.65rem] font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          {clickable ? (
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-[#173A8A]/20 bg-[#173A8A]/5 px-4 text-xs font-bold text-[#173A8A] transition group-hover:border-[#F28C28]/40 group-hover:bg-[#F28C28]/10 group-hover:text-[#c46a12]">
              Bekijk inzetgebied
            </span>
          ) : null}
        </>
      ) : null}
    </>
  );

  const shellClass = cn(
    "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-[#F5F7FA]/80 shadow-sm transition duration-300",
    interactive &&
      "hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-lg hover:shadow-[#173A8A]/5",
    isCarousel && "p-5 sm:p-6 lg:p-8",
    isCompact && "p-3",
    resolvedVariant === "default" && "p-4 sm:p-5",
    clickable &&
      "w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
  );

  if (clickable) {
    return (
      <button
        type="button"
        className={shellClass}
        onClick={() => onSelect?.(logo)}
        aria-label={`${logo.name} — bekijk inzetgebied`}
      >
        {content}
      </button>
    );
  }

  return <article className={shellClass}>{content}</article>;
}
