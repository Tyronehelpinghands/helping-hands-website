// TODO: Moneybird facturen synchroniseren
// TODO: Moneybird betalingstatus ophalen
// TODO: Moneybird webhooks
// TODO: Supabase finance snapshots opslaan
// TODO: Bankkoppeling via boekhoudpakket
// TODO: Fooks/payroll kosten import
// TODO: Shiftbase uren vergelijken met crewkosten
// TODO: Google Maps reiskostencontrole
// TODO: Btw-aangifte voorbereiding
// TODO: Debiteurenbeheer
// TODO: Automatische herinneringen via Moneybird
// TODO: later koppelen aan echte auth/rollen zodat alleen interne admins financiële data kunnen bekijken

export type FinancePeriod =
  | "Deze maand"
  | "Vorige maand"
  | "Dit kwartaal"
  | "Dit jaar"
  | "Alle";

export type FinanceInvoiceStatus =
  | "Concept"
  | "Verzonden"
  | "Openstaand"
  | "Te laat"
  | "Betaald";

export type FinanceExpenseStatus =
  | "Concept"
  | "Ingeboekt"
  | "Betaald"
  | "Te controleren";

export type FinanceInvoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  invoiceDate: string;
  dueDate: string;
  amountExVat: number;
  vatAmount: number;
  amountInclVat: number;
  paidAmount: number;
  status: FinanceInvoiceStatus;
  moneybirdInvoiceId?: string;
};

export type FinanceExpense = {
  id: string;
  date: string;
  supplier: string;
  category: string;
  description: string;
  amountExVat: number;
  vatAmount: number;
  amountInclVat: number;
  status: FinanceExpenseStatus;
};

export type FinanceMetric = {
  revenueExVat: number;
  expensesExVat: number;
  crewCosts: number;
  travelCosts: number;
  grossMargin: number;
  grossMarginPercentage: number;
  vatToPay: number;
  openInvoices: number;
  overdueInvoices: number;
  cashIn: number;
  cashOut: number;
  cashflow: number;
};

export type FinanceFilters = {
  search: string;
  period: FinancePeriod;
  status: string;
  category: string;
};

export const defaultFinanceFilters: FinanceFilters = {
  search: "",
  period: "Deze maand",
  status: "Alle",
  category: "Alle",
};

export const FINANCE_PERIODS: FinancePeriod[] = [
  "Deze maand",
  "Vorige maand",
  "Dit kwartaal",
  "Dit jaar",
  "Alle",
];

export const INVOICE_STATUS_OPTIONS = [
  "Alle",
  "Openstaand",
  "Te laat",
  "Betaald",
  "Concept",
  "Verzonden",
] as const;

export const EXPENSE_CATEGORY_OPTIONS = [
  "Alle",
  "Crewkosten",
  "Reiskosten",
  "Software",
  "Payroll",
  "Marketing",
  "Kantoor",
  "Materiaal / PBM",
  "Administratie",
] as const;

export type VatSummary = {
  vatOnRevenue: number;
  inputVat: number;
  vatToPay: number;
  periodLabel: string;
};

export type MarginSummary = {
  revenueExVat: number;
  crewCosts: number;
  travelCosts: number;
  otherDirectCosts: number;
  grossMargin: number;
  marginPercentage: number;
};

export type ProjectMargin = {
  projectName: string;
  revenue: number;
  crewCosts: number;
  travelCosts: number;
  margin: number;
  marginPercentage: number;
};

export type ChartDataPoint = {
  label: string;
  revenue: number;
  expenses: number;
  margin: number;
};

