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
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F9F3EB" opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="#F9F3EB"
          fontSize={12}
          tick={{ fill: "#F9F3EB", opacity: 0.8 }}
          label={{ 
            value: "Tour Type", 
            position: "insideBottom", 
            offset: -5,
            style: { textAnchor: "middle", fill: "#F9F3EB", opacity: 0.8, fontSize: 12 }
          }}
        />
        <YAxis
          stroke="#F9F3EB"
          fontSize={11}
          tick={{ fill: "#F9F3EB", opacity: 0.8 }}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          label={{ 
            value: "Amount (USD)", 
            angle: -90, 
            position: "insideLeft",
            style: { textAnchor: "middle", fill: "#F9F3EB", opacity: 0.8, fontSize: 12 }
          }}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0B3C49",
            border: "1px solid #F3E2C7",
            borderRadius: "8px",
            color: "#F9F3EB",
            padding: "8px 12px",
          }}
          formatter={(value: number, name: string) => {
            const formattedValue = `USD ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            return [formattedValue, name];
          }}
          labelStyle={{ marginBottom: "4px", fontWeight: 600 }}
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

