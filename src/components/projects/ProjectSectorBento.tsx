import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import { cn } from "@/lib/utils";

const bentoCards = [
  {
    title: "Festivals & events",
    text: "Opbouw, afbouw, runners, floor support, hospitality en algemene eventcrew.",
    className: "md:col-span-2 md:row-span-2 min-h-[220px] bg-[linear-gradient(145deg,#0B1F4D_0%,#173A8A_100%)] text-white",
    accent: "bg-[#F28C28]",
    large: true,
  },
  {
    title: "Stagebouw & productie",
    text: "Load-in, load-out, sitecrew, materiaalhandling en productie ondersteuning.",
    className: "bg-white text-[#0B1F4D]",
    accent: "bg-[#173A8A]",
    large: false,
  },
  {
    title: "Horeca & restaurants",
    text: "Bediening, bar, keukenhulp, koks, runners en hospitality support.",
    className: "bg-white text-[#0B1F4D]",
    accent: "bg-[#F28C28]",
    large: false,
  },
  {
    title: "Locaties & stadions",
    text: "Ondersteuning op beursvloeren, arena’s, stadions en eventlocaties.",
    className: "bg-[#F5F7FA] text-[#0B1F4D] md:col-span-1",
    accent: "bg-[#173A8A]",
    large: false,
  },
  {
    title: "Logistiek",
    text: "Materiaalstromen, laad- en losmomenten, runners en voorraadondersteuning.",
    className: "bg-white text-[#0B1F4D] md:col-span-2",
    accent: "bg-[#F28C28]",
    large: false,
  },
] as const;

export default function ProjectSectorBento() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Inzetgebieden
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
              Waar onze crew wordt ingezet
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/75">
              Van festivalcrew tot stagehands en horeca personeel events —
              praktische mensen voor producties door heel Nederland.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          {bentoCards.map((card, index) => (
            <RevealOnScroll key={card.title} delayMs={index * 60}>
              <article
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-slate-200/70 p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-lg sm:p-7",
                  card.className,
                )}
              >
                <div className={cn("mb-4 h-1 w-10 rounded-full", card.accent)} />
                <h3
                  className={cn(
                    "font-black",
                    card.large ? "text-2xl sm:text-3xl" : "text-xl",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 leading-7",
                    card.large ? "text-white/80" : "text-[#101828]/75",
                    card.large ? "text-base sm:text-lg" : "text-sm sm:text-base",
                  )}
                >
                  {card.text}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <p className="mt-8 text-sm text-[#101828]/65">
          Meer weten over onze functies? Bekijk{" "}
          <Link
            href="/diensten"
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            diensten
          </Link>{" "}
          of lees{" "}
          <Link
            href="/over-ons"
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            over ons
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
