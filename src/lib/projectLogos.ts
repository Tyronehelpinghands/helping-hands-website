/**
 * Project logo data voor /projecten.
 *
 * Alleen entries met een lokaal bestaand logo-bestand worden getoond.
 * Ontbrekende logo's staan in missingProjectLogos + docs/missing-project-logos.md.
 */

export type ProjectLogoCategory =
  | "Opdrachtgevers"
  | "Projecten & festivals"
  | "Locaties";

export type ProjectLogo = {
  id: string;
  name: string;
  category: ProjectLogoCategory;
  logoPath: string;
  altText?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  /** Achtergrond in de logo-card: light (wit), dark (donker), brand (eigen merkvlak). */
  logoTone?: "light" | "dark" | "brand";
};

export type MissingProjectLogo = {
  id: string;
  name: string;
  category: ProjectLogoCategory;
  expectedPath: string;
  reason: string;
};

export type ProjectLogoFilter = "Alle" | ProjectLogoCategory;

export const projectLogoFilters: { id: ProjectLogoFilter; label: string }[] = [
  { id: "Alle", label: "Alle" },
  { id: "Opdrachtgevers", label: "Opdrachtgevers" },
  { id: "Projecten & festivals", label: "Projecten & festivals" },
  { id: "Locaties", label: "Locaties" },
];

/**
 * Catalogus van zichtbare logo's (lokaal bestand aanwezig).
 * Verwijderd: Ironman, Q-dance, The Good Guyz, Your Productions, LOC7000, ID&T.
 */
export const projectLogos: ProjectLogo[] = [
  // Opdrachtgevers
  {
    id: "crewstars",
    name: "Crewstars",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/crewstars.png",
    altText: "Crewstars logo",
    tags: ["Eventcrew", "Planning", "Productie"],
    featured: true,
    logoTone: "dark",
  },
  {
    id: "tap-crew",
    name: "TAP Crew",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/tap-crew.png",
    altText: "TAP Crew logo",
    tags: ["Horeca", "Events", "Crew"],
    featured: true,
    logoTone: "dark",
  },
  {
    id: "backstage-masters",
    name: "Backstage Masters",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/backstage-masters.png",
    altText: "Backstage Masters logo",
    tags: ["Backstage", "Productie", "Event support"],
    featured: true,
    logoTone: "dark",
  },
  {
    id: "factor-f",
    name: "Factor F",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/factor-f.webp",
    altText: "Factor F logo",
    tags: ["Festivals", "Productie", "Crewervaring"],
    featured: true,
    logoTone: "dark",
  },
  {
    id: "jaarbeurs",
    name: "Jaarbeurs",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/jaarbeurs.jpg",
    altText: "Jaarbeurs logo",
    tags: ["Beurs", "Locatie"],
    featured: true,
  },
  {
    id: "backbone",
    name: "Backbone International",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/backbone-international.png",
    altText: "Backbone International logo",
    tags: ["Productie", "Internationaal"],
  },

  // Projecten & festivals
  {
    id: "defqon",
    name: "Defqon.1",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/defqon.png",
    altText: "Defqon.1 logo",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "milkshake",
    name: "Milkshake Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/milkshake.png",
    altText: "Milkshake Festival logo",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "keti-koti",
    name: "Keti Koti",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/keti-koti.jpeg",
    altText: "Keti Koti logo",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "bad-bunny",
    name: "Bad Bunny",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bad-bunny.png",
    altText: "Bad Bunny logo",
    tags: ["Concert", "Productie"],
    featured: true,
  },
  {
    id: "bruno-mars",
    name: "Bruno Mars",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bruno-mars.png",
    altText: "Bruno Mars logo",
    tags: ["Concert", "Productie"],
  },
  {
    id: "bts",
    name: "BTS",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bts.png",
    altText: "BTS logo",
    tags: ["Concert", "Productie"],
  },
  {
    id: "sail-amsterdam",
    name: "SAIL Amsterdam",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/sail-amsterdam.png",
    altText: "SAIL Amsterdam logo",
    tags: ["Festival", "Logistiek"],
    featured: true,
  },
  {
    id: "festival-op-de-ring",
    name: "Festival op de Ring",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/festival-op-de-ring.png",
    altText: "Festival op de Ring logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "dominator",
    name: "Dominator Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/dominator.webp",
    altText: "Dominator Festival logo",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "tegendraads",
    name: "Tegendraads",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/tegendraads.png",
    altText: "Tegendraads logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "wildeburg",
    name: "Wildeburg",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/wildeburg.png",
    altText: "Wildeburg logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "kpn-festival",
    name: "KPN Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/kpn-festival.png",
    altText: "KPN Festival logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "stadsfestival-amersfoort",
    name: "Stadsfestival Amersfoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/stadsfestival-amersfoort.png",
    altText: "Stadsfestival Amersfoort logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "lepeltje-lepeltje",
    name: "Lepeltje Lepeltje",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/lepeltje-lepeltje.png",
    altText: "Lepeltje Lepeltje logo",
    tags: ["Festival", "Horeca"],
  },
  {
    id: "festifoort",
    name: "Festifoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/festifoort.png",
    altText: "Festifoort logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "extrema-outdoor",
    name: "Extrema Outdoor",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/extrema-outdoor.png",
    altText: "Extrema Outdoor logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "qmusic-the-party",
    name: "Qmusic The Party!",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/qmusic-the-party.png",
    altText: "Qmusic The Party logo",
    tags: ["Event", "Productie"],
  },
  {
    id: "hollandse-zomer",
    name: "De Hollandse Zomer",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/hollandse-zomer.jpg",
    altText: "De Hollandse Zomer logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "proef-amersfoort",
    name: "PROEF Amersfoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/proef-amersfoort.png",
    altText: "PROEF Amersfoort logo",
    tags: ["Food festival", "Horeca"],
  },
  {
    id: "dias-latinos",
    name: "Dias Latinos",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/dias-latinos.svg",
    altText: "Dias Latinos logo",
    tags: ["Festival", "Events"],
  },
  {
    id: "knaltibal",
    name: "Knaltibal Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/knaltibal.png",
    altText: "Knaltibal Festival logo",
    tags: ["Festival", "Events"],
  },

  // Locaties
  {
    id: "gelredome",
    name: "GelreDome",
    category: "Locaties",
    logoPath: "/images/logos/locaties/gelredome.png",
    altText: "GelreDome logo",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "johan-cruijff-arena",
    name: "Johan Cruijff ArenA",
    category: "Locaties",
    logoPath: "/images/logos/locaties/johan-cruijff-arena.png",
    altText: "Johan Cruijff ArenA logo",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "psv-stadion",
    name: "PSV Stadion",
    category: "Locaties",
    logoPath: "/images/logos/locaties/psv-stadion.jpg",
    altText: "PSV Stadion logo",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "amsterdam-rai",
    name: "Amsterdam RAI",
    category: "Locaties",
    logoPath: "/images/logos/locaties/amsterdam-rai.webp",
    altText: "Amsterdam RAI logo",
    tags: ["Beurs", "Locatie"],
    featured: true,
  },
  {
    id: "ndsm",
    name: "NDSM",
    category: "Locaties",
    logoPath: "/images/logos/locaties/ndsm.webp",
    altText: "NDSM logo",
    tags: ["Eventlocatie", "Locatie"],
  },
  {
    id: "ziggo-dome",
    name: "Ziggo Dome",
    category: "Locaties",
    logoPath: "/images/logos/locaties/ziggo-dome.png",
    altText: "Ziggo Dome logo",
    tags: ["Concertlocatie", "Locatie"],
    featured: true,
  },
  {
    id: "rotterdam-ahoy",
    name: "Rotterdam Ahoy",
    category: "Locaties",
    logoPath: "/images/logos/locaties/rotterdam-ahoy.jpg",
    altText: "Rotterdam Ahoy logo",
    tags: ["Eventlocatie", "Locatie"],
    featured: true,
  },
];

