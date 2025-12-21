// components/admin/GeographicChart.tsx

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

interface GeographicChartProps {
  data: Array<{ country: string; count: number }>;
  title: string;
}

const COLORS = ["#0F6F7C", "#0B3C49", "#F9735B", "#F3E2C7", "#E5EEF2"];

export default function GeographicChart({ data, title }: GeographicChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    name: item.country,
    visits: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
        No geographic data available yet
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-sb-cream mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#F9F3EB"
            fontSize={11}
            tick={{ fill: "#F9F3EB", opacity: 0.8 }}
            angle={-45}
            textAnchor="end"
            height={80}
            label={{
              value: "Country",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#F9F3EB", opacity: 0.9, fontSize: 13, fontWeight: 500 },
            }}
          />
          <YAxis
            stroke="#F9F3EB"
            fontSize={11}
            tick={{ fill: "#F9F3EB", opacity: 0.8 }}
            label={{
              value: "Number of Visits",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#F9F3EB", opacity: 0.9, fontSize: 13, fontWeight: 500 },
            }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0B3C49",
              border: "1px solid #F9F3EB",
              borderRadius: "8px",
              color: "#F9F3EB",
            }}
            labelStyle={{ color: "#F9F3EB", fontWeight: 600 }}
          />
          <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

