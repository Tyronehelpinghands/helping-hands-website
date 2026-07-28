import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  briefingChecklistGroups,
  briefingClosingNote,
} from "@/lib/opdrachtgeversContent";

export default function BriefingChecklistSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Checklist
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
              Benodigde opdrachtinformatie
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#101828]/70 sm:text-base">
              {briefingClosingNote}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {briefingChecklistGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#173A8A]">
                    {group.title}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-6 text-[#101828]/80"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#F28C28] text-[10px] font-black text-white"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
