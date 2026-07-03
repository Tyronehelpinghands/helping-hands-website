import { BrandLogoImage } from "@/components/BrandLogo";
import type { DashboardCard } from "@/lib/portals";

type PortalDashboardProps = {
  cards: DashboardCard[];
};

export default function PortalDashboard({ cards }: PortalDashboardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-[#0B1F4D]/5 transition hover:-translate-y-0.5 hover:border-[#F28C28]/40 hover:shadow-xl"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <BrandLogoImage
                variant="mark"
                imageClassName="mt-0.5 h-7 w-7 shrink-0 opacity-60"
              />
              <h3 className="text-lg font-black text-[#0B1F4D]">{card.title}</h3>
            </div>
            <span className="rounded-xl bg-[#F5F7FA] px-3 py-1 text-sm font-black text-[#173A8A] transition group-hover:bg-[#F28C28] group-hover:text-white">
              {card.value}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#101828]/70">{card.detail}</p>
        </article>
      ))}
    </div>
  );
}