/** Items tijdelijk verborgen omdat het verwachte logo-bestand ontbreekt. */
export const missingProjectLogos: MissingProjectLogo[] = [
  {
    id: "mojo",
    name: "MOJO",
    category: "Opdrachtgevers",
    expectedPath: "public/images/logos/opdrachtgevers/mojo.png",
    reason: "Alleen tijdelijke SVG-wordmark aanwezig; officieel logo ontbreekt.",
  },
];

const HOMEPAGE_CAROUSEL_PRIORITY_IDS = [
  "crewstars",
  "tap-crew",
  "backstage-masters",
  "factor-f",
] as const;

export function getFeaturedProjectLogos(): ProjectLogo[] {
  const featured = projectLogos.filter((logo) => logo.featured);
  const priorityIds = new Set<string>(HOMEPAGE_CAROUSEL_PRIORITY_IDS);
  const priority = featured.filter((logo) => priorityIds.has(logo.id));
  const rest = featured.filter((logo) => !priorityIds.has(logo.id));
  return [...priority, ...rest];
}

/** Featured logo's voor de homepage-carousel. */
export function getHomepageFeaturedLogos(): ProjectLogo[] {
  return getFeaturedProjectLogos();
}

export function filterProjectLogos(filter: ProjectLogoFilter): ProjectLogo[] {
  if (filter === "Alle") return projectLogos;
  return projectLogos.filter((logo) => logo.category === filter);
}

export function countProjectLogosByCategory(category: ProjectLogoCategory): number {
  return projectLogos.filter((logo) => logo.category === category).length;
}

export function getProjectLogoInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export const projectExperienceDisclaimer =
  "Vermelde namen en logo's worden gebruikt ter aanduiding van projectervaring en inzetgebieden. Helping Hands Agency claimt geen officiële partnershipstatus tenzij dit expliciet vermeld staat.";
