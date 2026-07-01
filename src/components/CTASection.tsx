import Link from "next/link";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function CtaButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  const primaryClass =
    "inline-flex items-center justify-center rounded-full bg-[#F28C28] px-9 py-4 text-sm font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f]";
  const secondaryClass =
    "inline-flex items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-9 py-4 text-sm font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D]";
  const className = variant === "primary" ? primaryClass : secondaryClass;

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

export default function CTASection({
  eyebrow,
  title = "Vraag crew aan of bespreek je planning met Helping Hands Agency.",
  description,
  buttonLabel = "Neem contact op",
  buttonHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="hero-gradient relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] shadow-2xl shadow-[#0B1F4D]/30">
        <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#F28C28]/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-14">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CtaButton href={buttonHref} label={buttonLabel} variant="primary" />
            {secondaryLabel && secondaryHref && (
              <CtaButton
                href={secondaryHref}
                label={secondaryLabel}
                variant="secondary"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
