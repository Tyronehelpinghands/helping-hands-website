import Link from "next/link";
import { openApplyMailto } from "@/lib/vacancies";
import { cn } from "@/lib/utils";

const trustBullets = [
  "Flexibele klussen",
  "Duidelijke briefing",
  "Events, horeca en productie",
  "Doorgroeien mogelijk",
] as const;

const heroCards = [
  { label: "Event", hint: "Floor & runners", tone: "bg-[#173A8A]" },
  { label: "Horeca", hint: "Bar & bediening", tone: "bg-[#F28C28]" },
  { label: "Stagebouw", hint: "Load-in & out", tone: "bg-[#0B1F4D]" },
  { label: "Keuken", hint: "Hulp & spoel", tone: "bg-[#122a5c]" },
] as const;

const planningSteps = [
  "Briefing ontvangen",
  "Locatie bekend",
  "Team op locatie",
] as const;

function HeroCta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  const className = cn(
    "inline-flex min-h-11 w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1F4D] sm:w-auto sm:text-base",
    variant === "primary"
      ? "bg-[#F28C28] text-white shadow-xl shadow-black/25 hover:bg-[#de7c1f]"
      : "border-2 border-white/35 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-[#0B1F4D]",
  );

  if (href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function VacanciesHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1F4D] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#0B1F4D_0%,#173A8A_55%,#0B1F4D_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#F28C28]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-[#173A8A]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F5F7FA] to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-24 lg:pt-36">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F28C28]">
            Vacatures
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Vacatures bij Helping Hands Agency
          </h1>
          <p className="mt-5 text-xl font-bold leading-snug text-white/95 sm:text-2xl">
            Vind de klus die bij jou past.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Werk via Helping Hands op events, horeca, stagebouw, productie,
            logistiek of in de keuken. Jij geeft je beschikbaarheid door, wij
            koppelen je aan passende opdrachten.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <HeroCta
              href="#vacatures"
              label="Bekijk functies"
              variant="primary"
            />
            <HeroCta
              href={openApplyMailto}
              label="Crew aanmelden"
              variant="secondary"
            />
          </div>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {trustBullets.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm font-semibold text-white/85"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-[#F28C28]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative" aria-hidden="true">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 p-3 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-4">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {heroCards.map((card) => (
                <div
                  key={card.label}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-4 ring-1 ring-white/15 sm:p-5",
                    card.tone,
                  )}
                >
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                    Functie
                  </p>
                  <p className="mt-2 text-lg font-black sm:text-xl">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm text-white/75">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl border border-white/20 bg-[#0B1F4D]/95 p-4 sm:mt-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                  Planning klaar
                </p>
                <span className="rounded-full bg-[#F28C28]/15 px-2.5 py-1 text-[11px] font-bold text-[#F28C28]">
                  Klaar voor shift
                </span>
              </div>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
                {planningSteps.map((step) => (
                  <li
                    key={step}
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-semibold text-white/95 ring-1 ring-white/10"
                  >
                    <span
                      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F28C28] text-[11px] font-black text-white"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
