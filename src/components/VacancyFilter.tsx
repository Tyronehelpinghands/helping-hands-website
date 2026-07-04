"use client";

import { useMemo, useState } from "react";
import {
  vacancies,
  vacancyFilters,
  vacancyMailto,
  type Vacancy,
  type VacancyFilter as Filter,
} from "@/lib/vacancies";

const categoryColors: Record<Vacancy["category"], string> = {
  Event: "from-[#173A8A] to-[#0B1F4D]",
  Horeca: "from-[#F28C28] to-[#de7c1f]",
  Restaurant: "from-[#173A8A] to-[#122a5c]",
  Keuken: "from-[#0B1F4D] to-[#173A8A]",
  Bar: "from-[#38bdf8] to-[#173A8A]",
  Stagebouw: "from-[#0B1F4D] to-[#173A8A]",
  Productie: "from-[#173A8A] to-[#122a5c]",
  Leidinggevend: "from-[#0B1F4D] to-[#101828]",
};

export default function VacancyFilter() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Alle");

  const visibleVacancies = useMemo(
    () =>
      activeFilter === "Alle"
        ? vacancies
        : vacancies.filter((vacancy) => vacancy.category === activeFilter),
    [activeFilter],
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {vacancyFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 ${
              activeFilter === filter
                ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-[#F5F7FA]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {visibleVacancies.map((vacancy) => (
          <article
            key={vacancy.title}
            className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-1 hover:border-[#F28C28]/50 hover:shadow-2xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div
                className={`rounded-xl bg-gradient-to-br ${categoryColors[vacancy.category]} px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white`}
              >
                {vacancy.category}
              </div>
              <span className="rounded-full bg-[#F5F7FA] px-3 py-1 text-xs font-semibold text-[#173A8A]">
                {vacancy.type}
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#0B1F4D]">
              {vacancy.title}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#173A8A]">
              {vacancy.location}
            </p>
            <p className="mt-4 leading-7 text-[#101828]/75">{vacancy.intro}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  Werkzaamheden
                </p>
                <ul className="mt-3 space-y-2">
                  {vacancy.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex gap-2 text-sm text-[#101828]/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  Profiel
                </p>
                <ul className="mt-3 space-y-2">
                  {vacancy.profile.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-[#101828]/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#173A8A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={vacancyMailto(vacancy.title, vacancy.email)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#F28C28] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 sm:w-auto"
            >
              Solliciteer op deze functie
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
