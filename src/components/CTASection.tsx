import Link from "next/link";
import StockImage from "@/components/StockImage";
import { stockImages } from "@/lib/images";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  image?: string;
  imageAlt?: string;
};

export default function CTASection({
  eyebrow,
  title = "Vraag crew aan of bespreek je planning met Helping Hands Agency.",
  description,
  buttonLabel = "Neem contact op",
  buttonHref = "/contact",
  image = stockImages.ctaProduction,
  imageAlt = "Productie crew op locatie",
}: CTASectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="hero-gradient relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] shadow-2xl shadow-[#0B1F4D]/30">
        <div className="grid lg:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center px-6 py-14 text-white sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#F28C28]/25 blur-3xl" />
            <div className="relative">
              {eyebrow && (
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                  {eyebrow}
                </p>
              )}
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              {description && (
                <p className="mt-5 text-lg leading-8 text-white/80">{description}</p>
              )}
              <Link
                href={buttonHref}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-9 py-4 text-sm font-bold text-white shadow-xl shadow-black/25 transition hover:bg-[#de7c1f]"
              >
                {buttonLabel}
              </Link>
            </div>
          </div>
          <StockImage
            src={image}
            alt={imageAlt}
            fill
            className="relative min-h-[240px] lg:min-h-full"
            placeholderLabel="Productie"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
