// components/admin/ReferrerChart.tsx

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

interface ReferrerChartProps {
  data: Array<{ referrer: string; count: number }>;
}

const COLORS: Record<string, string> = {
  direct: "#0F6F7C",
  search: "#0B3C49",
  social: "#F9735B",
  other: "#F3E2C7",
};

export default function ReferrerChart({ data }: ReferrerChartProps) {
  const chartData = data.map((item) => ({
    name: item.referrer.charAt(0).toUpperCase() + item.referrer.slice(1),
    visits: item.count,
    color: COLORS[item.referrer] || "#E5EEF2",
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
        No referrer data available yet
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-sb-cream mb-4">Traffic Sources</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#F9F3EB"
            tick={{ fill: "#F9F3EB", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Traffic Source",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#F9F3EB", fontSize: 14, fontWeight: 600 },
            }}
          />
          <YAxis
            stroke="#F9F3EB"
            tick={{ fill: "#F9F3EB", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Number of Visits",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#F9F3EB", fontSize: 14, fontWeight: 600 },
            }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0F6F7C",
              border: "2px solid #F9F3EB",
              borderRadius: "8px",
              color: "#F9F3EB",
              fontWeight: 500,
              padding: "10px 14px",
            }}
            labelStyle={{ color: "#F9F3EB", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}
            itemStyle={{ color: "#F9F3EB", fontWeight: 500, fontSize: "13px" }}
          />
          <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

