import Link from "next/link";

export default function ProjectHero() {
  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#F28C28]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#38bdf8]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Projectervaring
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Projectervaring waar je op kunt bouwen
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            Helping Hands Agency levert crew voor events, horeca, productie, stagebouw,
            logistiek en hospitality. Onze mensen zijn inzetbaar bij festivals, concerten,
            stadions, beurslocaties, horeca en producties.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F28C28] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f] sm:w-auto"
            >
              Personeel aanvragen
            </Link>
            <Link
              href="/vacatures"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-8 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] sm:w-auto"
            >
              Crew aanmelden
            </Link>
          </div>
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#F28C28]/20 blur-2xl" />
          <div className="relative grid gap-3 sm:grid-cols-2">
            {[
              { label: "Festivals", accent: "bg-[#F28C28]" },
              { label: "Concerten", accent: "bg-[#38bdf8]" },
              { label: "Stadions", accent: "bg-[#173A8A]" },
              { label: "Beurzen", accent: "bg-[#F28C28]" },
              { label: "Horeca", accent: "bg-[#38bdf8]" },
              { label: "Productie", accent: "bg-[#173A8A]" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
              >
                <span className={`mb-2 block h-1 w-8 rounded-full ${item.accent}`} />
                <p className="text-sm font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-white/60">Crewervaring</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
