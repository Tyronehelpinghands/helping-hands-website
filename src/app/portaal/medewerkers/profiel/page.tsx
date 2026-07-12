import type { Metadata } from "next";
import EmployeeProfileCard from "@/components/employee-portal/EmployeeProfileCard";

export const metadata: Metadata = {
  title: "Mijn profiel | Medewerkersportaal",
};

export default function EmployeeProfilePage() {
  return <EmployeeProfileCard />;
}
