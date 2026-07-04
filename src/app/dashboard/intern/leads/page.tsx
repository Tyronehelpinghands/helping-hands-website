import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Leads | Intern dashboard",
};

export default function InternLeadsPage() {
  return (
    <InternPlaceholderPage
      title="Leads"
      description="Overzicht van nieuwe leads, follow-ups en conversie naar projecten."
    />
  );
}
