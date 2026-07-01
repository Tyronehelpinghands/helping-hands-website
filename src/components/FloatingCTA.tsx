import Link from "next/link";

export default function FloatingCTA() {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden rounded-2xl border border-white/20 bg-[#0B1F4D] p-3 text-white shadow-2xl shadow-[#0B1F4D]/30 lg:block">
        <Link
          href="/contact"
          className="block rounded-full bg-[#F28C28] px-5 py-3 text-sm font-bold transition hover:scale-[1.02] hover:bg-[#de7c1f] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0B1F4D]"
        >
          Personeel aanvragen
        </Link>
        <Link
          href="/vacatures"
          className="mt-2 block rounded-full px-5 py-2 text-center text-xs font-bold text-white/75 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 focus:ring-offset-[#0B1F4D]"
        >
          Crew aanmelden
        </Link>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/20 bg-[#0B1F4D]/95 p-3 shadow-2xl backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <Link
            href="/contact"
            className="rounded-full bg-[#F28C28] px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Personeel
          </Link>
          <Link
            href="/vacatures"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#F28C28]"
          >
            Werken
          </Link>
        </div>
      </div>
    </>
  );
}
