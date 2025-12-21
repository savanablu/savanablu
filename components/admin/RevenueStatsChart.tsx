"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RevenueStatsChartProps {
  totalRevenue: number;
  advances: number;
  balances: number;
}

const COLORS = ["#0F6F7C", "#10B981", "#F9735B"];

export default function RevenueStatsChart({
  totalRevenue,
  advances,
  balances,
}: RevenueStatsChartProps) {
  const chartData = [
    {
      name: "Total Revenue",
      amount: totalRevenue,
    },
    {
      name: "Advances",
      amount: advances,
    },
    {
      name: "Balances",
      amount: balances,
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4">Revenue Breakdown</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Revenue Type",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 },
            }}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            label={{
              value: "Amount (USD)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 },
            }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "2px solid #FFFFFF",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontWeight: 500,
              padding: "10px 14px",
            }}
            labelStyle={{ color: "#FFFFFF", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}
            itemStyle={{ color: "#FFFFFF", fontWeight: 500, fontSize: "13px" }}
            formatter={(value: number | undefined) => {
              const val = value ?? 0;
              return [`USD ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Amount"];
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

