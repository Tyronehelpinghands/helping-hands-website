"use client";

import { useEffect, useId, useRef } from "react";
import {
  vacancyApplyMailto,
  vacancyQuestionMailto,
  type Vacancy,
} from "@/lib/vacancies";
import { levelBadgeClass } from "@/lib/vacancyFilters";
import { cn } from "@/lib/utils";

type VacancyDetailDrawerProps = {
  vacancy: Vacancy | null;
  open: boolean;
  onClose: () => void;
};

export default function VacancyDetailDrawer({
  vacancy,
  open,
  onClose,
}: VacancyDetailDrawerProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !vacancy) return null;

  return (
    <div className="fixed inset-0 z-50 flex max-w-[100vw] justify-end">
      <button
        type="button"
        aria-label="Sluit vacaturedetail"
        className="absolute inset-0 bg-[#0B1F4D]/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:max-w-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              {vacancy.category}
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-black text-[#0B1F4D] sm:text-2xl"
            >
              {vacancy.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                  levelBadgeClass(vacancy.level),
                )}
              >
                {vacancy.level}
              </span>
              <span className="rounded-full bg-[#F5F7FA] px-2.5 py-1 text-[11px] font-semibold text-[#173A8A]">
                {vacancy.employmentType}
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg font-bold text-[#0B1F4D] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            aria-label="Sluiten"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <p className="text-sm font-semibold text-[#173A8A]">
            {vacancy.location}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#101828]/80 sm:text-base sm:leading-8">
            {vacancy.description}
          </p>

          <Section title="Werkzaamheden" items={vacancy.tasks} />
          <Section title="Profiel" items={vacancy.profile} />
          {vacancy.niceToHave?.length ? (
            <Section title="Nice to have" items={vacancy.niceToHave} />
          ) : null}
          <Section title="Wat je krijgt" items={vacancy.whatYouGet} />
          <Section title="Geschikt voor" items={vacancy.suitableFor} />
        </div>

        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={vacancyApplyMailto(vacancy)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#F28C28] px-4 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            >
              Solliciteer op deze functie
            </a>
            <a
              href={vacancyQuestionMailto(vacancy)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border-2 border-[#173A8A] px-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            >
              Stel een vraag
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-[#101828]/80">
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#173A8A]"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
