"use client";

import Link from "next/link";
import type { NavDropdownConfig } from "@/lib/navigation";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function DropdownCard({
  title,
  description,
  href,
  onNavigate,
}: {
  title: string;
  description: string;
  href: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group block rounded-xl border border-slate-100 bg-[#F5F7FA]/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#F28C28]/45 hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
    >
      <p className="font-bold text-[#0B1F4D] transition group-hover:text-[#F28C28]">
        {title}
      </p>
      <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
    </Link>
  );
}

type HeaderDropdownProps = {
  config: NavDropdownConfig;
  isOpen: boolean;
  active: boolean;
  inverted: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  triggerClassName: (active: boolean) => string;
};

export default function HeaderDropdown({
  config,
  isOpen,
  active,
  inverted,
  onOpen,
  onClose,
  onToggle,
  triggerClassName,
}: HeaderDropdownProps) {
  const isMega = config.id === "diensten";

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        id={`nav-${config.id}-button`}
        aria-expanded={isOpen}
        aria-controls={`nav-${config.id}-panel`}
        aria-haspopup="true"
        onClick={onToggle}
        className={`inline-flex cursor-pointer items-center gap-1 ${triggerClassName(active)}`}
      >
        {config.label}
        <ChevronDown open={isOpen} />
      </button>

      {isOpen ? (
        <div
          id={`nav-${config.id}-panel`}
          role="region"
          aria-labelledby={`nav-${config.id}-button`}
          className={`absolute top-full z-50 pt-3 ${
            isMega
              ? "left-1/2 w-[min(100vw-2rem,56rem)] -translate-x-1/2"
              : "left-0 w-[22rem]"
          }`}
        >
          <div
            className={`origin-top animate-[dropdown-in_0.16s_ease-out] overflow-hidden rounded-2xl border bg-white shadow-2xl shadow-[#0B1F4D]/12 ${
              inverted ? "border-white/20" : "border-slate-200/80"
            }`}
          >
            <div className={`p-5 ${isMega ? "sm:p-6" : ""}`}>
              <div className={isMega ? "mb-5 max-w-2xl" : "mb-4"}>
                <p className="text-base font-black text-[#173A8A]">
                  {config.panelTitle}
                </p>
                {config.panelDescription ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {config.panelDescription}
                  </p>
                ) : null}
              </div>

              <div
                className={
                  isMega
                    ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid gap-2"
                }
              >
                {config.items.map((item) => (
                  <DropdownCard
                    key={item.title}
                    {...item}
                    onNavigate={onClose}
                  />
                ))}
              </div>

              {config.cta ? (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <Link
                    href={config.cta.href}
                    onClick={onClose}
                    className="inline-flex rounded-full bg-[#F28C28] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#F28C28]/25 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
                  >
                    {config.cta.label}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { ChevronDown };
