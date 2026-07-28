import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { siteConfig } from "@/lib/siteConfig";

export default function MidCta() {
  return (
    <section className="border-y border-slate-200/80 bg-[#F5F7FA] py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black text-[#0B1F4D]">
                Bespreek jouw personeelsplanning
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#101828]/70 sm:text-base">
                Deel je planning en wij denken mee over functies en aantallen.
                Spoed? Bel of app ons direct op{" "}
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {siteConfig.phoneDisplay}
                </a>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
              >
                Bel planning
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
              >
                Personeel aanvragen
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
