import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Projecten | Helping Hands Agency",
  description:
    "Crew voor festivals, congressen, horeca-events, stagebouw en productieprojecten.",
};

const projectTypes = [
  {
    title: "Festivals en live events",
    description:
      "Crew voor opbouw, publieksstromen, backstage-ondersteuning en afbouw rond festivals en concerten.",
  },
  {
    title: "Congressen en zakelijke events",
    description:
      "Representatieve medewerkers voor registratie, routing, gastvrijheid en operationele ondersteuning.",
  },
  {
    title: "Horeca en catering",
    description:
      "Versterking voor bars, bediening en runners tijdens drukke serviceperiodes en speciale events.",
  },
  {
    title: "Stagebouw en productie",
    description:
      "Stagehands en assistenten voor technische opbouw, wissels en ondersteuning op de werkvloer.",
  },
  {
    title: "Logistiek en transport",
    description:
      "Ondersteuning bij laden, lossen, materiaalstromen en back-of-house processen.",
  },
  {
    title: "Langdurige producties",
    description:
      "Structurele inzet van crew en teamcaptains voor projecten met meerdere dagen of weken.",
  },
];

export default function ProjectenPage() {
  return (
    <>
      <PageHero
        eyebrow="Projecten"
        title="Van korte inzet tot langere producties."
        description="Helping Hands Agency ondersteunt uiteenlopende projecten in evenementen, horeca, stagebouw, productie en logistiek."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projectTypes.map((project) => (
            <article
              key={project.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 h-2 w-12 rounded-full bg-[#F28C28]" />
              <h2 className="text-xl font-black text-[#173A8A]">{project.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Jouw project"
        title="Vertel ons over je planning en we denken mee over de juiste crew."
        buttonLabel="Bespreek je project"
        buttonHref="/contact"
      />
    </>
  );
}
