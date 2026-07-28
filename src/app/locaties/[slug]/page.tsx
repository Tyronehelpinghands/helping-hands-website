import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RegionalCTA from "@/components/sections/RegionalCTA";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import { getAllLocations, getLocationBySlug } from "@/data/locations";
import { getAllProjectCases } from "@/data/projectCases";
import { getServiceLanding } from "@/lib/services";
import {
  buildPageMetadata,
  faqJsonLd,
  locationEmploymentAgencyJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllLocations().map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};

  return buildPageMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    path: location.path,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const relatedServices = location.relatedServiceSlugs
    .map((serviceSlug) => getServiceLanding(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const allCases = getAllProjectCases();
  const relatedCases = location.relatedProjectCaseSlugs
    .map((caseSlug) => allCases.find((item) => item.slug === caseSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const otherLocations = getAllLocations()
    .filter((item) => item.slug !== location.slug)
    .slice(0, 4);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Locaties", path: "/locaties" },
          { name: location.city, path: location.path },
        ]}
      />
      <JsonLd
        data={locationEmploymentAgencyJsonLd({
          city: location.city,
          province: location.province,
          path: location.path,
          description: location.metaDescription,
        })}
      />
      <JsonLd data={faqJsonLd(location.faqs)} />

      <PageHero
        content={{
          eyebrow: location.eyebrow,
          title: location.h1,
          description: location.heroDescription,
          theme: "diensten",
          primaryCta: { label: "Personeel aanvragen", href: "/contact" },
          secondaryCta: { label: "Alle locaties", href: "/locaties" },
          highlights: location.staffTypes.slice(0, 4).map((type) => ({
            label: type.title,
          })),
          interactiveCards: location.staffTypes.map((type) => ({
            title: type.title,
            description: type.description,
          })),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-3xl space-y-4 text-base leading-8 text-[#101828]/80">
            {location.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
            <Image
              src={location.image.src}
              alt={location.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Typische toepassingen in {location.city}
            </h2>
            <ul className="mt-5 space-y-3">
              {location.applications.map((item) => (
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
              Waarom Helping Hands in {location.city}
            </h2>
            <ul className="mt-5 space-y-3">
              {location.whyHelpingHands.map((item) => (
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

        <div className="mt-14">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Zo werkt een aanvraag
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {location.process.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-slate-200/80 bg-[#F5F7FA] p-5"
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  Stap {index + 1}
                </p>
                <p className="mt-2 font-bold text-[#0B1F4D]">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Voorbeeldlocaties en type evenementen
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
            Illustratief voor het type inzet in {location.city} — geen
            exhaustieve of exclusieve lijst.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {location.venues.map((venue) => (
              <li
                key={venue}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#173A8A]"
              >
                {venue}
              </li>
            ))}
          </ul>
        </div>

        {relatedServices.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Gerelateerde diensten
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.path}
                    className="block h-full rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                      {service.category}
                    </p>
                    <p className="mt-2 font-bold text-[#0B1F4D]">
                      {service.title} in {location.city}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                      {service.hubSummary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {relatedCases.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Voorbeelden uit onze projectervaring
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
              Een greep uit locaties en producties waar onze crew via
              opdrachten, partners en producties ervaring heeft opgedaan.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {relatedCases.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/projecten/${item.slug}`}
                    className="block h-full rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                      {item.venueType}
                    </p>
                    <p className="mt-2 font-bold text-[#0B1F4D]">
                      {item.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                      Bekijk projectervaring →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <span className="font-semibold text-[#173A8A]">Ook interessant:</span>
          {otherLocations.map((item) => (
            <Link
              key={item.slug}
              href={item.path}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {item.city}
            </Link>
          ))}
          <Link
            href="/locaties"
            className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
          >
            Alle locaties
          </Link>
        </div>
      </section>

      <FaqSection
        items={location.faqs}
        title={`Vragen over inzet in ${location.city}`}
        description="Praktische antwoorden over aanvragen, bezetting en briefing in deze regio."
        className="border-t border-slate-200/80 bg-[#F5F7FA] py-16 sm:py-20"
      />

      <RegionalCTA city={location.city} serviceLabel={location.eyebrow.split(" ·")[0].toLowerCase()} />
    </>
  );
}
