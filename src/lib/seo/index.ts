export { personeelInhurenFaqs, werkenBijFaqs } from "@/lib/seo/faq";
export {
  canonicalizeInternalHref,
  hubLocationLinks,
  hubServiceLinks,
  hubWorkLinks,
  relatedForLocation,
  relatedForService,
  relatedForWork,
} from "@/lib/seo/internalLinks";
export {
  getAllSeoLocationPages,
  getSeoLocationPage,
  getSeoLocationSlugs,
  seoLocationPages,
} from "@/lib/seo/locationPages";
export {
  aboutPageJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
  contactPointsJsonLd,
  faqJsonLd,
  jobPostingJsonLd,
  locationEmploymentAgencyJsonLd,
  locationsItemListJsonLd,
  mapVacancyEmploymentType,
  noIndexMetadata,
  organizationJsonLd,
  projectCaseCreativeWorkJsonLd,
  serviceJsonLd,
  siteNavigationJsonLd,
  websiteJsonLd,
} from "@/lib/seo/pageMetadata";
export {
  getAllServicePages,
  getServicePage,
  servicePages,
} from "@/lib/seo/servicePages";
export {
  breadcrumbSchema,
  faqPageSchema,
  jobPostingSchema,
  localBusinessSchema,
  locationServiceAreaSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo/structuredData";
export type {
  SeoCta,
  SeoFaq,
  SeoLocationPage,
  SeoProcessStep,
  SeoRelatedLink,
  SeoRole,
  ServicePage,
  WorkPage,
} from "@/lib/seo/types";
export {
  getAllWorkPages,
  getWorkPage,
  workPages,
} from "@/lib/seo/workPages";
