"use client";

import { useEffect, useId, useRef } from "react";
import {
  defaultVacancyFilterState,
  vacancyCategoryFilters,
  vacancyLevelFilters,
  type VacancyFilterState,
} from "@/lib/vacancyFilters";
import { cn } from "@/lib/utils";

type VacancyFiltersProps = {
  state: VacancyFilterState;
  onChange: (next: VacancyFilterState) => void;
  resultCount: number;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  resultsId?: string;
};

export default function VacancyFilters({
  state,
  onChange,
  resultCount,
  mobileOpen,
  onMobileOpenChange,
  resultsId = "vacancy-results",
}: VacancyFiltersProps) {
  const tablistId = useId();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const active = tabRefs.current.get(state.category);
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [state.category]);

  const resultLabel =
    resultCount === 0
      ? "Geen vacatures gevonden binnen deze categorie."
      : resultCount === 1
        ? "1 vacature gevonden"
        : `${resultCount} vacatures gevonden`;

  const isFiltered =
    state.query.trim() !== "" ||
    state.category !== "Alle" ||
    state.level !== "Alle niveaus" ||
    state.featuredOnly ||
    state.noExperienceOnly;

  return (
    <div className="sticky top-16 z-20 max-w-full overflow-x-clip rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-4 shadow-lg shadow-[#0B1F4D]/5 backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="vacancy-search"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]"
          >
            Zoeken
          </label>
          <input
            id="vacancy-search"
            type="search"
            value={state.query}
            onChange={(event) =>
              onChange({ ...state, query: event.target.value })
            }
            placeholder="Zoek op functie, categorie of werkzaamheden..."
            className="mt-2 w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm text-[#101828] outline-none transition focus:border-[#173A8A] focus:ring-2 focus:ring-[#F28C28]/40"
          />
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p
            className="text-sm font-bold text-[#173A8A]"
            aria-live="polite"
          >
            {resultLabel}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => onChange(defaultVacancyFilterState)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-[#173A8A] transition hover:border-[#F28C28]/50 hover:bg-[#FFF7ED] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        id={tablistId}
        role="tablist"
        aria-label="Vacaturecategorieën"
        className="mt-5 w-full max-w-full overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-2">
          {vacancyCategoryFilters.map((category) => {
            const selected = state.category === category;
            const tabId = `vacancy-tab-${category.toLowerCase()}`;
            return (
              <button
                key={category}
                id={tabId}
                ref={(node) => {
                  if (node) tabRefs.current.set(category, node);
                  else tabRefs.current.delete(category);
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={resultsId}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange({ ...state, category })}
                className={cn(
                  "inline-flex min-h-[44px] shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
                  selected
                    ? "border border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                    : "border border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#F28C28]/50",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => onMobileOpenChange(!mobileOpen)}
          className="inline-flex min-h-[44px] w-full items-center justify-between rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
        >
          Meer filters
          <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
        </button>
      </div>

      <div
        className={cn(
          "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          !mobileOpen && "hidden lg:grid",
        )}
      >
        <div>
          <label
            htmlFor="vacancy-level"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]"
          >
            Niveau
          </label>
          <select
            id="vacancy-level"
            value={state.level}
            onChange={(event) =>
              onChange({
                ...state,
                level: event.target.value as VacancyFilterState["level"],
              })
            }
            className="mt-2 w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#F5F7FA] px-3 text-sm font-semibold text-[#0B1F4D] outline-none focus:border-[#173A8A] focus:ring-2 focus:ring-[#F28C28]/40"
          >
            {vacancyLevelFilters.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D]">
          <input
            type="checkbox"
            checked={state.featuredOnly}
            onChange={(event) =>
              onChange({ ...state, featuredOnly: event.target.checked })
            }
            className="h-4 w-4 accent-[#F28C28]"
          />
          Featured / populair
        </label>

        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D]">
          <input
            type="checkbox"
            checked={state.noExperienceOnly}
            onChange={(event) =>
              onChange({ ...state, noExperienceOnly: event.target.checked })
            }
            className="h-4 w-4 accent-[#F28C28]"
          />
          Geen ervaring nodig
        </label>
      </div>
    </div>
  );
}
