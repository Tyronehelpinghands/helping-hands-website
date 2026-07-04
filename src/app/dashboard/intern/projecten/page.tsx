import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Projecten | Intern dashboard",
};

export default function InternProjectenPage() {
  return (
    <InternPlaceholderPage
      title="Projecten"
      description="Beheer actieve projecten, planning, crewbezetting en projectstatus."
    />
  );
}
