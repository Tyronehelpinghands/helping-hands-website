import { calculateMarginEstimate, toDateString } from "@/lib/dashboard/calculations";
import type { InvoiceDraft, TimeEntry } from "@/lib/dashboard/types";

export type FinancePeriodKey =
  | "this_month"
  | "last_month"
  | "this_quarter"
  | "this_year"
  | "custom"
  | "all";

export type FinancePeriod = {
  key: FinancePeriodKey;
  from: string | null;
  to: string | null;
  label: string;
};

export type FinanceBreakdownRow = {
  id: string;
  name: string;
  hours: number;
  personeelskosten: number;
  omzet: number;
  marge: number;
  margePercent: number | null;
};

export type FinanceOverview = {
  period: FinancePeriod;
  /** Omzet excl. BTW uit verstuurde/betaalde facturen (`subtotal`). */
  omzet: number;
  /** Subset: alleen status `paid`. */
  betaaldeOmzet: number;
  /** Concept + klaar (nog niet verstuurd), excl. BTW. */
  conceptOmzet: number;
  /** Verstuurd, nog niet betaald — excl. BTW. */
  openstaand: number;
  /** Som uren × crew `hourly_cost` (approved/invoiced). */
  personeelskosten: number;
  marge: number;
  margePercent: number | null;
  totalHours: number;
  /** Km/reiskosten die in factuursubtotal zitten (geen interne kost). */
  gefactureerdeReiskosten: number;
  missingHourlyCostHours: number;
  byProject: FinanceBreakdownRow[];
  byCrew: FinanceBreakdownRow[];
};

