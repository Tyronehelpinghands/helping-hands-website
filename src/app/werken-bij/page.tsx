import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SeoFaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import RelatedLinks from "@/components/seo/RelatedLinks";
import SeoCta from "@/components/seo/SeoCta";
import SeoHero from "@/components/seo/SeoHero";
import TrustSection from "@/components/seo/TrustSection";
import {
  buildPageMetadata,
  faqPageSchema,
  hubServiceLinks,
  hubWorkLinks,
  werkenBijFaqs,
} from "@/lib/seo";
import { applicationsEmail, hrEmail } from "@/lib/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Werken bij",
  description:
    "Werken bij Helping Hands Agency: event crew, stagehand of horeca bijbaan. Duidelijke planning, echte producties en doorgroeikansen.",
  path: "/werken-bij",
});

export default function WerkenBijPage() {
  const roles = hubWorkLinks();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Werken bij", path: "/werken-bij" },
        ]}
      />
      <JsonLd data={faqPageSchema(werkenBijFaqs)} />

      <SeoHero
        eyebrow="Crew & medewerkers"
        h1="Werken bij Helping Hands Agency"
        description="Werken in evenementen, als stagehand, met festival werk of een horeca bijbaan? Bij Helping Hands Agency bouw je ervaring op met duidelijke planning, eerlijke communicatie en begeleiding op locatie. Meld je aan en pak flexibele klussen mee."
        primaryCta={{
          label: "Meld je aan",
          href: "/contact?type=crew-aanmelden",
        }}
        secondaryCta={{ label: "Bekijk vacatures", href: "/vacatures" }}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Werken in evenementen — met structuur
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#101828]/75">
          Helping Hands Agency is in 2022 opgericht door Tyrone van der Schagt.
          Het doel: jongeren en jongvolwassenen die moeite hebben met werk
          vinden of weinig ervaring hebben, alsnog een eerlijke kans geven —
          met structuur, begeleiding en praktijkervaring op echte producties.
          Tegelijk blijven we betrouwbaar voor opdrachtgevers. Mail{" "}
          <a
            href={`mailto:${applicationsEmail}`}
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            {applicationsEmail}
          </a>{" "}
          of onze H&R-manager via{" "}
          <a
            href={`mailto:${hrEmail}`}
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            {hrEmail}
          </a>
          , of bekijk openstaande{" "}
          <Link
            href="/vacatures"
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            vacatures
          </Link>
          .
        </p>
      </section>

      <section className="bg-[#F5F7FA] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Werken als… kies je richting
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[#101828]/75">
            Van eventcrew vacature tot stagebouw werk en horeca bijbaan: bekijk
            per functie wat je doet, wat je leert en hoe je je aanmeldt.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <li key={role.href}>
                <Link
                  href={role.href}
                  className="flex min-h-14 items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-[#173A8A] shadow-sm transition hover:border-[#F28C28]/50"
                >
                  {role.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TrustSection
        title="Wat je mag verwachten"
        items={[
          "Duidelijke planning en call-times",
          "Eerlijke communicatie over shifts",
          "Begeleiding en briefing op locatie",
          "Kans om ervaring op te bouwen in events en horeca",
          "Doorgroeien naar teamcaptain",
          "Landelijke producties vanuit Hilversum",
        ]}
      />

      <RelatedLinks
        title="Voor opdrachtgevers"
        links={hubServiceLinks().slice(0, 6)}
      />

      <SeoFaqSection items={werkenBijFaqs} />

      <SeoCta
        title="Klaar om mee te draaien op producties?"
        description="Meld je aan met ervaring, woonplaats en beschikbaarheid. We nemen contact op zodra er een match is."
        primaryCta={{
          label: "Meld je aan als crew",
          href: "/contact?type=crew-aanmelden",
        }}
        secondaryCta={{ label: "Open vacatures", href: "/vacatures" }}
      />
    </>
  );
}
