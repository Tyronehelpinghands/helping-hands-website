import type { Metadata } from "next";
import InternPlaceholderPage from "@/components/dashboard/InternPlaceholderPage";

export const metadata: Metadata = {
  title: "Instellingen | Intern dashboard",
};

export default function InternInstellingenPage() {
  return (
    <InternPlaceholderPage
      title="Instellingen"
      description="Beheer je profiel, voorkeuren en accountinstellingen."
    />
  );
}
