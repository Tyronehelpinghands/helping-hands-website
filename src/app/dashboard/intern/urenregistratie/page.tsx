import type { Metadata } from "next";
import HoursDashboardClient from "@/components/dashboard/uren/HoursDashboardClient";

export const metadata: Metadata = {
  title: "Urenregistratie | Intern dashboard",
  description:
    "Controleer en keur uren goed per project en crewlid, bereken reiskosten en bereid facturatie voor.",
};

// TODO: later koppelen aan echte auth/rollen — layout beveiligt al admin/planner via intern layout

export default function InternUrenregistratiePage() {
  return <HoursDashboardClient />;
}
