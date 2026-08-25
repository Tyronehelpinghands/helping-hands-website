"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import VacancyCard from "@/components/vacatures/VacancyCard";
import VacancyDetailDrawer from "@/components/vacatures/VacancyDetailDrawer";
import VacancyFilters from "@/components/vacatures/VacancyFilters";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  defaultVacancyFilterState,
  filterVacancies,
  type VacancyFilterState,
} from "@/lib/vacancyFilters";
import { openApplyHref, vacancies, type Vacancy } from "@/lib/vacancies";

const RESULTS_ID = "vacancy-results";

export default function VacancyExplorer() {
  const [filters, setFilters] = useState<VacancyFilterState>(
    defaultVacancyFilterState,
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Vacancy | null>(null);

  const visible = useMemo(
    () => filterVacancies(vacancies, filters),
    [filters],
  );

  return (
    <section
      id="vacatures"
      className="scroll-mt-24 max-w-[100vw] overflow-x-clip bg-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Open functies
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Vacatures event crew, horeca en stagebouw
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Zoek op eventmedewerker vacature, stagehand vacature, horeca
              vacature, keukenhulp of barback — of filter op categorie en niveau.
              Flexibel werk op events, festivals en in de horeca.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 max-w-full">
          <VacancyFilters
            state={filters}
            onChange={setFilters}
            resultCount={visible.length}
            mobileOpen={mobileFiltersOpen}
            onMobileOpenChange={setMobileFiltersOpen}
            resultsId={RESULTS_ID}
          />
        </div>

        <div id={RESULTS_ID} role="tabpanel" className="mt-8">
          {visible.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onView={() => setSelected(vacancy)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F5F7FA] p-8 text-center">
              <p className="text-base font-bold text-[#0B1F4D]">
                Geen vacatures gevonden binnen deze categorie.
              </p>
              <p className="mt-2 text-sm text-[#101828]/65">
                Probeer een andere categorie, wis je zoekterm, of meld je open
                aan.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setFilters(defaultVacancyFilterState)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[#173A8A] px-6 text-sm font-bold text-[#173A8A] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
                >
                  Reset filters
                </button>
                <Link
                  href={openApplyHref}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#F28C28] px-6 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
                >
                  Open aanmelden
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <VacancyDetailDrawer
        vacancy={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
