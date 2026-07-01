import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import StockImage from "@/components/StockImage";
import { stockImages } from "@/lib/images";

export const metadata: Metadata = {
  title: "Medewerkers | Helping Hands Agency",
  description:
    "Werken bij Helping Hands Agency — event crew, horeca, stagehands en productie op locatie.",
};

const benefits = [
  {
    title: "Werken op evenementen, horeca en producties",
    text: "Van festivals en concerten tot horeca-events en backstage producties.",
  },
  {
    title: "Duidelijke planning",
    text: "Je weet vooraf wanneer je wordt ingezet, waar en in welke functie.",
  },
  {
    title: "Heldere briefing",
    text: "Aankomst, kleding, taken en aanspreekpunten worden vooraf gedeeld.",
  },
  {
    title: "Doorgroeien naar teamcaptain",
    text: "Ervaren crewleden kunnen doorgroeien naar leidinggevende functies op locatie.",
  },
  {
    title: "Betrouwbaarheid en inzet",
    text: "Punctualiteit, communicatie en een professionele houding zijn essentieel.",
  },
];

const roles = [
  "Event crew & floor support",
  "Horeca & hospitality",
  "Stagehands & opbouw",
  "Productie- en logistieke ondersteuning",
  "Teamcaptain",
];

export default function MedewerkersPage() {
  return (
    <>
      <PageHero
        eyebrow="Medewerkers"
        title="Werken bij Helping Hands Agency."
        description="Sluit je aan bij een crew voor evenementen, horeca en producties — met duidelijke afspraken en korte lijnen."
        image={stockImages.crewWorking}
        imageAlt="Crew aan het werk"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-[#F28C28]" />
              <h2 className="text-lg font-black text-[#0B1F4D]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#101828]/75">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#0B1F4D] p-8 text-white">
            <h2 className="text-2xl font-black">Functies waar je kunt inzetten</h2>
            <ul className="mt-6 space-y-3">
              {roles.map((role) => (
                <li key={role} className="flex gap-3 text-white/85">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  {role}
                </li>
              ))}
            </ul>
          </div>
          <StockImage
            src={stockImages.stagehands}
            alt="Stagehands op locatie"
            fill
            className="relative aspect-[4/3] w-full rounded-2xl shadow-xl"
            placeholderLabel="Stagehands"
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-9 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
          >
            Aanmelden als crewlid
          </Link>
        </div>
      </section>

      <CTASection
        title="Klaar om mee te draaien op locatie?"
        description="Meld je aan en vertel ons over je ervaring en beschikbaarheid."
        buttonLabel="Aanmelden als crewlid"
        buttonHref="/contact"
      />
    </>
  );
}
