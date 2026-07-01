const sectors = [
  {
    title: "Festivals",
    description: "Crew voor opbouw, hospitality, logistiek en floor support.",
  },
  {
    title: "Concerten",
    description: "Stagehands, runners en productieondersteuning.",
  },
  {
    title: "Stadions",
    description: "Grote teams, duidelijke briefing en strakke planning.",
  },
  {
    title: "Beurzen",
    description: "Opbouw, ontvangst, logistiek en praktische ondersteuning.",
  },
  {
    title: "Horeca",
    description: "Barbacks, runners, bediening en uitgifte.",
  },
  {
    title: "Producties",
    description: "Backstage, runners, materiaal en crewcoordinatie.",
  },
];

export default function SectorCards() {
  return (
    <section className="border-y border-[#F28C28]/20 bg-[#0B1F4D] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {sectors.map((sector) => (
          <article
            key={sector.title}
            className="group cursor-default rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition hover:-translate-y-1 hover:border-[#F28C28]/60 hover:bg-[#173A8A] hover:shadow-xl"
          >
            <span className="block h-1 w-8 rounded-full bg-[#F28C28] transition group-hover:w-12" />
            <h3 className="mt-3 text-base font-black">{sector.title}</h3>
            <p className="mt-2 max-h-0 overflow-hidden text-sm leading-6 text-white/75 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 sm:max-h-24 sm:opacity-100">
              {sector.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
