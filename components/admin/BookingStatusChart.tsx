"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BookingStatusChartProps {
  confirmed: number;
  onHold: number;
  cancelled: number;
}

const COLORS = {
  confirmed: "#10B981", // emerald-400
  onHold: "#F9735B", // sb-coral
  cancelled: "#EF4444", // red-500
};

export default function BookingStatusChart({
  confirmed,
  onHold,
  cancelled,
}: BookingStatusChartProps) {
  const data = [
    { name: "Confirmed", value: confirmed, color: COLORS.confirmed },
    { name: "On hold", value: onHold, color: COLORS.onHold },
    { name: "Cancelled", value: cancelled, color: COLORS.cancelled },
  ].filter((item) => item.value > 0);

  const total = confirmed + onHold + cancelled;

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
        No booking data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={({ name, value, percent }) =>
            `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : "0"}%)`
          }
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B3C49" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0B3C49",
            border: "1px solid #F3E2C7",
            borderRadius: "8px",
            color: "#F9F3EB",
            padding: "8px 12px",
          }}
          formatter={(value: number | undefined, name: string) => {
            const val = value ?? 0;
            const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
            return [`${val} bookings (${percentage}%)`, name];
          }}
          labelStyle={{ marginBottom: "4px", fontWeight: 600 }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ 
            color: "#F9F3EB", 
            fontSize: "12px",
            paddingTop: "16px"
          }}
          iconType="circle"
          formatter={(value) => <span style={{ color: "#F9F3EB", opacity: 0.9 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

