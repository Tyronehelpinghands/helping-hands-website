import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Sales | Intern dashboard",
};

export default function InternSalesPage() {
  return (
    <InternPlaceholderPage
      title="Sales"
      description="Beheer offertes, opvolging en salespipeline voor nieuwe opdrachten en events."
    />
  );
}
