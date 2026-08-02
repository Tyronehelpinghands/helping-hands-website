import Link from "next/link";

type SeoHeroProps = {
  eyebrow?: string;
  h1: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function SeoHero({
  eyebrow,
  h1,
  description,
  primaryCta,
  secondaryCta,
}: SeoHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1F4D] via-[#173A8A] to-[#0B1F4D] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(242,140,40,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 35%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {h1}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryCta.href}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F28C28] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/40 px-8 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#0B1F4D]"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
