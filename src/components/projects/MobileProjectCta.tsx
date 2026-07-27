import Link from "next/link";

/**
 * Sticky mobile CTA for /projecten only.
 * FloatingCTA is hidden on this route when this component is present.
 */
export default function MobileProjectCta() {
  return (
    <div
      data-mobile-project-cta
      className="fixed inset-x-0 bottom-0 z-40 max-w-[100vw] border-t border-white/20 bg-[#0B1F4D]/95 p-3 shadow-2xl backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Personeel
        </Link>
        <Link
          href="/diensten"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28]"
        >
          Diensten
        </Link>
      </div>
    </div>
  );
}
