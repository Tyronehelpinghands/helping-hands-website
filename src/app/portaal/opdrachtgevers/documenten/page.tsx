import type { Metadata } from "next";
import ClientDocuments from "@/components/client-portal/ClientDocuments";

export const metadata: Metadata = {
  title: "Documenten | Opdrachtgeversportaal",
  description: "Offertes, bevestigingen en overige documenten.",
};

export default function ClientDocumentsPage() {
  return <ClientDocuments />;
}
