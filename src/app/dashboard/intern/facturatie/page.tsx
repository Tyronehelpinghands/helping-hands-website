import type { Metadata } from "next";
import InvoiceDashboardClient from "@/components/dashboard/facturatie/InvoiceDashboardClient";

export const metadata: Metadata = {
  title: "Facturatie | Intern dashboard",
  description:
    "Maak factuurconcepten op basis van goedgekeurde uren en stuur concepten naar Moneybird.",
};

// TODO: later alleen interne admins/planners toegang geven via echte auth/rollen

export default function InternFacturatiePage() {
  return <InvoiceDashboardClient />;
}
