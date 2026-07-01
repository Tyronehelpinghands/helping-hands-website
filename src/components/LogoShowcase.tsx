"use client";

import { useMemo, useState } from "react";
import LogoImage from "@/components/LogoImage";
import {
  logoDisclaimer,
  logoImagePath,
  logoSectionIntro,
  showcaseFilters,
  logosByFilter,
  type ShowcaseFilter,
} from "@/lib/logos";

export default function LogoShowcase() {
  const [activeFilter, setActiveFilter] = useState<ShowcaseFilter>("alle");

  const items = useMemo(
    () => logosByFilter(activeFilter),
    [activeFilter],
  );

  return (
    <div>
      <p className="max-w-3xl text-lg leading-8 text-[#101828]/75">
        {logoSectionIntro}
      </p>
      <p className="mt-4 max-w-3xl text-xs leading-6 text-[#101828]/55">
        {logoDisclaimer}
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {showcaseFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
            className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
              activeFilter === filter.id
                ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-[#F5F7FA]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-[#173A8A]">
        {items.length} {items.length === 1 ? "resultaat" : "resultaten"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((logo) => (
          <article
            key={`${logo.folder}-${logo.slug}`}
            className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#F28C28]/40 hover:shadow-xl"
          >
            <span className="inline-block rounded-full bg-[#F5F7FA] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-[#173A8A]">
              {logo.category}
            </span>
            <div className="mt-3">
              <LogoImage
                name={logo.name}
                src={logoImagePath(logo)}
                interactive
                size="grid"
              />
            </div>
            <p className="mt-3 text-center text-sm font-bold text-[#0B1F4D]">
              {logo.name}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
