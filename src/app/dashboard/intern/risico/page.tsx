import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Risico & Acties | Intern dashboard",
};

export default function InternRisicoPage() {
  return (
    <InternPlaceholderPage
      title="Risico & Acties"
      description="Volg open acties, risico's en opvolging per eigenaar en deadline."
    />
  );
}
