import type { Metadata } from "next";
import Link from "next/link";
import EmployeeAudience from "@/components/medewerkers/EmployeeAudience";
import EmployeeBenefits from "@/components/medewerkers/EmployeeBenefits";
import EmployeeCrewCollage from "@/components/medewerkers/EmployeeCrewCollage";
import EmployeeCta from "@/components/medewerkers/EmployeeCta";
import EmployeeExpectations from "@/components/medewerkers/EmployeeExpectations";
import EmployeeFaq from "@/components/medewerkers/EmployeeFaq";
import EmployeeGrowthPath from "@/components/medewerkers/EmployeeGrowthPath";
import EmployeeHero from "@/components/medewerkers/EmployeeHero";
import EmployeeRoles from "@/components/medewerkers/EmployeeRoles";
import EmployeeSteps from "@/components/medewerkers/EmployeeSteps";
import MobileEmployeeCta from "@/components/medewerkers/MobileEmployeeCta";
import RevealOnScroll from "@/components/RevealOnScroll";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import { employeeFaqs } from "@/lib/employeePage";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Werken bij Helping Hands Agency | Event crew, horeca en stagebouw",
  description:
    "Wil je werken op events, horeca, stagebouw, productie of logistiek? Meld je aan als crewlid bij Helping Hands Agency en bouw ervaring op met duidelijke planning en begeleiding.",
  path: "/medewerkers",
});

export default function MedewerkersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Medewerkers", path: "/medewerkers" },
        ]}
      />
      <JsonLd data={faqJsonLd(employeeFaqs)} />

      <EmployeeHero />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
                Kansen, structuur en echte producties
              </h2>
              <p className="mt-4 text-base leading-8 text-[#101828]/75">
                Helping Hands Agency is in 2022 opgericht door Tyrone van der
                Schagt. Het doel: jongeren en jongvolwassenen die moeite hebben
                met werk vinden, weinig ervaring hebben of niet op de juiste plek
                zitten, alsnog een eerlijke kans geven — met structuur,
                begeleiding en praktijkervaring. Tegelijk blijven we
                professioneel en betrouwbaar voor opdrachtgevers. Meer over onze
                missie staat op{" "}
                <Link
                  href="/over-ons"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  over ons
                </Link>
                . Bekijk wat we doen via{" "}
                <Link
                  href="/diensten"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  diensten
                </Link>
                , openstaande functies op{" "}
                <Link
                  href="/vacatures"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  vacatures
                </Link>
                , of stuur je aanmelding via{" "}
                <Link
                  href="/contact"
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  contact
                </Link>
                .
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <EmployeeCrewCollage />
      <EmployeeBenefits />
      <EmployeeRoles />
      <EmployeeCta variant="mid" />
      <EmployeeSteps />
      <EmployeeGrowthPath />
      <EmployeeAudience />
      <EmployeeExpectations />
      <EmployeeFaq items={employeeFaqs} />
      <EmployeeCta variant="end" />
      <MobileEmployeeCta />
    </>
  );
}
