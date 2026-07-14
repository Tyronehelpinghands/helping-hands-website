import Link from "next/link";
import AudienceToggle from "@/components/AudienceToggle";
import CTASection from "@/components/CTASection";
import LogoCarousel from "@/components/LogoCarousel";
import ProcessAccordion from "@/components/ProcessAccordion";
import QuickRequestForm from "@/components/QuickRequestForm";
import PageHero from "@/components/sections/PageHero";
import SectorCards from "@/components/SectorCards";
import ServiceFilter from "@/components/ServiceFilter";
import { deployments, services } from "@/lib/content";
import { getPageHeroContent } from "@/lib/pageHeroContent";

export default function Home() {
  return (
    <>
      <PageHero content={getPageHeroContent("/")} />

      <SectorCards />

      <LogoCarousel />

      <section className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Diensten
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Crew en ondersteuning voor elke fase van de productie.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#101828]/75">
              Van hospitality en floor support tot stagehands en logistiek —
              praktische mensen die begrijpen wat er op locatie nodig is.
            </p>
            <Link
              href="/diensten"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
            >
              Bekijk alle diensten &rarr;
            </Link>
          </div>

          <div className="mt-16">
            <ServiceFilter services={services} />
          </div>
        </div>
      </section>

      <section className="section-dark py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deployments.map((item) => (
              <article
                key={item.label}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F4D]/60 shadow-xl transition hover:border-[#F28C28]/40"
              >
                <div className="stock-image-placeholder relative aspect-[16/7] w-full" />
                <div className="p-6">
                  <span className="inline-block rounded-full bg-[#F28C28] px-3 py-1 text-xs font-bold">
                    Crew
                  </span>
                  <h3 className="mt-3 text-xl font-black">{item.label}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Voor iedereen in de keten
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Voor elke productie de juiste handen.
            </h2>
          </div>

          <div className="mt-14">
            <AudienceToggle />
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Werkwijze
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Zo werken wij
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#101828]/70">
              Van aanvraag tot afhandeling: een helder proces voor crew,
              briefing en uitvoering op locatie.
            </p>
          </div>

          <div className="mt-16">
            <ProcessAccordion />
          </div>
        </div>
      </section>

      <QuickRequestForm />

      <CTASection
        title="Personeel nodig voor je volgende productie?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door. Wij denken mee over de planning en bezetting."
        buttonLabel="Vraag direct personeel aan"
        buttonHref="/contact"
        secondaryLabel="Bekijk vacatures"
        secondaryHref="/vacatures"
      />
    </>
  );
}
