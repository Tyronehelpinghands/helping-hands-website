const sectors = [
  {
    title: "Events & festivals",
    description:
      "Opbouw, afbouw, crowd support, runners, hospitality en algemene eventcrew.",
  },
  {
    title: "Stagebouw & productie",
    description:
      "Load-in, load-out, sitecrew, logistieke ondersteuning en productie-assistentie.",
  },
  {
    title: "Horeca & restaurants",
    description:
      "Bediening, bar, keukenhulp, zelfstandig werkend koks, spoelkeuken en floor support.",
  },
  {
    title: "Locaties & stadions",
    description:
      "Ondersteuning bij grootschalige locaties, beursvloeren, arena's en evenemententerreinen.",
  },
];

export default function ProjectSectorCards() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
          Waar wij inzetbaar zijn
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#101828]/75">
          Crewervaring strekt zich uit over meerdere sectoren binnen de live branche.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sectors.map((sector) => (
            <article
              key={sector.title}
              className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F28C28]/30 hover:shadow-lg"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-[#173A8A]" />
              <h3 className="text-xl font-black text-[#0B1F4D]">{sector.title}</h3>
              <p className="mt-3 leading-7 text-[#101828]/75">{sector.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
