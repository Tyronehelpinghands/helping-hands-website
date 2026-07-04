import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Crew | Intern dashboard",
};

export default function InternCrewPage() {
  return (
    <InternPlaceholderPage
      title="Crew"
      description="Beheer crewleden, beschikbaarheid, functies en profielen."
    />
  );
}
