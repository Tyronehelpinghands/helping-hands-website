import { projectLogos } from "@/lib/projectLogos";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

export const projectenPageTitle =
  "Projectervaring events, festivals en locaties | Helping Hands Agency";

export const projectenPageDescription =
  "Bekijk projectervaring van Helping Hands Agency binnen events, festivals, horeca, stagebouw, productie, logistiek en locaties. Crewervaring via opdrachten, partners en producties.";

export const projectenH1 =
  "Projectervaring op locaties, festivals en producties";

/**
 * Safe ItemList for project experience overview.
 * Uses projectervaring wording — no partnership claims.
 */
export function projectExperienceItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projectervaring Helping Hands Agency",
    description:
      "Overzicht van projectervaring en inzetgebieden via opdrachten, partners en producties. Geen officiële partnershipclaims.",
    numberOfItems: projectLogos.length,
    itemListElement: projectLogos.map((logo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: logo.name,
      description: `Projectervaring / inzetgebied: ${logo.category}. Vermelding ter aanduiding van crewervaring via opdrachten, partners of producties.`,
      url: absoluteUrl("/projecten"),
    })),
    provider: {
      "@type": "EmploymentAgency",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
