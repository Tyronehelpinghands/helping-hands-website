"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import type { ProjectLogo } from "@/lib/projectLogos";
import {
  getCategoryContext,
  getRelatedServices,
  projectExperienceSafeDescription,
} from "@/lib/projectCategories";
import { cn } from "@/lib/utils";

type ProjectExperienceDrawerProps = {
  logo: ProjectLogo | null;
  open: boolean;
  onClose: () => void;
};

/**
 * Public /projecten logo detail drawer.
 * Separate from dashboard ProjectDetailDrawer (projects CRUD).
 */
export default function ProjectExperienceDrawer({
  logo,
  open,
  onClose,
}: ProjectExperienceDrawerProps) {
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

  if (!open || !logo) return null;

  const services = getRelatedServices(logo.category);

  return (
    <div className="fixed inset-0 z-50 flex max-w-[100vw] justify-end">
      <button
        type="button"
        aria-label="Sluit detail"
        className="absolute inset-0 bg-[#0B1F4D]/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-expanded={open}
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:max-w-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              {logo.category}
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-black text-[#0B1F4D] sm:text-2xl"
            >
              {logo.name}
            </h2>
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
          <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-100 bg-[#F5F7FA] p-6 sm:h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.logoPath}
              alt={logo.altText ?? `${logo.name} logo`}
              className="max-h-28 max-w-full object-contain sm:max-h-32"
            />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#173A8A]">
            {getCategoryContext(logo.category)}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#101828]/75">
            {logo.description ?? projectExperienceSafeDescription}
          </p>

          {logo.tags && logo.tags.length > 0 ? (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {logo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#101828]/50">
              Relevante diensten
            </h3>
            <ul className="mt-2 space-y-1.5">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-2 text-sm text-[#101828]/80"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]"
                    aria-hidden="true"
                  />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 rounded-xl border border-slate-100 bg-[#F5F7FA] p-3 text-xs leading-6 text-[#101828]/55">
            {projectExperienceSafeDescription}
          </p>
        </div>

        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#F28C28] px-4 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            >
              Personeel aanvragen
            </Link>
            <Link
              href="/diensten"
              className={cn(
                "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[#173A8A]/25 bg-white px-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
              )}
            >
              Bekijk diensten
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
