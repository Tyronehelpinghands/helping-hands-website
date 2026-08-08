"use client";

import { useRouter } from "next/navigation";
import HoursCheckTable from "@/components/employee-portal/HoursCheckTable";
import HoursSubmitForm from "@/components/employee-portal/HoursSubmitForm";
import type {
  EmployeeHoursEntry,
  EmployeeHoursShiftOption,
} from "@/lib/employeePortal";

export default function EmployeeHoursPageClient({
  entries,
  shiftOptions,
}: {
  entries: EmployeeHoursEntry[];
  shiftOptions: EmployeeHoursShiftOption[];
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <HoursSubmitForm
        shiftOptions={shiftOptions}
        onSubmitted={() => router.refresh()}
      />
      <HoursCheckTable entries={entries} />
    </div>
  );
}
