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
    <ResponsiveContainer width="100%" height={360}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(props: any) => {
            const name = props.name || "";
            const value = props.value || 0;
            const percent = props.percent || 0;
            const pct = (percent * 100).toFixed(0);
            const textX = props.x || 0;
            const textY = props.y || 0;
            const labelHeight = 28;
            const labelWidth = Math.max(name.length * 7, 60);
            return (
              <g>
                {/* Background rectangle for better visibility */}
                <rect
                  x={textX - labelWidth / 2}
                  y={textY - labelHeight / 2}
                  width={labelWidth}
                  height={labelHeight}
                  fill="#0B3C49"
                  fillOpacity={0.95}
                  rx={4}
                  stroke="#F9F3EB"
                  strokeWidth={1.5}
                />
                <text
                  x={textX}
                  y={textY - 6}
                  fill="#F9F3EB"
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  dominantBaseline="middle"
                >
                  {name}
                </text>
                <text
                  x={textX}
                  y={textY + 8}
                  fill="#F9F3EB"
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={500}
                  dominantBaseline="middle"
                >
                  {value} ({pct}%)
                </text>
              </g>
            );
          }}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B3C49" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0F6F7C",
            border: "2px solid #F9F3EB",
            borderRadius: "8px",
            color: "#F9F3EB",
            padding: "10px 14px",
            fontWeight: 500,
          }}
          labelStyle={{ color: "#F9F3EB", fontWeight: 600, fontSize: "13px", marginBottom: "6px" }}
          itemStyle={{ color: "#F9F3EB", fontWeight: 500 }}
          formatter={(value: number | undefined, name: string | undefined) => {
            const val = value ?? 0;
            const nameStr = name ?? "";
            const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
            return [`${val} booking${val !== 1 ? 's' : ''} (${percentage}% of total)`, nameStr];
          }}
          labelFormatter={() => `Booking Status Distribution`}
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

