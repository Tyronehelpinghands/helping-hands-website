type PortalBannerVariant = "generic" | "intern" | "employee" | "client";

type PortalBannerProps = {
  variant?: PortalBannerVariant;
};

const copy: Record<
  Exclude<PortalBannerVariant, "intern">,
  { badge: string; title: string; detail: string }
> = {
  generic: {
    badge: "Portaal",
    title: "Je bent ingelogd",
    detail:
      "Gebruik het menu om naar je overzicht, planning of berichten te gaan.",
  },
  employee: {
    badge: "Medewerker",
    title: "Medewerkersportaal",
    detail:
      "Bekijk je shifts en uren. Goedkeuring van uren gebeurt via planning.",
  },
  client: {
    badge: "Opdrachtgever",
    title: "Opdrachtgeversportaal",
    detail:
      "Volg aanvragen, planning en factuurstatus. Interne crewgegevens zijn niet zichtbaar.",
  },
};

/**
 * Status banner for client/employee portals.
 * Intern ops dashboard has no banner — it is production, not a demo strip.
 */
export default function PortalBanner({
  variant = "generic",
}: PortalBannerProps) {
  if (variant === "intern") {
    return null;
  }

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
