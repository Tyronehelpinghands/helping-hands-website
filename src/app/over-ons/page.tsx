import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Over ons | Helping Hands Agency",
  description:
    "Helping Hands Agency is een Nederlands personeelsbureau voor evenementen, horeca, stagebouw en productie.",
};

const values = [
  {
    title: "Betrouwbaar",
    description:
      "We leveren mensen die op tijd zijn, afspraken nakomen en professioneel optreden op locatie.",
  },
  {
    title: "Duidelijk",
    description:
      "Heldere communicatie over functies, tijden en verwachtingen — voor opdrachtgevers en medewerkers.",
  },
  {
    title: "Praktisch",
    description:
      "We kennen de werkvloer en weten wat er nodig is om een productie soepel te laten draaien.",
  },
];

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Over ons"
        title="Helping Hands Agency — crew met een praktische instelling."
        description="Wij zijn een Nederlands personeelsbureau dat opdrachtgevers ondersteunt met betrouwbare mensen voor evenementen, horeca, stagebouw, productie en logistiek."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-[#173A8A]">Wat we doen</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Helping Hands Agency brengt opdrachtgevers en medewerkers samen voor projecten waar tempo,
            samenwerking en duidelijke afspraken centraal staan. Van een korte horeca-inzet tot een
            grotere productie: we denken mee over bezetting en zorgen voor een heldere briefing.
          </p>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Onze focus ligt op kwaliteit en communicatie. Geen ingewikkelde processen, wel een
            betrouwbare partner die snel kan schakelen wanneer de planning verandert.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-black text-[#173A8A]">{value.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
