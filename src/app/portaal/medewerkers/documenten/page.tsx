import type { Metadata } from "next";
import EmployeeDocuments from "@/components/employee-portal/EmployeeDocuments";

export const metadata: Metadata = {
  title: "Documenten | Medewerkersportaal",
};

export default function EmployeeDocumentsPage() {
  return <EmployeeDocuments />;
}
