import type { Metadata } from "next";
import InternDashboardOverview from "@/components/dashboard/InternDashboardOverview";

export const metadata: Metadata = {
  title: "Intern dashboard | Helping Hands Agency",
  description:
    "Intern overzicht voor planning, sales, crew, projecten en administratie.",
};

export default function InternDashboardPage() {
  return <InternDashboardOverview />;
}
