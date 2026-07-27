import type { Metadata } from "next";
import Link from "next/link";
import MobileVacancyCta from "@/components/vacatures/MobileVacancyCta";
import VacanciesHero from "@/components/vacatures/VacanciesHero";
import VacancyApplicationSteps from "@/components/vacatures/VacancyApplicationSteps";
import VacancyCta from "@/components/vacatures/VacancyCta";
import VacancyExplorer from "@/components/vacatures/VacancyExplorer";
import VacancyFaq from "@/components/vacatures/VacancyFaq";
import VacancyGrowthPath from "@/components/vacatures/VacancyGrowthPath";
import VacancyMatchQuiz from "@/components/vacatures/VacancyMatchQuiz";
import VacancyTrustBar from "@/components/vacatures/VacancyTrustBar";
import RevealOnScroll from "@/components/RevealOnScroll";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import VacancyJobPostingsJsonLd from "@/components/seo/VacancyJobPostingsJsonLd";
import { vacancyFaqs } from "@/lib/vacancyFaq";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Vacatures event crew, horeca en stagebouw | Helping Hands Agency",
  description:
    "Bekijk vacatures bij Helping Hands Agency voor event crew, horeca, keuken, bar, stagebouw, productie en logistiek. Meld je aan en pak flexibele klussen mee.",
  path: "/vacatures",
  absoluteTitle: true,
});

export default function VacaturesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Vacatures", path: "/vacatures" },
        ]}
      />
      <VacancyJobPostingsJsonLd />
      <JsonLd data={faqJsonLd(vacancyFaqs)} />

      <VacanciesHero />
      <VacancyTrustBar />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
                Werken in de evenementen — met structuur
              </h2>
              <p className="mt-4 text-base leading-8 text-[#101828]/75">
                Helping Hands Agency is in 2022 opgericht door Tyrone van der
                Schagt. We leveren betrouwbare crew voor events en horeca, en
                geven tegelijk mensen die moeilijk werk vinden of weinig ervaring
                hebben een eerlijke kans om te groeien. Lees meer op{" "}
                <Link
                  href="/over-ons"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  over ons
                </Link>
                , bekijk{" "}
                <Link
                  href="/diensten"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  diensten
                </Link>
                , of zie hoe werken bij ons voelt via{" "}
                <Link
                  href="/medewerkers"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  medewerkers
                </Link>
                .
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <VacancyMatchQuiz />
      <VacancyExplorer />
      <VacancyApplicationSteps />
      <VacancyGrowthPath />
      <VacancyFaq items={vacancyFaqs} />
      <VacancyCta />
      <MobileVacancyCta />
    </>
  );
}
