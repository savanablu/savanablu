// components/admin/TimePatternChart.tsx

"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TimePatternChartProps {
  hourlyData: Array<{ hour: number; count: number }>;
  dailyData: Array<{ day: string; count: number }>;
}

export default function TimePatternChart({
  hourlyData,
  dailyData,
}: TimePatternChartProps) {
  const hourlyChartData = hourlyData.map((item) => ({
    hour: `${item.hour}:00`,
    visits: item.count,
  }));

  const dailyChartData = [
    { day: "Monday", visits: dailyData.find((d) => d.day === "Monday")?.count || 0 },
    { day: "Tuesday", visits: dailyData.find((d) => d.day === "Tuesday")?.count || 0 },
    { day: "Wednesday", visits: dailyData.find((d) => d.day === "Wednesday")?.count || 0 },
    { day: "Thursday", visits: dailyData.find((d) => d.day === "Thursday")?.count || 0 },
    { day: "Friday", visits: dailyData.find((d) => d.day === "Friday")?.count || 0 },
    { day: "Saturday", visits: dailyData.find((d) => d.day === "Saturday")?.count || 0 },
    { day: "Sunday", visits: dailyData.find((d) => d.day === "Sunday")?.count || 0 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="text-sm font-semibold text-sb-cream mb-4">Visits by Hour of Day</h4>
        {hourlyChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
            No hourly data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
              <XAxis
                dataKey="hour"
                stroke="#F9F3EB"
                fontSize={10}
                tick={{ fill: "#F9F3EB", opacity: 0.8 }}
                angle={-45}
                textAnchor="end"
                height={70}
                label={{
                  value: "Hour of Day (24h)",
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
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#0F6F7C"
                strokeWidth={2}
                dot={{ fill: "#0F6F7C", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-sb-cream mb-4">Visits by Day of Week</h4>
        {dailyChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
            No daily data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
              <XAxis
                dataKey="day"
                stroke="#F9F3EB"
                fontSize={11}
                tick={{ fill: "#F9F3EB", opacity: 0.8 }}
                angle={-45}
                textAnchor="end"
                height={70}
                label={{
                  value: "Day of Week",
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
              <Bar dataKey="visits" fill="#0F6F7C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

