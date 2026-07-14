"use client";

import {
  projectLogoFilters,
  type ProjectLogoFilter,
} from "@/lib/projectLogos";
import { cn } from "@/lib/utils";

type ProjectCategoryTabsProps = {
  active: ProjectLogoFilter;
  onChange: (filter: ProjectLogoFilter) => void;
  counts?: Partial<Record<ProjectLogoFilter, number>>;
};

export default function ProjectCategoryTabs({
  active,
  onChange,
  counts,
}: ProjectCategoryTabsProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto pb-1">
      <div className="flex w-max gap-2 sm:flex-wrap sm:w-auto">
        {projectLogoFilters.map((filter) => {
          const isActive = active === filter.id;
          const count = counts?.[filter.id];

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 sm:px-5",
                isActive
                  ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                  : "border-slate-200 bg-white text-[#173A8A] hover:border-[#173A8A]/30 hover:bg-[#F5F7FA]",
              )}
            >
              {filter.label}
              {count !== undefined ? (
                <span
                  className={cn(
                    "ml-1.5 text-xs font-semibold",
                    isActive ? "text-white/85" : "text-[#101828]/45",
                  )}
                >
                  ({count})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
