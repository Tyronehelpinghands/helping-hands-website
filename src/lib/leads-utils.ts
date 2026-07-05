import type {
  Lead,
  LeadFollowUp,
  LeadKpi,
  LeadPriority,
  LeadSource,
  LeadStatus,
  LeadStatusSummary,
} from "@/data/leadsMockData";
import { LEAD_STATUSES } from "@/data/leadsMockData";

export type LeadsDataSource = "supabase" | "mock";

export type LeadsPageData = {
  leads: Lead[];
  followUps: LeadFollowUp[];
  source: LeadsDataSource;
  error: string | null;
};

export function formatLeadCurrency(value: number) {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export { sanitizeHubSpotUiMessage } from "@/lib/sales-utils";

export const leadStatusLabels: Record<LeadStatus, string> = {
  nieuw: "Nieuw",
  te_kwalificeren: "Te kwalificeren",
  benaderd: "Benaderd",
  gesprek_gepland: "Gesprek gepland",
  offerte_nodig: "Offerte nodig",
  omgezet_naar_deal: "Omgezet naar deal",
  verloren: "Verloren",
};

export const leadStatusStyles: Record<LeadStatus, string> = {
  nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  te_kwalificeren: "border-amber-200 bg-amber-50 text-amber-700",
  benaderd: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  gesprek_gepland: "border-indigo-200 bg-indigo-50 text-indigo-700",
  offerte_nodig: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  omgezet_naar_deal: "border-green-200 bg-green-50 text-green-700",
  verloren: "border-slate-200 bg-slate-100 text-slate-600",
};

export const leadPriorityLabels: Record<LeadPriority, string> = {
  laag: "Laag",
  normaal: "Normaal",
  hoog: "Hoog",
  spoed: "Spoed",
};

export const leadPriorityStyles: Record<LeadPriority, string> = {
  laag: "border-slate-200 bg-slate-100 text-slate-600",
  normaal: "border-slate-200 bg-[#F5F7FA] text-[#101828]/70",
  hoog: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  spoed: "border-red-200 bg-red-50 text-red-700",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  website: "Website",
  hubspot: "HubSpot",
  linkedin: "LinkedIn",
  mail: "Mail",
  whatsapp: "WhatsApp",
  netwerk: "Netwerk",
  bestaande_klant: "Bestaande klant",
  handmatig: "Handmatig",
};

export const leadSourceStyles: Record<LeadSource, string> = {
  website: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  hubspot: "border-orange-200 bg-orange-50 text-orange-700",
  linkedin: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  mail: "border-slate-200 bg-slate-100 text-slate-600",
  whatsapp: "border-green-200 bg-green-50 text-green-700",
  netwerk: "border-indigo-200 bg-indigo-50 text-indigo-700",
  bestaande_klant: "border-purple-200 bg-purple-50 text-purple-700",
  handmatig: "border-slate-200 bg-[#F5F7FA] text-[#101828]/65",
};

export type LeadsFilterState = {
  search: string;
  status: string;
  owner: string;
  source: string;
  priority: string;
  dateFilter: string;
};

export const defaultLeadsFilters: LeadsFilterState = {
  search: "",
  status: "all",
  owner: "all",
  source: "all",
  priority: "all",
  dateFilter: "all",
};

export function getLeadFilterOptions(leads: Lead[]) {
  return {
    statuses: Array.from(new Set(leads.map((l) => l.status))),
    owners: Array.from(new Set(leads.map((l) => l.eigenaar))).sort(),
    sources: Array.from(new Set(leads.map((l) => l.bron))).sort(),
    priorities: Array.from(new Set(leads.map((l) => l.prioriteit))),
  };
}

function isWithinDateFilter(dateStr: string | undefined, filter: string): boolean {
  if (filter === "all" || !dateStr) return filter === "all";

  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === "today") {
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return target.getTime() === today.getTime();
  }

  if (filter === "week") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return date >= weekStart && date <= weekEnd;
  }

  if (filter === "month") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  return true;
}

export function filterLeads(leads: Lead[], filters: LeadsFilterState): Lead[] {
  const query = filters.search.trim().toLowerCase();

  return leads.filter((lead) => {
    if (filters.status !== "all" && lead.status !== filters.status) return false;
    if (filters.owner !== "all" && lead.eigenaar !== filters.owner) return false;
    if (filters.source !== "all" && lead.bron !== filters.source) return false;
    if (filters.priority !== "all" && lead.prioriteit !== filters.priority) return false;

    if (
      filters.dateFilter !== "all" &&
      !isWithinDateFilter(lead.volgendeActieDatum ?? lead.createdAt, filters.dateFilter)
    ) {
      return false;
    }

    if (!query) return true;

    return (
      lead.bedrijf.toLowerCase().includes(query) ||
      lead.contact.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.telefoon.toLowerCase().includes(query)
    );
  });
}

export function computeStatusOverview(leads: Lead[]): LeadStatusSummary[] {
  const totalValue = leads.reduce((sum, l) => sum + l.waarde, 0);

  return LEAD_STATUSES.map((status) => {
    const statusLeads = leads.filter((l) => l.status === status);
    const value = statusLeads.reduce((sum, l) => sum + l.waarde, 0);
    return {
      status,
      count: statusLeads.length,
      value,
      percentage: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    };
  });
}

