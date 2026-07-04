"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RevenueDataPoint } from "@/data/dashboardMockData";

type RevenueChartProps = {
  data: RevenueDataPoint[];
  title?: string;
  description?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueChart({
  data,
  title = "Omzet & aanvragen",
  description = "Weekoverzicht omzet en binnenkomende aanvragen (demo-data)",
}: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">{title}</CardTitle>
          <CardDescription>Nog geen omzetdata beschikbaar.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-[#0B1F4D]/5">
      <CardHeader>
        <CardTitle className="text-lg font-black text-[#0B1F4D]">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-4 text-xs font-semibold">
          <span className="flex items-center gap-2 text-[#173A8A]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#173A8A]" />
            Omzet
          </span>
          <span className="flex items-center gap-2 text-[#F28C28]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F28C28]" />
            Aanvragen
          </span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="omzetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173A8A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#173A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="omzet"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `€${Math.round(value / 1000)}k`}
              />
              <YAxis
                yAxisId="aanvragen"
                orientation="right"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "omzet"
                    ? formatCurrency(Number(value))
                    : `${value} aanvragen`
                }
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(11,31,77,0.08)",
                }}
              />
              <Area
                yAxisId="omzet"
                type="monotone"
                dataKey="omzet"
                stroke="#173A8A"
                strokeWidth={2.5}
                fill="url(#omzetGradient)"
                name="omzet"
              />
              <Line
                yAxisId="aanvragen"
                type="monotone"
                dataKey="aanvragen"
                stroke="#F28C28"
                strokeWidth={2}
                dot={{ fill: "#F28C28", r: 4 }}
                name="aanvragen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
