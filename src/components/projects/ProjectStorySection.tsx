import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

const storyCards = [
  {
    title: "Voorbereiding",
    text: "Een duidelijke briefing, juiste kleding, tijden, locatie en contactpersoon.",
  },
  {
    title: "Uitvoering",
    text: "Crew die weet wat er gevraagd wordt en op locatie praktisch meedraait.",
  },
  {
    title: "Afhandeling",
    text: "Uren, wijzigingen, reiskosten en facturatie overzichtelijk vastgelegd.",
  },
] as const;

export default function ProjectStorySection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Werkwijze
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
              Meer dan alleen logo’s
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/75">
              Voor Helping Hands draait projectervaring niet alleen om namen,
              maar om wat er op locatie nodig is: op tijd zijn, briefing
              begrijpen, samenwerken, aanpakken en netjes opleveren. Of het nu
              gaat om festival crew, stagehands evenementen of crew voor
              stadions — de focus ligt op uitvoerbaarheid.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {storyCards.map((card, index) => (
            <RevealOnScroll key={card.title} delayMs={index * 80}>
              <article className="h-full rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#173A8A]/25 hover:shadow-md">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F28C28]">
                  Stap {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-black text-[#0B1F4D]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#101828]/75">
                  {card.text}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#173A8A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0B1F4D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F28C28] focus-visible:ring-offset-2"
          >
            Personeel aanvragen
          </Link>
        </div>
      </div>
    </section>
  );
}
