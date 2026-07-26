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
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import PageHero from "@/components/sections/PageHero";
import { overOnsCtaPhoto } from "@/lib/crewPhotos";
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

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Over ons",
  description:
    "Helping Hands Agency is in 2022 opgericht door Tyrone van der Schagt: professionele crew voor events en horeca, met een missie om jongeren een eerlijke kans te geven.",
  path: "/over-ons",
});

export default function OverOnsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Over ons", path: "/over-ons" },
        ]}
      />
      <PageHero content={getPageHeroContent("/over-ons")} />

      {/* Intro: tekst links, fotocollage rechts */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
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
      <section className="bg-[#F5F7FA] py-12 sm:py-16 lg:py-20">
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
                  <li
                    key={role}
                    className="flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-[#101828]/85 shadow-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F28C28]" />
                    {role}
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

      <OverOnsSplitSection
        eyebrow={overOnsApproach.eyebrow}
        title={overOnsApproach.title}
        paragraphs={overOnsApproach.paragraphs}
        photo={overOnsPhotos.approach}
        className="bg-white"
      />

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

      <OverOnsSplitSection
        eyebrow={overOnsClients.eyebrow}
        title={overOnsClients.title}
        paragraphs={overOnsClients.paragraphs}
        photo={overOnsPhotos.clients}
        reverse
        className="bg-white"
      />

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

      <section className="pb-6 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
              <p className="max-w-3xl text-lg leading-8 text-[#101828]/80">
                {overOnsClosing.paragraphs[0]}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
                >
                  Personeel aanvragen
                </Link>
                <Link
                  href="/diensten"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-8 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Bekijk diensten
                </Link>
                <Link
                  href="/vacatures"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-8 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Werken bij Helping Hands
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Samenwerken met Helping Hands?"
        description="Vraag crew aan of bekijk vacatures om mee te draaien op locatie."
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
