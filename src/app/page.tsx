import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AudienceToggle from "@/components/AudienceToggle";
import CTASection from "@/components/CTASection";
import DeploymentCards from "@/components/DeploymentCards";
import LogoCarousel from "@/components/LogoCarousel";
import ProcessAccordion from "@/components/ProcessAccordion";
import QuickRequestForm from "@/components/QuickRequestForm";
import RevealOnScroll from "@/components/RevealOnScroll";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import ProjectExperienceTeaser from "@/components/sections/ProjectExperienceTeaser";
import ServicesSection from "@/components/sections/ServicesSection";
import TrustBar from "@/components/sections/TrustBar";
import WhyHelpingHands from "@/components/sections/WhyHelpingHands";
import JsonLd from "@/components/seo/JsonLd";
import SectorCards from "@/components/SectorCards";
import { ctaBackgroundPhoto, homeCrewStrip } from "@/lib/crewPhotos";
import { homeFaqs } from "@/lib/faq";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `${siteConfig.name} | Crew voor evenementen, horeca en productie`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <PageHero content={getPageHeroContent("/")} />
      <RevealOnScroll>
        <TrustBar />
      </RevealOnScroll>

      <RevealOnScroll>
        <SectorCards />
      </RevealOnScroll>

      <RevealOnScroll>
        <LogoCarousel />
      </RevealOnScroll>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Op locatie
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
              Onze crew in actie
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
            {homeCrewStrip.map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Diensten
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl lg:text-5xl">
              Crew en ondersteuning voor elke fase van je productie.
            </h2>
            <p className="mt-5 text-base leading-8 text-[#101828]/75 sm:text-lg">
              Event crew inhuren, stagehands, horeca personeel, restaurant- en
              keukenpersoneel, bar, productie, logistiek en hospitality — Helping
              Hands levert praktische mensen die direct begrijpen wat er op locatie
              nodig is.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/diensten"
                className="inline-flex items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
              >
                Bekijk alle diensten
              </Link>
              <Link
                href="/diensten/event-crew"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Event crew
              </Link>
              <Link
                href="/diensten/stagehands"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Stagehands
              </Link>
              <Link
                href="/diensten/horeca-personeel"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Horeca
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#F28C28] bg-white px-7 py-3.5 text-sm font-bold text-[#F28C28] transition hover:bg-[#FFF7ED]"
              >
                Personeel aanvragen
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-16">
            <ServicesSection />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Voor iedereen in de keten
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Voor elke productie de juiste handen.
            </h2>
          </div>

          <div className="mt-14">
            <AudienceToggle />
          </div>
        </div>
      </section>

      <ProjectExperienceTeaser />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Werkwijze
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Zo werken wij
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#101828]/70">
              Van aanvraag tot afhandeling: een helder proces voor crew,
              briefing en uitvoering op locatie.
            </p>
          </div>

          <div className="mt-16">
            <ProcessAccordion />
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <WhyHelpingHands />
      </RevealOnScroll>

      <section className="section-dark py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Sectoren
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Waar wij worden ingezet
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Van festivalterrein tot stadionproductie: wij leveren praktische
              ondersteuning op locaties waar timing en communicatie belangrijk
              zijn.
            </p>
          </div>

          <DeploymentCards />
        </div>
      </section>

      <QuickRequestForm />

      <RevealOnScroll>
        <FaqSection items={homeFaqs} />
      </RevealOnScroll>

      <CTASection
        title="Personeel nodig voor je volgende productie?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door. Wij denken mee over de planning en bezetting."
        buttonLabel="Vraag direct personeel aan"
        buttonHref="/contact"
        secondaryLabel="Bekijk vacatures"
        secondaryHref="/vacatures"
        backgroundImage={ctaBackgroundPhoto.src}
        backgroundAlt={ctaBackgroundPhoto.alt}
      />
    </>
  );
}
