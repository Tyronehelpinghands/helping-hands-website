export type SeoFaq = { question: string; answer: string };

export type SeoCta = { label: string; href: string };

export type SeoRelatedLink = { href: string; label: string };

export type SeoRole = { title: string; description: string };

export type SeoProcessStep = { title: string; description: string };

export type ServicePage = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  targetKeywords: string[];
  services: string[];
  whyUs: string[];
  processSteps: SeoProcessStep[];
  roles: SeoRole[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
  relatedPages: SeoRelatedLink[];
  /**
   * Keyword-synonym of another URL. Google should index `canonicalPath`, not this path.
   * Omit from the sitemap when set.
   */
  canonicalPath?: string;
};

export type WorkPage = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  duties: string[];
  learn: string[];
  expect: string[];
  growth: string[];
  whyUs: string[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
  relatedServiceSlug: string;
};

export type SeoLocationPage = {
  slug: string;
  path: string;
  city: string;
  province: string;
  serviceSlug: string;
  serviceLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  intro: string;
  sectors: string[];
  examples: string[];
  whyUs: string[];
  processSteps: SeoProcessStep[];
  faqs: SeoFaq[];
  ctaPrimary: SeoCta;
  ctaSecondary: SeoCta;
};