export type FinanceAction = {
  id: string;
  title: string;
  priority: "Laag" | "Normaal" | "Hoog";
  status: "Open" | "In behandeling" | "Afgerond";
  href: string;
};

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${round2(value).toFixed(1)}%`;
}

function calcVat(exVat: number): number {
  return round2(exVat * 0.21);
}

function calcIncl(exVat: number): number {
  return round2(exVat + calcVat(exVat));
}

function invoice(
  id: string,
  invoiceNumber: string,
  clientName: string,
  projectName: string,
  invoiceDate: string,
  dueDate: string,
  amountExVat: number,
  status: FinanceInvoiceStatus,
  paidAmount = 0,
  moneybirdInvoiceId?: string,
): FinanceInvoice {
  const vatAmount = calcVat(amountExVat);
  return {
    id,
    invoiceNumber,
    clientName,
    projectName,
    invoiceDate,
    dueDate,
    amountExVat,
    vatAmount,
    amountInclVat: calcIncl(amountExVat),
    paidAmount,
    status,
    moneybirdInvoiceId,
  };
}

function expense(
  id: string,
  date: string,
  supplier: string,
  category: string,
  description: string,
  amountExVat: number,
  status: FinanceExpenseStatus,
): FinanceExpense {
  const vatAmount = calcVat(amountExVat);
  return {
    id,
    date,
    supplier,
    category,
    description,
    amountExVat,
    vatAmount,
    amountInclVat: calcIncl(amountExVat),
    status,
  };
}

export const demoFinanceInvoices: FinanceInvoice[] = [
  invoice("fin-inv-001", "HH-2026-0142", "Demo Klant 1", "Amsterdam RAI", "2026-07-01", "2026-07-15", 4850, "Openstaand", 0, "MB-2026-0142"),
  invoice("fin-inv-002", "HH-2026-0138", "Demo Klant 2", "GelreDome Arnhem", "2026-06-28", "2026-07-12", 3920, "Te laat", 0, "MB-2026-0138"),
  invoice("fin-inv-003", "HH-2026-0135", "Demo Klant 3", "Johan Cruijff ArenA", "2026-06-20", "2026-07-04", 2780, "Betaald", 3363.8, "MB-2026-0135"),
  invoice("fin-inv-004", "HH-2026-0145", "Demo Horeca Klant", "Horeca event Scheveningen", "2026-07-05", "2026-07-19", 1640, "Verzonden", 0, "MB-2026-0145"),
  invoice("fin-inv-005", "HH-2026-0128", "Demo Productie Klant", "Load-out productie", "2026-06-10", "2026-06-24", 2150, "Betaald", 2601.5, "MB-2026-0128"),
  invoice("fin-inv-006", "HH-2026-0148", "Demo Klant 1", "Festivalterrein", "2026-07-08", "2026-07-22", 5280, "Openstaand", 0),
  invoice("fin-inv-007", "HH-2026-0131", "Demo Klant 2", "Restaurant ondersteuning", "2026-06-15", "2026-06-29", 980, "Te laat", 0, "MB-2026-0131"),
  invoice("fin-inv-008", "HH-2026-0150", "Demo Klant 3", "GelreDome Arnhem", "2026-07-10", "2026-07-24", 3410, "Concept", 0),
  invoice("fin-inv-009", "HH-2026-0122", "Demo Horeca Klant", "Horeca event Scheveningen", "2026-05-22", "2026-06-05", 1890, "Betaald", 2286.9),
  invoice("fin-inv-010", "HH-2026-0140", "Demo Productie Klant", "Amsterdam RAI", "2026-06-30", "2026-07-14", 4120, "Openstaand", 1200, "MB-2026-0140"),
];

export const demoFinanceExpenses: FinanceExpense[] = [
  expense("fin-exp-001", "2026-07-02", "Demo Crew Payroll", "Crewkosten", "Crew inzet GelreDome week 27", 2180, "Ingeboekt"),
  expense("fin-exp-002", "2026-07-03", "Demo Reiskosten", "Reiskosten", "Kilometervergoedingen crew week 27", 420, "Betaald"),
  expense("fin-exp-003", "2026-07-01", "Fooks Payroll", "Payroll", "Payroll verwerking juni 2026", 1850, "Te controleren"),
  expense("fin-exp-004", "2026-06-28", "Shiftbase", "Software", "Shiftbase abonnement Q3", 89, "Betaald"),
  expense("fin-exp-005", "2026-06-25", "Google Workspace", "Software", "E-mail en workspace licenties", 64, "Betaald"),
  expense("fin-exp-006", "2026-07-05", "Helping Hands Marketing", "Marketing", "Social campagne zomer events", 350, "Ingeboekt"),
  expense("fin-exp-007", "2026-06-18", "Kantoor BV", "Kantoor", "Huur kantoorruimte juni", 780, "Betaald"),
  expense("fin-exp-008", "2026-07-04", "PBM Leverancier", "Materiaal / PBM", "Veiligheidsmateriaal events", 245, "Ingeboekt"),
  expense("fin-exp-009", "2026-06-30", "ING Bank", "Administratie", "Bankkosten juni", 18.5, "Betaald"),
  expense("fin-exp-010", "2026-07-06", "Administratie Partner", "Administratie", "Boekhoudondersteuning Q2", 420, "Te controleren"),
  expense("fin-exp-011", "2026-06-20", "Demo Crew Payroll", "Crewkosten", "Crew inzet Johan Cruijff ArenA", 1540, "Betaald"),
  expense("fin-exp-012", "2026-06-22", "Lease Auto BV", "Vervoer", "Lease bus productie", 620, "Betaald"),
];

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function isInPeriod(dateStr: string, period: FinancePeriod, ref = new Date()): boolean {
  const d = parseDate(dateStr);
  const year = ref.getFullYear();
  const month = ref.getMonth();

  switch (period) {
    case "Alle":
      return true;
    case "Deze maand":
      return d.getFullYear() === year && d.getMonth() === month;
    case "Vorige maand": {
      const lm = month === 0 ? 11 : month - 1;
      const ly = month === 0 ? year - 1 : year;
      return d.getFullYear() === ly && d.getMonth() === lm;
    }
    case "Dit kwartaal": {
      const q = Math.floor(month / 3);
      const dq = Math.floor(d.getMonth() / 3);
      return d.getFullYear() === year && dq === q;
    }
    case "Dit jaar":
      return d.getFullYear() === year;
    default:
      return true;
  }
}

function matchesCategory(category: string, filter: string): boolean {
  if (filter === "Alle") return true;
  const map: Record<string, string[]> = {
    Software: ["Software", "Softwarekosten"],
    Payroll: ["Payroll", "Payrollkosten"],
    Administratie: ["Administratie", "Administratiekosten", "Bankkosten"],
    Vervoer: ["Vervoer"],
  };
  const aliases = map[filter];
  if (aliases) return aliases.includes(category) || category === filter;
  return category === filter;
}

export function filterFinanceInvoices(
  invoices: FinanceInvoice[],
  filters: FinanceFilters,
): FinanceInvoice[] {
  const search = filters.search.trim().toLowerCase();
  return invoices.filter((inv) => {
    if (!isInPeriod(inv.invoiceDate, filters.period)) return false;
    if (filters.status !== "Alle" && inv.status !== filters.status) return false;
    if (search) {
      const hay = [
        inv.invoiceNumber,
        inv.clientName,
        inv.projectName,
        inv.status,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

export function filterFinanceExpenses(
  expenses: FinanceExpense[],
  filters: FinanceFilters,
): FinanceExpense[] {
  const search = filters.search.trim().toLowerCase();
  return expenses.filter((exp) => {
    if (!isInPeriod(exp.date, filters.period)) return false;
    if (!matchesCategory(exp.category, filters.category)) return false;
    if (search) {
      const hay = [exp.supplier, exp.category, exp.description, exp.status]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

export function calculateVatSummary(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
  period: FinancePeriod,
): VatSummary {
  const filteredInv = invoices.filter((i) => isInPeriod(i.invoiceDate, period));
  const filteredExp = expenses.filter((e) => isInPeriod(e.date, period));
  const vatOnRevenue = round2(
    filteredInv.reduce((s, i) => s + i.vatAmount, 0),
  );
  const inputVat = round2(filteredExp.reduce((s, e) => s + e.vatAmount, 0));
  return {
    vatOnRevenue,
    inputVat,
    vatToPay: round2(vatOnRevenue - inputVat),
    periodLabel: period,
  };
}

export function calculateMargin(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
): MarginSummary {
  const revenueExVat = round2(
    invoices.reduce((s, i) => s + i.amountExVat, 0),
  );
  const crewCosts = round2(
    expenses
      .filter((e) => e.category === "Crewkosten")
      .reduce((s, e) => s + e.amountExVat, 0),
  );
  const travelCosts = round2(
    expenses
      .filter((e) => e.category === "Reiskosten")
      .reduce((s, e) => s + e.amountExVat, 0),
  );
  const otherDirectCosts = round2(
    expenses
      .filter((e) => !["Crewkosten", "Reiskosten"].includes(e.category))
      .reduce((s, e) => s + e.amountExVat, 0),
  );
  const grossMargin = round2(revenueExVat - crewCosts - travelCosts);
  const marginPercentage =
    revenueExVat > 0 ? round2((grossMargin / revenueExVat) * 100) : 0;
  return {
    revenueExVat,
    crewCosts,
    travelCosts,
    otherDirectCosts,
    grossMargin,
    marginPercentage,
  };
}

export function calculateFinanceMetrics(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
): FinanceMetric {
  const revenueExVat = round2(
    invoices.reduce((s, i) => s + i.amountExVat, 0),
  );
  const expensesExVat = round2(
    expenses.reduce((s, e) => s + e.amountExVat, 0),
  );
  const crewCosts = round2(
    expenses
      .filter((e) => e.category === "Crewkosten")
      .reduce((s, e) => s + e.amountExVat, 0),
  );
  const travelCosts = round2(
    expenses
      .filter((e) => e.category === "Reiskosten")
      .reduce((s, e) => s + e.amountExVat, 0),
  );
  const grossMargin = round2(revenueExVat - crewCosts - travelCosts);
  const grossMarginPercentage =
    revenueExVat > 0 ? round2((grossMargin / revenueExVat) * 100) : 0;
  const vatOnRevenue = round2(
    invoices.reduce((s, i) => s + i.vatAmount, 0),
  );
  const inputVat = round2(
    expenses.reduce((s, e) => s + e.vatAmount, 0),
  );
  const vatToPay = round2(vatOnRevenue - inputVat);
  const openInvoices = invoices.filter(
    (i) => i.status === "Openstaand" || i.status === "Te laat",
  ).length;
  const overdueInvoices = invoices.filter((i) => i.status === "Te laat").length;
  const cashIn = round2(
    invoices.reduce((s, i) => s + i.paidAmount, 0),
  );
  const cashOut = round2(
    expenses
      .filter((e) => e.status === "Betaald")
      .reduce((s, e) => s + e.amountInclVat, 0),
  );
  return {
    revenueExVat,
    expensesExVat,
    crewCosts,
    travelCosts,
    grossMargin,
    grossMarginPercentage,
    vatToPay,
    openInvoices,
    overdueInvoices,
    cashIn,
    cashOut,
    cashflow: round2(cashIn - cashOut),
  };
}

export function getOutstandingAmount(invoices: FinanceInvoice[]): number {
  return round2(
    invoices
      .filter((i) => i.status === "Openstaand" || i.status === "Te laat")
      .reduce((s, i) => s + (i.amountInclVat - i.paidAmount), 0),
  );
}

export function getExpectedIncoming(invoices: FinanceInvoice[]): number {
  return round2(
    invoices
      .filter((i) => ["Openstaand", "Te laat", "Verzonden"].includes(i.status))
      .reduce((s, i) => s + (i.amountInclVat - i.paidAmount), 0),
  );
}

export function calculateProjectMargins(
  invoices: FinanceInvoice[],
): ProjectMargin[] {
  const projectNames = [
    "GelreDome Arnhem",
    "Amsterdam RAI",
    "Johan Cruijff ArenA",
    "Horeca event Scheveningen",
    "Restaurant ondersteuning",
    "Festivalterrein",
    "Load-out productie",
  ];

  const crewByProject: Record<string, number> = {
    "GelreDome Arnhem": 2180,
    "Amsterdam RAI": 980,
    "Johan Cruijff ArenA": 1540,
    "Horeca event Scheveningen": 620,
    "Restaurant ondersteuning": 450,
    "Festivalterrein": 840,
    "Load-out productie": 720,
  };

  const travelByProject: Record<string, number> = {
    "GelreDome Arnhem": 280,
    "Amsterdam RAI": 195,
    "Johan Cruijff ArenA": 165,
    "Horeca event Scheveningen": 140,
    "Restaurant ondersteuning": 85,
    "Festivalterrein": 310,
    "Load-out productie": 120,
  };

  return projectNames
    .map((projectName) => {
      const revenue = round2(
        invoices
          .filter((i) => i.projectName === projectName)
          .reduce((s, i) => s + i.amountExVat, 0),
      );
      const crewCosts = crewByProject[projectName] ?? 0;
      const travelCosts = travelByProject[projectName] ?? 0;
      const margin = round2(revenue - crewCosts - travelCosts);
      const marginPercentage =
        revenue > 0 ? round2((margin / revenue) * 100) : 0;
      return {
        projectName,
        revenue,
        crewCosts,
        travelCosts,
        margin,
        marginPercentage,
      };
    })
    .filter((p) => p.revenue > 0);
}

export function getChartData(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
): ChartDataPoint[] {
  const months = [
    { label: "Apr", key: "2026-04" },
    { label: "Mei", key: "2026-05" },
    { label: "Jun", key: "2026-06" },
    { label: "Jul", key: "2026-07" },
  ];

  return months.map(({ label, key }) => {
    const [y, m] = key.split("-").map(Number);
    const rev = round2(
      invoices
        .filter((i) => {
          const d = parseDate(i.invoiceDate);
          return d.getFullYear() === y && d.getMonth() + 1 === m;
        })
        .reduce((s, i) => s + i.amountExVat, 0),
    );
    const exp = round2(
      expenses
        .filter((e) => {
          const d = parseDate(e.date);
          return d.getFullYear() === y && d.getMonth() + 1 === m;
        })
        .reduce((s, e) => s + e.amountExVat, 0),
    );
    return { label, revenue: rev, expenses: exp, margin: round2(rev - exp) };
  });
}

export function buildFinanceActions(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
): FinanceAction[] {
  const openCount = invoices.filter((i) => i.status === "Openstaand").length;
  const overdueCount = invoices.filter((i) => i.status === "Te laat").length;
  const reviewExpenses = expenses.filter(
    (e) => e.status === "Te controleren",
  ).length;

  return [
    {
      id: "act-1",
      title: `Controleer ${openCount} openstaande facturen`,
      priority: openCount > 2 ? "Hoog" : "Normaal",
      status: "Open",
      href: "/dashboard/intern/facturatie",
    },
    {
      id: "act-2",
      title: `${overdueCount} facturen zijn over vervaldatum`,
      priority: overdueCount > 0 ? "Hoog" : "Laag",
      status: overdueCount > 0 ? "Open" : "Afgerond",
      href: "/dashboard/intern/facturatie",
    },
    {
      id: "act-3",
      title: "Btw-overzicht voorbereiden",
      priority: "Normaal",
      status: "In behandeling",
      href: "/dashboard/intern/financien",
    },
    {
      id: "act-4",
      title: "Crewkosten vergelijken met urenregistratie",
      priority: "Normaal",
      status: "Open",
      href: "/dashboard/intern/urenregistratie",
    },
    {
      id: "act-5",
      title: "Reiskosten controleren op afwijkingen",
      priority: "Laag",
      status: "Open",
      href: "/dashboard/intern/urenregistratie",
    },
    {
      id: "act-6",
      title: "Factuurconcepten klaarzetten in Moneybird",
      priority: "Normaal",
      status: "Open",
      href: "/dashboard/intern/facturatie",
    },
    {
      id: "act-7",
      title: `Payroll/Fooks kosten controleren (${reviewExpenses} regels)`,
      priority: reviewExpenses > 0 ? "Hoog" : "Laag",
      status: reviewExpenses > 0 ? "Open" : "Afgerond",
      href: "/dashboard/intern/risico",
    },
  ];
}

export function exportFinanceCsv(
  invoices: FinanceInvoice[],
  expenses: FinanceExpense[],
  metrics: FinanceMetric,
): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines: string[] = [];

  lines.push("SAMENVATTING");
  lines.push(["Metric", "Waarde"].map(escape).join(","));
  lines.push(["Omzet excl btw", String(metrics.revenueExVat)].map(escape).join(","));
  lines.push(["Kosten excl btw", String(metrics.expensesExVat)].map(escape).join(","));
  lines.push(["Brutomarge", String(metrics.grossMargin)].map(escape).join(","));
  lines.push(["Cashflow", String(metrics.cashflow)].map(escape).join(","));
  lines.push("");

  lines.push("FACTUREN");
  lines.push(
    [
      "Factuurnummer",
      "Klant",
      "Project",
      "Datum",
      "Excl",
      "Btw",
      "Incl",
      "Status",
    ]
      .map(escape)
      .join(","),
  );
  for (const inv of invoices) {
    lines.push(
      [
        inv.invoiceNumber,
        inv.clientName,
        inv.projectName,
        inv.invoiceDate,
        String(inv.amountExVat),
        String(inv.vatAmount),
        String(inv.amountInclVat),
        inv.status,
      ]
        .map(escape)
        .join(","),
    );
  }
  lines.push("");

  lines.push("KOSTEN");
  lines.push(
    ["Datum", "Leverancier", "Categorie", "Excl", "Btw", "Incl", "Status"]
      .map(escape)
      .join(","),
  );
  for (const exp of expenses) {
    lines.push(
      [
        exp.date,
        exp.supplier,
        exp.category,
        String(exp.amountExVat),
        String(exp.vatAmount),
        String(exp.amountInclVat),
        exp.status,
      ]
        .map(escape)
        .join(","),
    );
  }

  return lines.join("\n");
}

export function downloadFinanceCsv(content: string): void {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "finance-overview-helping-hands.csv";
  link.click();
  URL.revokeObjectURL(url);
}
