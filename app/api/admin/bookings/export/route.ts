import { NextResponse } from "next/server";
import { readBookings } from "@/lib/data/bookings";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);

  // If it contains comma, quote or newline, wrap in quotes and escape quotes
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export async function GET() {
  const bookings = await readBookings();

  const headersRow = [
    "Booking ID",
    "Type",
    "Experience Slug",
    "Experience Title",
    "Date",
    "Adults",
    "Children",
    "Total USD",
    "Deposit USD",
    "Balance USD",
    "Promo Code",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Guest Notes",
    "Internal Notes",
    "Status",
    "Created At",
    "Source",
    "Payment Session ID",
  ];

  const lines: string[] = [];

  // Header
  lines.push(headersRow.map(escapeCsv).join(","));

  // Rows
  for (const b of bookings) {
    const row = [
      b.id,
      b.type,
      b.experienceSlug,
      b.experienceTitle,
      b.date,
      b.adults ?? "",
      b.children ?? "",
      b.totalUSD ?? "",
      b.depositUSD ?? "",
      b.balanceUSD ?? "",
      b.promoCode ?? "",
      b.customerName ?? "",
      b.customerEmail ?? "",
      b.customerPhone ?? "",
      b.notes ?? "",
      b.internalNotes ?? "",
      b.status ?? "",
      b.createdAt ?? "",
      b.source ?? "",
      b.sessionId ?? "",
    ];

    lines.push(row.map(escapeCsv).join(","));
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="savanablu-bookings-raw.csv"',
    },
  });
}

