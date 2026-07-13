import Link from "next/link";
import { Building2, ShieldCheck, Users } from "lucide-react";
import PortalBanner from "@/components/PortalBanner";
import PortalHeroMark from "@/components/PortalHeroMark";
import { LOGIN_PORTAL_CARDS } from "@/lib/authRedirects";

const cardIcons = {
  intern: ShieldCheck,
  medewerker: Users,
  opdrachtgever: Building2,
} as const;

export const metadata = {
  title: "Portalen | Helping Hands Agency",
  description:
    "Kies intern dashboard, medewerkersportaal of opdrachtgeversportaal.",
};

export default function PortaalPage() {
  return (
    <>
      <PortalBanner />
      <PortalHeroMark
        label="Portalen"
        title="Helping Hands Portalen"
        description="Kies het portaal dat bij jouw rol hoort. Demo-login is beschikbaar; echte auth volgt later."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {LOGIN_PORTAL_CARDS.map((card) => {
            const Icon = cardIcons[card.portalType];
            return (
              <article
                key={card.portalType}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:border-[#F28C28]/40 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#173A8A]/15 bg-[#F5F7FA] text-[#173A8A]">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-black text-[#0B1F4D]">{card.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[#101828]/75">
                  {card.description}
                </p>
                <p className="mt-2 text-xs text-slate-500">Voor: {card.audience}</p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={`/login?type=${card.portalType}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#173A8A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0B1F4D]"
                  >
                    {card.buttonLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
