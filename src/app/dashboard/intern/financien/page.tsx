import type { Metadata } from "next";
import FinanceDashboardClient from "@/components/dashboard/financien/FinanceDashboardClient";

export const metadata: Metadata = {
  title: "Financiën | Intern dashboard",
  description:
    "Inzicht in omzet, kosten, marge, btw, openstaande facturen en financiële acties.",
};

// TODO: later alleen interne admins/planners toegang geven via echte auth/rollen

export default function InternFinancienPage() {
  return <FinanceDashboardClient />;
}
