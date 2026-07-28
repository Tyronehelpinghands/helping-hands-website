type PortalBannerVariant = "generic" | "intern" | "employee" | "client";

type PortalBannerProps = {
  variant?: PortalBannerVariant;
};

const copy: Record<
  PortalBannerVariant,
  { badge: string; title: string; detail: string }
> = {
  generic: {
    badge: "Demo-data",
    title: "Portaal toont voorbeelddata",
    detail:
      "Je bent ingelogd. De schermen gebruiken nog testdata tot de live-integraties zijn gekoppeld.",
  },
  intern: {
    badge: "Demo-data",
    title: "Intern dashboard — voorbeelddata",
    detail:
      "Planning, uren en administratie zijn nog demo-data. Integratie-API’s werken alleen met je echte intern-account.",
  },
  employee: {
    badge: "Demo-data",
    title: "Medewerkersportaal — voorbeelddata",
    detail:
      "Shifts en uren zijn voorbeelddata. Uren goedkeuren gebeurt alleen intern bij planning.",
  },
  client: {
    badge: "Demo-data",
    title: "Opdrachtgeversportaal — voorbeelddata",
    detail:
      "Aanvragen, planning en factuurstatus zijn voorbeelddata. Geen marges of interne crewgegevens.",
  },
};

export default function PortalBanner({
  variant = "generic",
}: PortalBannerProps) {
  const content = copy[variant];

  return (
    <div
      className="border-b border-[#F28C28]/35 bg-[#FFF7ED] px-4 py-3"
      role="status"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm font-semibold text-[#0B1F4D]">
          <span className="mr-2 inline-flex rounded-full bg-[#F28C28] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wide text-white">
            {content.badge}
          </span>
          {content.title}
        </p>
        <p className="text-xs leading-5 text-[#101828]/70 sm:text-right sm:text-sm">
          {content.detail}
        </p>
      </div>
    </div>
  );
}
