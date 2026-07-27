import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import OverOnsPhotoCollage from "@/components/over-ons/OverOnsPhotoCollage";
import OverOnsQuote from "@/components/over-ons/OverOnsQuote";
import OverOnsSplitSection from "@/components/over-ons/OverOnsSplitSection";
import OverOnsStats from "@/components/over-ons/OverOnsStats";
import OverOnsTimeline from "@/components/over-ons/OverOnsTimeline";
import Reveal from "@/components/over-ons/Reveal";
import FaqSection from "@/components/sections/FaqSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { overOnsCtaPhoto } from "@/lib/crewPhotos";
import { overOnsFaqs } from "@/lib/faq";
import {
  overOnsAmbition,
  overOnsApproach,
  overOnsClients,
  overOnsClosing,
  overOnsDevelopment,
  overOnsGrowth,
  overOnsIntro,
  overOnsPhotos,
  overOnsWhy,
} from "@/lib/overOnsContent";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Over ons",
  description:
    "Helping Hands Agency is in 2022 opgericht door Tyrone van der Schagt: professionele crew voor events en horeca, met een missie om jongeren een eerlijke kans te geven.",
  path: "/over-ons",
});

const pageAnchors = [
  { href: "#missie", label: "Missie" },
  { href: "#aanpak", label: "Aanpak" },
  { href: "#opdrachtgevers", label: "Opdrachtgevers" },
  { href: "#groei", label: "Groei" },
] as const;

export default function OverOnsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Over ons", path: "/over-ons" },
        ]}
      />
      <JsonLd data={faqJsonLd(overOnsFaqs)} />
      <PageHero content={getPageHeroContent("/over-ons")} />

      <nav
        aria-label="Op deze pagina"
        className="border-b border-slate-200/80 bg-white"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {pageAnchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {anchor.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Intro: tekst links, fotocollage rechts */}
      <section id="missie" className="scroll-mt-28 bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Wie wij zijn
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl lg:text-5xl">
                {overOnsIntro.title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-[#101828]/80 sm:text-lg">
                {overOnsIntro.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delayMs={80}>
              <OverOnsPhotoCollage photos={overOnsPhotos.collage} />
            </Reveal>
          </div>
        </div>
      </section>

      <OverOnsStats />

      {/* Waarom: foto links, tekst rechts */}
      <OverOnsSplitSection
        eyebrow={overOnsWhy.eyebrow}
        title={overOnsWhy.title}
        paragraphs={overOnsWhy.paragraphs}
        photo={overOnsPhotos.why}
        reverse
        className="bg-white"
      />

      {/* Groei: tekst links, brede projectfoto */}
      <section id="groei" className="scroll-mt-28 bg-[#F5F7FA] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                {overOnsGrowth.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
                {overOnsGrowth.title}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-[#101828]/80 sm:text-lg">
                {overOnsGrowth.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-[#0B1F4D]">
                Helping Hands levert onder andere
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {overOnsGrowth.roles.map((role) => (
                  <li key={role.label}>
                    <Link
                      href={role.href}
                      className="flex min-h-11 items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-[#101828]/85 shadow-sm transition hover:border-[#F28C28]/50 hover:text-[#173A8A]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                      {role.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delayMs={80}>
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-slate-200 shadow-xl lg:min-h-[26rem]">
                <Image
                  src={overOnsPhotos.growth.src}
                  alt={overOnsPhotos.growth.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <OverOnsTimeline />

      <div id="aanpak" className="scroll-mt-28">
        <OverOnsSplitSection
          eyebrow={overOnsApproach.eyebrow}
          title={overOnsApproach.title}
          paragraphs={overOnsApproach.paragraphs}
          photo={overOnsPhotos.approach}
          className="bg-white"
        />
      </div>

      <section className="bg-[#F5F7FA] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal delayMs={80} className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 shadow-xl sm:aspect-[5/4] lg:aspect-[4/5] lg:min-h-[28rem]">
                <Image
                  src={overOnsPhotos.development.src}
                  alt={overOnsPhotos.development.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                {overOnsDevelopment.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
                {overOnsDevelopment.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-[#101828]/80 sm:text-lg">
                {overOnsDevelopment.lead}
              </p>
              <p className="mt-6 text-sm font-bold text-[#0B1F4D]">
                Door te werken leren medewerkers onder andere:
              </p>
              <ul className="mt-4 space-y-2.5">
                {overOnsDevelopment.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex gap-3 text-sm leading-7 text-[#101828]/85 sm:text-base"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                    {skill}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-8 text-[#101828]/80">
                {overOnsDevelopment.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <div id="opdrachtgevers" className="scroll-mt-28">
        <OverOnsSplitSection
          eyebrow={overOnsClients.eyebrow}
          title={overOnsClients.title}
          paragraphs={overOnsClients.paragraphs}
          photo={overOnsPhotos.clients}
          reverse
          className="bg-white"
        />
      </div>

      {/* Mid-page CTA after clients */}
      <section className="border-y border-slate-200/80 bg-[#F5F7FA] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black text-[#0B1F4D]">
                Klaar om crew aan te vragen?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#101828]/70 sm:text-base">
                Deel datum, locatie, tijden en functies — of bekijk eerst welke
                diensten bij jouw productie passen. Hilversum · landelijk · één
                aanspreekpunt.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
              >
                Personeel aanvragen
              </Link>
              <Link
                href="/diensten"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Bekijk diensten
              </Link>
              <Link
                href="/vacatures"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Vacatures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ambition + banner */}
      <section className="relative overflow-hidden py-14 sm:py-20">
        <Image
          src={overOnsPhotos.ambition.src}
          alt={overOnsPhotos.ambition.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0B1F4D]/82" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {overOnsAmbition.eyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              {overOnsAmbition.title}
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-white/85 sm:text-lg">
              {overOnsAmbition.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <OverOnsQuote quote={overOnsClosing.quote} />

      <FaqSection
        items={overOnsFaqs}
        title="Veelgestelde vragen over Helping Hands"
        description="Missie, kwaliteit voor opdrachtgevers, projectervaring en hoe je start."
        className="bg-white py-16 sm:py-20"
      />

      <CTASection
        title="Samenwerken met Helping Hands?"
        description={overOnsClosing.paragraphs[0]}
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
        secondaryLabel="Werken bij Helping Hands"
        secondaryHref="/vacatures"
        backgroundImage={overOnsCtaPhoto.src}
        backgroundAlt={overOnsCtaPhoto.alt}
      />
    </>
  );
}
