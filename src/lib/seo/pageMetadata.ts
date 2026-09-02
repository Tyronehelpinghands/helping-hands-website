import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";
import { socialSameAs } from "@/lib/social";

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  /** Override canonical/OG url when this page is a synonym of another route. */
  canonicalPath?: string;
  /** Skip title template (`%s | Helping Hands Agency`). */
  absoluteTitle?: boolean;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  canonicalPath,
  absoluteTitle = false,
  ogImage = siteConfig.defaultOgImage,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(canonicalPath ?? path);
  const image = {
    url: absoluteUrl(ogImage),
    alt: siteConfig.name,
    width: siteConfig.ogImageWidth,
    height: siteConfig.ogImageHeight,
  };
  const fullTitle = absoluteTitle
    ? title
    : title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`;

  return {
    title: absoluteTitle || title.includes(siteConfig.name)
      ? { absolute: fullTitle }
      : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
  };
}

export function noIndexMetadata(title: string, description: string): Metadata {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export function organizationJsonLd() {
  const { address } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EmploymentAgency"],
    name: siteConfig.name,
    legalName: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: [siteConfig.phoneTel, siteConfig.phoneLandlineTel],
    logo: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    disambiguatingDescription: siteConfig.disambiguatingDescription,
    slogan: siteConfig.slogan,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.countryCode,
    },
    vatID: siteConfig.vat,
    identifier: [
      {
        "@type": "PropertyValue",
        name: "KvK",
        value: siteConfig.kvk,
      },
      {
        "@type": "PropertyValue",
        name: "BTW",
        value: siteConfig.vat,
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    knowsAbout: [
      "Event crew",
      "Eventpersoneel",
      "Festival crew",
      "Stagehands",
      "Horeca personeel",
      "Catering personeel",
      "Restaurant personeel",
      "Productie assistentie",
      "Logistiek",
      "Hospitality",
      "Load-in en load-out",
      "Event staffing",
      "Uitzendbureau evenementen",
    ],
    sameAs: [...socialSameAs(), siteConfig.googleMapsUrl],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "nl-NL",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/** ContactPoints for /contact (planning, applications, general). */
export function contactPointsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: socialSameAs(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.planningEmail,
        telephone: siteConfig.phoneTel,
        areaServed: "NL",
        availableLanguage: ["nl"],
        description: "Personeels- en crewaanvragen",
      },
      {
        "@type": "ContactPoint",
        contactType: "HR",
        email: siteConfig.applicationsEmail,
        areaServed: "NL",
        availableLanguage: ["nl"],
        description: "Crew aanmelden en sollicitaties",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: siteConfig.email,
        telephone: siteConfig.phoneTel,
        areaServed: "NL",
        availableLanguage: ["nl"],
        description: "Algemene vragen",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** AboutPage JSON-LD — geen fake reviews/ratings, alleen echte org-referentie. */
export function aboutPageJsonLd(input: {
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: input.name,
    url: absoluteUrl(input.path),
    description: input.description,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "EmploymentAgency",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "NL",
  };
}

/**
 * JobPosting JSON-LD. Never include baseSalary unless real salary data exists.
 */
export function jobPostingJsonLd(input: {
  title: string;
  description: string;
  employmentType?: string;
  location: string;
  datePosted?: string;
  validThrough?: string;
  url?: string;
  identifier?: string;
  /** Only pass when a real salary is known — never invent. */
  baseSalary?: {
    currency: string;
    minValue?: number;
    maxValue?: number;
    unitText?: string;
  };
}) {
  const posting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted ?? new Date().toISOString().slice(0, 10),
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: [siteConfig.url, ...socialSameAs()],
      logo: absoluteUrl(siteConfig.logo),
    },
    jobLocation: {
      "@type": "Place",
      name: input.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: input.location.includes("Landelijk")
          ? "Nederland"
          : input.location,
        addressCountry: "NL",
      },
    },
    employmentType: input.employmentType ?? "TEMPORARY",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Netherlands",
    },
  };

  if (input.url) posting.url = absoluteUrl(input.url);
  if (input.identifier) {
    posting.identifier = {
      "@type": "PropertyValue",
      name: siteConfig.name,
      value: input.identifier,
    };
  }
  if (input.validThrough) posting.validThrough = input.validThrough;

  if (input.baseSalary) {
    posting.baseSalary = {
      "@type": "MonetaryAmount",
      currency: input.baseSalary.currency,
      value: {
        "@type": "QuantitativeValue",
        ...(input.baseSalary.minValue != null
          ? { minValue: input.baseSalary.minValue }
          : {}),
        ...(input.baseSalary.maxValue != null
          ? { maxValue: input.baseSalary.maxValue }
          : {}),
        unitText: input.baseSalary.unitText ?? "HOUR",
      },
    };
  }

  return posting;
}

/**
 * EmploymentAgency JSON-LD scoped to a city for /locaties/[slug] pages.
 * Reuses the organization's real address/identifiers — areaServed communicates
 * regional coverage without claiming a separate legal branch/office.
 */
export function locationEmploymentAgencyJsonLd(input: {
  city: string;
  province: string;
  path: string;
  description: string;
}) {
  const { address } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    name: `${siteConfig.name} — ${input.city}`,
    url: absoluteUrl(input.path),
    description: input.description,
    parentOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.countryCode,
    },
    areaServed: {
      "@type": "City",
      name: input.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: input.province,
      },
    },
    telephone: [siteConfig.phoneTel, siteConfig.phoneLandlineTel],
    email: siteConfig.planningEmail,
  };
}

/** CreativeWork JSON-LD for a project case page. No Review/AggregateRating without real reviews. */
export function projectCaseCreativeWorkJsonLd(input: {
  name: string;
  description: string;
  path: string;
  city: string;
  images?: string[];
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    headline: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    about: input.city,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: absoluteUrl(siteConfig.logo),
    },
  };

  if (input.images && input.images.length > 0) {
    data.image = input.images.map((src) => absoluteUrl(src));
  }

  return data;
}

/** ItemList JSON-LD for the /locaties overview page. */
export function locationsItemListJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Werkgebieden Helping Hands Agency",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** Map free-text employment labels to schema.org employmentType where possible. */
export function mapVacancyEmploymentType(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("full")) return "FULL_TIME";
  if (lower.includes("part")) return "PART_TIME";
  if (lower.includes("stage") || lower.includes("intern")) return "INTERN";
  return "TEMPORARY";
}
