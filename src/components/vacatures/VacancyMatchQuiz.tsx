"use client";

import { useId, useState } from "react";
import VacancyCard from "@/components/vacatures/VacancyCard";
import VacancyDetailDrawer from "@/components/vacatures/VacancyDetailDrawer";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  matchVacancies,
  type MatchEnergy,
  type MatchExperience,
  type MatchFit,
} from "@/lib/vacancyFilters";
import { vacancies, type Vacancy } from "@/lib/vacancies";
import { cn } from "@/lib/utils";

const energyOptions: { id: MatchEnergy; label: string }[] = [
  { id: "gasten", label: "Gasten helpen" },
  { id: "fysiek", label: "Fysiek aanpakken" },
  { id: "keuken", label: "Keuken/horeca" },
  { id: "achter", label: "Achter de schermen" },
  { id: "organiseren", label: "Organiseren en overzicht houden" },
];

const experienceOptions: { id: MatchExperience; label: string }[] = [
  { id: "geen", label: "Geen / weinig ervaring" },
  { id: "beetje", label: "Beetje ervaring" },
  { id: "veel", label: "Veel ervaring" },
  { id: "leiding", label: "Leidinggevende ervaring" },
];

const fitOptions: { id: MatchFit; label: string }[] = [
  { id: "flexibel", label: "Flexibel werk" },
  { id: "horeca", label: "Horeca" },
  { id: "events", label: "Events" },
  { id: "stagebouw", label: "Stagebouw" },
  { id: "keuken", label: "Keuken" },
  { id: "productie", label: "Productie" },
];

function OptionButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full px-4 py-2.5 text-left text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]",
        selected
          ? "bg-[#0B1F4D] text-white shadow-md"
          : "border border-slate-200 bg-white text-[#173A8A] hover:border-[#F28C28]/50",
      )}
    >
      {label}
    </button>
  );
}

export default function VacancyMatchQuiz() {
  const headingId = useId();
  const [energy, setEnergy] = useState<MatchEnergy | null>(null);
  const [experience, setExperience] = useState<MatchExperience | null>(null);
  const [fit, setFit] = useState<MatchFit | null>(null);
  const [selected, setSelected] = useState<Vacancy | null>(null);

  const complete = energy && experience && fit;
  const matches = complete
    ? matchVacancies(vacancies, energy, experience, fit)
    : [];

  return (
    <section
      className="bg-[#F5F7FA] py-16 sm:py-24"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Keuzehulp
            </p>
            <h2
              id={headingId}
              className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl"
            >
              Welke klus past bij jou?
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
              Beantwoord drie korte vragen — we tonen drie passende functies uit
              onze vacatures. Geen account nodig.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mx-auto mt-10 max-w-4xl space-y-8 rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-lg shadow-[#0B1F4D]/5 sm:p-8">
          <fieldset>
            <legend className="text-sm font-black text-[#0B1F4D]">
              1. Waar krijg je energie van?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {energyOptions.map((option) => (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  selected={energy === option.id}
                  onClick={() => setEnergy(option.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-black text-[#0B1F4D]">
              2. Hoeveel ervaring heb je?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {experienceOptions.map((option) => (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  selected={experience === option.id}
                  onClick={() => setExperience(option.id)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-black text-[#0B1F4D]">
              3. Wat past bij jou?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {fitOptions.map((option) => (
                <OptionButton
                  key={option.id}
                  label={option.label}
                  selected={fit === option.id}
                  onClick={() => setFit(option.id)}
                />
              ))}
            </div>
          </fieldset>
        </div>

        {complete ? (
          <div className="mt-10">
            <p className="text-center text-sm font-bold text-[#173A8A]">
              {matches.length} passende{" "}
              {matches.length === 1 ? "functie" : "functies"} voor jou
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onView={() => setSelected(vacancy)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-[#101828]/60">
            Beantwoord alle drie de vragen om matches te zien.
          </p>
        )}
      </div>

      <VacancyDetailDrawer
        vacancy={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
