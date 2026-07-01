import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Diensten | Helping Hands Agency",
  description:
    "Event crew, horeca support, stagehands, productie assistentie, logistiek en teamcaptains.",
};

const services = [
  {
    title: "Event crew",
    description:
      "Representatieve medewerkers voor publieksstromen, op- en afbouw en operationele ondersteuning tijdens festivals, congressen en bedrijfsevenementen.",
  },
  {
    title: "Horeca support",
    description:
      "Flexibele versterking voor bars, bediening, runners en gastvrije service op piekmomenten in de horeca.",
  },
  {
    title: "Stagehands",
    description:
      "Aanpakkers voor laden, lossen, bouwen en breken met oog voor veiligheid, tempo en samenwerking op locatie.",
  },
  {
    title: "Productie assistentie",
    description:
      "Ondersteuning voor productieplanningen, crewcoördinatie en praktische uitvoering op de werkvloer.",
  },
  {
    title: "Logistieke ondersteuning",
    description:
      "Betrouwbare handen voor transportbewegingen, materiaalstromen en back-of-house processen.",
  },
  {
    title: "Teamcaptains",
    description:
      "Ervaren aanspreekpunten die teams aansturen, briefings bewaken en snel schakelen met de opdrachtgever.",
  },
];

export default function DienstenPage() {
  return (
    <>
      <PageHero
        eyebrow="Diensten"
        title="Crew en ondersteuning voor elke fase van de operatie."
        description="Helping Hands Agency levert praktische mensen die begrijpen wat er op locatie nodig is: tempo, communicatie en betrouwbaarheid."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 h-2 w-12 rounded-full bg-[#F28C28]" />
              <h2 className="text-xl font-black text-[#173A8A]">{service.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow="Crew nodig?"
        title="Vertel ons welke functies, tijden en locatie je nodig hebt. Wij denken mee over de juiste bezetting."
        buttonLabel="Personeel aanvragen"
        buttonHref="/contact"
      />
    </>
  );
}
