import RevealOnScroll from "@/components/RevealOnScroll";

const experienceItems = [
  {
    title: "Events & festivals",
    text: "Crewervaring bij uiteenlopende festival- en eventproducties.",
    accent: "bg-[#F28C28]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M4 19V7l8-3 8 3v12l-8 3-8-3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 4v15" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Stagebouw & productie",
    text: "Ondersteuning bij load-in, load-out, sitecrew en productie.",
    accent: "bg-[#173A8A]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M4 18h16M7 18V9l5-3 5 3v9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 18v-5h4v5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: "Horeca & hospitality",
    text: "Flexibele inzet voor horeca, restaurants, bar en guest support.",
    accent: "bg-[#F28C28]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M7 4v7a3 3 0 0 0 6 0V4M10 14v6M16 4v16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Locaties & stadions",
    text: "Ervaring op grote locaties, beursvloeren, arena’s en evenemententerreinen.",
    accent: "bg-[#173A8A]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M3 19h18M5 19V9l7-4 7 4v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9 19v-5h6v5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
] as const;

export default function ProjectExperienceBar() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {experienceItems.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#F28C28]/35 hover:shadow-md"
              >
                <div className={`mb-4 h-1 w-10 rounded-full ${item.accent}`} />
                <div className="mb-3 text-[#173A8A] transition group-hover:text-[#F28C28]">
                  {item.icon}
                </div>
                <p className="text-lg font-black text-[#0B1F4D]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
