import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/sections/FaqSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/sections/PageHero";
import {
  getPublishedServiceLandings,
  getServiceLanding,
  getServicesByFilter,
  type ServiceLandingSlug,
} from "@/lib/services";
import { buildPageMetadata, faqJsonLd, serviceJsonLd } from "@/lib/seo";

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

  const related = getServicesByFilter(landing.category).slice(0, 6);
  const otherLandings = getPublishedServiceLandings().filter(
    (item) => item.slug !== (slug as ServiceLandingSlug),
  );
  const interactiveCards =
    related.length > 0
      ? related.slice(0, 4).map((service) => ({
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
      <JsonLd data={faqJsonLd(landing.faqs)} />

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
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-3xl space-y-4 text-base leading-8 text-[#101828]/80">
            {landing.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
            <Image
              src={landing.image.src}
              alt={landing.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
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

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              {landing.typicalUse.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {landing.typicalUse.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-7 text-[#101828]/80 sm:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              {landing.alignment.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {landing.alignment.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-7 text-[#101828]/80 sm:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Functies binnen {landing.category}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
              Gerelateerde inzet in deze categorie. Voor het volledige
              functieoverzicht met filters ga je naar Alle diensten.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <Link
              href="/diensten#functies"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
            >
              Alle diensten filteren
            </Link>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <span className="font-semibold text-[#173A8A]">Ook relevant:</span>
          {otherLandings.map((item) => (
            <Link
              key={item.slug}
              href={item.path}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/diensten"
            className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
          >
            Overzicht diensten
          </Link>
        </div>
      </section>

      <FaqSection
        items={landing.faqs}
        title={`Vragen over ${landing.category.toLowerCase()}`}
        description="Antwoorden specifiek voor deze inzet — veilige, praktische informatie."
        className="border-t border-slate-200/80 bg-[#F5F7FA] py-16 sm:py-20"
      />

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
