"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HardHat,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

type ProcessStep = {
  step: string;
  title: string;
  icon: LucideIcon;
  intro: string;
  outcome: string;
  youDo: string[];
  weDo: string[];
};

const steps: ProcessStep[] = [
  {
    step: "01",
    title: "Aanvraag",
    icon: ClipboardList,
    intro:
      "Je deelt de basis van je productie: wanneer, waar, hoeveel mensen en welke functies je nodig hebt.",
    outcome: "Wij hebben een scherp beeld van je vraag en kunnen gericht plannen.",
    youDo: [
      "Datum, locatie en tijden doorgeven",
      "Functies en aantal mensen aangeven",
      "Contactpersoon op locatie delen",
    ],
    weDo: [
      "Aanvraag snel beoordelen en terugkoppelen",
      "Ontbrekende details kort nalopen",
      "Vervolgstappen en planning starten",
    ],
  },
  {
    step: "02",
    title: "Planning",
    icon: CalendarDays,
    intro:
      "We koppelen de juiste crew aan je aanvraag op basis van beschikbaarheid, ervaring en type productie.",
    outcome: "De bezetting staat, afgestemd op jouw planning en locatie.",
    youDo: [
      "Wijzigingen in planning of aantallen doorgeven",
      "Speciale eisen of voorkeuren melden",
    ],
    weDo: [
      "Beschikbare en passende crew selecteren",
      "Bezetting afstemmen op type productie",
      "Bevestiging van de planning terugkoppelen",
    ],
  },
  {
    step: "03",
    title: "Briefing",
    icon: ListChecks,
    intro:
      "Crew krijgt vooraf duidelijke informatie over aankomst, kleding, taken, locatie en aanspreekpunt.",
    outcome: "Iedereen weet wat er van hen verwacht wordt vóór aankomst op locatie.",
    youDo: [
      "Praktische info en huisregels delen",
      "Aanspreekpunt en verzamelpunt bevestigen",
    ],
    weDo: [
      "Briefing naar de crew versturen",
      "Taken, dresscode en tijden vastleggen",
      "Vragen van crew vooraf opvangen",
    ],
  },
  {
    step: "04",
    title: "Uitvoering",
    icon: HardHat,
    intro:
      "Het team staat op locatie klaar voor opbouw, show, hospitality, logistiek of afbouw.",
    outcome: "Crew is aanwezig, gebrieft en inzetbaar op het moment dat jij ze nodig hebt.",
    youDo: [
      "Crew ontvangen en richten op de werkvloer",
      "Korte updates doorgeven bij wijzigingen",
    ],
    weDo: [
      "Crew op tijd en op de juiste plek laten aankomen",
      "Bereikbaar blijven tijdens de dienst",
      "Bijspringen bij uitval of last-minute wijzigingen",
    ],
  },
  {
    step: "05",
    title: "Afhandeling",
    icon: CheckCircle2,
    intro:
      "Na afloop controleren we uren, verzamelen we terugkoppeling en ronden we de inzet netjes af.",
    outcome:
      "Uren kloppen, feedback is verwerkt en je weet waar je aan toe bent voor een volgende keer.",
    youDo: [
      "Korte terugkoppeling over de inzet geven",
      "Afwijkingen in uren of taken melden",
    ],
    weDo: [
      "Uren controleren en administratief afronden",
      "Feedback verwerken voor volgende inzetten",
      "Opvolging en facturatie netjes afhandelen",
    ],
  },
];

