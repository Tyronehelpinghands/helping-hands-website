export type LogoCategory = "opdrachtgevers" | "projecten" | "locaties";

export type LogoItem = {
  name: string;
  slug: string;
  category: LogoCategory;
};

export const logoIntro =
  "Onze crew is ingezet bij uiteenlopende producties, opdrachtgevers en locaties in de live branche.";

export const logoCategories: { id: LogoCategory; label: string }[] = [
  { id: "opdrachtgevers", label: "Opdrachtgevers" },
  { id: "projecten", label: "Projecten & festivals" },
  { id: "locaties", label: "Locaties" },
];

export const logos: LogoItem[] = [
  { name: "Crewstars", slug: "crewstars", category: "opdrachtgevers" },
  { name: "TAP Crew", slug: "tap-crew", category: "opdrachtgevers" },
  {
    name: "Backstage Masters",
    slug: "backstage-masters",
    category: "opdrachtgevers",
  },
  { name: "Factor F", slug: "factor-f", category: "opdrachtgevers" },
  { name: "Defqon.1", slug: "defqon-1", category: "projecten" },
  {
    name: "Milkshake Festival",
    slug: "milkshake-festival",
    category: "projecten",
  },
  {
    name: "Ironman 70.3 Westfriesland",
    slug: "ironman-70-3-westfriesland",
    category: "projecten",
  },
  {
    name: "Keti Koti Amsterdam",
    slug: "keti-koti-amsterdam",
    category: "projecten",
  },
  { name: "Bad Bunny", slug: "bad-bunny", category: "projecten" },
  { name: "Bruno Mars", slug: "bruno-mars", category: "projecten" },
  { name: "BTS", slug: "bts", category: "projecten" },
  { name: "GelreDome", slug: "geldredome", category: "locaties" },
  {
    name: "Johan Cruijff ArenA",
    slug: "johan-cruijff-arena",
    category: "locaties",
  },
  { name: "PSV Stadion", slug: "psv-stadion", category: "locaties" },
  { name: "Amsterdam RAI", slug: "amsterdam-rai", category: "locaties" },
  { name: "NDSM", slug: "ndsm", category: "locaties" },
];

export function logoImagePath(item: LogoItem) {
  return `/images/logos/${item.category}/${item.slug}.png`;
}

export function logosByCategory(category: LogoCategory) {
  return logos.filter((logo) => logo.category === category);
}
