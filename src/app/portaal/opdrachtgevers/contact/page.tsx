import type { Metadata } from "next";
import ClientContactPanel from "@/components/client-portal/ClientContactPanel";

export const metadata: Metadata = {
  title: "Contact | Opdrachtgeversportaal",
  description: "Neem contact op met planning, administratie of sales.",
};

export default function ClientContactPage() {
  return <ClientContactPanel />;
}
