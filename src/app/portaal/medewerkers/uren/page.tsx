import type { Metadata } from "next";
import HoursCheckTable from "@/components/employee-portal/HoursCheckTable";

export const metadata: Metadata = {
  title: "Mijn uren | Medewerkersportaal",
  description:
    "Bekijk je gewerkte uren en geef wijzigingen door. Goedkeuring gebeurt door planning.",
};

export default function EmployeeHoursPage() {
  return <HoursCheckTable />;
}
