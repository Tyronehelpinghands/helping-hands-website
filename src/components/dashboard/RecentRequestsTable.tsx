"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recentRequests = [
  {
    client: "Festival Noord",
    functie: "Event crew",
    datum: "12 jul",
    status: "Nieuw",
  },
  {
    client: "Concertzaal AMS",
    functie: "Stagehands",
    datum: "14 jul",
    status: "In planning",
  },
  {
    client: "Horeca Group BV",
    functie: "Horeca support",
    datum: "18 jul",
    status: "Bevestigd",
  },
  {
    client: "Beurs Rotterdam",
    functie: "Logistiek",
    datum: "22 jul",
    status: "Briefing",
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Nieuw":
      return "bg-[#38bdf8]/15 text-[#0369a1] border-[#38bdf8]/30";
    case "In planning":
      return "bg-[#173A8A]/10 text-[#173A8A] border-[#173A8A]/20";
    case "Bevestigd":
      return "bg-[#F28C28]/15 text-[#c2410c] border-[#F28C28]/30";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function RecentRequestsTable() {
  return (
    <Card
      id="aanvragen"
      className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5"
    >
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">
          Recente aanvragen
        </CardTitle>
        <CardDescription>Laatste personeelsaanvragen in behandeling</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opdrachtgever</TableHead>
              <TableHead>Functie</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRequests.map((row) => (
              <TableRow key={`${row.client}-${row.datum}`}>
                <TableCell className="font-semibold text-[#0B1F4D]">
                  {row.client}
                </TableCell>
                <TableCell>{row.functie}</TableCell>
                <TableCell>{row.datum}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusVariant(row.status)}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
