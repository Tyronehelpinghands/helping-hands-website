import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlanningHours } from "@/data/planningMockData";
import {
  hoursStatusLabels,
  hoursStatusStyles,
} from "@/lib/planning-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HoursControlTableProps = {
  hours: PlanningHours[];
  onApprove?: (hour: PlanningHours) => void;
  onCorrect?: (hour: PlanningHours) => void;
};

export default function HoursControlTable({
  hours,
  onApprove,
  onCorrect,
}: HoursControlTableProps) {
  return (
    <div className="-mx-2 overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Shift</TableHead>
            <TableHead>Medewerker</TableHead>
            <TableHead>Gepland</TableHead>
            <TableHead>Gewerkt</TableHead>
            <TableHead>Verschil</TableHead>
            <TableHead>Pauze</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-sm text-[#101828]/55">
                Geen urenregistraties beschikbaar.
              </TableCell>
            </TableRow>
          ) : (
            hours.map((h) => {
              const diff = Math.round((h.workedHours - h.plannedHours) * 100) / 100;
              const diffLabel =
                diff === 0 ? "0" : diff > 0 ? `+${diff}` : String(diff);
              return (
                <TableRow key={h.id} className="hover:bg-[#F5F7FA]/40">
                  <TableCell className="font-medium text-[#0B1F4D]">{h.shiftTitle}</TableCell>
                  <TableCell>{h.crewName}</TableCell>
                  <TableCell>{h.plannedHours}u</TableCell>
                  <TableCell className="font-semibold">{h.workedHours}u</TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      diff < 0 ? "text-amber-700" : diff > 0 ? "text-purple-700" : "text-green-700",
                    )}
                  >
                    {diffLabel}
                  </TableCell>
                  <TableCell className="text-xs">{h.breakMinutes} min</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] font-semibold", hoursStatusStyles[h.status])}
                    >
                      {hoursStatusLabels[h.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {onApprove && h.status !== "goedgekeurd" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onApprove(h)}
                        >
                          Goedkeuren
                        </Button>
                      )}
                      {onCorrect && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-[#173A8A]"
                          onClick={() => onCorrect(h)}
                        >
                          Corrigeren
                        </Button>
                      )}
                    </div>
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