const COST_ENTRY_STATUSES = new Set(["approved", "invoiced"]);
const OMZET_STATUSES = new Set(["sent", "paid"]);
const OPEN_STATUSES = new Set(["sent"]);
const CONCEPT_STATUSES = new Set(["draft", "ready"]);

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function dateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function inPeriod(
  date: string | null,
  from: string | null,
  to: string | null,
): boolean {
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function monthLabel(year: number, monthIndex: number): string {
  const d = new Date(year, monthIndex, 1);
  return d.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

/** Resolve period presets (server/client safe). */
export function resolveFinancePeriod(
  keyRaw: string | null | undefined,
  fromRaw?: string | null,
  toRaw?: string | null,
  now = new Date(),
): FinancePeriod {
  const key = (keyRaw || "this_month") as FinancePeriodKey;
  const y = now.getFullYear();
  const m = now.getMonth();

  if (key === "all") {
    return { key, from: null, to: null, label: "Alle periodes" };
  }

  if (key === "custom") {
    const from = fromRaw && /^\d{4}-\d{2}-\d{2}$/.test(fromRaw) ? fromRaw : null;
    const to = toRaw && /^\d{4}-\d{2}-\d{2}$/.test(toRaw) ? toRaw : null;
    if (!from && !to) {
      return resolveFinancePeriod("this_month", null, null, now);
    }
    const label =
      from && to
        ? `${from} – ${to}`
        : from
          ? `Vanaf ${from}`
          : `Tot ${to}`;
    return { key: "custom", from, to, label };
  }

  if (key === "last_month") {
    const lm = m === 0 ? 11 : m - 1;
    const ly = m === 0 ? y - 1 : y;
    const from = toDateString(new Date(ly, lm, 1));
    const to = toDateString(new Date(ly, lm + 1, 0));
    return { key, from, to, label: monthLabel(ly, lm) };
  }

  if (key === "this_quarter") {
    const qStart = Math.floor(m / 3) * 3;
    const from = toDateString(new Date(y, qStart, 1));
    const to = toDateString(new Date(y, qStart + 3, 0));
    const q = Math.floor(m / 3) + 1;
    return { key, from, to, label: `Q${q} ${y}` };
  }

  if (key === "this_year") {
    return {
      key,
      from: `${y}-01-01`,
      to: `${y}-12-31`,
      label: String(y),
    };
  }

  // this_month (default)
  const from = toDateString(new Date(y, m, 1));
  const to = toDateString(new Date(y, m + 1, 0));
  return { key: "this_month", from, to, label: monthLabel(y, m) };
}

/**
 * Aggregates real invoice drafts + time entries into a finance overview.
 * Omzet = factuur `subtotal` (excl. BTW) voor sent/paid.
 * Personeelskosten = approved/invoiced uren × crew hourly_cost (Fooks/uurkost).
 */
export function aggregateFinanceOverview(
  drafts: InvoiceDraft[],
  entries: TimeEntry[],
  period: FinancePeriod,
): FinanceOverview {
  const { from, to } = period;

  const activeDrafts = drafts.filter(
    (d) => d.status !== "cancelled" && d.status !== "gecrediteerd",
  );
  const draftsInPeriod = activeDrafts.filter((d) =>
    inPeriod(dateOnly(d.created_at), from, to),
  );

  const costEntries = entries.filter(
    (e) =>
      COST_ENTRY_STATUSES.has(e.status) &&
      inPeriod(dateOnly(e.work_date), from, to),
  );

  let omzet = 0;
  let betaaldeOmzet = 0;
  let conceptOmzet = 0;
  let openstaand = 0;
  let gefactureerdeReiskosten = 0;

  const projectOmzet = new Map<string, { name: string; omzet: number }>();

  for (const d of draftsInPeriod) {
    const sub = Number(d.subtotal || 0);
    const travel = Number(d.travel_costs || 0);
    const projectId = d.project_id ?? "geen-project";
    const projectName = d.projects?.project_name ?? "Zonder project";

    if (OMZET_STATUSES.has(d.status)) {
      omzet += sub;
      gefactureerdeReiskosten += travel;
      const cur = projectOmzet.get(projectId) ?? { name: projectName, omzet: 0 };
      cur.omzet += sub;
      cur.name = projectName;
      projectOmzet.set(projectId, cur);
    }
    if (d.status === "paid") betaaldeOmzet += sub;
    if (OPEN_STATUSES.has(d.status)) openstaand += sub;
    if (CONCEPT_STATUSES.has(d.status)) conceptOmzet += sub;
  }

  let personeelskosten = 0;
  let totalHours = 0;
  let missingHourlyCostHours = 0;

  const projectCosts = new Map<
    string,
    { name: string; hours: number; cost: number }
  >();
  const crewCosts = new Map<
    string,
    { name: string; hours: number; cost: number }
  >();

  for (const e of costEntries) {
    const hours = Number(e.hours || 0);
    const hourly = e.crew_members?.hourly_cost;
    const rate = hourly == null ? 0 : Number(hourly);
    const cost = round2(hours * rate);

    totalHours += hours;
    personeelskosten += cost;
    if (hourly == null || Number.isNaN(rate) || rate <= 0) {
      missingHourlyCostHours += hours;
    }

    const projectId = e.project_id ?? "geen-project";
    const projectName = e.projects?.project_name ?? "Zonder project";
    const p = projectCosts.get(projectId) ?? {
      name: projectName,
      hours: 0,
      cost: 0,
    };
    p.hours += hours;
    p.cost += cost;
    p.name = projectName;
    projectCosts.set(projectId, p);

    const crewId = e.crew_member_id ?? "geen-crew";
    const crewName = e.crew_members?.full_name ?? "Onbekende crew";
    const c = crewCosts.get(crewId) ?? { name: crewName, hours: 0, cost: 0 };
    c.hours += hours;
    c.cost += cost;
    c.name = crewName;
    crewCosts.set(crewId, c);
  }

  const { margin, marginPercent } = calculateMarginEstimate(
    omzet,
    personeelskosten,
  );

  const projectIds = new Set([
    ...projectOmzet.keys(),
    ...projectCosts.keys(),
  ]);
  const byProject: FinanceBreakdownRow[] = [...projectIds]
    .map((id) => {
      const rev = projectOmzet.get(id)?.omzet ?? 0;
      const costRow = projectCosts.get(id);
      const cost = costRow?.cost ?? 0;
      const name =
        projectOmzet.get(id)?.name ?? costRow?.name ?? "Zonder project";
      const m = calculateMarginEstimate(rev, cost);
      return {
        id,
        name,
        hours: round2(costRow?.hours ?? 0),
        personeelskosten: round2(cost),
        omzet: round2(rev),
        marge: m.margin,
        margePercent: m.marginPercent,
      };
    })
    .sort((a, b) => b.omzet - a.omzet || b.personeelskosten - a.personeelskosten);

  const byCrew: FinanceBreakdownRow[] = [...crewCosts.entries()]
    .map(([id, row]) => {
      const m = calculateMarginEstimate(0, row.cost);
      return {
        id,
        name: row.name,
        hours: round2(row.hours),
        personeelskosten: round2(row.cost),
        omzet: 0,
        marge: m.margin,
        margePercent: null,
      };
    })
    .sort((a, b) => b.personeelskosten - a.personeelskosten);

  return {
    period,
    omzet: round2(omzet),
    betaaldeOmzet: round2(betaaldeOmzet),
    conceptOmzet: round2(conceptOmzet),
    openstaand: round2(openstaand),
    personeelskosten: round2(personeelskosten),
    marge: margin,
    margePercent: marginPercent,
    totalHours: round2(totalHours),
    gefactureerdeReiskosten: round2(gefactureerdeReiskosten),
    missingHourlyCostHours: round2(missingHourlyCostHours),
    byProject,
    byCrew,
  };
}
