import type { Metadata } from "next";
import VacancyFilter from "@/components/VacancyFilter";
import PageHero from "@/components/sections/PageHero";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { applicationsEmail } from "@/lib/navigation";
import { restaurantVacancyGroups } from "@/lib/vacancies";

export const metadata: Metadata = {
  title: "Vacatures | Werken bij Helping Hands Agency",
  description:
    "Vacatures bij Helping Hands Agency voor events, restaurants, keukens, bediening, bar en leidinggevende horecafuncties.",
};

export default function VacaturesPage() {
  return (
    <>
      <PageHero content={getPageHeroContent("/vacatures")} />

      <section
        id="vacatures"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-[#0B1F4D]/5 sm:p-8">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Ook voor restaurants en horeca
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[#101828]/75">
            Naast eventcrew levert Helping Hands Agency ook personeel voor
            restaurants, keukens, bediening, bar, afwas en leidinggevende
            horecafuncties. Van extra handen tijdens piekmomenten tot ervaren
            koks en floor managers op aanvraag.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {restaurantVacancyGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-xl border border-slate-200/80 bg-[#F5F7FA] p-5"
              >
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#F28C28]">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.roles.map((role) => (
                    <li
                      key={role}
                      className="flex gap-2 text-sm text-[#101828]/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#173A8A]" />
                      {role}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <VacancyFilter />
        </div>

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
