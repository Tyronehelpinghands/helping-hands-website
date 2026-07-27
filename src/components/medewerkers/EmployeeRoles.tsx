"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  employeeRoleCategories,
  employeeRoles,
  levelBadgeClass,
  type EmployeeRoleCategory,
} from "@/lib/employeePage";
import { cn } from "@/lib/utils";

type Filter = EmployeeRoleCategory | "Alle";

export default function EmployeeRoles() {
  const [active, setActive] = useState<Filter>("Event");
  const filters: Filter[] = ["Alle", ...employeeRoleCategories];
  const roles =
    active === "Alle"
      ? employeeRoles
      : employeeRoles.filter((role) => role.category === active);

  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Functies
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Welke klussen kun je doen?
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Event crew werk, stagehand worden, horeca werk of productie crew:
              filter op categorie en zie wat bij je past.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10">
          <div
            role="tablist"
            aria-label="Functiecategorieën"
            className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filters.map((filter) => {
              const selected = active === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(filter)}
                  className={cn(
                    "min-h-11 shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
                    selected
                      ? "bg-[#0B1F4D] text-white shadow-md"
                      : "border border-slate-200 bg-white text-[#173A8A] hover:border-[#F28C28]/50",
                  )}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {roles.map((role) => (
              <article
                key={role.id}
                className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-[#173A8A]/35 hover:shadow-lg hover:shadow-[#0B1F4D]/8"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-black text-[#0B1F4D]">{role.title}</h3>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold",
                      levelBadgeClass(role.level),
                    )}
                  >
                    {role.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#101828]/70">
                  {role.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {role.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex gap-2 text-sm text-[#101828]/75"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]"
                        aria-hidden="true"
                      />
                      {task}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-4 text-xs font-semibold leading-6 text-[#173A8A]">
                  Ideaal voor: {role.idealFor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
