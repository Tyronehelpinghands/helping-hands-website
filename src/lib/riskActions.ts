// TODO: Supabase risk_actions tabel
// TODO: Automatische acties vanuit planning
// TODO: Automatische acties vanuit urenregistratie
// TODO: Automatische acties vanuit facturatie/Moneybird
// TODO: Automatische acties vanuit Shiftbase
// TODO: Notificaties via e-mail/WhatsApp
// TODO: Taken toewijzen aan gebruikers
// TODO: Deadline reminders
// TODO: Weekstart rapportage
// TODO: Audit log per actie
// TODO: later koppelen aan echte auth/rollen zodat alleen interne admins/planners risico's en acties kunnen bekijken

export type RiskCategory =
  | "Planning"
  | "Crew"
  | "Financieel"
  | "Facturatie"
  | "Veiligheid"
  | "Klant"
  | "Contract"
  | "Compliance"
  | "Operationeel"
  | "Marketing"
  | "Systeem";

export type RiskPriority = "Laag" | "Normaal" | "Hoog" | "Kritiek";

export type RiskLevel = "Laag" | "Middel" | "Hoog" | "Kritiek";

export type RiskStatus =
  | "Nieuw"
  | "Open"
  | "In behandeling"
  | "Wacht op reactie"
  | "Afgerond"
  | "Geparkeerd";

export type RelatedModule =
  | "Planning"
  | "Crew"
  | "Urenregistratie"
  | "Facturatie"
  | "Financiën"
  | "Projecten"
  | "Sales"
  | "Leads";

export type RiskAction = {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  priority: RiskPriority;
  status: RiskStatus;
  riskLevel: RiskLevel;
  owner: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  relatedModule?: RelatedModule;
  relatedProject?: string;
  relatedClient?: string;
  actionRequired: string;
  impact?: string;
  nextStep?: string;
  notes?: string;
};

export type RiskFilters = {
  search: string;
  category: string;
  priority: string;
  status: string;
  riskLevel: string;
  module: string;
  deadline: string;
};

export const defaultRiskFilters: RiskFilters = {
  search: "",
  category: "Alle",
  priority: "Alle",
  status: "Alle",
  riskLevel: "Alle",
  module: "Alle",
  deadline: "Alle",
};

export const RISK_CATEGORIES: RiskCategory[] = [
  "Planning",
  "Crew",
  "Financieel",
  "Facturatie",
  "Veiligheid",
  "Klant",
  "Contract",
  "Compliance",
  "Operationeel",
  "Marketing",
  "Systeem",
];

export const RISK_PRIORITIES: RiskPriority[] = [
  "Laag",
  "Normaal",
  "Hoog",
  "Kritiek",
];

export const RISK_LEVELS: RiskLevel[] = ["Laag", "Middel", "Hoog", "Kritiek"];

export const RISK_STATUSES: RiskStatus[] = [
  "Nieuw",
  "Open",
  "In behandeling",
  "Wacht op reactie",
  "Afgerond",
  "Geparkeerd",
];

export const RELATED_MODULES: RelatedModule[] = [
  "Planning",
  "Crew",
  "Urenregistratie",
  "Facturatie",
  "Financiën",
  "Projecten",
  "Sales",
  "Leads",
];

export const DEMO_OWNERS = [
  "Demo Planner",
  "Demo Admin",
  "Demo Finance",
  "Demo Sales",
  "Demo Operations",
] as const;

export type RiskStats = {
  openActions: number;
  criticalRisks: number;
  overdue: number;
  waitingForResponse: number;
  completedThisMonth: number;
  dueThisWeek: number;
};

export type RiskTimelineEvent = {
  id: string;
  actionId: string;
  title: string;
  description: string;
  timestamp: string;
  type: "created" | "status" | "deadline" | "completed" | "waiting";
};

export type RiskAttentionPoint = {
  id: string;
  label: string;
  actionId: string;
  severity: "info" | "warning" | "critical";
};

