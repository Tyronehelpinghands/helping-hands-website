import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { contactEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Contact | Helping Hands Agency",
  description: "Neem contact op voor personeelsaanvragen of aanmeldingen als medewerker.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Neem contact op met Helping Hands Agency."
        description="Voor personeelsaanvragen, aanmeldingen als medewerker of vragen over samenwerking. We reageren zo snel mogelijk."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#173A8A]">Personeel aanvragen</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Vertel ons welke functies, data en locatie je nodig hebt. We denken mee over de juiste
              bezetting en briefing.
            </p>
            <Link
              href={`mailto:${contactEmail}?subject=Personeel%20aanvragen`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#173A8A]">Aanmelden als medewerker</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Stuur je gegevens en ervaring. We nemen contact op wanneer er passende opdrachten zijn.
            </p>
            <Link
              href={`mailto:${contactEmail}?subject=Aanmelden%20als%20medewerker`}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[#173A8A] px-7 py-3.5 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A] hover:text-white"
            >
              Aanmelden als medewerker
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-[#173A8A] p-8 text-white">
          <h2 className="text-2xl font-black">Direct contact</h2>
          <p className="mt-4 text-white/85">
            E-mail:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
          </p>
          <p className="mt-4 max-w-2xl leading-8 text-white/85">
            Vermeld in je bericht de gewenste functie, beschikbaarheid en eventuele ervaring. Zo
            kunnen we je snel en gericht helpen.
          </p>
        </div>
      </section>
    </>
  );
}
