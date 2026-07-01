import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Medewerkers | Helping Hands Agency",
  description: "Meld je aan als medewerker voor evenementen, horeca, stagebouw en productie.",
};

const roles = [
  "Event crew en gastvrijheid",
  "Horeca en bediening",
  "Stagehands en opbouw",
  "Productie- en logistieke ondersteuning",
  "Teamcaptain en leidinggevende functies",
];

const expectations = [
  "Je bent betrouwbaar, punctueel en communicatief.",
  "Je hebt ervaring of de juiste instelling voor live operatie.",
  "Je schakelt snel en werkt mee in een team.",
];

export default function MedewerkersPage() {
  return (
    <>
      <PageHero
        eyebrow="Medewerkers"
        title="Werk mee aan evenementen, horeca en productie op locatie."
        description="Helping Hands Agency zoekt gemotiveerde mensen die praktisch zijn, goed communiceren en zich thuis voelen in een dynamische omgeving."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#173A8A]">Waar je kunt inzetten</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              {roles.map((role) => (
                <li key={role} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#173A8A]">Wat we van je verwachten</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              {expectations.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-[#173A8A] p-8 text-white">
          <h2 className="text-2xl font-black">Aanmelden</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/85">
            Stuur je gegevens en ervaring via het contactformulier of per e-mail. We nemen contact
            op wanneer er passende opdrachten zijn.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
          >
            Aanmelden als medewerker
          </Link>
        </div>
      </section>

      <CTASection
        eyebrow="Interesse?"
        title="Meld je aan en laat weten in welke richting je wilt werken."
        buttonLabel="Neem contact op"
        buttonHref="/contact"
      />
    </>
  );
}
