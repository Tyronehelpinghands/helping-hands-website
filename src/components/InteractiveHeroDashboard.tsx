"use client";

import { useState } from "react";
import { ServiceIcon } from "@/components/ServiceIconBadge";
import type { ServiceIconKey } from "@/lib/service-icons";

const roles: {
  label: string;
  icon: ServiceIconKey;
  crew: number;
  status: string;
  location: string;
  tasks: string[];
  briefing: string;
}[] = [
  {
    label: "Stagehands",
    icon: "stagehands",
    crew: 6,
    status: "Bevestigd",
    location: "Concertzaal - load-in",
    tasks: ["Laden", "Lossen", "Opbouw", "Afbouw"],
    briefing: "Veiligheidsschoenen, zwarte kleding, melden bij productie",
  },
  {
    label: "Horeca support",
    icon: "horeca-support",
    crew: 4,
    status: "In planning",
    location: "Horecalocatie - piekmoment",
    tasks: ["Barback", "Runner", "Uitgifte", "Hospitality"],
    briefing: "Zwarte broek, zwarte schoenen, nette uitstraling",
  },
  {
    label: "Event crew",
    icon: "event-crew",
    crew: 8,
    status: "Briefing klaar",
    location: "Beursvloer - publieksstroom",
    tasks: ["Floor support", "Publieksstromen", "Garderobe", "Runners"],
    briefing: "Op tijd melden, porto-instructie, gastgerichte houding",
  },
  {
    label: "Productie",
    icon: "productie-assistentie",
    crew: 3,
    status: "Klaar voor locatie",
    location: "Backstage - productie",
    tasks: ["Backstage support", "Runner", "Crewcoördinatie"],
    briefing: "Melden bij productieleider, flexibel inzetbaar",
  },
];

const statusStyles: Record<string, string> = {
  Bevestigd: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
  "In planning": "border-white/15 bg-white/10 text-white/75",
  "Briefing klaar": "border-[#F28C28]/40 bg-[#F28C28]/20 text-[#F28C28]",
  "Klaar voor locatie": "border-blue-300/30 bg-blue-400/15 text-blue-100",
};

export default function InteractiveHeroDashboard() {
  const [activeRole, setActiveRole] = useState(roles[0]);

  return (
    <div className="rounded-2xl border border-white/20 bg-[#0B1F4D]/90 p-4 shadow-2xl backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#F28C28] sm:text-xs">
            Live status
          </p>
          <h2 className="text-lg font-black sm:text-xl">Crewplanning in één overzicht</h2>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold sm:text-xs ${statusStyles[activeRole.status]}`}
        >
          {activeRole.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {roles.map((role) => (
          <button
            key={role.label}
            type="button"
            onClick={() => setActiveRole(role)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 focus:ring-offset-[#0B1F4D] sm:text-sm ${
              activeRole.label === role.label
                ? "border-[#F28C28] bg-[#F28C28] text-white shadow-lg shadow-[#F28C28]/25"
                : "border-white/10 bg-white/5 text-white/75 hover:border-[#F28C28]/40 hover:text-white"
            }`}
          >
            <ServiceIcon icon={role.icon} className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">{role.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">Crew</p>
            <p className="text-2xl font-black">{activeRole.crew}</p>
            <p className="text-xs text-white/60">mensen ingepland</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-white/50">Locatie</p>
            <p className="text-sm font-bold">{activeRole.location}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">Takenlijst</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {activeRole.tasks.map((task) => (
              <span
                key={task}
                className="rounded-lg border border-white/10 bg-[#0B1F4D]/50 px-2.5 py-1 text-xs font-semibold text-white/80"
              >
                {task}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#F28C28]">Briefing</p>
          <p className="mt-1 text-sm leading-6 text-white/75">{activeRole.briefing}</p>
        </div>
      </div>
    </div>
  );
}
