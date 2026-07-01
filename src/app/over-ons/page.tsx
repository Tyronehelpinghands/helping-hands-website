import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import StockImage from "@/components/StockImage";
import { stockImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Over ons | Helping Hands Agency",
  description:
    "Praktische mensen voor producties waar timing, communicatie en inzet alles bepalen.",
};

const pillars = [
  {
    title: "Gebouwd vanuit praktijkervaring",
    text: "Wij kennen de werkvloer van evenementen, horeca en productie — en weten wat er nodig is als de show moet doorgaan.",
  },
  {
    title: "Timing en communicatie",
    text: "Evenementen draaien op planning, korte lijnen en mensen die snel schakelen. Dat is waar wij op inzetten.",
  },
  {
    title: "Geen anonieme handjes",
    text: "Wij leveren mensen die weten hoe ze zich op locatie moeten gedragen — professioneel, punctueel en teamgericht.",
  },
  {
    title: "Eén aanspreekpunt",
    text: "Opdrachtgevers hebben één vast contact bij Helping Hands voor bezetting, briefing en terugkoppeling.",
  },
  {
    title: "Duidelijke afspraken",
    text: "Functie, tijden, kleding en taken worden vooraf helder afgestemd — voor crew én opdrachtgever.",
  },
  {
    title: "Betrouwbare uitvoering",
    text: "Van aanvraag tot afhandeling: wij zorgen voor structuur in het proces en opvolging na afloop.",
  },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Over ons"
        title="Praktische mensen voor producties waar alles moet kloppen."
        description="Helping Hands Agency is een Nederlands personeelsbureau voor evenementen, horeca, stagebouw, productie en logistiek."
        image={stockImages.crewWorking}
        imageAlt="Helping Hands crew"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-[#0B1F4D]">Wie wij zijn</h2>
            <p className="mt-5 text-lg leading-8 text-[#101828]/75">
              Helping Hands Agency is gebouwd vanuit praktijkervaring in de live branche. Wij
              begrijpen dat evenementen draaien op timing, communicatie en inzet — niet op
              ingewikkelde processen.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#101828]/75">
              Wij leveren geen anonieme handjes, maar mensen die weten hoe ze zich op locatie moeten
              gedragen. Met één aanspreekpunt, duidelijke afspraken en betrouwbare uitvoering.
            </p>
          </div>
          <StockImage
            src={stockImages.heroEvent}
            alt="Event productie"
            fill
            className="relative aspect-[16/10] w-full rounded-2xl shadow-xl"
            placeholderLabel="Events"
          />
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-[#0B1F4D] p-6 text-white shadow-lg"
            >
              <div className="mb-3 h-1 w-8 rounded-full bg-[#F28C28]" />
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        title="Samenwerken met Helping Hands?"
        description="Vraag crew aan of meld je aan als medewerker."
        buttonLabel="Neem contact op"
        buttonHref="/contact"
      />
    </>
  );
}
