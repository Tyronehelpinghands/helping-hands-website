"use client";

import { useState } from "react";
import LogoImage from "@/components/LogoImage";
import {
  logoCategories,
  logoImagePath,
  logoIntro,
  logosByCategory,
  type LogoCategory,
} from "@/lib/logos";

export default function LogoShowcase() {
  const [activeCategory, setActiveCategory] =
    useState<LogoCategory>("opdrachtgevers");
  const items = logosByCategory(activeCategory);

  return (
    <div>
      <p className="max-w-3xl text-lg leading-8 text-[#101828]/75">{logoIntro}</p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {logoCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
              activeCategory === category.id
                ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-[#F5F7FA]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((logo) => (
          <LogoImage
            key={logo.slug}
            name={logo.name}
            src={logoImagePath(logo)}
            className="w-full min-w-0"
          />
        ))}
      </div>
    </div>
  );
}
