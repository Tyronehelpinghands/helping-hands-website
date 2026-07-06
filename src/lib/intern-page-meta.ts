export type InternPageMeta = {
  title: string;
  subtitle: string;
};

const pageMeta: Record<string, InternPageMeta> = {
  "/dashboard/intern/sales": {
    title: "Sales dashboard",
    subtitle: "Beheer leads, deals, follow-ups en HubSpot synchronisatie.",
  },
  "/dashboard/intern/leads": {
    title: "Leads",
    subtitle:
      "Beheer nieuwe kansen, contactmomenten en opvolging voor Helping Hands Agency.",
  },
  "/dashboard/intern/projecten": {
    title: "Projecten",
    subtitle:
      "Beheer actieve projecten, planning, crewbezetting en projectstatus.",
  },
  "/dashboard/intern/planning": {
    title: "Planning",
    subtitle:
      "Plan crew op events, restaurants en producties met overzicht per dag, week en project.",
  },
};

export function getInternPageMeta(pathname: string): InternPageMeta | null {
  if (pageMeta[pathname]) {
    return pageMeta[pathname];
  }

  for (const [path, meta] of Object.entries(pageMeta)) {
    if (pathname.startsWith(`${path}/`)) {
      return meta;
    }
  }

  return null;
}
