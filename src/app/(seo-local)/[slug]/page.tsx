import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SeoFaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import LocalSeoBlock from "@/components/seo/LocalSeoBlock";
import ProcessSteps from "@/components/seo/ProcessSteps";
import RelatedLinks from "@/components/seo/RelatedLinks";
import ReviewCta from "@/components/seo/ReviewCta";
import SeoCta from "@/components/seo/SeoCta";
import SeoHero from "@/components/seo/SeoHero";
import ServiceBenefits from "@/components/seo/ServiceBenefits";
import TrustSection from "@/components/seo/TrustSection";
import {
  buildPageMetadata,
  faqPageSchema,
  getAllSeoLocationPages,
  getSeoLocationPage,
  getSeoLocationSlugs,
  locationServiceAreaSchema,
  relatedForLocation,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function isSitemapSlug(slug: string): boolean {
  return slug === "sitemap" || slug === "sitemap.xml" || slug === "sitemap.txt";
}

export function generateStaticParams() {
  return getSeoLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isSitemapSlug(slug)) {
    return {};
  }
  const page = getSeoLocationPage(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
  });
}

export default async function SeoLocationPage({ params }: PageProps) {
  const { slug } = await params;
  if (isSitemapSlug(slug)) {
    redirect("/sitemap.xml");
  }
  const page = getSeoLocationPage(slug);
  if (!page) notFound();

  const otherCities = getAllSeoLocationPages()
    .filter((item) => item.slug !== page.slug)
    .slice(0, 4);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Locaties", path: "/locaties" },
          { name: `${page.serviceLabel} ${page.city}`, path: page.path },
        ]}
      />
      <JsonLd
        data={[
          locationServiceAreaSchema({
            city: page.city,
            province: page.province,
            path: page.path,
            description: page.metaDescription,
            serviceName: page.serviceLabel,
          }),
          faqPageSchema(page.faqs),
        ]}
      />

      <SeoHero
        eyebrow={page.eyebrow}
        h1={page.h1}
        description={page.heroDescription}
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-base leading-8 text-[#101828]/80">
          {page.intro}
        </p>
      </section>

      <ServiceBenefits title="Sectoren in deze regio" items={page.sectors} />
      <ServiceBenefits title="Voorbeeldgebruik" items={page.examples} />
      <TrustSection items={page.whyUs} />
      <ProcessSteps steps={page.processSteps} />
      <LocalSeoBlock city={page.city} serviceLabel={page.serviceLabel} />

      {otherCities.length > 0 ? (
        <RelatedLinks
          title="Andere regio's"
          links={otherCities.map((item) => ({
            href: item.path,
            label: `${item.serviceLabel} ${item.city}`,
          }))}
        />
      ) : null}

      <SeoFaqSection
        items={page.faqs}
        title={`Vragen over ${page.serviceLabel.toLowerCase()} in ${page.city}`}
      />
      <RelatedLinks links={relatedForLocation(page.slug)} />
      <SeoCta
        title={`${page.serviceLabel} nodig in ${page.city}?`}
        description="Deel datum, locatie, tijden, functies en aantallen. Wij checken beschikbaarheid in de regio."
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />
      <ReviewCta />
    </>
  );
}
