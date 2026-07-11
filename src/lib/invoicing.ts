// TODO: Supabase factuurconcepten opslaan
// TODO: Urenregistratie groeperen naar factuurregels
// TODO: Moneybird contact matching
// TODO: Moneybird invoice status synchroniseren
// TODO: Moneybird PDF downloaden
// TODO: Moneybird betalingstatus ophalen
// TODO: Moneybird webhooks voor paid/open/late
// TODO: Shiftbase uren import
// TODO: Google Maps reiskosten
// TODO: Fooks/payroll kostencontrole
// TODO: Later goedgekeurde uren uit Supabase ophalen
// TODO: Groeperen per klant/project/week
// TODO: Automatisch Moneybird factuurconcept maken
// TODO: later alleen interne admins/planners toegang geven via echte auth/rollen

import { demoHoursEntries, type HoursEntry } from "@/lib/hours";

export type InvoiceLine = {
  id: string;
  description: string;
  date?: string;
  projectName?: string;
  crewMemberName?: string;
  role?: string;
  startTime?: string;
  endTime?: string;
  quantity: number;
  unit: "uur" | "km" | "stuk";
  price: number;
  vatRate: 21;
  totalExVat: number;
};

export type InvoiceStatus =
  | "Concept"
  | "Klaar voor Moneybird"
  | "Aangemaakt in Moneybird"
  | "Verzonden"
  | "Betaald";

export type InvoiceDraft = {
  id: string;
  clientName: string;
  contactId?: string;
  reference: string;
  invoiceDate: string;
  dueDate: string;
  weekNumber?: number;
  lines: InvoiceLine[];
  subtotalExVat: number;
  vatAmount: number;
  totalInclVat: number;
  status: InvoiceStatus;
  moneybirdInvoiceId?: string;
  notes?: string;
};

export type InvoiceFilters = {
  search: string;
  status: string;
  period: string;
};

export const defaultInvoiceFilters: InvoiceFilters = {
  search: "",
  status: "all",
  period: "all",
};

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "Concept",
  "Klaar voor Moneybird",
  "Aangemaakt in Moneybird",
  "Verzonden",
  "Betaald",
];

export type InvoiceStats = {
  conceptCount: number;
  readyForMoneybirdCount: number;
  createdInMoneybirdCount: number;
  outstandingAmount: number;
  paidThisMonth: number;
};

