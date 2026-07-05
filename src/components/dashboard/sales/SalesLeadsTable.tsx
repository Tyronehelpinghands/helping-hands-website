import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SalesLead } from "@/data/salesMockData";
import { cn } from "@/lib/utils";

const statusStyles: Record<SalesLead["status"], string> = {
  nieuw: "border-[#38bdf8]/20 bg-[#38bdf8]/10 text-[#0284c7]",
  contact: "border-[#173A8A]/20 bg-[#173A8A]/10 text-[#173A8A]",
  offerte: "border-[#F28C28]/20 bg-[#F28C28]/10 text-[#c96f1a]",
  gewonnen: "border-green-200 bg-green-50 text-green-700",
  verloren: "border-slate-200 bg-slate-100 text-slate-600",
};

const statusLabels: Record<SalesLead["status"], string> = {
  nieuw: "Nieuw",
  contact: "Contact",
  offerte: "Offerte",
  gewonnen: "Gewonnen",
  verloren: "Verloren",
};

function formatCurrency(value: number) {
  if (value <= 0) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

type SalesLeadsTableProps = {
  leads: SalesLead[];
};

export default function SalesLeadsTable({ leads }: SalesLeadsTableProps) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Leads
        </CardTitle>
        <CardDescription>
          Actieve en recente sales leads met eigenaar en status
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Bedrijf</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waarde</TableHead>
                <TableHead>Eigenaar</TableHead>
                <TableHead className="pr-6">Laatste contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="pl-6 font-semibold text-[#0B1F4D]">
                    {lead.bedrijf}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#101828]">{lead.contact}</p>
                      <p className="text-xs text-[#101828]/55">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("font-semibold", statusStyles[lead.status])}
                    >
                      {statusLabels[lead.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-[#173A8A]">
                    {formatCurrency(lead.waarde)}
                  </TableCell>
                  <TableCell className="text-[#101828]/75">
                    {lead.eigenaar}
                  </TableCell>
                  <TableCell className="pr-6 text-[#101828]/75">
                    {lead.laatsteContact}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
