"use client";

import { cn } from "@/lib/utils";

type ProjectSearchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function ProjectSearch({
  value,
  onChange,
  className,
}: ProjectSearchProps) {
  return (
    <label className={cn("relative block w-full", className)}>
      <span className="sr-only">Zoek projectervaring</span>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#101828]/40"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M16.5 16.5 20 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Zoek op project, locatie of categorie..."
        className="min-h-11 w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B1F4D] shadow-sm outline-none transition placeholder:text-[#101828]/40 focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/25"
      />
    </label>
  );
}
