"use client";

import { useState } from "react";

const steps = [
  {
    step: "01",
    title: "Aanvraag",
    description: "Je deelt datum, locatie, tijden, functies, aantal mensen en contactpersoon.",
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
    <div className="mx-auto max-w-4xl">
      <div className="space-y-3">
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
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-inset"
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
                  <p className={`px-5 pb-5 pl-20 leading-7 ${isOpen ? "text-white/75" : ""}`}>
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
