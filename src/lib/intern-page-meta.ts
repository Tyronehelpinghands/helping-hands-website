export type InternPageMeta = {
  title: string;
  subtitle: string;
};

const pageMeta: Record<string, InternPageMeta> = {
  "/dashboard/intern": {
    title: "Dashboard",
    subtitle:
      "Centrale cockpit voor planning, crew, uren, facturatie en communicatie.",
  },
  "/dashboard/intern/sales": {
    title: "Sales",
    subtitle: "Beheer opdrachtgevers, leads en follow-ups.",
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
      "Plan crew op events, restaurants en producties — met Shiftbase-sync.",
  },
  "/dashboard/intern/crew": {
    title: "Crew",
    subtitle:
      "Beheer crewleden, beschikbaarheid, functies, certificaten en profielen.",
  },
  "/dashboard/intern/urenregistratie": {
    title: "Urenregistratie",
    subtitle:
      "Controleer uren per project en crewlid, keur goed en bereid facturatie voor.",
  },
  "/dashboard/intern/facturatie": {
    title: "Facturatie",
    subtitle:
      "Maak factuurconcepten op basis van goedgekeurde uren, reiskosten en projectafspraken.",
  },
  "/dashboard/intern/financien": {
    title: "Financiën",
    subtitle:
      "Inzicht in omzet, kosten, marge, openstaande concepten en financiële acties.",
  },
  "/dashboard/intern/risico-acties": {
    title: "Risico & Acties",
    subtitle:
      "Beheer operationele risico's, openstaande acties, deadlines en opvolging.",
  },
  "/dashboard/intern/berichten": {
    title: "Berichten",
    subtitle:
      "Beheer communicatie met crew, opdrachtgevers, sollicitanten en interne planning.",
  },
  "/dashboard/intern/integraties": {
    title: "Integraties",
    subtitle:
      "Supabase, Shiftbase, Gmail, Resend en overige koppelingen — live status.",
  },
  "/dashboard/intern/instellingen": {
    title: "Instellingen",
    subtitle:
      "Beheer bedrijfsgegevens, tarieven, e-mails, koppelingen, meldingen en dashboardvoorkeuren.",
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
