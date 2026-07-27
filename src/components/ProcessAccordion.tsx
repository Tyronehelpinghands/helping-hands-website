"use client";

import { useState } from "react";

const steps = [
  {
    step: "01",
    title: "Aanvraag",
    description:
      "Je deelt datum, locatie, tijden, functies, aantal mensen en contactpersoon.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "Wij koppelen de juiste mensen aan je aanvraag op basis van beschikbaarheid, ervaring en type productie.",
  },
  {
    step: "03",
    title: "Briefing",
    description:
      "Crew ontvangt duidelijke informatie over aankomst, kleding, taken, locatie en aanspreekpunt.",
  },
  {
    step: "04",
    title: "Uitvoering",
    description:
      "Het team staat op locatie klaar voor opbouw, show, hospitality, logistiek of afbouw.",
  },
  {
    step: "05",
    title: "Afhandeling",
    description:
      "We controleren uren, verzamelen terugkoppeling en zorgen voor nette opvolging.",
  },
];

export default function ProcessAccordion() {
  const [openStep, setOpenStep] = useState(0);

  return (
    <div>
      {/* Desktop / tablet stepper */}
      <ol className="mb-10 hidden gap-3 lg:grid lg:grid-cols-5" aria-label="Werkwijze stappen">
        {steps.map((step, index) => {
          const isActive = openStep === index;
          return (
            <li key={step.title} className="relative">
              {index < steps.length - 1 ? (
                <span
                  className="pointer-events-none absolute left-[calc(50%+1.5rem)] top-5 hidden h-0.5 w-[calc(100%-1.5rem)] bg-slate-200 lg:block"
                  aria-hidden="true"
                />
              ) : null}
              <button
                type="button"
                onClick={() => setOpenStep(index)}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex w-full cursor-pointer flex-col items-center rounded-2xl border px-3 py-4 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-[#173A8A] bg-[#0B1F4D] text-white shadow-lg"
                    : "border-slate-200 bg-white text-[#0B1F4D] hover:border-[#F28C28]/50"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F28C28] text-xs font-black text-white">
                  {step.step}
                </span>
                <span className="mt-3 text-sm font-black">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mx-auto mb-8 hidden max-w-3xl rounded-2xl border border-[#173A8A]/15 bg-[#F5F7FA] p-6 lg:block">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F28C28]">
          Stap {steps[openStep]?.step}
        </p>
        <h3 className="mt-2 text-2xl font-black text-[#0B1F4D]">
          {steps[openStep]?.title}
        </h3>
        <p className="mt-3 leading-7 text-[#101828]/75">
          {steps[openStep]?.description}
        </p>
      </div>

      {/* Mobile accordion */}
      <div className="mx-auto max-w-4xl space-y-3 lg:hidden">
        {steps.map((step, index) => {
          const isOpen = openStep === index;

          return (
            <div
              key={step.title}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? "border-[#173A8A] bg-[#0B1F4D] text-white shadow-xl"
                  : "border-slate-200 bg-white text-[#101828] shadow-sm hover:border-[#F28C28]/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenStep(index)}
                className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-inset"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F28C28] text-xs font-black text-white">
                    {step.step}
                  </span>
                  <span className="text-lg font-black">{step.title}</span>
                </span>
                <span
                  className={`text-2xl font-light transition-transform ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`px-5 pb-5 pl-20 leading-7 ${isOpen ? "text-white/75" : ""}`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
