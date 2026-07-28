"use client";

import { useState } from "react";
import {
  aboutApproachClientSteps,
  aboutApproachEmployeeSteps,
} from "@/lib/aboutPage";
import { cn } from "@/lib/utils";

type AudienceKey = "employees" | "clients";

const audiences: { key: AudienceKey; label: string }[] = [
  { key: "employees", label: "Medewerkers" },
  { key: "clients", label: "Opdrachtgevers" },
];

export default function AboutApproach() {
  const [active, setActive] = useState<AudienceKey>("employees");
  const steps =
    active === "employees" ? aboutApproachEmployeeSteps : aboutApproachClientSteps;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Aanpak per doelgroep"
        className="mx-auto flex w-full max-w-md gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
      >
        {audiences.map((audience) => {
          const isActive = active === audience.key;
          return (
            <button
              key={audience.key}
              type="button"
              role="tab"
              id={`approach-tab-${audience.key}`}
              aria-selected={isActive}
              aria-controls={`approach-panel-${audience.key}`}
              onClick={() => setActive(audience.key)}
              className={cn(
                "min-h-11 flex-1 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2",
                isActive
                  ? "bg-[#173A8A] text-white shadow-md shadow-[#173A8A]/25"
                  : "text-[#173A8A]/70 hover:bg-[#F5F7FA] hover:text-[#173A8A]",
              )}
            >
              {audience.label}
            </button>
          );
        })}
      </div>

      <div
        id={`approach-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`approach-tab-${active}`}
        className="mt-10"
      >
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative h-full rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-5 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F28C28] text-xs font-black text-white shadow-md shadow-[#F28C28]/25">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base font-black text-[#0B1F4D]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
