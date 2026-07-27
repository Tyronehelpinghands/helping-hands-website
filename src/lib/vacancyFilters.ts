import type { Vacancy, VacancyCategory, VacancyLevel } from "@/lib/vacancies";

export const vacancyCategoryFilters = [
  "Alle",
  "Event",
  "Horeca",
  "Restaurant",
  "Keuken",
  "Bar",
  "Stagebouw",
  "Productie",
  "Logistiek",
  "Hospitality",
  "Leidinggevend",
] as const;

export type VacancyCategoryFilter = (typeof vacancyCategoryFilters)[number];

export const vacancyLevelFilters = [
  "Alle niveaus",
  "Instap",
  "Ervaring handig",
  "Ervaren",
  "Leidinggevend",
] as const;

export type VacancyLevelFilter = (typeof vacancyLevelFilters)[number];

export type VacancyFilterState = {
  query: string;
  category: VacancyCategoryFilter;
  level: VacancyLevelFilter;
  featuredOnly: boolean;
  noExperienceOnly: boolean;
};

export const defaultVacancyFilterState: VacancyFilterState = {
  query: "",
  category: "Alle",
  level: "Alle niveaus",
  featuredOnly: false,
  noExperienceOnly: false,
};

export const categoryAccent: Record<VacancyCategory, string> = {
  Event: "from-[#173A8A] to-[#0B1F4D]",
  Horeca: "from-[#F28C28] to-[#de7c1f]",
  Restaurant: "from-[#173A8A] to-[#122a5c]",
  Keuken: "from-[#0B1F4D] to-[#173A8A]",
  Bar: "from-[#0284c7] to-[#173A8A]",
  Stagebouw: "from-[#0B1F4D] to-[#101828]",
  Productie: "from-[#173A8A] to-[#0B1F4D]",
  Logistiek: "from-[#0B1F4D] to-[#173A8A]",
  Hospitality: "from-[#F28C28] to-[#173A8A]",
  Leidinggevend: "from-[#101828] to-[#0B1F4D]",
};

export const categoryInitials: Record<VacancyCategory, string> = {
  Event: "EV",
  Horeca: "HO",
  Restaurant: "RE",
  Keuken: "KE",
  Bar: "BA",
  Stagebouw: "ST",
  Productie: "PR",
  Logistiek: "LO",
  Hospitality: "HI",
  Leidinggevend: "LE",
};

export function levelBadgeClass(level: VacancyLevel): string {
  switch (level) {
    case "Instap":
      return "border-[#173A8A]/25 bg-[#173A8A]/10 text-[#173A8A]";
    case "Ervaring handig":
      return "border-[#F28C28]/35 bg-[#FFF7ED] text-[#c2410c]";
    case "Ervaren":
      return "border-[#0B1F4D]/30 bg-[#0B1F4D] text-white";
    case "Leidinggevend":
      return "border-[#101828]/40 bg-[#101828] text-white";
  }
}

function matchesQuery(vacancy: Vacancy, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    vacancy.title,
    vacancy.category,
    vacancy.location,
    vacancy.shortDescription,
    vacancy.description,
    ...vacancy.tags,
    ...vacancy.tasks,
    ...vacancy.profile,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function filterVacancies(
  vacancies: Vacancy[],
  state: VacancyFilterState,
): Vacancy[] {
  return vacancies.filter((vacancy) => {
    if (state.category !== "Alle" && vacancy.category !== state.category) {
      return false;
    }
    if (state.level !== "Alle niveaus" && vacancy.level !== state.level) {
      return false;
    }
    if (state.featuredOnly && !vacancy.featured) {
      return false;
    }
    if (state.noExperienceOnly && vacancy.level !== "Instap") {
      return false;
    }
    return matchesQuery(vacancy, state.query);
  });
}

export type MatchEnergy =
  | "gasten"
  | "fysiek"
  | "keuken"
  | "achter"
  | "organiseren";

export type MatchExperience = "geen" | "beetje" | "veel" | "leiding";

export type MatchFit =
  | "flexibel"
  | "horeca"
  | "events"
  | "stagebouw"
  | "keuken"
  | "productie";

const energyIds: Record<MatchEnergy, string[]> = {
  gasten: [
    "eventmedewerker-floor-support",
    "host-gastheer-gastvrouw",
    "hospitality-medewerker",
    "vip-support",
  ],
  fysiek: [
    "stagehand-load-in-out",
    "logistiek-medewerker-events",
    "laad-en-loscrew",
  ],
  keuken: ["keukenhulp-hulp-kok", "barback", "runner-bediening"],
  achter: [
    "productie-assistent",
    "backstage-support",
    "productie-runner",
  ],
  organiseren: [
    "teamcaptain",
    "shiftleader-horeca",
    "productie-assistent",
  ],
};

const fitBoost: Record<MatchFit, VacancyCategory[]> = {
  flexibel: ["Event", "Horeca", "Hospitality"],
  horeca: ["Horeca", "Bar", "Restaurant"],
  events: ["Event", "Hospitality"],
  stagebouw: ["Stagebouw", "Logistiek"],
  keuken: ["Keuken", "Bar"],
  productie: ["Productie", "Logistiek"],
};

const experienceLevels: Record<MatchExperience, VacancyLevel[]> = {
  geen: ["Instap"],
  beetje: ["Instap", "Ervaring handig"],
  veel: ["Ervaring handig", "Ervaren", "Leidinggevend"],
  leiding: ["Leidinggevend", "Ervaren"],
};

export function matchVacancies(
  vacancies: Vacancy[],
  energy: MatchEnergy,
  experience: MatchExperience,
  fit: MatchFit,
): Vacancy[] {
  const preferredIds = energyIds[energy];
  const preferred = preferredIds
    .map((id) => vacancies.find((v) => v.id === id))
    .filter((v): v is Vacancy => Boolean(v));

  const levelOk = experienceLevels[experience];
  const categories = fitBoost[fit];

  const scored = vacancies
    .map((vacancy) => {
      let score = 0;
      if (preferredIds.includes(vacancy.id)) score += 10;
      if (categories.includes(vacancy.category)) score += 4;
      if (levelOk.includes(vacancy.level)) score += 3;
      if (vacancy.featured) score += 1;
      return { vacancy, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const fromScore = scored.map((s) => s.vacancy);
  const merged = [...preferred];
  for (const vacancy of fromScore) {
    if (!merged.some((v) => v.id === vacancy.id)) merged.push(vacancy);
  }

  return merged.slice(0, 3);
}
