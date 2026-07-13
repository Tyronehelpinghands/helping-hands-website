import type { Metadata } from "next";
import ClientPortalShell from "@/components/client-portal/ClientPortalShell";

export const metadata: Metadata = {
  title: "Opdrachtgeversportaal | Helping Hands Agency",
  description:
    "Bekijk aanvragen, projecten, planning, briefings, urenstatus en facturen als opdrachtgever.",
};

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientPortalShell>{children}</ClientPortalShell>;
}
