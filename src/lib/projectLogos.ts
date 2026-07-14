/**
 * Project logo data voor de /projecten pagina.
 *
 * Plaats logo's met exact deze bestandsnamen in public/images/logos/
 * of pas logoPath aan. Ontbrekende bestanden tonen een nette placeholder.
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
  description?: string;
  tags?: string[];
  featured?: boolean;
};

export type ProjectLogoFilter = "Alle" | ProjectLogoCategory;

export const projectLogoFilters: { id: ProjectLogoFilter; label: string }[] = [
  { id: "Alle", label: "Alle" },
  { id: "Opdrachtgevers", label: "Opdrachtgevers" },
  { id: "Projecten & festivals", label: "Projecten & festivals" },
  { id: "Locaties", label: "Locaties" },
];

export const projectLogos: ProjectLogo[] = [
  // Opdrachtgevers — public/images/logos/opdrachtgevers/
  {
    id: "crewstars",
    name: "Crewstars",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/crewstars.png",
    tags: ["Productie", "Crew"],
    featured: true,
  },
  {
    id: "tap-crew",
    name: "TAP Crew",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/tap-crew.png",
    tags: ["Crew", "Events"],
  },
  {
    id: "backstage-masters",
    name: "Backstage Masters",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/backstage-masters.png",
    tags: ["Productie", "Backstage"],
    featured: true,
  },
  {
    id: "factor-f",
    name: "Factor F",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/factor-f.png",
    tags: ["Productie", "Crew"],
  },
  {
    id: "mojo",
    name: "MOJO",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/mojo.png",
    tags: ["Events", "Productie"],
    featured: true,
  },
  {
    id: "loc7000",
    name: "LOC7000",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/loc7000.png",
    tags: ["Productie", "Logistiek"],
  },
  {
    id: "jaarbeurs",
    name: "Jaarbeurs",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/jaarbeurs.jpg",
    tags: ["Beurs", "Locatie"],
    featured: true,
  },
  {
    id: "id-t",
    name: "ID&T",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/id-t.png",
    tags: ["Events", "Festivals"],
    featured: true,
  },
  {
    id: "backbone",
    name: "Backbone International",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/backbone.png",
    tags: ["Productie", "Internationaal"],
  },
  {
    id: "your-productions",
    name: "Your Productions",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/your-productions.png",
    tags: ["Productie"],
  },
  {
    id: "the-good-guyz",
    name: "The Good Guyz",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/the-good-guyz.png",
    tags: ["Productie", "Events"],
  },
  {
    id: "q-dance",
    name: "Q-dance",
    category: "Opdrachtgevers",
    logoPath: "/images/logos/opdrachtgevers/q-dance.png",
    tags: ["Events", "Festivals"],
    featured: true,
  },

  // Projecten & festivals — public/images/logos/projecten/
  {
    id: "defqon",
    name: "Defqon.1",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/defqon.png",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "milkshake",
    name: "Milkshake Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/milkshake.png",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "ironman-westfriesland",
    name: "Ironman 70.3 Westfriesland",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/ironman-westfriesland.png",
    tags: ["Sportevent", "Logistiek"],
  },
  {
    id: "keti-koti",
    name: "Keti Koti",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/keti-koti.jpeg",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "bad-bunny",
    name: "Bad Bunny",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bad-bunny.png",
    tags: ["Concert", "Productie"],
    featured: true,
  },
  {
    id: "bruno-mars",
    name: "Bruno Mars",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bruno-mars.png",
    tags: ["Concert", "Productie"],
  },
  {
    id: "bts",
    name: "BTS",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/bts.png",
    tags: ["Concert", "Productie"],
  },
  {
    id: "sail-amsterdam",
    name: "SAIL Amsterdam",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/sail-amsterdam.png",
    tags: ["Festival", "Logistiek"],
    featured: true,
  },
  {
    id: "festival-op-de-ring",
    name: "Festival op de Ring",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/festival-op-de-ring.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "dominator",
    name: "Dominator Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/dominator.webp",
    tags: ["Festival", "Events"],
    featured: true,
  },
  {
    id: "tegendraads",
    name: "Tegendraads",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/tegendraads.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "wildeburg",
    name: "Wildeburg",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/wildeburg.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "kpn-festival",
    name: "KPN Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/kpn-festival.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "stadsfestival-amersfoort",
    name: "Stadsfestival Amersfoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/stadsfestival-amersfoort.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "lepeltje-lepeltje",
    name: "Lepeltje Lepeltje",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/lepeltje-lepeltje.png",
    tags: ["Festival", "Horeca"],
  },
  {
    id: "festifoort",
    name: "Festifoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/festifoort.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "extrema-outdoor",
    name: "Extrema Outdoor",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/extrema-outdoor.png",
    tags: ["Festival", "Events"],
  },
  {
    id: "qmusic-the-party",
    name: "Qmusic The Party!",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/qmusic-the-party.png",
    tags: ["Event", "Productie"],
  },
  {
    id: "hollandse-zomer",
    name: "De Hollandse Zomer",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/hollandse-zomer.jpg",
    tags: ["Festival", "Events"],
  },
  {
    id: "proef-amersfoort",
    name: "PROEF Amersfoort",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/proef-amersfoort.png",
    tags: ["Food festival", "Horeca"],
  },
  {
    id: "dias-latinos",
    name: "Dias Latinos",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/dias-latinos.svg",
    tags: ["Festival", "Events"],
  },
  {
    id: "knaltibal",
    name: "Knaltibal Festival",
    category: "Projecten & festivals",
    logoPath: "/images/logos/projecten/knaltibal.png",
    tags: ["Festival", "Events"],
  },

  // Locaties — public/images/logos/locaties/
  {
    id: "gelredome",
    name: "GelreDome",
    category: "Locaties",
    logoPath: "/images/logos/locaties/gelredome.png",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "johan-cruijff-arena",
    name: "Johan Cruijff ArenA",
    category: "Locaties",
    logoPath: "/images/logos/locaties/johan-cruijff-arena.png",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "psv-stadion",
    name: "PSV Stadion",
    category: "Locaties",
    logoPath: "/images/logos/locaties/psv-stadion.jpg",
    tags: ["Stadion", "Locatie"],
    featured: true,
  },
  {
    id: "amsterdam-rai",
    name: "Amsterdam RAI",
    category: "Locaties",
    logoPath: "/images/logos/locaties/amsterdam-rai.webp",
    tags: ["Beurs", "Locatie"],
    featured: true,
  },
  {
    id: "ndsm",
    name: "NDSM",
    category: "Locaties",
    logoPath: "/images/logos/locaties/ndsm.webp",
    tags: ["Eventlocatie", "Locatie"],
  },
  {
    id: "ziggo-dome",
    name: "Ziggo Dome",
    category: "Locaties",
    logoPath: "/images/logos/locaties/ziggo-dome.png",
    tags: ["Concertlocatie", "Locatie"],
    featured: true,
  },
  {
    id: "rotterdam-ahoy",
    name: "Rotterdam Ahoy",
    category: "Locaties",
    logoPath: "/images/logos/locaties/rotterdam-ahoy.jpg",
    tags: ["Eventlocatie", "Locatie"],
    featured: true,
  },
];

export function getFeaturedProjectLogos(): ProjectLogo[] {
  return projectLogos.filter((logo) => logo.featured);
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
