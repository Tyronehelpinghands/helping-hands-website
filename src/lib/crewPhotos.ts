/** Eigen crewfoto's voor homepage en /medewerkers. */

export type CrewPhoto = {
  src: string;
  alt: string;
};

/**
 * Homepage — sectorboxes met foto-achtergrond (Crewstars-stijl).
 * Wide/landscape shots werken het best als card-background.
 */
export const homeDeploymentPhotos: Record<string, CrewPhoto> = {
  Festivals: {
    src: "/images/crew/festival-build-site.webp",
    alt: "Festivalterrein tijdens opbouw met containers en crew",
  },
  Concerten: {
    src: "/images/crew/concert-globe-stage.webp",
    alt: "Grootschalige concertproductie op het podium",
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
    src: "/images/crew/scaffolding-team-wide.webp",
    alt: "Crew bouwt scaffolding en overkapping op locatie",
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
    src: "/images/crew/scaffolding-team-wide.webp",
    alt: "Team bouwt scaffolding op een evenemententerrein",
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
    src: "/images/crew/festival-build-site.webp",
    alt: "Festivalopbouw met crew en materiaal op het terrein",
  },
  {
    src: "/images/crew/forklift-operator.webp",
    alt: "Crew op heftruck tijdens logistiek werk",
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
  {
    src: "/images/crew/arena-flightcase.webp",
    alt: "Crew verplaatst flightcase in een stadion",
  },
  {
    src: "/images/crew/harness-shaka.webp",
    alt: "Crewlid op terrein met veiligheidsuitrusting",
  },
  {
    src: "/images/crew/crew-field-01.webp",
    alt: "Crew op trailer tijdens laden en lossen",
  },
  {
    src: "/images/crew/crew-field-05.webp",
    alt: "Helping Hands branding op de werkvloer",
  },
  {
    src: "/images/crew/festival-flex-hammer.webp",
    alt: "Crew tijdens festivalopbouw met branding",
  },
];

/** Uitgelichte foto naast "waarom werken bij". */
export const medewerkersFeatured: CrewPhoto = {
  src: "/images/crew/thumbs-up-branded.webp",
  alt: "Werken bij Helping Hands — crew met branding",
};

/** Wide shots voor CTA / donkere secties. */
export const ctaBackgroundPhoto: CrewPhoto = {
  src: "/images/crew/concert-globe-stage.webp",
  alt: "Live productie met publiek en podium",
};

/** Over ons — collage naast "Wie wij zijn". */
export const overOnsGallery: CrewPhoto[] = [
  {
    src: "/images/crew/crew-field-03.webp",
    alt: "Helping Hands team overlegt op locatie",
  },
  {
    src: "/images/crew/harness-branded-back.webp",
    alt: "Crewlid met Helping Hands branding en valbeveiliging",
  },
  {
    src: "/images/crew/scaffolding-portrait.webp",
    alt: "Crewlid op scaffolding tijdens opbouw",
  },
  {
    src: "/images/crew/crew-field-05.webp",
    alt: "Helping Hands shirt zichtbaar op de werkvloer",
  },
];

export const overOnsCtaPhoto: CrewPhoto = {
  src: "/images/crew/scaffolding-team-wide.webp",
  alt: "Team aan het werk op scaffolding",
};

/** Contact / personeel aanvragen. */
export const contactRequestPhoto: CrewPhoto = {
  src: "/images/crew/arena-flightcase.webp",
  alt: "Crew verplaatst materiaal in een stadion",
};

export const contactCrewPhoto: CrewPhoto = {
  src: "/images/crew/harness-shaka.webp",
  alt: "Crewlid klaar voor inzet op locatie",
};

export const contactStrip: CrewPhoto[] = [
  {
    src: "/images/crew/crew-field-01.webp",
    alt: "Crew op trailer tijdens laden en lossen",
  },
  {
    src: "/images/crew/forklift-operator.webp",
    alt: "Crew op heftruck tijdens logistiek",
  },
  {
    src: "/images/crew/festival-flex-hammer.webp",
    alt: "Crew tijdens festivalopbouw",
  },
  {
    src: "/images/crew/scaffolding-climb.webp",
    alt: "Crew klimt in scaffolding",
  },
];

/** Opdrachtgevers / personeel aanvragen. */
export const opdrachtgeversFeatured: CrewPhoto = {
  src: "/images/crew/crew-field-01.webp",
  alt: "Crew op locatie bij laden en lossen",
};

export const opdrachtgeversHorecaPhoto: CrewPhoto = {
  src: "/images/crew/chef-fryer.webp",
  alt: "Horecacrew aan het werk op een event",
};

export const opdrachtgeversProcessPhotos: CrewPhoto[] = [
  {
    src: "/images/crew/arena-flightcase.webp",
    alt: "Stadioncrew met flightcase",
  },
  {
    src: "/images/crew/standbouw-ladder.webp",
    alt: "Beursopbouw met ladder",
  },
  {
    src: "/images/crew/scaffolding-climb.webp",
    alt: "Stagebouw op scaffolding",
  },
  {
    src: "/images/crew/forklift-operator.webp",
    alt: "Logistiek met heftruck",
  },
];

export const opdrachtgeversCtaPhoto: CrewPhoto = {
  src: "/images/crew/festival-build-site.webp",
  alt: "Festivalterrein tijdens opbouw",
};