export type InvoiceFormData = {
  clientName: string;
  contactId: string;
  reference: string;
  invoiceDate: string;
  dueDate: string;
  projectName: string;
  status: InvoiceStatus;
  notes: string;
  lines: InvoiceLine[];
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

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export function calculateLineTotal(quantity: number, price: number): number {
  return round2(quantity * price);
}

export function calculateVat(subtotalExVat: number, rate = 21): number {
  return round2(subtotalExVat * (rate / 100));
}

export function calculateInvoiceTotals(lines: InvoiceLine[]): {
  subtotalExVat: number;
  vatAmount: number;
  totalInclVat: number;
} {
  const subtotalExVat = round2(
    lines.reduce((sum, line) => sum + line.totalExVat, 0),
  );
  const vatAmount = calculateVat(subtotalExVat);
  const totalInclVat = round2(subtotalExVat + vatAmount);
  return { subtotalExVat, vatAmount, totalInclVat };
}

export function recalculateInvoiceDraft(
  draft: Omit<
    InvoiceDraft,
    "subtotalExVat" | "vatAmount" | "totalInclVat"
  > & { lines: InvoiceLine[] },
): InvoiceDraft {
  const lines = draft.lines.map((line) => ({
    ...line,
    totalExVat: calculateLineTotal(line.quantity, line.price),
    vatRate: 21 as const,
  }));
  const totals = calculateInvoiceTotals(lines);
  return { ...draft, lines, ...totals };
}

function makeLine(
  id: string,
  description: string,
  quantity: number,
  unit: InvoiceLine["unit"],
  price: number,
  extras?: Partial<InvoiceLine>,
): InvoiceLine {
  return {
    id,
    description,
    quantity,
    unit,
    price,
    vatRate: 21,
    totalExVat: calculateLineTotal(quantity, price),
    ...extras,
  };
}

function buildDemoDraft(
  id: string,
  clientName: string,
  reference: string,
  invoiceDate: string,
  dueDate: string,
  status: InvoiceStatus,
  lines: InvoiceLine[],
  extras?: Partial<InvoiceDraft>,
): InvoiceDraft {
  return recalculateInvoiceDraft({
    id,
    clientName,
    reference,
    invoiceDate,
    dueDate,
    status,
    lines,
    weekNumber: extras?.weekNumber,
    contactId: extras?.contactId,
    moneybirdInvoiceId: extras?.moneybirdInvoiceId,
    notes: extras?.notes,
  });
}

export const demoInvoiceDrafts: InvoiceDraft[] = [
  buildDemoDraft(
    "inv-001",
    "Demo Klant 1",
    "Helping Hands - Week 27 - Demo Klant 1",
    "2026-07-06",
    "2026-07-20",
    "Klaar voor Moneybird",
    [
      makeLine(
        "inv-001-l1",
        "Eventmedewerker – Demo Crew 1 – Amsterdam RAI – 30-06-2026 – 08:00–17:00",
        8.25,
        "uur",
        31.5,
        {
          date: "2026-06-30",
          projectName: "Amsterdam RAI",
          crewMemberName: "Demo Crew 1",
          role: "Eventmedewerker",
          startTime: "08:00",
          endTime: "17:00",
        },
      ),
      makeLine(
        "inv-001-l2",
        "Reiskosten Demo Crew 1 – Amsterdam RAI – 30-06-2026",
        84,
        "km",
        0.25,
        { date: "2026-06-30", projectName: "Amsterdam RAI", crewMemberName: "Demo Crew 1" },
      ),
      makeLine(
        "inv-001-l3",
        "Logistiek medewerker – Demo Crew 3 – Johan Cruijff ArenA – 02-07-2026 – 07:30–16:00",
        8,
        "uur",
        35,
        {
          date: "2026-07-02",
          projectName: "Johan Cruijff ArenA",
          crewMemberName: "Demo Crew 3",
          role: "Logistiek medewerker",
        },
      ),
    ],
    { weekNumber: 27, contactId: "", notes: "Gebaseerd op goedgekeurde uren week 27." },
  ),
  buildDemoDraft(
    "inv-002",
    "Demo Klant 2",
    "Helping Hands - Week 26 - Demo Klant 2",
    "2026-06-24",
    "2026-07-08",
    "Aangemaakt in Moneybird",
    [
      makeLine(
        "inv-002-l1",
        "Stagehand – Demo Crew 2 – GelreDome Arnhem – 29-06-2026 – 10:00–20:00",
        10,
        "uur",
        35,
        {
          date: "2026-06-29",
          projectName: "GelreDome Arnhem",
          crewMemberName: "Demo Crew 2",
          role: "Stagehand",
          startTime: "10:00",
          endTime: "20:00",
        },
      ),
      makeLine(
        "inv-002-l2",
        "Reiskosten Demo Crew 2 – GelreDome Arnhem – 29-06-2026",
        136,
        "km",
        0.25,
        { date: "2026-06-29", projectName: "GelreDome Arnhem", crewMemberName: "Demo Crew 2" },
      ),
    ],
    {
      weekNumber: 26,
      contactId: "mb-contact-demo-2",
      moneybirdInvoiceId: "MB-2026-0188",
      notes: "Concept aangemaakt in Moneybird — niet automatisch verzonden.",
    },
  ),
  buildDemoDraft(
    "inv-003",
    "Demo Klant 3",
    "Helping Hands - Horeca event Scheveningen",
    "2026-06-23",
    "2026-07-07",
    "Betaald",
    [
      makeLine(
        "inv-003-l1",
        "Bartender – Demo Crew 1 – Horeca event Scheveningen – 23-06-2026 – 14:00–23:30",
        8.75,
        "uur",
        34.5,
        {
          date: "2026-06-23",
          projectName: "Horeca event Scheveningen",
          crewMemberName: "Demo Crew 1",
          role: "Bartender",
        },
      ),
      makeLine(
        "inv-003-l2",
        "Reiskosten Demo Crew 1 – Horeca event Scheveningen – 23-06-2026",
        56,
        "km",
        0.25,
        { date: "2026-06-23", projectName: "Horeca event Scheveningen" },
      ),
    ],
    {
      weekNumber: 26,
      moneybirdInvoiceId: "MB-2026-0142",
      notes: "Betaald via Moneybird (demo-status).",
    },
  ),
  buildDemoDraft(
    "inv-004",
    "Demo Klant 1",
    "Helping Hands - Restaurant ondersteuning - Week 26",
    "2026-06-25",
    "2026-07-09",
    "Concept",
    [
      makeLine(
        "inv-004-l1",
        "Hulp kok / keukenhulp – Demo Crew 2 – Restaurant ondersteuning – 24-06-2026 – 11:00–20:00",
        8.25,
        "uur",
        32.5,
        {
          date: "2026-06-24",
          projectName: "Restaurant ondersteuning",
          crewMemberName: "Demo Crew 2",
          role: "Hulp kok / keukenhulp",
        },
      ),
    ],
    { weekNumber: 26 },
  ),
  buildDemoDraft(
    "inv-005",
    "Demo Klant 2",
    "Helping Hands - Week 28 - Beursopbouw",
    "2026-07-11",
    "2026-07-25",
    "Verzonden",
    [
      makeLine(
        "inv-005-l1",
        "Productie assistent – Demo Crew 4 – Beursopbouw – 04-07-2026 – 07:00–15:30",
        7.75,
        "uur",
        34.5,
        {
          date: "2026-07-04",
          projectName: "Beursopbouw",
          crewMemberName: "Demo Crew 4",
          role: "Productie assistent",
        },
      ),
      makeLine(
        "inv-005-l2",
        "Reiskosten Demo Crew 4 – Beursopbouw – 04-07-2026",
        76,
        "km",
        0.25,
        { date: "2026-07-04", projectName: "Beursopbouw" },
      ),
    ],
    {
      weekNumber: 28,
      moneybirdInvoiceId: "MB-2026-0201",
      notes: "Handmatig verzonden in Moneybird.",
    },
  ),
];

export function getApprovedHoursForInvoicing(): HoursEntry[] {
  return demoHoursEntries.filter((e) => e.status === "Goedgekeurd");
}

export function hourEntryToWorkLine(entry: HoursEntry): InvoiceLine {
  const desc = `${entry.role} – ${entry.crewMemberName} – ${entry.projectName} – ${formatDisplayDate(entry.date)} – ${entry.startTime}–${entry.endTime}`;
  return makeLine(
    `line-from-${entry.id}`,
    desc,
    entry.billableHours,
    "uur",
    entry.clientHourlyRate,
    {
      date: entry.date,
      projectName: entry.projectName,
      crewMemberName: entry.crewMemberName,
      role: entry.role,
      startTime: entry.startTime,
      endTime: entry.endTime,
    },
  );
}

export function hourEntryToTravelLine(entry: HoursEntry): InvoiceLine | null {
  if (entry.kilometers <= 0) return null;
  const desc = `Reiskosten ${entry.crewMemberName} – ${entry.projectName} – ${formatDisplayDate(entry.date)}`;
  return makeLine(
    `line-travel-${entry.id}`,
    desc,
    entry.kilometers,
    "km",
    entry.travelRatePerKm,
    {
      date: entry.date,
      projectName: entry.projectName,
      crewMemberName: entry.crewMemberName,
    },
  );
}

export function buildLinesFromApprovedHours(
  hours: HoursEntry[] = getApprovedHoursForInvoicing(),
): InvoiceLine[] {
  const lines: InvoiceLine[] = [];
  for (const entry of hours) {
    lines.push(hourEntryToWorkLine(entry));
    const travel = hourEntryToTravelLine(entry);
    if (travel) lines.push(travel);
  }
  return lines;
}

export function createEmptyLine(): InvoiceLine {
  return makeLine(`line-${Date.now()}`, "", 1, "uur", 0);
}

export function createTravelLine(
  crewName: string,
  projectName: string,
  date: string,
  km: number,
): InvoiceLine {
  return makeLine(
    `line-travel-${Date.now()}`,
    `Reiskosten ${crewName} – ${projectName} – ${formatDisplayDate(date)}`,
    km,
    "km",
    0.25,
    { date, projectName, crewMemberName: crewName },
  );
}

function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.getFullYear() === year && d.getMonth() === month;
}

