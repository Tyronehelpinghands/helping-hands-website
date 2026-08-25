"use client";

import Image from "next/image";
import Link from "next/link";
import {
  crewApplyHref,
  employeeHeroPhotos,
  employeeHeroTrust,
} from "@/lib/employeePage";
import { cn } from "@/lib/utils";

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

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
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

export default function EmployeeHero() {
  const [main, ...rest] = employeeHeroPhotos;

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
            Werken bij Helping Hands
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Werken bij Helping Hands Agency
          </h1>
          <p className="mt-5 text-xl font-bold leading-snug text-white/95 sm:text-2xl lg:text-[1.65rem]">
            Pak klussen mee, bouw ervaring op en groei door in de eventwereld.
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Bij Helping Hands werk je op events, horeca, stagebouw, productie en
            logistiek. Je krijgt duidelijke afspraken, begeleiding en de kans om
            jezelf te ontwikkelen op echte producties.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <HeroCta
              href={crewApplyHref}
              label="Aanmelden als crewlid"
              variant="primary"
            />
            <HeroCta href="/vacatures" label="Bekijk vacatures" variant="secondary" />
          </div>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {employeeHeroTrust.map((item) => (
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

        <div className="relative">
          <div className="grid grid-cols-12 gap-3">
            {main ? (
              <div className="relative col-span-12 aspect-[16/11] overflow-hidden rounded-[1.75rem] ring-2 ring-white/15 sm:col-span-7 sm:row-span-2 sm:aspect-auto sm:min-h-[22rem]">
                <Image
                  src={main.src}
                  alt={main.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/75 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md bg-[#F28C28] px-2.5 py-1 text-xs font-bold text-white">
                  {main.badge}
                </span>
              </div>
            ) : null}

            {rest.slice(0, 4).map((photo, index) => (
              <div
                key={photo.src}
                className={cn(
                  "relative overflow-hidden rounded-2xl ring-1 ring-white/15",
                  index < 2
                    ? "col-span-6 aspect-[4/5] sm:col-span-5 sm:aspect-[5/4]"
                    : "col-span-6 aspect-[4/3] sm:col-span-6 sm:aspect-[16/10]",
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/70 to-transparent" />
                <span className="absolute bottom-2 left-2 rounded bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {photo.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-3 left-3 right-3 z-10 sm:bottom-4 sm:left-auto sm:right-4 sm:w-64">
            <div className="rounded-2xl border border-white/20 bg-[#0B1F4D]/90 p-4 shadow-xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                Shift klaar
              </p>
              <ul className="mt-2 space-y-1.5 text-sm font-semibold text-white/90">
                <li>Briefing ontvangen</li>
                <li>Locatie bekend</li>
                <li>Teamcaptain op locatie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
