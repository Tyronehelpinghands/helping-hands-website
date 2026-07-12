import type { Metadata } from "next";
import AvailabilityPanel from "@/components/employee-portal/AvailabilityPanel";

export const metadata: Metadata = {
  title: "Beschikbaarheid | Medewerkersportaal",
};

export default function EmployeeAvailabilityPage() {
  return <AvailabilityPanel />;
}
