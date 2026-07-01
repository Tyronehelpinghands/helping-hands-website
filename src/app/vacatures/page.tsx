import type { Metadata } from "next";
import Link from "next/link";
import VacancyFilter from "@/components/VacancyFilter";
import { applicationsEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Vacatures | Werken bij Helping Hands Agency",
  description:
    "Bekijk vacatures bij Helping Hands Agency voor eventmedewerkers, stagehands, horeca support, productie assistenten en teamcaptains.",
};

export default function VacaturesPage() {
  return (
    <>
      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#F28C28]/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Vacatures
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
            Vacatures bij Helping Hands Agency
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/85">
            Werk mee op evenementen, horeca-opdrachten, producties, festivals,
            stadions en backstage locaties.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
            Wij zoeken betrouwbare aanpakkers die op tijd komen, goed
            communiceren en begrijpen dat events draaien op timing, inzet en
            samenwerking.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${applicationsEmail}`}
              className="inline-flex items-center justify-center rounded-full bg-[#F28C28] px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-[#de7c1f]"
            >
              Mail je aanmelding
            </a>
            <Link
              href="/medewerkers"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/35 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur-sm transition hover:bg-white hover:text-[#0B1F4D]"
            >
              Meer over werken bij HH
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <VacancyFilter />

        <div className="mt-16 rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black">Geen passende vacature?</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/75">
            Stuur een open aanmelding met je ervaring, beschikbaarheid en
            voorkeursfunctie naar{" "}
            <a
              href={`mailto:${applicationsEmail}`}
              className="font-bold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {applicationsEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
