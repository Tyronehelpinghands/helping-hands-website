import type { Metadata } from "next";
import ClientProjectCards from "@/components/client-portal/ClientProjectCards";

export const metadata: Metadata = {
  title: "Projecten | Opdrachtgeversportaal",
  description: "Overzicht van je projecten, statussen en documenten.",
};

export default function ClientProjectsPage() {
  return <ClientProjectCards />;
}
