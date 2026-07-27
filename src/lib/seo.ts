import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/siteConfig";

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  /** Skip title template (`%s | Helping Hands Agency`). */
  absoluteTitle?: boolean;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  absoluteTitle = false,
  ogImage = siteConfig.defaultOgImage,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(ogImage);
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
      images: [{ url: imageUrl, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
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
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: [siteConfig.phoneTel, siteConfig.phoneLandlineTel],
    logo: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
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
      "Stagehands",
      "Horeca personeel",
      "Restaurant personeel",
      "Productie assistentie",
      "Logistiek",
      "Hospitality",
    ],
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
      sameAs: siteConfig.url,
      logo: absoluteUrl(siteConfig.defaultOgImage),
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

/** Map free-text employment labels to schema.org employmentType where possible. */
export function mapVacancyEmploymentType(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("full")) return "FULL_TIME";
  if (lower.includes("part")) return "PART_TIME";
  if (lower.includes("stage") || lower.includes("intern")) return "INTERN";
  return "TEMPORARY";
}
