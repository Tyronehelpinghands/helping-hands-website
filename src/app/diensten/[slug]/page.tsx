import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/sections/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import {
  getPublishedServiceLandings,
  getServiceLanding,
  getServicesByFilter,
  type ServiceLandingSlug,
} from "@/lib/services";
import { buildPageMetadata, serviceJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedServiceLandings().map((landing) => ({
    slug: landing.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const landing = getServiceLanding(slug);
  if (!landing?.published) {
    return {};
  }

  return buildPageMetadata({
    title: landing.title,
    description: landing.description,
    path: landing.path,
  });
}

export default async function ServiceLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const landing = getServiceLanding(slug);

  if (!landing?.published) {
    notFound();
  }

  const related = getServicesByFilter(landing.category).slice(0, 4);
  const interactiveCards =
    related.length > 0
      ? related.map((service) => ({
          title: service.title,
          description: service.shortDescription,
          tag: service.category,
        }))
      : landing.bullets.slice(0, 4).map((bullet) => ({
          title: landing.category,
          description: bullet,
          tag: "Inzet",
        }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
          { name: landing.title, path: landing.path },
        ]}
      />
      <JsonLd
        data={serviceJsonLd({
          name: landing.title,
          description: landing.description,
          path: landing.path,
        })}
      />

      <PageHero
        content={{
          eyebrow: "Dienst",
          title: landing.h1,
          description: landing.description,
          theme: "diensten",
          primaryCta: { label: "Personeel aanvragen", href: "/contact" },
          secondaryCta: { label: "Alle diensten", href: "/diensten" },
          highlights: landing.bullets.slice(0, 4).map((label) => ({ label })),
          interactiveCards,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl space-y-4 text-base leading-8 text-[#101828]/80">
          {landing.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {landing.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA] px-4 py-3 text-sm font-semibold text-[#0B1F4D]"
            >
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]"
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>

        {related.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Gerelateerde inzet in {landing.category}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
              Bekijk concrete functies binnen deze categorie, of filter verder op
              de dienstenpagina.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {related.map((service) => (
                <li
                  key={service.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                    {service.category}
                  </p>
                  <p className="mt-2 font-bold text-[#0B1F4D]">{service.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                    {service.shortDescription}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-14">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Alle diensten filteren
          </h2>
          <div className="mt-8">
            <ServicesSection showAllWhenAlle />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <span className="font-semibold text-[#173A8A]">Ook relevant:</span>
          {getPublishedServiceLandings()
            .filter((item) => item.slug !== (slug as ServiceLandingSlug))
            .map((item) => (
              <Link
                key={item.slug}
                href={item.path}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
              >
                {item.title}
              </Link>
            ))}
          <Link
            href="/diensten"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
          >
            Overzicht diensten
          </Link>
        </div>
      </section>

      <CTASection
        title="Deze crew nodig voor jouw productie?"
        description="Deel datum, locatie, tijden, functies en aantal mensen. Wij denken mee over bezetting en briefing."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
        secondaryLabel="Bekijk vacatures"
        secondaryHref="/vacatures"
      />
    </>
  );
}
