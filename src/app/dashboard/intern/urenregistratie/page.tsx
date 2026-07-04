import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Urenregistratie | Intern dashboard",
};

export default function InternUrenregistratiePage() {
  return (
    <InternPlaceholderPage
      title="Urenregistratie"
      description="Controleer en keur uren goed van crew op projecten en shifts."
    />
  );
}
