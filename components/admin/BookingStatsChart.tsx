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

interface BookingStatsChartProps {
  total: number;
  upcoming: number;
  confirmed: number;
  onHold: number;
}

const COLORS = ["#0F6F7C", "#10B981", "#F9735B", "#0B3C49"];

export default function BookingStatsChart({
  total,
  upcoming,
  confirmed,
  onHold,
}: BookingStatsChartProps) {
  const chartData = [
    {
      name: "Total",
      count: total,
    },
    {
      name: "Upcoming",
      count: upcoming,
    },
    {
      name: "Confirmed",
      count: confirmed,
    },
    {
      name: "On Hold",
      count: onHold,
    },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-4">Booking Statistics</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Booking Status",
              position: "insideBottom",
              offset: -10,
              style: { textAnchor: "middle", fill: "#FFFFFF", fontSize: 14, fontWeight: 600 },
            }}
          />
          <YAxis
            stroke="#FFFFFF"
            tick={{ fill: "#FFFFFF", fontWeight: 500, fontSize: 13 }}
            label={{
              value: "Number of Bookings",
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
              return [`${val} booking${val !== 1 ? 's' : ''}`, "Count"];
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

