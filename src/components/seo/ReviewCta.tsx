import { formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";

type ReviewCtaProps = {
  className?: string;
};

/**
 * NAP + soft review ask for Google Business Profile support.
 * No fake reviews, no review incentives.
 */
export default function ReviewCta({ className = "" }: ReviewCtaProps) {
  return (
    <section
      className={`border-t border-slate-200 bg-[#F5F7FA] py-12 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8">
          <h2 className="text-xl font-black text-[#0B1F4D] sm:text-2xl">
            Helping Hands Agency — NAP & Google-profiel
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#101828]/75">
            {siteConfig.name}
            <br />
            {formatAddressSingleLine()}
            <br />
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#101828]/75">
            Was je tevreden over onze inzet? Laat gerust een review achter. We
            vragen geen nep-reviews en bieden geen beloning voor reviews.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
            >
              Bekijk ons Google bedrijfsprofiel
            </a>
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-6 py-2.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
            >
              Laat een review achter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
