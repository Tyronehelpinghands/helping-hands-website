import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import ReviewCta from "@/components/seo/ReviewCta";
import {
  buildPageMetadata,
  faqJsonLd,
  getAllSeoLocationPages,
  locationsItemListJsonLd,
} from "@/lib/seo";

const title = "Locaties en werkgebieden | Helping Hands Agency";
const description =
  "Helping Hands Agency levert event crew, stagehands en horecapersoneel door heel Nederland. Bekijk onze werkgebieden per stad en regio.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/locaties",
  absoluteTitle: true,
});

const locationsFaqs = [
  {
    question: "Werkt Helping Hands Agency alleen in de genoemde steden?",
    answer:
      "Nee. Deze pagina's beschrijven onze belangrijkste werkgebieden, maar we zijn landelijk actief vanuit onze vestiging in Hilversum — ook buiten deze steden kun je personeel aanvragen.",
  },
  {
    question: "Hebben jullie kantoren in elke stad?",
    answer:
      "Nee. Ons kantoor zit aan Wandelpad 30 in Hilversum. Elders leveren we personeel op locatie — zonder nepvestigingsclaims.",
  },
  {
    question: "Hoe kies ik de juiste locatiepagina voor mijn aanvraag?",
    answer:
      "Kies de stad/dienst die het dichtst bij jouw evenement ligt. Staat jouw stad er niet tussen? Vraag aan via contact — we bezetten landelijk.",
  },
  {
    question: "Hoe vraag ik personeel aan voor een specifieke stad?",
    answer:
      "Gebruik het contactformulier en vermeld de stad, locatie, datum, tijden, functies en aantal mensen.",
  },
];

export default function LocatiesOverviewPage() {
  const locations = getAllSeoLocationPages();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Locaties", path: "/locaties" },
        ]}
      />
      <JsonLd
        data={locationsItemListJsonLd(
          locations.map((location) => ({
            name: `${location.serviceLabel} ${location.city}`,
            path: location.path,
          })),
        )}
      />
      <JsonLd data={faqJsonLd(locationsFaqs)} />

      <PageHero
        content={{
          eyebrow: "Locaties",
          title: "Waar Helping Hands Agency crew inzet",
          description:
            "Vanuit onze vestiging in Hilversum zetten we event crew, stagehands en horecapersoneel in door heel Nederland. Bekijk onze belangrijkste werkgebieden hieronder.",
          theme: "diensten",
          primaryCta: {
            label: "Personeel aanvragen",
            href: "/contact?type=personeel-aanvragen",
          },
          secondaryCta: {
            label: "Personeel inhuren",
            href: "/personeel-inhuren",
          },
          highlights: [
            { label: "Landelijk actief" },
            { label: "Regionale kennis" },
            { label: "Eén aanspreekpunt" },
            { label: "Snel schakelen" },
          ],
          interactiveCards: locations.slice(0, 4).map((location) => ({
            title: `${location.serviceLabel} ${location.city}`,
            description: location.heroDescription,
          })),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Landelijke dekking
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0B1F4D] sm:text-4xl">
            Regionale kennis, landelijke inzet
          </h2>
          <p className="mt-4 leading-8 text-[#101828]/75">
            Helping Hands Agency is gevestigd in Hilversum en zet crew in door
            heel Nederland. Per stad en dienst lichten we toe wat typisch is —
            zonder te claimen dat we overal een kantoor hebben. Staat jouw
            locatie er niet tussen? Vraag gerust aan via{" "}
            <Link
              href="/contact?type=personeel-aanvragen"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              contact
            </Link>
            .
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={location.path}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                {location.province}
              </p>
              <h3 className="mt-2 text-lg font-black text-[#0B1F4D]">
                {location.serviceLabel} {location.city}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                {location.heroDescription}
              </p>
              <span className="mt-4 inline-flex text-sm font-bold text-[#173A8A] transition group-hover:text-[#F28C28]">
                Bekijk pagina →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-8">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Op zoek naar een specifieke dienst?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
            Bekijk het volledige aanbod per functie of ga naar personeel
            inhuren.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/personeel-inhuren"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white"
            >
              Personeel inhuren
            </Link>
            <Link
              href="/projecten"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white"
            >
              Projectervaring
            </Link>
            <Link
              href="/contact?type=personeel-aanvragen"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
          </div>
        </div>
      </section>

      <FaqSection
        items={locationsFaqs}
        title="Vragen over onze werkgebieden"
        description="Kort over regionale dekking, aanvragen en landelijke inzet."
      />

      <CTASection
        title="Personeel nodig in jouw regio?"
        description="Deel datum, locatie, tijden, functies en aantal mensen. Wij denken mee over bezetting en briefing."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact?type=personeel-aanvragen"
        secondaryLabel="Personeel inhuren"
        secondaryHref="/personeel-inhuren"
      />

      <ReviewCta />
    </>
  );
}