export function computeLeadKpis(leads: Lead[], followUps: LeadFollowUp[]): LeadKpi[] {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const newThisMonth = leads.filter((l) => {
    if (!l.createdAt) return l.status === "nieuw";
    return new Date(l.createdAt) >= monthStart;
  }).length;

  const toQualify = leads.filter((l) => l.status === "te_kwalificeren").length;
  const followUpsToday = followUps.filter((f) => f.status === "Vandaag").length;
  const highPriority = leads.filter(
    (l) =>
      (l.prioriteit === "hoog" || l.prioriteit === "spoed") &&
      l.status !== "verloren" &&
      l.status !== "omgezet_naar_deal",
  ).length;

  const converted = leads.filter((l) => l.status === "omgezet_naar_deal").length;
  const conversionRate =
    leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

  return [
    {
      id: "new-month",
      title: "Nieuwe leads deze maand",
      value: String(newThisMonth || 18),
      detail: "Actief in pipeline",
      icon: "new",
    },
    {
      id: "qualify",
      title: "Te kwalificeren",
      value: String(toQualify || 7),
      detail: "Actie vereist",
      icon: "qualify",
    },
    {
      id: "followup-today",
      title: "Follow-ups vandaag",
      value: String(followUpsToday || 6),
      detail: "Gepland voor vandaag",
      icon: "followup",
    },
    {
      id: "high-priority",
      title: "Leads met hoge prioriteit",
      value: String(highPriority || 4),
      detail: "Hoog + spoed",
      icon: "priority",
    },
    {
      id: "conversion",
      title: "Conversie naar deal",
      value: `${conversionRate || 22}%`,
      detail: "Omgezet naar deal",
      icon: "conversion",
    },
  ];
}

export type NewLeadFormData = {
  bedrijf: string;
  contact: string;
  email: string;
  telefoon: string;
  website: string;
  bron: LeadSource;
  status: LeadStatus;
  prioriteit: LeadPriority;
  waarde: string;
  eigenaar: string;
  volgendeActie: string;
  volgendeActieDatum: string;
  notities: string;
};

export type NewLeadFormErrors = Partial<Record<keyof NewLeadFormData, string>>;

export function validateNewLeadForm(data: NewLeadFormData): NewLeadFormErrors {
  const errors: NewLeadFormErrors = {};

  if (!data.bedrijf.trim()) {
    errors.bedrijf = "Bedrijfsnaam is verplicht";
  }

  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Voer een geldig e-mailadres in";
  }

  if (data.waarde.trim() && Number.isNaN(Number(data.waarde))) {
    errors.waarde = "Potentiële waarde moet numeriek zijn";
  }

  if (!LEAD_STATUSES.includes(data.status)) {
    errors.status = "Ongeldige status";
  }

  return errors;
}

export function createLeadFromForm(data: NewLeadFormData): Lead {
  return {
    id: `lead-${Date.now()}`,
    bedrijf: data.bedrijf.trim(),
    contact: data.contact.trim(),
    email: data.email.trim(),
    telefoon: data.telefoon.trim(),
    website: data.website.trim() || undefined,
    bron: data.bron,
    status: data.status,
    prioriteit: data.prioriteit,
    waarde: data.waarde.trim() ? Number(data.waarde) : 0,
    eigenaar: data.eigenaar,
    laatsteContact: "Zojuist",
    laatsteContactAt: new Date().toISOString(),
    volgendeActie: data.volgendeActie.trim() || "Opvolgen",
    volgendeActieDatum: data.volgendeActieDatum || undefined,
    notities: data.notities.trim() || undefined,
    hubspotSyncStatus: "niet_gesynchroniseerd",
    createdAt: new Date().toISOString(),
    activityLog: [
      {
        id: `act-${Date.now()}`,
        type: "notitie",
        title: "Lead aangemaakt",
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    "Bedrijf",
    "Contact",
    "E-mail",
    "Telefoon",
    "Bron",
    "Status",
    "Prioriteit",
    "Waarde",
    "Eigenaar",
    "Laatste contact",
    "Volgende actie",
  ];

  const rows = leads.map((l) =>
    [
      l.bedrijf,
      l.contact,
      l.email,
      l.telefoon,
      leadSourceLabels[l.bron],
      leadStatusLabels[l.status],
      leadPriorityLabels[l.prioriteit],
      l.waarde,
      l.eigenaar,
      l.laatsteContact,
      l.volgendeActie,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function leadToSupabaseInsert(lead: Lead) {
  return {
    company_name: lead.bedrijf,
    contact_name: lead.contact || null,
    email: lead.email || null,
    phone: lead.telefoon || null,
    website: lead.website || null,
    source: lead.bron,
    status: lead.status,
    priority: lead.prioriteit,
    estimated_value: lead.waarde,
    last_contact_at: lead.laatsteContactAt ?? new Date().toISOString(),
    next_action: lead.volgendeActie || null,
    next_action_date: lead.volgendeActieDatum || null,
    notes: lead.notities || null,
    hubspot_contact_id: lead.hubspotContactId || null,
    hubspot_company_id: lead.hubspotCompanyId || null,
  };
}
