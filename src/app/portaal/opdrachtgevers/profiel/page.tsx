import type { Metadata } from "next";
import ClientProfileCard from "@/components/client-portal/ClientProfileCard";

export const metadata: Metadata = {
  title: "Bedrijfsprofiel | Opdrachtgeversportaal",
  description: "Bedrijfs- en contactgegevens beheren.",
};

export default function ClientProfilePage() {
  return <ClientProfileCard />;
}