export function filterInvoiceDrafts(
  drafts: InvoiceDraft[],
  filters: InvoiceFilters,
): InvoiceDraft[] {
  const search = filters.search.trim().toLowerCase();
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  return drafts.filter((draft) => {
    if (search) {
      const haystack = [
        draft.clientName,
        draft.reference,
        draft.status,
        draft.moneybirdInvoiceId ?? "",
        draft.lines.map((l) => l.projectName).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.status !== "all" && draft.status !== filters.status) {
      return false;
    }

    if (filters.period !== "all") {
      if (filters.period === "this_month") {
        if (!isInMonth(draft.invoiceDate, thisYear, thisMonth)) return false;
      } else if (filters.period === "last_month") {
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const year = thisMonth === 0 ? thisYear - 1 : thisYear;
        if (!isInMonth(draft.invoiceDate, year, lastMonth)) return false;
      } else {
        const weekMatch = filters.period.match(/^week_(\d+)$/);
        if (weekMatch && draft.weekNumber !== Number(weekMatch[1])) {
          return false;
        }
      }
    }

    return true;
  });
}

export function computeInvoiceStats(drafts: InvoiceDraft[]): InvoiceStats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  return drafts.reduce<InvoiceStats>(
    (acc, draft) => {
      if (draft.status === "Concept") acc.conceptCount += 1;
      if (draft.status === "Klaar voor Moneybird") acc.readyForMoneybirdCount += 1;
      if (draft.status === "Aangemaakt in Moneybird") {
        acc.createdInMoneybirdCount += 1;
      }
      if (draft.status !== "Betaald") {
        acc.outstandingAmount = round2(
          acc.outstandingAmount + draft.totalInclVat,
        );
      }
      if (
        draft.status === "Betaald" &&
        isInMonth(draft.invoiceDate, thisYear, thisMonth)
      ) {
        acc.paidThisMonth = round2(acc.paidThisMonth + draft.totalInclVat);
      }
      return acc;
    },
    {
      conceptCount: 0,
      readyForMoneybirdCount: 0,
      createdInMoneybirdCount: 0,
      outstandingAmount: 0,
      paidThisMonth: 0,
    },
  );
}

