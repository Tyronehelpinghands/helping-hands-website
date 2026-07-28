import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RegionalCTA from "@/components/sections/RegionalCTA";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import { getLocationBySlug } from "@/data/locations";
import { getAllProjectCases, getProjectCaseBySlug } from "@/data/projectCases";
import { projectExperienceDisclaimer } from "@/lib/projectLogos";
import { getServiceLanding } from "@/lib/services";
import {
  buildPageMetadata,
  organizationJsonLd,
  projectCaseCreativeWorkJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const engagementLabels: Record<string, string> = {
  "directe opdrachtgever": "Directe opdrachtgever",
  productiepartner: "Via productiepartner",
  locatie: "Locatie",
  evenement: "Evenement",
};

export function generateStaticParams() {
  return getAllProjectCases().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getProjectCaseBySlug(slug);
  if (!item) return {};

  return buildPageMetadata({
    title: item.metaTitle,
    description: item.metaDescription,
    path: `/projecten/${item.slug}`,
  });
}

export default async function ProjectCasePage({ params }: PageProps) {
  const { slug } = await params;
  const item = getProjectCaseBySlug(slug);

  if (!item) {
    notFound();
  }

  const relatedServices = item.relatedServiceSlugs
    .map((serviceSlug) => getServiceLanding(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const relatedLocations = item.relatedLocationSlugs
    .map((locationSlug) => getLocationBySlug(locationSlug))
    .filter((location): location is NonNullable<typeof location> => Boolean(location));

  const otherCases = getAllProjectCases()
    .filter((c) => c.slug !== item.slug)
    .slice(0, 4);

  const infoRows: { label: string; value: string }[] = [
    { label: "Locatie", value: item.location },
    { label: "Type locatie", value: item.venueType },
    { label: "Type inzet", value: engagementLabels[item.engagementType] },
  ];
  if (item.eventType) infoRows.push({ label: "Type evenement", value: item.eventType });
  if (item.date) infoRows.push({ label: "Periode", value: item.date });
  if (item.employeeCount != null) {
    infoRows.push({ label: "Aantal medewerkers", value: String(item.employeeCount) });
  }
  if (item.duration) infoRows.push({ label: "Duur", value: item.duration });

  const path = `/projecten/${item.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projecten", path: "/projecten" },
          { name: item.name, path },
        ]}
      />
      <JsonLd
        data={[
          projectCaseCreativeWorkJsonLd({
            name: item.name,
            description: item.metaDescription,
            path,
            city: item.city,
            images: item.images.map((image) => image.src),
          }),
          organizationJsonLd(),
        ]}
      />

      <PageHero
        content={{
          eyebrow: `Projectervaring · ${item.city}`,
          title: item.name,
          description: item.summary,
          theme: "projecten",
          primaryCta: { label: "Personeel aanvragen", href: "/contact" },
          secondaryCta: { label: "Alle projecten", href: "/projecten" },
          highlights: infoRows.slice(0, 4).map((row) => ({ label: row.value })),
          interactiveCards: item.functions.map((fn) => ({
            title: fn,
            description: `Type inzet dat aansluit bij producties zoals bij ${item.location}.`,
          })),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-2xl border border-[#F28C28]/25 bg-[#F28C28]/5 px-5 py-4 text-sm leading-6 text-[#0B1F4D]">
          <strong className="font-bold">{engagementLabels[item.engagementType]}:</strong>{" "}
          {item.engagementNote}
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-3xl space-y-6">
            <p className="text-base leading-8 text-[#101828]/80">{item.summary}</p>

            {item.functions.length > 0 ? (
              <div>
                <h2 className="text-xl font-black text-[#0B1F4D]">
                  Functies bij dit type inzet
                </h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {item.functions.map((fn) => (
                    <li
                      key={fn}
                      className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA] px-4 py-3 text-sm font-semibold text-[#0B1F4D]"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                      {fn}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.activities.length > 0 ? (
              <div>
                <h2 className="text-xl font-black text-[#0B1F4D]">
                  Praktische werkzaamheden
                </h2>
                <ul className="mt-4 space-y-3">
                  {item.activities.map((activity) => (
                    <li
                      key={activity}
                      className="flex gap-3 text-sm leading-7 text-[#101828]/80 sm:text-base"
                    >
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {item.challenge ? (
              <div>
                <h2 className="text-xl font-black text-[#0B1F4D]">Uitdaging</h2>
                <p className="mt-3 text-sm leading-7 text-[#101828]/80 sm:text-base">
                  {item.challenge}
                </p>
              </div>
            ) : null}

            {item.solution ? (
              <div>
                <h2 className="text-xl font-black text-[#0B1F4D]">Aanpak</h2>
                <p className="mt-3 text-sm leading-7 text-[#101828]/80 sm:text-base">
                  {item.solution}
                </p>
              </div>
            ) : null}

            {item.result ? (
              <div>
                <h2 className="text-xl font-black text-[#0B1F4D]">Resultaat</h2>
                <p className="mt-3 text-sm leading-7 text-[#101828]/80 sm:text-base">
                  {item.result}
                </p>
              </div>
            ) : null}

            {item.testimonial ? (
              <blockquote className="rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6">
                <p className="text-base font-semibold leading-7 text-[#0B1F4D]">
                  “{item.testimonial.quote}”
                </p>
                <footer className="mt-3 text-sm text-[#101828]/60">
                  {item.testimonial.author}
                  {item.testimonial.role ? ` — ${item.testimonial.role}` : ""}
                </footer>
              </blockquote>
            ) : null}
          </div>

          <div className="space-y-6">
            {item.images.length > 0 ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg">
                <Image
                  src={item.images[0].src}
                  alt={item.images[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain bg-white p-8"
                />
              </div>
            ) : null}

            <dl className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 text-sm last:border-0"
                >
                  <dt className="font-bold text-[#0B1F4D]">{row.label}</dt>
                  <dd className="text-right text-[#101828]/70">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
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
                      {service.title}
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

        {relatedLocations.length > 0 ? (
          <div className="mt-14">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Meer over inzet in {item.city}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {relatedLocations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={location.path}
                    className="block h-full rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                      {location.province}
                    </p>
                    <p className="mt-2 font-bold text-[#0B1F4D]">
                      {location.h1}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 text-sm">
          <span className="font-semibold text-[#173A8A]">Meer projectervaring:</span>
          {otherCases.map((c) => (
            <Link
              key={c.slug}
              href={`/projecten/${c.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/projecten"
            className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
          >
            Alle projecten
          </Link>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-6 text-[#101828]/50">
          {projectExperienceDisclaimer}
        </p>
      </section>

      <RegionalCTA city={item.city} serviceLabel="crew" />
    </>
  );
}
