import Link from "next/link";
import CTASection from "@/components/CTASection";

const heroBadges = ["Event crew", "Stagehands", "Horeca support", "Productie"];

const sectors = [
  { label: "Evenementen", tag: "Festivals & live" },
  { label: "Horeca", tag: "Hospitality" },
  { label: "Stagebouw", tag: "Opbouw & afbouw" },
  { label: "Productie", tag: "Crew & planning" },
  { label: "Logistiek", tag: "Floor support" },
];

const services = [
  {
    initials: "EC",
    title: "Event crew",
    description:
      "Floor support, publieksstromen en operationele ondersteuning tijdens opbouw, show en afbouw op locatie.",
    accent: "from-[#173A8A] to-[#1e4aa8]",
  },
  {
    initials: "HS",
    title: "Horeca support",
    description:
      "Hospitality, bars, bediening en runners voor piekmomenten in de horeca en op events.",
    accent: "from-[#F28C28] to-[#e07a18]",
  },
  {
    initials: "SH",
    title: "Stagehands",
    description:
      "Aanpakkers voor laden, lossen, bouwen en breken — veilig, snel en productiegericht.",
    accent: "from-[#0B1F4D] to-[#173A8A]",
  },
  {
    initials: "PA",
    title: "Productie assistentie",
    description:
      "Ondersteuning bij crewcoördinatie, briefing en praktische uitvoering op de werkvloer.",
    accent: "from-[#173A8A] to-[#0B1F4D]",
  },
  {
    initials: "LO",
    title: "Logistieke ondersteuning",
    description:
      "Transportbewegingen, materiaalstromen en back-of-house processen tijdens de productie.",
    accent: "from-[#1e4aa8] to-[#173A8A]",
  },
  {
    initials: "TC",
    title: "Teamcaptains",
    description:
      "Ervaren aanspreekpunten die teams aansturen, briefings bewaken en schakelen met productie.",
    accent: "from-[#F28C28] to-[#c96a15]",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Aanvraag",
    description: "Je deelt functie, locatie, timing en teamgrootte. Wij inventariseren snel.",
  },
  {
    step: "02",
    title: "Planning",
    description: "We stemmen bezetting af op je productieplanning en beschikbaarheid.",
  },
  {
    step: "03",
    title: "Briefing",
    description: "Heldere afspraken over aankomst, kleding, aanspreekpunten en taken.",
  },
  {
    step: "04",
    title: "Uitvoering",
    description: "Crew op locatie: opbouw, hospitality, floor support of productie-assistentie.",
  },
  {
    step: "05",
    title: "Afhandeling",
    description: "Evaluatie en follow-up, zodat volgende inzetten nog soepeler verlopen.",
  },
];

