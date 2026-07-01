import Link from "next/link";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export default function CTASection({
  eyebrow = "Klaar voor de volgende productie?",
  title = "Vraag crew aan of bespreek je planning met Helping Hands Agency.",
  buttonLabel = "Neem contact op",
  buttonHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="hero-gradient mx-auto max-w-5xl overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-2xl shadow-[#0B1F4D]/25 sm:px-12">
        <div className="relative">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#F28C28]/20 blur-3xl" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
          <Link
            href={buttonHref}
            className="relative mt-8 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#de7c1f]"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
