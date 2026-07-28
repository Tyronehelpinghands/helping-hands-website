/**
 * Project case pages — /projecten/[slug].
 *
 * IMPORTANT — safe claim language only:
 * - `engagementType` distinguishes directe opdrachtgever / productiepartner / locatie / evenement.
 * - Fields we don't have confirmed data for (date, employeeCount, duration,
 *   challenge/solution/result, testimonial, images) are `null` and MUST be
 *   hidden in the UI rather than filled with invented specifics.
 * - Functions/activities describe the type of deployment that is typical for
 *   this kind of venue/production (consistent with our published services),
 *   not a claim of exact historical headcounts or dates.
 * - No Review/AggregateRating — no fake testimonials or numbers.
 */
import type { ServiceLandingSlug } from "@/lib/services";

export type ProjectEngagementType =
  | "directe opdrachtgever"
  | "productiepartner"
  | "locatie"
  | "evenement";

export type ProjectCaseTestimonial = {
  quote: string;
  author: string;
  role?: string;
};

export type ProjectCaseImage = {
  src: string;
  alt: string;
};

export type ProjectCase = {
  slug: string;
  name: string;
  city: string;
  location: string;
  venueType: string;
  engagementType: ProjectEngagementType;
  /** Short, safely-worded engagement description shown near the top of the page. */
  engagementNote: string;
  eventType: string | null;
  date: string | null;
  employeeCount: number | null;
  functions: string[];
  activities: string[];
  duration: string | null;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  testimonial: ProjectCaseTestimonial | null;
  images: ProjectCaseImage[];
  relatedServiceSlugs: ServiceLandingSlug[];
  relatedLocationSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  summary: string;
};