const dashboardCrew = [
  { role: "Stagehands", count: 6, status: "Bevestigd" },
  { role: "Horeca support", count: 4, status: "In planning" },
  { role: "Floor support", count: 3, status: "Briefing klaar" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F28C28]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-white/5" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm"
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Betrouwbare crew voor evenementen, horeca, stagebouw en productie.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              Helping Hands Agency levert snel inzetbaar personeel met duidelijke communicatie —
              van briefing tot afbouw op locatie.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f]"
              >
                Personeel aanvragen
              </Link>
              <Link
                href="/medewerkers"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D]"
              >
                Werken bij Helping Hands
              </Link>
            </div>
          </div>

          {/* Staffing dashboard card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2.25rem] bg-[#F28C28]/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-1 shadow-2xl shadow-black/30 backdrop-blur-md">
              <div className="card-shine rounded-[1.75rem] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F28C28]">
                      Crew aanvraag
                    </p>
                    <p className="mt-1 text-lg font-black text-[#0B1F4D]">Productie dashboard</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Actief
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F5F7FA] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Locatie
                    </p>
                    <p className="mt-1 font-bold text-[#173A8A]">Eventhal — opbouw</p>
                  </div>
                  <div className="rounded-2xl bg-[#F5F7FA] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Planning
                    </p>
                    <p className="mt-1 font-bold text-[#173A8A]">Do 08:00 – Za 23:00</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {dashboardCrew.map((item) => (
                    <div
                      key={item.role}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173A8A] text-xs font-black text-white">
                          {item.count}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-[#0B1F4D]">{item.role}</p>
                          <p className="text-xs text-slate-500">{item.status}</p>
                        </div>
                      </div>
                      <span className="hidden rounded-lg bg-[#F5F7FA] px-2.5 py-1 text-xs font-semibold text-[#173A8A] sm:inline">
                        Crew
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#0B1F4D] px-4 py-3.5 text-white">
                  <div>
                    <p className="text-xs text-white/60">Totaal ingepland</p>
                    <p className="text-xl font-black">13 crewleden</p>
                  </div>
                  <span className="rounded-full bg-[#F28C28] px-4 py-1.5 text-xs font-bold">
                    Briefing vandaag
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors bar */}
      <section className="relative z-10 -mt-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-xl shadow-[#0B1F4D]/8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4 lg:p-5">
            {sectors.map((sector) => (
              <div
                key={sector.label}
                className="group rounded-2xl bg-[#F5F7FA] px-4 py-4 transition hover:bg-[#173A8A] hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#F28C28] group-hover:text-[#F28C28]">
                  {sector.tag}
                </p>
                <p className="mt-1 text-base font-extrabold text-[#0B1F4D] group-hover:text-white">
                  {sector.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">Diensten</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            Crew en ondersteuning voor elke fase van de productie.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Van hospitality en floor support tot stagehands en logistiek — praktische mensen die
            begrijpen wat er op locatie nodig is.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-md shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173A8A]/10"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} text-lg font-black text-white shadow-lg`}
              >
                {service.initials}
              </div>
              <h3 className="text-xl font-black text-[#0B1F4D]">{service.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
              <div className="mt-6 h-1 w-0 rounded-full bg-[#F28C28] transition-all group-hover:w-12" />
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/diensten"
            className="inline-flex items-center gap-2 rounded-full border border-[#173A8A]/20 bg-white px-6 py-3 text-sm font-bold text-[#173A8A] shadow-sm transition hover:border-[#173A8A] hover:shadow-md"
          >
            Bekijk alle diensten
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Voor opdrachtgevers / medewerkers */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Voor iedereen in de keten
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Voor elke productie de juiste handen.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="hero-gradient relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl lg:p-10">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F28C28]/20 blur-2xl" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
                Voor opdrachtgevers
              </p>
              <h3 className="mt-4 text-2xl font-black sm:text-3xl">
                Crew die meebeweegt met jouw productieplanning.
              </h3>
              <p className="mt-4 max-w-md leading-8 text-white/75">
                Productieleiders en eventmanagers schakelen ons in voor opbouw, hospitality, floor
                support en logistiek — met één vast aanspreekpunt.
              </p>
              <Link
                href="/opdrachtgevers"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
              >
                Personeel aanvragen
              </Link>
            </article>

            <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#F5F7FA] p-8 shadow-xl lg:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
                Voor medewerkers
              </p>
              <h3 className="mt-4 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
                Werk mee aan events, horeca en productie op locatie.
              </h3>
              <p className="mt-4 max-w-md leading-8 text-slate-600">
                Ben je praktisch ingesteld, communicatief sterk en beschikbaar voor opbouw, show en
                afbouw? Meld je aan bij Helping Hands Agency.
              </p>
              <Link
                href="/medewerkers"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
              >
                Werken bij Helping Hands
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">Werkwijze</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
            Zo werken wij
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Van aanvraag tot afhandeling: een helder proces voor crew, briefing en uitvoering op
            locatie.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((item, index) => (
            <article
              key={item.title}
              className="relative rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#173A8A]/30 hover:shadow-lg"
            >
              {index < processSteps.length - 1 && (
                <span
                  className="absolute -right-2 top-1/2 hidden h-0.5 w-4 -translate-y-1/2 bg-[#F28C28]/40 lg:block"
                  aria-hidden="true"
                />
              )}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1F4D] text-xs font-black text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-black text-[#173A8A]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Productie starten?"
        title="Bespreek je crewvraag, locatie en planning met Helping Hands Agency."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
