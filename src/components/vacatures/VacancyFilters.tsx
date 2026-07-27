"use client";

import {
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
};

export default function VacancyFilters({
  state,
  onChange,
  resultCount,
  mobileOpen,
  onMobileOpenChange,
}: VacancyFiltersProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-lg shadow-[#0B1F4D]/5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
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
            placeholder="Zoek op functie, tag, locatie…"
            className="mt-2 w-full min-h-11 rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm text-[#101828] outline-none transition focus:border-[#173A8A] focus:ring-2 focus:ring-[#F28C28]/40"
          />
        </div>
        <p className="text-sm font-bold text-[#173A8A]">
          {resultCount} {resultCount === 1 ? "functie" : "functies"} gevonden
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Vacaturecategorieën"
        className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {vacancyCategoryFilters.map((category) => {
          const selected = state.category === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange({ ...state, category })}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
                selected
                  ? "bg-[#0B1F4D] text-white shadow-md"
                  : "border border-slate-200 bg-[#F5F7FA] text-[#173A8A] hover:border-[#F28C28]/50",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-4 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          onClick={() => onMobileOpenChange(!mobileOpen)}
          className="inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
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
            className="mt-2 w-full min-h-11 rounded-xl border border-slate-200 bg-[#F5F7FA] px-3 text-sm font-semibold text-[#0B1F4D] outline-none focus:border-[#173A8A] focus:ring-2 focus:ring-[#F28C28]/40"
          >
            {vacancyLevelFilters.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D]">
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

        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#0B1F4D]">
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
