import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Facturatie | Intern dashboard",
};

export default function InternFacturatiePage() {
  return (
    <InternPlaceholderPage
      title="Facturatie"
      description="Bereid facturen voor, keur ze goed en volg betalingen op."
    />
  );
}
