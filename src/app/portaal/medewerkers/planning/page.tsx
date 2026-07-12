import type { Metadata } from "next";
import UpcomingShifts from "@/components/employee-portal/UpcomingShifts";

export const metadata: Metadata = {
  title: "Mijn planning | Medewerkersportaal",
};

export default function EmployeePlanningPage() {
  return (
    <UpcomingShifts showFilters title="Mijn planning" description="Alle aankomende diensten en projectdetails" />
  );
}
