export type LogoFolder = "opdrachtgevers" | "projecten" | "locaties";

export type LogoType = "opdrachtgever" | "project" | "locatie";

export type LogoItem = {
  name: string;
  slug: string;
  file: string;
  type: LogoType;
  category: string;
  folder: LogoFolder;
};

export type ShowcaseFilter = "alle" | LogoFolder;

export const logoSectionTitle = "Ervaring in de live branche";

export const logoSectionIntro =
  "Onze crew is ingezet bij uiteenlopende opdrachtgevers, producties, festivals en locaties. Logo's en namen tonen wij alleen waar dit past binnen de samenwerking of waar crewervaring is opgedaan.";

export const logoSectionIntroShort =
  "Onze crew is ingezet bij uiteenlopende opdrachtgevers, producties, festivals en locaties.";

export const logoDisclaimer =
  "Vermelde namen en logo's worden gebruikt ter aanduiding van projectervaring en inzetgebieden. Helping Hands Agency claimt geen officiële partnershipstatus tenzij dit expliciet vermeld staat.";

export const showcaseFilters: { id: ShowcaseFilter; label: string }[] = [
  { id: "alle", label: "Alle" },
  { id: "opdrachtgevers", label: "Opdrachtgevers" },
  { id: "projecten", label: "Projecten & festivals" },
  { id: "locaties", label: "Locaties" },
];

