type PortalBannerVariant = "generic" | "intern" | "employee" | "client";

type PortalBannerProps = {
  variant?: PortalBannerVariant;
  /** Toon of demo-API (integraties) aan staat. */
  apiEnabled?: boolean;
};

const copy: Record<
  PortalBannerVariant,
  { badge: string; title: string; detail: string }
> = {
  generic: {
    badge: "Demo",
    title: "Portaal in demo-modus",
    detail:
      "UI-demo voor presentatie. Geen productie-data; echte auth en rechten volgen.",
  },
  intern: {
    badge: "Demo intern",
    title: "Intern dashboard — demo",
    detail:
      "Planning, urengoedkeuring en administratie zijn demo-data. Integratie-API’s werken alleen met echte intern-login of ALLOW_DEMO_API_ACCESS.",
  },
  employee: {
    badge: "Demo crew",
    title: "Medewerkersportaal — demo",
    detail:
      "Bekijk shifts en uren. Goedkeuren van uren gebeurt alleen intern bij planning — niet in dit portaal.",
  },
  client: {
    badge: "Demo klant",
    title: "Opdrachtgeversportaal — demo",
    detail:
      "Aanvragen, planning en factuurstatus. Geen marges, uurtarieven of interne crewgegevens.",
  },
};

export default function PortalBanner({
  variant = "generic",
  apiEnabled = false,
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
          {variant === "intern" ? (
            <span className="mt-0.5 block font-medium text-[#9a3412]">
              Integratie-API: {apiEnabled ? "aan (demo)" : "uit (veilig default)"}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
