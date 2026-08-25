import Link from "next/link";
import { openApplyHref } from "@/lib/vacancies";

/**
 * Sticky mobile CTA for /vacatures only.
 * Body already has pb-20 so this does not cover footer content awkwardly.
 */
export default function MobileVacancyCta() {
  return (
    <div
      data-mobile-vacancy-cta
      className="fixed inset-x-0 bottom-0 z-40 max-w-[100vw] border-t border-white/20 bg-[#0B1F4D]/95 p-3 shadow-2xl backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <Link
          href={openApplyHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Aanmelden
        </Link>
        <Link
          href="#vacatures"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
        >
          Vacatures
        </Link>
      </div>
    </div>
  );
}