export function draftToFormData(draft: InvoiceDraft): InvoiceFormData {
  return {
    clientName: draft.clientName,
    contactId: draft.contactId ?? "",
    reference: draft.reference,
    invoiceDate: draft.invoiceDate,
    dueDate: draft.dueDate,
    projectName: draft.lines[0]?.projectName ?? "",
    status: draft.status,
    notes: draft.notes ?? "",
    lines: draft.lines.map((l) => ({ ...l })),
  };
}

export function createDraftFromForm(
  form: InvoiceFormData,
  existingId?: string,
): InvoiceDraft {
  const lines = form.lines.map((line) => ({
    ...line,
    totalExVat: calculateLineTotal(line.quantity, line.price),
    vatRate: 21 as const,
  }));

  return recalculateInvoiceDraft({
    id: existingId ?? `inv-${Date.now()}`,
    clientName: form.clientName.trim(),
    contactId: form.contactId.trim() || undefined,
    reference: form.reference.trim(),
    invoiceDate: form.invoiceDate,
    dueDate: form.dueDate,
    status: form.status,
    notes: form.notes.trim() || undefined,
    lines,
  });
}

export function draftToMoneybirdPayload(draft: InvoiceDraft) {
  return {
    contactId: draft.contactId,
    reference: draft.reference,
    invoiceDate: draft.invoiceDate,
    dueDate: draft.dueDate,
    lines: draft.lines.map((line) => ({
      description: line.description,
      amount: line.quantity,
      price: line.price,
    })),
  };
}

export function exportDraftToCsv(draft: InvoiceDraft): string {
  const headers = [
    "Omschrijving",
    "Aantal",
    "Eenheid",
    "Prijs",
    "Totaal excl btw",
    "Btw percentage",
  ];
  const rows = draft.lines.map((line) => [
    line.description,
    String(line.quantity),
    line.unit,
    String(line.price),
    String(line.totalExVat),
    String(line.vatRate),
  ]);
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

export function downloadInvoiceCsv(draft: InvoiceDraft): void {
  const csv = exportDraftToCsv(draft);
  const safeRef = draft.reference.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 40);
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `factuurconcept-${safeRef}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export const DEMO_CLIENTS = ["Demo Klant 1", "Demo Klant 2", "Demo Klant 3"] as const;

export const DEMO_CONTACTS = [
  { id: "demo-contact-1", company_name: "Demo Klant 1", email: "factuur@demo-klant-1.nl", city: "Amsterdam" },
  { id: "demo-contact-2", company_name: "Demo Klant 2", email: "factuur@demo-klant-2.nl", city: "Arnhem" },
  { id: "demo-contact-3", company_name: "Demo Klant 3", email: "factuur@demo-klant-3.nl", city: "Den Haag" },
] as const;
