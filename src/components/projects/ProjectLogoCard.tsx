"use client";

import { useState } from "react";
import type { ProjectLogo } from "@/lib/projectLogos";
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
  const alt = logo.altText ?? `${logo.name} logo`;

  if (imageError) {
    return null;
  }

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
          "mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-3",
          isCarousel && "h-32 min-h-32 sm:h-36 sm:p-4 lg:h-40",
          isCompact && "h-20 min-h-20 p-2",
          resolvedVariant === "default" && "h-28 min-h-28 sm:h-32 sm:p-4",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.logoPath}
          alt={alt}
          className={cn(
            "w-auto max-w-full object-contain transition duration-300",
            isCarousel && "max-h-20 sm:max-h-24 lg:max-h-28",
            isCompact && "max-h-14",
            resolvedVariant === "default" && "max-h-20 sm:max-h-24",
            interactive &&
              "grayscale-[0.35] group-hover:grayscale-0 group-hover:scale-105",
          )}
          onError={() => setImageError(true)}
        />
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
