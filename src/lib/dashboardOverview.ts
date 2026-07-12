import { DASHBOARD_ROUTES } from "@/lib/dashboardNavigation";
import { formatCurrency } from "@/lib/dashboardHelpers";
import { computeCrewStats, demoCrewMembers } from "@/lib/crew";
import { computeHoursStats, demoHoursEntries } from "@/lib/hours";
import {
  computeInvoiceStats,
  demoInvoiceDrafts,
} from "@/lib/invoicing";
import {
  calculateFinanceMetrics,
  demoFinanceExpenses,
  demoFinanceInvoices,
  getOutstandingAmount,
} from "@/lib/finance";
import { computeMessageStats, demoMessages } from "@/lib/messages";
import { computeRiskStats, demoRiskActions } from "@/lib/riskActions";

export type CockpitKpi = {
  id: string;
  title: string;
  value: string;
  detail: string;
  href: string;
  icon:
    | "projects"
    | "crew"
    | "hours"
    | "invoice"
    | "finance"
    | "risk"
    | "messages"
    | "integrations";
};

export type AttentionItem = {
  id: string;
  title: string;
  priority: "Normaal" | "Hoog" | "Kritiek";
  href: string;
};

export function buildCockpitKpis(): CockpitKpi[] {
  const crewStats = computeCrewStats(demoCrewMembers);
  const hoursStats = computeHoursStats(demoHoursEntries);
  const invoiceStats = computeInvoiceStats(demoInvoiceDrafts);
  const financeMetrics = calculateFinanceMetrics(
    demoFinanceInvoices,
    demoFinanceExpenses,
  );
  const riskStats = computeRiskStats(demoRiskActions);
  const messageStats = computeMessageStats(demoMessages);

  const openProjects = 6;
  const conceptInvoices = invoiceStats.conceptCount + invoiceStats.readyForMoneybirdCount;

  return [
    {
      id: "projects",
      title: "Open projecten",
      value: String(openProjects),
      detail: "Demo-projecten in voorbereiding of live",
      href: DASHBOARD_ROUTES.projecten,
      icon: "projects",
    },
    {
      id: "crew",
      title: "Beschikbare crew",
      value: String(crewStats.availableThisWeek),
      detail: `${crewStats.total} crewleden · ${crewStats.zzp} ZZP`,
      href: DASHBOARD_ROUTES.crew,
      icon: "crew",
    },
    {
      id: "hours",
      title: "Open uren",
      value: String(hoursStats.openHours),
      detail: `${hoursStats.approvedHours} u goedgekeurd deze week`,
      href: DASHBOARD_ROUTES.urenregistratie,
      icon: "hours",
    },
    {
      id: "invoices",
      title: "Factuurconcepten",
      value: String(conceptInvoices),
      detail: `${invoiceStats.createdInMoneybirdCount} in Moneybird`,
      href: DASHBOARD_ROUTES.facturatie,
      icon: "invoice",
    },
    {
      id: "finance",
      title: "Openstaande facturen",
      value: formatCurrency(getOutstandingAmount(demoFinanceInvoices)),
      detail: `${financeMetrics.overdueInvoices} te laat`,
      href: DASHBOARD_ROUTES.financien,
      icon: "finance",
    },
    {
      id: "risk",
      title: "Kritieke risico's",
      value: String(riskStats.criticalRisks),
      detail: `${riskStats.openActions} open acties`,
      href: DASHBOARD_ROUTES.risicoActies,
      icon: "risk",
    },
    {
      id: "messages",
      title: "Berichten wacht op reactie",
      value: String(messageStats.waitingForReply),
      detail: `${messageStats.urgent} spoedberichten`,
      href: DASHBOARD_ROUTES.berichten,
      icon: "messages",
    },
    {
      id: "integrations",
      title: "Integraties",
      value: "3 actief",
      detail: "Shiftbase · Moneybird · HubSpot (demo)",
      href: DASHBOARD_ROUTES.instellingen,
      icon: "integrations",
    },
  ];
}

export function buildAttentionItems(): AttentionItem[] {
  const hoursStats = computeHoursStats(demoHoursEntries);
  const invoiceStats = computeInvoiceStats(demoInvoiceDrafts);
  const riskStats = computeRiskStats(demoRiskActions);
  const messageStats = computeMessageStats(demoMessages);

  const items: AttentionItem[] = [];

  if (hoursStats.openHours > 0) {
    items.push({
      id: "hours",
      title: `${hoursStats.openHours} uren nog te controleren`,
      priority: "Hoog",
      href: DASHBOARD_ROUTES.urenregistratie,
    });
  }

  if (invoiceStats.readyForMoneybirdCount > 0) {
    items.push({
      id: "invoice",
      title: `${invoiceStats.readyForMoneybirdCount} factuurconcepten klaarzetten`,
      priority: "Normaal",
      href: DASHBOARD_ROUTES.facturatie,
    });
  }

  if (riskStats.criticalRisks > 0) {
    items.push({
      id: "risk",
      title: `${riskStats.criticalRisks} kritieke risico's vereisen actie`,
      priority: "Kritiek",
      href: DASHBOARD_ROUTES.risicoActies,
    });
  }

  if (messageStats.waitingForReply > 0) {
    items.push({
      id: "messages",
      title: `${messageStats.waitingForReply} berichten wachten op reactie`,
      priority: "Normaal",
      href: DASHBOARD_ROUTES.berichten,
    });
  }

  items.push({
    id: "planning",
    title: "Open planning controleren voor komende week",
    priority: "Normaal",
    href: DASHBOARD_ROUTES.planning,
  });

  return items;
}
