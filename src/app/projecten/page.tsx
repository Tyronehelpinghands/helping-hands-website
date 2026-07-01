import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import LogoShowcase from "@/components/LogoShowcase";
import PageHero from "@/components/PageHero";
import { projectCategories, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projecten | Helping Hands Agency",
  description:
    "Projectervaring en inzetgebieden van Helping Hands Agency bij festivals, concerten, stadions, beurzen en producties.",
};

export default function ProjectenPage() {
  return (
    <>
      <PageHero
        eyebrow="Projecten"
        title="Projectervaring & inzetgebieden"
        description="Helping Hands Agency levert crew voor producties waar timing, communicatie en inzet moeten kloppen."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="max-w-3xl text-lg leading-8 text-[#101828]/75">
          Onze crew is ingezet bij festivals, concerten, stadionproducties,
          beurzen, horeca-events, load-in/load-out en backstage ondersteuning.
          Specifieke logo&apos;s en namen tonen wij alleen wanneer dit past
          binnen de samenwerking.
        </p>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Ervaring in de live branche
          </h2>
          <div className="mt-8">
            <LogoShowcase />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-black text-[#0B1F4D]">
            Producties waar wij ervaring mee hebben
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projectCategories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:border-[#F28C28]/40 hover:shadow-xl"
              >
                <div className="mb-4 h-1 w-10 rounded-full bg-[#F28C28]" />
                <h3 className="text-xl font-black text-[#0B1F4D]">
                  {category.title}
                </h3>
                <p className="mt-3 leading-7 text-[#101828]/75">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-black text-[#0B1F4D]">
            Functies die wij leveren
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-slate-200 bg-[#F5F7FA] p-6 transition hover:border-[#173A8A]/30 hover:bg-white hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#173A8A] to-[#0B1F4D] text-sm font-black text-white">
                  {service.initials}
                </div>
                <h3 className="mt-4 text-lg font-black text-[#0B1F4D]">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#101828]/75">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Crew nodig voor je volgende productie?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door. Wij denken mee over de juiste bezetting en briefing."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
        secondaryLabel="Bekijk diensten"
        secondaryHref="/diensten"
      />
    </>
  );
}
