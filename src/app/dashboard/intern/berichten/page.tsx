import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Berichten | Intern dashboard",
};

export default function InternBerichtenPage() {
  return (
    <InternPlaceholderPage
      title="Berichten"
      description="Alle meldingen, updates en interne communicatie op één plek."
    />
  );
}
