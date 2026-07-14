import {
  countProjectLogosByCategory,
  projectLogos,
} from "@/lib/projectLogos";

const stats = [
  {
    title: "Events & festivals",
    detail: "Flexibele crew",
    count: countProjectLogosByCategory("Projecten & festivals"),
    countLabel: "projecten & festivals",
  },
  {
    title: "Horeca & restaurant",
    detail: "Snelle schakeling",
    count: projectLogos.filter((l) => l.tags?.includes("Horeca")).length,
    countLabel: "horeca-gerelateerd",
  },
  {
    title: "Stagebouw & productie",
    detail: "Landelijke inzet",
    count: projectLogos.filter(
      (l) => l.tags?.some((t) => ["Productie", "Backstage", "Crew"].includes(t)),
    ).length,
    countLabel: "productie & crew",
  },
  {
    title: "Logistiek & hospitality",
    detail: "Projectmatige planning",
    count: countProjectLogosByCategory("Locaties"),
    countLabel: "locaties",
  },
];

export default function ProjectExperienceStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-[#173A8A]/20 hover:shadow-md"
          >
            <div className="mb-3 h-1 w-10 rounded-full bg-[#F28C28]" />
            <h3 className="text-lg font-black text-[#0B1F4D]">{stat.title}</h3>
            <p className="mt-2 text-sm font-semibold text-[#173A8A]">{stat.detail}</p>
            <p className="mt-3 text-xs text-[#101828]/55">
              {stat.count} {stat.countLabel} in overzicht
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
