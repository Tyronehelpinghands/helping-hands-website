import type { Metadata } from "next";
import MessagesDashboardClient from "@/components/dashboard/berichten/MessagesDashboardClient";

export const metadata: Metadata = {
  title: "Berichten | Intern dashboard",
  description:
    "Beheer communicatie met crew, opdrachtgevers, sollicitanten en interne planning.",
};

// TODO: later koppelen aan echte auth/rollen zodat alleen interne admins/planners communicatie kunnen beheren

export default function InternBerichtenPage() {
  return <MessagesDashboardClient />;
}
