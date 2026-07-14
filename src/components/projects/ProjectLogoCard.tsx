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

type ProjectLogoCardProps = {
  logo: ProjectLogo;
  interactive?: boolean;
  compact?: boolean;
};

export default function ProjectLogoCard({
  logo,
  interactive = true,
  compact = false,
}: ProjectLogoCardProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getProjectLogoInitials(logo.name);

  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition",
        interactive && "hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-lg",
        compact ? "p-3" : "p-4 sm:p-5",
      )}
    >
      <span
        className={cn(
          "inline-flex w-fit rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide",
          categoryStyles[logo.category],
        )}
      >
        {logo.category}
      </span>

      <div
        className={cn(
          "mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#F5F7FA]/50",
          compact ? "h-16 px-3" : "h-24 px-4 sm:h-28",
        )}
      >
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo.logoPath}
            alt={logo.name}
            className={cn(
              "max-h-14 w-auto max-w-full object-contain transition duration-300",
              interactive && "grayscale group-hover:grayscale-0",
              compact && "max-h-10",
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-1 px-2"
            role="img"
            aria-label={`${logo.name} logo placeholder`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173A8A]/10 text-xs font-black text-[#173A8A]">
              {initials}
            </span>
            {!compact ? (
              <span className="text-center text-[0.65rem] font-semibold text-[#101828]/55">
                Logo volgt
              </span>
            ) : null}
          </div>
        )}
      </div>

      {!compact ? (
        <>
          <p className="mt-3 text-center text-sm font-bold text-[#0B1F4D]">{logo.name}</p>
          {logo.tags && logo.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {logo.tags.slice(0, 2).map((tag) => (
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
