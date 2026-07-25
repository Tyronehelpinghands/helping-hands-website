/** Eigen crewfoto's voor homepage en /medewerkers. */

export type CrewPhoto = {
  src: string;
  alt: string;
};

/** Homepage — sectie "Waar wij worden ingezet". */
export const homeDeploymentPhotos: Record<string, CrewPhoto> = {
  Festivals: {
    src: "/images/crew/festival-flex-hammer.webp",
    alt: "Helping Hands crew tijdens festivalopbouw",
  },
  Concerten: {
    src: "/images/crew/scaffolding-climb.webp",
    alt: "Crew aan het werk in scaffolding bij een productie",
  },
  Stadions: {
    src: "/images/crew/stadium-flightcase-push.webp",
    alt: "Eventcrew duwt flightcase in een stadion",
  },
  Beurzen: {
    src: "/images/crew/standbouw-ladder.webp",
    alt: "Crew bouwt een beursstand op met ladder en boormachine",
  },
  Horecalocaties: {
    src: "/images/crew/chef-fryer.webp",
    alt: "Keuken- en horecacrew aan het werk op locatie",
  },
  Producties: {
    src: "/images/crew/forklift-operator.webp",
    alt: "Crew bedient heftruck tijdens productielogistiek",
  },
};

/** Homepage — fotostrip onder logo's. */
export const homeCrewStrip: CrewPhoto[] = [
  {
    src: "/images/crew/thumbs-up-branded.webp",
    alt: "Helping Hands crewlid met thumbs up",
  },
  {
    src: "/images/crew/crew-woman-branded.webp",
    alt: "Helping Hands crewlid in branded shirt",
  },
  {
    src: "/images/crew/chef-fryer.webp",
    alt: "Horecacrew achter de frituur op een event",
  },
  {
    src: "/images/crew/stadium-flightcase-push.webp",
    alt: "Crew verplaatst materiaal in een stadion",
  },
  {
    src: "/images/crew/standbouw-ladder.webp",
    alt: "Standbouw en beursopbouw door Helping Hands crew",
  },
  {
    src: "/images/crew/crew-field-03.webp",
    alt: "Helping Hands team overlegt op locatie",
  },
];

/** Werken bij / medewerkers — galerij. */
export const medewerkersGallery: CrewPhoto[] = [
  {
    src: "/images/crew/thumbs-up-branded.webp",
    alt: "Crewlid met Helping Hands shirt geeft thumbs up",
  },
  {
    src: "/images/crew/crew-woman-branded.webp",
    alt: "Crewlid met Helping Hands branding op locatie",
  },
  {
    src: "/images/crew/harness-shaka.webp",
    alt: "Crewlid op terrein met veiligheidsuitrusting",
  },
  {
    src: "/images/crew/chef-fryer.webp",
    alt: "Keukencrew tijdens eventcatering",
  },
  {
    src: "/images/crew/stadium-flightcase-push.webp",
    alt: "Crew aan het werk in een stadion",
  },
  {
    src: "/images/crew/standbouw-ladder.webp",
    alt: "Crew tijdens standbouw en beursopbouw",
  },
  {
    src: "/images/crew/forklift-operator.webp",
    alt: "Crew op heftruck tijdens logistiek werk",
  },
  {
    src: "/images/crew/festival-flex-hammer.webp",
    alt: "Crew tijdens festivalopbouw met Helping Hands branding",
  },
  {
    src: "/images/crew/harness-branded-back.webp",
    alt: "Crewlid met Helping Hands shirt en valbeveiliging",
  },
  {
    src: "/images/crew/scaffolding-climb.webp",
    alt: "Crew klimt in scaffolding tijdens opbouw",
  },
  {
    src: "/images/crew/branded-shirt-flex.webp",
    alt: "Helping Hands crewshirt close-up",
  },
  {
    src: "/images/crew/scaffolding-portrait.webp",
    alt: "Crewlid op scaffolding bij eventopbouw",
  },
];

/** Uitgelichte foto naast "waarom werken bij". */
export const medewerkersFeatured: CrewPhoto = {
  src: "/images/crew/thumbs-up-branded.webp",
  alt: "Werken bij Helping Hands — crew met branding",
};
