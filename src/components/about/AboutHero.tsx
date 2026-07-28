import { ClipboardCheck, HeartHandshake, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aboutHero } from "@/lib/aboutPage";
import { aboutHeroPhotos } from "@/lib/crewPhotos";
import { cn } from "@/lib/utils";

type HeroCard =
  | { type: "photo"; src: string; alt: string; caption: string; objectPosition?: string }
  | { type: "gradient"; icon: LucideIcon; title: string; description: string };

const [main, second, third] = aboutHeroPhotos;

const cards: HeroCard[] = [
  {
    type: "photo",
    src: second?.src ?? "",
    alt: second?.alt ?? "",
    caption: "Crew met karakter",
    objectPosition: second?.objectPosition,
  },
  {
    type: "gradient",
    icon: HeartHandshake,
    title: "Onze missie",
    description:
      "Kansen, structuur en begeleiding voor iedereen die een eerlijke kans verdient.",
  },
  {
    type: "photo",
    src: third?.src ?? "",
    alt: third?.alt ?? "",
    caption: "Professioneel op de vloer",
    objectPosition: third?.objectPosition,
  },
  {
    type: "gradient",
    icon: ClipboardCheck,
    title: "Planning & briefing",
    description: "Heldere afspraken van aanvraag tot afhandeling op locatie.",
  },
];

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

function GradientCard({ icon: Icon, title, description }: Extract<HeroCard, { type: "gradient" }>) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#173A8A] via-[#122a5c] to-[#0B1F4D] p-4 sm:p-5">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#F28C28]/25 blur-2xl"
        aria-hidden="true"
      />
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F28C28]">
        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="relative mt-3">
        <p className="text-sm font-black text-white sm:text-base">{title}</p>
        <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden text-white hero-gradient">
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#F28C28]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:pb-20 lg:pt-36 xl:pb-24">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            {aboutHero.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {aboutHero.title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
            {aboutHero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HeroCta
              href={aboutHero.primaryCta.href}
              label={aboutHero.primaryCta.label}
              variant="primary"
            />
            <HeroCta
              href={aboutHero.secondaryCta.href}
              label={aboutHero.secondaryCta.label}
              variant="secondary"
            />
          </div>

          <Link
            href={aboutHero.tertiaryCta.href}
            className="mt-5 inline-flex text-sm font-bold text-white/85 underline-offset-4 transition hover:text-[#F28C28] hover:underline"
          >
            {aboutHero.tertiaryCta.label} →
          </Link>

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {aboutHero.trustBullets.map((item) => (
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

        <div className="min-w-0">
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
                  style={{ objectPosition: main.objectPosition ?? "50% 30%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/75 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md bg-[#F28C28] px-2.5 py-1 text-xs font-bold text-white">
                  Op locatie sinds 2022
                </span>
              </div>
            ) : null}

            {cards.map((card, index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-2xl ring-1 ring-white/15",
                  index < 2
                    ? "col-span-6 aspect-[4/5] sm:col-span-5 sm:aspect-[5/4]"
                    : "col-span-6 aspect-[4/3] sm:col-span-6 sm:aspect-[16/10]",
                )}
              >
                {card.type === "photo" ? (
                  <>
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                      style={{ objectPosition: card.objectPosition ?? "50% 20%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4D]/70 to-transparent" />
                    <span className="absolute bottom-2 left-2 rounded bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {card.caption}
                    </span>
                  </>
                ) : (
                  <GradientCard {...card} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
