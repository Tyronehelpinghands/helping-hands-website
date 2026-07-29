import type {
  ClientStatus,
  CrewMemberStatus,
  EmploymentType,
  InvoiceDraftStatus,
  LeadStatus,
  ProjectStatus,
  ProjectType,
  ShiftStatus,
  ShiftbaseSyncStatus,
  TaskPriority,
  TaskStatus,
  TimeEntryStatus,
  InternalMessageStatus,
} from "@/lib/dashboard/types";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "—";
  }
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("nl-NL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "—";
  return value.slice(0, 5);
}

export function formatHours(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${formatNumber(value, 2)} u`;
}

export function clientStatusLabel(status: ClientStatus): string {
  switch (status) {
    case "active":
      return "Actief";
    case "prospect":
      return "Prospect";
    case "inactive":
      return "Inactief";
  }
}

export function leadStatusLabel(status: LeadStatus): string {
  switch (status) {
    case "new":
      return "Nieuw";
    case "contacted":
      return "Gecontacteerd";
    case "proposal_sent":
      return "Offerte verstuurd";
    case "won":
      return "Gewonnen";
    case "lost":
      return "Verloren";
  }
}

export function employmentTypeLabel(type: EmploymentType): string {
  switch (type) {
    case "payroll":
      return "Payroll";
    case "zzp":
      return "ZZP";
    case "freelance":
      return "Freelance";
    case "other":
      return "Overig";
  }
}

export function crewStatusLabel(status: CrewMemberStatus): string {
  switch (status) {
    case "active":
      return "Actief";
    case "inactive":
      return "Inactief";
    case "onboarding":
      return "Onboarding";
  }
}

export function projectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "draft":
      return "Concept";
    case "confirmed":
      return "Bevestigd";
    case "in_progress":
      return "Lopend";
    case "completed":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
  }
}

export function projectTypeLabel(type: ProjectType | null | undefined): string {
  if (!type) return "—";
  const map: Record<ProjectType, string> = {
    event: "Event",
    horeca: "Horeca",
    restaurant: "Restaurant",
    keuken: "Keuken",
    bar: "Bar",
    stagebouw: "Stagebouw",
    productie: "Productie",
    logistiek: "Logistiek",
    hospitality: "Hospitality",
    overig: "Overig",
  };
  return map[type];
}

export function shiftStatusLabel(status: ShiftStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "assigned":
      return "Toegewezen";
    case "confirmed":
      return "Bevestigd";
    case "completed":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
  }
}

export function shiftbaseSyncStatusLabel(
  status: ShiftbaseSyncStatus | null | undefined,
): string {
  switch (status) {
    case "gesynct":
      return "Gesynct";
    case "fout":
      return "Fout";
    case "overgeslagen":
      return "Overgeslagen";
    case "niet_gesynct":
    default:
      return "Niet gesynct";
  }
}

export function timeEntryStatusLabel(status: TimeEntryStatus): string {
  switch (status) {
    case "draft":
      return "Concept";
    case "submitted":
      return "Ingediend";
    case "approved":
      return "Goedgekeurd";
    case "rejected":
      return "Afgekeurd";
    case "invoiced":
      return "Gefactureerd";
  }
}

export function invoiceStatusLabel(status: InvoiceDraftStatus): string {
  switch (status) {
    case "draft":
      return "Concept";
    case "ready":
      return "Klaar";
    case "sent":
      return "Verstuurd";
    case "paid":
      return "Betaald";
    case "cancelled":
      return "Geannuleerd";
  }
}

export function taskPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case "low":
      return "Laag";
    case "normal":
      return "Normaal";
    case "high":
      return "Hoog";
    case "critical":
      return "Kritiek";
  }
}

export function taskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "Bezig";
    case "done":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
  }
}

export function messageStatusLabel(status: InternalMessageStatus): string {
  switch (status) {
    case "draft":
      return "Concept";
    case "ready":
      return "Klaar";
    case "sent":
      return "Verstuurd";
    case "archived":
      return "Gearchiveerd";
  }
}

export function messageTypeLabel(type: string | null | undefined): string {
  switch (type) {
    case "whatsapp_briefing":
      return "WhatsApp briefing";
    case "email_client":
      return "E-mail opdrachtgever";
    case "crew_reminder":
      return "Crew reminder";
    case "invoice_reminder":
      return "Factuur reminder";
    default:
      return type || "Overig";
  }
}

export function csvEscape(value: string | number | null | undefined): string {
  const raw = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function invoiceDraftToCsv(
  draft: {
    invoice_number: string | null;
    clients?: { company_name: string } | null;
    projects?: { project_name: string } | null;
    status: string;
    total_hours: number;
    hourly_rate: number | null;
    travel_costs: number;
    subtotal: number;
    vat_amount: number;
    total_amount: number;
    invoice_draft_lines?: Array<{
      description: string;
      quantity: number | null;
      unit_price: number | null;
      vat_rate: number;
      line_total: number | null;
    }>;
  },
): string {
  const header = [
    "factuurnummer",
    "opdrachtgever",
    "project",
    "status",
    "omschrijving",
    "aantal",
    "prijs",
    "btw%",
    "regel_totaal",
    "subtotal",
    "btw",
    "totaal",
  ].join(",");

  const lines = draft.invoice_draft_lines ?? [];
  if (lines.length === 0) {
    return [
      header,
      [
        csvEscape(draft.invoice_number),
        csvEscape(draft.clients?.company_name),
        csvEscape(draft.projects?.project_name),
        csvEscape(draft.status),
        "",
        csvEscape(draft.total_hours),
        csvEscape(draft.hourly_rate),
        "21",
        "",
        csvEscape(draft.subtotal),
        csvEscape(draft.vat_amount),
        csvEscape(draft.total_amount),
      ].join(","),
    ].join("\n");
  }

  const rows = lines.map((line) =>
    [
      csvEscape(draft.invoice_number),
      csvEscape(draft.clients?.company_name),
      csvEscape(draft.projects?.project_name),
      csvEscape(draft.status),
      csvEscape(line.description),
      csvEscape(line.quantity),
      csvEscape(line.unit_price),
      csvEscape(line.vat_rate),
      csvEscape(line.line_total),
      csvEscape(draft.subtotal),
      csvEscape(draft.vat_amount),
      csvEscape(draft.total_amount),
    ].join(","),
  );

  return [header, ...rows].join("\n");
}
