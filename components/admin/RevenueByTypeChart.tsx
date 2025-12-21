"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RevenueByTypeChartProps {
  tours: {
    bookingCount: number;
    totalRevenueUSD: number;
    totalDepositsUSD: number;
    totalBalanceUSD: number;
  };
  packages: {
    bookingCount: number;
    totalRevenueUSD: number;
    totalDepositsUSD: number;
    totalBalanceUSD: number;
  };
}

export default function RevenueByTypeChart({
  tours,
  packages,
}: RevenueByTypeChartProps) {
  const data = [
    {
      name: "Day Tours",
      revenue: Math.round(tours.totalRevenueUSD),
      advances: Math.round(tours.totalDepositsUSD),
      balances: Math.round(tours.totalBalanceUSD),
    },
    {
      name: "Packages",
      revenue: Math.round(packages.totalRevenueUSD),
      advances: Math.round(packages.totalDepositsUSD),
      balances: Math.round(packages.totalBalanceUSD),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="#F9F3EB"
          tick={{ fill: "#F9F3EB", fontWeight: 500, fontSize: 13 }}
          label={{ 
            value: "Tour Category", 
            position: "insideBottom", 
            offset: -10,
            style: { textAnchor: "middle", fill: "#F9F3EB", fontSize: 14, fontWeight: 600 }
          }}
        />
        <YAxis
          stroke="#F9F3EB"
          tick={{ fill: "#F9F3EB", fontWeight: 500, fontSize: 13 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          label={{ 
            value: "Revenue Amount (USD)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "#F9F3EB", fontSize: 14, fontWeight: 600 }
          }}
          width={90}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0F6F7C",
            border: "2px solid #F9F3EB",
            borderRadius: "8px",
            color: "#F9F3EB",
            padding: "10px 14px",
            fontWeight: 500,
          }}
          labelStyle={{ color: "#F9F3EB", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}
          itemStyle={{ color: "#F9F3EB", fontWeight: 500, fontSize: "13px" }}
          formatter={(value: number | undefined, name: string | undefined) => {
            const val = value ?? 0;
            const nameStr = name === "revenue" ? "Total Revenue" : name === "advances" ? "Advances Paid" : name === "balances" ? "Balances on Arrival" : name ?? "";
            const formattedValue = `USD ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            return [formattedValue, nameStr];
          }}
          labelFormatter={(label) => `Category: ${label}`}
        />
        <Legend
          wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
          iconType="square"
          formatter={(value) => <span style={{ color: "#F9F3EB", opacity: 0.9 }}>{value}</span>}
        />
        <Bar 
          dataKey="revenue" 
          fill="#0F6F7C" 
          name="Total Revenue"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="advances" 
          fill="#10B981" 
          name="Advances Paid"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="balances" 
          fill="#F3E2C7" 
          name="Balances on Arrival"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