function StepDetail({ step, dark }: { step: ProcessStep; dark?: boolean }) {
  const muted = dark ? "text-white/75" : "text-[#101828]/75";
  const label = dark ? "text-[#F28C28]" : "text-[#173A8A]";
  const panelYou = dark
    ? "border-white/10 bg-white/5"
    : "border-[#173A8A]/10 bg-white";
  const panelWe = dark
    ? "border-[#F28C28]/35 bg-[#F28C28]/10"
    : "border-[#F28C28]/25 bg-[#FFF8F1]";

  return (
    <div className="space-y-5">
      <p className={`text-base leading-7 ${muted}`}>{step.intro}</p>

      <div
        className={`rounded-xl border px-4 py-3.5 ${
          dark
            ? "border-white/15 bg-gradient-to-r from-white/10 to-transparent"
            : "border-[#173A8A]/15 bg-gradient-to-r from-[#0B1F4D]/[0.04] to-transparent"
        }`}
      >
        <p className={`text-sm font-medium leading-6 ${dark ? "text-white/90" : "text-[#0B1F4D]"}`}>
          <span className={`font-bold ${label}`}>Resultaat · </span>
          {step.outcome}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={`rounded-xl border p-4 ${panelYou}`}>
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black ${
                dark ? "bg-white/15 text-white" : "bg-[#0B1F4D] text-white"
              }`}
            >
              JIJ
            </span>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${label}`}>
              Wat jij doet
            </p>
          </div>
          <ul className="space-y-2.5">
            {step.youDo.map((item) => (
              <li key={item} className={`flex gap-2.5 text-sm leading-6 ${muted}`}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#173A8A]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`rounded-xl border p-4 ${panelWe}`}>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F28C28] text-[10px] font-black text-white">
              WIJ
            </span>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${label}`}>
              Wat wij doen
            </p>
          </div>
          <ul className="space-y-2.5">
            {step.weDo.map((item) => (
              <li key={item} className={`flex gap-2.5 text-sm leading-6 ${muted}`}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ProcessAccordion() {
  const [openStep, setOpenStep] = useState(0);
  const active = steps[openStep]!;
  const ActiveIcon = active.icon;
  const progressPct = (openStep / (steps.length - 1)) * 100;

  return (
    <div>
      {/* Desktop / tablet stepper */}
      <div className="mb-10 hidden lg:block">
        <div className="relative mb-3">
          <div
            className="absolute left-[10%] right-[10%] top-[1.375rem] h-1 rounded-full bg-slate-200"
            aria-hidden="true"
          />
          <div
            className="absolute left-[10%] top-[1.375rem] h-1 rounded-full bg-gradient-to-r from-[#173A8A] to-[#F28C28] transition-all duration-500 ease-out"
            style={{ width: `${(progressPct / 100) * 80}%` }}
            aria-hidden="true"
          />
        </div>

        <ol className="relative grid grid-cols-5 gap-3" aria-label="Werkwijze stappen">
          {steps.map((step, index) => {
            const isActive = openStep === index;
            const isDone = index < openStep;
            const Icon = step.icon;

            return (
              <li key={step.title}>
                <button
                  type="button"
                  onClick={() => setOpenStep(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={`group relative flex w-full cursor-pointer flex-col items-center overflow-hidden rounded-2xl border px-3 py-5 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-[#173A8A] bg-[#0B1F4D] text-white shadow-lg shadow-[#0B1F4D]/25"
                      : isDone
                        ? "border-[#F28C28]/45 bg-gradient-to-b from-[#FFF8F1] to-white text-[#0B1F4D] hover:border-[#F28C28]"
                        : "border-slate-200 bg-white text-[#0B1F4D] hover:border-[#F28C28]/50"
                  }`}
                >
                  {isActive ? (
                    <span
                      className="pointer-events-none absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 0%, rgba(242,140,40,0.35), transparent 55%), radial-gradient(circle at 100% 100%, rgba(23,58,138,0.5), transparent 50%)",
                      }}
                      aria-hidden="true"
                    />
                  ) : null}

                  <span
                    className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#F28C28] text-white ring-4 ring-[#F28C28]/25"
                        : isDone
                          ? "bg-[#F28C28] text-white"
                          : "bg-slate-100 text-[#173A8A] group-hover:bg-[#F28C28]/15"
                    }`}
                  >
                    {isDone && !isActive ? (
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <span className="relative z-10 mt-3 text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
                    Stap {step.step}
                  </span>
                  <span className="relative z-10 mt-1 text-sm font-black">{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Desktop detail panel — graphic blocks only */}
      <div className="relative mx-auto mb-8 hidden overflow-hidden rounded-2xl border border-[#173A8A]/15 lg:block">
        <div
          className="absolute inset-0 bg-[#F5F7FA]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(11,31,77,0.06) 0%, transparent 42%), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(23,58,138,0.04) 12px, rgba(23,58,138,0.04) 13px)",
          }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[#F28C28]/15 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[#173A8A]/10 blur-2xl" aria-hidden="true" />

        <div className="relative flex items-start gap-5 border-b border-[#173A8A]/10 bg-white/70 px-6 py-5 backdrop-blur-[2px]">
          <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#0B1F4D] text-white shadow-md shadow-[#0B1F4D]/20">
            <ActiveIcon className="h-5 w-5 text-[#F28C28]" aria-hidden="true" />
            <span className="mt-0.5 text-[10px] font-black tracking-wider">{active.step}</span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                Stap {active.step} van {steps.length}
              </p>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" aria-hidden="true" />
              <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
                {steps.map((_, i) => (
                  <span
                    key={steps[i]!.title}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === openStep
                        ? "w-6 bg-[#F28C28]"
                        : i < openStep
                          ? "w-1.5 bg-[#173A8A]"
                          : "w-1.5 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <h3 className="mt-1 text-2xl font-black text-[#0B1F4D]">{active.title}</h3>
          </div>
        </div>

        <div className="relative px-6 py-6">
          <StepDetail step={active} />
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="mx-auto max-w-4xl space-y-3 lg:hidden">
        {steps.map((step, index) => {
          const isOpen = openStep === index;
          const Icon = step.icon;
          const isDone = index < openStep;

          return (
            <div
              key={step.title}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-[#173A8A] bg-[#0B1F4D] text-white shadow-xl"
                  : "border-slate-200 bg-white text-[#101828] shadow-sm hover:border-[#F28C28]/50"
              }`}
            >
              {isOpen ? (
                <span
                  className="pointer-events-none absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 0% 0%, rgba(242,140,40,0.28), transparent 45%), radial-gradient(circle at 100% 100%, rgba(23,58,138,0.55), transparent 50%)",
                  }}
                  aria-hidden="true"
                />
              ) : null}

              {/* Left progress rail */}
              <span
                className={`absolute bottom-0 left-0 top-0 w-1 transition-colors duration-300 ${
                  isOpen ? "bg-[#F28C28]" : isDone ? "bg-[#173A8A]" : "bg-slate-200"
                }`}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={() => setOpenStep(index)}
                className="relative flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 p-5 pl-6 text-left focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-inset"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl transition-colors ${
                      isOpen
                        ? "bg-[#F28C28] text-white"
                        : isDone
                          ? "bg-[#FFF8F1] text-[#F28C28]"
                          : "bg-[#F28C28]/15 text-[#173A8A]"
                    }`}
                  >
                    {isDone && !isOpen ? (
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    )}
                    <span className="text-[9px] font-black tracking-wider">{step.step}</span>
                  </span>
                  <span>
                    <span
                      className={`block text-[11px] font-bold uppercase tracking-[0.14em] ${
                        isOpen ? "text-white/60" : "text-[#173A8A]/70"
                      }`}
                    >
                      Stap {step.step}
                    </span>
                    <span className="text-lg font-black">{step.title}</span>
                  </span>
                </span>
                <span
                  className={`text-2xl font-light transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
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
                  <div className="relative px-5 pb-5 pl-6">
                    <StepDetail step={step} dark={isOpen} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
