import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/sections/PageHero";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { ServiceIcon } from "@/components/ServiceIconBadge";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Opdrachtgevers | Helping Hands Agency",
  description:
    "Personeel aanvragen voor evenementen, festivals, stadions, beurzen, restaurants en horecalocaties.",
};

const clientTypes = [
  "Event- en productiebedrijven",
  "Festival- en concertorganisatoren",
  "Horeca- en cateringpartijen",
  "Restaurants en horecalocaties",
  "Beurzen en zakelijke events",
  "Stadion- en locatieproducties",
];

const requestInfo = [
  "Datum",
  "Locatie",
  "Start- en eindtijd",
  "Functie(s)",
  "Aantal mensen",
  "Kledingvoorschriften",
  "Contactpersoon op locatie",
  "Eventuele briefing",
];

const process = [
  {
    step: "01",
    title: "Aanvraag",
    text: "Je deelt datum, locatie, tijden, functies en aantal mensen.",
  },
  {
    step: "02",
    title: "Bezetting",
    text: "Wij stemmen crew af op ervaring, beschikbaarheid en type productie.",
  },
  {
    step: "03",
    title: "Briefing",
    text: "Heldere afspraken over aankomst, kleding, taken en aanspreekpunten.",
  },
  {
    step: "04",
    title: "Uitvoering",
    text: "Crew op locatie — met één vast aanspreekpunt bij Helping Hands.",
  },
];

export default function OpdrachtgeversPage() {
  return (
    <>
      <PageHero content={getPageHeroContent("/opdrachtgevers")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-[#0B1F4D]">Voor wie wij werken</h2>
            <ul className="mt-6 space-y-3">
              {clientTypes.map((item) => (
                <li key={item} className="flex gap-3 text-[#101828]/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0B1F4D]">Welke functies wij leveren</h2>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.title} className="flex items-center gap-3 font-semibold text-[#173A8A]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#173A8A]/15 bg-[#F5F7FA] text-[#173A8A]">
                    <ServiceIcon icon={s.icon} className="h-4 w-4" />
                  </span>
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-8">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Personeel voor restaurants en horeca
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#101828]/75">
            Heb je tijdelijk extra personeel nodig voor bediening, keuken, bar of
            afwas? Helping Hands levert praktische mensen voor piekmomenten,
            ziekte, events, terrasdrukte en tijdelijke bezetting.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#173A8A] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
          >
            Restaurantpersoneel aanvragen
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-[#0B1F4D]">Hoe het aanvraagproces werkt</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-[#0B1F4D] p-6 text-white shadow-lg"
              >
                <span className="text-sm font-black text-[#F28C28]">{item.step}</span>
                <h3 className="mt-2 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-white/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-black text-[#0B1F4D]">
            Welke informatie wij nodig hebben
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {requestInfo.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-[#F5F7FA] px-4 py-3 text-sm font-semibold text-[#101828]"
              >
                <span className="h-2 w-2 rounded-full bg-[#F28C28]" />
                {item}
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
      </section>

      <CTASection
        title="Crew nodig op korte termijn?"
        description="Stuur je planning door en wij denken mee over de juiste bezetting."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
