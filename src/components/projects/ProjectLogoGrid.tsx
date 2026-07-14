"use client";

import { useMemo, useState } from "react";
import ProjectCategoryTabs from "@/components/projects/ProjectCategoryTabs";
import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import {
  filterProjectLogos,
  projectExperienceDisclaimer,
  projectLogos,
  type ProjectLogoFilter,
} from "@/lib/projectLogos";

export default function ProjectLogoGrid() {
  const [activeFilter, setActiveFilter] = useState<ProjectLogoFilter>("Alle");

  const filtered = useMemo(
    () => filterProjectLogos(activeFilter),
    [activeFilter],
  );

  const counts = useMemo(
    () => ({
      Alle: projectLogos.length,
      Opdrachtgevers: projectLogos.filter((l) => l.category === "Opdrachtgevers").length,
      "Projecten & festivals": projectLogos.filter(
        (l) => l.category === "Projecten & festivals",
      ).length,
      Locaties: projectLogos.filter((l) => l.category === "Locaties").length,
    }),
    [],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Overzicht van projectervaring
        </h2>
        <p className="mt-4 text-base leading-8 text-[#101828]/75">
          Filter op opdrachtgevers, projecten & festivals of locaties. Logo&apos;s tonen
          sectoren en producties waar crewervaring is opgedaan.
        </p>
        <p className="mt-3 text-xs leading-6 text-[#101828]/55">
          {projectExperienceDisclaimer}
        </p>
      </div>

      <div className="mt-8">
        <ProjectCategoryTabs
          active={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
      </div>

      <p className="mt-4 text-sm font-semibold text-[#173A8A]">
        {filtered.length} {filtered.length === 1 ? "resultaat" : "resultaten"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filtered.map((logo) => (
          <ProjectLogoCard key={logo.id} logo={logo} />
        ))}
      </div>
    </section>
  );
}
