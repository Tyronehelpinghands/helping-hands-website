"use client";

import { useEffect } from "react";
import Link from "next/link";
import ServiceIconBadge from "@/components/ServiceIconBadge";
import type { Service } from "@/lib/services";

type ServiceDetailDrawerProps = {
  service: Service | null;
  onClose: () => void;
};

export default function ServiceDetailDrawer({
  service,
  onClose,
}: ServiceDetailDrawerProps) {
  useEffect(() => {
    if (!service) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Detail sluiten"
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
        className="fixed inset-x-0 bottom-0 z-[70] max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:h-dvh sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
            {service.category}
          </p>
          <button
            type="button"
            aria-label="Sluiten"
            onClick={onClose}
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
          <ServiceIconBadge icon={service.icon} size="lg" />
          <h3 className="mt-5 text-2xl font-black text-[#0B1F4D]">
            {service.title}
          </h3>
          <p className="mt-4 leading-7 text-[#101828]/75">
            {service.description}
          </p>

          <h4 className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-[#173A8A]">
            Taken
          </h4>
          <ul className="mt-3 space-y-2">
            {service.tasks.map((task) => (
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
            {service.idealFor.map((item) => (
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
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-[#F28C28] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
            <Link
              href="/diensten"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full border-2 border-[#173A8A] px-5 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
            >
              Bekijk alle diensten
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
