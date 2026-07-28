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
            Bijvoorbeeld: load-in en floor support op festivals, of horeca- en
            keukenondersteuning tijdens drukke diensten.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="group rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 transition hover:-translate-y-0.5 hover:border-[#F28C28]/50 hover:bg-white hover:shadow-lg hover:shadow-[#0B1F4D]/5"
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

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            Personeel aanvragen
          </Link>
          <Link
            href="/over-ons"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
          >
            Meer over ons
          </Link>
        </div>
      </div>
    </section>
  );
}
