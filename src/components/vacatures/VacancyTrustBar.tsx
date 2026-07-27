import RevealOnScroll from "@/components/RevealOnScroll";

const trustItems = [
  {
    title: "Flexibele klussen",
    text: "Oproep- en projectbasis — jij plant mee via beschikbaarheid.",
  },
  {
    title: "Duidelijke briefing",
    text: "Locatie, tijden, kleding en aanspreekpunt vooraf helder.",
  },
  {
    title: "Breed werkveld",
    text: "Events, horeca, keuken, stagebouw, productie en logistiek.",
  },
  {
    title: "Doorgroeien",
    text: "Van eerste klus naar vaste crew of teamcaptain bij goede inzet.",
  },
] as const;

export default function VacancyTrustBar() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-5"
              >
                <p className="text-sm font-black text-[#0B1F4D]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#101828]/70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
