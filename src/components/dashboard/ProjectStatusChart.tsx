"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectStatusSlice } from "@/data/dashboardMockData";

type ProjectStatusChartProps = {
  data: ProjectStatusSlice[];
  title?: string;
  description?: string;
};

export default function ProjectStatusChart({
  data,
  title = "Projectstatus",
  description = "Verdeling van projecten per fase",
}: ProjectStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black text-[#0B1F4D]">{title}</CardTitle>
          <CardDescription>Nog geen projectdata beschikbaar.</CardDescription>
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
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <div className="relative h-[240px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {data.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} projecten`, "Aantal"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 8px 24px rgba(11,31,77,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-[#0B1F4D]">{total}</p>
              <p className="text-xs font-semibold text-[#101828]/50">Totaal</p>
            </div>
          </div>
          <div className="w-full flex-1 space-y-3">
            {data.map((item) => {
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-[#F5F7FA]/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-semibold text-[#0B1F4D]">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#173A8A]">
                      {item.count}
                    </span>
                    <span className="ml-2 text-xs text-[#101828]/50">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Legacy bar chart data shape for medewerker/opdrachtgever dashboards
export type LegacyProjectStatusPoint = {
  status: string;
  count: number;
  fill: string;
};

export function LegacyProjectStatusBarChart({
  data,
  title,
  description,
}: {
  data: LegacyProjectStatusPoint[];
  title?: string;
  description?: string;
}) {
  return (
    <ProjectStatusChart
      data={data}
      title={title}
      description={description}
    />
  );
}
