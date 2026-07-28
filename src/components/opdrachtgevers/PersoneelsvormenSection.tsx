import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  personeelsvormenIntro,
  personeelsvormenTypes,
  personeelsvormenVerzekering,
} from "@/lib/opdrachtgeversContent";
import { requestVoorwaardenCta } from "@/lib/opdrachtgeversPolicy";

export default function PersoneelsvormenSection() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              {personeelsvormenIntro.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
              {personeelsvormenIntro.title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-[#101828]/75">
              {personeelsvormenIntro.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={80}>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {personeelsvormenTypes.map((type) => (
              <div
                key={type.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-black text-[#0B1F4D]">{type.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">{type.text}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={120}>
          <div className="mt-10 rounded-2xl border border-[#173A8A]/15 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-black text-[#0B1F4D]">
              {personeelsvormenVerzekering.title}
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#101828]/75 sm:text-base sm:leading-8">
              {personeelsvormenVerzekering.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <Link
              href={requestVoorwaardenCta.href}
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A] hover:text-white"
            >
              {requestVoorwaardenCta.label}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
