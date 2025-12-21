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

interface PageVisitsChartProps {
  totalVisits: number;
  safariVisits: number;
  tourVisits: number;
}

const COLORS = ["#0F6F7C", "#10B981", "#0F6F7C"];

export default function PageVisitsChart({
  totalVisits,
  safariVisits,
  tourVisits,
}: PageVisitsChartProps) {
  const chartData = [
    {
      name: "Total Visits",
      visits: totalVisits,
    },
    {
      name: "Safari Visits",
      visits: safariVisits,
    },
    {
      name: "Tour Visits",
      visits: tourVisits,
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4">Page Visits Overview</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Visit Type",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 },
            }}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Number of Visits",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 },
            }}
            width={80}
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
              return [`${val.toLocaleString()} visits`, "Visits"];
            }}
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

