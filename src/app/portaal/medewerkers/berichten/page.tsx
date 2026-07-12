import type { Metadata } from "next";
import EmployeeMessages from "@/components/employee-portal/EmployeeMessages";

export const metadata: Metadata = {
  title: "Berichten | Medewerkersportaal",
};

export default function EmployeeMessagesPage() {
  return <EmployeeMessages />;
}
