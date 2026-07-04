export type RevenuePoint = {
  month: string;
  omzet: number;
};

export type ProjectStatusPoint = {
  status: string;
  count: number;
  fill: string;
};

export const revenueByMonth: RevenuePoint[] = [
  { month: "Jan", omzet: 18400 },
  { month: "Feb", omzet: 22100 },
  { month: "Mrt", omzet: 19800 },
  { month: "Apr", omzet: 26500 },
  { month: "Mei", omzet: 31200 },
  { month: "Jun", omzet: 28700 },
];

export const projectStatusBreakdown: ProjectStatusPoint[] = [
  { status: "Actief", count: 6, fill: "#173A8A" },
  { status: "In voorbereiding", count: 4, fill: "#38bdf8" },
  { status: "Briefing", count: 3, fill: "#0ea5e9" },
  { status: "Afgerond", count: 11, fill: "#F28C28" },
];

export const medewerkerShiftTrend = [
  { week: "W1", shifts: 2 },
  { week: "W2", shifts: 3 },
  { week: "W3", shifts: 1 },
  { week: "W4", shifts: 4 },
];

export const opdrachtgeverRequestStatus = [
  { status: "Open", count: 2, fill: "#173A8A" },
  { status: "In behandeling", count: 3, fill: "#38bdf8" },
  { status: "Bevestigd", count: 5, fill: "#F28C28" },
];
