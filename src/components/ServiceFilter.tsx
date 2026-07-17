"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import {
  getHomeServicesByFilter,
  homeServiceFilters,
  type HomeService,
  type HomeServiceFilter,
} from "@/lib/homeServices";

type ServiceFilterProps = {
  /** Op /diensten: bij Alle alle cards tonen i.p.v. alleen featured. */
  showAllWhenAlle?: boolean;
};

export default function ServiceFilter({
  showAllWhenAlle = false,
}: ServiceFilterProps) {
  const [activeFilter, setActiveFilter] = useState<HomeServiceFilter>("Alle");
  const [selected, setSelected] = useState<HomeService | null>(null);

  const visibleServices = useMemo(
    () => getHomeServicesByFilter(activeFilter, { showAllWhenAlle }),
    [activeFilter, showAllWhenAlle],
  );

  useEffect(() => {
    if (!selected) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selected]);

  return (
    <div>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          {homeServiceFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:px-5 ${
                activeFilter === filter
                  ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                  : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-[#173A8A]">
        {activeFilter === "Alle"
          ? `${visibleServices.length} uitgelichte diensten`
          : `${visibleServices.length} diensten in ${activeFilter}`}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service) => (
          <article
            key={service.id}
            className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-1 hover:border-[#F28C28]/60 hover:shadow-2xl sm:p-7"
          >
            <ServiceIconBadge
              icon={service.icon}
              size="lg"
              interactive
              className="mb-4"
            />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              {service.category}
            </p>
            <h3 className="mt-2 text-xl font-black text-[#0B1F4D]">
              {service.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-[#101828]/75 sm:text-base">
              {service.shortDescription}
            </p>

            <ul className="mt-4 flex flex-wrap gap-1.5">
              {service.tasks.slice(0, 4).map((task) => (
                <li
                  key={task}
                  className="rounded-md bg-[#F5F7FA] px-2 py-1 text-[0.7rem] font-medium text-slate-600"
                >
                  {task}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs leading-5 text-[#101828]/55">
              <span className="font-semibold text-[#173A8A]">Ideaal voor: </span>
              {service.idealFor.slice(0, 3).join(" · ")}
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setSelected(service)}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#F5F7FA] px-4 py-2.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:w-auto"
              >
                Bekijk inzet
              </button>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#F28C28] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:w-auto"
              >
                Personeel aanvragen
              </Link>
            </div>
          </article>
        ))}
      </div>

      {selected ? (
        <>
          <button
            type="button"
            aria-label="Detail sluiten"
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:h-dvh sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                {selected.category}
              </p>
              <button
                type="button"
                aria-label="Sluiten"
                onClick={() => setSelected(null)}
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-[#173A8A] transition hover:bg-[#F5F7FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <ServiceIconBadge icon={selected.icon} size="lg" />
              <h3 className="mt-5 text-2xl font-black text-[#0B1F4D]">
                {selected.title}
              </h3>
              <p className="mt-4 leading-7 text-[#101828]/75">
                {selected.description}
              </p>

              <h4 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-[#173A8A]">
                Taken
              </h4>
              <ul className="mt-3 space-y-2">
                {selected.tasks.map((task) => (
                  <li
                    key={task}
                    className="flex items-start gap-2 text-sm leading-6 text-[#101828]/80"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]"
                      aria-hidden="true"
                    />
                    {task}
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-[#173A8A]">
                Ideaal voor
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.idealFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#F5F7FA] px-3 py-1.5 text-xs font-semibold text-[#173A8A]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setSelected(null)}
                  className="flex w-full items-center justify-center rounded-full bg-[#F28C28] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
                >
                  Personeel aanvragen
                </Link>
                <Link
                  href="/diensten"
                  onClick={() => setSelected(null)}
                  className="flex w-full items-center justify-center rounded-full border-2 border-[#173A8A] px-5 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Bekijk alle diensten
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
