import type { Metadata } from "next";
import RiskActionDashboardClient from "@/components/dashboard/risico-acties/RiskActionDashboardClient";

export const metadata: Metadata = {
  title: "Risico & Acties | Intern dashboard",
  description:
    "Beheer operationele risico's, openstaande acties, deadlines en opvolging.",
};

// TODO: later alleen interne admins/planners toegang geven via echte auth/rollen

export default function InternRisicoActiesPage() {
  return <RiskActionDashboardClient />;
}
