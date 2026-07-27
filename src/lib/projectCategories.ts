import type { ProjectLogo, ProjectLogoCategory } from "@/lib/projectLogos";

export type ProjectLogoFilter = "Alle" | ProjectLogoCategory;

export const projectLogoFilters: { id: ProjectLogoFilter; label: string }[] = [
  { id: "Alle", label: "Alle" },
  { id: "Opdrachtgevers", label: "Opdrachtgevers" },
  { id: "Projecten & festivals", label: "Projecten & festivals" },
  { id: "Locaties", label: "Locaties" },
];

export const categoryContextLine: Record<ProjectLogoCategory, string> = {
  Opdrachtgevers: "Crewervaring via opdrachten en partners.",
  "Projecten & festivals":
    "Inzetgebied binnen events, festivals of producties.",
  Locaties: "Locatie-ervaring binnen events, beurzen of stadions.",
};

export const categoryRelatedServices: Record<ProjectLogoCategory, string[]> = {
  Opdrachtgevers: [
    "Eventcrew",
    "Productie assistentie",
    "Stagehands",
    "Horeca support",
  ],
  "Projecten & festivals": [
    "Load-in/load-out",
    "Runners",
    "Floor support",
    "Hospitality",
    "Horeca support",
  ],
  Locaties: [
    "Sitecrew",
    "Logistiek",
    "Horeca",
    "Stagebouw",
    "Productie support",
  ],
};

export const projectExperienceSafeDescription =
  "Deze vermelding wordt getoond als onderdeel van projectervaring en inzetgebieden. Helping Hands Agency claimt geen officiële partnershipstatus tenzij dit expliciet schriftelijk is bevestigd.";

export function getCategoryContext(category: ProjectLogoCategory): string {
  return categoryContextLine[category];
}

export function getRelatedServices(category: ProjectLogoCategory): string[] {
  return categoryRelatedServices[category];
}

export function searchProjectLogos(
  logos: ProjectLogo[],
  query: string,
): ProjectLogo[] {
  const q = query.trim().toLowerCase();
  if (!q) return logos;

  return logos.filter((logo) => {
    const haystack = [
      logo.name,
      logo.category,
      ...(logo.tags ?? []),
      logo.description ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
