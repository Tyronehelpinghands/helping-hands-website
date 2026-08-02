import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SeoFaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import ProcessSteps from "@/components/seo/ProcessSteps";
import RelatedLinks from "@/components/seo/RelatedLinks";
import SeoCta from "@/components/seo/SeoCta";
import SeoHero from "@/components/seo/SeoHero";
import ServiceBenefits from "@/components/seo/ServiceBenefits";
import TrustSection from "@/components/seo/TrustSection";
import {
  buildPageMetadata,
  faqPageSchema,
  getAllWorkPages,
  getServicePage,
  getWorkPage,
  relatedForWork,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const applySteps = [
  {
    title: "Aanmelden",
    description:
      "Mail aanmeldingen@helpinghandsagency.nl of gebruik het formulier op contact.",
  },
  {
    title: "Kennismaken",
    description: "We kijken naar ervaring, beschikbaarheid en voorkeuren.",
  },
  {
    title: "Briefing",
    description: "Bij een match ontvang je duidelijke info over shift en taken.",
  },
  {
    title: "Aan de slag",
    description: "Je werkt op locatie met begeleiding en een aanspreekpunt.",
  },
  {
    title: "Doorgroeien",
    description: "Meer shifts en verantwoordelijkheid naarmate je groeit.",
  },
];

export function generateStaticParams() {
  return getAllWorkPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getWorkPage(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    absoluteTitle: true,
  });
}

export default async function WerkenAlsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getWorkPage(slug);
  if (!page) notFound();

  const relatedService = getServicePage(page.relatedServiceSlug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Werken bij", path: "/werken-bij" },
          { name: page.title, path: page.path },
        ]}
      />
      {/* JobPosting alleen op echte vacaturedetailpagina's — niet op werken-als hubs. */}
      <JsonLd data={faqPageSchema(page.faqs)} />

      <SeoHero
        eyebrow="Werken als"
        h1={page.h1}
        description={page.intro}
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-base leading-8 text-[#101828]/80">
          {page.intro}
        </p>
        {relatedService ? (
          <p className="mt-4 text-sm text-[#101828]/70">
            Opdrachtgevers huren deze rol in via{" "}
            <a
              href={relatedService.path}
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              {relatedService.title}
            </a>
            .
          </p>
        ) : null}
      </section>

      <ServiceBenefits title="Werkzaamheden" items={page.duties} />
      <ServiceBenefits title="Wat je leert" items={page.learn} />
      <ServiceBenefits title="Wat we verwachten" items={page.expect} />
      <ServiceBenefits title="Doorgroeimogelijkheden" items={page.growth} />
      <TrustSection title="Waarom werken via Helping Hands?" items={page.whyUs} />
      <ProcessSteps title="Zo werkt aanmelden" steps={applySteps} />
      <SeoFaqSection items={page.faqs} title={`Vragen over ${page.title.toLowerCase()}`} />
      <RelatedLinks links={relatedForWork(page.slug)} />
      <SeoCta
        title={`Klaar om te starten als ${page.h1.replace("Werken als ", "").toLowerCase()}?`}
        description="Meld je aan met ervaring, woonplaats en beschikbaarheid."
        primaryCta={page.ctaPrimary}
        secondaryCta={page.ctaSecondary}
      />
    </>
  );
}
