import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlanningAssignment, PlanningShift } from "@/data/planningMockData";
import { formatPlanningCurrency, travelStatusLabels } from "@/lib/planning-utils";
import { cn } from "@/lib/utils";

type TravelCostTableProps = {
  assignments: PlanningAssignment[];
  shifts: PlanningShift[];
};

export default function TravelCostTable({ assignments, shifts }: TravelCostTableProps) {
  const shiftMap = new Map(shifts.map((s) => [s.id, s]));

  return (
    <div className="-mx-2 overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Medewerker</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Woonplaats</TableHead>
            <TableHead>Locatie</TableHead>
            <TableHead>Retour km</TableHead>
            <TableHead>Tarief/km</TableHead>
            <TableHead>Totaal</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-sm text-[#101828]/55">
                Geen kilometervergoedingen berekend.
              </TableCell>
            </TableRow>
          ) : (
            assignments.map((a) => {
              const shift = shiftMap.get(a.shiftId);
              return (
                <TableRow key={a.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="font-medium text-[#0B1F4D]">{a.crewName}</TableCell>
                  <TableCell>{shift?.title ?? "—"}</TableCell>
                  <TableCell>{a.homeCity ?? "—"}</TableCell>
                  <TableCell>{shift?.locationName ?? "—"}</TableCell>
                  <TableCell>
                    {a.travelKmReturn != null ? `${a.travelKmReturn} km` : "—"}
                  </TableCell>
                  <TableCell>€{a.travelFeePerKm.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold text-[#173A8A]">
                    {a.travelFeeTotal != null
                      ? formatPlanningCurrency(a.travelFeeTotal)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        a.travelCalculationStatus === "berekend"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      )}
                    >
                      {travelStatusLabels[a.travelCalculationStatus]}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
