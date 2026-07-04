import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diensten | Helping Hands Agency",
  description:
    "Event crew, horeca support, restaurantpersoneel, stagehands, productie assistentie, logistiek en teamcaptains.",
};

export default function DienstenPage() {
  return (
    <>
      <PageHero
        eyebrow="Diensten"
        title="Crew en ondersteuning voor elke fase van de productie."
        description="Van hospitality en floor support tot stagehands en logistiek — praktische mensen die begrijpen wat er op locatie nodig is."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} showUsage showCta />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-[#F5F7FA] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Horeca & restaurant
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0B1F4D]">
            Restaurant & horeca personeel
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#101828]/75">
            Voor restaurants en horecalocaties leveren wij flexibele ondersteuning
            op de vloer, achter de bar en in de keuken.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Bediening",
              "Runner",
              "Barback",
              "Bartender",
              "Afwasser",
              "Keukenhulp",
              "Hulp kok",
              "Zelfstandig werkend kok",
              "Chef de partie",
              "Sous-chef",
              "Chef-kok",
              "Host",
              "Shiftleader / Floor manager",
            ].map((role) => (
              <div
                key={role}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-semibold text-[#173A8A] shadow-sm"
              >
                {role}
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
          >
            Personeel aanvragen
          </Link>
        </div>
      </section>

      <section className="bg-[#0B1F4D] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-black">Snel de juiste functie ingezet</h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Vertel ons welke crew je nodig hebt — wij denken mee over bezetting,
              briefing en planning op locatie.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Planning", "Briefing", "Uitvoering"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-[#173A8A]/40 px-4 py-4 text-center font-bold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
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
