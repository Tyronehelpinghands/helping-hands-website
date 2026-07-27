import Link from "next/link";
import {
  countProjectLogosByCategory,
  projectLogos,
} from "@/lib/projectLogos";
import { cn } from "@/lib/utils";

const heroCards = [
  { label: "Events & festivals", hint: "Festival & eventcrew", tone: "bg-[#173A8A]" },
  { label: "Stagebouw & productie", hint: "Load-in & sitecrew", tone: "bg-[#0B1F4D]" },
  { label: "Horeca & hospitality", hint: "Bar & guest support", tone: "bg-[#F28C28]" },
  { label: "Locaties & stadions", hint: "Arena’s & beurzen", tone: "bg-[#122a5c]" },
] as const;

const trustBullets = [
  "Crewervaring",
  "Diverse sectoren",
  "Landelijke inzet",
  "Projectmatig",
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

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function ProjectsHero() {
  const opdrachtgevers = countProjectLogosByCategory("Opdrachtgevers");
  const festivals = countProjectLogosByCategory("Projecten & festivals");
  const locaties = countProjectLogosByCategory("Locaties");

  return (
    <section className="relative overflow-hidden bg-[#0B1F4D] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#0B1F4D_0%,#173A8A_55%,#0B1F4D_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
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
            Projectervaring
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Projectervaring op locaties, festivals en producties
          </h1>
          <p className="mt-5 text-xl font-bold leading-snug text-white/95 sm:text-2xl">
            Ervaring op festivals, locaties en producties door heel Nederland.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Onze crew is via verschillende opdrachten, partners en producties
            ingezet binnen events, horeca, stagebouw, productie, logistiek en
            hospitality.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <HeroCta
              href="/contact"
              label="Personeel aanvragen"
              variant="primary"
            />
            <HeroCta href="/diensten" label="Bekijk diensten" variant="secondary" />
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

          <p className="mt-6 text-xs leading-6 text-white/55">
            {projectLogos.length} vermeldingen · {opdrachtgevers} opdrachtgevers ·{" "}
            {festivals} projecten & festivals · {locaties} locaties
          </p>
        </div>

        <div className="relative">
          <div className="absolute -right-2 -top-4 z-10 rounded-full border border-white/20 bg-[#F28C28] px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:-right-4 sm:-top-6">
            Crewervaring
          </div>
          <div className="absolute -bottom-3 left-4 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm sm:left-8">
            Landelijke inzet
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {heroCards.map((card, index) => (
              <article
                key={card.label}
                className={cn(
                  "rounded-2xl border border-white/15 p-4 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#F28C28]/50 sm:p-5",
                  card.tone,
                  index === 0 && "sm:translate-y-2",
                  index === 1 && "sm:-translate-y-1",
                  index === 2 && "sm:-translate-y-2",
                  index === 3 && "sm:translate-y-1",
                )}
              >
                <div className="mb-3 h-1 w-8 rounded-full bg-[#F28C28]" />
                <p className="text-sm font-black text-white sm:text-base">
                  {card.label}
                </p>
                <p className="mt-1.5 text-xs font-medium text-white/70 sm:text-sm">
                  {card.hint}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
