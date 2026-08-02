import { absoluteUrl, formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";
import { socialSameAs } from "@/lib/social";

export function organizationSchema() {
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
    sameAs: socialSameAs(),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: siteConfig.planningEmail,
        telephone: siteConfig.phoneTel,
        areaServed: "NL",
        availableLanguage: ["nl"],
      },
      {
        "@type": "ContactPoint",
        contactType: "HR",
        email: siteConfig.applicationsEmail,
        areaServed: "NL",
        availableLanguage: ["nl"],
      },
    ],
  };
}

/** LocalBusiness for GBP / Maps alignment — real NAP only. */
export function localBusinessSchema() {
  const { address } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EmploymentAgency"],
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phoneTel,
    image: absoluteUrl(siteConfig.defaultOgImage),
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.countryCode,
    },
    areaServed: {
      "@type": "Country",
      name: "Netherlands",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "17:30",
      },
    ],
    hasMap: siteConfig.googleMapsUrl,
    sameAs: socialSameAs(),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
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

export function serviceSchema(input: {
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
      telephone: siteConfig.phoneTel,
      address: formatAddressSingleLine(),
    },
    areaServed: "NL",
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
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

/**
 * JobPosting — only for real vacancy detail pages.
 * Never invent salary / fake postings.
 */
export function jobPostingSchema(input: {
  title: string;
  description: string;
  employmentType?: string;
  location: string;
  datePosted?: string;
  validThrough?: string;
  url?: string;
  identifier?: string;
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

  return posting;
}

export function locationServiceAreaSchema(input: {
  city: string;
  province: string;
  path: string;
  description: string;
  serviceName: string;
}) {
  const { address } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${input.serviceName} ${input.city}`,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "EmploymentAgency",
      name: siteConfig.name,
      url: siteConfig.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        postalCode: address.postalCode,
        addressLocality: address.city,
        addressCountry: address.countryCode,
      },
      telephone: siteConfig.phoneTel,
    },
    areaServed: {
      "@type": "City",
      name: input.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: input.province,
      },
    },
  };
}
