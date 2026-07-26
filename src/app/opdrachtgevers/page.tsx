import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PhotoBackgroundCard from "@/components/PhotoBackgroundCard";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { ServiceIcon } from "@/components/ServiceIconBadge";
import { services } from "@/lib/content";
import {
  opdrachtgeversCtaPhoto,
  opdrachtgeversFeatured,
  opdrachtgeversHorecaPhoto,
  opdrachtgeversProcessPhotos,
} from "@/lib/crewPhotos";
import { opdrachtgeversFaqs } from "@/lib/faq";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Opdrachtgevers — personeel voor events & horeca",
  description:
    "Event personeel Nederland inhuren: crew evenementen, stagehands, horeca- en restaurantpersoneel. Helder aanvraagproces, briefing en één aanspreekpunt.",
  path: "/opdrachtgevers",
});

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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Opdrachtgevers", path: "/opdrachtgevers" },
        ]}
      />
      <JsonLd data={faqJsonLd(opdrachtgeversFaqs)} />
      <PageHero content={getPageHeroContent("/opdrachtgevers")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
            Voor opdrachtgevers
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#0B1F4D] sm:text-4xl">
            Personeel evenementenbureau én horeca — zonder gedoe op de vloer
          </h2>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Of je nu event crew nodig hebt voor een festivalproductie, stagehands
            voor load-in, of restaurantpersoneel voor piekdrukte: Helping Hands
            Agency bezet praktische functies met duidelijke briefing. Start via{" "}
            <Link
              href="/contact"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              contact
            </Link>
            , bekijk{" "}
            <Link
              href="/diensten"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              alle diensten
            </Link>{" "}
            of ga gericht naar{" "}
            <Link
              href="/diensten/event-crew"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              event crew
            </Link>{" "}
            en{" "}
            <Link
              href="/diensten/horeca-personeel"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              horeca personeel
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
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
          <div className="relative min-h-[18rem] overflow-hidden rounded-2xl shadow-lg lg:min-h-[22rem]">
            <Image
              src={opdrachtgeversFeatured.src}
              alt={opdrachtgeversFeatured.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
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
          <div className="relative min-h-[16rem] overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={opdrachtgeversProcessPhotos[1].src}
              alt={opdrachtgeversProcessPhotos[1].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <PhotoBackgroundCard
          photo={opdrachtgeversHorecaPhoto}
          className="mt-16 min-h-[16rem]"
          overlayClassName="bg-[#0B1F4D]/78"
        >
          <div className="p-8 text-white sm:p-10">
            <h2 className="text-2xl font-black">
              Personeel voor restaurants en horeca
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-white/85">
              Heb je tijdelijk extra personeel nodig voor bediening, keuken, bar of
              afwas? Helping Hands levert praktische mensen voor piekmomenten,
              ziekte, events, terrasdrukte en tijdelijke bezetting.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Restaurantpersoneel aanvragen
            </Link>
          </div>
        </PhotoBackgroundCard>

        <div className="mt-16">
          <h2 className="text-2xl font-black text-[#0B1F4D]">Hoe het aanvraagproces werkt</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => {
              const photo = opdrachtgeversProcessPhotos[index];
              return (
                <PhotoBackgroundCard
                  key={item.title}
                  photo={photo}
                  className="min-h-[14rem]"
                >
                  <div className="flex h-full min-h-[14rem] flex-col justify-end p-6 text-white">
                    <span className="text-sm font-black text-[#F28C28]">{item.step}</span>
                    <h3 className="mt-2 text-lg font-black">{item.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{item.text}</p>
                  </div>
                </PhotoBackgroundCard>
              );
            })}
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

      <FaqSection
        items={opdrachtgeversFaqs}
        title="Vragen van opdrachtgevers"
        description="Over sectoren, briefing en hoe projectervaring op de site bedoeld is."
      />

      <CTASection
        title="Crew nodig op korte termijn?"
        description="Stuur je planning door en wij denken mee over de juiste bezetting."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
        backgroundImage={opdrachtgeversCtaPhoto.src}
        backgroundAlt={opdrachtgeversCtaPhoto.alt}
      />
    </>
  );
}
