// components/admin/DeviceBrowserChart.tsx

"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DeviceBrowserChartProps {
  deviceData: Array<{ device: string; count: number }>;
  browserData: Array<{ browser: string; count: number }>;
}

const DEVICE_COLORS = ["#0F6F7C", "#0B3C49", "#F9735B"];
const BROWSER_COLORS = ["#0F6F7C", "#0B3C49", "#F9735B", "#F3E2C7", "#E5EEF2"];

export default function DeviceBrowserChart({
  deviceData,
  browserData,
}: DeviceBrowserChartProps) {
  const deviceChartData = deviceData.map((item) => ({
    name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
    value: item.count,
  }));

  const browserChartData = browserData.slice(0, 5).map((item) => ({
    name: item.browser,
    value: item.count,
  }));

  const CustomTooltip = ({ active, payload, data }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum: number, item: any) => sum + item.value, 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : "0";
      return (
        <div className="bg-sb-night/95 border border-sb-cream/20 rounded-lg p-3 shadow-lg">
          <p className="text-sb-cream font-semibold">{payload[0].name}</p>
          <p className="text-sb-cream/80 text-sm">
            {payload[0].value} visits ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="text-sm font-semibold text-sb-cream mb-4">Device Types</h4>
        {deviceChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
            No device data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip data={deviceChartData} />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-sb-cream mb-4">Browsers</h4>
        {browserChartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-sb-cream/60">
            No browser data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={browserChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {browserChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip data={browserChartData} />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

