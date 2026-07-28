import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import { getAllLocations } from "@/data/locations";
import { buildPageMetadata, faqJsonLd, locationsItemListJsonLd } from "@/lib/seo";

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
    question: "Hoe kies ik de juiste locatiepagina voor mijn aanvraag?",
    answer:
      "Kies de stad die het dichtst bij jouw evenement of locatie ligt. Staat jouw stad er niet tussen? Vraag gewoon aan via het contactformulier — we bezetten landelijk.",
  },
  {
    question: "Verschilt de crew per regio?",
    answer:
      "De diensten zijn overal hetzelfde — event crew, stagehands, horeca en meer — maar per regio benoemen we de typische toepassingen en voorbeeldlocaties die daar spelen.",
  },
  {
    question: "Kan ik ook buiten Nederland personeel aanvragen?",
    answer:
      "Via productiepartners zetten we soms ook crew in over de grens, bijvoorbeeld in België. Neem contact op om de mogelijkheden te bespreken.",
  },
  {
    question: "Hoe vraag ik personeel aan voor een specifieke stad?",
    answer:
      "Gebruik het contactformulier en vermeld de stad, locatie, datum, tijden, functies en aantal mensen. Wij denken mee over bezetting en planning.",
  },
];

export default function LocatiesOverviewPage() {
  const locations = getAllLocations();

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
            name: location.city,
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
          primaryCta: { label: "Personeel aanvragen", href: "/contact" },
          secondaryCta: { label: "Bekijk diensten", href: "/diensten" },
          highlights: [
            { label: "Landelijk actief" },
            { label: "Regionale kennis" },
            { label: "Eén aanspreekpunt" },
            { label: "Snel schakelen" },
          ],
          interactiveCards: locations.slice(0, 4).map((location) => ({
            title: location.city,
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
            heel Nederland. Op deze pagina&apos;s lichten we per stad toe welke
            diensten en toepassingen daar veel voorkomen — van beursvloeren in
            Utrecht tot stadionproducties in Arnhem en kustlocaties bij Den
            Haag. Staat jouw locatie er niet tussen? Vraag gerust aan via{" "}
            <Link
              href="/contact"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              contact
            </Link>
            , we bezetten landelijk.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={location.path}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
            >
              <div className="relative aspect-[16/9] bg-slate-100">
                <Image
                  src={location.image.src}
                  alt={location.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  {location.province}
                </p>
                <h3 className="mt-2 text-lg font-black text-[#0B1F4D]">
                  {location.city}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                  {location.heroDescription}
                </p>
                <span className="mt-4 inline-flex text-sm font-bold text-[#173A8A] transition group-hover:text-[#F28C28]">
                  Bekijk {location.city} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-8">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Op zoek naar een specifieke dienst?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
            Bekijk het volledige aanbod per functie of ga direct naar onze
            projectervaring op locaties door heel Nederland.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/diensten"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white"
            >
              Alle diensten
            </Link>
            <Link
              href="/projecten"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-white"
            >
              Projectervaring
            </Link>
            <Link
              href="/contact"
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
        buttonHref="/contact"
        secondaryLabel="Bekijk diensten"
        secondaryHref="/diensten"
      />
    </>
  );
}
