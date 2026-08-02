import Link from "next/link";

type SeoCtaProps = {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function SeoCta({
  title,
  description,
  primaryCta,
  secondaryCta,
}: SeoCtaProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B1F4D] to-[#173A8A] px-6 py-12 text-white sm:px-10 lg:px-14">
        <h2 className="max-w-3xl text-2xl font-black sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
            {description}
          </p>
        ) : null}
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
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-white/35 px-8 py-3 text-sm font-bold transition hover:bg-white hover:text-[#0B1F4D]"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
