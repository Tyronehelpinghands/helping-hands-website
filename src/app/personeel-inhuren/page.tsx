import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import SeoFaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";
import LocalSeoBlock from "@/components/seo/LocalSeoBlock";
import RelatedLinks from "@/components/seo/RelatedLinks";
import ReviewCta from "@/components/seo/ReviewCta";
import SeoCta from "@/components/seo/SeoCta";
import SeoHero from "@/components/seo/SeoHero";
import TrustSection from "@/components/seo/TrustSection";
import {
  buildPageMetadata,
  faqPageSchema,
  hubLocationLinks,
  hubServiceLinks,
  hubWorkLinks,
  personeelInhurenFaqs,
  serviceSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Personeel inhuren | Event, horeca & productie",
  description:
    "Personeel inhuren voor events, festivals, horeca, stagebouw en productie. Helping Hands Agency: snelle planning, duidelijke briefing, landelijk inzetbaar.",
  path: "/personeel-inhuren",
});

export default function PersoneelInhurenHubPage() {
  const services = hubServiceLinks();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Personeel inhuren", path: "/personeel-inhuren" },
        ]}
      />
      <JsonLd
        data={[
          serviceSchema({
            name: "Personeel inhuren",
            description:
              "Event crew, stagehands, horeca personeel en productiemedewerkers inhuren via Helping Hands Agency.",
            path: "/personeel-inhuren",
          }),
          faqPageSchema(personeelInhurenFaqs),
        ]}
      />

      <SeoHero
        eyebrow="Opdrachtgevers"
        h1="Personeel inhuren voor events, horeca en producties"
        description="Helping Hands Agency levert event crew, stagehands, horeca personeel, runners, keukenhulp en meer. Gevestigd in Hilversum, actief door heel Nederland. Deel je planning — wij bezetten met duidelijke briefing en één aanspreekpunt."
        primaryCta={{
          label: "Personeel aanvragen",
          href: "/contact?type=personeel-aanvragen",
        }}
        secondaryCta={{ label: "Bekijk diensten", href: "#diensten" }}
      />

      <section
        id="diensten"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Kies je personeelstype
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#101828]/75">
          Specifieke landingspagina&apos;s per functie — zo vind je sneller de
          juiste inzet voor jouw productie of locatie.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                className="flex min-h-14 items-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-[#173A8A] shadow-sm transition hover:border-[#F28C28]/50"
              >
                {service.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <TrustSection
        items={[
          "Snelle schakeling bij wijzigingen of spoed",
          "Duidelijke briefing en korte lijnen met planning",
          "Gemotiveerde crew met praktijkervaring",
          "Events, horeca, stagebouw, productie en logistiek",
          "Jongeren ontwikkelen via echte werkervaring",
          "Gevestigd in Hilversum — landelijk inzetbaar",
        ]}
      />

      <LocalSeoBlock />

      <RelatedLinks
        title="Werken bij Helping Hands"
        links={hubWorkLinks().slice(0, 6)}
      />
      <RelatedLinks title="Locaties" links={hubLocationLinks().slice(0, 8)} />

      <SeoFaqSection items={personeelInhurenFaqs} />

      <SeoCta
        title="Personeel nodig voor je volgende productie?"
        description="Deel datum, locatie, tijden, functies en aantallen. Wij denken mee over bezetting en briefing."
        primaryCta={{
          label: "Personeel aanvragen",
          href: "/contact?type=personeel-aanvragen",
        }}
        secondaryCta={{ label: "Naar opdrachtgevers", href: "/opdrachtgevers" }}
      />

      <ReviewCta />
    </>
  );
}
