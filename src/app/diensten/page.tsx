import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import StockImage from "@/components/StockImage";
import { services } from "@/lib/content";
import { stockImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Diensten | Helping Hands Agency",
  description:
    "Event crew, horeca support, stagehands, productie assistentie, logistiek en teamcaptains voor evenementen en producties.",
};

export default function DienstenPage() {
  return (
    <>
      <PageHero
        eyebrow="Diensten"
        title="Crew en ondersteuning voor elke fase van de productie."
        description="Van hospitality en floor support tot stagehands en logistiek — praktische mensen die begrijpen wat er op locatie nodig is."
        image={stockImages.servicesStagehands}
        imageAlt="Stagehands bij productie"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} showUsage showCta />
          ))}
        </div>
      </section>

      <section className="bg-[#0B1F4D] py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-black">Snel de juiste functie ingezet</h2>
            <p className="mt-4 leading-8 text-white/75">
              Vertel ons welke crew je nodig hebt — wij denken mee over bezetting, briefing en
              planning op locatie.
            </p>
          </div>
          <StockImage
            src={stockImages.productionBackstage}
            alt="Backstage productie"
            fill
            className="relative aspect-video w-full rounded-2xl"
            placeholderLabel="Productie"
          />
        </div>
      </section>

      <CTASection
        title="Welke crew heb jij nodig?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
