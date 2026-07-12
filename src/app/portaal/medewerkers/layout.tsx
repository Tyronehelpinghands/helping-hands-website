import type { Metadata } from "next";
import EmployeePortalShell from "@/components/employee-portal/EmployeePortalShell";

export const metadata: Metadata = {
  title: "Medewerkersportaal | Helping Hands Agency",
  description: "Planning, beschikbaarheid, uren en berichten voor crewleden.",
};

export default function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployeePortalShell>{children}</EmployeePortalShell>;
}
