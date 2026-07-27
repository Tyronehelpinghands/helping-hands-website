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
    <div>
      <label className="sr-only" htmlFor="service-filter-select">
        Filter diensten
      </label>
      <select
        id="service-filter-select"
        value={activeFilter}
        onChange={(event) => onChange(event.target.value as ServiceFilter)}
        className="mb-3 flex min-h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#173A8A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:hidden"
      >
        {serviceFilters.map((filter) => (
          <option key={filter} value={filter}>
            {filter === "Alle" ? "Alle uitgelichte diensten" : filter}
          </option>
        ))}
      </select>

      <div
        className="-mx-4 hidden overflow-x-auto px-4 pb-2 sm:mx-0 sm:block sm:overflow-visible sm:px-0"
        role="tablist"
        aria-label="Diensten filters"
      >
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          {serviceFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => onChange(filter)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:px-5 ${
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
    </div>
  );
}
