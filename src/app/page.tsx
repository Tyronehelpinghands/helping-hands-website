import Link from "next/link";
import CTASection from "@/components/CTASection";
import ImageCard from "@/components/ImageCard";
import ProcessStep from "@/components/ProcessStep";
import ServiceCard from "@/components/ServiceCard";
import StockImage from "@/components/StockImage";
import {
  dashboardSteps,
  deployments,
  processSteps,
  sectors,
  services,
} from "@/lib/content";
import { stockImages } from "@/lib/images";

const heroBadges = ["Event crew", "Stagehands", "Horeca support", "Productie"];

const promises = [
  "Snel schakelen",
  "Duidelijke briefing",
  "Betrouwbare crew",
  "Eén vast aanspreekpunt",
];

const deploymentImages: Record<string, string> = {
  festivals: stockImages.festivals,
  stagehands: stockImages.stagehands,
  horecaSupport: stockImages.horecaSupport,
  productionBackstage: stockImages.productionBackstage,
};

const statusStyles: Record<string, string> = {
  Voltooid: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  Actief: "bg-[#F28C28]/25 text-[#F28C28] border-[#F28C28]/40",
  Gepland: "bg-white/10 text-white/70 border-white/15",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
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

            <h1 className="max-w-2xl text-[2.5rem] font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Snel inzetbare crew voor events, horeca en productie.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80 sm:text-xl sm:leading-9">
              Helping Hands Agency levert betrouwbare mensen voor opbouw, afbouw, hospitality, floor
              support, stagehands en productieondersteuning. Duidelijke communicatie, korte lijnen en
              crew die weet wat er op locatie nodig is.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {promises.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm"
                >
                  <span className="mb-1.5 block h-1 w-6 rounded-full bg-[#F28C28]" />
                  <p className="text-xs font-bold leading-snug sm:text-sm">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-9 py-4 text-base font-bold text-white shadow-xl shadow-black/30 transition hover:bg-[#de7c1f]"
              >
                Personeel aanvragen
              </Link>
              <Link
                href="/medewerkers"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-9 py-4 text-base font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D]"
              >
                Aanmelden als crewlid
              </Link>
            </div>
          </div>

          {/* Hero visual + dashboard */}
          <div className="relative">
            <StockImage
              src={stockImages.heroEvent}
              alt="Event crew op locatie"
              fill
              priority
              className="relative aspect-[4/5] w-full rounded-[2rem] shadow-2xl sm:aspect-[5/6]"
              placeholderLabel="Event crew"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-[#0B1F4D]/90 p-4 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#F28C28] sm:text-xs">
                    Live status
                  </p>
                  <h2 className="text-lg font-black sm:text-xl">Crewplanning in één overzicht</h2>
                </div>
                <span className="shrink-0 rounded-full bg-[#F28C28] px-2.5 py-1 text-[0.65rem] font-bold sm:text-xs">
                  4 stappen
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {dashboardSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 ${
                      step.done
                        ? "border-[#F28C28]/25 bg-[#F28C28]/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-black ${
                          step.done ? "bg-[#F28C28]" : "bg-white/10 text-white/60"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <p className="text-xs font-bold sm:text-sm">{step.label}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase sm:text-[0.65rem] ${statusStyles[step.status]}`}
                    >
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectorenbalk */}
      <section className="border-y border-[#F28C28]/20 bg-[#0B1F4D]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-6 sm:px-6 lg:gap-4 lg:px-8">
          {sectors.map((sector) => (
            <span
              key={sector}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#F28C28]/40 hover:bg-[#F28C28]/15"
            >
              {sector}
            </span>
          ))}
        </div>
      </section>

      {/* Diensten */}
      <section className="bg-[#F5F7FA] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Diensten
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
                Crew en ondersteuning voor elke fase van de productie.
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#101828]/75">
                Van hospitality en floor support tot stagehands en logistiek — praktische mensen die
                begrijpen wat er op locatie nodig is.
              </p>
              <Link
                href="/diensten"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
              >
                Bekijk alle diensten &rarr;
              </Link>
            </div>
            <StockImage
              src={stockImages.servicesStagehands}
              alt="Stagehands bij productie"
              fill
              className="relative aspect-[16/10] w-full rounded-2xl shadow-xl"
              placeholderLabel="Stagehands"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Waar wij worden ingezet */}
      <section className="section-dark py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">Sectoren</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Waar wij worden ingezet
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Van festivalterrein tot stadionproductie: wij leveren praktische ondersteuning op
              locaties waar timing en communicatie belangrijk zijn.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deployments.map((item) => {
              const img = item.imageKey ? deploymentImages[item.imageKey] : null;
              return (
                <article
                  key={item.label}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F4D]/60 shadow-xl"
                >
                  {img ? (
                    <StockImage
                      src={img}
                      alt={item.label}
                      fill
                      className="relative aspect-[16/7] w-full"
                      placeholderLabel={item.label}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="stock-image-placeholder relative aspect-[16/7] w-full" />
                  )}
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-[#F28C28] px-3 py-1 text-xs font-bold">
                      Crew
                    </span>
                    <h3 className="mt-3 text-xl font-black">{item.label}</h3>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voor opdrachtgevers / medewerkers */}
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

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <ImageCard
              image={stockImages.clientsBriefing}
              imageAlt="Briefing met opdrachtgever"
              eyebrow="Voor opdrachtgevers"
              title="Voor opdrachtgevers"
              description="Personeel nodig voor een festival, event, beurs, stadionproductie of horecalocatie? Helping Hands schakelt snel en levert mensen die begrijpen dat timing, houding en communicatie alles bepalen."
              href="/contact"
              ctaLabel="Personeel aanvragen"
            />
            <ImageCard
              image={stockImages.crewWorking}
              imageAlt="Crew aan het werk"
              eyebrow="Voor medewerkers"
              title="Voor medewerkers"
              description="Wil je werken op evenementen, in horeca of bij producties? Sluit je aan bij een crew waar duidelijkheid, inzet en doorgroeien centraal staan."
              href="/medewerkers"
              ctaLabel="Aanmelden als crewlid"
              dark={false}
            />
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">Werkwijze</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0B1F4D] sm:text-5xl">
              Zo werken wij
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#101828]/70">
              Van aanvraag tot afhandeling: een helder proces voor crew, briefing en uitvoering op
              locatie.
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-4">
            {processSteps.map((item, index) => (
              <ProcessStep
                key={item.title}
                step={item.step}
                title={item.title}
                description={item.description}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Personeel nodig voor je volgende productie?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door. Wij denken mee over de planning en bezetting."
        buttonLabel="Vraag direct personeel aan"
        buttonHref="/contact"
      />
    </>
  );
}