export type RiskFormData = {
  title: string;
  description: string;
  category: RiskCategory;
  priority: RiskPriority;
  riskLevel: RiskLevel;
  status: RiskStatus;
  owner: string;
  dueDate: string;
  relatedModule: string;
  relatedProject: string;
  relatedClient: string;
  impact: string;
  actionRequired: string;
  nextStep: string;
  notes: string;
};

export const MODULE_LINKS: Record<RelatedModule, string> = {
  Planning: "/dashboard/intern/planning",
  Crew: "/dashboard/intern/crew",
  Urenregistratie: "/dashboard/intern/urenregistratie",
  Facturatie: "/dashboard/intern/facturatie",
  "Financiën": "/dashboard/intern/financien",
  Projecten: "/dashboard/intern/projecten",
  Sales: "/dashboard/intern/sales",
  Leads: "/dashboard/intern/leads",
};

function item(
  id: string,
  title: string,
  description: string,
  category: RiskCategory,
  priority: RiskPriority,
  status: RiskStatus,
  riskLevel: RiskLevel,
  owner: string,
  actionRequired: string,
  createdAt: string,
  extras?: Partial<RiskAction>,
): RiskAction {
  return {
    id,
    title,
    description,
    category,
    priority,
    status,
    riskLevel,
    owner,
    actionRequired,
    createdAt,
    ...extras,
  };
}