export const logos: LogoItem[] = [
  {
    name: "Crewstars",
    slug: "crewstars",
    file: "crewstars.png",
    type: "opdrachtgever",
    category: "Opdrachtgever",
    folder: "opdrachtgevers",
  },
  {
    name: "TAP Crew",
    slug: "tap-crew",
    file: "tap-crew.png",
    type: "opdrachtgever",
    category: "Opdrachtgever",
    folder: "opdrachtgevers",
  },
  {
    name: "Backstage Masters",
    slug: "backstage-masters",
    file: "backstage-masters.png",
    type: "opdrachtgever",
    category: "Opdrachtgever",
    folder: "opdrachtgevers",
  },
  {
    name: "Factor F",
    slug: "factor-f",
    file: "factor-f.png",
    type: "opdrachtgever",
    category: "Opdrachtgever",
    folder: "opdrachtgevers",
  },
  {
    name: "MOJO",
    slug: "mojo",
    file: "mojo.png",
    type: "opdrachtgever",
    category: "Productiepartner",
    folder: "opdrachtgevers",
  },
  {
    name: "LOC7000",
    slug: "loc7000",
    file: "loc7000.png",
    type: "opdrachtgever",
    category: "Productiepartner",
    folder: "opdrachtgevers",
  },
  {
    name: "Jaarbeurs Utrecht",
    slug: "jaarbeurs-utrecht",
    file: "jaarbeurs-utrecht.png",
    type: "opdrachtgever",
    category: "Locatie / opdrachtgever",
    folder: "opdrachtgevers",
  },
  {
    name: "ID&T",
    slug: "idt",
    file: "idt.png",
    type: "opdrachtgever",
    category: "Eventorganisatie",
    folder: "opdrachtgevers",
  },
  {
    name: "Backbone International",
    slug: "backbone-international",
    file: "backbone-international.png",
    type: "opdrachtgever",
    category: "Productiepartner",
    folder: "opdrachtgevers",
  },
  {
    name: "Your Productions",
    slug: "your-productions",
    file: "your-productions.png",
    type: "opdrachtgever",
    category: "Productiepartner",
    folder: "opdrachtgevers",
  },
  {
    name: "The Good Guyz",
    slug: "the-good-guyz",
    file: "the-good-guyz.png",
    type: "opdrachtgever",
    category: "Productiepartner",
    folder: "opdrachtgevers",
  },
  {
    name: "Q-dance",
    slug: "q-dance",
    file: "q-dance.png",
    type: "opdrachtgever",
    category: "Eventorganisatie",
    folder: "opdrachtgevers",
  },
  {
    name: "B2S",
    slug: "b2s",
    file: "b2s.png",
    type: "opdrachtgever",
    category: "Eventorganisatie",
    folder: "opdrachtgevers",
  },
  {
    name: "Awakenings",
    slug: "awakenings",
    file: "awakenings.png",
    type: "opdrachtgever",
    category: "Festival / eventorganisatie",
    folder: "opdrachtgevers",
  },
  {
    name: "Art of Dance",
    slug: "art-of-dance",
    file: "art-of-dance.png",
    type: "opdrachtgever",
    category: "Eventorganisatie",
    folder: "opdrachtgevers",
  },
  {
    name: "Defqon.1",
    slug: "defqon",
    file: "defqon.png",
    type: "project",
    category: "Festival",
    folder: "projecten",
  },
  {
    name: "Milkshake Festival",
    slug: "milkshake-festival",
    file: "milkshake-festival.png",
    type: "project",
    category: "Festival",
    folder: "projecten",
  },
  {
    name: "Ironman 70.3 Westfriesland",
    slug: "ironman-westfriesland",
    file: "ironman-westfriesland.png",
    type: "project",
    category: "Sportevent",
    folder: "projecten",
  },
  {
    name: "Keti Koti Amsterdam",
    slug: "keti-koti-amsterdam",
    file: "keti-koti-amsterdam.png",
    type: "project",
    category: "Festival",
    folder: "projecten",
  },
  {
    name: "Bad Bunny",
    slug: "bad-bunny",
    file: "bad-bunny.png",
    type: "project",
    category: "Concertproductie",
    folder: "projecten",
  },
  {
    name: "Bruno Mars",
    slug: "bruno-mars",
    file: "bruno-mars.png",
    type: "project",
    category: "Concertproductie",
    folder: "projecten",
  },
  {
    name: "BTS",
    slug: "bts",
    file: "bts.png",
    type: "project",
    category: "Concertproductie",
    folder: "projecten",
  },
  {
    name: "SAIL Amsterdam",
    slug: "sail-amsterdam",
    file: "sail-amsterdam.png",
    type: "project",
    category: "Festival / site coördinatie",
    folder: "projecten",
  },
  {
    name: "Festival op de Ring",
    slug: "festival-op-de-ring",
    file: "festival-op-de-ring.png",
    type: "project",
    category: "Festival / site coördinatie",
    folder: "projecten",
  },
  {
    name: "Dominator Festival",
    slug: "dominator-festival",
    file: "dominator-festival.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "Tegendraads",
    slug: "tegendraads",
    file: "tegendraads.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "Wildeburg",
    slug: "wildeburg",
    file: "wildeburg.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "KPN Festival",
    slug: "kpn-festival",
    file: "kpn-festival.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "Stadsfestival Amersfoort",
    slug: "stadsfestival-amersfoort",
    file: "stadsfestival-amersfoort.png",
    type: "project",
    category: "Festival / productie",
    folder: "projecten",
  },
  {
    name: "Lepeltje Lepeltje",
    slug: "lepeltje-lepeltje",
    file: "lepeltje-lepeltje.png",
    type: "project",
    category: "Festival / pre-productie",
    folder: "projecten",
  },
  {
    name: "Festifoort",
    slug: "festifoort",
    file: "festifoort.png",
    type: "project",
    category: "Festival / productie",
    folder: "projecten",
  },
  {
    name: "Extrema Outdoor",
    slug: "extrema-outdoor",
    file: "extrema-outdoor.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "Qmusic The Party!",
    slug: "qmusic-the-party",
    file: "qmusic-the-party.png",
    type: "project",
    category: "Event / uitvoerende productie",
    folder: "projecten",
  },
  {
    name: "We Love The 90's / De Hollandse Zomer",
    slug: "we-love-the-90s-de-hollandse-zomer",
    file: "we-love-the-90s-de-hollandse-zomer.png",
    type: "project",
    category: "Festival / site ondersteuning",
    folder: "projecten",
  },
  {
    name: "PROEF Amersfoort",
    slug: "proef-amersfoort",
    file: "proef-amersfoort.png",
    type: "project",
    category: "Food festival / productie",
    folder: "projecten",
  },
  {
    name: "Dias Latinos",
    slug: "dias-latinos",
    file: "dias-latinos.png",
    type: "project",
    category: "Festival / productie",
    folder: "projecten",
  },
  {
    name: "Knaltibal Festival",
    slug: "knaltibal-festival",
    file: "knaltibal-festival.png",
    type: "project",
    category: "Festival / uitvoerende productie",
    folder: "projecten",
  },
  {
    name: "GelreDome",
    slug: "gelredome",
    file: "gelredome.png",
    type: "locatie",
    category: "Stadion / eventlocatie",
    folder: "locaties",
  },
  {
    name: "Johan Cruijff ArenA",
    slug: "johan-cruijff-arena",
    file: "johan-cruijff-arena.png",
    type: "locatie",
    category: "Stadion",
    folder: "locaties",
  },
  {
    name: "PSV Stadion",
    slug: "psv-stadion",
    file: "psv-stadion.png",
    type: "locatie",
    category: "Stadion",
    folder: "locaties",
  },
  {
    name: "Amsterdam RAI",
    slug: "amsterdam-rai",
    file: "amsterdam-rai.png",
    type: "locatie",
    category: "Beurslocatie",
    folder: "locaties",
  },
  {
    name: "NDSM",
    slug: "ndsm",
    file: "ndsm.png",
    type: "locatie",
    category: "Eventlocatie",
    folder: "locaties",
  },
  {
    name: "Ziggo Dome",
    slug: "ziggo-dome",
    file: "ziggo-dome.png",
    type: "locatie",
    category: "Concertlocatie",
    folder: "locaties",
  },
  {
    name: "Rotterdam Ahoy",
    slug: "rotterdam-ahoy",
    file: "rotterdam-ahoy.png",
    type: "locatie",
    category: "Eventlocatie",
    folder: "locaties",
  },
];

export function logoImagePath(item: LogoItem) {
  return `/images/logos/${item.folder}/${item.file}`;
}

export function logosByFilter(filter: ShowcaseFilter) {
  if (filter === "alle") return logos;
  return logos.filter((logo) => logo.folder === filter);
}

export const logoFileManifest = logos.map(
  (logo) => `public/images/logos/${logo.folder}/${logo.file}`,
);
