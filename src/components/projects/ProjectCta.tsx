import Link from "next/link";

export default function ProjectCta() {
  return (
    <section className="hero-gradient relative overflow-hidden py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black sm:text-3xl">
          Personeel nodig voor je volgende project?
        </h2>
        <p className="mt-4 text-base leading-8 text-white/85 sm:text-lg">
          Van last-minute extra handen tot volledige crewplanning: Helping Hands Agency
          denkt mee in functies, aantallen, planning, briefing en uitvoering.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#F28C28] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f] sm:w-auto"
          >
            Aanvraag doen
          </Link>
          <Link
            href="/diensten"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-8 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D] sm:w-auto"
          >
            Bekijk diensten
          </Link>
        </div>
      </div>
    </section>
  );
}
