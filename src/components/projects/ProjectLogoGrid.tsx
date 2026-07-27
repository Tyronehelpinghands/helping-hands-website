"use client";

import { useMemo, useState } from "react";
import ProjectCategoryTabs from "@/components/projects/ProjectCategoryTabs";
import ProjectExperienceDrawer from "@/components/projects/ProjectExperienceDrawer";
import ProjectLogoCard from "@/components/projects/ProjectLogoCard";
import ProjectSearch from "@/components/projects/ProjectSearch";
import {
  searchProjectLogos,
  type ProjectLogoFilter,
} from "@/lib/projectCategories";
import {
  filterProjectLogos,
  projectExperienceDisclaimer,
  projectLogos,
  type ProjectLogo,
} from "@/lib/projectLogos";

export default function ProjectLogoGrid() {
  const [activeFilter, setActiveFilter] = useState<ProjectLogoFilter>("Alle");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ProjectLogo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const byCategory = filterProjectLogos(activeFilter);
    return searchProjectLogos(byCategory, query);
  }, [activeFilter, query]);

  const counts = useMemo(
    () => ({
      Alle: projectLogos.length,
      Opdrachtgevers: projectLogos.filter((l) => l.category === "Opdrachtgevers")
        .length,
      "Projecten & festivals": projectLogos.filter(
        (l) => l.category === "Projecten & festivals",
      ).length,
      Locaties: projectLogos.filter((l) => l.category === "Locaties").length,
    }),
    [],
  );

  const openLogo = (logo: ProjectLogo) => {
    setSelected(logo);
    setDrawerOpen(true);
  };

  return (
    <section
      id="projectoverzicht"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Overzicht van projectervaring
        </h2>
        <p className="mt-4 text-base leading-8 text-[#101828]/75">
          Filter op opdrachtgevers, projecten & festivals of locaties. Logo&apos;s
          tonen sectoren en producties waar crewervaring is opgedaan — via
          opdrachten, partners en producties.
        </p>
        <p className="mt-3 text-xs leading-6 text-[#101828]/55">
          {projectExperienceDisclaimer}
        </p>
      </div>

      <div className="sticky top-16 z-20 -mx-4 mt-8 space-y-4 border-b border-slate-200/80 bg-[#F5F7FA]/95 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <ProjectCategoryTabs
          active={activeFilter}
          onChange={setActiveFilter}
          counts={counts}
        />
        <ProjectSearch value={query} onChange={setQuery} />
      </div>

      <p className="mt-5 text-sm font-semibold text-[#173A8A]" aria-live="polite">
        {filtered.length}{" "}
        {filtered.length === 1 ? "resultaat gevonden" : "resultaten gevonden"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-base font-semibold text-[#0B1F4D]">
            Geen resultaten gevonden.
          </p>
          <p className="mt-2 text-sm text-[#101828]/65">
            Probeer een andere filter of bekijk alle projectervaring.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("Alle");
              setQuery("");
            }}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-5 text-sm font-bold text-white transition hover:bg-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
          >
            Toon alles
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((logo) => (
            <ProjectLogoCard
              key={logo.id}
              logo={logo}
              onSelect={openLogo}
            />
          ))}
        </div>
      )}

      <ProjectExperienceDrawer
        logo={selected}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  );
}
