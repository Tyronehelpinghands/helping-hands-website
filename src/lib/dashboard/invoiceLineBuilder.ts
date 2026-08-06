import { getISOWeekNumber } from "@/lib/hours";
import type { ProjectType } from "@/lib/dashboard/types";

export type TimeEntryForInvoiceLines = {
  work_date: string;
  hours?: number | null;
  kilometers?: number | null;
  travel_time_hours?: number | null;
  crew_member_id?: string | null;
  /** Directe naam (optioneel; anders uit crew_members). */
  crew_full_name?: string | null;
  crew_members?:
    | { full_name?: string | null }
    | { full_name?: string | null }[]
    | null;
};

export type BuiltInvoiceDraftLine = {
  invoice_draft_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  line_total: number;
};

/** Rol-label voor factuurregel (o.a. Moneybird-grootboekmatching). */
export function invoiceRoleLabel(
  projectType: ProjectType | null | undefined,
): string {
  switch (projectType) {
    case "horeca":
    case "restaurant":
    case "keuken":
    case "bar":
    case "hospitality":
      return "Horeca";
    case "stagebouw":
      return "Stagehands";
    case "productie":
      return "Productie";
    case "logistiek":
      return "Logistiek";
    case "event":
      return "Event crew";
    default:
      return "Site crew";
  }
}

/** Nederlands korte datum, bv. "28 jun 2026". */
export function formatDutchInvoiceDate(dateStr: string): string {
  const d = new Date(
    dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`,
  );
  if (Number.isNaN(d.getTime())) return dateStr;
  return d
    .toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "");
}

function isoWeekParts(dateStr: string): { year: number; week: number } {
  const date = new Date(`${dateStr}T12:00:00`);
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  return {
    year: target.getFullYear(),
    week: getISOWeekNumber(dateStr),
  };
}

function formatDateSpan(dates: string[]): string {
  const sorted = [...new Set(dates.filter(Boolean))].sort();
  if (sorted.length === 0) return "";
  if (sorted.length === 1) return formatDutchInvoiceDate(sorted[0]!);
  return `${formatDutchInvoiceDate(sorted[0]!)} – ${formatDutchInvoiceDate(sorted[sorted.length - 1]!)}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Haalt full_name uit entry of geneste crew_members-relatie. */
export function resolveCrewFullName(
  entry: TimeEntryForInvoiceLines,
): string {
  const direct = String(entry.crew_full_name ?? "").trim();
  if (direct) return direct;
  const nested = entry.crew_members;
  if (Array.isArray(nested)) {
    return String(nested[0]?.full_name ?? "").trim();
  }
  return String(nested?.full_name ?? "").trim();
}

type WeekBucket = {
  year: number;
  week: number;
  crewKey: string;
  names: Set<string>;
  dates: string[];
  hours: number;
  kilometers: number;
  travelTimeHours: number;
};

function groupEntriesByCrewAndIsoWeek(
  entries: TimeEntryForInvoiceLines[],
): WeekBucket[] {
  const map = new Map<string, WeekBucket>();

  for (const entry of entries) {
    const workDate = String(entry.work_date ?? "").trim();
    if (!workDate) continue;
    const { year, week } = isoWeekParts(workDate);
    const name = resolveCrewFullName(entry);
    const crewId = String(entry.crew_member_id ?? "").trim();
    // Eén bucket per crewlid (of onbekend) per ISO-week.
    const crewKey = crewId || (name ? `name:${name.toLowerCase()}` : "_unknown");
    const key = `${crewKey}|${year}-W${String(week).padStart(2, "0")}`;
    let bucket = map.get(key);
    if (!bucket) {
      bucket = {
        year,
        week,
        crewKey,
        names: new Set(),
        dates: [],
        hours: 0,
        kilometers: 0,
        travelTimeHours: 0,
      };
      map.set(key, bucket);
    }
    if (name) bucket.names.add(name);
    bucket.dates.push(workDate);
    bucket.hours += Number(entry.hours) || 0;
    bucket.kilometers += Number(entry.kilometers) || 0;
    bucket.travelTimeHours += Number(entry.travel_time_hours) || 0;
  }

  return [...map.values()].sort(
    (a, b) =>
      a.year - b.year ||
      a.week - b.week ||
      [...a.names].join(", ").localeCompare([...b.names].join(", "), "nl"),
  );
}

function formatCrewNames(names: Set<string>): string {
  return [...names].sort((a, b) => a.localeCompare(b, "nl")).join(", ");
}

function withCrewInDescription(
  prefix: string,
  crewNames: string,
  when: string,
  suffix = "",
): string {
  const parts = [prefix];
  if (crewNames) parts.push(crewNames);
  parts.push(when);
  return `${parts.join(" — ")}${suffix}`;
}

/**
 * Bouwt factuurregels gegroepeerd per crewlid + ISO-week, met naam, weeknummer
 * en datum(range) in de omschrijving.
 * Voorbeeld: "Site crew — Fabrice Da Graca — week 28 — 28 jun 2026".
 */
export function buildInvoiceDraftLinesFromEntries(options: {
  invoiceDraftId: string;
  entries: TimeEntryForInvoiceLines[];
  projectType?: ProjectType | null;
  hourlyRate: number;
  kmRate: number;
  vatPercent: number;
}): BuiltInvoiceDraftLine[] {
  const roleLabel = invoiceRoleLabel(options.projectType);
  const buckets = groupEntriesByCrewAndIsoWeek(options.entries);
  const lines: BuiltInvoiceDraftLine[] = [];

  for (const bucket of buckets) {
    const dateSpan = formatDateSpan(bucket.dates);
    const weekPart = `week ${bucket.week}`;
    const when = dateSpan ? `${weekPart} — ${dateSpan}` : weekPart;
    const crewNames = formatCrewNames(bucket.names);

    const hours = round2(bucket.hours);
    if (hours > 0) {
      const lineTotal = round2(hours * options.hourlyRate);
      lines.push({
        invoice_draft_id: options.invoiceDraftId,
        description: withCrewInDescription(roleLabel, crewNames, when),
        quantity: hours,
        unit_price: options.hourlyRate,
        vat_rate: options.vatPercent,
        line_total: lineTotal,
      });
    }

    const km = round2(bucket.kilometers);
    if (km > 0) {
      const lineTotal = round2(km * options.kmRate);
      lines.push({
        invoice_draft_id: options.invoiceDraftId,
        description: withCrewInDescription(
          "Kilometervergoeding",
          crewNames,
          when,
          ` (${km} km)`,
        ),
        quantity: km,
        unit_price: options.kmRate,
        vat_rate: options.vatPercent,
        line_total: lineTotal,
      });
    }

    const travelHours = round2(bucket.travelTimeHours);
    if (travelHours > 0) {
      const lineTotal = round2(travelHours * options.hourlyRate);
      lines.push({
        invoice_draft_id: options.invoiceDraftId,
        description: withCrewInDescription(
          `Reistijd — ${roleLabel}`,
          crewNames,
          when,
        ),
        quantity: travelHours,
        unit_price: options.hourlyRate,
        vat_rate: options.vatPercent,
        line_total: lineTotal,
      });
    }
  }

  return lines;
}
