"use client";

import { serviceFilters, type ServiceFilter } from "@/lib/services";

type ServiceTabsProps = {
  activeFilter: ServiceFilter;
  onChange: (filter: ServiceFilter) => void;
};

export default function ServiceTabs({
  activeFilter,
  onChange,
}: ServiceTabsProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="flex w-max gap-2 sm:w-full sm:flex-wrap" role="tablist">
        {serviceFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter}
            onClick={() => onChange(filter)}
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
  );
}
