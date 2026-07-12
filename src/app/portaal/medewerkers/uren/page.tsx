import type { Metadata } from "next";
import HoursCheckTable from "@/components/employee-portal/HoursCheckTable";

export const metadata: Metadata = {
  title: "Mijn uren | Medewerkersportaal",
};

export default function EmployeeHoursPage() {
  return <HoursCheckTable />;
}
