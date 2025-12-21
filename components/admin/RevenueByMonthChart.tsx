"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type MonthlyRow = {
  monthKey: string;
  bookingCount: number;
  totalRevenueUSD: number;
  totalDepositsUSD: number;
  totalBalanceUSD: number;
};

interface RevenueByMonthChartProps {
  data: MonthlyRow[];
}

function formatMonthLabel(key: string): string {
  if (key === "Unknown") return "Unknown";
  const [year, month] = key.split("-");
  const m = Number(month);
  const date = new Date(Number(year), m - 1, 1);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default function RevenueByMonthChart({
  data,
}: RevenueByMonthChartProps) {
  const chartData = data
    .filter((d) => d.monthKey !== "Unknown")
    .map((d) => ({
      month: formatMonthLabel(d.monthKey),
      revenue: Math.round(d.totalRevenueUSD),
      advances: Math.round(d.totalDepositsUSD),
      balances: Math.round(d.totalBalanceUSD),
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
        No revenue data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.2} />
        <XAxis
          dataKey="month"
          stroke="#FFFFFF"
          tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
          label={{ 
            value: "Month (Year)", 
            position: "insideBottom", 
            offset: -10,
            style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 }
          }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis
          stroke="#FFFFFF"
          tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          label={{ 
            value: "Revenue Amount (USD)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 }
          }}
          width={90}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#020617",
            border: "2px solid #FFFFFF",
            borderRadius: "8px",
            color: "#FFFFFF",
            padding: "10px 14px",
            fontWeight: 500,
          }}
          labelStyle={{ color: "#FFFFFF", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}
          itemStyle={{ color: "#FFFFFF", fontWeight: 500, fontSize: "13px" }}
          formatter={(value: number | undefined, name: string | undefined) => {
            const val = value ?? 0;
            const nameStr = name === "revenue" ? "Total Revenue" : name === "advances" ? "Advances Paid" : name ?? "";
            const formattedValue = `USD ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            return [formattedValue, nameStr];
          }}
          labelFormatter={(label) => `Period: ${label}`}
        />
        <Legend
          wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
          iconType="line"
          formatter={(value) => <span style={{ color: "#FFFFFF", opacity: 1 }}>{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#0F6F7C"
          strokeWidth={2.5}
          dot={{ fill: "#0F6F7C", r: 4, strokeWidth: 2, stroke: "#0B3C49" }}
          activeDot={{ r: 6, stroke: "#0F6F7C", strokeWidth: 2 }}
          name="Total Revenue"
        />
        <Line
          type="monotone"
          dataKey="advances"
          stroke="#10B981"
          strokeWidth={2.5}
          dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "#0B3C49" }}
          activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
          name="Advances Paid"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

