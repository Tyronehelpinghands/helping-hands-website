import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SeoFaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import LocalSeoBlock from "@/components/seo/LocalSeoBlock";
import ProcessSteps from "@/components/seo/ProcessSteps";
import RelatedLinks from "@/components/seo/RelatedLinks";
import ReviewCta from "@/components/seo/ReviewCta";
import RoleGrid from "@/components/seo/RoleGrid";
import SeoCta from "@/components/seo/SeoCta";
import SeoHero from "@/components/seo/SeoHero";
import ServiceBenefits from "@/components/seo/ServiceBenefits";
import TrustSection from "@/components/seo/TrustSection";
import {
  buildPageMetadata,
  faqPageSchema,
  getAllServicePages,
  getServicePage,
  relatedForService,
  serviceSchema,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServicePages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    absoluteTitle: true,
  });
}

export default async function PersoneelInhurenServicePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Personeel inhuren", path: "/personeel-inhuren" },
          { name: page.title, path: page.path },
        ]}
      />
      <JsonLd
        data={[
          serviceSchema({
            name: page.title,
            description: page.metaDescription,
            path: page.path,
          }),
          faqPageSchema(page.faqs),
        ]}
      />

      <SeoHero
        eyebrow="Personeel inhuren"
        h1={page.h1}
        description={page.intro}
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-base leading-8 text-[#101828]/80">
          {page.intro}
        </p>
      </section>

      <ServiceBenefits items={page.services} />
      <RoleGrid roles={page.roles} />
      <TrustSection items={page.whyUs} />
      <ProcessSteps steps={page.processSteps} />
      <LocalSeoBlock serviceLabel={page.title.replace(" inhuren", "")} />
      <SeoFaqSection
        items={page.faqs}
        title={`Vragen over ${page.title.toLowerCase()}`}
      />
      <RelatedLinks links={relatedForService(page.slug)} />
      <SeoCta
        title={`${page.title} nodig?`}
        description="Deel datum, locatie, tijden, functies en aantal mensen. Wij denken mee over bezetting. Tarief op aanvraag."
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />
      <ReviewCta />
    </>
  );
}
