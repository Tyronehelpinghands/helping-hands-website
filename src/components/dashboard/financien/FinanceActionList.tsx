import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FinanceAction } from "@/lib/finance";

type FinanceActionListProps = {
  actions: FinanceAction[];
};

const priorityStyles: Record<FinanceAction["priority"], string> = {
  Laag: "border-slate-200 bg-slate-100 text-slate-600",
  Normaal: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  Hoog: "border-red-200 bg-red-50 text-red-700",
};

const statusStyles: Record<FinanceAction["status"], string> = {
  Open: "border-amber-200 bg-amber-50 text-amber-700",
  "In behandeling": "border-[#0B1F4D]/20 bg-[#0B1F4D]/10 text-[#0B1F4D]",
  Afgerond: "border-green-200 bg-green-50 text-green-700",
};

export default function FinanceActionList({ actions }: FinanceActionListProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Financiële acties
        </CardTitle>
        <CardDescription>
          Actiepunten op basis van openstaande facturen, btw en kostencontrole.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F5F7FA]/40 px-4 py-3"
          >
            <div className="space-y-1">
              <p className="font-semibold text-[#0B1F4D]">{action.title}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className={priorityStyles[action.priority]}>
                  {action.priority}
                </Badge>
                <Badge className={statusStyles[action.status]}>
                  {action.status}
                </Badge>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              render={<Link href={action.href} />}
            >
              Openen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
