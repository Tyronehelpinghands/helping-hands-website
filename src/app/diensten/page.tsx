import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/sections/FaqSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import PageHero from "@/components/sections/PageHero";
import ServicesSection from "@/components/sections/ServicesSection";
import { dienstenFaqs } from "@/lib/faq";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { getPublishedServiceLandings } from "@/lib/services";

export const metadata: Metadata = buildPageMetadata({
  title: "Diensten",
  description:
    "Diensten van Helping Hands Agency: event crew, stagehands, horeca- en restaurantpersoneel, keuken, bar, productie, logistiek en hospitality in Nederland.",
  path: "/diensten",
});

export default function DienstenPage() {
  const landings = getPublishedServiceLandings();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Diensten", path: "/diensten" },
        ]}
      />
      <JsonLd data={faqJsonLd(dienstenFaqs)} />
      <PageHero content={getPageHeroContent("/diensten")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Overzicht
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0B1F4D] sm:text-4xl">
            Crew voor elke fase van je productie
          </h2>
          <p className="mt-4 leading-8 text-[#101828]/75">
            Van stagebouw en productie tot horeca, keuken, bar en hospitality:
            kies een categorie hieronder of filter verder op concrete functies.
            Zoek je gericht event crew, stagehands of horeca personeel? Start via
            de landings.
          </p>
        </div>

        {landings.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landings.map((landing) => (
              <Link
                key={landing.slug}
                id={landing.anchorId}
                href={landing.path}
                className="group scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-[#F28C28]/45 hover:shadow-md"
              >
                <div className="relative aspect-[16/9] bg-slate-100">
                  <Image
                    src={landing.image.src}
                    alt={landing.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                    {landing.category}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-[#0B1F4D]">
                    {landing.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                    {landing.hubSummary}
                  </p>
                  <span className="mt-4 inline-flex text-sm font-bold text-[#173A8A] transition group-hover:text-[#F28C28]">
                    Bekijk {landing.category.toLowerCase()} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <div id="functies" className="mt-16 scroll-mt-28">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Zoek op functie
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#101828]/70">
            Filter op categorie en open een functie voor details. Klaar om aan te
            vragen? Ga naar Personeel aanvragen.
          </p>
          <div className="mt-8">
            <ServicesSection showAllWhenAlle />
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#0B1F4D] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-black">Snel de juiste functie ingezet</h2>
            <p className="mt-4 max-w-2xl leading-8 text-white/75">
              Vertel ons welke crew je nodig hebt — wij denken mee over bezetting,
              briefing en planning op locatie. Zo werkt het in het kort:
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Planning",
                  text: "Datum, locatie, functies en aantallen afstemmen.",
                },
                {
                  title: "Briefing",
                  text: "Taken, kleding, PBM en aanspreekpunt duidelijk maken.",
                },
                {
                  title: "Uitvoering",
                  text: "Crew op locatie met korte lijnen naar Helping Hands.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-[#173A8A]/40 px-4 py-4 text-center"
                >
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/opdrachtgevers"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/40 px-7 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                Zo werken wij voor opdrachtgevers
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
              >
                Personeel aanvragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        items={dienstenFaqs}
        title="Veelgestelde vragen over inhuren"
        description="Kort over sectoren, wat je aanlevert en hoe een aanvraag werkt."
      />

      <CTASection
        title="Welke crew heb jij nodig?"
        description="Stuur je datum, locatie, tijden, functies en aantal mensen door."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
