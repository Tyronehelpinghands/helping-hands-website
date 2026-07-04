import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Planning | Intern dashboard",
};

export default function InternPlanningPage() {
  return (
    <InternPlaceholderPage
      title="Planning"
      description="Plan crew in op events, restaurants en producties met overzicht per dag en week."
    />
  );
}