export const demoRiskActions: RiskAction[] = [
  item(
    "risk-001",
    "Openstaande crewbezetting voor weekendproject",
    "Nog niet alle functies zijn bevestigd voor het aankomende weekend.",
    "Planning",
    "Hoog",
    "Open",
    "Hoog",
    "Demo Planner",
    "Crew beschikbaarheid controleren en kandidaten bellen.",
    "2026-07-08",
    {
      dueDate: "2026-07-12",
      relatedModule: "Planning",
      relatedProject: "GelreDome Arnhem",
      relatedClient: "Demo Klant 1",
      impact: "Project kan onderbezet raken.",
      nextStep: "Beschikbaarheid crewmodule controleren.",
      updatedAt: "2026-07-10T09:00:00",
    },
  ),
  item(
    "risk-002",
    "Onvolledige medewerkergegevens",
    "Bij enkele crewleden ontbreken certificaten, adresgegevens of dienstverbandinformatie.",
    "Crew",
    "Normaal",
    "In behandeling",
    "Middel",
    "Demo Operations",
    "Profielen aanvullen in crewmodule.",
    "2026-07-05",
    {
      dueDate: "2026-07-18",
      relatedModule: "Crew",
      nextStep: "Ontbrekende velden per crewlid nalopen.",
      updatedAt: "2026-07-09T14:30:00",
    },
  ),
  item(
    "risk-003",
    "Openstaande facturen controleren",
    "Er staan facturen open die opgevolgd moeten worden.",
    "Financieel",
    "Hoog",
    "Open",
    "Hoog",
    "Demo Finance",
    "Controleer Moneybird en stuur herinneringen waar nodig.",
    "2026-07-06",
    {
      dueDate: "2026-07-11",
      relatedModule: "Financiën",
      relatedClient: "Demo Klant 2",
      impact: "Cashflow en debiteurenbeheer.",
      nextStep: "Openstaande facturen in financiënmodule bekijken.",
      updatedAt: "2026-07-10T11:00:00",
    },
  ),
  item(
    "risk-004",
    "Uren nog niet gefactureerd",
    "Goedgekeurde uren zijn nog niet verwerkt naar factuurconcept.",
    "Facturatie",
    "Hoog",
    "Open",
    "Hoog",
    "Demo Finance",
    "Maak factuurconcept aan in facturatiemodule.",
    "2026-07-07",
    {
      dueDate: "2026-07-14",
      relatedModule: "Facturatie",
      relatedProject: "Amsterdam RAI",
      relatedClient: "Demo Klant 1",
      nextStep: "Goedgekeurde uren exporteren naar factuurconcept.",
    },
  ),
  item(
    "risk-005",
    "Certificaatcontrole voor technische inzet",
    "Voor heftruck/hoogwerker/VCA-inzet moet certificering gecontroleerd worden.",
    "Veiligheid",
    "Kritiek",
    "Nieuw",
    "Kritiek",
    "Demo Operations",
    "Controleer certificaten voordat crew wordt ingepland.",
    "2026-07-11",
    {
      dueDate: "2026-07-13",
      relatedModule: "Crew",
      relatedProject: "Load-out productie",
      impact: "Veiligheidsrisico bij inzet zonder certificaat.",
      nextStep: "Certificaten in crewprofielen verifiëren.",
    },
  ),
  item(
    "risk-006",
    "Briefing ontbreekt van opdrachtgever",
    "Locatie-informatie, kledingvoorschrift en contactpersoon zijn nog niet bevestigd.",
    "Klant",
    "Hoog",
    "Wacht op reactie",
    "Middel",
    "Demo Sales",
    "Briefing opvragen bij opdrachtgever.",
    "2026-07-04",
    {
      dueDate: "2026-07-10",
      relatedModule: "Projecten",
      relatedProject: "Horeca event Scheveningen",
      relatedClient: "Demo Horeca Klant",
      nextStep: "Opdrachtgever bellen voor ontbrekende briefing.",
      updatedAt: "2026-07-08T16:00:00",
    },
  ),
  item(
    "risk-007",
    "Nieuwe samenwerkingsovereenkomst controleren",
    "Nieuwe opdrachtgevervoorwaarden moeten intern worden beoordeeld.",
    "Contract",
    "Normaal",
    "Open",
    "Middel",
    "Demo Admin",
    "Controleer tarieven, annulering, betalingstermijn en aansprakelijkheid.",
    "2026-07-02",
    {
      dueDate: "2026-07-20",
      relatedClient: "Demo Productie Klant",
      nextStep: "Contractvoorwaarden intern bespreken.",
    },
  ),
  item(
    "risk-008",
    "ZZP/loondienst risico controleren",
    "Bij structurele inzet moet worden gecontroleerd of de samenwerking juist is ingericht.",
    "Compliance",
    "Hoog",
    "Open",
    "Hoog",
    "Demo Admin",
    "Controleer dienstverband, facturatie en afspraken.",
    "2026-07-01",
    {
      dueDate: "2026-07-15",
      relatedModule: "Crew",
      impact: "Juridisch en fiscaal risico.",
      nextStep: "Dienstverbanden per crewlid reviewen.",
    },
  ),
  item(
    "risk-009",
    "Materiaal/PBM controle",
    "Voor bepaalde klussen is zwarte kleding, veiligheidsschoeisel of PBM vereist.",
    "Operationeel",
    "Normaal",
    "Open",
    "Middel",
    "Demo Operations",
    "Controleer briefing en communiceer naar crew.",
    "2026-07-09",
    {
      dueDate: "2026-07-16",
      relatedProject: "Festivalterrein",
      relatedClient: "Demo Klant 3",
      nextStep: "PBM-lijst delen met ingeplande crew.",
    },
  ),
  item(
    "risk-010",
    "Shiftbase koppeling controleren",
    "Planning en urenregistratie moeten later worden gesynchroniseerd met Shiftbase.",
    "Systeem",
    "Normaal",
    "Geparkeerd",
    "Laag",
    "Demo Admin",
    "API-koppeling testen en rechten controleren.",
    "2026-06-20",
    {
      relatedModule: "Planning",
      notes: "Wacht op productie API-token en rechten.",
      updatedAt: "2026-07-01T10:00:00",
    },
  ),
  item(
    "risk-011",
    "Urenregistratie afwijkingen",
    "Verschil tussen ingeplande en geregistreerde uren bij weekendproject.",
    "Planning",
    "Hoog",
    "In behandeling",
    "Hoog",
    "Demo Planner",
    "Vergelijk planning met urenregistratie en corrigeer afwijkingen.",
    "2026-07-08",
    {
      dueDate: "2026-07-12",
      relatedModule: "Urenregistratie",
      relatedProject: "Johan Cruijff ArenA",
      updatedAt: "2026-07-10T08:30:00",
    },
  ),
  item(
    "risk-012",
    "Lead opvolging vertraagd",
    "Demo lead heeft meer dan 5 dagen geen opvolging gehad.",
    "Marketing",
    "Normaal",
    "Open",
    "Middel",
    "Demo Sales",
    "Neem contact op en plan vervolgafspraak.",
    "2026-07-07",
    {
      dueDate: "2026-07-11",
      relatedModule: "Leads",
      relatedClient: "Demo Klant 2",
      nextStep: "Lead openen in leads-module.",
    },
  ),
  item(
    "risk-013",
    "Projectbudget overschrijding risico",
    "Crewkosten lopen hoger dan begroot voor lopend project.",
    "Financieel",
    "Hoog",
    "In behandeling",
    "Hoog",
    "Demo Finance",
    "Vergelijk crewkosten met projectbudget en plan bijsturing.",
    "2026-07-03",
    {
      dueDate: "2026-07-09",
      relatedModule: "Projecten",
      relatedProject: "Restaurant ondersteuning",
      relatedClient: "Demo Klant 1",
      updatedAt: "2026-07-10T13:00:00",
    },
  ),
  item(
    "risk-014",
    "Sales deal zonder offerte",
    "Deal in pipeline zonder formele offerte of tariefafspraak.",
    "Marketing",
    "Normaal",
    "Wacht op reactie",
    "Middel",
    "Demo Sales",
    "Offerte opstellen en versturen naar opdrachtgever.",
    "2026-07-06",
    {
      dueDate: "2026-07-15",
      relatedModule: "Sales",
      relatedClient: "Demo Productie Klant",
    },
  ),
  item(
    "risk-015",
    "Moneybird conceptfacturen controleren",
    "Conceptfacturen wachten op interne controle voor verzending.",
    "Facturatie",
    "Normaal",
    "Open",
    "Middel",
    "Demo Finance",
    "Controleer factuurconcepten en stuur naar Moneybird.",
    "2026-07-10",
    {
      dueDate: "2026-07-17",
      relatedModule: "Facturatie",
      relatedClient: "Demo Klant 3",
    },
  ),
  item(
    "risk-016",
    "Weekplanning niet gedeeld met crew",
    "Crew heeft weekrooster nog niet ontvangen voor komende week.",
    "Planning",
    "Hoog",
    "Open",
    "Middel",
    "Demo Planner",
    "Deel planning en bevestig ontvangst met crew.",
    "2026-07-09",
    {
      dueDate: "2026-07-11",
      relatedModule: "Planning",
      nextStep: "Rooster exporteren en versturen.",
    },
  ),
  item(
    "risk-017",
    "Verzekering en aansprakelijkheid check",
    "Nieuwe locatie vereist extra aansprakelijkheidscheck.",
    "Compliance",
    "Laag",
    "Afgerond",
    "Laag",
    "Demo Admin",
    "Verzekeringsdekking gecontroleerd en gedocumenteerd.",
    "2026-06-28",
    {
      dueDate: "2026-07-05",
      relatedProject: "Amsterdam RAI",
      updatedAt: "2026-07-05T17:00:00",
      notes: "Afgerond — dekking bevestigd.",
    },
  ),
  item(
    "risk-018",
    "Reiskosten afwijking controleren",
    "Kilometervergoedingen wijken af van standaard routeberekening.",
    "Financieel",
    "Normaal",
    "Open",
    "Middel",
    "Demo Finance",
    "Vergelijk geregistreerde km met standaard routes.",
    "2026-07-08",
    {
      dueDate: "2026-07-08",
      relatedModule: "Urenregistratie",
      relatedProject: "GelreDome Arnhem",
      nextStep: "Afwijkende regels in urenregistratie openen.",
    },
  ),
];

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function isToday(dateStr: string): boolean {
  const d = parseDate(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisWeek(dateStr: string): boolean {
  const d = parseDate(dateStr);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return d >= start && d <= end;
}

function isOverdue(action: RiskAction): boolean {
  if (!action.dueDate || action.status === "Afgerond") return false;
  const due = parseDate(action.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function isCompletedThisMonth(action: RiskAction): boolean {
  if (action.status !== "Afgerond") return false;
  const ref = action.updatedAt ?? action.createdAt;
  const d = new Date(ref);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function filterRiskActions(
  actions: RiskAction[],
  filters: RiskFilters,
): RiskAction[] {
  const search = filters.search.trim().toLowerCase();

  return actions.filter((action) => {
    if (search) {
      const hay = [
        action.title,
        action.description,
        action.owner,
        action.relatedClient ?? "",
        action.relatedProject ?? "",
        action.actionRequired,
        action.nextStep ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }

    if (filters.category !== "Alle" && action.category !== filters.category) {
      return false;
    }
    if (filters.priority !== "Alle" && action.priority !== filters.priority) {
      return false;
    }
    if (filters.status !== "Alle" && action.status !== filters.status) {
      return false;
    }
    if (filters.riskLevel !== "Alle" && action.riskLevel !== filters.riskLevel) {
      return false;
    }
    if (
      filters.module !== "Alle" &&
      action.relatedModule !== filters.module
    ) {
      return false;
    }

    if (filters.deadline !== "Alle") {
      if (filters.deadline === "Zonder deadline" && action.dueDate) return false;
      if (filters.deadline === "Vandaag" && (!action.dueDate || !isToday(action.dueDate))) {
        return false;
      }
      if (filters.deadline === "Deze week" && (!action.dueDate || !isThisWeek(action.dueDate))) {
        return false;
      }
      if (filters.deadline === "Te laat" && !isOverdue(action)) return false;
    }

    return true;
  });
}

export function computeRiskStats(actions: RiskAction[]): RiskStats {
  return actions.reduce<RiskStats>(
    (acc, action) => {
      if (
        ["Nieuw", "Open", "In behandeling", "Wacht op reactie"].includes(
          action.status,
        )
      ) {
        acc.openActions += 1;
      }
      if (action.riskLevel === "Kritiek" && action.status !== "Afgerond") {
        acc.criticalRisks += 1;
      }
      if (isOverdue(action)) acc.overdue += 1;
      if (action.status === "Wacht op reactie") acc.waitingForResponse += 1;
      if (isCompletedThisMonth(action)) acc.completedThisMonth += 1;
      if (action.dueDate && isThisWeek(action.dueDate) && action.status !== "Afgerond") {
        acc.dueThisWeek += 1;
      }
      return acc;
    },
    {
      openActions: 0,
      criticalRisks: 0,
      overdue: 0,
      waitingForResponse: 0,
      completedThisMonth: 0,
      dueThisWeek: 0,
    },
  );
}

export function buildTimelineEvents(actions: RiskAction[]): RiskTimelineEvent[] {
  const events: RiskTimelineEvent[] = [];

  for (const action of actions) {
    events.push({
      id: `evt-created-${action.id}`,
      actionId: action.id,
      title: "Nieuwe actie aangemaakt",
      description: action.title,
      timestamp: action.createdAt,
      type: "created",
    });

    if (action.updatedAt) {
      events.push({
        id: `evt-updated-${action.id}`,
        actionId: action.id,
        title: "Status gewijzigd",
        description: `${action.title} — ${action.status}`,
        timestamp: action.updatedAt,
        type: "status",
      });
    }

    if (action.status === "Afgerond") {
      events.push({
        id: `evt-done-${action.id}`,
        actionId: action.id,
        title: "Actie afgerond",
        description: action.title,
        timestamp: action.updatedAt ?? action.createdAt,
        type: "completed",
      });
    }

    if (action.status === "Wacht op reactie") {
      events.push({
        id: `evt-wait-${action.id}`,
        actionId: action.id,
        title: "Wacht op klantreactie",
        description: action.title,
        timestamp: action.updatedAt ?? action.createdAt,
        type: "waiting",
      });
    }

    if (action.dueDate && isThisWeek(action.dueDate) && action.status !== "Afgerond") {
      events.push({
        id: `evt-deadline-${action.id}`,
        actionId: action.id,
        title: "Deadline nadert",
        description: `${action.title} — ${action.dueDate}`,
        timestamp: action.dueDate,
        type: "deadline",
      });
    }
  }

  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 12);
}

export function buildAttentionPoints(actions: RiskAction[]): RiskAttentionPoint[] {
  const points: RiskAttentionPoint[] = [];

  for (const action of actions) {
    if (action.status === "Afgerond") continue;

    if (isOverdue(action)) {
      points.push({
        id: `att-overdue-${action.id}`,
        label: `Te laat: ${action.title}`,
        actionId: action.id,
        severity: "critical",
      });
    }

    if (action.priority === "Kritiek") {
      points.push({
        id: `att-crit-${action.id}`,
        label: `Direct oppakken: ${action.title}`,
        actionId: action.id,
        severity: "critical",
      });
    }

    if (action.category === "Facturatie" && action.status === "Open") {
      points.push({
        id: `att-fact-${action.id}`,
        label: "Controleer facturatiemodule",
        actionId: action.id,
        severity: "warning",
      });
    }

    if (action.category === "Veiligheid") {
      points.push({
        id: `att-safe-${action.id}`,
        label: "Controleer certificaten/PBM",
        actionId: action.id,
        severity: "warning",
      });
    }

    if (action.category === "Crew") {
      points.push({
        id: `att-crew-${action.id}`,
        label: "Controleer crewprofiel",
        actionId: action.id,
        severity: "info",
      });
    }
  }

  return points.slice(0, 8);
}

export function actionToFormData(action: RiskAction): RiskFormData {
  return {
    title: action.title,
    description: action.description,
    category: action.category,
    priority: action.priority,
    riskLevel: action.riskLevel,
    status: action.status,
    owner: action.owner,
    dueDate: action.dueDate ?? "",
    relatedModule: action.relatedModule ?? "",
    relatedProject: action.relatedProject ?? "",
    relatedClient: action.relatedClient ?? "",
    impact: action.impact ?? "",
    actionRequired: action.actionRequired,
    nextStep: action.nextStep ?? "",
    notes: action.notes ?? "",
  };
}

export function createActionFromForm(
  form: RiskFormData,
  existingId?: string,
): RiskAction {
  const now = new Date().toISOString();
  return {
    id: existingId ?? `risk-${Date.now()}`,
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    priority: form.priority,
    riskLevel: form.riskLevel,
    status: form.status,
    owner: form.owner,
    dueDate: form.dueDate || undefined,
    createdAt: existingId ? now : now,
    updatedAt: now,
    relatedModule: (form.relatedModule || undefined) as RelatedModule | undefined,
    relatedProject: form.relatedProject.trim() || undefined,
    relatedClient: form.relatedClient.trim() || undefined,
    impact: form.impact.trim() || undefined,
    actionRequired: form.actionRequired.trim(),
    nextStep: form.nextStep.trim() || undefined,
    notes: form.notes.trim() || undefined,
  };
}

export function exportRiskActionsCsv(actions: RiskAction[]): string {
  const headers = [
    "Titel",
    "Categorie",
    "Prioriteit",
    "Risico",
    "Status",
    "Eigenaar",
    "Deadline",
    "Module",
    "Klant",
    "Project",
    "Actie vereist",
    "Volgende stap",
  ];
  const rows = actions.map((a) => [
    a.title,
    a.category,
    a.priority,
    a.riskLevel,
    a.status,
    a.owner,
    a.dueDate ?? "",
    a.relatedModule ?? "",
    a.relatedClient ?? "",
    a.relatedProject ?? "",
    a.actionRequired,
    a.nextStep ?? "",
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

export function downloadRiskCsv(content: string, filename?: string): void {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? "risk-actions-helping-hands.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function getModuleLink(module?: RelatedModule): string | null {
  if (!module) return null;
  return MODULE_LINKS[module] ?? null;
}
