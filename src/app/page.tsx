import Link from "next/link";
import AudienceToggle from "@/components/AudienceToggle";
import CTASection from "@/components/CTASection";
import InteractiveHeroDashboard from "@/components/InteractiveHeroDashboard";
import LogoCarousel from "@/components/LogoCarousel";
import ProcessAccordion from "@/components/ProcessAccordion";
import QuickRequestForm from "@/components/QuickRequestForm";
import SectorCards from "@/components/SectorCards";
import ServiceFilter from "@/components/ServiceFilter";
import { deployments, services } from "@/lib/content";

const heroBadges = ["Event crew", "Stagehands", "Horeca support", "Productie"];

const promises = [
  "Snel schakelen",
  "Duidelijke briefing",
  "Betrouwbare crew",
  "Eén vast aanspreekpunt",
];

export default function Home() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#F28C28]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#F28C28]/8 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#F28C28]/40 bg-[#F28C28]/15 px-4 py-1.5 text-xs font-bold text-[#F28C28]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Snel inzetbare crew voor events, horeca en productie.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80 sm:text-xl sm:leading-9">
              Helping Hands Agency levert betrouwbare mensen voor opbouw, afbouw,
              hospitality, floor support, stagehands en productieondersteuning.
              Duidelijke communicatie, korte lijnen en crew die weet wat er op
              locatie nodig is.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {promises.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm"
                >
                  <span className="mb-1.5 block h-1 w-6 rounded-full bg-[#F28C28]" />
                  <p className="text-xs font-bold leading-snug sm:text-sm">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F28C28] px-9 py-4 text-base font-bold text-white shadow-xl shadow-black/30 transition hover:bg-[#de7c1f] sm:w-auto"
              >
                Personeel aanvragen
              </Link>
              <Link
                href="/vacatures"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-9 py-4 text-base font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] sm:w-auto"
              >
                Aanmelden als crewlid
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
              <InteractiveHeroDashboard />
            </div>
          </div>
        </div>
      </section>

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
