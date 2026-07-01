import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Opdrachtgevers | Helping Hands Agency",
  description:
    "Personeel aanvragen voor evenementen, horeca, stagebouw, productie en logistiek.",
};

const benefits = [
  {
    title: "Snel schakelen",
    description:
      "Korte lijnen en duidelijke afspraken, zodat je op korte termijn crew kunt inzetten wanneer de planning verandert.",
  },
  {
    title: "Eén vast aanspreekpunt",
    description:
      "Je spreekt rechtstreeks met Helping Hands Agency over bezetting, briefing en aanwezigheid op locatie.",
  },
  {
    title: "Praktische selectie",
    description:
      "We kijken naar ervaring, houding en beschikbaarheid, passend bij de functie en de omgeving.",
  },
  {
    title: "Heldere communicatie",
    description:
      "Van aanvraag tot aankomst: functie, timing, kleding en aanspreekpunten worden vooraf afgestemd.",
  },
];

export default function OpdrachtgeversPage() {
  return (
    <>
      <PageHero
        eyebrow="Opdrachtgevers"
        title="Betrouwbare crew wanneer jouw planning vraagt om flexibiliteit."
        description="Voor productieleiders, eventmanagers en horeca-organisatoren die mensen nodig hebben die direct aan de slag kunnen."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-[#173A8A]">
            Zo werken we samen
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Je deelt je vraag, wij denken mee over bezetting en zorgen voor een duidelijke briefing
            richting de crew. Zo houd jij grip op de operatie.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-black text-[#173A8A]">{benefit.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Personeel aanvragen"
        title="Neem contact op en bespreek je planning, functies en beschikbaarheid."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
