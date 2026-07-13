import type { Metadata } from "next";
import ClientInvoiceTable from "@/components/client-portal/ClientInvoiceTable";

export const metadata: Metadata = {
  title: "Facturen | Opdrachtgeversportaal",
  description: "Overzicht van facturen en betaalstatus.",
};

export default function ClientInvoicesPage() {
  return <ClientInvoiceTable />;
}
