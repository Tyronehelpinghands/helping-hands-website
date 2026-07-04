import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Financiën | Intern dashboard",
};

export default function InternFinancienPage() {
  return (
    <InternPlaceholderPage
      title="Financiën"
      description="Financieel overzicht, omzet, kosten en rapportages."
    />
  );
}
