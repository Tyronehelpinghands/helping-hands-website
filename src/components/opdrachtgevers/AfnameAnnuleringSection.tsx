import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { minimumAfnameText } from "@/lib/opdrachtgeversContent";
import { cancellationCases, requestVoorwaardenCta } from "@/lib/opdrachtgeversPolicy";

export default function AfnameAnnuleringSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Minimale afname en annuleringen
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              Duidelijke afspraken, geen verrassingen achteraf
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={60}>
          <div className="mt-8 max-w-3xl rounded-2xl border border-[#173A8A]/15 bg-[#F5F7FA] px-5 py-5 sm:px-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
              Minimale afname
            </p>
            <p className="mt-2 text-base leading-7 text-[#0B1F4D] sm:text-lg">
              {minimumAfnameText}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {cancellationCases.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-5"
              >
                <h3 className="text-base font-black text-[#0B1F4D]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={140}>
          <p className="mt-8 max-w-2xl text-sm leading-6 text-[#101828]/65">
            De volledige afname-, wijzigings- en annuleringsvoorwaarden staan in
            de opdrachtbevestiging en onze algemene voorwaarden.{" "}
            <Link
              href={requestVoorwaardenCta.href}
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              {requestVoorwaardenCta.label}
            </Link>
            .
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
