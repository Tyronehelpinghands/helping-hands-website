import Link from "next/link";

const reasons = [
  {
    title: "Praktische crew",
    text: "Mensen die snappen wat er op locatie speelt: timing, communicatie en doorpakken tijdens drukte.",
  },
  {
    title: "Heldere briefing",
    text: "Aankomst, kleding, taken en aanspreekpunt staan vooraf duidelijk. Minder ruis op de vloer.",
  },
  {
    title: "Breed inzetbaar",
    text: "Van event crew en stagehands tot horeca, keuken, bar, productie, logistiek en hospitality.",
  },
  {
    title: "Eén aanspreekpunt",
    text: "Jij plant met Helping Hands; wij regelen bezetting en opvolging zodat jij focust op de productie.",
  },
] as const;

export default function WhyHelpingHands() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Waarom Helping Hands
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl lg:text-5xl">
            Crew die meedenkt, niet alleen invult.
          </h2>
          <p className="mt-5 text-base leading-8 text-[#101828]/75 sm:text-lg">
            Praktisch, betrouwbaar en met korte lijnen — voor opdrachtgevers die
            snel willen schakelen én crew die op locatie weet wat er speelt.
          </p>
          <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
            Helping Hands is in 2022 gestart om jongeren en jongvolwassenen die
            moeilijk aan werk komen, kansen, structuur en begeleiding te geven —
            professioneel op de vloer, menselijk in de aanpak.
          </p>
        </div>

        <aside className="mt-10 max-w-3xl rounded-2xl border border-[#173A8A]/15 bg-[#F5F7FA] px-5 py-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
            Uit de praktijk
          </p>
          <p className="mt-2 text-base font-bold leading-7 text-[#0B1F4D] sm:text-lg">
            Festival load-in &amp; floor support — snelle briefing, duidelijke
            rollen, crew die op tijd stond en doorpakte tijdens drukte.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#101828]/65">
            Concrete projectervaring via jobs en producties — geen
            partnership-claim.
          </p>
        </aside>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="group rounded-2xl border border-slate-200/70 bg-[#F5F7FA]/80 p-6 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:bg-white hover:shadow-md hover:shadow-[#0B1F4D]/5"
            >
              <span className="text-sm font-black text-[#F28C28]">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-xl font-black text-[#0B1F4D]">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#101828]/75">
                {reason.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/over-ons"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
          >
            Meer over ons
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center px-2 text-sm font-bold text-[#173A8A] underline-offset-4 transition hover:text-[#F28C28] hover:underline"
          >
            Personeel aanvragen →
          </Link>
        </div>
      </div>
    </section>
  );
}