export const projectCases: ProjectCase[] = [
  {
    slug: "gelredome-arnhem",
    name: "GelreDome Arnhem",
    city: "Arnhem",
    location: "GelreDome",
    venueType: "Stadion",
    engagementType: "locatie",
    engagementNote:
      "Crew via een productiepartner ingezet bij producties op en rond deze stadionlocatie.",
    eventType: "Stadionproductie",
    date: null,
    employeeCount: null,
    functions: ["Stagehands", "Eventmedewerkers", "Logistiek medewerkers"],
    activities: [
      "Materiaalhandling en ondersteuning bij op- en afbouw rond het stadion",
      "Publieksstromen en praktische ondersteuning tijdens producties",
      "Back-of-house logistiek en materiaalstromen op locatie",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [
      {
        src: "/images/logos/locaties/gelredome.png",
        alt: "GelreDome logo",
      },
    ],
    relatedServiceSlugs: ["stagehands", "event-crew", "logistiek"],
    relatedLocationSlugs: ["stagehands-arnhem"],
    metaTitle: "Projectervaring GelreDome Arnhem",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij GelreDome in Arnhem: stagehands, eventcrew en logistieke ondersteuning via een productiepartner.",
    summary:
      "Onze crew heeft via een productiepartner projectervaring opgedaan bij GelreDome in Arnhem — een van de grotere stadionlocaties van Nederland waar naast sportwedstrijden ook concerten en events plaatsvinden.",
  },
  {
    slug: "johan-cruijff-arena-amsterdam",
    name: "Johan Cruijff ArenA Amsterdam",
    city: "Amsterdam",
    location: "Johan Cruijff ArenA",
    venueType: "Stadion",
    engagementType: "locatie",
    engagementNote:
      "Crew via een productiepartner ingezet bij producties op en rond deze stadionlocatie.",
    eventType: "Stadionproductie",
    date: null,
    employeeCount: null,
    functions: ["Eventmedewerkers", "Stagehands", "Logistiek medewerkers"],
    activities: [
      "Publieksstromen en crowd support rond de arena",
      "Materiaalhandling bij op- en afbouw van producties",
      "Logistieke ondersteuning en back-of-house bevoorrading",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [
      {
        src: "/images/logos/locaties/johan-cruijff-arena.png",
        alt: "Johan Cruijff ArenA logo",
      },
    ],
    relatedServiceSlugs: ["event-crew", "stagehands", "logistiek"],
    relatedLocationSlugs: ["event-crew-amsterdam", "stagehands-arnhem"],
    metaTitle: "Projectervaring Johan Cruijff ArenA Amsterdam",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij de Johan Cruijff ArenA in Amsterdam: eventcrew, stagehands en logistiek via een productiepartner.",
    summary:
      "Onze crew heeft via een productiepartner projectervaring opgedaan bij de Johan Cruijff ArenA in Amsterdam, met inzet rond publieksstromen, materiaalhandling en logistiek.",
  },
  {
    slug: "rai-amsterdam",
    name: "RAI Amsterdam",
    city: "Amsterdam",
    location: "Amsterdam RAI",
    venueType: "Beurslocatie",
    engagementType: "locatie",
    engagementNote:
      "Crew via een productiepartner ingezet bij beurzen en congressen op deze locatie.",
    eventType: "Beurs / congres",
    date: null,
    employeeCount: null,
    functions: ["Hospitality crew", "Eventmedewerkers", "Logistiek medewerkers"],
    activities: [
      "Ontvangst en hospitality tijdens beurs- en congresdagen",
      "Op- en afbouwondersteuning bij standbouw",
      "Materiaalstromen en logistiek op de beursvloer",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [
      {
        src: "/images/logos/locaties/amsterdam-rai.webp",
        alt: "Amsterdam RAI logo",
      },
    ],
    relatedServiceSlugs: ["hospitality", "event-crew", "logistiek"],
    relatedLocationSlugs: ["event-crew-amsterdam"],
    metaTitle: "Projectervaring RAI Amsterdam",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij de RAI in Amsterdam: hospitality, eventcrew en logistieke ondersteuning via een productiepartner.",
    summary:
      "Onze crew heeft via een productiepartner projectervaring opgedaan bij de RAI in Amsterdam, met inzet op hospitality, eventondersteuning en logistiek rond beurzen en congressen.",
  },
  {
    slug: "zuiderpark-den-haag",
    name: "Zuiderpark Den Haag",
    city: "Den Haag",
    location: "Zuiderpark",
    venueType: "Evenemententerrein",
    engagementType: "evenement",
    engagementNote:
      "Crew voor werkzaamheden op locatie bij evenementen op dit type buitenterrein in Den Haag.",
    eventType: "Buitenevenement",
    date: null,
    employeeCount: null,
    functions: ["Eventmedewerkers", "Horeca support", "Stagehands"],
    activities: [
      "Op- en afbouw van tijdelijke evenementenlocaties",
      "Horeca- en barondersteuning tijdens het evenement",
      "Publieksbegeleiding en crowd support buiten",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [],
    relatedServiceSlugs: ["event-crew", "horeca-personeel", "stagehands"],
    relatedLocationSlugs: ["eventpersoneel-den-haag"],
    metaTitle: "Projectervaring Zuiderpark Den Haag",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij evenementen op Zuiderpark in Den Haag: eventcrew, horeca support en op-/afbouw.",
    summary:
      "Onze crew is ingezet voor werkzaamheden op locatie bij evenementen op Zuiderpark in Den Haag — een buitenterrein dat regelmatig wordt gebruikt voor tijdelijke evenementenproducties.",
  },
  {
    slug: "scheveningen",
    name: "Scheveningen",
    city: "Den Haag",
    location: "Scheveningen (kust)",
    venueType: "Kustlocatie",
    engagementType: "evenement",
    engagementNote:
      "Crew voor werkzaamheden op locatie bij evenementen aan de kust in Scheveningen.",
    eventType: "Strand- en kustevenement",
    date: null,
    employeeCount: null,
    functions: ["Horeca support", "Eventmedewerkers", "Stagehands"],
    activities: [
      "Horeca- en barondersteuning bij strand- en kustevenementen",
      "Op- en afbouw van tijdelijke terrasconstructies en tenten",
      "Publieksbegeleiding tijdens drukke strandmomenten",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [],
    relatedServiceSlugs: ["horeca-personeel", "event-crew", "stagehands"],
    relatedLocationSlugs: ["eventpersoneel-den-haag"],
    metaTitle: "Projectervaring Scheveningen",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij evenementen in Scheveningen: horeca support, eventcrew en op-/afbouw aan de kust.",
    summary:
      "Onze crew is ingezet voor werkzaamheden op locatie bij evenementen aan de kust in Scheveningen, met de nadruk op horeca- en barondersteuning tijdens drukke strandmomenten.",
  },
  {
    slug: "kaap-amsterdam",
    name: "Kaap Amsterdam",
    city: "Amsterdam",
    location: "Kaap Amsterdam",
    venueType: "Eventlocatie",
    engagementType: "evenement",
    engagementNote:
      "Crew voor werkzaamheden op locatie bij events op deze Amsterdamse eventlocatie.",
    eventType: "Eventlocatie",
    date: null,
    employeeCount: null,
    functions: ["Hospitality crew", "Horeca support", "Eventmedewerkers"],
    activities: [
      "Ontvangst en gastbegeleiding tijdens events",
      "Horeca- en barondersteuning op locatie",
      "Praktische ondersteuning bij op- en afbouw",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [],
    relatedServiceSlugs: ["hospitality", "horeca-personeel", "event-crew"],
    relatedLocationSlugs: ["event-crew-amsterdam"],
    metaTitle: "Projectervaring Kaap Amsterdam",
    metaDescription:
      "Projectervaring van Helping Hands Agency bij Kaap Amsterdam: hospitality, horeca support en eventondersteuning op locatie.",
    summary:
      "Onze crew is ingezet voor werkzaamheden op locatie bij events op Kaap Amsterdam, met een mix van hospitality, horeca en praktische eventondersteuning.",
  },
  {
    slug: "antwerpen",
    name: "Antwerpen",
    city: "Antwerpen",
    location: "Regio Antwerpen, België",
    venueType: "Regio / meerdere locaties",
    engagementType: "productiepartner",
    engagementNote:
      "Crew via een productiepartner ingezet bij producties in de regio Antwerpen.",
    eventType: "Regionale inzet",
    date: null,
    employeeCount: null,
    functions: ["Eventmedewerkers", "Stagehands", "Logistiek medewerkers"],
    activities: [
      "Inzet via productiepartners bij events in de regio Antwerpen",
      "Materiaalhandling en ondersteuning bij grensoverschrijdende producties",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [],
    relatedServiceSlugs: ["event-crew", "stagehands", "logistiek"],
    relatedLocationSlugs: [],
    metaTitle: "Projectervaring regio Antwerpen",
    metaDescription:
      "Projectervaring van Helping Hands Agency in de regio Antwerpen: eventcrew, stagehands en logistiek via productiepartners.",
    summary:
      "Naast Nederland zet Helping Hands Agency via productiepartners ook crew in over de grens, waaronder in de regio Antwerpen. Dit is illustratief voor ons bereik, geen exhaustieve claimlijst van specifieke opdrachten.",
  },
  {
    slug: "brussel",
    name: "Brussel",
    city: "Brussel",
    location: "Regio Brussel, België",
    venueType: "Regio / meerdere locaties",
    engagementType: "productiepartner",
    engagementNote:
      "Crew via een productiepartner ingezet bij producties in de regio Brussel.",
    eventType: "Regionale inzet",
    date: null,
    employeeCount: null,
    functions: ["Eventmedewerkers", "Stagehands", "Logistiek medewerkers"],
    activities: [
      "Inzet via productiepartners bij events in de regio Brussel",
      "Materiaalhandling en ondersteuning bij grensoverschrijdende producties",
    ],
    duration: null,
    challenge: null,
    solution: null,
    result: null,
    testimonial: null,
    images: [],
    relatedServiceSlugs: ["event-crew", "stagehands", "logistiek"],
    relatedLocationSlugs: [],
    metaTitle: "Projectervaring regio Brussel",
    metaDescription:
      "Projectervaring van Helping Hands Agency in de regio Brussel: eventcrew, stagehands en logistiek via productiepartners.",
    summary:
      "Naast Nederland zet Helping Hands Agency via productiepartners ook crew in over de grens, waaronder in de regio Brussel. Dit is illustratief voor ons bereik, geen exhaustieve claimlijst van specifieke opdrachten.",
  },
];

export function getAllProjectCases(): ProjectCase[] {
  return projectCases;
}

export function getProjectCaseBySlug(slug: string): ProjectCase | undefined {
  return projectCases.find((item) => item.slug === slug);
}

export function getRelatedProjectCases(slug: string, limit = 3): ProjectCase[] {
  return projectCases.filter((item) => item.slug !== slug).slice(0, limit);
}
