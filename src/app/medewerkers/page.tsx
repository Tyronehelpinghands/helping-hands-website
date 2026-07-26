import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { medewerkersFeatured, medewerkersGallery } from "@/lib/crewPhotos";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { applicationsEmail } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Medewerkers — werken als crew",
  description:
    "Crew aanmelden bij Helping Hands Agency: werken als event crew, stagehands, hospitality of horecapersoneel. Flexibele klussen, duidelijke briefing, doorgroeien.",
  path: "/medewerkers",
});

const whyWork = [
  "Duidelijke planning",
  "Heldere briefing",
  "Afwisselende opdrachten",
  "Doorgroeien naar teamcaptain",
  "Korte lijnen",
];

const expectations = [
  "Op tijd komen",
  "Afspraken nakomen",
  "Professioneel gedrag",
  "Duidelijke communicatie",
  "Inzet op locatie",
];

const roles = [
  "Event crew",
  "Horeca support",
  "Stagehands",
  "Productie assistentie",
  "Logistiek",
  "Teamcaptain",
];

export default function MedewerkersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Medewerkers", path: "/medewerkers" },
        ]}
      />
      <PageHero content={getPageHeroContent("/medewerkers")} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Werken in de crew: events, horeca en productie
          </h2>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Zoek je afwisselende klussen als event crew, stagehand, runner of in
            de horeca? Bij Helping Hands krijg je heldere planning en briefing —
            van festivalterrein tot restaurantvloer. Bekijk openstaande functies
            of meld je direct aan. Meer over hoe wij werken staat op{" "}
            <Link
              href="/over-ons"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              over ons
            </Link>{" "}
            en bij{" "}
            <Link
              href="/diensten"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              diensten
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/vacatures"
            className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
          >
            Bekijk vacatures
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-8 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
          >
            Aanmelden via contact
          </Link>
          <a
            href={`mailto:${applicationsEmail}`}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#F28C28] px-8 py-4 text-sm font-bold text-[#F28C28] transition hover:bg-[#FFF7ED]"
          >
            Mail {applicationsEmail}
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {medewerkersGallery.slice(0, 6).map((photo, index) => (
            <div
              key={photo.src}
              className={
                index === 0
                  ? "relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full lg:min-h-[28rem]"
                  : "relative aspect-[4/5] overflow-hidden rounded-2xl"
              }
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Waarom werken bij Helping Hands?
            </h2>
            <ul className="mt-6 space-y-3">
              {whyWork.map((item) => (
                <li key={item} className="flex gap-3 text-[#101828]/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-slate-200 shadow-lg lg:min-h-full">
            <Image
              src={medewerkersFeatured.src}
              alt={medewerkersFeatured.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Wat verwachten wij?
            </h2>
            <ul className="mt-6 space-y-3">
              {expectations.map((item) => (
                <li key={item} className="flex gap-3 text-[#101828]/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {medewerkersGallery.slice(6, 10).map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {medewerkersGallery.slice(10).map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black">
            Functies waarin je kunt werken
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 font-bold transition hover:border-[#F28C28]/40"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Klaar om mee te draaien op locatie?"
        description="Bekijk de openstaande functies of stuur direct je gegevens naar ons aanmeldingenteam."
        buttonLabel="Bekijk vacatures"
        buttonHref="/vacatures"
        secondaryLabel="Mail je aanmelding"
        secondaryHref={`mailto:${applicationsEmail}`}
      />
    </>
  );
}
