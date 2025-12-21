import { NextResponse } from "next/server";
import { getFinanceSummary } from "@/lib/finance/summary";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatMoney(value: number): string {
  return value.toFixed(2);
}

export async function GET() {
  const summary = await getFinanceSummary();

  const lines: string[] = [];

  // Summary totals
  lines.push("FINANCE SUMMARY");
  lines.push("");
  lines.push("Metric,Value (USD)");
  lines.push(`Total Bookings,${summary.totals.bookingCount}`);
  lines.push(`Total Trip Value,${formatMoney(summary.totals.totalRevenueUSD)}`);
  lines.push(`Total Advances Collected,${formatMoney(summary.totals.totalDepositsUSD)}`);
  lines.push(`Total Balances on Arrival,${formatMoney(summary.totals.totalBalanceUSD)}`);
  lines.push("");

  // By type
  lines.push("BY TYPE");
  lines.push("");
  lines.push("Type,Bookings,Trip Value,Advances,Balances");
  lines.push(
    `Day Tours,${summary.byType.tours.bookingCount},${formatMoney(summary.byType.tours.totalRevenueUSD)},${formatMoney(summary.byType.tours.totalDepositsUSD)},${formatMoney(summary.byType.tours.totalBalanceUSD)}`
  );
  lines.push(
    `Multi-day Packages,${summary.byType.packages.bookingCount},${formatMoney(summary.byType.packages.totalRevenueUSD)},${formatMoney(summary.byType.packages.totalDepositsUSD)},${formatMoney(summary.byType.packages.totalBalanceUSD)}`
  );
  lines.push("");

  // By experience
  lines.push("BY EXPERIENCE");
  lines.push("");
  lines.push("Experience,Slug,Bookings,Trip Value,Advances,Balances");
  for (const exp of summary.byExperience) {
    lines.push(
      `${escapeCsv(exp.experienceTitle)},${escapeCsv(exp.experienceSlug)},${exp.bookingCount},${formatMoney(exp.totalRevenueUSD)},${formatMoney(exp.totalDepositsUSD)},${formatMoney(exp.totalBalanceUSD)}`
    );
  }
  lines.push("");

  // By month
  lines.push("BY MONTH");
  lines.push("");
  lines.push("Month,Bookings,Trip Value,Advances,Balances");
  for (const month of summary.byMonth) {
    lines.push(
      `${escapeCsv(month.monthKey)},${month.bookingCount},${formatMoney(month.totalRevenueUSD)},${formatMoney(month.totalDepositsUSD)},${formatMoney(month.totalBalanceUSD)}`
    );
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="savanablu-finance-summary.csv"',
    },
  });
}





