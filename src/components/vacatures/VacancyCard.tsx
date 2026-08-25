"use client";

import type { Vacancy } from "@/lib/vacancies";
import { openApplyHref } from "@/lib/vacancies";
import Link from "next/link";
import {
  categoryAccent,
  categoryInitials,
  levelBadgeClass,
} from "@/lib/vacancyFilters";
import { cn } from "@/lib/utils";

type VacancyCardProps = {
  vacancy: Vacancy;
  onView: () => void;
};

export default function VacancyCard({ vacancy, onView }: VacancyCardProps) {
  const tags = vacancy.tags.slice(0, 3);
  const tasks = vacancy.tasks.slice(0, 3);

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#F28C28]/55 hover:shadow-xl hover:shadow-[#0B1F4D]/10 sm:p-6",
        vacancy.featured
          ? "border-[#F28C28]/40 ring-1 ring-[#F28C28]/25"
          : "border-slate-200/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-black text-white shadow-md",
            categoryAccent[vacancy.category],
          )}
          aria-hidden="true"
        >
          {categoryInitials[vacancy.category]}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="rounded-full bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#173A8A]">
            {vacancy.category}
          </span>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-bold",
              levelBadgeClass(vacancy.level),
            )}
          >
            {vacancy.level}
          </span>
          {vacancy.urgent ? (
            <span className="rounded-full bg-[#F28C28] px-2.5 py-1 text-[11px] font-bold text-white">
              Urgent
            </span>
          ) : null}
          {vacancy.featured ? (
            <span className="rounded-full border border-[#F28C28]/40 bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-bold text-[#c2410c]">
              Populair
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-black text-[#0B1F4D] sm:text-xl">
        {vacancy.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#101828]/70">
        {vacancy.shortDescription}
      </p>

      <div className="mt-3 space-y-1 text-xs font-semibold text-[#173A8A]">
        <p className="line-clamp-1">{vacancy.location}</p>
        <p className="line-clamp-1 text-[#101828]/55">{vacancy.employmentType}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#F5F7FA] px-2 py-1 text-[11px] font-semibold text-[#101828]/65"
          >
            {tag}
          </span>
        ))}
      </div>

      <ul className="mt-4 space-y-1.5">
        {tasks.map((task) => (
          <li
            key={task}
            className="flex gap-2 text-sm text-[#101828]/75"
          >
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]"
              aria-hidden="true"
            />
            <span className="line-clamp-1">{task}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={onView}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 border-[#173A8A] px-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
        >
          Bekijk functie
        </button>
        <Link
          href={openApplyHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#F28C28] px-4 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
        >
          Solliciteer
        </Link>
      </div>
    </article>
  );
}
