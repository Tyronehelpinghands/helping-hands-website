import Link from "next/link";

const items = [
  {
    label: "Sectoren",
    value: "Events & horeca",
    detail: "Van festival tot hospitality",
  },
  {
    label: "Projectervaring",
    value: "Via jobs, partners & producties",
    detail: "Concrete crewervaring op locatie",
  },
  {
    label: "Locaties",
    value: "Stadions, beurzen & eventlocaties",
    detail: "Landelijk inzetbaar",
  },
  {
    label: "Aanvraag",
    value: "Eén aanspreekpunt",
    detail: "Van briefing tot uitvoering",
  },
] as const;

export default function TrustBar() {
  return (
    <section className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Betrouwbaar inzetten
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B1F4D] sm:text-2xl">
              Professionele crew voor events, horeca en productie
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#101828]/65">
              Gevestigd in Hilversum · landelijk inzetbaar
            </p>
          </div>
          <Link
            href="/projecten"
            className="text-sm font-bold text-[#173A8A] underline-offset-4 transition hover:text-[#0B1F4D] hover:underline"
          >
            Bekijk projectervaring
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex min-h-[7.5rem] flex-col rounded-2xl border border-slate-200/80 bg-[#F5F7FA] px-4 py-5 sm:px-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-black leading-snug tracking-tight text-[#0B1F4D] sm:text-xl">
                {item.value}
              </p>
              <p className="mt-auto pt-2 text-sm leading-6 text-[#101828]/65">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
