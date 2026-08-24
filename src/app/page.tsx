import type { Metadata } from "next";
import Link from "next/link";
import AudienceToggle from "@/components/AudienceToggle";
import CTASection from "@/components/CTASection";
import DeploymentCards from "@/components/DeploymentCards";
import LogoCarousel from "@/components/LogoCarousel";
import ProcessAccordion from "@/components/ProcessAccordion";
import QuickRequestForm from "@/components/QuickRequestForm";
import RevealOnScroll from "@/components/RevealOnScroll";
import FaqSection from "@/components/sections/FaqSection";
import HomeCrewBento from "@/components/sections/HomeCrewBento";
import PageHero from "@/components/sections/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import TrustBar from "@/components/sections/TrustBar";
import WhyHelpingHands from "@/components/sections/WhyHelpingHands";
import GoogleBusinessCta from "@/components/seo/GoogleBusinessCta";
import JsonLd from "@/components/seo/JsonLd";
import { ctaBackgroundPhoto, homeCrewBento } from "@/lib/crewPhotos";
import { homeFaqs } from "@/lib/faq";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: `Event crew inhuren | ${siteConfig.name} Hilversum`,
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

      <RevealOnScroll delayMs={60} variant="fade">
        <LogoCarousel />
      </RevealOnScroll>

      <section className="border-y border-[#0B1F4D]/08 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Direct naar
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#173A8A] sm:text-base">
              {[
                { href: "/personeel-inhuren", label: "Personeel inhuren" },
                { href: "/werken-bij", label: "Werken bij" },
                { href: "/vacatures", label: "Vacatures" },
                { href: "/opdrachtgevers", label: "Opdrachtgevers" },
                { href: "/over-ons", label: "Over ons" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="underline-offset-4 transition hover:text-[#0B1F4D] hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-10 sm:py-14">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 50% 40% at 0% 60%, rgba(23,58,138,0.06), transparent), radial-gradient(ellipse 40% 35% at 100% 20%, rgba(242,140,40,0.07), transparent)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Op locatie
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0B1F4D] sm:text-3xl">
                Onze crew in actie
              </h2>
              <p className="mt-3 text-base leading-7 text-[#101828]/70">
                Eigen crew op locatie — festivals, stadions, scaffolding en horeca.
                Geen stockfoto&apos;s.
              </p>
            </div>
          </RevealOnScroll>
          <HomeCrewBento photos={homeCrewBento} />
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Diensten
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl lg:text-5xl">
                Crew en ondersteuning voor elke fase van je productie.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#101828]/75 sm:text-lg">
                Event crew, stagehands, horeca-, keuken- en barpersoneel, productie,
                logistiek en hospitality — filter hieronder of ga direct naar{" "}
                <Link
                  href="/personeel-inhuren/event-crew"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  event crew
                </Link>
                ,{" "}
                <Link
                  href="/personeel-inhuren/stagehands"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  stagehands
                </Link>{" "}
                of{" "}
                <Link
                  href="/personeel-inhuren/horeca-personeel"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  horeca personeel
                </Link>
                .
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/personeel-inhuren"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
                >
                  Personeel inhuren
                </Link>
                <Link
                  href="/personeel-inhuren/event-crew"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Event crew
                </Link>
                <Link
                  href="/personeel-inhuren/stagehands"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Stagehands
                </Link>
                <Link
                  href="/personeel-inhuren/horeca-personeel"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] bg-white px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
                >
                  Horeca
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="scale" className="mt-12 sm:mt-16">
            <ServicesSection />
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-dark py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll variant="left">
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
          </RevealOnScroll>

          <DeploymentCards />
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(23,58,138,0.08), transparent), radial-gradient(ellipse 40% 30% at 90% 80%, rgba(242,140,40,0.08), transparent)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Werkwijze
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
                Zo werken wij
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#101828]/70">
                Van aanvraag tot afhandeling: vijf concrete stappen voor planning,
                briefing en uitvoering — zodat jij weet wat er gebeurt en wie wat
                doet.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120} variant="scale" className="mt-16">
            <ProcessAccordion />
          </RevealOnScroll>
        </div>
      </section>

      <RevealOnScroll variant="up">
        <WhyHelpingHands />
      </RevealOnScroll>

      <section className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Voor iedereen in de keten
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
                Voor elke productie de juiste handen.
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="scale" className="mt-14">
            <AudienceToggle />
          </RevealOnScroll>
        </div>
      </section>

      <RevealOnScroll variant="up">
        <QuickRequestForm />
      </RevealOnScroll>

      <RevealOnScroll delayMs={40}>
        <FaqSection items={homeFaqs} />
      </RevealOnScroll>

      <RevealOnScroll variant="fade">
        <CTASection
          title="Personeel nodig voor je volgende productie?"
          description="Stuur je datum, locatie, tijden, functies en aantal mensen door. Wij denken mee over de planning en bezetting. Tarief op aanvraag."
          buttonLabel="Contact — personeel aanvragen"
          buttonHref="/contact"
          secondaryLabel="Personeel inhuren"
          secondaryHref="/personeel-inhuren"
          backgroundImage={ctaBackgroundPhoto.src}
          backgroundAlt={ctaBackgroundPhoto.alt}
        />
      </RevealOnScroll>

      <GoogleBusinessCta />
    </>
  );
}
