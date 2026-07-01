import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { contactEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Contact | Helping Hands Agency",
  description:
    "Neem contact op voor personeelsaanvragen of aanmeldingen als crewlid.",
};

const clientFields = [
  "Datum",
  "Locatie",
  "Tijden",
  "Functies",
  "Aantal mensen",
  "Kleding/briefing",
  "Contactpersoon",
];

const workerFields = [
  "Naam",
  "E-mail",
  "Telefoon",
  "Woonplaats",
  "Ervaring",
  "Beschikbaarheid",
  "ZZP of loondienst",
];

function FieldList({ fields }: { fields: string[] }) {
  return (
    <ul className="mt-6 space-y-2">
      {fields.map((field) => (
        <li
          key={field}
          className="flex items-center gap-3 rounded-xl bg-[#F5F7FA] px-4 py-3 text-sm font-medium text-[#101828]"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#F28C28]" />
          {field}
        </li>
      ))}
    </ul>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Neem contact op met Helping Hands Agency."
        description="Voor personeelsaanvragen, aanmeldingen als crewlid of vragen over samenwerking."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">Personeel aanvragen</h2>
            <p className="mt-3 text-[#101828]/75">
              Stuur onderstaande informatie mee in je bericht. Wij denken mee over planning en
              bezetting.
            </p>
            <FieldList fields={clientFields} />
            <Link
              href={`mailto:${contactEmail}?subject=Personeel%20aanvragen&body=Datum%3A%0ALocatie%3A%0ATijden%3A%0AFuncties%3A%0AAantal%20mensen%3A%0AKleding%2Fbriefing%3A%0AContactpersoon%3A`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#F28C28] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#de7c1f] sm:w-auto"
            >
              Personeel aanvragen
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-black text-[#0B1F4D]">Aanmelden als medewerker</h2>
            <p className="mt-3 text-[#101828]/75">
              Stuur je gegevens en ervaring. We nemen contact op bij passende opdrachten.
            </p>
            <FieldList fields={workerFields} />
            <Link
              href={`mailto:${contactEmail}?subject=Aanmelden%20als%20medewerker&body=Naam%3A%0AE-mail%3A%0ATelefoon%3A%0AWoonplaats%3A%0AErvaring%3A%0ABeschikbaarheid%3A%0AZZP%20of%20loondienst%3A`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border-2 border-[#173A8A] px-7 py-4 text-sm font-bold text-[#173A8A] transition hover:bg-[#173A8A] hover:text-white sm:w-auto"
            >
              Aanmelden als crewlid
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
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
          <p className="mt-4 max-w-2xl leading-8 text-white/75">
            Vermeld in je bericht de relevante gegevens uit de lijst hierboven. Zo kunnen we je
            snel en gericht helpen.
          </p>
        </div>
      </section>
    </>
  );
}
