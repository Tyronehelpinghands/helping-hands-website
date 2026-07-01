"use client";

import { useState } from "react";
import Link from "next/link";

const options = {
  clients: {
    tab: "Ik zoek personeel",
    title: "Personeel nodig voor je event of productie?",
    text: "Deel je datum, locatie, tijden, functies en aantal mensen. Wij denken mee over de juiste bezetting.",
    checklist: [
      "Snel schakelen",
      "Een vast aanspreekpunt",
      "Duidelijke briefing",
      "Crew op locatie",
    ],
    cta: "Personeel aanvragen",
    href: "/contact",
  },
  workers: {
    tab: "Ik wil werken",
    title: "Werken op events, horeca en producties?",
    text: "Meld je aan als crewlid en werk mee op festivals, stadions, beurzen, horeca-events en producties.",
    checklist: [
      "Duidelijke planning",
      "Heldere briefing",
      "Afwisselende opdrachten",
      "Doorgroeien naar teamcaptain",
    ],
    cta: "Aanmelden als crewlid",
    href: "/medewerkers",
  },
} as const;

type AudienceKey = keyof typeof options;

export default function AudienceToggle() {
  const [activeAudience, setActiveAudience] = useState<AudienceKey>("clients");
  const active = options[activeAudience];

  return (
    <div className="rounded-[2rem] bg-[#0B1F4D] p-4 text-white shadow-2xl shadow-[#0B1F4D]/20 sm:p-6 lg:p-8">
      <div className="grid gap-3 rounded-2xl bg-white/5 p-2 sm:grid-cols-2">
        {(Object.keys(options) as AudienceKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveAudience(key)}
            className={`cursor-pointer rounded-xl px-5 py-4 text-left text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 focus:ring-offset-[#0B1F4D] sm:text-base ${
              activeAudience === key
                ? "bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {options[key].tab}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Waarvoor kom je naar Helping Hands?
          </p>
          <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{active.title}</h3>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{active.text}</p>
          <Link
            href={active.href}
            className="mt-8 inline-flex rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-black/20 transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1F4D]"
          >
            {active.cta}
          </Link>
        </div>

        <div className="grid gap-3">
          {active.checklist.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-[#F28C28]/40 hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F28C28] text-xs font-black">
                ✓
              </span>
              <span className="font-bold">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
