import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import { applicationsEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Medewerkers | Helping Hands Agency",
  description:
    "Werken bij Helping Hands Agency — event crew, horeca, stagehands en productie op locatie.",
};

const whyWork = [
  "Duidelijke planning",
  "Heldere briefing",
  "Afwisselende opdrachten",
  "Doorgroeien naar teamcaptain",
  "Korte lijnen",
];

const expectations = [
  "Op tijd komen",
  "Afspraken nakomen",
  "Professioneel gedrag",
  "Duidelijke communicatie",
  "Inzet op locatie",
];

const roles = [
  "Event crew",
  "Horeca support",
  "Stagehands",
  "Productie assistentie",
  "Logistiek",
  "Teamcaptain",
];

export default function MedewerkersPage() {
  return (
    <>
      <PageHero
        eyebrow="Medewerkers"
        title="Werken op events, horeca en producties"
        description="Bij Helping Hands Agency werk je op locaties waar geen dag hetzelfde is. Van festivals en concerten tot horeca-events, stadions en backstage producties."
      />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/vacatures"
            className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#de7c1f]"
          >
            Bekijk vacatures
          </Link>
          <a
            href={`mailto:${applicationsEmail}`}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#173A8A] px-8 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#F5F7FA]"
          >
            Aanmelden als crewlid
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Waarom werken bij Helping Hands?
            </h2>
            <ul className="mt-6 space-y-3">
              {whyWork.map((item) => (
                <li key={item} className="flex gap-3 text-[#101828]/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">
              Wat verwachten wij?
            </h2>
            <ul className="mt-6 space-y-3">
              {expectations.map((item) => (
                <li key={item} className="flex gap-3 text-[#101828]/80">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#173A8A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black">
            Functies waarin je kunt werken
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 font-bold transition hover:border-[#F28C28]/40"
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Klaar om mee te draaien op locatie?"
        description="Bekijk de openstaande functies of stuur direct je gegevens naar ons aanmeldingenteam."
        buttonLabel="Bekijk vacatures"
        buttonHref="/vacatures"
        secondaryLabel="Mail je aanmelding"
        secondaryHref={`mailto:${applicationsEmail}`}
      />
    </>
  );
}
